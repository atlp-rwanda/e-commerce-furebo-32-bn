import { Request, Response } from "express";
import { getAvailableProductStats, getExpiredProductStats, getProductStats, getStockStats } from "./product.controller";



export const generalstats=async(req:Request, res:Response)=>{
    const productStats=await getProductStats(req);
    const expiredProducts=await getExpiredProductStats(req);
    const availableProducts=await getAvailableProductStats(req);
    const stocklevel=await getStockStats(req);
    res.status(200).json({productStats,expiredProducts,availableProducts,stocklevel});
}