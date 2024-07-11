// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Example MongoDB model (if in separate files, like models/User.js)
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// app.use(express.static(__dirname + '/public'));

// Serve login.html for login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Handle login POST request
app.post('/login', async (req, res) => {    
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password }).exec();
        if (user) {
            res.send(`Welcome, ${username}!`);
        } else {
            res.send('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Handle registration POST request
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });

    try {
        await newUser.save();
        console.log(`User ${username} registered successfully!`);
        res.send(`User ${username} registered successfully!`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering new user');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
