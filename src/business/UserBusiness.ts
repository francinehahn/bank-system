import UserDatabase from "../data/UserDatabase"
import User from "../types/User"


export class UserBusiness {
    addBalance = async ({cpf, value}: any): Promise<void> => {
        try {
            if (!cpf && !value) {
                throw new Error("É obrigatório informar o CPF e o valor que você deseja adicionar.")
            }
            
            if (!cpf) {
                throw new Error("Informe o seu CPF.")            
            }
            
            if (!value) {
                throw new Error("Informe o valor que você deseja adicionar.")
            }
    
            if (value <= 0) {
                throw new Error("O valor que você deseja adicionar não pode ser menor ou igual a zero.")
            }

            const userDatabase = new UserDatabase()
            await userDatabase.addBalance({cpf, value})

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    bankTransfer = async ({senderCpf, receiverCpf, value}: any): Promise<void> => {
        try {
            if (!senderCpf && !receiverCpf && !value) {
                throw new Error('É obrigatório fornecer o CPF do usuário que irá fazer a transferência, o CPF do usuário que irá receber a transferência e a quantia que será transferida.')
            } else if (!senderCpf) {
                throw new Error('É obrigatório fornecer o CPF do usuário que irá fazer a transferência.')
            } else if (!receiverCpf) {
                throw new Error('É obrigatório fornecer o CPF do usuário que irá receber a transferência.')
            } else if (!value) {
                throw new Error('É obrigatório fornecer o valor que será transferido.')
            } else if (value <= 0) {
                throw new Error('O valor a ser transferido não pode ser menor ou igual a zero.')
            }

            const userDatabase = new UserDatabase()
            await userDatabase.bankTransfer({senderCpf, receiverCpf, value})

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    createBankAccount = async ({name, cpf, birthDate}: any): Promise<void> => {
        try {
            const balance = 0

            if (!name) {
                throw new Error("Informe o nome completo.")
            }
    
            if (!cpf) {
                throw new Error("Informe o CPF.")
            }
    
            if (!birthDate) {
                throw new Error("Informe a data de nascimento no padrão DD/MM/AAAA.")
            }
    
            //checking whether the date was provided in the expected format (DD/MM/AAAA)
            if (birthDate) {
                const array = birthDate.split("-")
                const array2 = birthDate.split("/")
    
                if (array.length > 1) {
                    throw new Error("Informe a data de nascimento no padrão DD/MM/AAAA.")
                } else if (Number(array2[0]) > 1000 || Number(array2[1]) > 12 || Number(array2[2]) < 1000) {
                    throw new Error("Informe a data de nascimento no padrão DD/MM/AAAA.")
                }
            }

            const birthDateArray = birthDate.split("/").map(Number)
            let userBirthDate = new Date(birthDateArray[2], birthDateArray[1] - 1, birthDateArray[0])
            let today = new Date()

            //User needs to be at least 18 to be able to create an account
            if (today.getFullYear() - userBirthDate.getFullYear() < 18) {
                throw new Error("Idade mínima de 18 anos não alcançada.")
            } else if (today.getFullYear() - userBirthDate.getFullYear() === 18) {
                if (userBirthDate.getMonth() < today.getMonth()) {
                    throw new Error("Idade mínima de 18 anos não alcançada.")
                } else if (userBirthDate.getMonth() === today.getMonth()) {
                    if (userBirthDate.getDate() < today.getDate()) {
                        throw new Error("Idade mínima de 18 anos não alcançada.")
                    }
                }
            }

            const birthdayArray = birthDate.toString().split("/")
            const formattedDate = `${birthdayArray[2]}-${birthdayArray[1]}-${birthdayArray[0]}`
            birthDate = formattedDate
            const userDatabase = new UserDatabase()
            await userDatabase.createBankAccount({name, cpf, birthDate, balance})

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    deleteBankAccount = async (id: string): Promise<void> => {
        try {
            if (!id) {
                throw new Error('É necessário adicionar o id da conta bancária que deseja deletar.')
            }

            const userDatabase = new UserDatabase()
            await userDatabase.deleteBankAccount(id)

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    getAccountBalance = async (cpf: string): Promise<any> => {
        try {
            if (!cpf) {
                throw new Error("É obrigatório informar o CPF para consultar o saldo.")
            }

            const userDatabase = new UserDatabase()
            return await userDatabase.getAccountBalance(cpf)

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    getAllUsers = async (): Promise<User[]> => {
        try {
            const userDatabase = new UserDatabase()
            return await userDatabase.getAllUsers()

        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}