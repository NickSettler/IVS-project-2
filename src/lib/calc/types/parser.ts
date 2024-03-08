import { E_TOKEN_TYPE } from './common';

export type TSyntaxTokenAttribute = {
  type: E_TOKEN_TYPE;
  isRightAssociative: boolean;
  isBinary: boolean;
  isUnary: boolean;
  precedence: number;
};
