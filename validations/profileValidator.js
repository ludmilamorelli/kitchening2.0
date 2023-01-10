const {check, body} = require('express-validator');
const users = require('../data/users.json');
const bcrypt = require('bcryptjs'); 

module.exports = [
    check('name')
    .notEmpty().withMessage('El nombre es obligatorio'),

    body('passOld')
    .custom((value,{req}) => {
        if(value != ""){
            let user = users.find(user => user.email === req.body.email && bcrypt.compareSync(value, user.pass))
            if(user){
                return true
            }else{
                return false
            }
        }
        return true
    }).withMessage('Contraseña incorrecta'),

    check('pass')
    .custom((value,{req}) => {
        if(value != ""){
            
            if(value.length >= 6 && value.length <= 12){
                return true
            }else{
                return false
            }
        }
        return true
    }).withMessage('La contraseña debe tener un mínimo de 6 y un máximo de 12 caracteres'),

    body('pass2')
    .custom((value,{req}) => {
        if(value !== req.body.pass && value.length != 0){
            return false
        }
        return true
    }).withMessage('La verificación de la contraseña no coincide'),


]