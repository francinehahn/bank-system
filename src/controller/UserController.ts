import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { AddBalanceDTO } from "../models/AddBalanceDTO"
import { BankTransferDTO } from "../models/BankTransferDTO"
import { CreateBankAccountDTO } from "../models/CreateBankAccountDTO"


export class UserController {
    addBalance = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: AddBalanceDTO = {cpf: req.body.cpf, value: req.body.value}

            const userBusiness = new UserBusiness()
            await userBusiness.addBalance(input)

            res.status(201).send('Saldo adicionado com sucesso!')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    bankTransfer = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: BankTransferDTO = {
                senderCpf: req.body.senderCpf,
                receiverCpf: req.body.receiverCpf,
                value: req.body.value
            }

            const userBusiness = new UserBusiness()
            await userBusiness.bankTransfer(input)

            res.status(201).send('Transferência realizada com sucesso!')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    createBankAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: CreateBankAccountDTO = {
                name: req.body.name,
                cpf: req.body.cpf,
                birthDate: req.body.birthDate
            }

            const userBusiness = new UserBusiness()
            await userBusiness.createBankAccount(input)

            res.status(201).send('Conta criada com sucesso!')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    deleteBankAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const id: number = Number(req.params.id)

            const userBusiness = new UserBusiness()
            await userBusiness.deleteBankAccount(id)

            res.status(200).send('Conta deletada com sucesso!')
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    getAccountBalance = async (req: Request, res: Response): Promise<void> => {
        try {
            const cpf: string = req.headers.cpf as string

            const userBusiness = new UserBusiness()
            const balance = await userBusiness.getAccountBalance(cpf)

            res.status(200).send(balance)
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }

    
    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const userBusiness = new UserBusiness()
            const result = await userBusiness.getAllUsers()

            res.status(200).send(result)

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }
}