import {Request, Response} from 'express'
import { connection } from '../data/connection'


//Function to know whether the user exists in the database
const selectUserByCpf = async (cpf: string) => {
    const result = await connection.raw(`
        SELECT * FROM BankClients WHERE cpf = '${cpf}';
    `)
    
    return result[0]
}

//Function to update balance
const updateBalance = async (balance: number, value: number, cpf: string) => {
    await connection.raw(`
        UPDATE BankClients SET balance = ${balance + value} WHERE cpf = '${cpf}';
    `)
}

//Function to get balance
const getBalance = async (cpf: string) => {
    const result = await connection.raw(`
        SELECT balance FROM BankClients WHERE cpf = '${cpf}';
    `)

    return result[0][0].balance
}

//Endpoint
export const addBalance = async (req: Request, res: Response) => {
    const {cpf, value} = req.body
    let errorCode= 400

    try {
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

        const userExists = await selectUserByCpf(cpf)

        if (userExists.length === 0) {
            errorCode= 422
            throw new Error("Usuário não encontrado.")            
        }

        const balance = await getBalance(cpf)
        updateBalance(Number(balance), Number(value), cpf)
        
        res.status(201).send('Saldo adicionado com sucesso!') 

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    } 
}