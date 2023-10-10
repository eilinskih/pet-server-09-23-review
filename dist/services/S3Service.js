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
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class S3Service {
    getAvatarUrl(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = new client_s3_1.S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID
                }
            });
            const getObjectParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${userId}avatar`
            };
            const command = new client_s3_1.GetObjectCommand(getObjectParams);
            try {
                // checking if the file exists in the s3
                yield s3.send(new client_s3_1.HeadObjectCommand(getObjectParams));
                const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
                return url;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    deleteAvatar(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = new client_s3_1.S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID
                }
            });
            const getObjectParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${userId}avatar`
            };
            const command = new client_s3_1.DeleteObjectCommand(getObjectParams);
            yield s3.send(command);
        });
    }
    postAvatar(userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = new client_s3_1.S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID
                }
            });
            const options = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${userId}avatar`,
                Body: file === null || file === void 0 ? void 0 : file.buffer,
                ContentType: file === null || file === void 0 ? void 0 : file.mimetype
            };
            const s3Command = new client_s3_1.PutObjectCommand(options);
            yield s3.send(s3Command);
        });
    }
}
exports.default = new S3Service();
