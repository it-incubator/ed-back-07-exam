import { userRepository } from '../repository/user-repository';
import { ObjectId, WithId } from 'mongodb';
import { cryptoService } from './crypto-service';

export type UserType = {
  name: string;
  login: string;
  passwordHash: string;
  age: number;
};

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

export const userService = {
  async registerUser(name: string, login: string, password: string, age: number): Promise<Result<string | null>> {
    if(age < 18) {
      return handleForbiddenResult('too yang');
    }

    const salt = await cryptoService.generateSalt();
    const passwordHash = await cryptoService.generateHash(password, salt);

    const createdId = await userRepository.createUser(name, login, passwordHash, age);

    return handleSuccessResult(createdId.toString());
  },

  async updateUser(id: string, login: string, name: string, age: number): Promise<void> {
    return  userRepository.updateUser(id, { login, name, age });
  },
};
