/**
 * @module calc
 * @description
 * The library is using formal language theory to parse and execute mathematical expressions.
 *
 * The expression execution process consists of the following steps:
 * 1. The expression is tokenised by the {@link Lexer} class.
 * 2. The {@link Lexer.getNextToken} method is called to get the next token in the {@link Scanner} class,
 * during the {@link Scanner.processQuery} method execution. As a result, the {@link Scanner} class
 * builds an abstract syntax tree ({@link TAbstractSyntaxTree}) from the tokens.
 * 3. The ({@link TAbstractSyntaxTree}) is executed by the {@link Executor.execute} method of the
 * {@link Executor} class. The method returns the result of the expression execution as a string.
 *
 * @author NickSettler (moiseevnikita14@gmail.com)
 */

export * from './types/ast';
export * from './types/common';
export * from './types/errors';
export * from './types/lexer';
export * from './types/parser';
export * from './types/executor';
export * from './ast';
export * from './error';
export * from './executor';
export * from './lexer';
export * from './parser';
export * from './utils';
