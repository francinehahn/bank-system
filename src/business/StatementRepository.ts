import { Statement, makePaymentsDTO } from "../models/Statement"


export interface StatementRepository {
    getStatementsById (id: string): Promise<Statement[]>
    makePayments (input: makePaymentsDTO, newStatement: Statement): Promise<void>
}