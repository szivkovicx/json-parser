import { JSONParser } from './lib'

const parser = new JSONParser();

const data = parser.parseFromFile('./example.json')

console.log(JSON.stringify(data, null, 2))
