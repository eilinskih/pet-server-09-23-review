import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

class S3Service {
    async getAvatarUrl(userId: number) {
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
              secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY as string,
              accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
            }
        })
        const getObjectParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}avatar`
        }
        const command = new GetObjectCommand(getObjectParams)
            try {
            // checking if the file exists in the s3
            await s3.send(new HeadObjectCommand(getObjectParams))

            const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
            
            return url
            } catch(e) {
                console.log(e)
                return null
            }
    }

    async deleteAvatar(userId: number) {
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
              secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY as string,
              accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
            }
        })
        const getObjectParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}avatar`
        }
        const command = new DeleteObjectCommand(getObjectParams)
        await s3.send(command)
    }

    async postAvatar(userId: number, file: Express.Multer.File) {
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
              secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY as string,
              accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
            }
        })
        const options = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}avatar`,
            Body: file?.buffer,
            ContentType: file?.mimetype
        }
        const s3Command = new PutObjectCommand(options)
        await s3.send(s3Command)
    }
}

export default new S3Service()