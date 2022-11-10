import { Identifiers, IdentifierKeys, UNKNOWN_CHAR } from '../enums/identifiers'

import { is } from '../utils'

import { Token } from '../types'

export class Tokenizer {
    tokens: Token[] = [];

    private __create_token__(token: Token): Token {
        const samePosition = this.tokens.find(t => t.start === token.start && t.end === token.end);

        if (!samePosition) {
            this.tokens.push(token);
        }

        return token;
    }

    private __verify_by_id__(id: Identifiers, idKey: IdentifierKeys, char: string, p: number) {
        if (is(char, id)) {
            this.__create_token__({
                start: p,
                end: p + char.length,
                raw: char,
                identifier: idKey,
            })
        }
    }

    private __verify_string__(char: string, pointer: number) {
        const lastStart = this.tokens.slice().reverse().find(token => token.identifier === IdentifierKeys.STRING_START);
        const lastEnd = this.tokens.slice().reverse().find(token => token.identifier === IdentifierKeys.STRING_END);

        if (lastStart) {
            if (lastEnd) {
                if (this.tokens.indexOf(lastEnd) > this.tokens.indexOf(lastStart)) {
                    this.__verify_by_id__(Identifiers.QUOTE_CHAR, IdentifierKeys.STRING_START, char, pointer);
                    return;
                }
            }

            this.__verify_by_id__(Identifiers.STRING_CONTENT_CHAR, IdentifierKeys.STRING_CONTENT, char, pointer);

            this.__verify_by_id__(Identifiers.QUOTE_CHAR, IdentifierKeys.STRING_END, char, pointer);
            return;
        }

        this.__verify_by_id__(Identifiers.QUOTE_CHAR, IdentifierKeys.STRING_START, char, pointer);
        return;

    }

    private __verify_level__(level: number, pointer: number = 0) {
        for (let i = pointer; i < this.tokens.length; i++) {
            const token = this.tokens[i];

            const isStart = token.identifier === IdentifierKeys.OBJECT_START || token.identifier === IdentifierKeys.ARRAY_START;
            const isEnd = token.identifier === IdentifierKeys.OBJECT_END || token.identifier === IdentifierKeys.ARRAY_END;

            if (isEnd) {
                if (!token.level) {
                    this.tokens[i].level = level - 1;
                    break;
                }
            }

            if (isStart) {
                if (!token.level) {
                    this.tokens[i].level = level;
                    this.__verify_level__(level + 1, i + 1);
                }
            }
        }
    }

    private __verify__(char: string, pointer: number) {
        // Object characters
        this.__verify_by_id__(Identifiers.OBJECT_START_CHAR, IdentifierKeys.OBJECT_START, char, pointer);
        this.__verify_by_id__(Identifiers.OBJECT_END_CHAR, IdentifierKeys.OBJECT_END, char, pointer);

        // Whitespace characters
        this.__verify_by_id__(Identifiers.WHITESPACE_CHAR, IdentifierKeys.WHITESPACE, char, pointer);

        // String character logic
        this.__verify_string__(char, pointer);
    
        // Colon character
        this.__verify_by_id__(Identifiers.COLON_CHAR, IdentifierKeys.COLON, char, pointer);

        // Comma character
        this.__verify_by_id__(Identifiers.COMMA_CHAR, IdentifierKeys.COMMA, char, pointer)
    
        // Number character
        this.__verify_by_id__(Identifiers.NUMBER_CHAR, IdentifierKeys.NUMBER, char, pointer);
        
        // Dot character
        this.__verify_by_id__(Identifiers.DOT_CHAR, IdentifierKeys.DOT, char, pointer);

        // Array characters
        this.__verify_by_id__(Identifiers.ARRAY_START_CHAR, IdentifierKeys.ARRAY_START, char, pointer);
        this.__verify_by_id__(Identifiers.ARRAY_END_CHAR, IdentifierKeys.ARRAY_END, char, pointer);

        // Unknown characters
        this.__verify_by_id__(UNKNOWN_CHAR as Identifiers, IdentifierKeys.UNKNOWN, char, pointer);
    }

    parse(content: string) {

        for (let p = 0; p < content.length; p++) {
            
            const char = content[p];

            this.__verify__(char, p);

        }

        // Verify element level
        this.__verify_level__(1);

        return this.tokens;

    }
}
