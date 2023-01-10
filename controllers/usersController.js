const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const users = require('../data/users.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    register : (req,res) => res.render('register'),
    processRegister : (req,res) => {
        let errors = validationResult(req);
        
        if(errors.isEmpty()){
            const {name, email, pass} = req.body;
            let user = {
                id : users.length > 0 ? users[users.length - 1].id + 1 : 1,
                name : name.trim(),
                email : email.trim(),
                pass : bcrypt.hashSync(pass.trim(),10),
                rol : 'user',
                avatar : 'avatar_default.png'
            }
            users.push(user);
            fs.writeFileSync(path.join(__dirname, '..','data','users.json'),JSON.stringify(users,null,2),'utf-8');

            req.session.userLogin = {
                id : user.id,
                name : user.name,
                avatar : user.avatar,
                rol : user.rol
            }
            return res.redirect('/')
        }else{
            return res.render('register',{
                old : req.body,
                errors : errors.mapped()
            })
        }
    },
    login : (req,res) => res.render('login'),
    processLogin : (req,res) => {
        let errors = validationResult(req);
        
        if(errors.isEmpty()){
            let user = users.find(user => user.email === req.body.email.trim());

            req.session.userLogin = {
                id : user.id,
                name : user.name,
                avatar : user.avatar,
                rol : user.rol
            }

            if(req.body.recordar){
                res.cookie("kitcheningLogin", req.session.userLogin, {maxAge:1000 * 60})
            }
            res.redirect('/')

        }else{
            return res.render('login',{
                errors : errors.mapped()
            })
        }
    },
    profile : (req,res) => {
        res.render('profile',{
            user : users.find(user => user.id === +req.session.userLogin.id)
        })
    },
    update : (req,res) => {
        let errors = validationResult(req)
        return res.send(errors)
    },
    logout : (req,res) => {
        req.session.destroy();
        return res.redirect('/')
    }
}