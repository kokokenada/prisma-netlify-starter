import { Context } from '../context';
import { AuthUtil } from '../services/AuthUtil';

const DEBUG = false;

// originally from graphql-shield, but had compatibility problems with Nexus

const rules = {
  isAuthenticatedUser: (_parent: any, _args: any, context: Context) => {
    try {
      if (DEBUG) {
        console.log(`permissions: isAuthenticatedUser`);
      }
      return AuthUtil.isAuthenticatedUser(context);
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  isAdmin: (_parent: any, _args: any, context: Context) => {
    try {
      if (DEBUG) {
        console.log(`permissions: isAdmin`);
      }
      return AuthUtil.isAdmin(context);
    } catch (e) {
      console.error(e);
      return false;
    }
  },
};

export const permissions = {
  Query: {
    me: rules.isAuthenticatedUser,
    users: rules.isAuthenticatedUser,
    posts: rules.isAuthenticatedUser,
    serverInfo: () => true,
  },
  Mutation: {
    signup: () => true,
  },
};
