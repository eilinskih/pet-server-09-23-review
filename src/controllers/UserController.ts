import { Request, Response } from "express"
import { USERS, sessions } from "../fake_users_store"
import S3Service from "../services/S3Service"

class UserController {
    async me(req: Request, res: Response) {
        
            try{
                const url = await S3Service.getAvatarUrl(req.userId!)
                const {email, username} = USERS.find(user => user.id === req.userId) as typeof USERS[0]
                res.send({
                    photoUrl: url,
                    email: email,
                    username: username
                })
            } catch {
                res.status(500).send({message: 'Internal server error'})
            }
    }

    async login(req: Request, res: Response) {
        try{
            const {login, password} = req.body
            const user = USERS.find((item) => item.email === login && item.password === password)
            if (user) {
                const sessionId = Date.now().toString()
                const expirationDate = Date.now() + 3600000
                sessions[sessionId as keyof typeof sessions] = {
                    userId: user.id,
                    expires: expirationDate
                }
                res.cookie("session_id", sessionId, {expires: new Date(expirationDate), httpOnly: true})
                const url = await S3Service.getAvatarUrl(user.id)
                res.send({
                    photoUrl: url,
                    email: user.email,
                    username: user.username
                })
            } else {
                res.status(403).send({message: 'user not found'})
            }
        } catch(e) {
            console.log(e)
            res.status(500).send({message: 'Internal server error'})
        }
    }

    async updatePhoto(req: Request, res: Response) {
            
            try {
                await S3Service.postAvatar(req.userId!, req.file as Express.Multer.File)
                const uploadedUrl = await S3Service.getAvatarUrl(req.userId!)
                res.status(201).send({photo: uploadedUrl})
            } catch(e) {
                res.status(500).send({message: 'Internal server error'})
        } 
    }

    async deletePhoto(req: Request, res: Response) {
            try {
                await S3Service.deleteAvatar(req.userId!)
                res.status(204).send('deleted!')
            } catch(e) {
                res.status(500).send({message: 'Internal server error'})
            }
}
}

export default new UserController()
