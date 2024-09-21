const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const depositRoutes = require('./routes/depositRoutes');
const stakeRoutes = require('./routes/stakeRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/auth', authRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/stake', stakeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
