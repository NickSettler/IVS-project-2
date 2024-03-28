import { clone } from 'lodash';
import { E_TOKEN_TYPE } from './types/common';
import { TSyntaxTokenAttribute } from './types/parser';
import { TAbstractSyntaxTree } from './ast';
import { TLexicalToken } from './types/lexer';
import { error, unexpectedSyntaxTokenError } from './error';
import { E_ERROR_CODES } from './types/errors';

export class Scanner {
  private static lowerToken = (type: E_TOKEN_TYPE): TSyntaxTokenAttribute => ({
    ...(type && { type }),
    isRightAssociative: false,
    isBinary: false,
    isUnary: false,
    precedence: -1,
  });

  private static readonly SYNTAX_TOKEN_ATTRIBUTES: Record<
    E_TOKEN_TYPE,
    TSyntaxTokenAttribute
  > = {
    [E_TOKEN_TYPE.EOF]: Scanner.lowerToken(E_TOKEN_TYPE.EOF),
    [E_TOKEN_TYPE.COMMA]: Scanner.lowerToken(E_TOKEN_TYPE.EOF),
    [E_TOKEN_TYPE.OPEN_PAREN]: Scanner.lowerToken(E_TOKEN_TYPE.OPEN_PAREN),
    [E_TOKEN_TYPE.CLOSE_PAREN]: Scanner.lowerToken(E_TOKEN_TYPE.CLOSE_PAREN),
    [E_TOKEN_TYPE.SQUARE_OPEN_PAREN]: Scanner.lowerToken(
      E_TOKEN_TYPE.SQUARE_OPEN_PAREN,
    ),
    [E_TOKEN_TYPE.SQUARE_CLOSE_PAREN]: Scanner.lowerToken(
      E_TOKEN_TYPE.SQUARE_CLOSE_PAREN,
    ),
    [E_TOKEN_TYPE.NUMBER_LITERAL]: Scanner.lowerToken(
      E_TOKEN_TYPE.NUMBER_LITERAL,
    ),
    [E_TOKEN_TYPE.PLUS]: {
      type: E_TOKEN_TYPE.PLUS,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 12,
    },
    [E_TOKEN_TYPE.MINUS]: {
      type: E_TOKEN_TYPE.MINUS,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 12,
    },
    [E_TOKEN_TYPE.MULTIPLY]: {
      type: E_TOKEN_TYPE.MULTIPLY,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 13,
    },
    [E_TOKEN_TYPE.DIVIDE]: {
      type: E_TOKEN_TYPE.DIVIDE,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 13,
    },
    [E_TOKEN_TYPE.NEGATE]: {
      type: E_TOKEN_TYPE.NEGATE,
      isRightAssociative: false,
      isBinary: false,
      isUnary: true,
      precedence: 14,
    },
    [E_TOKEN_TYPE.FACTORIAL]: {
      type: E_TOKEN_TYPE.FACTORIAL,
      isRightAssociative: false,
      isBinary: false,
      isUnary: true,
      precedence: 15,
    },
    [E_TOKEN_TYPE.MODULO]: {
      type: E_TOKEN_TYPE.MODULO,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 13,
    },
    [E_TOKEN_TYPE.POWER]: {
      type: E_TOKEN_TYPE.POWER,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 14,
    },
    [E_TOKEN_TYPE.FUNCTION]: Scanner.lowerToken(E_TOKEN_TYPE.FUNCTION),
    [E_TOKEN_TYPE.FUNCTION_NAME]: Scanner.lowerToken(
      E_TOKEN_TYPE.FUNCTION_NAME,
    ),
    [E_TOKEN_TYPE.FUNCTION_ARGS]: Scanner.lowerToken(
      E_TOKEN_TYPE.FUNCTION_ARGS,
    ),
    [E_TOKEN_TYPE.SET]: Scanner.lowerToken(E_TOKEN_TYPE.SET),
    [E_TOKEN_TYPE.SET_ITEM]: Scanner.lowerToken(E_TOKEN_TYPE.SET_ITEM),
    [E_TOKEN_TYPE.NODE]: Scanner.lowerToken(E_TOKEN_TYPE.NODE),
  };

  private readonly _tree: TAbstractSyntaxTree;

  private currentToken!: TLexicalToken;

  constructor(private readonly getTokenFunc: () => TLexicalToken) {
    this._tree = new TAbstractSyntaxTree();
  }

  private getToken() {
    this.currentToken = this.getTokenFunc();
  }

  private expectToken(tokenType: E_TOKEN_TYPE) {
    if (this.currentToken.type !== tokenType) {
      error(
        E_ERROR_CODES.SYNTAX_ERROR,
        `Expecting ${tokenType}, got ${this.currentToken.value}`,
      );
    }
  }

  private processFunctionArgs(): TAbstractSyntaxTree | undefined {
    if (this.currentToken.type === E_TOKEN_TYPE.CLOSE_PAREN) {
      this.getToken();
      return undefined;
    }

    let tree = new TAbstractSyntaxTree(
      E_TOKEN_TYPE.FUNCTION_ARGS,
      undefined,
      this.processExpression(0),
      undefined,
    );

    while (this.currentToken.type === E_TOKEN_TYPE.COMMA) {
      this.expectToken(E_TOKEN_TYPE.COMMA);
      this.getToken();
      const node = this.processExpression(0);
      tree = new TAbstractSyntaxTree(
        E_TOKEN_TYPE.FUNCTION_ARGS,
        undefined,
        node,
        tree,
      );
    }

    this.expectToken(E_TOKEN_TYPE.CLOSE_PAREN);

    this.getToken();

    return tree;
  }

