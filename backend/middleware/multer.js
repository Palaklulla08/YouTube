// import multer from "multer"

// let storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null , "./public")
//     },
//     filename:(req,file,cb)=>{
//         cb(null , file.originalname)
//     }

// })
// const upload = multer({storage})

// export default upload
import multer from "multer";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
