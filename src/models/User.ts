export class User {
    readonly id: string
    readonly name: string
    readonly cpf: string
    readonly birth_Date: Date
    readonly password: string
    readonly balance: number

    constructor (i: string, n: string, cpf: string, bd: Date, p: string, b: number) {
        this.id = i
        this.name = n
        this.cpf = cpf
        this.birth_Date = bd
        this.password = p
        this.balance = b
    }
}

export interface inputSignUpDTO {
    name: string,
    cpf: string,
    birthDate: string,
    password: string
}

export interface loginInputDTO {
    cpf: string,
    password: string
}

export interface returnBalanceDTO {
    balance: number
}