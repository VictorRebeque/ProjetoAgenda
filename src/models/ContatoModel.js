const mongoose = require('mongoose');
const validator = require('validator');

const contatoSchema = new mongoose.Schema({
    nome: { type: String, require: true, default: '' },
    sobrenome: { type: String, require: false, default: '' },
    email: { type: String, require: false, default: '' },
    telefone: { type: String, require: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('contato', contatoSchema);

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
};

Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return;
    const user = await ContatoModel.findById(id);
    return user
};
Contato.prototype.register = async function () {
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body)
};

Contato.prototype.valida = function () {
    this.cleanUp()
    //validação
    //email precisa ser valido
    if (!this.body.email && validator.isEmail(this.body.email)) this.errors.push('Email inválido!');
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
    if (!(this.body.email && this.body.telefone)) this.errors.push('Ao menos um contato deve ser cadastrado: e-mail ou telefone.');
};

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = "";
        };
    };

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
        criadoEm: this.body.criadoEm,
    };
};

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

//metodos estáticos
Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
};

Contato.buscaContatos = async function () {
    const contatos = await ContatoModel.find()
        .sort({ criadoEm: -1 });
    return contatos;
};

Contato.delete = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({ _id: id });
    return contato;
};

module.exports = Contato;