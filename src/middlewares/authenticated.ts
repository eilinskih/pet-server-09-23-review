import { NextFunction, Request, Response } from "express";
import { USERS, sessions } from "../fake_users_store";

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies['session_id']

    if (!sessionId) {
        res.status(403).send({message: 'Please, authorize first'})
    }
    if (sessions[sessionId]?.expires < Date.now()) {
        res.status(403).send({message: 'Session expired'})
    }
    const user = USERS.find(({id}) => sessions[sessionId]?.userId === id)
    if (user) {
        req.userId = user.id
        next()
    } else {
        res.status(401).send({message: 'User not found'})
    }
} catch(e) {
    console.log(e)
}
}
