require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());   // parse JSON request bodies
app.use(express.static('public'));  // serve static files
// Use the authentication routes
app.use('/auth', authRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Secure Auth System is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});