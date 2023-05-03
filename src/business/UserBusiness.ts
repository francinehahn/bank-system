import { CustomError } from "../error/CustomError"
import { DuplicateCpf, IncorrectPassword, InvalidBirthDate, InvalidPassword, MissingBirthDate, MissingPassword, MissingToken, MissingUserCpf, MissingUserName, UserNotFound, UserUnder18 } from "../error/UserErrors"
import { User, loginInputDTO, inputSignUpDTO, returnBalanceDTO } from "../models/User"
import { UserRepository } from "./UserRepository"
import { Authenticator } from "../services/Authenticator"
import { generateId } from "../services/generateId"
import { HashManager } from "../services/HashManager"


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
            
            if (cpfExists) {
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

            const userBirthDate = new Date(input.birthDate.toString().split("/").reverse().join(","))
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
            
            const hashManager = new HashManager()
            const hashPassword: string = await hashManager.generateHash(input.password)

            const id = generateId() 
            const newBankAccount = new User(id, input.name, input.cpf, input.birthDate, hashPassword, balance)
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

            if (!userExists) {
                throw new UserNotFound()
            }

            const hashManager = new HashManager()
            const comparePassword = await hashManager.compareHash(input.password, userExists.password)

            if (!comparePassword) {
                throw new IncorrectPassword()
            }

            const authenticator = new Authenticator()
            const token = await authenticator.generateToken({id: userExists.id})

            return token

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
}