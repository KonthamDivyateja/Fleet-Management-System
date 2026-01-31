import express from "express";
import {supabase} from "../config/supabase.js";
const router=express.Router();
router.post("/signup",async(req,res)=>
{
    const{name,email,role}=req.body;
    if(!name || !email || !role){
        return res.status(400).json({message:"Invalid input"});
    }
    const {data,error}=await supabase
    .from("users")
    .insert([{name,email,role}]);
    if(error){
        return res.status(400).json({message:error.message});
    }
    res.status(201).json({message:"User created",data});
}
);
export default router;