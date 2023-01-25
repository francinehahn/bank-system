import { AddBalanceDTO } from "../models/AddBalanceDTO"
import { BankTransferDTO } from "../models/BankTransferDTO"
import { ReturnBalanceDTO } from "../models/ReturnBalanceDTO"
import User from "../models/User"
import BaseDatabase from "./BaseDatabase"
import { CustomError } from "../error/CustomError"


export default class UserDatabase extends BaseDatabase {
    
    addBalance = async (input: AddBalanceDTO): Promise<void> => {
        try {
            const balance = await BaseDatabase.connection("BankClients").select("balance").where("cpf", input.cpf)
            await BaseDatabase.connection("BankClients").where("cpf", input.cpf).update("balance", balance[0].balance + Number(input.value))

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    bankTransfer = async (input: BankTransferDTO): Promise<void> => {
        try {
            
            const senderBalance = await this.getAccountBalance(input.senderCpf)
            const receiverBalance = await this.getAccountBalance(input.receiverCpf)

            await BaseDatabase.connection("BankClients")
            .where("cpf", input.senderCpf)
            .update("balance", senderBalance.balance - Number(input.value))

            await BaseDatabase.connection("BankClients")
            .where("cpf", input.receiverCpf)
            .update("balance", receiverBalance.balance + Number(input.value))

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    createBankAccount = async (newBankAccount: User): Promise<void> => {
        try {
            await BaseDatabase.connection.insert(newBankAccount).into("BankClients")

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    deleteBankAccount = async (id: number): Promise<void> => {
        try {
            await BaseDatabase.connection("BankClients").where("id", id).del()
            await BaseDatabase.connection("BankStatements").where("user_id", id).del()

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getAccountBalance = async (cpf: string): Promise<ReturnBalanceDTO> => {
        try {
            const balance = await BaseDatabase.connection("BankClients").select("balance").where("cpf", cpf)
            return balance[0]

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }

    
    getAllUsers = async (): Promise<User[]> => {
        try {
            return await BaseDatabase.connection("BankClients").select()

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getUserByCpf = async (cpf: string): Promise<any> => {
        try {
            return await BaseDatabase.connection("BankClients").select().where("cpf", cpf)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getUserById = async (id: number): Promise<any> => {
        try {
            return await BaseDatabase.connection("BankClients").select().where("id", id)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getBankAccountById = async (id: number): Promise<any> => {
        try {
            return await BaseDatabase.connection("BankClients").select().where("id", id)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}