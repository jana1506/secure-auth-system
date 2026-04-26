require('dotenv').config();
const express = require('express');
const { authenticateToken, authorizeRole } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Secure Auth System is running' });
});

// Protected routes
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, this is your dashboard.` });
});

app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Profile page for ${req.user.email}`, user: req.user });
});

app.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

app.get('/manager', authenticateToken, authorizeRole('manager'), (req, res) => {
  res.json({ message: 'Welcome Manager!' });
});

app.get('/user', authenticateToken, authorizeRole('user'), (req, res) => {
  res.json({ message: 'Welcome User!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
