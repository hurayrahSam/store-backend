export const AUTH_TIMER = 48;
export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;

import mongoose from "mongoose";
import { T } from "./types/common";
export const shapeIntoMongooseObjectId = (target: any) => {
    return typeof target === 'string' ? new mongoose.Types.ObjectId(target) : target;
};

export const lookupUserLiked = (memberId: T, watchRefId: string = '$_id') => {
    console.log("memberId", memberId);
    console.log("watchRefId", watchRefId);
    return {
        $lookup: {
            from: 'likes',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$likeRefId', watchRefId] }, { $eq: ['$memberId', memberId] }
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        memberId: 1,
                        likeRefId: 1,
                        meLikely: true,
                    },
                },
            ],
            as: 'myLikely',
        },
    };
};

export const lookupUserSaved = (memberId: T, watchRefId: string = '$_id') => {
    return {
        $lookup: {
            from: 'saves',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$saveRefId', watchRefId] }, { $eq: ['$memberId', memberId] }
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        memberId: 1,
                        likeRefId: 1,
                        meLikely: true,
                    },
                },
            ],
            as: 'mySaved',
        },
    };
};