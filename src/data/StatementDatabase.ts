import Statement from "../types/Statement"
import BaseDatabase from "./BaseDatabase"

export default class StatementDatabase extends BaseDatabase {
    getStatementsById = async (id: string): Promise<Statement[]> => {
        try {
            const userExists = await BaseDatabase.connection("BankClients").select().where("id", id)
            
            if (userExists.length === 0) {
                throw new Error("Usuário não encontrado.")
            }

            const result = await BaseDatabase.connection("BankStatements").select().where("user_id", id)
            return result

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    makePayments = async ({cpf, value, paymentDate, description}: any): Promise<void> => {
        try {
            const userExists = await BaseDatabase.connection("BankClients").select().where("cpf", cpf)
       
            if (userExists.length === 0) {
                throw new Error("Usuário não encontrado no banco de dados.")
            }

            if (Number(value) > userExists[0].balance) {
                throw new Error("Saldo insuficiente.")
            }

            const newStatement = new Statement(value, paymentDate, description, userExists[0].id)
            await BaseDatabase.connection("BankStatements").insert(newStatement)
            
            if (!paymentDate) {
                await BaseDatabase.connection("BankClients").where("cpf", cpf).update("balance", userExists[0].balance - Number(value))
            } else {
                const correctFormatDate = paymentDate.split("/")
                const timeOut = new Date(`${correctFormatDate[2]}-${correctFormatDate[1]}-${correctFormatDate[0]}`).valueOf() - new Date().valueOf()
                setTimeout(async () => await BaseDatabase.connection("BankClients").where("cpf", cpf).update("balance", userExists[0].balance - Number(value)), timeOut)
            } 
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}