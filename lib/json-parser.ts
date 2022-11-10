import { Tokenizer } from './tokenizer'
import { Lexer } from './lexer'
import { AST } from './ast'
import { Parser } from './parser'

import { Entity, Token, ASTNode } from './types'

import * as fs from 'fs';

export class JSONParser {

    private __tokenize__(content: string) {
        const tokenizer = new Tokenizer();

        const tokens = tokenizer.parse(content);

        return tokens;
    }

    private __lexer__(tokens: Token[]) {
        const lexer = new Lexer();

        const entities = lexer.parse(tokens);

        return entities;
    }

    private __construct_ast__(entities: Entity[]) {
        const ast = new AST();

        const tree = ast.construct(entities);

        return tree;
    }

    private __parse__(tree: ASTNode[]) {
        const parser = new Parser();

        const data = parser.parse(tree);

        return data;
    }

    private __run__(content: string) {
        const tokens = this.__tokenize__(content);

        const entities = this.__lexer__(tokens);

        const tree = this.__construct_ast__(entities);

        const parsed = this.__parse__(tree);

        return parsed;
    }

    parseFromFile(path: string) {
        try {
            const content = fs.readFileSync(path,'utf8');

            return this.__run__(content);
        } catch (err) {
            throw err;
        }
    }

    parseFromString(content: string) {
        return this.__run__(content);
    }
}
