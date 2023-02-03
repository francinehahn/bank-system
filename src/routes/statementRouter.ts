import { StatementController } from '../controller/StatementController'
import express from 'express'
import StatementDatabase from '../data/StatementDatabase'
import { StatementBusiness } from '../business/StatementBusiness'
import UserDatabase from '../data/UserDatabase'


export const statementRouter = express.Router()
const statementDatabase = new StatementDatabase()
const userDatabase = new UserDatabase()
const statementBusiness = new StatementBusiness(statementDatabase, userDatabase)
const statementController = new StatementController(statementBusiness)

statementRouter.get("/", statementController.getUserStatements) 
statementRouter.post("/addBalance", statementController.addBalance)
statementRouter.post("/transfer", statementController.bankTransfer)
statementRouter.post("/payment", statementController.makePayments)