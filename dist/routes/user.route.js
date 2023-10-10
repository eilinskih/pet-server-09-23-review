"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const authenticated_1 = require("../middlewares/authenticated");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.get('/me', authenticated_1.authenticated, UserController_1.default.me);
router.post('/login', UserController_1.default.login);
router.post('/update-photo', [upload.single('photo'), authenticated_1.authenticated], UserController_1.default.updatePhoto);
router.delete('/delete-photo', authenticated_1.authenticated, UserController_1.default.deletePhoto);
exports.default = router;
