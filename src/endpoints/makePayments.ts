import {Request, Response} from 'express'
import { userAccounts } from '../data/data'

export const makePayments = async (req: Request, res: Response) => {
    const userCpf = req.headers.cpf as string
    const {value, date, description} = req.body
    let errorCode = 400

    try {
        if (!userCpf) {
            errorCode = 403
            throw new Error("Informe seu CPF para continuar.");
        }

        const getUser = userAccounts.find(user => user.cpf === userCpf)

        if (!getUser) {
            errorCode = 401
            throw new Error("Usuário não encontrado no banco de dados.");
        }

        if (value === 0) {
            errorCode = 422
            throw new Error("O valor da conta não pode ser nulo.");
        }

        if (value > getUser.balance) {
            errorCode = 401
            throw new Error("Saldo insuficiente.");
        }

        if (!description) {
            errorCode = 422
            throw new Error("Adicione uma descrição para esta transação.");
        }

        let paymentDate: string

        const today = new Date()

        if (!date) {
            const day = today.getDate();
            const month = (today.getMonth() > 9 ? `${today.getMonth() + 1}` : `0${today.getMonth() + 1}`);
            const year = today.getFullYear();
            paymentDate = `${day}/${month}/${year}`
        } else {
            paymentDate = date
        }

        const informedDateArray = date.split("/").map(Number)
        let hours = today.getHours()
        let minutes = today.getMinutes()
        let seconds = today.getSeconds()
        let informedDate = new Date(informedDateArray[2], informedDateArray[1] - 1, informedDateArray[0], hours + 3, minutes, seconds)

        if (informedDate < today) {
            errorCode = 404
            throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.");
        }

        const payment = {
            value,
            date: paymentDate,
            description
        }

        getUser.statement.push(payment)
        res.status(201).send(getUser)

    } catch (err:any) {
        res.status(errorCode).send(err.message)
    }
}