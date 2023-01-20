import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"


export class UserController {
    addBalance = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400
    
        try {
            const {cpf, value} = req.body
            const userBusiness = new UserBusiness()
            await userBusiness.addBalance({cpf, value})
            res.status(201).send('Saldo adicionado com sucesso!')

        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }

    bankTransfer = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400
    
        try {
            const {senderCpf, receiverCpf, value} = req.body

            const userBusiness = new UserBusiness()
            await userBusiness.bankTransfer({senderCpf, receiverCpf, value})
            res.status(201).send('Transferência realizada com sucesso!')

        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }

    createBankAccount = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400
    
        try {
            const {name, cpf, birthDate} = req.body
            const userBusiness = new UserBusiness()
            await userBusiness.createBankAccount({name, cpf, birthDate})
            res.status(201).send('Conta criada com sucesso!')
        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }

    deleteBankAccount = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400

        try {
            const id = req.params.id
            const userBusiness = new UserBusiness()
            await userBusiness.deleteBankAccount(id)
            res.status(200).send('Conta deletada com sucesso!')
        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }

    getAccountBalance = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400

        try {
            const cpf = req.headers.cpf as string
            const userBusiness = new UserBusiness()
            const balance = await userBusiness.getAccountBalance(cpf)
            res.status(200).send(balance)
        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400

        try {
            const userBusiness = new UserBusiness()
            const result = await userBusiness.getAllUsers()
            res.status(200).send(result)
        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }
}