import { app } from './app'
import { statementRouter } from './routes/statementRouter'
import { userRouter } from './routes/userRouter'


app.use("/users", userRouter)
app.use("/statements", statementRouter)


