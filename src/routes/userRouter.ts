import { UserController } from '../controller/UserController'
import express from 'express'

export const userRouter = express.Router()
const userController = new UserController()

userRouter.get("/", userController.getAllUsers)
userRouter.post("/", userController.createBankAccount)
userRouter.get("/balance", userController.getAccountBalance)
userRouter.patch("/balance", userController.addBalance)
userRouter.patch("/transfer", userController.bankTransfer)
userRouter.delete("/:id", userController.deleteBankAccount)