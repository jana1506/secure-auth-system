const express = require('express');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { createUser, findUserByEmail } = require('../db');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required: name, email, password, role' });
    }

    // Role must be one of the three
    const validRoles = ['admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Role must be admin, manager, or user' });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `SecureAuth:${email}`
    });

    // 4. Store user in DB
    const userId = createUser(name, email, hashedPassword, role, secret.base32);

    // 5. Generate QR code data URL
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

    // 6. Respond with success and the QR code
    res.status(201).json({
      message: 'User registered successfully. Scan the QR code with your authenticator app.',
      userId,
      qrCode: qrCodeDataURL
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;