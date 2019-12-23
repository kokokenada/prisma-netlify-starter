import { queryType, stringArg, intArg } from 'nexus';
import { AuthUtil } from '../services/AuthUtil';
import { Context } from '../context';
import { ServerInfo } from '../services/ServerInfo';

export const Query = queryType({
  definition(t) {
    t.field('serverInfo', {
      type: 'ServerInfo',
      resolve: async (_parent: any, _args: any, ctx: Context) => {
        return ServerInfo.getServerInfo(ctx);
      },
    });
    t.crud.user();
    t.crud.users({ ordering: true });
    t.crud.post();
    t.crud.posts({ filtering: true });
    t.field('me', {
      type: 'User',
      args: { email: stringArg({ nullable: false }) },
      resolve: (_parent, { email }, ctx) => {
        return ctx.photon.users.findOne({
          where: {
            email,
          },
        });
      },
    });
  },
});
