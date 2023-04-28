export class Statement {
    private id: string
    private value: number
    private date: Date
    private description: string
    private user_id: string

    constructor (i: string, v: number, date: Date, desc: string, ui: string) {
        this.id = i
        this.value = v
        this.date = date
        this.description = desc
        this.user_id = ui
    }

    public getId() {
        return this.id
    }

    public getDate() {
        return this.date
    }

    public getDescription() {
        return this.description
    }

    public getValue() {
        return this.value
    }

    public getUserId() {
        return this.user_id
    }
}

export interface makePaymentsDTO {
    value: number,
    date: Date,
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