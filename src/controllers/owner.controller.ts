import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { OwnerRequest, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import { LoginInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";

// BSSR: EJS Project

const memberService = new MemberService();

const ownerController: T = {};
ownerController.home = (req: Request, res: Response) => {
    try {
        console.log("home");
        res.render("Home");
    } catch (err) {
        console.log("Error on Home Page:", err);
        res.redirect("/owner");
    }
};

ownerController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup");
        res.render("Signup");
    } catch (err) {
        console.log("Error on Signup Page:", err);
        res.redirect("/owner");
    }
};

ownerController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin");
        res.render("Login");
    } catch (err) {
        console.log("Error on Login Page:", err);
        res.redirect("/owner");
    }
};

ownerController.ownerSingup = async (req: OwnerRequest, res: Response) => {
    try {
        console.log("processSignup");
        const file = req.file;
        if (!file) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);


        const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path.replace(/\\/g, "/");;
        newMember.memberType = MemberType.OWNER;
        const result = await memberService.ownerSingup(newMember);

        req.session.member = result;
        req.session.save(function () {
            res.redirect("/owner");
        });


    } catch (err) {
        console.log("Error on processSignup Page:", err);
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace("/owner/signup") </script>`);
    }
};

ownerController.ownerLogin = async (req: OwnerRequest, res: Response) => {
    try {
        console.log('login');
        const input: LoginInput = req.body;
        const result = await memberService.ownerLogin(input);

        req.session.member = result;
        req.session.save(function () {
            res.redirect('/owner');
        });

    } catch (err) {
        console.log("Error on login Page:", err);
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace("/owner/login") </script>`);
    }
}

ownerController.logout = async (req: OwnerRequest, res: Response) => {
    try {
        console.log("LogOut");
        req.session.destroy(function () {
            res.redirect("/owner");
        })
    } catch (err) {
        console.log("Error on Login Page:", err);
        res.redirect("/owner");
    }
};

ownerController.getUsers = async (req: Request, res: Response) => {
    try {
        console.log("getUsers");
        const result = await memberService.getUsers();
        console.log(result);
        res.render("users", { users: result });
    } catch (err) {
        console.log("Error on GetUsers:", err);
        res.redirect("/owner/login");
    }
};

ownerController.updateOwner = async (req: Request, res: Response) => {
    try {
        console.log("updateUser");
        const result = await memberService.updateOwner(req.body);

        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error on updateUser:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

ownerController.checkAuthSession = async (req: OwnerRequest, res: Response) => {
    try {
        console.log("checkAuthsession");
        if (req.session?.member) res.send(`<script> alert("Hi, ${req.session.member.memberNick}") </script>`);
        else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}") </script>`);



    } catch (err) {
        console.log("Error, checkAuthSession:", err);
        res.send(err);
    }
};

ownerController.verifyOwner = (
    req: OwnerRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.session?.member?.memberType === MemberType.OWNER) {
        req.member = req.session.member;
        next();
    } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(`<script> alert("${message}"); window.location.replace('/owner/login') </script>`);
    }
}

export default ownerController;