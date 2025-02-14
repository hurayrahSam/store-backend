import mongoose, { Schema } from "mongoose";
import { LikeGroup } from "../libs/enums/like.enum";

const likeSchema = new Schema(
    {
        memberId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Member"
        },

        likeRefId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }  // collection: "fixedName"
);

export default mongoose.model("Like", likeSchema);