import express from "express";
const owner = express.Router();
import makeUploader from "./libs/utilis/uploader";
import ownerController from "./controllers/owner.controller";
import jewelryController from "./controllers/jewelry.controller";

/* Owner Roters */

owner.get('/', ownerController.home);
owner.get('/signup', ownerController.getSignup);
owner.post(
    '/signup',
    makeUploader('members').single('memberImage'),
    ownerController.ownerSingup);
owner.get('/login', ownerController.getLogin);
owner.post('/login', ownerController.ownerLogin);
owner.get('/logout', ownerController.logout);
owner.get('/check-me', ownerController.checkAuthSession);

/* User Routers */

owner.get('/user/all', ownerController.verifyOwner, ownerController.getUsers);
owner.post('/update-user', ownerController.verifyOwner, ownerController.updateOwner);

/* Jewelry Routers */

owner.get('/jewelry/all', ownerController.verifyOwner, jewelryController.getAllJewelry);
owner.post(
    '/jewelry/create',
    ownerController.verifyOwner,
    makeUploader('jewelries').array('jewelryImages', 5),
    jewelryController.createJewelry,
);
owner.post('/jewelry/update-jewelry/:id', ownerController.verifyOwner, jewelryController.updateJewelry);
owner.post('/jewelry/remove-jewelry/:id', ownerController.verifyOwner, jewelryController.removeJewelry);
owner.get('/jewelry/remove/all', ownerController.verifyOwner, jewelryController.removeAllJewelry);


export default owner;
