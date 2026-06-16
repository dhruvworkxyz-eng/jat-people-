module.exports = async (req, res) => {
  const backend = await import('../frontend/api/backend.js');
  return backend.default(req, res);
};
