import {Request, Response, Router} from 'express';
import {ResultCode, userService} from '../services/user-service';
import {userQueryRepository, UserViewType} from "../repository/user-query-repo";
import {userRepository} from "../repository/user-repository";

const resultCodeToHttpException = (resultCode: ResultCode): number => {
  switch (resultCode) {
    case ResultCode.BadRequest:
      return 400;
    case ResultCode.Forbidden:
      return 403;
    default:
      return 500;
  }
}

export const userRouter = Router({});

userRouter.get('/', async (req: Request, res: Response) => {
  const users = await userQueryRepository.getUsers();
  res.send(users);
});

userRouter.post('/registration', async (req: Request, res: Response<UserViewType | string>) => {
  const name = req.body.name;
  const login = req.body.login;
  const password = req.body.password;
  const age = req.body.age;
  const result = await userService.registerUser(name, login, password, age);

  if(result.resultCode !== ResultCode.Success) {
    res.status(resultCodeToHttpException(result.resultCode)).send(result.errorMessage);

    return;
  }

  const user = await userRepository.getUser(result.data!);

  res.status(201).send(user! as unknown as UserViewType);
});