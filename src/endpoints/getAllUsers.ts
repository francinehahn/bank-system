import {Request, Response} from 'express'
import UserDatabase from '../class/UserDatabase'


export const getAllUsers = async (req: Request, res: Response) => {
    let errorCode= 400

    try {
        const user = new UserDatabase()
        const result = await user.selectAllUses()
        res.status(200).send(result)

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}