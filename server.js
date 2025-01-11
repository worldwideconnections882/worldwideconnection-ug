const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'joneshussmax@gmail.com',
        pass: 'your-gmail-app-password' // You'll need to generate this
    }
});

// Twilio configuration
const twilioClient = twilio(
    'your_twilio_account_sid',
    'your_twilio_auth_token'
);

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Notification endpoints
app.post('/api/notify/signup', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Send email
        await transporter.sendMail({
            from: 'joneshussmax@gmail.com',
            to: 'joneshussmax@gmail.com',
            subject: 'New User Signup',
            text: `New signup from ${name} (${email})`
        });

        // Send SMS
        await twilioClient.messages.create({
            body: `New signup: ${name} (${email})`,
            to: '+256775516473',
            from: 'your_twilio_phone_number'
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({ error: 'Notification failed' });
    }
});

app.post('/api/notify/login', async (req, res) => {
    const { email } = req.body;

    try {
        // Send email
        await transporter.sendMail({
            from: 'joneshussmax@gmail.com',
            to: 'joneshussmax@gmail.com',
            subject: 'New User Login',
            text: `New login from ${email}`
        });

        // Send SMS
        await twilioClient.messages.create({
            body: `New login: ${email}`,
            to: '+256775516473',
            from: 'your_twilio_phone_number'
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({ error: 'Notification failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view your website`);
}); 