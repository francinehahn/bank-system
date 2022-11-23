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


// Get Account Balance
app.get("/users/balance", getAccountBalance)


// Create Bank Account 
app.post("/users", createBankAccount)


// Make a payment
//app.put("/users/payment", makePayments)


// Add Balance
//app.put("/users/add/balance", addBalance)


// Update Balance
//app.put("/users/balance", updateBalance)


// Bank transfer
//app.patch("/users/transfer", bankTransfer)

// Delete bank account
//app.delete('/users/:id', deleteBankAccount)