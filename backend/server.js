const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const dns = require("dns");
const fs = require("fs/promises");
const mongoose = require("mongoose");
const path = require("path");
const Razorpay = require("razorpay");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const enrollmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    profession: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    gotra: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    religion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    eventName: {
      type: String,
      default: "Jaat Samelan",
    },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
    },
    picture: {
      type: String,
      default: "",
    },
    gotra: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    authProvider: {
      type: String,
      default: "google",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const fallbackDataPath = path.join(__dirname, "data", "enrollments.json");
const fallbackPaymentDataPath = path.join(__dirname, "data", "payments.json");
const fallbackUsersDataPath = path.join(__dirname, "data", "users.json");
const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const membershipPlans = {
  yearly: {
    id: "yearly",
    name: "Exclusive Samelan Membership",
    amount: 1200000,
    currency: "INR",
    description: "1 year membership with 12 samelans and 12 coupons",
  },
  guest: {
    id: "guest",
    name: "Guest Samelan Entry",
    amount: 100000,
    currency: "INR",
    description: "1 samelan entry with 1 coupon",
  },
};

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

const createRazorpayOrder = async (order) => {
  const credentials = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      result.error?.description ||
      result.error?.reason ||
      "Razorpay rejected the order request.";
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return result;
};

const trimField = (value) => (typeof value === "string" ? value.trim() : "");

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const validateEnrollment = (body) => {
  const enrollment = {
    name: trimField(body.name),
    gotra: trimField(body.gotra),
    religion: trimField(body.religion),
    profession: trimField(body.profession),
    phoneNo: trimField(body.phoneNo),
    address: trimField(body.address),
  };

  if (
    !enrollment.name ||
    !enrollment.gotra ||
    !enrollment.religion ||
    !enrollment.profession ||
    !enrollment.phoneNo ||
    !enrollment.address
  ) {
    return { error: "Please fill name, gotra, religion, profession, phone number, and address." };
  }

  if (!/^[0-9+\-\s()]{7,20}$/.test(enrollment.phoneNo)) {
    return { error: "Please enter a valid phone number." };
  }

  return { enrollment };
};

const readFallbackEnrollments = async () => {
  try {
    const fileContent = await fs.readFile(fallbackDataPath, "utf8");
    const enrollments = JSON.parse(fileContent);
    return Array.isArray(enrollments) ? enrollments : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
};

const writeFallbackEnrollments = async (enrollments) => {
  await fs.mkdir(path.dirname(fallbackDataPath), { recursive: true });
  await fs.writeFile(fallbackDataPath, JSON.stringify(enrollments, null, 2));
};

const readFallbackPayments = async () => {
  try {
    const fileContent = await fs.readFile(fallbackPaymentDataPath, "utf8");
    const payments = JSON.parse(fileContent);
    return Array.isArray(payments) ? payments : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
};

const writeFallbackPayments = async (payments) => {
  await fs.mkdir(path.dirname(fallbackPaymentDataPath), { recursive: true });
  await fs.writeFile(fallbackPaymentDataPath, JSON.stringify(payments, null, 2));
};

const readFallbackUsers = async () => {
  try {
    const fileContent = await fs.readFile(fallbackUsersDataPath, "utf8");
    const users = JSON.parse(fileContent);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
};

const writeFallbackUsers = async (users) => {
  await fs.mkdir(path.dirname(fallbackUsersDataPath), { recursive: true });
  await fs.writeFile(fallbackUsersDataPath, JSON.stringify(users, null, 2));
};

const saveVerifiedPayment = async (payment) => {
  const payments = await readFallbackPayments();
  payments.unshift({
    _id: crypto.randomUUID(),
    ...payment,
    createdAt: new Date().toISOString(),
  });
  await writeFallbackPayments(payments);
};

const createEnrollment = async (enrollment) => {
  if (isDatabaseReady()) {
    return Enrollment.create(enrollment);
  }

  const now = new Date().toISOString();
  const fallbackEnrollment = {
    _id: crypto.randomUUID(),
    ...enrollment,
    eventName: "Jaat Samelan",
    createdAt: now,
    updatedAt: now,
  };
  const enrollments = await readFallbackEnrollments();
  enrollments.unshift(fallbackEnrollment);
  await writeFallbackEnrollments(enrollments);

  return fallbackEnrollment;
};

const saveGoogleUser = async (user) => {
  if (isDatabaseReady()) {
    return User.findOneAndUpdate(
      { googleId: user.googleId },
      { $set: user },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
  }

  const now = new Date().toISOString();
  const users = await readFallbackUsers();
  const existingUserIndex = users.findIndex((savedUser) => savedUser.googleId === user.googleId);
  const fallbackUser = {
    _id: existingUserIndex >= 0 ? users[existingUserIndex]._id : crypto.randomUUID(),
    ...user,
    createdAt: existingUserIndex >= 0 ? users[existingUserIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = fallbackUser;
  } else {
    users.unshift(fallbackUser);
  }

  await writeFallbackUsers(users);
  return fallbackUser;
};

const findGoogleUser = async (googleId) => {
  if (isDatabaseReady()) {
    return User.findOne({ googleId }).lean();
  }

  const users = await readFallbackUsers();
  return users.find((savedUser) => savedUser.googleId === googleId) || null;
};

const verifyGoogleCredential = async (credential) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    return null;
  }

  return payload;
};

const sendAuthUser = (res, status, message, user) => {
  res.status(status).json({
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      gotra: user.gotra,
    },
  });
};

const listEnrollments = async () => {
  if (isDatabaseReady()) {
    return Enrollment.find().sort({ createdAt: -1 }).lean();
  }

  const enrollments = await readFallbackEnrollments();
  return enrollments.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
};

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    storage: isDatabaseReady() ? "mongodb" : "local file",
    razorpay: razorpay ? "configured" : "not configured",
    googleAuth: googleClient ? "configured" : "not configured",
  });
});

