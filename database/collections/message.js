const mongoose = require('../connect');
const Schema = mongoose.Schema;

const MESSAGE = Schema({
    idseller    : String,
    idbuyer     : String,
    messages :  Array,
    registerDate: Date,
});

const messagemodel = mongoose.model('messages',MESSAGE);

module.exports = messagemodel;
