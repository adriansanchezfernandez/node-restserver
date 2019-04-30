const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "el nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "el correo es necesario"]
    },
    password: {
        type: String,
        required: [true, "la contraseña es obligatoria"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    google: {
        type: Boolean,
        default: false,
        required: true
    }
});

//para no devolver nunca la contraseña
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject
}

usuarioSchema.plugin(uniqueValidator, '{PATH} debe de ser unico')

module.exports = mongoose.model('Usuario', usuarioSchema);