  private processExpression(precedence: number): TAbstractSyntaxTree {
    let x = new TAbstractSyntaxTree();
    let node = new TAbstractSyntaxTree();

    switch (this.currentToken.type) {
      case E_TOKEN_TYPE.OPEN_PAREN:
        x = this.parenthesizedExpression();
        break;
      case E_TOKEN_TYPE.SQUARE_OPEN_PAREN:
        x = this.processSet();
        break;
      case E_TOKEN_TYPE.FUNCTION:
        const nameNode = new TAbstractSyntaxTree(
          E_TOKEN_TYPE.FUNCTION_NAME,
          this.currentToken.value,
        );
        this.getToken();

        this.expectToken(E_TOKEN_TYPE.OPEN_PAREN);
        this.getToken();

        const argsNode = this.processFunctionArgs();
        x.type = E_TOKEN_TYPE.FUNCTION;
        x.left = nameNode;
        x.right = argsNode;

        break;
      case E_TOKEN_TYPE.PLUS:
      case E_TOKEN_TYPE.MINUS:
        const type = this.currentToken.type;
        this.getToken();
        node = this.processExpression(
          Scanner.SYNTAX_TOKEN_ATTRIBUTES[E_TOKEN_TYPE.NEGATE].precedence,
        );
        x =
          type === E_TOKEN_TYPE.MINUS
            ? new TAbstractSyntaxTree(
                E_TOKEN_TYPE.NEGATE,
                undefined,
                node,
                undefined,
              )
            : node;
        break;
      case E_TOKEN_TYPE.NUMBER_LITERAL:
        x.type = this.currentToken.type;
        x.value = this.currentToken.value;
        this.getToken();
        break;
      default:
        throw new SyntaxError(
          `Expected expression on line ${
            this.currentToken.line
          }/${this.currentToken.column}:${
            this.currentToken.column + this.currentToken.width
          }, got "${this.currentToken.value}"`,
        );
    }

    while (
      Scanner.SYNTAX_TOKEN_ATTRIBUTES[this.currentToken.type]?.isBinary &&
      (Scanner.SYNTAX_TOKEN_ATTRIBUTES[this.currentToken.type]?.precedence ??
        0) >= precedence
    ) {
      const { type }: { type: keyof typeof Scanner.SYNTAX_TOKEN_ATTRIBUTES } =
        this.currentToken;

      this.getToken();

      let q = Scanner.SYNTAX_TOKEN_ATTRIBUTES[type]?.precedence ?? 0;
      if (!Scanner.SYNTAX_TOKEN_ATTRIBUTES[type]?.isRightAssociative) q++;

      node = this.processExpression(q);
      const xt = clone(x);
      x = new TAbstractSyntaxTree();
      x.type = Scanner.SYNTAX_TOKEN_ATTRIBUTES[type].type;
      x.left = xt;
      x.right = clone(node);
    }

    while (Scanner.SYNTAX_TOKEN_ATTRIBUTES[this.currentToken.type]?.isUnary) {
      const { type }: { type: keyof typeof Scanner.SYNTAX_TOKEN_ATTRIBUTES } =
        this.currentToken;

      x = new TAbstractSyntaxTree(
        Scanner.SYNTAX_TOKEN_ATTRIBUTES[type].type,
        undefined,
        x,
        undefined,
      );

      this.getToken();
    }

    return x;
  }

  private parenthesizedExpression(): TAbstractSyntaxTree {
    this.expectToken(E_TOKEN_TYPE.OPEN_PAREN);
    this.getToken();
    const tree = this.processExpression(0);
    this.expectToken(E_TOKEN_TYPE.CLOSE_PAREN);
    this.getToken();
    return tree;
  }

  private processSet(): TAbstractSyntaxTree {
    const tree = new TAbstractSyntaxTree(E_TOKEN_TYPE.SET);

    this.expectToken(E_TOKEN_TYPE.SQUARE_OPEN_PAREN);
    this.getToken();

    if (this.currentToken.type === E_TOKEN_TYPE.SQUARE_CLOSE_PAREN) {
      this.getToken();
      return tree;
    }

    tree.right = new TAbstractSyntaxTree(E_TOKEN_TYPE.SET_ITEM);
    tree.right.left = this.processExpression(0);

    while (this.currentToken.type === E_TOKEN_TYPE.COMMA) {
      this.expectToken(E_TOKEN_TYPE.COMMA);
      this.getToken();
      tree.right = new TAbstractSyntaxTree(
        E_TOKEN_TYPE.SET_ITEM,
        undefined,
        this.processExpression(0),
        tree.right,
      );
    }

    this.expectToken(E_TOKEN_TYPE.SQUARE_CLOSE_PAREN);

    this.getToken();

    return tree;
  }

  public processQuery(): TAbstractSyntaxTree {
    this.getToken();

    const tree = new TAbstractSyntaxTree();

    switch (this.currentToken.type) {
      case E_TOKEN_TYPE.FUNCTION:
      case E_TOKEN_TYPE.MINUS:
      case E_TOKEN_TYPE.PLUS:
      case E_TOKEN_TYPE.NUMBER_LITERAL:
      case E_TOKEN_TYPE.OPEN_PAREN:
      case E_TOKEN_TYPE.SQUARE_OPEN_PAREN:
        tree.type = E_TOKEN_TYPE.NODE;
        tree.right = this.processExpression(0);
        break;
      case E_TOKEN_TYPE.EOF:
        break;
      default:
        unexpectedSyntaxTokenError(this.currentToken);
    }

    return tree;
  }
}
