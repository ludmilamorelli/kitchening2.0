const fs = require('fs');
const path = require('path');


module.exports = {
    index : (req,res) => {
        return res.render('home',{
            products : JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','products.json'),'utf-8'))
        })
    },
    admin : (req,res) => {
        return res.render('admin',{
            products :JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','products.json'),'utf-8'))
        })
    }
}