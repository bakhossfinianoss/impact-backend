const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    language: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    text: { type: String, required: true }
});

module.exports = mongoose.model('Content', contentSchema, 'insurance');
