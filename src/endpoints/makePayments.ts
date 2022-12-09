import {Request, Response} from 'express'
import Statement from '../class/Statement'
import StatementDatabase from '../class/StatementDatabase'
import UserDatabase from '../class/UserDatabase'

//Ver da data pq está indo pgto com data anterior
export const makePayments = async (req: Request, res: Response) => {
    let errorCode = 400

    try {
        const {cpf, value, date, description} = req.body

        if (!cpf) {
            errorCode = 403
            throw new Error("Informe seu CPF para continuar.")
        }

        const user = new UserDatabase()
        const userExists = await user.selectUserByCpf(cpf)
       
        if (userExists.length === 0) {
            errorCode = 401
            throw new Error("Usuário não encontrado no banco de dados.")
        }

        if (value === 0) {
            errorCode = 422
            throw new Error("O valor do pagamento não pode ser zero.")
        }

        if (value > userExists[0].balance) {
            errorCode = 401
            throw new Error("Saldo insuficiente.")
        }

        if (!description) {
            errorCode = 422
            throw new Error("Adicione uma descrição para esta transação.")
        }

        let paymentDate = ""
        const today = new Date()
        const todayYear = today.getFullYear()
        const todayMonth = today.getMonth() + 1
        const todayDay = today.getDate()

        //If the user does not provide the payment date, it will be considered as today
        if (!date) {
            const day = Number(today.getDate()) > 9? today.getDate() : `0${today.getDate()}`
            const month = Number(today.getMonth()) > 9 ? today.getMonth() + 1 : `0${Number(today.getMonth() + 1)}`
            const year = today.getFullYear()
            paymentDate = `${year}-${month}-${day}`
        
        //Calculating whether the provided date is in the future    
        } else if (date) {
            const incorrectFormatDate = date.split("-")
            const correctFormatDate = date.split("/")
            
            if (incorrectFormatDate.length > 1 || Number(correctFormatDate[0]) > 1000 || Number(correctFormatDate[1]) > 12 ||
                Number(correctFormatDate[2]) < 1000) {
                errorCode = 422
                throw new Error("Informe a data no padrão DD/MM/AAAA.")
            }
            
            if (Number(correctFormatDate[2]) < todayYear) {
                errorCode = 422
                throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
            } else if (Number(correctFormatDate[2]) === todayYear) {
                if (Number(correctFormatDate[1]) < Number(todayMonth)) {
                    errorCode = 422
                    throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
                } else if (Number(correctFormatDate[1]) === Number(todayMonth)) {
                    if (Number(correctFormatDate[0]) < Number(todayDay)) {
                        errorCode = 422
                        throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
                    }
                }
            }

            paymentDate = `${correctFormatDate[2]}-${correctFormatDate[1]}-${correctFormatDate[0]}`
        }
        
        new Statement(value, paymentDate, description, userExists[0].id)
        const statementDatabase = new StatementDatabase()
        await statementDatabase.postPayment(value, paymentDate, description, userExists[0].id)
        
        if (!date) {
            user.updateSenderBalance(userExists[0].balance, value, cpf)
        } else if (date) {
            const correctFormatDate = date.split("/")
            const timeOut = new Date(`${correctFormatDate[2]}-${correctFormatDate[1]}-${correctFormatDate[0]}`).valueOf() - new Date().valueOf()
            setTimeout(() => user.updateSenderBalance(userExists[0].balance, value, cpf), timeOut)
        }
        
        res.status(201).send('Pagamento/agendamento realizado com sucesso.')
        
    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}