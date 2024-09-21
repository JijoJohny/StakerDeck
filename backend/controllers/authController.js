const User = require('../models/User');
const bcrypt = require('bcrypt');
const { AptosClient, AptosAccount, FaucetClient,HexString } = require('aptos');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const FAUCET_URL = process.env.FAUCET_URL;
const NODE_URL = process.env.NODE_URL;
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);


const JWT_SECRET = process.env.JWT_SECRET;


 async function signup(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

    const account = new AptosAccount();
    await faucetClient.fundAccount(account.address().hex(), 10000000000);

    const publicKey = account.address().hex();
    const secretKey = Buffer.from(account.signingKey.secretKey).toString('hex');


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email,
        password: hashedPassword,
        wallet: {
            publicKey: publicKey,
            secretKey: secretKey // Store the private key securely
        }
    });

    try {
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', publicKey: publicKey });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


async function login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.log("Error during login:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = { signup, login };
