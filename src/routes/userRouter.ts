import { UserController } from '../controller/UserController'
import express from 'express'
import { UserBusiness } from '../business/UserBusiness'
import UserDatabase from '../data/UserDatabase'


export const userRouter = express.Router()
const userDatabase = new UserDatabase()
const userBusiness = new UserBusiness(userDatabase)
const userController = new UserController(userBusiness)

userRouter.post("/", (req, res) => userController.signup(req, res))
userRouter.delete("/", (req, res) => userController.deleteBankAccount(req, res))

userRouter.post("/login", (req, res) => userController.login(req, res))

userRouter.get("/account", (req, res) => userController.getAccountInfo(req, res))
userRouter.get("/balance", (req, res) => userController.getAccountBalance(req, res))