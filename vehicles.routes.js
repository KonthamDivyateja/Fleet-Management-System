import express from "express";
import { supabase } from "../config/supabase";
import { rateLimiter } from "../middleware/rateLimiter";
const router=express.Router();
router.post("/add",rateLimiter,async(req,res)=>{
    const{name,registration_number,allowed_passengers,rate_per_km,owner_id}=
    req.body;
    if(!name || !registration_number){
        return res.status(400).json({message:"Invalid input"});
    }
    const{data,error}=await supabase.from("vehicles").insert([
        {
            name,
            registration_number,
            allowed_passengers,
            rate_per_km,
            owner_id,
            is_available:true
        }
    ]);
    if(error){
        return res.status(400).json({message:error.message});
    }
    res.status(201).json({message:"Vehicle added",data});
});
router.patch("/assign-driver/:vehicleId",async(req,res)=>{
    const{driver_id}=req.body;
    const{vehicleId}=req.params;
    const {error}=await supabase
    .from("vehicles")
    .update({driver_id})
    .eq("id",vehicleId);
    if(error){
        return res.status(400).json({message:error.message});
    }
    res.json({message:"Driver assigned"});
});
export default router;