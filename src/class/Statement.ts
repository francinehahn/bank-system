export default class Statement {
    private value: number
    private date: Date
    private description: string
    private user_id: number

    constructor (v: number, date: Date, desc: string, ui: number) {
        this.value = v
        this.date = date
        this.description = desc
        this.user_id = ui
    }
}