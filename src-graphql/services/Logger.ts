import { Context } from '../context';

export class Logger {
  public static debug(source: string, message: string, DEBUG = true, ctx?: Context) {
    if (DEBUG) {
      console.log(`${source}:${message} ${Logger.userStr(ctx)}`);
    }
  }

  public static log(logger: string, message: string, ctx?: Context): void {
    console.log(`${logger}: ${message} ${Logger.userStr(ctx)}`);
  }

  public static warning(source: string, message: string, ctx?: Context): void {
    console.warn(`Warning: ${source} ${message} ${Logger.userStr(ctx)}`);
  }

  public static error(source: string, message: string, e?: any, ctx?: Context) {
    console.error(`${source}:${message} ${Logger.userStr(ctx)}`);
    if (e) {
      console.error(e);
      try {
        console.error(JSON.stringify(e, null, 2));
      } catch (se) {
        console.error('Error stringifying error');
        console.error(se);
      }
    }
  }

  private static userStr(ctx: Context | undefined): string {
    if (!ctx) {
      return '';
    }
    const useJwt = ctx.verifiedJwtToken ? ctx.verifiedJwtToken : { email: 'unknown', sub: 'unknown' };
    return ` (User Info: email: ${useJwt.email} fusion auth id: ${useJwt.sub})`;
  }
}
