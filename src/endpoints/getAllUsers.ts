import {Request, Response} from 'express'
import { connection } from '../data/connection'

//Function that return all user in the database
const selectAllUses = async () => {
    const result = await connection.raw(`
        SELECT * FROM BankClients;
    `)

    return result[0]
}

//Endpoint
export const getAllUsers = async (req: Request, res: Response) => {
    let errorCode= 400

    try {
        const result = await selectAllUses()
        res.status(200).send(result)

    } catch(err: any) {
        res.status(errorCode).send(err.message)
    }
}