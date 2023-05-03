import { User, returnBalanceDTO } from "../models/User"
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


    deleteBankAccount = async (id: string): Promise<void> => {
        try {
            await BaseDatabase.connection("BankStatements").where("user_id", id).del()
            await BaseDatabase.connection("BankClients").where("id", id).del()

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


    getUser = async (column: string, value: string): Promise<User | undefined> => {
        try {
            const result = await BaseDatabase.connection("BankClients").select().where(column, value)
            return result[0]
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}