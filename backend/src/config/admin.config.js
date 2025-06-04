const adminConfig = {
  // This should be changed to a secure code in production and stored in environment variables
  ADMIN_REGISTRATION_CODE: process.env.ADMIN_REGISTRATION_CODE || 'admin123',
};

module.exports = adminConfig; 