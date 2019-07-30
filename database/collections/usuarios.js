const mongoose = require('../connect');
const Schema = mongoose.Schema;

const USER = Schema({
    idpeople    : String,
    user        : String,
    password    : String,
    updateDate  : Date,
    registerDate: Date,
});

const usermodel = mongoose.model('usuarios',USER);

module.exports = usermodel;
