import {Request, Response} from 'express'
import UserDatabase from '../class/UserDatabase'


export const getAccountBalance = async (req: Request, res: Response) => {
    let errorCode= 400
    
    try {
        const cpf = req.headers.cpf as string

        if (!cpf) {
            errorCode= 422
            throw new Error("É obrigatório informar o CPF para consultar o saldo.")
        }
        
        const user = new UserDatabase()
        const userExists = await user.selectUserByCpf(cpf)
        
        if(userExists.length === 0) {
            errorCode = 422
            throw new Error("O cpf informado não existe.")
        }

        const balance = await user.getBalance(cpf)
        
        res.status(200).send(balance)        

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}