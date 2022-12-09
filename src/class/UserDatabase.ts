import BaseDatabase from "./BaseDatabase"

export default class UserDatabase extends BaseDatabase {
    //Method to know whether the cpf exists in the database
    public async selectUserByCpf (cpf: string) {
        const result = await BaseDatabase.connection.raw(`
            SELECT * FROM BankClients WHERE cpf = '${cpf}';
        `)
        
        return result[0]
    }

    //Method to know whether the user_id exists in the database
    public async selectUserById (id: number) {
        const result = await BaseDatabase.connection.raw(`
            SELECT * FROM BankClients WHERE id = ${id};
        `)
        
        return result[0]
    }

    //Method that returns all users in the database
    public async selectAllUses () {
        const result = await BaseDatabase.connection.raw(`
            SELECT * FROM BankClients;
        `)

        return result[0]
    }

    //Method that returns user balance
    public async getBalance (cpf: string) {
        const result = await BaseDatabase.connection.raw(`
            SELECT balance FROM BankClients WHERE cpf = '${cpf}';
        `)

        return result[0][0]
    }

    //Method that updates the sender balance
    public async updateSenderBalance (balance: number, value: number, cpf: string) {
        await BaseDatabase.connection.raw(`
            UPDATE BankClients SET balance = ${balance - value} WHERE cpf = '${cpf}';
        `)
    }

    //Method that updates the receiver balance
    public async updateReceiverBalance (balance: number, value: number, cpf: string) {
        await BaseDatabase.connection.raw(`
            UPDATE BankClients SET balance = ${balance + value} WHERE cpf = '${cpf}';
        `)
    }

    //Method that inserts the user info into the database
    public async createAccount (name: string, cpf: string, birth_date: string, balance: number) {
        await BaseDatabase.connection.raw(`
            INSERT INTO BankClients (name, cpf, birth_date, balance)
            VALUES ('${name}', '${cpf}', '${birth_date}', ${balance})
        `)
    }

    //Method that deletes bank account and user statements
    public async delAccountAndStatements (id: number) {
        await BaseDatabase.connection.raw(`
            DELETE FROM BankClients WHERE id = ${id};
        `)

        await BaseDatabase.connection.raw(`
            DELETE FROM BankStatements WHERE user_id = ${id};
        `)
    }
}