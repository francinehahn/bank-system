import { StatementController } from '../controller/StatementController'
import express from 'express'

export const statementRouter = express.Router()
const statementController = new StatementController()

statementRouter.get("/:id", statementController.getStatementsById) 
statementRouter.post("/payment", statementController.makePayments)