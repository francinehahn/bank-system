import { User, insertBalanceDTO, inputBankTransferDTO, returnBalanceDTO } from "../models/User"


export interface UserRepository {
    addBalance (insertBalance: insertBalanceDTO): Promise<void>
    bankTransfer (input: inputBankTransferDTO): Promise<void>
    signup (newBankAccount: User): Promise<void>
    deleteBankAccount (id: string): Promise<void>
    getAccountBalance (cpf: string): Promise<returnBalanceDTO>
    getAllUsers (): Promise<User[]>
    getUser (column: string, value: string): Promise<any>
}