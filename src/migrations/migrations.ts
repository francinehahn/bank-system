import { connection } from "./connection"


const printError = (error: any) => { console.log(error.sqlMessage || error.message) }

const createTable = () => connection.raw(`
    CREATE TABLE IF NOT EXISTS BankClients2 (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        cpf INT(11) NOT NULL UNIQUE,
        birth_date DATE NOT NULL,
        password VARCHAR(80) NOT NULL,
        balance DECIMAL(8,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS BankStatements2 (
        id CHAR(36) PRIMARY KEY,
        value DECIMAL(8,2) NOT NULL,
        date DATE NOT NULL,
        description VARCHAR(255) NOT NULL,
        user_id CHAR(36) NOT NULL,
        FOREIGN KEY(user_id) REFERENCES BankClients2(id)
        
    );
`).then(() => {
    console.log('Tabelas criadas.')
    connection.destroy()
}).catch(printError)
    

createTable()