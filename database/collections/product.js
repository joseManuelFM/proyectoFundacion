const mongoose = require('../connect');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    title: String,
    image: String,
    price: Number,
    quantity: Number,
    category: String,
    description: String,
    idpeople: String,
    registerDate: Date,
    updateDate: Date
})

module.exports = mongoose.model('products', ProductSchema);
