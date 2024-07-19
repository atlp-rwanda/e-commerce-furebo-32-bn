import { Request,Response } from "express";

import { createCollectionAttributes } from "../types/collection.types";
import { CreateCollectionService, GetCollectionService } from "../services/collection.services";
import { UserService } from "../services/user.services";
import "../utils/cloudinary.utils"

export const createCollection=async function(req:Request,res:Response){

    const collection:createCollectionAttributes={
        CollectionName:req.body.CollectionName,
        description:req.body.description,
        seller_id:req.user?.id
    }
    if(!collection.CollectionName|| !collection.description||!collection.seller_id){
        return res.status(400).json({message:"Make sure you enter all required information"})
    }
    const createdCollection= await CreateCollectionService.createCollection(collection);
    return res.status(200).json({
        message:"Collection created successfully",
        createdCollection:createdCollection
    })
}

export const getSellerItems = async function (req: Request, res: Response) {
    const seller = await UserService.getUserByid(req.user?.id);
 try {
    if (seller?.role !== 'seller') {
        return res.status(401).json({ status: 401, error: "Unauthorized access" });
    }
    const items = await GetCollectionService.getSellerItem(seller.id);
    return res.status(200).json({
        status: 200,
        message: "Items retrieved successfully",
        items: items
    });
 }
catch (error) {
        return res.status(500).json({ status: 500, error: "Internal server error" });
    }
}

export const updateCollection = async function (req: Request, res: Response) {
  const { id } = req.params;
  const { CollectionName, description } = req.body;
  try {
    const collection = await CreateCollectionService.getCollectionByid(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    collection.CollectionName = CollectionName;
    collection.description = description;
    await collection.save();
    return res.status(200).json({
      message: "Collection updated successfully",
      collection: collection,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }
};

export const deleteCollection = async function (req: Request, res: Response) {
  const { id } = req.params;
  try {
    const collection = await CreateCollectionService.getCollectionByid(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    await collection.destroy();
    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }
};