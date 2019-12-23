import { makeSchema, plugin } from 'nexus';
import { ApolloServer } from 'apollo-server-lambda';
import { nexusPrismaPlugin } from 'nexus-prisma';
import * as path from 'path';
import { applyMiddleware } from 'graphql-middleware';
import { Photon } from './generated/photon';
import { PermissionPlugin } from './permissions';
import { Context } from './context';
import { getMakeSchema } from './types';

const photon = new Photon();

const schemaWithMiddleware = applyMiddleware(getMakeSchema());
const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: (request: any): Context => {
    return {
      event: request.event,
      photon,
      verifiedJwtToken: {},
    };
  },
});

exports.handler = server.createHandler();

// yarn is required as a result of confirmed prisma2 bug. It needs to be removed when fixed
