import { AuthenticationError } from 'apollo-server-errors';
import { plugin } from 'nexus';
import { Logger } from '../services/Logger';
import { permissions } from './permissions';

const DEBUG = false;

// https://nexus.js.org/docs/api-plugins
export const PermissionPlugin = plugin({
  name: 'PermissionPlugin',
  onCreateFieldResolver(config) {
    Logger.debug(
      'PermissionPlugin.onCreateFieldResolver',
      JSON.stringify({ fieldConfig: config.fieldConfig, parentTypeConfig: config.parentTypeConfig }, null, 2),
      DEBUG
    );
    return async (root, args, ctx, info, next) => {
      try {
        const parentName = config.parentTypeConfig.name;
        if (parentName === 'Query' || parentName === 'Mutation') {
          // @ts-ignore
          const parent = permissions[config.parentTypeConfig.name];
          Logger.debug(
            `PermissionPlugin check`,
            `parentName=${parentName} parent = ${JSON.stringify(parent)}, args: ${JSON.stringify(
              { args },
              null,
              2
            )} config.fieldConfig = ${JSON.stringify(config.fieldConfig)}`,
            DEBUG
          );
          if (parent) {
            // @ts-ignore
            const { name } = config.fieldConfig.extensions.nexus.config;
            const rule = parent[name];
            if (rule) {
              if (rule(root, args, ctx)) {
                Logger.debug(
                  `PermissionPlugin check`,
                  `Permission approved ${parentName}.${name} args: ${JSON.stringify(args, null, 2)}`,
                  DEBUG
                );
                return next(root, args, ctx, info);
              }
              Logger.warning(
                `PermissionPlugin`,
                ` check: Permission denied ${parentName}.${name} args: ${JSON.stringify(args, null, 2)}`,
                ctx
              );
              throw new AuthenticationError('Permission denied');
            }
            console.error(`PermissionPlugin check: No Rule found for ${parentName}.${name}`);
            if (DEBUG) {
              console.error(`PermissionPlugin check: Rules`, JSON.stringify(permissions, null, 2));
            }
          }
        }
        return next(root, args, ctx, info);
      } catch (e) {
        console.error(`PermissionPlugin check:  Error computing permission`, e);
        throw new AuthenticationError(`PermissionPlugin check:  Error computing permission ${JSON.stringify(e)}`);
      }
    };
  },
});
