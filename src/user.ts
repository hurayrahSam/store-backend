import express from "express";
const user = express.Router();
import makeUploader from "./libs/utilis/uploader";
import userController from "./controllers/user.controller";
import jewelryController from "./controllers/jewelry.controller";
import orderController from "./controllers/order.controller";

/* User routers */
user.get('/user/owner', userController.getOwner);
user.post('/user/signup', makeUploader('members').single('memberImage'), userController.signup);
user.post('/user/login', userController.login);
user.post('/user/logout', userController.verifyAuth, userController.logout);
user.get('/user/detail', userController.verifyAuth, userController.getUserDetail);
user.post('/user/update', userController.verifyAuth, makeUploader('members').single('memberImage'), userController.updateUser);
user.get('/user/top-users', userController.getTopUsers);

/* jewelry router */
user.get('/jewelry', userController.retrieveAuth, jewelryController.getJeweleries);
user.get('/jewelry/my-likely', userController.verifyAuth, jewelryController.getMyLikely);
user.get('/jewelry/:id', userController.retrieveAuth, jewelryController.getJewelry);
user.post('/jewelry/like/:id', userController.verifyAuth, jewelryController.likeJewelry);
user.post('/jewelry/save/:id', userController.verifyAuth, jewelryController.saveJewelry);

/* Order router */
user.get('/order/my-orders', userController.verifyAuth, orderController.getMyOrders);
user.post('/order/create', userController.verifyAuth, orderController.createOrder);
user.post('/order/update', userController.verifyAuth, orderController.updateOrder);


export default user;
