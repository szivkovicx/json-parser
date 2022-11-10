import { textChangeRangeIsUnchanged } from 'typescript';
import { Entity, Token, EntityType } from '../types';

export class Lexer {
    tokens: Token[] = [];
    entities: Entity[] = [];

    private __create_string_entity__(token: Token, pointer: number, entities: Entity[]) {
        const isValid = token.identifier === 'STRING_START';

        if (isValid) {
            const entity: Entity = {
                type: 'string',
                value: ''
            }

            for (let i = pointer; i < this.tokens.length; i++) {
                const token = this.tokens[i];

                if (token.identifier === 'STRING_END') {
                    break;
                }

                if (token.identifier === 'STRING_CONTENT') {
                    entity.value += token.raw;
                }
            }

            entities.push(entity);
        }
    }

    private __create_number_entity__(token: Token, pointer: number, entities: Entity[]) {
        const isValid = token.identifier === 'NUMBER';

        if (isValid) {
            const entity: Entity = {
                type: 'number',
                value: ''
            }

            const preToken = this.tokens[pointer - 1];

            if (preToken) {
                if (preToken.identifier === 'NUMBER' || preToken.identifier === 'DOT') {
                    return;
                }
            }

            for (let i = pointer; i < this.tokens.length; i++) {
                const token = this.tokens[i];

                if (token.identifier !== 'NUMBER') {
                    if (token.identifier === 'DOT') {
                        entity.value += token.raw;
                        continue;
                    }
                    break;
                }

                entity.value += token.raw;
            }

            entities.push(entity);
        }
    }

    private __create_special_entity__(token: Token, pointer: number, type: string, value: string, entities: Entity[]) {
        const isValid = token.identifier === 'UNKNOWN';

        if (isValid) {
            const entity: Entity = {
                type: type as EntityType,
                value: ''
            }

            const preToken = this.tokens[pointer - 1]
            
            if (preToken) {
                
                if (preToken.identifier === 'UNKNOWN') {
                    return;
                }
            }

            for (let i = pointer; i < this.tokens.length; i++) {
                const token = this.tokens[i];

                if (token.identifier !== 'UNKNOWN') {
                    break;
                }

                entity.value += token.raw;
            }

            if (entity.value !== value) {
                return;
            }

            token.identifier = type.toUpperCase();

            entities.push(entity);
        }
    }

    private __create_entity__(token: Token, pointer: number, id: EntityType, entities: Entity[]) {
        const isValid = token.identifier === id.toUpperCase();

        if (isValid) {
            const entity: Entity = {
                type: id as any,
                value: ''
            }

            for (let i = pointer; i < this.tokens.length; i++) {
                const token = this.tokens[i];

                if (token.identifier !== id.toUpperCase()) {
                    break;
                }

                entity.value += token.raw;
            }

            entities.push(entity);
        }
    }

    private __create_unknown_entity__(token: Token, pointer: number, id: EntityType, entities: Entity[]) {
        const isValid = token.identifier === id.toUpperCase();

        if (isValid) {
            const entity: Entity = {
                type: id as any,
                value: ''
            }

            const preToken = this.tokens[pointer - 1]
            
            if (preToken) {
                
                if (preToken.identifier === 'UNKNOWN' || preToken.identifier === 'BOOL' || preToken.identifier === 'NULL') {
                    return;
                }
            }

            for (let i = pointer; i < this.tokens.length; i++) {
                const token = this.tokens[i];

                if (token.identifier !== id.toUpperCase()) {
                    break;
                }

                entity.value += token.raw;
            }

            entities.push(entity);
        }
    }

    private __create_parent_entity__(type: 'OBJECT' | 'ARRAY', token: Token, pointer: number, entities: Entity[], level: number) {
        const isValid = token.identifier === `${type}_START`;

        if (isValid) {
            const entity: Entity = {
                type: type.toLowerCase() as EntityType,
                children: []
            }

            const children: Entity[] = [];

            for (let i = pointer + 1; i < this.tokens.length; i++) {
                if (this.tokens[i].identifier === `${type}_END` && token.level === this.tokens[i].level) {
                    break;
                }

                this.__verify__(this.tokens[i], i, children, token.level as number)
                this.tokens[i].child = true;
            }

            entity.children?.push(...children);

            entities.push(entity);
        }

    }

    private __verify__(token: Token, pointer: number, entities: Entity[], level: number) {
        // Skip child tokens
        if (token?.child) {
            return;
        }

        // String entity
        this.__create_string_entity__(token, pointer, entities)

        // Number entity
        this.__create_number_entity__(token, pointer, entities)

        // Colon entity
        this.__create_entity__(token, pointer, 'colon', entities);

        // Whitespace entity
        this.__create_entity__(token, pointer, 'whitespace', entities);

        // Comma entity
        this.__create_entity__(token, pointer, 'comma', entities);

        // NULL entity
        this.__create_special_entity__(token, pointer, 'null', 'null', entities);

        // True value entity
        this.__create_special_entity__(token, pointer, 'bool', 'true', entities);

        // False value entity
        this.__create_special_entity__(token, pointer, 'bool', 'false', entities);

        // Parent entities
        this.__create_parent_entity__('OBJECT' ,token, pointer, entities, level);
        this.__create_parent_entity__('ARRAY' ,token, pointer, entities, level);

        // Unknown entity
        this.__create_unknown_entity__(token, pointer, 'unknown', entities);
    }

    parse(tokens: Token[]) {
        this.tokens = tokens;

        for (let p = 0; p < tokens.length; p++) {
            const token = tokens[p];
        
            this.__verify__(token, p, this.entities, 1);
        }

        return this.entities;
    }

}
