"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_users_store_1 = require("../fake_users_store");
const S3Service_1 = __importDefault(require("../services/S3Service"));
class UserController {
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield S3Service_1.default.getAvatarUrl(req.userId);
                const { email, username } = fake_users_store_1.USERS.find(user => user.id === req.userId);
                res.send({
                    photoUrl: url,
                    email: email,
                    username: username
                });
            }
            catch (_a) {
                res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, password } = req.body;
                const user = fake_users_store_1.USERS.find((item) => item.email === login && item.password === password);
                if (user) {
                    const sessionId = Date.now().toString();
                    const expirationDate = Date.now() + 3600000;
                    fake_users_store_1.sessions[sessionId] = {
                        userId: user.id,
                        expires: expirationDate
                    };
                    res.cookie("session_id", sessionId, { expires: new Date(expirationDate), httpOnly: true });
                    const url = yield S3Service_1.default.getAvatarUrl(user.id);
                    res.send({
                        photoUrl: url,
                        email: user.email,
                        username: user.username
                    });
                }
                else {
                    res.status(403).send({ message: 'user not found' });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    updatePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield S3Service_1.default.postAvatar(req.userId, req.file);
                const uploadedUrl = yield S3Service_1.default.getAvatarUrl(req.userId);
                res.status(201).send({ photo: uploadedUrl });
            }
            catch (e) {
                res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    deletePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield S3Service_1.default.deleteAvatar(req.userId);
                res.status(204).send('deleted!');
            }
            catch (e) {
                res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = new UserController();
