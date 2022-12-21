const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');
const multer  = require('multer');



const fs = require("fs");

const path = "./uploads";
  
fs.access(path, (error) => {
  
  // To check if given directory 
  // already exists or not
  if (error) {
    // If current directory does not exist then create it
    fs.mkdir(path, { recursive: true }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("New Directory created successfully !!");
      }
    });
  } else {
    console.log("Given Directory already exists !!");
  }
});

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req,file,cb){
        cb(null,Date.now()+'.'+file.mimetype.split('/')[1])
    }
});

const upload = multer({storage:storage});


router.post('/uploadFiles',upload.single('file'),(req,res)=>{
    res.send({status:'done',fileName:req.file.filename})
});


router.use('/getUploadedFiles',express.static('./uploads'));



module.exports = router ;