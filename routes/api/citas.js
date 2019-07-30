const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const validCitas = require('../../utils/validation')
const QUOTES = require('../../database/collections/quotes');

router.get('/', async(req,res,next)=>{
    let result = await QUOTES.find({});
    res.status(200).json(result);
});

router.post('/', async(req,res,next)=>{
    var datos = req.body;
    datos["registerDate"] = new Date();
    datos["updateDate"] = new Date();
    if(!validCitas.checkQuantity(datos.quantity))
    {
      res.status(300).json({
          msn: "campo no valido"
      });
      return;

    }
    var quotes = new QUOTES(datos);
    var result = await quotes.save();
    res.status(200).json(result);
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

module.exports=router;
