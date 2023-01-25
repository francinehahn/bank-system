import { Request, Response } from "express"
import { StatementBusiness } from "../business/StatementBusiness"
import { MakePaymentsDTO } from "../models/MakePaymentsDTO"


export class StatementController {
    getStatementsById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id: number = Number(req.params.id)
            const statementBusiness = new StatementBusiness()
            const result = await statementBusiness.getStatementsById(id)

            res.status(200).send(result)
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    makePayments = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: MakePaymentsDTO = {
                cpf: req.body.cpf,
                value: req.body.value,
                date: req.body.date,
                description: req.body.description
            }
            
            const statementBusiness = new StatementBusiness()
            await statementBusiness.makePayments(input)

            res.status(201).send('Pagamento/agendamento realizado com sucesso.')

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }
}