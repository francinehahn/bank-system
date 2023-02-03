import { User, inputBankTransferDTO, returnBalanceDTO, insertBalanceDTO } from "../models/User"
import BaseDatabase from "./BaseDatabase"
import { CustomError } from "../error/CustomError"
import { UserRepository } from "../business/UserRepository"


export default class UserDatabase extends BaseDatabase implements UserRepository {
    
    signup = async (newBankAccount: User): Promise<void> => {
        try {
            await BaseDatabase.connection.insert(newBankAccount).into("BankClients")

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    addBalance = async (insertBalance: insertBalanceDTO): Promise<void> => {
        try {
            const balance = await BaseDatabase.connection("BankClients").select("balance").where("id", insertBalance.id)
            
            await BaseDatabase.connection("BankClients")
            .where("id", insertBalance.id)
            .update("balance", balance[0].balance + Number(insertBalance.value))

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    bankTransfer = async (input: inputBankTransferDTO): Promise<void> => {
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


    deleteBankAccount = async (id: string): Promise<void> => {
        try {
            await BaseDatabase.connection("BankClients").where("id", id).del()
            await BaseDatabase.connection("BankStatements").where("user_id", id).del()

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getAccountBalance = async (id: string): Promise<returnBalanceDTO> => {
        try {
            const balance = await BaseDatabase.connection("BankClients").select("balance").where({id})
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


    getUser = async (column: string, value: string): Promise<any> => {
        try {
            return await BaseDatabase.connection("BankClients").select().where(column, value)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}