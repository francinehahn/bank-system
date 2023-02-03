import { Statement, makePaymentsDTO } from "../models/Statement"
import { CustomError } from "../error/CustomError"
import BaseDatabase from "./BaseDatabase"
import { StatementRepository } from "../business/StatementRepository"


export default class StatementDatabase extends BaseDatabase implements StatementRepository {
    getStatementsById = async (id: string): Promise<Statement[]> => {
        try {
            return await BaseDatabase.connection("BankStatements").select().where("user_id", id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }

    //usar id do authenticator ao invés do cpf
    makePayments = async (input: makePaymentsDTO, newStatement: Statement): Promise<void> => {
        try {
            await BaseDatabase.connection("BankStatements").insert(newStatement)
            
            const user = await BaseDatabase.connection("BankClients").select().where("id", newStatement.getUserId())
            const timeOut = input.date.valueOf() - new Date().valueOf()
            
            setTimeout(async () => await BaseDatabase.connection("BankClients")
            .where("cpf", input.cpf)
            .update("balance", user[0].balance - Number(input.value)), timeOut)
            
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}