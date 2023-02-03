import { Request, Response } from "express"
import { StatementBusiness } from "../business/StatementBusiness"
import { makePaymentsDTO } from "../models/Statement"


export class StatementController {
    constructor (private statementBusiness: StatementBusiness) {}

    getStatementsById = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string
            const result = await this.statementBusiness.getStatementsById(token)

            res.status(200).send(result)

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    makePayments = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: makePaymentsDTO = {
                value: req.body.value,
                date: req.body.date,
                description: req.body.description,
                token: req.headers.authorization as string
            }

            await this.statementBusiness.makePayments(input)
            res.status(201).send('Pagamento/agendamento realizado com sucesso.')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }
}