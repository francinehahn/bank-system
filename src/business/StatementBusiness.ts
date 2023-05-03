import { CustomError } from "../error/CustomError"
import { InsufficientBalance, InvalidPaymentDate, InvalidValue, MissingDescription, MissingValue, NoStatementsFound } from "../error/StatementErrors"
import { InvalidReceiverCpf, MissingReceiverCpf, MissingToken } from "../error/UserErrors"
import { Statement, makePaymentsDTO, updateBalanceDTO, inputAddBalanceDTO, inputBankTransferDTO } from "../models/Statement"
import { StatementRepository } from "./StatementRepository"
import { UserRepository } from "./UserRepository"
import { generateId } from "../services/generateId"
import { Authenticator } from "../services/Authenticator"


export class StatementBusiness {
    constructor (private statementDatabase: StatementRepository, private userDatabase: UserRepository) {}

    getUserStatements = async (token: string): Promise<Statement[]> => {
        try {
            if (!token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(token)

            const result = await this.statementDatabase.getUserStatements(id)
            if (result.length === 0) {
                throw new NoStatementsFound()
            }

            return result

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    addBalance = async (input: inputAddBalanceDTO): Promise<void> => {
        try {            
            if (!input.value) {
                throw new MissingValue()
            }
    
            if (input.value <= 0) {
                throw new InvalidValue()
            }

            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(input.token)

            const statementId = generateId()

            let today = new Date()
            today = new Date(`${today.getFullYear()}, ${today.getMonth() + 1}, ${today.getDate()}`)

            const description = `Adição de crédito no valor de R$${input.value},00`
            const newStatement = new Statement(statementId, input.value, today, description, id)

            await this.statementDatabase.addBalance(newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    bankTransfer = async (input: inputBankTransferDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }
            if (!input.receiverCpf) {
                throw new MissingReceiverCpf()
            }
            if (!input.value) {
                throw new MissingValue()
            }
            if (input.value <= 0) {
                throw new InvalidValue()
            }

            const receiverCpfExists = await this.userDatabase.getUser("cpf", input.receiverCpf)
            if (!receiverCpfExists) {
                throw new InvalidReceiverCpf()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(input.token)

            const userBalance = await this.userDatabase.getAccountBalance(id)
            
            if (userBalance.balance < Number(input.value)) {
                throw new InsufficientBalance()
            }

            const updateBalance: updateBalanceDTO = {
                receiverId: receiverCpfExists.id,
                receiverBalance: receiverCpfExists.balance
            }

            const statementId = generateId()

            let today = new Date()
            today = new Date(`${today.getFullYear()}, ${today.getMonth() + 1}, ${today.getDate()}`)

            const description = `Transferência de R$${input.value},00 para o cpf ${input.receiverCpf}`
            const newStatement = new Statement(statementId, input.value, today, description, id)

            await this.statementDatabase.bankTransfer(updateBalance, newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    makePayments = async (input: makePaymentsDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(input.token)

            if (input.value <= 0) {
                throw new InvalidValue()
            }
    
            if (!input.description) {
                throw new MissingDescription()
            }

            const user = await this.userDatabase.getUser("id", id)

            if (Number(input.value) > user!.balance) {
                throw new InsufficientBalance()
            }

            const today = new Date()
            let paymentDate = new Date(`${today.getFullYear()},${today.getMonth() + 1},${today.getDate()}`)
            
            if (input.date) {
                const editedDate = new Date(input.date.split("/").reverse().join(","))
                
                if (editedDate.valueOf() < today.valueOf()) {
                    throw new InvalidPaymentDate()
                }

                paymentDate = editedDate 
            }
            
            const statementId = generateId()
            const newStatement = new Statement(statementId, input.value, paymentDate, input.description, user!.id)
            await this.statementDatabase.makePayments(newStatement)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}