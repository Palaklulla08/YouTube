// importing multer
import multer from "multer";
//  creating variable storage as multer.diskstorage
let storage = multer.diskStorage({
    // giving destination as ./public 
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    // filename as the originalname of file with date 
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
// --------------------------------------------------------------------