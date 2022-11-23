import { app } from './app'
import { addBalance } from './endpoints/addBalance'
import { bankTransfer } from './endpoints/bankTransfer'
import { createBankAccount } from './endpoints/createBankAccount'
import { deleteBankAccount } from './endpoints/deleteBankAccount'
import { getAccountBalance } from './endpoints/getAccountBalance'
import { getAllUsers } from './endpoints/getAllUsers'
import { makePayments } from './endpoints/makePayments'
import { updateBalance } from './endpoints/updateBalance'


// Get All Users
app.get("/users", getAllUsers)


// Create Bank Account 
app.post("/users", createBankAccount)


// Delete bank account
app.delete('/users/:id', deleteBankAccount)


// Make a payment
app.post("/users/payment", makePayments)


// Update Balance
app.put("/users/balance", updateBalance)


// Get Account Balance
app.get("/users/balance", getAccountBalance)


// Add Balance
app.put("/users/add/balance", addBalance) 


// Bank transfer
app.patch("/users/transfer", bankTransfer)