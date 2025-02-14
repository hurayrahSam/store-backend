import { Request, Response } from "express";
import JewelryService from "../models/Jewelry.service";
import { ProductGender, T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ExtendedRequest, OwnerRequest } from "../libs/types/member";
import { Jewelry, JewelryInput, JewelryInquiry } from "../libs/types/jewelry";
import { JewelryMaterial, JewelryType } from "../libs/enums/jewelry.enum";

const jewelryService = new JewelryService();

const jewelryController: T = {};

jewelryController.getJewelry = async (req: ExtendedRequest, res: Response) => {
    try {
        const jewelryId = req.params.id;
        const memberId = req.member?._id ?? null;
        const result = await jewelryService.getJewelry(memberId, jewelryId);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log('Error: getJewelry', err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

jewelryController.getJeweleries = async (req: Request, res: Response) => {
    try {
        console.log('getJewelries');
        const { page, limit, order, search, jewelryType, jewelryGender, jewelryMaterial } = req.query;
        const input: JewelryInquiry = {
            order: String(order),
            page: Number(page),
            limit: Number(limit),
        };
        if (jewelryGender) { input.jewelryGender = jewelryGender as ProductGender };
        if (jewelryType) { input.jewelryType = jewelryType as JewelryType };
        if (jewelryMaterial) { input.jewelryMaterial = jewelryMaterial as JewelryMaterial };
        if (search) input.search = String(search);

        const result = await jewelryService.getJewelries(input);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log('Error: getJewelries', err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);

    }
}

jewelryController.likeJewelry = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log('likeJewelry');
        const jewelryId = req.params.id;
        const memberId = req.member?._id ?? null;

        const result = await jewelryService.likeJewelry(memberId, jewelryId);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log('Error: likeJewelry', err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

jewelryController.saveJewelry = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log('saveJewelry');
        const jewelryId = req.params.id;
        const memberId = req.member?._id ?? null;
        const result = await jewelryService.saveJewelry(memberId, jewelryId);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log('Error: saveJewelry');
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

jewelryController.getMyLikely = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log('getMyLikely');
        const memberId = req.member?._id ?? null;
        const result = await jewelryService.getMyLikely(memberId);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log('Error: saveJewelry');
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

jewelryController.getAllJewelry = async (req: Request, res: Response) => {
    try {
        console.log('getAllJewelry');
        const data: Jewelry[] = await jewelryService.getAllJewelry();

        res.render('jewelry', { jewelry: data });
    } catch (err) {
        console.log('Error: getAllJewelry');
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

jewelryController.createJewelry = async (req: OwnerRequest, res: Response) => {
    try {
        console.log('createJewelry');
        if (!req.files?.length) throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

        const input: JewelryInput = req.body;
        input.jewelryImages = req.files?.map(ele => { return ele.path.replace(/\\/g, '/') });

        await jewelryService.createJewelry(input);

        res.send(`<script> alert("Sucessful creation!"); window.location.replace("/owner/jewelry/all") </script>`);
    } catch (err) {
        console.log('Error: createJewelry');
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace("/owner/jewelry-all") </script>`);
    }
}

jewelryController.updateJewelry = async (req: OwnerRequest, res: Response) => {
    try {
        console.log('updateJewelry');
        const jewelryId = req.params.id;

        const result = await jewelryService.updateJewelry(jewelryId, req.body);

        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log('Error: updateJewelry:', err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace("/owner/jewelry-all") </script>`);
    }
}

jewelryController.removeJewelry = async (req: OwnerRequest, res: Response) => {
    try {
        console.log('removeJewelry');
        const jewelryId = req.params.id;
        await jewelryService.removeJewelry(jewelryId);

        res.send(`<script> alert("Sucessful removed!"); window.location.replace("/owner/jewelry-all") </script>`);
    } catch (err) {
        console.log("Error, removeJewelry:", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace("/owner/jewelry-all") </script>`);
    }
}

jewelryController.removeAllJewelry = async (req: OwnerRequest, res: Response) => {
    try {
        console.log('removeAllJewelry');
        await jewelryService.removeAllJewelry();

        res.send(`<script> alert("Sucessful All removed!"); window.location.replace("/owner/jewelry-all") </script>`);
    } catch (err) {
        console.log('Error, removeAllJewelry');
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace("/owner/jewelry-all") </script>`);
    }
}


export default jewelryController;