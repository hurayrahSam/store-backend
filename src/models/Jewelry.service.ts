import { Jewelry, JewelryInput, JewelryInquiry } from "../libs/types/jewelry";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus, StatisticModifier, T } from "../libs/types/common";
import Errors from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import JewelryModel from "../schema/Jewelry.model";
import { LikeInput } from "../libs/types/like";
import { LikeGroup } from "../libs/enums/like.enum";
import LikeService from "./Like.service";
import { SaveInput } from "../libs/types/save";
import { SaveGroup } from "../libs/enums/save.enum";
import SaveService from "./Save.service";
import LikeModel from "../schema/Like.model";


class JewelryService {
    private readonly jewelryModel;
    public viewService: ViewService;
    public likeService: LikeService;
    public saveService: SaveService;

    constructor() {
        this.jewelryModel = JewelryModel;
        this.viewService = new ViewService();
        this.likeService = new LikeService();
        this.saveService = new SaveService();
    }

    public async getJewelry(memberId: ObjectId | null, _id: string): Promise<Jewelry> {
        const jewelryId = shapeIntoMongooseObjectId(_id);

        const result = await this.jewelryModel.findOne({ _id: jewelryId, jewelryStatus: ProductStatus.ACTIVE }).exec();
        if (!result) throw new Errors(HttpCode.N0_DATA_FOUND, Message.N0_DATA_FOUND);

        if (memberId) {
            const input: ViewInput = {
                memberId: memberId,
                viewRefId: jewelryId,
                viewGroup: ViewGroup.JEWELRY,
            };
            const existView = await this.viewService.checkViewExistence(input);

            console.log('exist:', !!existView);
            if (!existView) {
                console.log('viewInsert');
                await this.viewService.insertMemberView(input);
                await this.jewelryStatsEditor({ _id: jewelryId, targetKey: 'jewelryViews', modifier: 1 });
            }
        }
        return result;
    }

    public async getJewelries(input: JewelryInquiry): Promise<Jewelry[]> {
        const match: T = { jewelryStatus: ProductStatus.ACTIVE };
        if (input.jewelryGender) { match.jewelryGender = input.jewelryGender };
        if (input.jewelryType) { match.jewelryType = input.jewelryType };
        if (input.jewelryMaterial) { match.jewelryMaterial = input.jewelryMaterial };
        if (input.search) { match.jewelryName = { $regex: new RegExp(input.search, "i") } };

        const sort: T = input.order === 'jewelryPrice' ? { [input.order]: 1 } : { [input.order]: -1 };

        const result = await this.jewelryModel.aggregate([
            { $match: match },
            { $sort: sort },
            { $skip: (input.page * 1 - 1) * input.limit },
            { $limit: input.limit },
        ]).exec();
        if (!result) throw new Errors(HttpCode.N0_DATA_FOUND, Message.N0_DATA_FOUND);

        return result;
    }

    public async likeJewelry(memberId: ObjectId, _id: string): Promise<Jewelry> {
        const jewelryId = shapeIntoMongooseObjectId(_id);
        const search: T = { _id: jewelryId, jewelryStatus: ProductStatus.ACTIVE };

        const jewelry = await this.jewelryModel.findOne(search).exec();
        if (!jewelry) throw new Errors(HttpCode.N0_DATA_FOUND, Message.N0_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: jewelryId,
            likeGroup: LikeGroup.JEWELRY,
        };
        const modifier: number = await this.likeService.toggleLike(input);
        const result = await this.jewelryStatsEditor({ _id: jewelryId, targetKey: 'jewelryLikes', modifier: modifier });
        if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
        return result;
    }

    public async saveJewelry(memberId: ObjectId, _id: string): Promise<boolean> {
        const jewelryId = shapeIntoMongooseObjectId(_id);
        const search: T = { _id: jewelryId, jewelryStatus: ProductStatus.ACTIVE };

        const jewelry = await this.jewelryModel.findOne(search).exec();
        if (!jewelry) throw new Errors(HttpCode.N0_DATA_FOUND, Message.N0_DATA_FOUND);

        const input: SaveInput = {
            memberId: memberId,
            saveRefId: jewelryId,
            saveGroup: SaveGroup.JEWELRY
        };

        return await this.saveService.toggleSave(input);
    }

    public async getMyLikely(memberId: ObjectId): Promise<Jewelry[]> {
        return await this.likeService.getMyLikely(memberId);
    }

    public async getAllJewelry(): Promise<Jewelry[]> {
        const result = await this.jewelryModel.find().exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.N0_DATA_FOUND);

        return result;
    }

    public async createJewelry(input: JewelryInput): Promise<Jewelry> {
        try {
            return await this.jewelryModel.create(input);
        } catch (err) {
            console.log('Error, jewelryModel:createJewelry', err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateJewelry(jewelryId: string, input: JewelryInput): Promise<Jewelry> {
        jewelryId = shapeIntoMongooseObjectId(jewelryId);
        const result = await this.jewelryModel.findOneAndUpdate({ _id: jewelryId }, input, { new: true }).exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result;
    }

    public async removeJewelry(jewelryId: string): Promise<Jewelry> {
        jewelryId = shapeIntoMongooseObjectId(jewelryId);
        const search: T = { _id: jewelryId, jewelryStatus: ProductStatus.DELETE };
        const result = await this.jewelryModel.findOneAndDelete(search).exec();
        if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.REMOVE_FAILED);
        return result;
    }

    public async removeAllJewelry(): Promise<void> {
        const result = await this.jewelryModel.deleteMany({ jewelryStatus: ProductStatus.DELETE }).exec();
        if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.REMOVE_FAILED);
    }

    public async jewelryStatsEditor(input: StatisticModifier): Promise<Jewelry> {
        console.log('executed!');
        const { _id, targetKey, modifier } = input;
        return await this.jewelryModel.findByIdAndUpdate(
            _id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
    }
}

export default JewelryService;