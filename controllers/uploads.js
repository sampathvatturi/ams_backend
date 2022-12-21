const db = require("../config/connection");
const currdateTime = require('../middleware/currdate');
const multer  = require('multer');



// const storage = multer.diskStorage({
//     destination: '../uploads',
//     filename: function(req,file,cb){
//         cd(null,Date.now()+'.'+file.mimetype.split('/')[1])
//     }
// });

// const upload = multer({storage:storage});

// //transactions
// exports.uploadFiles = async (req, res) => {
//  upload.single('file');
// }

