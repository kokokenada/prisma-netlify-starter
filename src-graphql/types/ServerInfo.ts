import { objectType } from 'nexus';
import { CommonResponse } from './CommonResponse';

export const ServerInfo = objectType({
  name: 'ServerInfo',
  definition(t) {
    t.string('branch');
    t.string('commit');
    t.string('buildId');
    t.string('context');
    t.string('deployId');
    t.string('nodeEnv');
    t.string('postgresServer');
    t.string('postgresPort');
    t.string('postgresServerProd');
    t.string('testEnvVar');
    t.boolean('isLoggedIn');
    t.boolean('isAdmin');
    t.field('commonResponse', { type: CommonResponse });
  },
});
