import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { OAuth2Client } from 'google-auth-library';

const initialEnrollments = [
  {
    _id: '9036c67c-317e-4dfd-a1bc-7c9a135b3017',
    name: 'dhruv popli',
    profession: 'worker',
    gotra: '',
    phoneNo: '09911921125',
    address: 'shani mandir',
    eventName: 'Jaat Samelan',
    createdAt: '2026-05-18T09:55:31.921Z',
    updatedAt: '2026-05-18T09:55:31.921Z'
  }
];

const localEnrollments = [...initialEnrollments];
const localUsers = [];
const localPayments = [];

const membershipPlans = {
  yearly: {
    id: 'yearly',
    name: 'Exclusive Samelan Membership',
    amount: 1200000,
    currency: 'INR',
    description: '1 year membership with 12 samelans and 12 coupons'
  },
  guest: {
    id: 'guest',
    name: 'Guest Samelan Entry',
    amount: 100000,
    currency: 'INR',
    description: '1 samelan entry with 1 coupon'
  }
};

const enrollmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    profession: { type: String, required: true, trim: true, maxlength: 120 },
    gotra: { type: String, required: true, trim: true, maxlength: 120 },
    religion: { type: String, required: true, trim: true, maxlength: 120 },
    phoneNo: { type: String, required: true, trim: true, maxlength: 30 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    eventName: { type: String, default: 'Jaat Samelan' }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    picture: { type: String, default: '' },
    gotra: { type: String, required: true, trim: true, maxlength: 120 },
    authProvider: { type: String, default: 'google' }
  },
  { timestamps: true }
);

const paymentSchema = new mongoose.Schema(
  {
    planId: String,
    planName: String,
    amount: Number,
    currency: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: String
  },
  { timestamps: true }
);

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

let mongoConnectionPromise = null;

const trimField = value => (typeof value === 'string' ? value.trim() : '');

const sendJson = (res, status, data) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

const readBody = req =>
  new Promise(resolve => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });

const connectMongo = async () => {
  if (!process.env.MONGO_URI) {
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
  }

  await mongoConnectionPromise;
  return true;
};

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const getGoogleClient = () =>
  process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

const getRazorpay = () =>
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      })
    : null;

const validateEnrollment = body => {
  const enrollment = {
    name: trimField(body.name),
    gotra: trimField(body.gotra),
    religion: trimField(body.religion),
    profession: trimField(body.profession),
    phoneNo: trimField(body.phoneNo),
    address: trimField(body.address)
  };

  if (
    !enrollment.name ||
    !enrollment.gotra ||
    !enrollment.religion ||
    !enrollment.profession ||
    !enrollment.phoneNo ||
    !enrollment.address
  ) {
    return { error: 'Please fill name, gotra, religion, profession, phone number, and address.' };
  }

  if (!/^[0-9+\-\s()]{7,20}$/.test(enrollment.phoneNo)) {
    return { error: 'Please enter a valid phone number.' };
  }

  return { enrollment };
};

const verifyGoogleCredential = async credential => {
  const googleClient = getGoogleClient();

  if (!googleClient) {
    return null;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    return null;
  }

  return payload;
};

const sendAuthUser = (res, status, message, user) => {
  sendJson(res, status, {
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      gotra: user.gotra
    }
  });
};

