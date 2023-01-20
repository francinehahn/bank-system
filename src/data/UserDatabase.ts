import User from "../types/User"
import BaseDatabase from "./BaseDatabase"


export default class UserDatabase extends BaseDatabase {
    
    addBalance = async ({cpf, value}: any): Promise<void> => {
        try {
            const userExists = await BaseDatabase.connection("BankClients").select().where("cpf", cpf)

            if (userExists.length === 0) {
                throw new Error("Usuário não encontrado.")            
            }

            const balance = await BaseDatabase.connection("BankClients").select("balance").where("cpf", cpf)
        
            await BaseDatabase.connection("BankClients").where("cpf", cpf).update("balance", balance[0].balance + Number(value))

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    bankTransfer = async ({senderCpf, receiverCpf, value}: any): Promise<void> => {
        try {
            const senderCpfExists = await BaseDatabase.connection("BankClients").select().where("cpf", senderCpf)

            if (senderCpfExists.length === 0) {
                throw new Error('O cpf do usuário que irá fazer a transferência não existe.')
            }

            const receiverCpfExists = await BaseDatabase.connection("BankClients").select().where("cpf", receiverCpf)
            if (receiverCpfExists.length === 0) {
                throw new Error('O cpf do usuário que irá receber a transferência não existe.')
            }

            const senderBalance = await BaseDatabase.connection("BankClients").select("balance").where("cpf", senderCpf)
            const receiverBalance = await BaseDatabase.connection("BankClients").select("balance").where("cpf", receiverCpf)

            if (senderBalance[0].balance < Number(value)) {
                throw new Error('Não há saldo suficiente na conta do usuário para realizar a transferência.')
            }
            
            await BaseDatabase.connection("BankClients").where("cpf", senderCpf).update("balance", senderBalance[0].balance - Number(value))
            await BaseDatabase.connection("BankClients").where("cpf", receiverCpf).update("balance", receiverBalance[0].balance + Number(value))

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    createBankAccount = async ({name, cpf, birthDate, balance}: any): Promise<void> => {
        try {
            const cpfExists = await BaseDatabase.connection("BankClients").select().where("cpf", cpf)
            
            if (cpfExists.length > 0) {
                throw new Error("CPF já existente no banco de dados.")
            }
    
            const newUser = new User(name, cpf, birthDate, balance)
            await BaseDatabase.connection.insert(newUser).into("BankClients")

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    deleteBankAccount = async (id: string): Promise<void> => {
        try {
            const idExists = await BaseDatabase.connection("BankClients").select().where("id", id)

            if (idExists.length === 0) {
                throw new Error('O id da conta bancária não existe.')
            }
    
            await BaseDatabase.connection("BankClients").where("id", id).del()
            await BaseDatabase.connection("BankStatements").where("user_id", id).del()

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    getAccountBalance = async (cpf: string): Promise<Number> => {
        try {
            const cpfExists = await BaseDatabase.connection("BankClients").select().where("cpf", cpf)
            
            if (cpfExists.length === 0) {
                throw new Error("O cpf informado não existe.")
            }
    
            const balance = await BaseDatabase.connection("BankClients").select("balance").where("cpf", 'cpf')
            return balance[0]

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    getAllUsers = async (): Promise<User[]> => {
        try {
            return await BaseDatabase.connection("BankClients").select()
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}