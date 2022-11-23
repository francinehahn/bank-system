import {Request, Response} from 'express'
import { userAccounts } from '../data/data'

export const deleteBankAccount = async (req: Request, res: Response) => {
    const accountId = req.params.id
    let error = 400
    
    try {
        if(accountId === ':id') {
            error = 422
            throw new Error('É necessário adicionar o id da conta bancária que deseja deletar.')
        }

        const idExists = userAccounts.filter(item => item.id === accountId)
        if(idExists.length === 0) {
            error = 404
            throw new Error('O id da conta bancária não existe.')
        }

        const accountsNotDeleted = userAccounts.filter(item => item.id !== accountId)
        res.status(201).send(accountsNotDeleted)

    } catch (err: any) {
        res.status(error).send(err.message)
    }
}