import dotenv from "dotenv"
import * as jwt from "jsonwebtoken"
import { Unauthorized } from "../error/UserErrors"
import { AuthenticationData } from "../models/AuthenticationData"

dotenv.config()

export class Authenticator {
    public generateToken = ({id}: AuthenticationData): string => {
        const token = jwt.sign(
            {id},
            process.env.JWT_KEY as string,
            {expiresIn: "2h"}
        )

        return token
    }

    getTokenData = (token: string): AuthenticationData => {
        try {
            const payload = jwt.verify(token, process.env.JWT_KEY as string) as AuthenticationData
            return payload
        } catch (err: any) {
            throw new Unauthorized()
        }
    }
}