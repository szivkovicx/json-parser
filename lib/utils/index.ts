import { Identifiers } from '../enums/identifiers'

export const is = (character: string, identifier: Identifiers): boolean => {
    return new RegExp(identifier).test(character);
}
