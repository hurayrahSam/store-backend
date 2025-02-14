import { ObjectId } from "mongoose";
import { JewelryMaterial, JewelryType } from "../enums/jewelry.enum";
import { ProductGender, ProductStatus } from "./common";
import { MeLiked } from "./like";
import { MeSaved } from "./save";


export interface Jewelry {
    _id: ObjectId;
    jewelryStatus: ProductStatus;
    jewelryType: JewelryType;
    jewelryMaterial: JewelryMaterial;
    jewelryGender: ProductGender;
    jewelryBrand: string;
    jewelryLength: number;
    jewelrySize: number;
    jewelryName: string;
    jewelryPrice: number;
    jewelryDetail: string;
    jewelryDesc: string;
    jewelryImages: string[];
    jewelryViews: number;
    jewelryLikes: number;
    jewelryLeftCount: number,
    createdAt: Date;
    updatedAt: Date;
    meLikely?: MeLiked;
    meSaved?: MeSaved;
}

export interface JewelryInquiry {
    page: number;
    limit: number;
    order: string;
    jewelryGender?: ProductGender;
    jewelryType?: JewelryType;
    jewelryMaterial?: JewelryMaterial;
    search?: string;
}


export interface JewelryInput {
    jewelryStatus: ProductStatus;
    jewelryType: JewelryType;
    jewelryMaterial: JewelryMaterial;
    jewelryGender: ProductGender;
    jewelryBrand?: string;
    jewelryLength?: number;
    jewelrySize?: number;
    jewelryName: string;
    jewelryPrice: number;
    jewelryDetail: string;
    jewelryDesc?: string;
    jewelryImages: string[];
    jewelryViews?: number;
    jewelryLikes?: number;
    jewelryLeftCount?: number,
}

export interface JewelryUpdateInput {
    _id: ObjectId;
    jewelryStatus?: ProductStatus;
    jewelryType?: JewelryType;
    jewelryMaterial?: JewelryMaterial;
    jewelryGender?: ProductGender;
    jewelryBrand?: string;
    jewelryLength?: number;
    jewelrySize?: number;
    jewelryName?: string;
    jewelryPrice?: number;
    jewelryDetail?: string;
    jewelryDesc?: string;
    jewelryImages?: string[];
    jewelryLeftCount?: number,
}