// imported gentoken for generating token
import genToken from "../config/token.js"
// user model for schema
import User from "../model/userModel.js"
// validator to check email validity
import validator from 'validator'
// bcrypt for password hashing
import bcrypt from 'bcryptjs'
// cloudinary for image upload
import uploadOnCloudinary from "../config/cloudinary.js"
// mail for receiveing otp
import sendMail from "../config/sendMail.js"



// signup function which get username , email , password and photo from req.body if file is present then upload it to cloudinary and get the url
export const signUp = async (req,res) => {
    try {
        const { username, email, password} = req.body
        let photoUrl
        if(req.file){
            photoUrl = await uploadOnCloudinary(req.file.path)
        } 
        // if existing user then return error
        let existUser = await User.findOne({email})
        if(existUser){
          return res.status(400).json({message:"User is already exist"})
        }
        // if invaild email then return error
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter Valid email"})
        }
        // if not strong password then return error
        if(password.length < 8){
            return res.status(400).json({message:"Enter Strong password"})
        }
        // hashedPassword by bcrypt
        let hashPassword = await bcrypt.hash(password,10)
        // after that create user in database
        const user = await User.create({
           username,
           email,
           password:hashPassword,
           photoUrl 
        })
        // gen token and set cookie
        let token = await genToken(user._id)
        //  send response with cookie with token and user data that expires in 7 days
        res.cookie("token",token , {
            httpOnly:true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
       return res.status(201).json(user)
    } catch (error) {
      // if error then return response with error message
        return res.status(500).json({message:`SignUp error ${error}`})
    }
    
}
// ----------------------------------------------------------------------------------------------------
// signin function which get email and password from req.body and check user exist or not if exist then compare password with hashed password if match then generate token and set cookie

export const signin = async (req,res) => {
    try {
        const {email , password} = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        } 
        // compare password with hashed password
        let isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
          // if not matched then return error
            return res.status(400).json({message:"Incorrect Password"})
        }
        // if matched then generate token and set cookie
        let token = await genToken(user._id)
        // send response with cookie with token and user data that expires in 7 days
        res.cookie("token",token , {
            httpOnly:true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
       return res.status(200).json(user)

    } catch (error) {
      // if any error then return response with error message
        return res.status(500).json({message:`Signin error ${error}`})
    }
    
}
// -----------------------------------------------------------------------------------------------------
// signout function to clear the cookie

export const signOut = async (req,res) => {
    try {
      // when user signout then clear the cookie
        await res.clearCookie("token")
         return res.status(200).json({message:"SignOut Successfully"})
    } catch (error) {
      // if any error then return response with error message
        return res.status(500).json({message:`SignOut error ${error}`})
    }
}
// ------------------------------------------------------------------------------------------------------
// googleAuth function to authenticate user with google account if user is new then create user in database otherwise just generate token and set cookie
export const googleAuth = async (req, res) => {
  try {
    // takes username, email, photoUrl from req.body
    const { username, email, photoUrl } = req.body;
    
    // set finalphotourl as photoUrl
    let finalPhotoUrl = photoUrl;

    // Google ka image Cloudinary me upload karo (sirf jab image aaye)
    if (photoUrl) {
      try {
        finalPhotoUrl = await uploadOnCloudinary(photoUrl);
      } catch (err) {
        console.log("Cloudinary upload failed, using original URL");
      }
    }
// if the above is successful, then
    // check if user already exists in database
    let user = await User.findOne({ email });

//  if not exist then create new user
    if (!user) {
      user = await User.create({
        username,
        email,
        photoUrl: finalPhotoUrl
      });

    } 
    else {
      if (!user.photoUrl && finalPhotoUrl) {
        user.photoUrl = finalPhotoUrl;
        await user.save();
      }
    }
//  genToken and set cookie
    let token = await genToken(user._id);

    // send cookie with token that expires in 7 days

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: `GoogleAuth error ${error}` });
  }
};
// ---------------------------------------------------------------------------------------------------------------------------------------------

// sendotp function to generate random otp and send mail
export const sendOTP = async (req,res) => {
    try {
      // get email from req.body
        const {email} = req.body
        // finds the user with the provided email
        const user = await User.findOne({email})
        if(!user){
          // if not found then return error
             return res.status(404).json({message:"User not found"})
        }
        // if found then generate random 4 digit otp
        const otp = Math.floor(1000 + Math.random()* 9000).toString()
         
        // set otp , otp expiry time and isOtpVerified to false in user schema
        user.resetOtp = otp,
        user.otpExpires = Date.now() + 5 * 60 *1000,
        user.isOtpVerifed = false
        
        // saving the user with updated otp details
        await user.save()
        // send mail with otp
        await sendMail(email , otp)
        return res.status(200).json({message:"Otp Send Successfully"})
    } catch (error) {
        return res.status(500).json({message:`send Otp error ${error}`})
    }
    
}
// -------------------------------------------------------------------------------------------------------
// verifyOTP function to verify the otp sent to email

export const verifyOTP = async (req,res) => {
    try {
      // receving email and otp from req.body
        const {email,otp} = req.body
        // find the user with email
         const user = await User.findOne({email})
        //  if user not found or otp not match or otp expired then return error
        if(!user || user.resetOtp != otp || user.otpExpires < Date.now() ){
             return res.status(404).json({message:"Invalid OTP"})
        }
        // if not then set isOtpVerified to true and clear otp and otp expiry time
        user.isOtpVerifed = true,
        user.resetOtp = undefined,
        user.otpExpires = undefined
        // save the data in database of user
        await user.save()

         return res.status(200).json({message:"Otp Verified Successfully"})

    } catch (error) {
         return res.status(500).json({message:`verify Otp error ${error}`})
    }
}
// --------------------------------------------------------------------------------------------------------

//  resetPassword function to reset the password after otp verification
export const resetPassword = async (req,res) => {
    try {
      // receving email and new password from req.body
        const {email, password} = req.body
        // chceks for the user with email
        const user = await User.findOne({email})
        // if not found or otp not verified then return error
        if(!user || !user.isOtpVerifed){
             return res.status(404).json({message:"OTP verification is required"})
        }
        // if found then hash the new password
        const hashPassword = await bcrypt.hash(password,10)
        // save the new hashed password and set isOtpVerified to false
        user.password = hashPassword,
        user.isOtpVerifed = false
        // save the user data in database
        await user.save()
         return res.status(200).json({message:"Reset Password Successfully"})

    } catch (error) {
        return res.status(500).json({message:`reset password error ${error}`})
    }
}
// ------------------------------------------------------------------------------------------
