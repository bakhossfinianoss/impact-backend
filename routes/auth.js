require('dotenv').config(); // Load environment variables
const express = require('express');
const User = require('../Users');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const contentController = require('../controllers/contentController');
const router = express.Router();

const app = express();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Use an environment variable for the JWT secret
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Route to create content
router.put('/content', contentController.updateContent);

// Route to get content by language and category
router.get('/content/:language/:category', contentController.getContent);


// Route to send email using SMTP (info@impactco.ca)
router.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body; // Get email, subject, and message from form

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ionos.com', // IONOS SMTP host
      port: 587, // TLS port
      secure: false, // Use TLS (secure must be false for port 587)
      auth: {
        user: 'info@impactco.ca', // Your authenticated email
        pass: 'Testing!123SSSSS12345', // Your email password
      },
      tls: {
        ciphers: 'SSLv3', // Ensure the TLS connection
      }
    });

    let mailOptions = {
      from: 'info@impactco.ca',  // Your authenticated IONOS email (sender)
      to: 'info@impactco.ca',    // Your own email where you want to receive submissions
      replyTo: email,            // User's email from the form (to allow replies)
      subject: `New Message: ${subject}`, // Subject, could include the form's subject
      text: `Message from ${email}:\n\n${message}`, // Message body with user's email and message
    };

    await transporter.sendMail(mailOptions); // Send the email
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);  // Log the full error for debugging
    res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
  }
});


router.post('/renewal-send-email', async (req, res) => {
  const { fullName, email, phoneNumber, renewalDate, moreInfo, subject } = req.body; // Get email, subject, and message from form

  if (!fullName || !email || !phoneNumber || !renewalDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ionos.com', // IONOS SMTP host
      port: 587, // TLS port
      secure: false, // Use TLS (secure must be false for port 587)
      auth: {
        user: 'info@impactco.ca', // Your authenticated email
        pass: 'Testing!123SSSSS12345', // Your email password
      },
      tls: {
        ciphers: 'SSLv3', // Ensure the TLS connection
      }
    });

    let mailOptions = {
      from: 'info@impactco.ca',  // Your authenticated IONOS email (sender)
      to: 'info@impactco.ca',    // Your own email where you want to receive submissions
      replyTo: email,            // User's email from the form (to allow replies)
      subject: `New Message: ${subject}`, // Subject, could include the form's subject
      text: `Message from ${email}:\n\n${phoneNumber}:\n\n${renewalDate}:\n\n${moreInfo}`, // Message body with user's email and message
    };

    await transporter.sendMail(mailOptions); // Send the email
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);  // Log the full error for debugging
    res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
  }
});

module.exports = router;
