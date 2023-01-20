import { app } from './app'
import { StatementController } from './controller/StatementController'
import { UserController } from './controller/UserController'

const userController = new UserController()
const statementController = new StatementController()

// Get All Users
app.get("/users", userController.getAllUsers)


// Get Account Balance
app.get("/users/balance", userController.getAccountBalance)


// Create Bank Account 
app.post("/users", userController.createBankAccount)


// Make a payment
app.post("/users/payment", statementController.makePayments)


// Add Balance
app.patch("/users/balance", userController.addBalance)


// Bank transfer
app.patch("/users/transfer", userController.bankTransfer)


// Delete bank account
app.delete('/users/:id', userController.deleteBankAccount)


// Get Statements By Id
app.get('/statements/:id', statementController.getStatementsById) 