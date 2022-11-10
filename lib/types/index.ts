export interface Token {
    start: number;
    end: number;
    raw: string;
    identifier: string;
    child?: boolean;
    level?: number;
}

export type EntityType = 'string' | 'object' | 'number' | 'array' | 'bool' | 'null' | 'whitespace' | 'colon' | 'comma' | 'unknown';

export interface Entity {
    type: EntityType;
    value?: string;
    children?: Entity[];
}

export type ASTNodeType = 'object' | 'string' | 'array' | 'number' | 'bool' | 'null'

export interface ASTNode {
    type: ASTNodeType;
    children?: ASTNode[];
    key?: string;
    value?: string;
}
