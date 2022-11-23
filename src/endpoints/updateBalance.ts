import {Request, Response} from 'express'
import { userAccounts } from '../data/data'

export const updateBalance = async (req: Request, res: Response) => {
    const cpf = req.headers.cpf as string
    let errorCode = 400
    const today = new Date()

    try {
        if (!cpf) {
            errorCode = 403
            throw new Error("Informe seu CPF para continuar.");
        }

        const getUser = userAccounts.find(user => user.cpf === cpf)

        if (!getUser) {
            errorCode = 401
            throw new Error("Usuário não encontrado no banco de dados.");
        }

        for (let i = 0; i < getUser.statement.length; i++) {
            let timestampArray = getUser.statement[i].date.split("/").map(Number)
            let timestamp = new Date(timestampArray[2], timestampArray[1] - 1, timestampArray[0])

            if (timestamp < today) {
                getUser.balance -= getUser.statement[i].value
            }

            getUser.balance = Number(getUser.balance.toFixed(2))
        }

        res.status(200).send(`Saldo atualizado: R$ ${getUser.balance}`)

    } catch (err:any) {
        res.status(errorCode).send(err.message)
    }
}