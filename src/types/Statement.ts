export default class Statement {
    private value: number
    private date: string
    private description: string
    private user_id: number

    constructor (v: number, date: string, desc: string, ui: number) {
        this.value = v
        this.date = date
        this.description = desc
        this.user_id = ui
    }
}