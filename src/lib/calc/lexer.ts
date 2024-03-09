import { E_TOKEN_TYPE } from './types/common';
import { E_LEXER_STATE, TLexicalToken } from './types/lexer';
import { error } from './error';
import { E_ERROR_CODES } from './types/errors';

export class Lexer {
  private static readonly LEXER_OPERATORS_MAP: Record<string, E_TOKEN_TYPE> = {
    '+': E_TOKEN_TYPE.PLUS,
    '-': E_TOKEN_TYPE.MINUS,
    '*': E_TOKEN_TYPE.MULTIPLY,
    '/': E_TOKEN_TYPE.DIVIDE,
    '%': E_TOKEN_TYPE.MODULO,
    '^': E_TOKEN_TYPE.POWER,
    '!': E_TOKEN_TYPE.FACTORIAL,
  };

  private static readonly LEXER_ONE_SYMBOL_MAP: Record<string, E_TOKEN_TYPE> = {
    '(': E_TOKEN_TYPE.OPEN_PAREN,
    ')': E_TOKEN_TYPE.CLOSE_PAREN,
    '[': E_TOKEN_TYPE.SQUARE_OPEN_PAREN,
    ']': E_TOKEN_TYPE.SQUARE_CLOSE_PAREN,
    ',': E_TOKEN_TYPE.COMMA,
  };

  private _currentIndex = 0;

  private _currentLine = 0;

  private _state: E_LEXER_STATE = E_LEXER_STATE.START;

  constructor(private readonly input: string) {}

  private prepareReturn(token: TLexicalToken): TLexicalToken {
    token.width = token.value.length;
    token.line = this._currentLine;
    token.column = this._currentIndex - token.value.length;
    return token;
  }

  public getNextToken(): TLexicalToken {
    let currentChar = this.input[this._currentIndex];
    const token: TLexicalToken = {
      type: E_TOKEN_TYPE.EOF,
      value: '',
      line: 0,
      column: 0,
      width: 0,
    };

    while (currentChar !== undefined) {
      currentChar = this.input[this._currentIndex];
      this._currentIndex++;

      switch (this._state) {
        case E_LEXER_STATE.START:
          switch (currentChar) {
            case ' ':
            case '\t':
              break;
            case '\n':
            case '\r':
              this._currentLine++;
              break;
            case '\0':
              token.type = E_TOKEN_TYPE.EOF;
              token.width = 1;
              return token;
            case ',':
            case '(':
            case ')':
            case '[':
            case ']':
              token.type = Lexer.LEXER_ONE_SYMBOL_MAP[currentChar];
              token.value = currentChar;
              return this.prepareReturn(token);
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
            case '!':
            case '%':
              token.value = currentChar;

              const tokenType = Lexer.LEXER_OPERATORS_MAP[token.value];
              if (tokenType !== undefined) {
                token.type = tokenType;
              } else {
                error(
                  E_ERROR_CODES.LEXICAL_ERROR,
                  `Unexpected token: ${token.value}`,
                );
              }

              return this.prepareReturn(token);
            case '.':
              this._state = E_LEXER_STATE.NUMBER_LITERAL;
              token.value = `0${currentChar}`;
              break;
            default:
              if (currentChar?.match(/[a-zA-Z]/)) {
                this._state = E_LEXER_STATE.FUNCTION_STATE;
                token.value = currentChar;
                break;
              }

              if (currentChar?.match(/\d/)) {
                this._state = E_LEXER_STATE.NUMBER_LITERAL;
                token.value = currentChar;
                break;
              }
          }
          break;
        case E_LEXER_STATE.NUMBER_LITERAL:
          if (currentChar?.match(/[\d.]/)) {
            token.value += currentChar;
            break;
          } else {
            this._state = E_LEXER_STATE.START;
            this._currentIndex--;
            token.type = E_TOKEN_TYPE.NUMBER_LITERAL;
            return this.prepareReturn(token);
          }
        case E_LEXER_STATE.FUNCTION_STATE:
          if (currentChar?.match(/[a-zA-Z0-9_]/)) {
            token.value += currentChar;
          } else {
            this._state = E_LEXER_STATE.START;
            token.type = E_TOKEN_TYPE.FUNCTION;
            this._currentIndex--;
            return this.prepareReturn(token);
          }
          break;
        default:
          break;
      }
    }

    return token;
  }
}
