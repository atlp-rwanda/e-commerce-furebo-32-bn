import { Request, Response } from "express";
import { getProductStats } from "./product.controller";



export const generalstats=async(req:Request, res:Response)=>{
    const stocklevel=await getProductStats(req);
    res.status(200).json({stocklevel});
}