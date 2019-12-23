import { makeSchema, plugin } from 'nexus';
import { nexusPrismaPlugin } from 'nexus-prisma';
import * as path from 'path';
import { PermissionPlugin } from '../permissions';
import * as types from './index';

// Example plugin
const LogTimePlugin = plugin({
  name: 'LogTimePlugin',
  onCreateFieldResolver(config) {
    if (config.parentTypeConfig.name !== 'Mutation') {
      return;
    }
    // eslint-disable-next-line consistent-return
    return async (root, args, ctx, info, next) => {
      const startTimeMs = new Date().valueOf();
      const value = await next(root, args, ctx, info);
      const endTimeMs = new Date().valueOf();
      console.log(`Mutation ${JSON.stringify(info.operation.name)} took ${endTimeMs - startTimeMs} ms`);
      return value;
    };
  },
});

export const getMakeSchema = (output = false) => {
  return makeSchema({
    types,
    plugins: [
      nexusPrismaPlugin({
        inputs: {
          photon: require.resolve('../generated/photon'),
        },
        shouldGenerateArtifacts: false,
      }),
      PermissionPlugin,
      LogTimePlugin,
    ],
    outputs:
      output === false
        ? false
        : {
            schema: path.join(__dirname, '../../src-graphql/schema.graphql'),
            typegen: path.join(__dirname, '../../src-graphql/generated-types.d.ts'),
          },
  });
};
