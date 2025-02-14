import mongoose, { Schema } from "mongoose";
import { SaveGroup } from "../libs/enums/save.enum";

const saveSchema = new Schema(
    {
        saveGroup: {
            type: String,
            enum: SaveGroup,
            required: true,
        },

        memberId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Member"
        },

        saveRefId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Save", saveSchema);