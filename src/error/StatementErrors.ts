import { CustomError } from "./CustomError"


export class InvalidValue extends CustomError {
    constructor () {
        super(422, "O valor do pagamento não pode ser menor ou igual a zero.")
    }
}

export class MissingValue extends CustomError {
    constructor () {
        super(422, "O valor do pagamento não pode ser menor ou igual a zero.")
    }
}

export class MissingDescription extends CustomError {
    constructor () {
        super(422, "Adicione uma descrição para esta transação.")
    }
}

export class InsufficientBalance extends CustomError {
    constructor () {
        super(422, "Saldo insuficiente.")
    }
}

export class InvalidPaymentDate extends CustomError {
    constructor () {
        super(422, "Não é possível realizar pagamentos em uma data anterior ao dia de hoje.")
    }
}

export class NoStatementsFound extends CustomError {
    constructor () {
        super(404, "O usuário não realizou nenhuma movimentação na conta até o momento.")
    }
}