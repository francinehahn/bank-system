import {Request, Response} from 'express'
import { connection } from '../data/connection'


//Function to know whether the user exists in the database
const selectUserByCpf = async (cpf: string) => {
    const result = await connection.raw(`
        SELECT * FROM BankClients WHERE cpf = '${cpf}';
    `)
    
    return result[0]
}

//Function that returns the balance from a user
const selectBalance = async (cpf: string) => {
    const result = await connection.raw(`
        SELECT balance FROM BankClients WHERE cpf = '${cpf}';
    `)

    return result[0][0].balance
}

//Function to update the sender balance
const updateSenderBalance = async (balance: number, value: number, cpf: string) => {
    await connection.raw(`
        UPDATE BankClients SET balance = ${balance - value} WHERE cpf = '${cpf}';
    `)
}

//Function to update the receiver balance
const updateReceiverBalance = async (balance: number, value: number, cpf: string) => {
    await connection.raw(`
        UPDATE BankClients SET balance = ${balance + value} WHERE cpf = '${cpf}';
    `)
}

//Endpoint
export const bankTransfer = async (req: Request, res: Response) => {
    const {senderCpf, receiverCpf, value} = req.body
    let error = 400

    try {
        if (!senderCpf && !receiverCpf && !value) {
            error = 422
            throw new Error('É obrigatório fornecer o CPF do usuário que irá fazer a transferência, o CPF do usuário que irá receber a transferência e a quantia que será transferida.')
        } else if (!senderCpf) {
            error = 422
            throw new Error('É obrigatório fornecer o CPF do usuário que irá fazer a transferência.')
        } else if (!receiverCpf) {
            error = 422
            throw new Error('É obrigatório fornecer o CPF do usuário que irá receber a transferência.')
        } else if (!value) {
            error = 422
            throw new Error('É obrigatório fornecer o valor que será transferido.')
        }

        const senderCpfExists = await selectUserByCpf(senderCpf)
        if (senderCpfExists.length === 0) {
            error = 422
            throw new Error('O cpf do usuário que irá fazer a transferência não existe.')
        }

        const receiverCpfExists = await selectUserByCpf(receiverCpf)
        if (receiverCpfExists.length === 0) {
            error = 422
            throw new Error('O cpf do usuário que irá receber a transferência não existe.')
        }


        const senderBalance = await selectBalance(senderCpf)
        const receiverBalance = await selectBalance(receiverCpf)

        if (senderBalance < value) {
            error = 401
            throw new Error('Não há saldo suficiente na conta do usuário para realizar a transferência.')
        }
        
        await updateSenderBalance(senderBalance, value, senderCpf)
        await updateReceiverBalance(receiverBalance, value, receiverCpf)

        res.status(201).send('Transferência realizada com sucesso!')

    } catch (err: any) {
        res.status(error).send(err.message)
    }
}