import { CustomError } from "./CustomError"


export class MissingUserId extends CustomError {
    constructor () {
        super(422, "Informe o id do usuário.")
    }
}

export class UserNotFound extends CustomError {
    constructor () {
        super(404, "Usuário não encontrado.")
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

export class MissingPassword extends CustomError {
    constructor () {
        super(422, "Informe a senha do usuário.")
    }
}

export class InvalidPassword extends CustomError {
    constructor () {
        super(422, "A senha deve ter pelo menos 8 caracteres.")
    }
}

export class IncorrectPassword extends CustomError {
    constructor () {
        super(422, "Senha incorreta.")
    }
}

export class MissingReceiverCpf extends CustomError {
    constructor () {
        super(422, 'É obrigatório fornecer o CPF do usuário que irá receber a transferência.')
    }
}

export class ReceiverCpfNotFound extends CustomError {
    constructor () {
        super(404, 'O CPF do usuário que irá receber a transferência não existe.')
    }
}

export class InvalidReceiverCpf extends CustomError {
    constructor () {
        super(404, 'O CPF do usuário que irá receber a transferência não pode ser o mesmo cpf do usuário que irá realizar a transferência.')
    }
}

export class DuplicateCpf extends CustomError {
    constructor () {
        super(409, "Cpf já cadastrado no banco de dados.")
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

export class Unauthorized extends CustomError {
    constructor () {
        super(401, "Usuário não autorizado.")
    }
}

export class MissingToken extends CustomError {
    constructor () {
        super(422, "Informe o token de acesso.")
    }
}

