export class User {
    private id: string
    private name: string
    private cpf: string
    private birth_Date: Date
    private password: string
    private balance: number

    constructor (i: string, n: string, cpf: string, bd: Date, p: string, b: number) {
        this.id = i
        this.name = n
        this.cpf = cpf
        this.birth_Date = bd
        this.password = p
        this.balance = b
    }
}

export interface returnBalanceDTO {
    balance: number
}

export interface inputSignUpDTO {
    name: string,
    cpf: string,
    birthDate: Date,
    password: string
}

export interface loginInputDTO {
    cpf: string,
    password: string
}

export interface inputBankTransferDTO {
    senderCpf: string,
    receiverCpf: string,
    value: number,
    token: string
}

export interface inputAddBalanceDTO {
    value: number,
    token: string
}

export interface insertBalanceDTO {
    id: string,
    value: number
}