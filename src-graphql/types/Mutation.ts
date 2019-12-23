import { idArg, mutationType, stringArg } from 'nexus';
import { AuthUtil } from '../services/AuthUtil';

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    t.crud.createOnePost();
    t.crud.deleteOneUser();
    t.crud.deleteOnePost();
  },
});
