const mongoose = require('../connect');
const Schema = mongoose.Schema;

const FAVORITO = Schema({
    name : String,
    idpeople: String,
    idproduct : Array,
    registerDate : Date,
    updateDate : Date
});

var favoritomodel = mongoose.model('favoritos',FAVORITO);

module.exports = favoritomodel;
