const mongoose = require('../connect');
const Schema = mongoose.Schema;

const QUOTES = Schema({
    idquotes    : String,
    idseller    : String,
    idbuyer     : String,
    location    : String,
    product     : String,
    quantity    : Number,
    price       : Number,
    updateDate  : Date,
    createDate  : Date
});

const quotesmodel = mongoose.model('citas',QUOTES);

module.exports = quotesmodel;
