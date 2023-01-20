import StatementDatabase from "../data/StatementDatabase"
import Statement from "../types/Statement"


export class StatementBusiness {
    getStatementsById = async (id: string): Promise<Statement[]> => {
        try {
            if (!id) {
                throw new Error("Informe o id do usuário.")
            }

            const statementDatabase = new StatementDatabase()
            return await statementDatabase.getStatementsById(id)

        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    makePayments = async ({cpf, value, date, description}: any): Promise<void> => {
        try {
            if (!cpf) {
                throw new Error("Informe seu CPF para continuar.")
            }
    
            if (value <= 0) {
                throw new Error("O valor do pagamento não pode ser menor ou igual a zero.")
            }
    
            if (!description) {
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
                    throw new Error("Informe a data no padrão DD/MM/AAAA.")
                }
                
                if (Number(correctFormatDate[2]) < todayYear) {
                    throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
                } else if (Number(correctFormatDate[2]) === todayYear) {
                    if (Number(correctFormatDate[1]) < Number(todayMonth)) {
                        throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
                    } else if (Number(correctFormatDate[1]) === Number(todayMonth)) {
                        if (Number(correctFormatDate[0]) < Number(todayDay)) {
                            throw new Error("Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
                        }
                    }
                }

                paymentDate = `${correctFormatDate[2]}-${correctFormatDate[1]}-${correctFormatDate[0]}`
            }

            const statementDatabase = new StatementDatabase()
            await statementDatabase.makePayments({cpf, value, paymentDate, description})

        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}