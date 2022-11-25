import {Request, Response} from 'express'
import { connection } from '../data/connection'


//Function to know whether the user exists in the database
const selectUserByCpf = async (cpf: string) => {
    const result = await connection.raw(`
        SELECT * FROM BankClients WHERE cpf = '${cpf}';
    `)
    
    return result[0]
}

//Function to insert the payment info in the database
const patchPayment = async (value: number, date: string, description: string, user_statement: number) => {
    await connection.raw(`
        INSERT INTO BankStatements (value, date, description, user_statement)
        VALUES (${value}, '${date}', '${description}', ${user_statement});
    `)
}

//Endpoint
export const makePayments = async (req: Request, res: Response) => {
    const {cpf, value, date, description} = req.body
    let errorCode = 400

    try {
        if (!cpf) {
            errorCode = 403
            throw new Error("Informe seu CPF para continuar.")
        }

        const userExists = await selectUserByCpf(cpf)
        
        if (userExists.length === 0) {
            errorCode = 401
            throw new Error("Usuário não encontrado no banco de dados.")
        }

        if (value === 0) {
            errorCode = 422
            throw new Error("O valor da conta não pode ser nulo.")
        }

        if (value > userExists.balance) {
            errorCode = 401
            throw new Error("Saldo insuficiente.")
        }

        if (!description) {
            errorCode = 422
            throw new Error("Adicione uma descrição para esta transação.")
        }

        let paymentDate: string = ""
        const today = new Date()

        //If the user does not provide the payment date, it will be considered as today
        if (!date) {
            const day = Number(today.getDate()) > 9? today.getDate() : `0${today.getDate()}`
            const month = Number(today.getMonth()) > 9 ? today.getMonth() + 1 : `0${Number(today.getMonth() + 1)}`
            const year = today.getFullYear()
            paymentDate = `${year}-${month}-${day}`
        
        } else if (date) {
            const incorrectFormatDate = date.split("-")
            const correctFormatDate = date.split("/").map(Number)
            
            if (incorrectFormatDate.length > 1) {
                errorCode = 422
                throw new Error("Informe a data no padrão DD/MM/AAAA.")
            } else if (Number(correctFormatDate[0]) > 1000 || Number(correctFormatDate[1]) > 12 || Number(correctFormatDate[2]) < 1000) {
                errorCode = 422
                throw new Error("Informe a data no padrão DD/MM/AAAA.")
            }

            if (today.getFullYear() > correctFormatDate[2]) {
                errorCode = 422
                throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
            } else if (today.getFullYear() < correctFormatDate[2]) {
                errorCode = 422
                throw new Error("Não é possível realizar pagamentos em anos seguintes.")
            } else if (today.getFullYear() === correctFormatDate[2]) {
                if (today.getMonth() + 1 > correctFormatDate[1]) {
                    errorCode = 422
                    throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
                } else if (today.getMonth() + 1 === correctFormatDate[1]) {
                    if (today.getDate() > correctFormatDate[0]) {
                        errorCode = 422
                        throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
                    }
                }
            }

            paymentDate = `${correctFormatDate[2]}-${Number(correctFormatDate[1])}-${correctFormatDate[0]}`
        }
        
        patchPayment(value, paymentDate, description, userExists[0].id)
        res.status(201).send('Pagamento/agendamento realizado com sucesso.')
        
    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}