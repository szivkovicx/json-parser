import { Entity, ASTNode, ASTNodeType } from '../types'

export class AST {
    entities: Entity[] = [];
    ast: ASTNode[] = [];

    private __verify_unknown__(entity: Entity) {
        if (entity.type === 'unknown') {
            throw new Error(`${entity.value} is of the unknown type.`);
        }
    }

    private __verify_primitive__(entity: Entity, type: ASTNodeType, pointer: number, ast: ASTNode[], key?: string) {
        if (entity.type === type) {
            ast.push({
                type: type,
                value: entity.value,
                key
            })
            return true;
        }
        return false;
    }

    private __verify_keypair__(entity: Entity, pointer: number, entities: Entity[], ast: ASTNode[]) {
        if (entity.type === 'whitespace') {
            return;
        }
        if (entity.type === 'string') {
            const key = entity.value;

            for (let i = pointer + 1; i < entities.length; i++) {
                const childEntity = entities[i];

                if (childEntity.type === 'comma') {
                    return;
                }

                if (childEntity.type === 'colon') {
                    
                    for (let j = i + 1; j < entities.length; j++) {
                        if (this.__verify_primitive__(entities[j], 'string', i, ast, key)) {
                            return;
                        }
                        if (this.__verify_primitive__(entities[j], 'number', i, ast, key)) {
                            return;
                        }
                        if (this.__verify_primitive__(entities[j], 'null', i, ast, key)) {
                            return;
                        }
                        if (this.__verify_primitive__(entities[j], 'bool', i, ast, key)) {
                            return;
                        }
                        if (this.__verify_object__(entities[j], i, ast, key)) {
                            return;
                        }
                        if (this.__verify_array__(entities[j], i, ast, key)) {
                            return;
                        }
                    }

                }
            }

            return;
        }
    }

    private __verify_object__(entity: Entity, pointer: number, ast: ASTNode[], key?: string) {
        if (entity.type === 'object') {
            const sub: ASTNode[] = [];
            for (let i = 0; i < (entity.children?.length || 0); i++) {
                const childEntity = (entity.children as Entity[])[i];

                this.__verify_unknown__(childEntity)

                if ((entity.children as Entity[])?.length > 0 || childEntity.type === 'whitespace') {
                    this.__verify_keypair__(childEntity, i, entity.children || [], sub);
                }
            }
            ast.push({
                type: 'object',
                children: sub,
                key
            })
            return true;
        }
        return false;
    }

    private __verify_array__(entity: Entity, pointer: number, ast: ASTNode[], key?: string) {
        if (entity.type === 'array') {
            const sub: ASTNode[] = [];
            for (let i = 0; i < (entity.children?.length || 0); i++) {
                const childEntity = (entity.children as Entity[])[i];

                this.__verify__(childEntity, i, sub);
            }
            ast.push({
                type: 'array',
                children: sub,
                key
            })
            return true;
        }
        return false;
    }

    private __create_node__(entity: Entity, pointer: number, ast: ASTNode[], key?: string) {
        // Verify unknown entities
        this.__verify_unknown__(entity);

        // Verify string entities
        this.__verify_primitive__(entity, 'string', pointer, ast, key)

        // Verify number entities
        this.__verify_primitive__(entity, 'number', pointer, ast, key);

        // Verify boolean entities
        this.__verify_primitive__(entity, 'bool', pointer, ast, key);

        // Verify null entities
        this.__verify_primitive__(entity, 'null', pointer, ast, key);

        // Verify parent entities
        this.__verify_object__(entity, pointer, ast);
        this.__verify_array__(entity, pointer, ast);
    
    }

    private __verify__(entity: Entity, pointer: number, ast: ASTNode[]) {
        this.__create_node__(entity, pointer, ast);
    }

    construct(entities: Entity[]) {
        this.entities = entities;

        for (let p = 0; p < entities.length; p++) {
            const entity = entities[p];

            this.__verify__(entity, p, this.ast);
        }

        return this.ast;
    }

}
