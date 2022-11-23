import {Request, Response} from 'express'
import { connection } from '../data/connection'

const selectAllUses = async () => {
    const result = await connection.raw(`
        SELECT * FROM BankClients;
    `)

    return result[0]
}

export const getAllUsers = async (req: Request, res: Response) => {
    let errorCode= 400

    try {
        const result = await selectAllUses()
        res.status(200).send(result)

    } catch(err: any) {
        res.status(errorCode).send(err.message)
    }
}