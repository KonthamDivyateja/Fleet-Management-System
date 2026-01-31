import express from "express";
import { supabase } from "../config/supabase";
const router=express.Router();
router.post("/create",async(req,res)=>{
    const {customer_id,vehicle_id,distance_km,passengers}=req.body;
    const{data:vehicle}=await supabase
    .from("vehicles")
    .select("*")
    .eq("id",vehicle_id)
    .single();
    if(!vehicle || !vehicle.is_available){
        return res.status(400).json({message:"Vehicle unavailable"});
    }
    if(passengers>vehicle.allowed_passengers){
        return res.status(400).json({message:"Passenger limit exceeded"});
    }
    const{data,error}=await supabase.from("trips").insert([
        {
            customer_id,
            vehicle_id,
            distance_km,
            is_completed:false
        }

    ]);
    if(error) return
    res.status(400).json({message:error.message});
    await supabase
    .from("vehicles")
    .update({is_available:false})
    .eq("id",vehicle_id);
res.status(201).json({message:"Trip created",data});
});

router.patch("/end/:tripId",async(req,res)=>{
    const{tripId}=req.params;
    const{data:trip}=await supabase
    .from("trips")
    .select("distance_km,vehicle_id")
    .eq("id",tripId)
    .single();

    const{data:vehicle}=await supabase
    .from("vehicles")
    .select("rate_per_km")
    .eq("id",trip.vehicle_id)
    .single();

    const tripCost=trip.distance_km * vehicle.rate_per_km;
    await supabase
    .from("trips")
    .update({is_completed:true,trip_cost:tripCost})
    .eq("id",tripId);
    await supabase
    .from("vehicles")
    .update({is_available:true})
    .eq("id",trip.vehicle_id);
res.json({message:"Trip ended",tripCost});
});
export default router;