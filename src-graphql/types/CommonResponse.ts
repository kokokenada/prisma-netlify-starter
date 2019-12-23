import { objectType, enumType } from 'nexus';

export enum EnumErrorCode {
  NOT_CODED,
  EMAIL_ADDRESS_INVALID = 1,
}
export const ErrorCode = enumType({
  name: 'ErrorCode',
  members: {
    NOT_CODED: 0,
    EMAIL_ADDRESS_INVALID: 1,
  },
});

export const ErrorDetails = objectType({
  name: 'ErrorDetails',
  definition(t) {
    t.field('errorCode', { type: ErrorCode });
    t.string('errorMessage', { nullable: true });
  },
});

/**
 * Should be included with every Query or Mutation response
 */
export const CommonResponse = objectType({
  name: 'CommonResponse',
  definition(t) {
    t.boolean('success', { description: 'True if request was successful', nullable: false });
    t.list.field('errorMessages', { type: ErrorDetails, nullable: true });
  },
});
