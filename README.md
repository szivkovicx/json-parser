![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Icon](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

# JSON Parser

***NOTE:***
***This is my first parser and I pushed it to Github just to showcase the project. It's not production ready in any sense.***

![New Project](https://user-images.githubusercontent.com/63911579/201115062-29d455bf-a25e-4e0b-a13b-8f12c2b93f4e.png)

This is a small project showcasing the parsing process of JSON syntax and how parser can turn JSON syntax into the object that Javascript can read.

Parser was build based on this [document](https://www.json.org/json-en.html).

This parser can parse the following types:
 * `string`
 * `number`
 * `object`
 * `array`
 * `true` ( In parser this is called `bool` )
 * `false` ( In parser this is called `bool` )
 * `null`
 
# Stages

Stages will be showcased based on the following JSON syntax:
```json
{
  "key": "value"
}
```

## Tokenization

Tokenization is a first process executed here. Tokenization is spliting the content ( `string` type ) into multiple different characters that are then identified using different identifiers. List of identifiers are:
* `WHITESPACE`
* `OBJECT_START`
* `OBJECT_END`
* `STRING_START`
* `STRING_CONTENT`
* `STRING_END`
* `COLON`
* `NUMBER`
* `COMMA`
* `DOT`
* `ARRAY_START`
* `ARRAY_END`
* `BOOL`
* `UNKNOWN`
* `NULL`

These identifiers are used to identify different characters. In this case the tokenization output would be:

```json
[
  {
    "start": 0,
    "end": 1,
    "raw": "{",
    "identifier": "OBJECT_START"
  },
  {
    "start": 1,
    "end": 2,
    "raw": "\r",
    "identifier": "WHITESPACE", 
    "child": true
  },
  ...WHITESPACE
  {
    "start": 7,
    "end": 8,
    "raw": "\"",
    "identifier": "STRING_START",
    "child": true
  },
  ...STRING_CONTENT
  {
    "start": 10,
    "end": 11,
    "raw": "y",
    "identifier": "STRING_CONTENT",
    "child": true
  },
  {
    "start": 11,
    "end": 12,
    "raw": "\"",
    "identifier": "STRING_END",
    "child": true
  },
  {
    "start": 12,
    "end": 13,
    "raw": ":",
    "identifier": "COLON",
    "child": true
  },
  {
    "start": 13,
    "end": 14,
    "raw": " ",
    "identifier": "WHITESPACE",
    "child": true
  },
  {
    "start": 14,
    "end": 15,
    "raw": "\"",
    "identifier": "STRING_START",
    "child": true
  },
  ...STRING_CONTENT
  {
    "start": 19,
    "end": 20,
    "raw": "e",
    "identifier": "STRING_CONTENT",
    "child": true
  },
  {
    "start": 20,
    "end": 21,
    "raw": "\"",
    "identifier": "STRING_END",
    "child": true
  },
  {
    "start": 21,
    "end": 22,
    "raw": "\r",
    "identifier": "WHITESPACE",
    "child": true
  },
  {
    "start": 22,
    "end": 23,
    "raw": "\n",
    "identifier": "WHITESPACE",
    "child": true
  },
  {
    "start": 23,
    "end": 24,
    "raw": "}",
    "identifier": "OBJECT_END"
  }
]
```

## Lexing

Lexing is a second process and it's fed using `Token[]` type generated from tokenization process. Lexing returns `Entity[]` type that contains different entities. Entity in this case resembles connected tokens that produce one type. On example, if `STRING_START`, `STRING_CONTENT` and `STRING_END` are registered as tokens, entity will generate string type. 

Entities can be of type:
* `string`
* `object`
* `number`
* `array`
* `bool`
* `null`
* `whitespace`
* `colon`
* `comma`
* `unknown`

In this case the lexer output would be:

```json
[
  {
    "type": "object",        
    "children": [
      {
        "type": "whitespace",
        "value": "\r\n    "  
      },
      {
        "type": "whitespace",
        "value": "\n    "    
      },
      {
        "type": "whitespace",
        "value": "    "      
      },
      {
        "type": "whitespace",
        "value": "   "       
      },
      {
        "type": "whitespace",
        "value": "  "        
      },
      {
        "type": "whitespace",
        "value": " "
      },
      {
        "type": "string",
        "value": "key"
      },
      {
        "type": "colon",
        "value": ":"
      },
      {
        "type": "whitespace",
        "value": " "
      },
      {
        "type": "string",
        "value": "value"
      },
      {
        "type": "whitespace",
        "value": "\r\n"
      },
      {
        "type": "whitespace",
        "value": "\n"
      }
    ]
  }
]
```

## AST

AST generation is a third process that is fed with `Entity[]` type and generates `ASTNode[]` type that can finally be recognized by the final process.

One AST node can be of type:
* `object`
* `string`
* `array`
* `number` 
* `bool` ( `true` | `false` )
* `null`

And have different optional data fields like:
* `children` ( only for parent-based types ( in this case `array` and `object` )
* `key`
* `value`

While type field is required and is always defined.

In this case the AST output would be:

```json
[
  {
    "type": "object",    
    "children": [        
      {
        "type": "string",
        "value": "value",
        "key": "key"     
      }
    ]
  }
]
```

## Parser

The fourth and final process is parsing the `ASTNode[]` and converting node types to Javascript native types.

The output is:

```js
{ key: 'value' }
```

You can now access `key` field inside this object.

# How to run?

First install all packages using `npm i` and run `npm start`. 

# Documentation

## parseFromFile(*path*: `string`): `object`

Parses JSON from a file. 

Args:
* *path* -> `string`
  * Defines a path of the JSON file

## parseFromString(*content*: `string`): `object`

Parses JSON from a string. 

Args:
* *content* -> `string`
  * Defines a JSON syntax based string

## Access processes

To access different processes you can import `Tokenizer`, `Lexer`, `AST` and `Parser` classes. Each of them have `parse` method ( except `AST` which has `construct` ) that accept argument of previous process result.

## Helpers

To visualize every process better, use `JSON.stringify(<object>, null, 2)`. 

## Bugs

There are a couple of bugs. I will try to fix them in the future:
* Objects can have invalid keypairs
* Number floats can have more than one dot token at any place
* Can have multiple non-nested types at the root of the file/syntax
