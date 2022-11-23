import {Request, Response} from 'express'
import { userAccounts } from '../data/data'


export const bankTransfer = async (req: Request, res: Response) => {
    const {senderName, senderCpf, receiverName, receiverCpf, amountOfMoney} = req.body
    let error = 400

    try {
        if (!senderName && !senderCpf && !receiverName && !receiverCpf && !amountOfMoney) {
            error = 422
            throw new Error('É obrigatório fornecer o nome e o CPF do usuário que irá fazer a transferência, o nome e o CPF do usuário que irá receber a transferência e a quantia que será transferida.')
        } else if (!senderName) {
            error = 422
            throw new Error('É obrigatório fornecer o nome do usuário que irá fazer a transferência.')
        } else if (!senderCpf) {
            error = 422
            throw new Error('É obrigatório fornecer o CPF do usuário que irá fazer a transferência.')
        } else if (!receiverName) {
            error = 422
            throw new Error('É obrigatório fornecer o nome do usuário que irá receber a transferência.')
        } else if (!receiverCpf) {
            error = 422
            throw new Error('É obrigatório fornecer o CPF do usuário que irá receber a transferência.')
        } else if (!amountOfMoney) {
            error = 422
            throw new Error('É obrigatório fornecer o valor que será transferido.')
        }

        const userThatWillTransferExists = userAccounts.filter(item => item.name === senderName && item.cpf === senderCpf)
        if (userThatWillTransferExists.length === 0) {
            error = 422
            throw new Error('Os dados do usuário que irá fazer a transferência estão incorretos.')
        }

        const userThatWillReceiveExists = userAccounts.filter(item => item.name === receiverName && item.cpf === receiverCpf)
        if (userThatWillReceiveExists.length === 0) {
            error = 422
            throw new Error('Os dados do usuário que irá receber a transferência estão incorretos.')
        }

        for (let user of userAccounts) {
            if (user.name === senderName) {
                if (user.balance >= amountOfMoney) {
                    user.balance = user.balance - Number(amountOfMoney)
                } else {
                    error = 401
                    throw new Error('Não há saldo suficiente na conta do usuário para realizar a transferência.')
                }
            }
            if (user.name === receiverName) {
                user.balance = user.balance + Number(amountOfMoney)
            }
        }

        res.status(201).send(userAccounts)

    } catch (err: any) {
        res.status(error).send(err.message)
    }
}