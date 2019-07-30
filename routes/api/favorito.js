const express = require('express');
const router = express.Router();

const auth = require('./verifytoken'); // not used
const validPersona = require('../../utils/validation')

const FAVORITO = require('../../database/collections/favorites');


router.get('/', async(req,res,next)=>{
    if (req.query.id == null) {
        let result = await FAVORITO.find({});
        res.status(200).json(result);
    }else {
        var id = req.query.id;
        let result = await FAVORITO.find({idpeople: id});
        if (result.length == 0) {
            res.status(300).json({errVoid:result});
            return;
        }
        res.status(200).json({favorite:result});
    }

});

router.post('/', async(req,res,next)=>{
    var datos = req.body;
    datos["registerDate"] = new Date();
    datos["updateDate"] = new Date();
    var favorito = new FAVORITO(datos);
    var result = await favorito.save();
    res.status(200).json({favorite:result});
});


router.put("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            errId: "id no encontrado"
        });
        return;
    }
    var id = req.query.id;
    var result = await FAVORITO.findOne({idpeople: id});
    if (result == null) {
        res.status(300).json({errVoid:result});
        return;
    }
    var params = req.body;
    let add = result.idproduct.push(params["idproduct"]);
    params["idproduct"] = result.idproduct;
    params["updateDate"] = new Date;
    result = await FAVORITO.findOneAndUpdate({idpeople: id}, params);
    res.status(200).json({updateFavorite:result});


});

router.delete("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "id no encontrado"
        });
        return;
    }
    var id = req.query.id;
    var params = req.query.idproduct;
    var result = await FAVORITO.findOne({idpeople: id});
    var product = result.idproduct;
    for (var i = 0; i < product.length; i++) {
        if (product[i] == params) {
            product.splice(i, 1);
            break;
        }
    }
    result = await FAVORITO.findOneAndUpdate({idpeople: id}, {idproduct:product});
    res.status(200).json({deleteFavorite:result});
});

module.exports=router;
