import {Request, Response} from 'express'
import { userAccounts } from '../data/data'

export const getAccountBalance = async (req: Request, res: Response) => {
    const name = req.headers.name as string
    const cpf = req.headers.cpf as string
    let errorCode= 400
    let userBalance
    
    try {
        if(!name && !cpf){
            errorCode= 422
            throw new Error("É obrigatório informar o nome completo e o CPF para consultar seu saldo.")
        }
        
        if(!name){
            errorCode= 422
            throw new Error("Informe o seu nome completo.")            
        }
        
        if(!cpf){
            errorCode= 422
            throw new Error("Informe o seu CPF.")            
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
               userBalance = user.balance
            }
        }
        
        res.status(200).send(`${userBalance}`)        

    } catch (e: any) {
        res.status(errorCode).send(e.message)
    }
}