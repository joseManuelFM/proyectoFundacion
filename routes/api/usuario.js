const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const auth = require('./verifytoken'); //not used
const USER = require('../../database/collections/usuarios');

router.get('/', async(req,res,next)=>{
    let result = await USER.find({});
    res.status(200).json(result);
});

router.delete("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "id no encontrado"
        });
        return;
    }
    var result = await USER.remove({_id: req.query.id});
    res.status(200).json(result);
});

router.post('/login', async(req,res,next)=>{
    let user = await USER.find({user:req.body.user});
    if(user.length > 0){
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(result){
                const token=jwt.sign({
                    user:user[0].user,
                    id:user[0]._id
                }, process.env.JWT_KEY || "password",{expiresIn:"1h"});
                res.status(200).json({
                    //message:"Autenticación exitosa",
                    token:token,
                    user: user
                });
            }else{
                res.status(401).json({errPass:"Password incorrecto"});
            }
        });
    }else{
        res.status(401).json({errUser:"Usuario incorrecto"});
    }
});
module.exports=router;
