import {userRepository} from '../repository/user-repository';
import {cryptoService} from './crypto-service';
import {emailAdapter} from "../adapters/email.adapter";

export enum ResultCode {
  Success = 0,
  Forbidden = 1,
  BadRequest = 2,
}

const handleSuccessResult = <T>(data: T):Result<T> => {
  return {
    data,
    resultCode: ResultCode.Success,
  }
}

const handleForbiddenResult = (message: string):Result<null> => {
  return {
    data: null,
    resultCode: ResultCode.Forbidden,
    errorMessage: message,
  }
}

export type Result<T> = {
  data: T,
  resultCode: ResultCode,
  errorMessage?: string,
}

function generateUniqCode() {
  return 'code'
}

export const userService = {
  async registerUser(email: string, login: string, password: string, age: number): Promise<Result<string | null>> {
    if(age < 18) {
      return handleForbiddenResult('too yang');
    }

    const salt = await cryptoService.generateSalt();
    const passwordHash = await cryptoService.generateHash(password, salt);

    const createdId = await userRepository.createUser(email, login, passwordHash, age);
    const code = generateUniqCode();

    try {
        await emailAdapter.sendRegistrationEmail(email, code);
    } catch (error) {
      console.log(error);
    }

    return handleSuccessResult(createdId.toString());
  },

  async updateUser(id: string, login: string, email: string, age: number): Promise<void> {
    return  userRepository.updateUser(id, { login, email, age });
  },
};
