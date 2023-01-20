import { Request, Response } from "express"
import { StatementBusiness } from "../business/StatementBusiness"


export class StatementController {
    getStatementsById = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400

        try {
            const id = req.params.id
            const statementBusiness = new StatementBusiness()
            const result = await statementBusiness.getStatementsById(id)
            res.status(200).send(result)
        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }

    makePayments = async (req: Request, res: Response): Promise<void> => {
        let errorCode= 400

        try {
            const {cpf, value, date, description} = req.body
            const statementBusiness = new StatementBusiness()
            await statementBusiness.makePayments({cpf, value, date, description})
            res.status(201).send('Pagamento/agendamento realizado com sucesso.')
        } catch (err: any) {
            res.status(errorCode).send(err.message)
        }
    }
}