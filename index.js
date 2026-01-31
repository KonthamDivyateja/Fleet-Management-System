import express from "express";
import dotenv from "dotenv";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import userRoutes from "./routes/users.routes.js";
import vehicleRoutes from "./routes/vehicles.routes.js";
import tripRoutes from "./routes/trips.routes.js";
let process;
dotenv.config();
const app=express();

app.use(express.json());
app.use(logger);
app.use("/users",userRoutes);
app.use("/vehicles",vehicleRoutes);
app.use("/trips",tripRoutes);
app.use(notFound);
app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port $ {process.env.PORT}`);
});