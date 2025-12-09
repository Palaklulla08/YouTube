// importing express 
import express from "express"
// importing functions from authcontroller
import { googleAuth, resetPassword, sendOTP, signin, signOut, signUp, verifyOTP } from "../controller/authController.js"
// importing multer middleware
import upload from "../middleware/multer.js"

// creating authrouter
const authRouter = express.Router()


authRouter.post("/signup",upload.single("photoUrl"),signUp)
authRouter.post("/signin",signin)
authRouter.get("/signout",signOut)
authRouter.post("/google-auth", upload.single("photoUrl"), googleAuth);
authRouter.post("/sendotp",sendOTP)
authRouter.post("/verifyotp",verifyOTP)
authRouter.post("/resetpassword",resetPassword)



export default authRouter