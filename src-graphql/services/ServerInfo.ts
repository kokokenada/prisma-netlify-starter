import { Context } from '../context';
import { NexusGenRootTypes } from '../generated-types.d';
import { AuthUtil } from './AuthUtil';

export class ServerInfo {
  public static async getServerInfo(ctx: Context): Promise<NexusGenRootTypes['ServerInfo']> {
    return {
      branch: process.env.BRANCH || process.env.USE_BRANCH || '',
      commit: process.env.COMMIT_REF || '',
      buildId: process.env.BUILD_ID || '',
      context: process.env.CONTEXT || '',
      deployId: process.env.DEPLOY_ID || '',
      nodeEnv: process.env.NODE_ENV || '',
      postgresServer: process.env.POSTGRES_SERVER || process.env.USE_POSTGRES_SERVER || '',
      postgresPort: process.env.POSTGRES_PORT || process.env.USE_POSTGRES_PORT || '',
      postgresServerProd: process.env.POSTGRES_SERVER_PROD || '',
      testEnvVar: process.env.TEST_ENV_VAR || '',
      isLoggedIn: AuthUtil.isAuthenticatedUser(ctx, false),
      isAdmin: AuthUtil.isAdmin(ctx),
      commonResponse: { success: true },
    };
  }
}
