import { MakePaymentsDTO } from "../models/MakePaymentsDTO"
import { CustomError } from "../error/CustomError"
import Statement from "../models/Statement"
import BaseDatabase from "./BaseDatabase"
import UserDatabase from "./UserDatabase"


export default class StatementDatabase extends BaseDatabase {
    getStatementsById = async (id: number): Promise<Statement[]> => {
        try {
            return await BaseDatabase.connection("BankStatements").select().where("user_id", id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    makePayments = async (input: MakePaymentsDTO, newStatement: Statement): Promise<void> => {
        try {
            await BaseDatabase.connection("BankStatements").insert(newStatement)
            
            const userDatabase = new UserDatabase()
            const user = await userDatabase.getUserById(newStatement.getUserId())

            const timeOut = input.date.valueOf() - new Date().valueOf()
            
            setTimeout(async () => await BaseDatabase.connection("BankClients")
            .where("cpf", input.cpf)
            .update("balance", user[0].balance - Number(input.value)), timeOut)
            
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}