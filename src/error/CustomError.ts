export class CustomError extends Error {
    constructor (code: number, message: string) {
        super(message)
    }
}