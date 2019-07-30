const express = require('express');
const bcrypt = require('bcrypt');
var multer = require('multer');
var path = require('path');
const router = express.Router();

const auth = require('./verifytoken'); // not used
const validPersona = require('../../utils/validation')
const USER = require('../../database/collections/usuarios');
const PERSONA = require('../../database/collections/personas');

const storage = multer.diskStorage({
destination: "./public/images/profile",
filename: (req, file, cb) =>{
    cb(null, "img_profile_" + Date.now() + path.extname(file.originalname).toLocaleLowerCase());
}
});
/*var upload = multer({
  storage: storage
}).single("profile");*/
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
}).single('profile');

router.get('/', async(req,res,next)=>{
    if (req.query.id == null) {
        let result = await PERSONA.find({});
        res.status(200).json({result:result});
    }else {
        var id = req.query.id;
        let result = await PERSONA.find({_id: id});
        res.status(200).json({msn:result});
    }

});

router.post('/', async(req,res,next)=>{
    var datos = req.body;

    datos["name"] = datos.name.trim();
    if (!validPersona.checkName(datos["name"])) {
        res.status(500).json({errName: "Nombre no valido"});
        return;
    }

    if (datos.phone != null) {
        if (!validPersona.checkPhone(datos.phone)) {
            res.status(500).json({errPhone: "Numero de 8 digitos"});
            return;
        }
    }
    else {
        datos.phone = "00000000";
    }


    if (datos.email != null ) {
        datos["user"] = datos.email;//["email"].match(exp).toString();
    } else {

        if (!validPersona.checkUser(datos.user)) {
            res.status(500).json({errUserL: "8 a 15 caracteres"});
            return;
        }
    }

    let a = await USER.find({user: datos.user});
    //res.status(500).json(a);
    //res.status(500).json("datos.email");

    if (a.length != 0) {
        let b = await PERSONA.find({_id: a[0].idpeople})
        res.status(500).json({errUser: {user:a, persona:b}});
        return;
    }

    if (datos.password != null) {
        if (!validPersona.checkPassword(datos.password)) {
            res.status(500).json({errPass: "el password tiene que tener mínimo 6 caracteres, tener minimo un caracter y un numero"});
            return;
        }
        datos["password"] = datos.password.trim();
    }


    datos["qSeller"] = [0,0];
    datos["qBuyer"] = [0,0];
    if (datos.avatar == null) {
        datos["avatar"] = "";
    }

    if (datos.street != null) {
        datos["street"] = datos.street.trim();
    } else {
        datos["street"] = "Highland Players";
        datos["lat"] = "-19.5759897";
        datos["lon"] = "-65.7581637";
    }



    datos["registerDate"] = new Date();
    datos["updateDate"] = new Date();
    var persona = new PERSONA(datos);
    var result = await persona.save();

    if(datos.password != null){
        bcrypt.hash(req.body.password,10, async(err,hash)=>{
            if(hash){
                datos["idpeople"] = result["_id"];

                datos["user"] = datos.user.trim();
                datos["password"] = hash;
                var user = new USER(datos);
                result = await user.save();
                res.status(200).json({checkIn:result});
            }else{
                res.status(500).json({
                    message:err
                });
            }
        });
    } else {
        datos["idpeople"] = result["_id"];
        datos["user"] = datos.user.trim();
        var user = new USER(datos);
        result = await user.save();
        res.status(200).json({checkIn:result});
    }
});

    // IMAGEN
router.post("/image", async(req, res)=>{
    var params = req.query;
    var id = params.id;
    //res.status(200).json(id);
    let result;
    try{
        result = await PERSONA.findOne({_id:params.id});
    }
    catch(error){
        res.status(300).json("result");
        return;
    }

    if(result != null){
        upload(req,res,async(err) => {
            if (err) {
                console.log(req.file);
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
            result = await PERSONA.findOneAndUpdate({_id:id}, {avatar:url, updateDate: new Date()});
            res.status(200).json({image:result});
        });
    } else{
        res.status(500).json({errImage:"error"});
    }
});

router.put("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            errId: "id no encontrado"
        });
        return;
    }
    var id = req.query.id;
    var params = req.body;

    if (params.qSeller != null) {
        let result = await PERSONA.findOne({_id: id});
        var qseller = result.qSeller;

        let a = qseller[0] + 1;
        let b = qseller[1] + parseInt(params.qSeller, 10)
        params["qSeller"] = [a,b];
        result = await PERSONA.findOneAndUpdate({_id: id}, params);
        res.status(200).json({updateSeguir:result});
        return;
    }
    if (params.qBuyer != null) {
        let result = await PERSONA.findOne({_id: id});
        var qbuyer = result.qBuyer;

        let a = qbuyer[0] + 1;
        let b = qbuyer[1] + parseInt(params.qBuyer, 10)
        params["qBuyer"] = [a,b];
        result = await PERSONA.findOneAndUpdate({_id: id}, params);
        res.status(200).json({updateSeguir:result});
        return;
    }
    // Validation
    params["name"] = params.name.trim();
    if (!validPersona.checkName(params["name"])) {
        res.status(500).json({errName: "Nombre no valido"});
        return;
    }

    if (!validPersona.checkPhone(params.phone)) {
        res.status(500).json({errPhone: "Numero de 8 digitos"});
        return;
    }

    if (params.user != null) {
        if (!validPersona.checkUser(params.user)) {
            res.status(500).json({errUserL: "8 a 15 caracteres"});
            return;
        }
        params["user"] = params.user.trim();
    }

    let a = await USER.find({user: params.user});
    if (a.length != 0) {
        res.status(500).json({errUser: "usuario en uso"});
        return;
    }

    params["street"] = params.street.trim();
    params["updateDate"] = new Date;
    var result = await PERSONA.findOneAndUpdate({_id: id}, params);
    if (params.password != null) {
        if (!validPersona.checkPassword(params.password)) {
            res.status(500).json({errPass: "el password tiene que tener mínimo 6 caracteres, tener minimo un caracter y un numero"});
            return;
        }
        params["password"] = params.password.trim();
        bcrypt.hash(req.body.password,10, async(err,hash)=>{
            if(hash){
                params["password"] = hash;
                result = await USER.findOneAndUpdate({idpeople: id}, params);
                res.status(200).json({updatePersona:result});
            }else{
                res.status(500).json({
                    message:err
                });
            }
        });
    }
    else {
        if (params.user != null) {
            result = await USER.findOneAndUpdate({idpeople: id}, params);
            res.status(200).json({updatePersona:result});
        }
        res.status(200).json({updatePersona:result});
    }

});

router.delete("/", async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "id no encontrado"
        });
        return;
    }
    var result = await PERSONA.remove({_id: req.query.id});
    res.status(200).json(result);
});

module.exports=router;
