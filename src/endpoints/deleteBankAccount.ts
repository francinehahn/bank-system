import {Request, Response} from 'express'
import UserDatabase from '../class/UserDatabase'


export const deleteBankAccount = async (req: Request, res: Response) => {
    let error = 400
    
    try {
        const id = req.params.id

        if(id === ':id') {
            error = 422
            throw new Error('É necessário adicionar o id da conta bancária que deseja deletar.')
        }

        const user = new UserDatabase()
        const idExists = await user.selectUserById(Number(id))
        if (idExists.length === 0) {
            error = 404
            throw new Error('O id da conta bancária não existe.')
        }

        user.delAccountAndStatements(Number(id))
        res.status(200).send('Conta deletada com sucesso!')

    } catch (err: any) {
        res.status(error).send(err.message)
    }
}