import {Request, Response} from 'express'
import { connection } from '../data/connection'


//Function that returns the balance from a user
const selectBalance = async (cpf: string) => {
    const result = await connection.raw(`
        SELECT balance FROM BankClients WHERE cpf = '${cpf}';
    `)

    return result[0][0]
}

//Endpoint
export const getAccountBalance = async (req: Request, res: Response) => {
    const cpf = req.headers.cpf as string
    let errorCode= 400
    
    try {
        if (!cpf) {
            errorCode= 422
            throw new Error("É obrigatório informar o CPF para consultar o saldo.")
        }
        
        const balance = await selectBalance(cpf)

        if (!balance) {
            errorCode= 422
            throw new Error("Usuário não encontrado.")            
        }
        
        res.status(200).send(balance)        

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}