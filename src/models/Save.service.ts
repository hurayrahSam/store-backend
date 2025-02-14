import Errors, { Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { MeSaved, SaveInput } from "../libs/types/save";
import SaveModel from "../schema/Save.model";
import { HttpCode } from "../libs/Errors";


class SaveService {
    private readonly saveModel;

    constructor() {
        this.saveModel = SaveModel;
    }

    public async toggleSave(input: SaveInput): Promise<boolean> {
        const search: T = {
            memberId: input.memberId,
            saveRefId: input.saveRefId,
        };
        const existSave = await this.saveModel.findOne(search).exec();

        let boolean: boolean = true;

        if (existSave) {
            await this.saveModel.findOneAndDelete(search).exec();
            boolean = false;
        } else {
            try {
                await this.saveModel.create(input);
            } catch (err) {
                console.log('Error, saveService.model', err);
                throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
            }
        }

        console.log(`Save boolean = ${boolean}`);
        return boolean;
    }

    public async checkSaveExistence(input: SaveInput): Promise<MeSaved[]> {
        const { memberId, saveRefId } = input;
        const result = await this.saveModel.findOne({ memberId: memberId, saveRefId: saveRefId }).exec();
        return result ? [{ memberId: memberId, saveRefId: saveRefId, mySave: true }] : [];
    }
}

export default SaveService;