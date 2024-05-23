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

// Route to get all dogs from the database
router.get('/',  async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const dogs = await db.collection('dogs').find({}).toArray();
        res.status(200).json(dogs);
    } catch (err) {
        console.error('Error fetching dogs from database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to add a dog to the database
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const dog = {
            name: req.body.name,
            breed: req.body.breed,
            age: req.body.age,
        };
        await db.collection('dogs').insertOne(dog);
        res.status(200).json({ message: 'Dog added successfully' });
    } catch (err) {
        console.error('Error adding dog to database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
