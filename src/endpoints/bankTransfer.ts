import {Request, Response} from 'express'
import UserDatabase from '../class/UserDatabase'


export const bankTransfer = async (req: Request, res: Response) => {
    let error = 400

    try {
        const {senderCpf, receiverCpf, value} = req.body

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

        const user = new UserDatabase()
        const senderCpfExists = await user.selectUserByCpf(senderCpf)
        if (senderCpfExists.length === 0) {
            error = 422
            throw new Error('O cpf do usuário que irá fazer a transferência não existe.')
        }

        const receiverCpfExists = await user.selectUserByCpf(receiverCpf)
        if (receiverCpfExists.length === 0) {
            error = 422
            throw new Error('O cpf do usuário que irá receber a transferência não existe.')
        }


        const senderBalance = await user.getBalance(senderCpf)
        const receiverBalance = await user.getBalance(receiverCpf)

        if (senderBalance.balance < value) {
            error = 401
            throw new Error('Não há saldo suficiente na conta do usuário para realizar a transferência.')
        }
        
        await user.updateSenderBalance(senderBalance.balance, value, senderCpf)
        await user.updateReceiverBalance(receiverBalance.balance, value, receiverCpf)

        res.status(201).send('Transferência realizada com sucesso!')

    } catch (err: any) {
        res.status(error).send(err.message)
    }
}