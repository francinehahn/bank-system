import { Statement } from "../models/Statement"
import { CustomError } from "../error/CustomError"
import BaseDatabase from "./BaseDatabase"
import { StatementRepository } from "../business/StatementRepository"
import { updateBalanceDTO } from "../models/Statement"


export default class StatementDatabase extends BaseDatabase implements StatementRepository {
    getUserStatements = async (id: string): Promise<Statement[] | []> => {
        try {
            return await BaseDatabase.connection("BankStatements").select().where("user_id", id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }

    
    addBalance = async (newStatement: Statement): Promise<void> => {
        try {
            const balance = await BaseDatabase.connection("BankClients").select("balance").where("id", newStatement.getUserId())
            
            await BaseDatabase.connection("BankClients")
            .where("id", newStatement.getUserId())
            .update("balance", balance[0].balance + newStatement.getValue())

            await BaseDatabase.connection("BankStatements").insert(newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    bankTransfer = async (updateBalance: updateBalanceDTO, newStatement: Statement): Promise<void> => {
        try {
            const senderBalance = await BaseDatabase.connection("BankClients").select().where("id", newStatement.getUserId())
            
            await BaseDatabase.connection("BankClients")
            .where("id", newStatement.getUserId())
            .update("balance", senderBalance[0].balance - newStatement.getValue())
            
            await BaseDatabase.connection("BankClients")
            .where("id", updateBalance.receiverId)
            .update("balance", updateBalance.receiverBalance + newStatement.getValue())

            await BaseDatabase.connection("BankStatements").insert(newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    makePayments = async (newStatement: Statement): Promise<void> => {
        try {
            await BaseDatabase.connection("BankStatements").insert(newStatement)
            
            const user = await BaseDatabase.connection("BankClients").select().where("id", newStatement.getUserId())
            const timeOut = newStatement.getDate().valueOf() - new Date().valueOf()
            
            setTimeout(async () => await BaseDatabase.connection("BankClients")
            .where("id", newStatement.getUserId())
            .update("balance", user[0].balance - Number(newStatement.getValue())), timeOut)
            
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}