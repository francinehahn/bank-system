import { CustomError } from "./CustomError"


export class MissingUserId extends CustomError {
    constructor () {
        super(422, "Informe o id do usuário.")
    }
}

export class UserIdNotFound extends CustomError {
    constructor () {
        super(404, "O id do usuário não existe.")
    }
}

export class MissingUserName extends CustomError {
    constructor () {
        super(422, "Informe o nome do usuário.")
    }
}

export class MissingUserCpf extends CustomError {
    constructor () {
        super(422, "Informe o cpf do usuário.")
    }
}

export class MissingSenderCpf extends CustomError {
    constructor () {
        super(422, 'É obrigatório fornecer o CPF do usuário que irá fazer a transferência.')
    }
}

export class MissingReceiverCpf extends CustomError {
    constructor () {
        super(422, 'É obrigatório fornecer o CPF do usuário que irá receber a transferência.')
    }
}

export class InvalidSenderCpf extends CustomError {
    constructor () {
        super(422, 'O CPF do usuário que irá fazer a transferência não existe.')
    }
}

export class InvalidReceiverCpf extends CustomError {
    constructor () {
        super(422, 'O CPF do usuário que irá receber a transferência não existe.')
    }
}

export class DuplicateCpf extends CustomError {
    constructor () {
        super(422, "Cpf já cadastrado no banco de dados.")
    }
}

export class InvalidCpf extends CustomError {
    constructor () {
        super(422, "Cpf não encontrado no banco de dados.")
    }
}

export class MissingBirthDate extends CustomError {
    constructor () {
        super(422, "Informe a data de nascimento do usuário.")
    }
}

export class InvalidBirthDate extends CustomError {
    constructor () {
        super(422, "Informe a data de nascimento no padrão DD/MM/AAAA.")
    }
}

export class UserUnder18 extends CustomError {
    constructor () {
        super(422, "O usuário deve ter no mínimo 18 anos.")
    }
}
