import { Optional } from "sequelize";

export interface CollectionAttributes {
    id?: string;
    CollectionName:string;
    description:string;
    seller_id:string;
    createdAt?: Date;
    updatedAt?: Date;

  }


  export interface createCollectionAttributes
  extends Optional<
    CollectionAttributes,
    | "id"
    | "CollectionName"
    |"description"
    |"seller_id"
  > {}

export interface UserOutputs extends Required<CollectionAttributes> {}