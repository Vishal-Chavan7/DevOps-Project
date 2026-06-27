import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

// register a new user

const registerUser  = async (req,res)=>{
    try {

        const {name, email, password, number} = req.body;

        if(!name || !email || !password || !number){
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const existingUserNumber = await User.findOne({number});
        if(existingUserNumber){
            return res.status(400).json({message: "Number already exists"});
        }
        
        

        const user = await User.create({name, email, password, number});

        return res.status(201).json({message: "User registered successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                role: user.role
            }
        });

    } catch (error) {

        return res.status(500).json({message: error.message});
        
    }
}

// login a user


const login = async (req,res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){

            return res.status(400).json({message: "All fields are required"});
        
        }


        const user  = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid password"});
        }
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        return res.status(200).json({message: "Login successful", token, user:{
            id: user._id,
            name: user.name,
            email: user.email,
            number: user.number,
            role: user.role
        }});
            
    } catch (error) {

        return res.status(500).json({message: error.message});
        
    }
}

export { registerUser, login };