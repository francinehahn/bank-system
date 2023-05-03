import { User, outputGetAccountInfoDTO, returnBalanceDTO } from "../models/User"


export interface UserRepository {
    signup (newBankAccount: User): Promise<void>
    getUser (column: string, value: string): Promise<User | undefined>
    getAccountInfo (id: string): Promise<outputGetAccountInfoDTO>
    getAccountBalance (cpf: string): Promise<returnBalanceDTO>
    deleteBankAccount (id: string): Promise<void>
}