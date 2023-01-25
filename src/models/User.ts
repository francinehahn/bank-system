export default class User {
    private name: string
    private cpf: string
    private birth_Date: Date
    private balance: number

    constructor (n: string, cpf: string, bd: Date, b: number) {
        this.name = n
        this.cpf = cpf
        this.birth_Date = bd
        this.balance = b
    }
}