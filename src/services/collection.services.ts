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