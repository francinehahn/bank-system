import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { inputAddBalanceDTO, loginInputDTO } from "../models/User"
import { inputBankTransferDTO, inputSignUpDTO } from "../models/User"


export class UserController {
    constructor(private userBusiness: UserBusiness) {}


    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputSignUpDTO = {
                name: req.body.name,
                cpf: req.body.cpf,
                birthDate: req.body.birthDate,
                password: req.body.password
            }

            const token = await this.userBusiness.signup(input)
            res.status(201).send({message: 'Conta criada com sucesso!', token})

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: loginInputDTO = {
                cpf: req.body.cpf,
                password: req.body.password
            }

            const token = await this.userBusiness.login(input)
            res.status(200).send({token})

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    addBalance = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputAddBalanceDTO = {
                value: req.body.value,
                token: req.headers.authorization as string
            }

            await this.userBusiness.addBalance(input)

            res.status(201).send('Saldo adicionado com sucesso!')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    bankTransfer = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputBankTransferDTO = {
                senderCpf: req.body.senderCpf,
                receiverCpf: req.body.receiverCpf,
                value: req.body.value,
                token: req.headers.authorization as string
            }

            await this.userBusiness.bankTransfer(input)
            res.status(201).send('Transferência realizada com sucesso!')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    deleteBankAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string

            await this.userBusiness.deleteBankAccount(token)
            res.status(200).send('Conta deletada com sucesso!')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    getAccountBalance = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string

            const balance = await this.userBusiness.getAccountBalance(token)
            res.status(200).send(balance)

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }

    
    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.userBusiness.getAllUsers()
            res.status(200).send(result)

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }
}