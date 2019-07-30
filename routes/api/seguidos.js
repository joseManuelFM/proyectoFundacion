const express = require('express');
const router = express.Router();

const auth = require('./verifytoken'); // not used
const validPersona = require('../../utils/validation')

const SEGUIDORES = require('../../database/collections/seguidos');


router.get('/', async(req,res,next)=>{
    if (req.query.id == null) {
        let result = await SEGUIDORES.find({});
        res.status(200).json(result);
    }else {
        var id = req.query.id;
        let result = await SEGUIDORES.find({idpeople: id});
        if (result.length == 0) {
            res.status(300).json({errVoid:result});
            return;
        }
        res.status(200).json({seguidos:result});
    }

});

router.post('/', async(req,res,next)=>{
    var datos = req.body;
    datos["registerDate"] = new Date();
    datos["updateDate"] = new Date();
    var seguidores = new SEGUIDORES(datos);
    var result = await seguidores.save();
    res.status(200).json({seguir:result});
});


router.put("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            errId: "id no encontrado"
        });
        return;
    }
    var id = req.query.id;
    var result = await SEGUIDORES.findOne({idpeople: id});
    if (result == null) {
        res.status(300).json({errVoid:result});
        return;
    }
    var params = req.body;
    let add = result.idseller.push(params["idseller"]);
    params["idseller"] = result.idseller;
    params["updateDate"] = new Date;
    result = await SEGUIDORES.findOneAndUpdate({idpeople: id}, params);
    res.status(200).json({updateSeguir:result});


});

router.delete("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "id no encontrado"
        });
        return;
    }
    var id = req.query.id;
    var params = req.query.idseller;
    var result = await SEGUIDORES.findOne({idpeople: id});
    var seller = result.idseller;
    for (var i = 0; i < seller.length; i++) {
        if (seller[i] == params) {
            seller.splice(i, 1);
            break;
        }
    }
    result = await SEGUIDORES.findOneAndUpdate({idpeople: id}, {idseller:seller});
    res.status(200).json({deleteSeguir:result});
});

module.exports=router;
