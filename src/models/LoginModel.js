const { render } = require('ejs');
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const { JavascriptModulesPlugin } = require('webpack');
const LoginSchema = new mongoose.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.users = null
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        this.users = await LoginModel.findOne({ email: this.body.email });

        if (!this.users) {
            this.errors.push('Usuário não existe.');
            return;
        }
        if (!bcryptjs.compareSync(this.body.password, this.users.password)) {
            this.errors.push('Senha inválida');
            this.users = null
            return;
        }
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.users = await LoginModel.create(this.body);
    }

    async userExists() {
        this.users = await LoginModel.findOne({ email: this.body.email });
        if (this.users) this.errors.push('Usuário já cadastrado.')
    };

    valida() {
        this.cleanUp()
        //validação
        //email precisa ser valido
        if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido!');

        //a senha precisa ser 6 e 12 caracteres
        if (this.body.password.length < 6 || this.body.password.length > 12) {
            this.errors.push('senha deve ter entre 6 e 12 caracteres!');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = "";
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }

}

module.exports = Login;