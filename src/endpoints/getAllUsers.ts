import {Request, Response} from 'express'
import { userAccounts } from '../data/data'

export const getAllUsers = async (req: Request, res: Response) => {
    let errorCode= 400

    try{
        res.status(200).send(userAccounts)
    } catch(e: any){
        res.status(errorCode).send(e.message)
    }
}