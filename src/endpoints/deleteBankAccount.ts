import {Request, Response} from 'express'
import { connection } from '../data/connection'


//Function to know whether the user exists in the database
const selectUserById = async (id: number) => {
    const result = await connection.raw(`
        SELECT * FROM BankClients WHERE id = '${id}';
    `)
    
    return result[0]
}


//Function to delete bank account and user statements
const delAccountAndStatements = async (id: number) => {
    await connection.raw(`
        DELETE FROM BankClients WHERE id = '${id}';
    `)

    await connection.raw(`
        DELETE FROM BankStatements WHERE user_statement = '${id}';
    `)
}

//Endpoint
export const deleteBankAccount = async (req: Request, res: Response) => {
    const id = req.params.id
    let error = 400
    
    try {
        if(id === ':id') {
            error = 422
            throw new Error('É necessário adicionar o id da conta bancária que deseja deletar.')
        }

        const idExists = await selectUserById(Number(id))
        if (idExists.length === 0) {
            error = 404
            throw new Error('O id da conta bancária não existe.')
        }

        delAccountAndStatements(Number(id))
        res.status(200).send('Conta deletada com sucesso!')

    } catch (err: any) {
        res.status(error).send(err.message)
    }
}