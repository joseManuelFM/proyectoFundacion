var express = require('express');
var multer = require('multer');
var path = require('path');

var router = express.Router();
    //MULTER
const storage = multer.diskStorage({
destination: path.join(_dirname, '..public/uploads'),
filename: (req, file, cb) =>{
    cb(null, "IMG_" + Date.now() + path.extname(file.originalname).toLocaleLowerCase());
}
});

const upload = multer({
storage,
dest: path.join(),
    //Validacion
fileFilter: (req, file,cb) =>{
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetyoe && extname) {
        return cb(null, true);
    }
    cb("Error: Archivo debe ser una imagen valida")
}
}).single('image');
/*var storage = multer.diskStorage({
  destination: "./public/prueba",
  filename: function (req, file, cb) {
    cb(null, "IMG_" + Date.now() + ".jpg");
  }
});
var upload = multer({
  storage: storage
}).single("image");
*/
router.post("/upload", async(req, res)=>{
    var params = req.query;
    var id = params.id;
    let result = await IMAGE.findOne({_id: id});

    if(result != null){
        upload(req,res,async(err) => {
            if (err) {
                res.status(500).json({
                    "msn": "Error al subir la imagen"
                });
                return;
            }
            var url = req.file.path.replace(/public/g, "");
            result = await IMAGE.findOneAndUpdate({_id:id}, {image:url});
            res.status(500).json(result);
        });
    }
    /*res.status(200).json({
        "img" : req.file.path
    });*/

    //res.status(200).json("result");
    //IMAGE.findOne({_id:id}).exect
});
