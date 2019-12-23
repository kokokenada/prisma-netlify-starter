import { Context } from '../context';

const DEBUG = false;

export class AuthUtil {
  public static isAuthenticatedUser(context: Context, throwOnError = true): boolean {
    return true;
  }

  public static isAdmin(context: Context): boolean {
    return true;
  }
}
