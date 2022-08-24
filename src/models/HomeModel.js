const mongoose = require('mongoose');
const { JavascriptModulesPlugin } = require('webpack');
const HomeSchema = new mongoose.Schema({
    titulo: { type: String, require: true },
    descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

module.exports = HomeModel;