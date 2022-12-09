import {Request, Response} from 'express'
import UserDatabase from '../class/UserDatabase'


export const addBalance = async (req: Request, res: Response) => {
    let errorCode= 400

    try {
        const {cpf, value} = req.body

        if (!cpf && !value) {
            errorCode= 422
            throw new Error("É obrigatório informar o CPF e o valor que você deseja adicionar.")
        } else if (!cpf) {
            errorCode= 422
            throw new Error("Informe o seu CPF.")            
        } else if (!value) {
            errorCode= 422
            throw new Error("Informe o valor que você deseja adicionar.")
        }

        const user = new UserDatabase()
        const userExists = await user.selectUserByCpf(cpf)

        if (userExists.length === 0) {
            errorCode= 422
            throw new Error("Usuário não encontrado.")            
        }

        const balance = await user.getBalance(cpf)
        console.log(balance)
        user.updateReceiverBalance(balance.balance, Number(value), cpf)
        
        res.status(201).send('Saldo adicionado com sucesso!') 

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    } 
}