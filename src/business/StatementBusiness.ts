import { CustomError } from "../error/CustomError"
import { InsufficientBalance, InvalidPaymentDate, InvalidValue, MissingDescription } from "../error/StatementErrors"
import { MissingToken } from "../error/UserErrors"
import { Statement, makePaymentsDTO } from "../models/Statement"
import { StatementRepository } from "./StatementRepository"
import { UserRepository } from "./UserRepository"
import { generateId } from "../services/generateId"
import { Authenticator } from "../services/Authenticator"


export class StatementBusiness {
    constructor (private statementDatabase: StatementRepository, private userDatabase: UserRepository) {}

    getStatementsById = async (token: string): Promise<Statement[]> => {
        try {
            if (!token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(token)

            return await this.statementDatabase.getStatementsById(id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    makePayments = async (input: makePaymentsDTO): Promise<void> => {
        try {
            if (input.value <= 0) {
                throw new InvalidValue()
            }
    
            if (!input.description) {
                throw new MissingDescription()
            }

            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(input.token)
            const user = await this.userDatabase.getUser("id", id)

            if (Number(input.value) > user[0].balance) {
                throw new InsufficientBalance()
            }

            const today = new Date()
            let paymentDate = new Date(`${today.getFullYear()},${today.getMonth() + 1},${today.getDate()}`)
            
            if (input.date) {
                if (input.date.valueOf() - new Date().valueOf() < 0) {
                    throw new InvalidPaymentDate()
                }

                paymentDate = new Date(input.date.toString().split("/").reverse().join(","))
            }

            input.date = paymentDate
            
            const userId = generateId()
            const newStatement = new Statement(userId, input.value, input.date, input.description, user[0].id)
            await this.statementDatabase.makePayments(input, newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}