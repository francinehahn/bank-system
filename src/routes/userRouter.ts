import { UserController } from '../controller/UserController'
import express from 'express'
import { UserBusiness } from '../business/UserBusiness'
import UserDatabase from '../data/UserDatabase'


export const userRouter = express.Router()
const userDatabase = new UserDatabase()
const userBusiness = new UserBusiness(userDatabase)
const userController = new UserController(userBusiness)

userRouter.get("/", userController.getAllUsers)
userRouter.post("/", userController.signup)
userRouter.delete("/", userController.deleteBankAccount)

userRouter.post("/login", userController.login)

userRouter.get("/balance", userController.getAccountBalance)