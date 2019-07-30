const mongoose = require('../connect');
const Schema = mongoose.Schema;

const SEGUIDORES = Schema({
    idpeople: String,
    idseller : Array,
    registerDate : Date,
    updateDate : Date
});

var seguidoresmodel = mongoose.model('seguidores',SEGUIDORES);

module.exports = seguidoresmodel;
