import StatementDatabase from "../data/StatementDatabase"
import UserDatabase from "../data/UserDatabase"
import { CustomError } from "../error/CustomError"
import { InsufficientBalance, InvalidPaymentDate, InvalidValue, MissingDescription } from "../error/StatementErrors"
import { MissingUserCpf, MissingUserId, UserIdNotFound } from "../error/UserErrors"
import { MakePaymentsDTO } from "../models/MakePaymentsDTO"
import Statement from "../models/Statement"


export class StatementBusiness {
    getStatementsById = async (id: number): Promise<Statement[]> => {
        try {
            if (!id) {
                throw new MissingUserId()
            }

            const userDatabase = new UserDatabase()
            const userExists = await userDatabase.getUserById(id)
            
            if (userExists.length === 0) {
                throw new UserIdNotFound()
            }

            const statementDatabase = new StatementDatabase()
            return await statementDatabase.getStatementsById(id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    makePayments = async (input: MakePaymentsDTO): Promise<void> => {
        try {
            if (!input.cpf) {
                throw new MissingUserCpf()
            }
    
            if (input.value <= 0) {
                throw new InvalidValue()
            }
    
            if (!input.description) {
                throw new MissingDescription()
            }

            const userDatabase = new UserDatabase()
            const userExists = await userDatabase.getUserByCpf(input.cpf)
       
            if (userExists.length === 0) {
                throw new UserIdNotFound()
            }

            if (Number(input.value) > userExists[0].balance) {
                throw new InsufficientBalance()
            }

            const today = new Date()
            let paymentDate = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
            
            if (input.date) {
                if (input.date.valueOf() - new Date().valueOf() < 0) {
                    throw new InvalidPaymentDate()
                }

                paymentDate = new Date(input.date.toString().split("/").reverse().join(","))
            }

            const statementDatabase = new StatementDatabase()
            input.date = paymentDate
            
            const newStatement = new Statement(input.value, input.date, input.description, userExists[0].id)
            await statementDatabase.makePayments(input, newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}