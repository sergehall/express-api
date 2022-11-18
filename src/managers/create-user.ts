import uuid4 from "uuid4";
import add from "date-fns/add";

export class NewUserObj {
  constructor(
    private id: string,
    private login: string,
    private email: string,
    private passwordSalt: string,
    private passwordHash: string,
    private ip: string | null) {
  }

  create() {
    return {
      accountData: {
        id: this.id,
        login: this.login,
        email: this.email,
        passwordSalt: this.passwordSalt,
        passwordHash: this.passwordSalt,
        createdAt: new Date().toISOString()
      },
      emailConfirmation: {
        confirmationCode: uuid4().toString(),
        expirationDate: add(new Date(),
          {
            hours: 1,
            minutes: 5
          }).toISOString(),
        isConfirmed: false,
        sentEmail: [{sendTime: new Date().toISOString()}]
      },
      registrationData: [{
        ip: this.ip,
        createdAt: new Date().toISOString()
      }]
    }
  }
}