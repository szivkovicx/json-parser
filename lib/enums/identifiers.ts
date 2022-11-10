export enum Identifiers {
    WHITESPACE_CHAR = "\\s",
    OBJECT_START_CHAR = "{",
    OBJECT_END_CHAR = "}",
    QUOTE_CHAR = '"',
    STRING_CONTENT_CHAR = '[^\\"]+',
    COLON_CHAR = ':',
    NUMBER_CHAR = '-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?',
    COMMA_CHAR = ',',
    DOT_CHAR = '\\.',
    ARRAY_START_CHAR = '\\[',
    ARRAY_END_CHAR = ']',
    BOOL_TRUE = 't|r|u|e',
    BOOL_FALSE = 'f|a|l|s|e',
    NULL_CHAR = 'n|u|l|l'
}

export enum IdentifierKeys {
    WHITESPACE = 'WHITESPACE',
    OBJECT_START = 'OBJECT_START',
    OBJECT_END = 'OBJECT_END',
    STRING_START = 'STRING_START',
    STRING_CONTENT = 'STRING_CONTENT',
    STRING_END = 'STRING_END',
    COLON = 'COLON',
    NUMBER = 'NUMBER',
    COMMA = 'COMMA',
    DOT = 'DOT',
    ARRAY_START = 'ARRAY_START',
    ARRAY_END = 'ARRAY_END',
    BOOL = 'BOOL',
    UNKNOWN = 'UNKNOWN',
    NULL = 'NULL'
}

export const UNKNOWN_CHAR = `(?!.*(\\s|{|}|"|[^\\"]+|:|-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?|,|\\.|\\[|])).*`
