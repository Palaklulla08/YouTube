// importing jwt 
import jwt from "jsonwebtoken"

// function isauth set token from req.cookies 
const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies
        // if token not received user doest have token returns
    if(!token){
        return res.status(400).json({message:"user does't have token"})
    }
    // if received then token is verified 
    let verifyToken = await jwt.verify(token,process.env.JWT_SECRET)
    // if the verification not passes  then return invalid user
    if(!verifyToken){
        return res.status(400).json({message:"user does't have valid token"})
    }
    // if verified then setting req.user as verifytoken.userid and moving to next middleware
    req.userId = verifyToken.userId
    next()

    } catch (error) {
         return res.status(500).json({message:`isAuth error ${error}`})
    }
    
}

export default isAuth
// -----------------------------------------------------------------------------