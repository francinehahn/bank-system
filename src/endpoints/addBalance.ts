import {Request, Response} from 'express'
import { userAccounts } from '../data/data'


export const addBalance = async (req: Request, res: Response) => {
    const name = req.headers.name as string
    const cpf = req.headers.cpf as string
    const valueToAdd = Number(req.body.valueToAdd)
    let userBalance
    let userAdd 
    let errorCode= 400

    try {
        if(!name && !cpf && !valueToAdd){
            errorCode= 422
            throw new Error("É obrigatório informar o nome completo, o CPF e o valor que você deseja adicionar.")
        }        
        
        if(!name){
            errorCode= 422
            throw new Error("Informe o seu nome completo.")            
        }
        
        if(!cpf){
            errorCode= 422
            throw new Error("Informe o seu CPF.")            
        }

        if(!valueToAdd){
            errorCode= 422
            throw new Error("Informe o valor que você deseja adicionar.")
        }

        const userExisting = userAccounts.filter((user)=>{
            if(user.name.toLowerCase() === name.toLowerCase() && user.cpf === cpf){
                return user
            }
        })

        if(userExisting.length === 0){
            errorCode= 422
            throw new Error("Usuário não encontrado.")            
        }

        for(let user of userAccounts){
            if(user.name.toLowerCase() === name.toLowerCase() && user.cpf === cpf){
               user.balance = user.balance + valueToAdd
               userBalance = user.balance
               user.statement.push({
                value: valueToAdd, 
                date: new Date().toString(), 
                description: 'Depósito de dinheiro'
               })
               userAdd = user.statement[user.statement.length -1]
            }
        }

        res.status(200).send(`${userAdd?.date}
        O saldo foi adicionado com sucesso! Seu novo saldo é: ${userBalance}.`) 

    } catch(e: any) {
        res.status(errorCode).send(e.message)
    } 
}