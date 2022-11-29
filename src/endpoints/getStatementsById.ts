import { Response, Request } from "express"
import { connection} from "../data/connection"


//Function to know whether the user exists in the database
const selectUserById = async (id: number) => {
    const result = await connection.raw(`
        SELECT * FROM BankClients WHERE id = ${id};
    `)
    
    return result[0]
}

//Functions to get the statements
const getStatements = async (id: number) => {
    const result = await connection.raw(`
        SELECT * FROM BankStatements WHERE user_statement = ${id};
    `)

    return result[0]
}

//Endpoint
export const getStatementsById = async (req: Request, res: Response) => {
    const id = req.params.id
    let errorCode = 400

    try {
        if (id === ':id') {
            errorCode = 422
            throw new Error("Informe o id do usuário.")
        }
        
        const userExists = await selectUserById(Number(id))
        
        if (userExists.length === 0) {
            errorCode = 404
            throw new Error("Usuário não encontrado.")
        }

        const result = await getStatements(Number(id))
        res.status(200).send(result)

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}