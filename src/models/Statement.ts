export class Statement {
    private id: string
    private value: number
    private date: Date
    private description: string
    private user_id: number

    constructor (i: string, v: number, date: Date, desc: string, ui: number) {
        this.id = i
        this.value = v
        this.date = date
        this.description = desc
        this.user_id = ui
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