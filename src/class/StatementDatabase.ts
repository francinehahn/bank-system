import BaseDatabase from "./BaseDatabase"

export default class StatementDatabase extends BaseDatabase {
    //Method that returns all the statements from a user
    public async getStatements (id: number) {
        const result = await BaseDatabase.connection.raw(`
            SELECT * FROM BankStatements WHERE user_statement = ${id};
        `)

        return result[0]
    }   

    //Function that inserts the payment info in the database
    public async postPayment (value: number, date: Date, description: string, user_id: number) {
        await BaseDatabase.connection.raw(`
            INSERT INTO BankStatements (value, date, description, user_id)
            VALUES (${value}, '${date}', '${description}', ${user_id});
        `)
    }
}