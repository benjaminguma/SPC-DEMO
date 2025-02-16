export interface IUserNameService {
  checkIfUserNameExists(userName: string): Promise<boolean>;
}
