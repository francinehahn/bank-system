import {Request, Response} from 'express'
import User from '../class/User'
import UserDatabase from '../class/UserDatabase'


export const createBankAccount = async (req: Request, res: Response) => {
    const {name, cpf, birth_date} = req.body
    const balance = 0
    let errorCode = 400
    
    try {
        if (!name) {
            errorCode = 422
            throw new Error("Informe o nome completo.")
        }

        if (!cpf) {
            errorCode = 422
            throw new Error("Informe o CPF.")
        }

        if (!birth_date) {
            errorCode = 422
            throw new Error("Informe a data de nascimento no padrão DD/MM/AAAA.")
        }

        //checking whether the date was provided in the expected format (DD/MM/AAAA)
        if (birth_date) {
            const array = birth_date.split("-")
            const array2 = birth_date.split("/")

            if (array.length > 1) {
                errorCode = 422
                throw new Error("Informe a data de nascimento no padrão DD/MM/AAAA.")
            } else if (Number(array2[0]) > 1000 || Number(array2[1]) > 12 || Number(array2[2]) < 1000) {
                errorCode = 422
                throw new Error("Informe a data de nascimento no padrão DD/MM/AAAA.")
            }
        }

        const user = new UserDatabase()
        const cpfExists = await user.selectUserByCpf(cpf)
        
        if (cpfExists.length > 0) {
            errorCode = 409
            throw new Error("CPF já existente no banco de dados.")
        }
        
        const birthDateArray = birth_date.split("/").map(Number)
        let userBirthDate = new Date(birthDateArray[2], birthDateArray[1] - 1, birthDateArray[0])
        let today = new Date()

        //User needs to be at least 18 to be able to create an account
        if (today.getFullYear() - userBirthDate.getFullYear() < 18) {
            errorCode = 403
            throw new Error("Idade mínima de 18 anos não alcançada.")
        } else if (today.getFullYear() - userBirthDate.getFullYear() === 18) {
            if (userBirthDate.getMonth() < today.getMonth()) {
                errorCode = 403
                throw new Error("Idade mínima de 18 anos não alcançada.")
            } else if (userBirthDate.getMonth() === today.getMonth()) {
                if (userBirthDate.getDate() < today.getDate()) {
                    errorCode = 403
                    throw new Error("Idade mínima de 18 anos não alcançada.")
                }
            }
        }

        const birthdayArray = birth_date.toString().split("/")
        const formattedDate = new Date(`${birthdayArray[2]}-${birthdayArray[1]}-${birthdayArray[0]}`)
        
        new User(name, cpf, formattedDate, balance)
        await user.createAccount(name, cpf, formattedDate, balance)
        res.status(201).send('Conta criada com sucesso!')
            
    } catch (err:any) {
        res.status(errorCode).send(err.message)
    }
}