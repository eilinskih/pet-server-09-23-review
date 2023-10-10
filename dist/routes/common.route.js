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
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const fake_users_store_1 = require("../fake_users_store");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
    }
});
router.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.headers.authorization) {
        res.status(403).send({ message: 'Please, authorize first' });
    }
    const authData = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const [authDatalogin, authDatapassword] = Buffer.from(authData, 'base64').toString('ascii').split(':');
    const user = fake_users_store_1.USERS.find(({ email, password }) => authDatalogin === email && authDatapassword === password);
    if (!user) {
        res.status(401).send({ message: 'User not found' });
    }
    if (user) {
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: 'avatar'
        };
        const command = new client_s3_1.GetObjectCommand(getObjectParams);
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
        res.send({
            photoUrl: url,
            email: user.email,
            username: user.username
        });
    }
}));
router.post('/update-photo', upload.single('photo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    const options = {
        Bucket: process.env.BUCKET_NAME,
        Key: `avatar.${(_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname.split('.')[1]}`,
        Body: (_c = req.file) === null || _c === void 0 ? void 0 : _c.buffer,
        ContentType: (_d = req.file) === null || _d === void 0 ? void 0 : _d.mimetype
    };
    const s3Command = new client_s3_1.PutObjectCommand(options);
    yield s3.send(s3Command).catch(e => console.log(e));
    const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `avatar.${(_e = req.file) === null || _e === void 0 ? void 0 : _e.originalname.split('.')[1]}`
    };
    const command = new client_s3_1.GetObjectCommand(getObjectParams);
    const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
    res.send({
        photoUrl: url,
    });
}));
exports.default = router;
