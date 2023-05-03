export class Statement {
    readonly id: string
    readonly value: number
    readonly date: Date
    readonly description: string
    readonly user_id: string

    constructor (i: string, v: number, date: Date, desc: string, ui: string) {
        this.id = i
        this.value = v
        this.date = date
        this.description = desc
        this.user_id = ui
    }
}

export interface makePaymentsDTO {
    value: number,
    date: string,
    description: string,
    token: string
}

export interface updateBalanceDTO {
    receiverId: string,
    receiverBalance: number
}

export interface inputBankTransferDTO {
    receiverCpf: string,
    value: number,
    token: string
}

export interface inputAddBalanceDTO {
    value: number,
    token: string
}