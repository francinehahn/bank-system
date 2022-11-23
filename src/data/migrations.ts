import { connection } from "./connection"
import users from "./users.json"
import statements from "./statements.json"

const printError = (error: any) => console.log(error.sqlMessage || error.message)

const createTables = () => connection.raw(`
    CREATE TABLE IF NOT EXISTS Users (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(180) NOT NULL,
        cpf VARCHAR(11) UNIQUE NOT NULL,
        birth_date DATE NOT NULL,
        balance BIGINT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Statements (
        id VARCHAR(255) PRIMARY KEY,
        value INT(11) NOT NULL,
        date DATE NOT NULL,
        description TEXT(255)
        user_id VARCHAR(20),
        FOREIGN KEY(user_id) REFERENCES Users(id)
    );
`).then(() => console.log('Tabela criada.')).catch(printError)


const insertUsers = () => connection("Users")
   .insert(users)
   .then(() => console.log("Usuários adicionados"))
   .catch(printError)

const insertStatements = () => connection("Statements")
   .insert(statements)
   .then(() => console.log("Statements adicionados"))
   .catch(printError)

const closeConnection = () => connection.destroy()

createTables()
   .then(insertUsers)
   .then(insertStatements)
   .finally(closeConnection)