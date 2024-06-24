import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/Product.services";

export const checkProductOwner=async function(req:Request,res:Response,next:NextFunction){
    const seller_id=req.user.id
    const product_id=req.params.product_id
    const product=await ProductService.getProductById(product_id)

    if(seller_id!==product?.seller_id){
        return res.status(400).json({message:"You don't own the product"})
    }
    next(); 
}
