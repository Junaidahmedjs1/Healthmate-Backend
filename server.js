require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/files', require('./src/routes/files'));
app.use('/api/ai', require('./src/routes/ai'));

app.get('/', (req, res) => res.send({ ok: true, message: 'HealthMate backend running' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
