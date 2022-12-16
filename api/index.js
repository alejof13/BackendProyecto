'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT ||3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ProyectoBackend', (err,res) =>{
    if(err){
        throw err;
    }else{
        console.log("Conexion a base de datos correcta");
        app.listen(port,function(){
            console.log("Servidor api rest funciona");
        } )
    }

});