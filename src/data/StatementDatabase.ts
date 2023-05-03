import { Statement, outputGetStatementsDTO } from "../models/Statement"
import { CustomError } from "../error/CustomError"
import BaseDatabase from "./BaseDatabase"
import { StatementRepository } from "../business/StatementRepository"
import { updateBalanceDTO } from "../models/Statement"


export default class StatementDatabase extends BaseDatabase implements StatementRepository {
    getUserStatements = async (id: string): Promise<outputGetStatementsDTO[] | []> => {
        try {
            return await BaseDatabase.connection("BankStatements")
            .select("id", "value", "date", "description")
            .where("user_id", id)
            .orderBy("date")

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }

    
    addBalance = async (newStatement: Statement): Promise<void> => {
        try {
            const balance = await BaseDatabase.connection("BankClients").select("balance").where("id", newStatement.user_id)
            
            await BaseDatabase.connection("BankClients")
            .where("id", newStatement.user_id)
            .update("balance", balance[0].balance + newStatement.value)

            await BaseDatabase.connection("BankStatements").insert(newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    bankTransfer = async (updateBalance: updateBalanceDTO, newStatement: Statement): Promise<void> => {
        try {
            const senderBalance = await BaseDatabase.connection("BankClients").select().where("id", newStatement.user_id)
            
            await BaseDatabase.connection("BankClients")
            .where("id", newStatement.user_id)
            .update("balance", senderBalance[0].balance - newStatement.value)
            
            await BaseDatabase.connection("BankClients")
            .where("id", updateBalance.receiverId)
            .update("balance", updateBalance.receiverBalance + newStatement.value)

            await BaseDatabase.connection("BankStatements").insert(newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    makePayments = async (newStatement: Statement): Promise<void> => {
        try {
            await BaseDatabase.connection("BankStatements").insert(newStatement)
            
            const user = await BaseDatabase.connection("BankClients").select().where("id", newStatement.user_id)
            const timeOut = newStatement.date.valueOf() - new Date().valueOf()
            
            setTimeout(async () => await BaseDatabase.connection("BankClients")
            .where("id", newStatement.user_id)
            .update("balance", user[0].balance - Number(newStatement.value)), timeOut)
            
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}