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

statementRouter.get("/", (req, res) => statementController.getUserStatements(req, res)) 
statementRouter.post("/addBalance", (req, res) => statementController.addBalance(req, res))
statementRouter.post("/transfer", (req, res) => statementController.bankTransfer(req, res))
statementRouter.post("/payment", (req, res) => statementController.makePayments(req, res))