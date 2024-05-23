const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const faker = require('faker');

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

// Route to get all humans from the database
router.get('/',authenticateToken , async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const humans = await db.collection('humans').find({}).toArray();
        res.status(200).json(humans);
    } catch (err) {
        console.error('Error fetching humans from database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to add a human to the database
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const human = {
            name: req.body.name,
            age: req.body.age,
            occupation: req.body.occupation,
        };
        await db.collection('humans').insertOne(human);
        res.status(200).json({ message: 'Human added successfully' });
    } catch (err) {
        console.error('Error adding human to database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
