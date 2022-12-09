export default class User {
    private name: string
    private cpf: string
    private birth_date: Date
    private balance: number

    constructor (n: string, cpf: string, bd: Date, b: number) {
        this.name = n
        this.cpf = cpf
        this.birth_date = bd
        this.balance = b
    }
}