app.post("/api/auth/google-signup", async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(503).json({
        message: "Google sign up is not configured. Please add GOOGLE_CLIENT_ID in backend .env.",
      });
    }

    const credential = trimField(req.body.credential);
    const gotra = trimField(req.body.gotra);
    const profileName = trimField(req.body.name);

    if (!credential || !gotra) {
      return res.status(400).json({ message: "Google credential and gotra are required." });
    }

    const payload = await verifyGoogleCredential(credential);

    if (!payload) {
      return res.status(400).json({ message: "Unable to verify Google account details." });
    }

    const user = await saveGoogleUser({
      googleId: payload.sub,
      name: profileName || payload.name || payload.email,
      email: payload.email,
      picture: payload.picture || "",
      gotra,
      authProvider: "google",
    });

    sendAuthUser(res, 201, "Google sign up completed successfully.", user);
  } catch (error) {
    console.error("Google sign up error:", error);
    res.status(401).json({ message: "Google sign up failed. Please try again." });
  }
});

app.post("/api/auth/google-signin", async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(503).json({
        message: "Google sign in is not configured. Please add GOOGLE_CLIENT_ID in backend .env.",
      });
    }

    const credential = trimField(req.body.credential);

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required." });
    }

    const payload = await verifyGoogleCredential(credential);

    if (!payload) {
      return res.status(400).json({ message: "Unable to verify Google account details." });
    }

    let user = await findGoogleUser(payload.sub);

    if (!user) {
      user = await saveGoogleUser({
        googleId: payload.sub,
        name: payload.name || payload.email,
        email: payload.email,
        picture: payload.picture || "",
        gotra: "Not provided",
        authProvider: "google",
      });
    }

    sendAuthUser(res, 200, "Google sign in completed successfully.", user);
  } catch (error) {
    console.error("Google sign in error:", error);
    res.status(401).json({ message: "Google sign in failed. Please try again." });
  }
});

app.post("/api/payments/razorpay-order", async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        message: "Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env.",
      });
    }

    const plan = membershipPlans[req.body.planId];

    if (!plan) {
      return res.status(400).json({ message: "Invalid membership plan selected." });
    }

    const order = await createRazorpayOrder({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `${plan.id}_${Date.now()}`,
      notes: {
        planId: plan.id,
        planName: plan.name,
      },
    });

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    const statusCode = error.statusCode === 401 ? 503 : 500;
    const message =
      error.statusCode === 401
        ? "Razorpay authentication failed. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env."
        : "Unable to start Razorpay payment right now.";

    res.status(statusCode).json({ message });
  }
});

app.post("/api/payments/razorpay-verify", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: "Razorpay verification is not configured." });
    }

    const { planId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const plan = membershipPlans[planId];

    if (!plan || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification details." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    await saveVerifiedPayment({
      planId: plan.id,
      planName: plan.name,
      amount: plan.amount,
      currency: plan.currency,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "verified",
    });

    res.json({ message: "Payment verified successfully." });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    res.status(500).json({ message: "Unable to verify payment right now." });
  }
});

app.post("/api/enrollments", async (req, res) => {
  try {
    const { error, enrollment } = validateEnrollment(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const savedEnrollment = await createEnrollment(enrollment);

    res.status(201).json({
      message: "Enrollment submitted successfully.",
      enrollment: savedEnrollment,
    });
  } catch (error) {
    console.error("Create enrollment error:", error);
    res.status(500).json({ message: "Unable to submit enrollment right now." });
  }
});

app.get("/api/enrollments", async (req, res) => {
  try {
    const enrollments = await listEnrollments();

    res.json({ enrollments });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    res.status(500).json({ message: "Unable to fetch enrollments right now." });
  }
});

const PORT = process.env.PORT || 5000;

if (process.env.MONGO_URI) {
  const mongoDnsServers = process.env.MONGO_DNS_SERVERS
    ? process.env.MONGO_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
    : [];
  const nodeDnsServers = dns.getServers();

  if (mongoDnsServers.length > 0) {
    dns.setServers(mongoDnsServers);
  } else if (
    process.env.MONGO_URI.startsWith("mongodb+srv://") &&
    nodeDnsServers.length > 0 &&
    nodeDnsServers.every((server) => server === "127.0.0.1" || server === "::1")
  ) {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  }

  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      console.warn("Continuing with local JSON file storage.");
    });
} else {
  console.warn("MONGO_URI is not configured. Continuing with local JSON file storage.");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