const saveGoogleUser = async user => {
  if (isDatabaseReady()) {
    return User.findOneAndUpdate(
      { googleId: user.googleId },
      { $set: user },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
  }

  const now = new Date().toISOString();
  const existingUserIndex = localUsers.findIndex(savedUser => savedUser.googleId === user.googleId);
  const fallbackUser = {
    _id: existingUserIndex >= 0 ? localUsers[existingUserIndex]._id : crypto.randomUUID(),
    ...user,
    createdAt: existingUserIndex >= 0 ? localUsers[existingUserIndex].createdAt : now,
    updatedAt: now
  };

  if (existingUserIndex >= 0) {
    localUsers[existingUserIndex] = fallbackUser;
  } else {
    localUsers.unshift(fallbackUser);
  }

  return fallbackUser;
};

const findGoogleUser = async googleId => {
  if (isDatabaseReady()) {
    return User.findOne({ googleId }).lean();
  }

  return localUsers.find(savedUser => savedUser.googleId === googleId) || null;
};

const handleHealth = async (req, res) => {
  await connectMongo().catch(() => false);

  sendJson(res, 200, {
    status: 'ok',
    storage: isDatabaseReady() ? 'mongodb' : 'temporary memory',
    razorpay: getRazorpay() ? 'configured' : 'not configured',
    googleAuth: getGoogleClient() ? 'configured' : 'not configured'
  });
};

const handleGoogleSignup = async (req, res, body) => {
  if (!getGoogleClient()) {
    sendJson(res, 503, {
      message: 'Google sign up is not configured. Add GOOGLE_CLIENT_ID in Vercel environment variables.'
    });
    return;
  }

  const credential = trimField(body.credential);
  const gotra = trimField(body.gotra);

  if (!credential || !gotra) {
    sendJson(res, 400, { message: 'Google credential and gotra are required.' });
    return;
  }

  const payload = await verifyGoogleCredential(credential);

  if (!payload) {
    sendJson(res, 400, { message: 'Unable to verify Google account details.' });
    return;
  }

  await connectMongo().catch(() => false);

  const user = await saveGoogleUser({
    googleId: payload.sub,
    name: payload.name || payload.email,
    email: payload.email,
    picture: payload.picture || '',
    gotra,
    authProvider: 'google'
  });

  sendAuthUser(res, 201, 'Google sign up completed successfully.', user);
};

const handleGoogleSignin = async (req, res, body) => {
  if (!getGoogleClient()) {
    sendJson(res, 503, {
      message: 'Google sign in is not configured. Add GOOGLE_CLIENT_ID in Vercel environment variables.'
    });
    return;
  }

  const credential = trimField(body.credential);

  if (!credential) {
    sendJson(res, 400, { message: 'Google credential is required.' });
    return;
  }

  const payload = await verifyGoogleCredential(credential);

  if (!payload) {
    sendJson(res, 400, { message: 'Unable to verify Google account details.' });
    return;
  }

  await connectMongo().catch(() => false);

  let user = await findGoogleUser(payload.sub);

  if (!user) {
    user = await saveGoogleUser({
      googleId: payload.sub,
      name: payload.name || payload.email,
      email: payload.email,
      picture: payload.picture || '',
      gotra: 'Not provided',
      authProvider: 'google'
    });
  }

  sendAuthUser(res, 200, 'Google sign in completed successfully.', user);
};

const createEnrollment = async enrollment => {
  await connectMongo().catch(() => false);

  if (isDatabaseReady()) {
    return Enrollment.create(enrollment);
  }

  const now = new Date().toISOString();
  const fallbackEnrollment = {
    _id: crypto.randomUUID(),
    ...enrollment,
    eventName: 'Jaat Samelan',
    createdAt: now,
    updatedAt: now
  };
  localEnrollments.unshift(fallbackEnrollment);
  return fallbackEnrollment;
};

const listEnrollments = async () => {
  await connectMongo().catch(() => false);

  if (isDatabaseReady()) {
    return Enrollment.find().sort({ createdAt: -1 }).lean();
  }

  return [...localEnrollments].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
};

const handleCreateEnrollment = async (req, res, body) => {
  const { error, enrollment } = validateEnrollment(body);

  if (error) {
    sendJson(res, 400, { message: error });
    return;
  }

  const savedEnrollment = await createEnrollment(enrollment);

  sendJson(res, 201, {
    message: 'Enrollment submitted successfully.',
    enrollment: savedEnrollment
  });
};

const handleListEnrollments = async (req, res) => {
  const enrollments = await listEnrollments();
  sendJson(res, 200, { enrollments });
};

const handleRazorpayOrder = async (req, res, body) => {
  const razorpay = getRazorpay();

  if (!razorpay) {
    sendJson(res, 503, {
      message: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.'
    });
    return;
  }

  const plan = membershipPlans[body.planId];

  if (!plan) {
    sendJson(res, 400, { message: 'Invalid membership plan selected.' });
    return;
  }

  const order = await razorpay.orders.create({
    amount: plan.amount,
    currency: plan.currency,
    receipt: `${plan.id}_${Date.now()}`,
    notes: {
      planId: plan.id,
      planName: plan.name
    }
  });

  sendJson(res, 200, {
    keyId: process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    plan
  });
};

const handleRazorpayVerify = async (req, res, body) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    sendJson(res, 503, { message: 'Razorpay verification is not configured.' });
    return;
  }

  const { planId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  const plan = membershipPlans[planId];

  if (!plan || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    sendJson(res, 400, { message: 'Missing payment verification details.' });
    return;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    sendJson(res, 400, { message: 'Payment verification failed.' });
    return;
  }

  await connectMongo().catch(() => false);

  const payment = {
    planId: plan.id,
    planName: plan.name,
    amount: plan.amount,
    currency: plan.currency,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    status: 'verified'
  };

  if (isDatabaseReady()) {
    await Payment.create(payment);
  } else {
    localPayments.unshift({
      _id: crypto.randomUUID(),
      ...payment,
      createdAt: new Date().toISOString()
    });
  }

  sendJson(res, 200, { message: 'Payment verified successfully.' });
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const path = req.url.split('?')[0].replace(/^\/api/, '') || '/';

  try {
    const body = req.method === 'POST' ? await readBody(req) : {};

    if (req.method === 'GET' && path === '/health') {
      await handleHealth(req, res);
      return;
    }

    if (req.method === 'POST' && path === '/auth/google-signup') {
      await handleGoogleSignup(req, res, body);
      return;
    }

    if (req.method === 'POST' && path === '/auth/google-signin') {
      await handleGoogleSignin(req, res, body);
      return;
    }

    if (req.method === 'GET' && path === '/enrollments') {
      await handleListEnrollments(req, res);
      return;
    }

    if (req.method === 'POST' && path === '/enrollments') {
      await handleCreateEnrollment(req, res, body);
      return;
    }

    if (req.method === 'POST' && path === '/payments/razorpay-order') {
      await handleRazorpayOrder(req, res, body);
      return;
    }

    if (req.method === 'POST' && path === '/payments/razorpay-verify') {
      await handleRazorpayVerify(req, res, body);
      return;
    }

    sendJson(res, 404, { message: 'API route not found.' });
  } catch (error) {
    console.error('API error:', error);
    sendJson(res, 500, { message: 'Server error. Please try again.' });
  }
}
