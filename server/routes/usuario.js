const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore')

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)


    // se puden meter condiciones dentro de usuario.find
    //Usuario.find({google:true}), te devolveria solo los que tiene google true

    //para hacer filtros(por ejemplo nombre y email)
    //Usuario.find({},'nombre email)
    Usuario.find({ estado: true }, 'nombre email')
        //salta los primeros 5 resultados
        .skip(desde)
        //solo te muestra 5
        .limit(limite)
        //lo ejecuta
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                })
            })
        })

})

app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //para encrpitarla con el bcrypt
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }

        // usuarioDB.password = null,
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });


})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    //para seleccionar con underscore las propiedades que si tienen que pasar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // estas dos propiedades no deberian actualziarse, pero se hace mejor con el metodo de underscore.pick
    // delete body.password;
    // delete body.google

    // el tercer parametro son las opciones
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //con esta forma te lo cargas de todos los lados
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    // de esta forma se mantiene el registro pero actualzia su estado a false, filtrando por estado:true obtienes el lsitado sin este eliminado

    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                err: { message: "usuario no encontrado" }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

module.exports = app;