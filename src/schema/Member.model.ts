import mongoose, { Schema } from 'mongoose';
import { MemberType, MemberStatus, MemberAuthType } from '../libs/enums/member.enum';



const memberSchema = new Schema({
    memberType: {
        type: String,
        enum: MemberType,
        default: MemberType.USER,
    },

    memberStatus: {
        type: String,
        enum: MemberStatus,
        default: MemberStatus.ACTIVE,
    },

    memberAuthType: {
        type: String,
        enum: MemberAuthType,
        default: MemberAuthType.PHONE,
    },

    memberNick: {
        type: String,
        index: { unique: true, sparse: true },
        required: true,
    },

    memberPhone: {
        type: String,
        index: { unique: true, sparse: true },
        required: true,
    },

    memberPassword: {
        type: String,
        select: false,
        requiredPaths: true,
    },

    memberAddress: {
        type: String,
    },

    memberEmail: {
        type: String,
    },

    memberDesc: {
        type: String,
    },

    memberImage: {
        type: String,
    },

    memberPoints: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

export default mongoose.model('Member', memberSchema);