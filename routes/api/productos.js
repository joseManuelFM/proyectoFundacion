const express = require('express');
const bcrypt = require('bcrypt');
var multer = require('multer');
var path = require('path');
const router = express.Router();

const auth = require('./verifytoken'); // not used
const validProducto = require('../../utils/validation')
const PRODUCTO = require('../../database/collections/product');

    // MULTER
const storage = multer.diskStorage({
destination: "./public/images/product",
filename: (req, file, cb) =>{
    cb(null, "img_product_" + Date.now() + path.extname(file.originalname).toLocaleLowerCase());
}
});

const upload = multer({
storage,
dest: path.join(),
    //Validación
fileFilter: (req, file,cb) =>{
    console.log(file);
    const filetypes = /jpeg|jpg|png|gif|octet-stream/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb("Error: El archivo debe ser una imagen valida:: " + req.file)
}
}).single('product');

router.get('/', async(req,res,next)=>{
    if (req.query.id == null) {
        let result = await PRODUCTO.find({});
        res.status(200).json({product:result});
    }else {
        var id = req.query.id;
        let result = await PRODUCTO.find({_id: id});
        res.status(200).json({product:result});
    }

});

router.post('/', async(req,res,next)=>{
    var datos = req.body;

    datos["title"] = datos.title.trim();
    if (!validProducto.checkTitle(datos["title"])) {
        res.status(500).json({errTitle: "Titulo no valido"});
        return;
    }

    datos["price"] = datos.price.trim();
    if (!validProducto.checkPrice(datos["price"])) {
        res.status(500).json({errPrice: "Precio no valido"});
        return;
    }

    datos["quantity"] = datos.quantity.trim();
    if (!validProducto.checkQuantity(datos["quantity"])) {
        res.status(500).json({errQuantity: "Cantidad no valida"});
        return;
    }

    datos["description"] = datos.description.trim();
    if (!validProducto.checkDescription(datos["description"])) {
        res.status(500).json({errDescription: "descripción no valida"});
        return;
    }

    if (datos.image == null) {
        datos["images"] = "";
    }

    datos["registerDate"] = new Date();
    datos["updateDate"] = new Date();
    var persona = new PRODUCTO(datos);
    var result = await persona.save();
    res.status(200).json({product:result});
});

router.post("/image", async(req, res)=>{
    var params = req.query;
    var id = params.id;
    let result;
    try{
        result = await PRODUCTO.findOne({_id:params.id});
    }
    catch(error){
        res.status(300).json("result");
        return;
    }

    if(result != null){
        upload(req,res,async(err) => {
            if (err) {
                res.status(500).json({
                    errFile: req.file
                });
                return;
            }
            if (typeof req.file === 'undefined') {
                res.status(300).json({errFileVoid:"Archivo no encontrado"});
                return;
            }
            let url = req.file.path.replace(/public/g, "");
            result = await PRODUCTO.findOneAndUpdate({_id:id}, {image:url, updateDate: new Date()});
            res.status(200).json({image:result});
        });
    } else{
        res.status(500).json({errImage:"error"});
    }
});


router.put("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "id no encontrado"
        });
        return;
    }
    var id = req.query.id;
    var params = req.body;
    params["title"] = params.title.trim();
    if (!validProducto.checkTitle(params["title"])) {
        res.status(500).json({errTitle: "Titulo no valido"});
        return;
    }

    params["price"] = params.price.trim();
    if (!validProducto.checkPrice(params["price"])) {
        res.status(500).json({errPrice: "Precio no valido"});
        return;
    }

    params["quantity"] = params.quantity.trim();
    if (!validProducto.checkQuantity(params["quantity"])) {
        res.status(500).json({errQuantity: "Cantidad no valida"});
        return;
    }

    params["description"] = params.description.trim();
    if (!validProducto.checkDescription(params["description"])) {
        res.status(500).json({errDescription: "descripción no valida"});
        return;
    }
    params["updateDate"] = new Date;
    let result = await PRODUCTO.findOneAndUpdate({_id: id}, params);
    res.status(200).json({product:result});

});

router.delete("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "id no encontrado"
        });
        return;
    }
    var result = await PRODUCTO.remove({_id: req.query.id});
    res.status(200).json({deleteProduct:result});
});

module.exports=router;
