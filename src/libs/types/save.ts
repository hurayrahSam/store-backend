import { ObjectId } from 'mongoose';
import { SaveGroup } from '../enums/save.enum';


export interface Save {
    _id: ObjectId;
    saveGroup: SaveGroup;
    saveRefId: ObjectId;
    memberId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export interface SaveInput {
    memberId: ObjectId;
    saveRefId: ObjectId;
    saveGroup: SaveGroup;
};

export interface MeSaved {
    memberId: ObjectId;
    saveRefId: ObjectId;
    mySave: boolean;
}