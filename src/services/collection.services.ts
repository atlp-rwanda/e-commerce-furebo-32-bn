import Collection from "../database/models/collection.model";
import { createCollectionAttributes } from "../types/collection.types";

export class CreateCollectionService {
  static async createCollection(collection: createCollectionAttributes) {
    return await Collection.create(collection);
  }
  static async getCollectionByName(CollectionName:string) {
    return  await Collection.findOne({ where: { CollectionName: CollectionName} });
  }

  static async getCollectionByid(id:string) {
    return await Collection.findOne({ where: { id: id } });
  }
}

export class GetCollectionService {
  static async getAllCollections() {
    return await Collection.findAll();
  }
  static async getSellerItem(seller_id:string) {
    return await Collection.findAll({ where: { seller_id: seller_id } });
  }

}