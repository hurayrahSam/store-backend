import { ObjectId } from 'mongoose';

export interface T {
    [key: string]: any;
};

export interface StatisticModifier {
    _id: ObjectId;
    targetKey: string;
    modifier: number;
};

export enum Direction {
    ASC = 1,
    DESC = -1,
};

export enum ProductGender {
    MAN = "MAN",
    WOMAN = "WOMAN"
};

export enum ProductStatus {
    HOLD = "HOLD",
    ACTIVE = "ACTIVE",
    SOLD = "SOLD",
    DELETE = "DELETE",
};