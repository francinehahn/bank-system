import { User, returnBalanceDTO } from "../models/User"


export interface UserRepository {
    signup (newBankAccount: User): Promise<void>
    deleteBankAccount (id: string): Promise<void>
    getAccountBalance (cpf: string): Promise<returnBalanceDTO>
    getUser (column: string, value: string): Promise<User | undefined>
}