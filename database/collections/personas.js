const mongoose = require('../connect');
const Schema = mongoose.Schema;

const PERSONA = Schema({
    name : String,
    email : String,
    phone : Number,
    avatar : String,
        //location
    street: String,
    lat : String,
    lon : String,
    qSeller: Array,
    qBuyer: Array,
    registerDate : Date,
    updateDate : Date
});

var personamodel = mongoose.model('personas',PERSONA);

module.exports = personamodel;
