import { validate, Length, IsEmail, IsInt, Min } from "class-validator";

export class LoginModel {
  @IsEmail()
  email: string;
  @Length(12, 64)
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static async fromUntrusted(data: any): Promise<LoginModel> {
    let login = new LoginModel(data.email, data.password);
    if ((await validate(login)).length) throw new Error("Bad login");
    return login;
  }
}
