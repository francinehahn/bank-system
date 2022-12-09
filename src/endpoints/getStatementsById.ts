import { Response, Request } from "express"
import StatementDatabase from "../class/StatementDatabase"
import UserDatabase from "../class/UserDatabase"


export const getStatementsById = async (req: Request, res: Response) => {
    let errorCode = 400

    try {
        const id = req.params.id

        if (id === ':id') {
            errorCode = 422
            throw new Error("Informe o id do usuário.")
        }
        
        const user = new UserDatabase()
        const userExists = await user.selectUserById(Number(id))
        
        if (userExists.length === 0) {
            errorCode = 404
            throw new Error("Usuário não encontrado.")
        }

        const statements = new StatementDatabase()
        const result = await statements.getStatements(Number(id))
        res.status(200).send(result)

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}