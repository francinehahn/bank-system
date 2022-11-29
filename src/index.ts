import { app } from './app'
import { addBalance } from './endpoints/addBalance'
import { bankTransfer } from './endpoints/bankTransfer'
import { createBankAccount } from './endpoints/createBankAccount'
import { deleteBankAccount } from './endpoints/deleteBankAccount'
import { getAccountBalance } from './endpoints/getAccountBalance'
import { getAllUsers } from './endpoints/getAllUsers'
import { getStatementsById } from './endpoints/getStatementsById'
import { makePayments } from './endpoints/makePayments'


// Get All Users
app.get("/users", getAllUsers)


// Get Account Balance
app.get("/users/balance", getAccountBalance)


// Create Bank Account 
app.post("/users", createBankAccount)


// Make a payment
app.post("/users/payment", makePayments)


// Add Balance
app.patch("/users/balance", addBalance)


// Bank transfer
app.patch("/users/transfer", bankTransfer)


// Delete bank account
app.delete('/users/:id', deleteBankAccount)


// Get Statements By Id
app.get('/statements/:id', getStatementsById) 