const express = require('express');
const router = express.Router();

const MESSAGE = require('../../database/collections/message');


router.get('/', async(req,res,next)=>{
    let result = await MESSAGE.find({});
    var datos = req.query;
    if (result.length == 0 || datos.idseller == null) {
        res.status(200).json({list:result});
        return;
    }


    for (var i = 0; i < result.length; i++ ){
        //res.status(200).json(result[i].idseller);

        if ((result[i].idseller == datos.idseller && result[i].idbuyer == datos.idbuyer) || (result[i].idseller == datos.idbuyer && result[i].idbuyer == datos.idseller) ) {
            res.status(200).json({message:result[i].messages});
            return;
            break;
        }
    }

    res.status(500).json({errorMsm:"error"});
});

router.post('/', async(req,res,next)=>{
    var datos = req.body;

    var a = [];
    a.push({
        id : datos.idsend,
        nickname : datos.nickname,
        message : datos.message,
        create_at : new Date(),
    });
    datos["messages"] = a;

    //res.status(200).json(a);
    datos["registerDate"] = new Date();
    var quotes = new MESSAGE(datos);
    var result = await quotes.save();
    res.status(200).json(result);
});

router.put("/", async(req, res) => {
    if (req.query.id != null) {
        res.status(300).json({
            errId: "id no encontrado"
        });
        return;
    }
    //var id = req.query.id;
    var result = await MESSAGE.find({});
    if (result == null) {
        res.status(300).json({errVoid:result});
        return;
    }
    var params = req.body;
    var add = 1;
    for (var i = 0; i < result.length; i++ ){
        if (result[i].idseller == params.idseller && result[i].idbuyer == params.idbuyer) {
            result[i].messages.push({
                id : params.idsend,
                nickname : params.nickname,
                create_at : new Date(),
            });
            add = result[i];
            break;
            //res.status(200).json(result[i]);
            //return;
        }
    }

    params["messages"] = add.messages;
    res.status(200).json(params);
    result = await MESSAGE.findOneAndUpdate({_id:add._id}, add);
    res.status(200).json({updateSeguir:result});


});

router.delete("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "ERROR DE ID"
        });
        return;
    }
    var result = await QUOTES.remove({_id: req.query.id});
    res.status(200).json(result);
});

module.exports = router;
