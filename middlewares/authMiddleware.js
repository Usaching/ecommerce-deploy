import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
//The middleware in node. js is a function that will have all the access for requesting an object, responding to an object, and moving to the next middleware function in the application request-response cycle.
//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    }catch(error) {
        console.log(error)
    }
};

//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access",
            });
        } else {
            next();
        }
    }catch(error) {
        console.log(error)
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middelware"
        })
    }
}