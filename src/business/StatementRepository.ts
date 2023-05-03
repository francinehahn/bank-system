import { Statement, outputGetStatementsDTO } from "../models/Statement"
import { updateBalanceDTO } from "../models/Statement"


export interface StatementRepository {
    getUserStatements (id: string): Promise<outputGetStatementsDTO[] | []>
    addBalance (newStatement: Statement): Promise<void>
    bankTransfer (updateBalance: updateBalanceDTO, newStatement: Statement): Promise<void>
    makePayments (newStatement: Statement): Promise<void>
}