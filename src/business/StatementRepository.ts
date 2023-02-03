import { Statement } from "../models/Statement"
import { updateBalanceDTO } from "../models/Statement"


export interface StatementRepository {
    getUserStatements (id: string): Promise<Statement[]>
    addBalance (newStatement: Statement): Promise<void>
    bankTransfer (updateBalance: updateBalanceDTO, newStatement: Statement): Promise<void>
    makePayments (newStatement: Statement): Promise<void>
}