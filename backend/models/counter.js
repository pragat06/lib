// File: backend/models/Counter.js

const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // The name of the counter, e.g., 'bookId'
    seq: { type: Number, default: 1000 }  // The sequence value, starting at 1000
});

const Counter = mongoose.model('Counter', CounterSchema);
module.exports = Counter;