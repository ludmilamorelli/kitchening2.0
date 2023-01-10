const fs = require('fs');
const path = require('path');
const capitalize = require('../utils/capitalize');
const products = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','products.json'),'utf-8'))
const categories = require('../data/categories.json');

const {validationResult} = require('express-validator');



module.exports = {
    search : (req,res) => {
        
    },
    detail : (req,res) => {
        
        return res.render('productDetail',{
            product : products.find(producto => producto.id === +req.params.id)
        })
    },
    add : (req,res) => {
        return res.render('productAdd',{
            categories,
            capitalize
        })
    },
    store : (req,res) => {
        let errors = validationResult(req);
        if (req.fileValidationError) {
            let image = {
                param : 'image',
                msg: req.fileValidationError,
            }
            errors.errors.push(image)
        }
        if(errors.isEmpty()){
            const {name, description, category} = req.body;
            let photos = [];
            req.files.forEach(image => {
                photos.push(image.filename)
            });
            let product = {
                id : products.length != 0 ? products[products.length - 1].id + 1 : 1,
                name : name.trim(),
                description : description.trim(),
                category,
                photos
            }
            products.push(product);
            fs.writeFileSync(path.join(__dirname,'..','data','products.json'),JSON.stringify(products,null,2),'utf-8');
            res.redirect('/admin')
        }else{
          return res.render('productAdd',{
              categories,
              errors : errors.mapped(),
              old : req.body
          })
        }
    },
    edit : (req,res) => {
        return res.render('productEdit',{
            categories,
            capitalize,
            product :products.find(producto => producto.id === +req.params.id)
        })
    },
    update : (req,res) => {
        let errors = validationResult(req);
        let product = products.find(product => product.id === +req.params.id);
        let photos = [];

        if (req.fileValidationError) {
            let image = {
                param : 'image',
                msg: req.fileValidationError,
            }
            errors.errors.push(image)
        }
        if(errors.isEmpty()){
            const {name, description, category} = req.body;

            
            if(req.files.length != 0){
                req.files.forEach(image => {
                    photos.push(image.filename)
                });
                product.photos.forEach(photo => {
                    if(fs.existsSync(path.join(__dirname,'..','public','images','products',photo))){
                        fs.unlinkSync(path.join(__dirname,'..','public','images','products',photo))
                    }
                })
            }
         
            let productEdit = {
                id : +req.params.id,
                name : name.trim(),
                description : description.trim(),
                category,
                photos : req.files.length != 0 ? photos : product.photos
            }

            let modificados = products.map(product => product.id === +req.params.id ? productEdit : product)

            fs.writeFileSync(path.join(__dirname,'..','data','products.json'),JSON.stringify(modificados,null,2),'utf-8');
            res.redirect('/admin')

        }else{
          return res.render('productEdit',{
              categories,
              product,
              errors : errors.mapped(),
              old : req.body
          })
        }
    },
    destroy : (req,res) => {
        let product = products.find(product => product.id === +req.params.id);
        product.photos.forEach(photo => {
            if(fs.existsSync(path.join(__dirname,'..','public','images','products',photo))){
                fs.unlinkSync(path.join(__dirname,'..','public','images','products',photo))
            }
        })
        let eternales = products.filter(product => product.id !== +req.params.id);

        fs.writeFileSync(path.join(__dirname,'..','data','products.json'),JSON.stringify(eternales,null,2),'utf-8');
        res.redirect('/admin')
    }
}