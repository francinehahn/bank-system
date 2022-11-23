import { connection } from "./connection"
import users from "./users.json"
import statements from "./statements.json"

const printError = (error: any) => console.log(error.sqlMessage || error.message)

const createTables = () => connection.raw(`
    CREATE TABLE IF NOT EXISTS BankClients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        cpf CHAR(11) UNIQUE NOT NULL,
        birth_date DATE NOT NULL,
        balance BIGINT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS BankStatements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        value INT NOT NULL,
        date DATE NOT NULL,
        description TEXT(100),
        user_statement INT,
        FOREIGN KEY(user_statement) REFERENCES BankClients(id)
    );
`).then(() => console.log('Tabela criada.')).catch(printError)


const insertUsers = () => connection("BankClients")
   .insert(users)
   .then(() => console.log("Usuários adicionados"))
   .catch(printError)

const insertStatements = () => connection("BankStatements")
   .insert(statements)
   .then(() => console.log("Statements adicionados"))
   .catch(printError)

const closeConnection = () => connection.destroy()

createTables()
   .then(insertUsers)
   .then(insertStatements)
   .finally(closeConnection)