const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uri = 'mongodb+srv://babtandayana2:fgqitiace2UlTxxP@cluster0.w7qgva7.mongodb.net/';
const JWT_SECRET = 'your_jwt_secret_key';

// Function to connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        return client.db('petApp'); // Return the database instance
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        throw err; // Throw error for handling elsewhere
    }
}

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Route to get all users (for testing purposes)
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users from database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware for authenticating token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = router;
