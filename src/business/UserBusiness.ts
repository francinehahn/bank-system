import UserDatabase from "../data/UserDatabase"
import { CustomError } from "../error/CustomError"
import { InsufficientBalance, InvalidValue, MissingValue } from "../error/StatementErrors"
import { DuplicateCpf, InvalidBirthDate, InvalidCpf, InvalidReceiverCpf, InvalidSenderCpf, MissingBirthDate, MissingReceiverCpf, MissingSenderCpf, MissingUserCpf, MissingUserId, MissingUserName, UserIdNotFound, UserUnder18 } from "../error/UserErrors"
import { AddBalanceDTO } from "../models/AddBalanceDTO"
import { BankTransferDTO } from "../models/BankTransferDTO"
import { CreateBankAccountDTO } from "../models/CreateBankAccountDTO"
import User from "../models/User"


export class UserBusiness {
    addBalance = async (input: AddBalanceDTO): Promise<void> => {
        try {
            if (!input.cpf) {
                throw new MissingUserCpf()          
            }
            
            if (!input.value) {
                throw new MissingValue()
            }
    
            if (input.value <= 0) {
                throw new InvalidValue()
            }

            const userDatabase = new UserDatabase()
            const userExists = await userDatabase.getUserByCpf(input.cpf)
            
            if (userExists.length === 0) {
                throw new InvalidCpf()         
            }

            await userDatabase.addBalance(input)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    bankTransfer = async (input: BankTransferDTO): Promise<void> => {
        try {
            if (!input.senderCpf) {
                throw new MissingSenderCpf()
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

            const userDatabase = new UserDatabase()

            const senderCpfExists = await userDatabase.getUserByCpf(input.senderCpf)
            if (senderCpfExists.length === 0) {
                throw new InvalidSenderCpf()
            }

            const receiverCpfExists = await userDatabase.getUserByCpf(input.receiverCpf)
            if (receiverCpfExists.length === 0) {
                throw new InvalidReceiverCpf()
            }

            const senderBalance = await userDatabase.getAccountBalance(input.senderCpf)
            if (senderBalance.balance < Number(input.value)) {
                throw new InsufficientBalance()
            }

            await userDatabase.bankTransfer(input)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    createBankAccount = async (input: CreateBankAccountDTO): Promise<void> => {
        try {
            const balance = 0

            if (!input.name) {
                throw new MissingUserName()
            }
    
            if (!input.cpf) {
                throw new MissingUserCpf()
            }

            const userDatabase = new UserDatabase()
            const cpfExists = await userDatabase.getUserByCpf(input.cpf)
            
            if (cpfExists.length > 0) {
                throw new DuplicateCpf()
            }
    
            if (!input.birthDate) {
                throw new MissingBirthDate()
            }
    
            //checking whether the date was provided in the expected format (DD/MM/AAAA)
            if (input.birthDate) {
                const array = input.birthDate.toString().split("-")
                const array2 = input.birthDate.toString().split("/")
    
                if (array.length > 1 || Number(array2[0]) > 1000 || Number(array2[1]) > 12 || Number(array2[2]) < 1000) {
                    throw new InvalidBirthDate()
                }
            }

            const formattedBirthDate = input.birthDate.toString().split("/").reverse().join("-")
            let userBirthDate = new Date(formattedBirthDate)
            let today = new Date()

            //User needs to be at least 18 to be able to create an account
            if (today.getFullYear() - userBirthDate.getFullYear() < 18) {
                throw new UserUnder18()
            } else if (today.getFullYear() - userBirthDate.getFullYear() === 18) {
                if (userBirthDate.getMonth() < today.getMonth()) {
                    throw new UserUnder18()
                } else if (userBirthDate.getMonth() === today.getMonth()) {
                    if (userBirthDate.getDate() < today.getDate()) {
                        throw new UserUnder18()
                    }
                }
            }

            input.birthDate = userBirthDate
            
            const newBankAccount = new User(input.name, input.cpf, input.birthDate, balance)
            await userDatabase.createBankAccount(newBankAccount)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    deleteBankAccount = async (id: number): Promise<void> => {
        try {
            if (!id) {
                throw new MissingUserId()
            }

            const userDatabase = new UserDatabase()
            const idExists = await userDatabase.getBankAccountById(id)

            if (idExists.length === 0) {
                throw new UserIdNotFound()
            }

            await userDatabase.deleteBankAccount(id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getAccountBalance = async (cpf: string): Promise<any> => {
        try {
            if (!cpf) {
                throw new MissingUserCpf()
            }

            const userDatabase = new UserDatabase()

            const cpfExists = await userDatabase.getUserByCpf(cpf)
            if (cpfExists.length === 0) {
                throw new InvalidCpf()
            }

            return await userDatabase.getAccountBalance(cpf)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getAllUsers = async (): Promise<User[]> => {
        try {
            const userDatabase = new UserDatabase()
            return await userDatabase.getAllUsers()

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}