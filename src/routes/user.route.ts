import {Router} from 'express'
import multer from 'multer'
import UserController from '../controllers/UserController'
import { authenticated } from '../middlewares/authenticated'
import uuid from 'uuid'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({storage})
  
router.get('/me', authenticated, UserController.me)

router.post('/login', UserController.login)

router.post('/update-photo', [upload.single('photo'), authenticated], UserController.updatePhoto)

router.delete('/delete-photo', authenticated, UserController.deletePhoto)

export default router