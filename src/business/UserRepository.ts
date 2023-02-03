import { User, returnBalanceDTO } from "../models/User"


export interface UserRepository {
    signup (newBankAccount: User): Promise<void>
    deleteBankAccount (id: string): Promise<void>
    getAccountBalance (cpf: string): Promise<returnBalanceDTO>
    getAllUsers (): Promise<User[]>
    getUser (column: string, value: string): Promise<any>
}