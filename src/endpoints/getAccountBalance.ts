import {Request, Response} from 'express'
import UserDatabase from '../class/UserDatabase'


export const getAccountBalance = async (req: Request, res: Response) => {
    const cpf = req.headers.cpf as string
    let errorCode= 400
    
    try {
        if (!cpf) {
            errorCode= 422
            throw new Error("É obrigatório informar o CPF para consultar o saldo.")
        }
        
        const user = new UserDatabase()
        const balance = await user.getBalance(cpf)

        if (!balance) {
            errorCode= 422
            throw new Error("Usuário não encontrado.")            
        }
        
        res.status(200).send(balance)        

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}