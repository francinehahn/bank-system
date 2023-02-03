import { CustomError } from "../error/CustomError"
import { InsufficientBalance, InvalidValue, MissingValue } from "../error/StatementErrors"
import { DuplicateCpf, IncorrectPassword, InvalidBirthDate, InvalidPassword, InvalidReceiverCpf, InvalidSenderCpf, MissingBirthDate, MissingPassword, MissingReceiverCpf, MissingSenderCpf, MissingToken, MissingUserCpf, MissingUserName, UserNotFound, UserUnder18 } from "../error/UserErrors"
import { User, inputAddBalanceDTO, loginInputDTO, inputBankTransferDTO, inputSignUpDTO, insertBalanceDTO, returnBalanceDTO } from "../models/User"
import { UserRepository } from "./UserRepository"
import { Authenticator } from "../services/Authenticator"
import { generateId } from "../services/generateId"


export class UserBusiness {
    constructor(private userDatabase: UserRepository) {}


    signup = async (input: inputSignUpDTO): Promise<string> => {
        try {
            const balance = 0

            if (!input.name) {
                throw new MissingUserName()
            }
    
            if (!input.cpf) {
                throw new MissingUserCpf()
            }

            const cpfExists = await this.userDatabase.getUser("cpf", input.cpf)
            
            if (cpfExists.length > 0) {
                throw new DuplicateCpf()
            }
    
            if (!input.birthDate) {
                throw new MissingBirthDate()
            }

            if (!input.password) {
                throw new MissingPassword()
            }

            if (input.password.length < 8) {
                throw new InvalidPassword()
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
            
            const id = generateId() 
            const newBankAccount = new User(id, input.name, input.cpf, input.birthDate, input.password, balance)
            await this.userDatabase.signup(newBankAccount)

            const authenticator = new Authenticator()
            const token = await authenticator.generateToken({id})

            return token

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    async login (input: loginInputDTO): Promise<string> {
        try {
            if (!input.cpf) {
                throw new MissingUserCpf()
            }
            if (!input.password) {
                throw new MissingPassword()
            }
            if (input.password.length < 8) {
                throw new InvalidPassword()
            }

            const userExists = await this.userDatabase.getUser("cpf", input.cpf)

            if (userExists.length === 0) {
                throw new UserNotFound()
            }
           
            if (input.password !== userExists[0].password) {
                throw new IncorrectPassword()
            }

            const authenticator = new Authenticator()
            const token = await authenticator.generateToken({id: userExists[0].id})

            return token

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    addBalance = async (input: inputAddBalanceDTO): Promise<void> => {
        try {            
            if (!input.value) {
                throw new MissingValue()
            }
    
            if (input.value <= 0) {
                throw new InvalidValue()
            }

            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(input.token)

            const insertBalance: insertBalanceDTO = {
                id,
                value: input.value
            }

            await this.userDatabase.addBalance(insertBalance)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    bankTransfer = async (input: inputBankTransferDTO): Promise<void> => {
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
            if (!input.token) {
                throw new MissingToken()
            }

            const senderCpfExists = await this.userDatabase.getUser("cpf", input.senderCpf)
            if (senderCpfExists.length === 0) {
                throw new InvalidSenderCpf()
            }

            const receiverCpfExists = await this.userDatabase.getUser("cpf", input.receiverCpf)
            if (receiverCpfExists.length === 0) {
                throw new InvalidReceiverCpf()
            }

            const senderBalance = await this.userDatabase.getAccountBalance(input.senderCpf)
            if (senderBalance.balance < Number(input.value)) {
                throw new InsufficientBalance()
            }

            const authenticator = new Authenticator()
            authenticator.getTokenData(input.token)

            await this.userDatabase.bankTransfer(input)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    deleteBankAccount = async (token: string): Promise<void> => {
        try {
            if (!token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(token)

            await this.userDatabase.deleteBankAccount(id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getAccountBalance = async (token: string): Promise<returnBalanceDTO> => {
        try {
            if (!token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = authenticator.getTokenData(token)

            return await this.userDatabase.getAccountBalance(id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getAllUsers = async (): Promise<User[]> => {
        try {
            return await this.userDatabase.getAllUsers()

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}