import { ASTNode } from '../types'

export class Parser {
    data: any[] = [];

    private __verify_primitive__(pointer: number, type: string, convertor: any, data: any) {
        try {
            const node = data[pointer];
    
            if (node.type === type) {
                data[pointer] = convertor(node.value)
            }    
        } catch (err) {
            throw err;
        }
    }

    private __verify_object__(pointer: number, data: any) {
        try {
            const node = data[pointer];
        
            if (node?.type === 'object') {
                for (let i = 0; i < node.children.length; i++) {
                    let temp: any[] = [node.children[i]];

                    this.__verify__(0, temp);
                
                    node.children[i] = {
                        [node.children[i].key]: temp[0]
                    }
                }

                data[pointer] = Object.assign({}, ...node.children);
            }
        } catch (err) {
            throw err;
        }
    }

    private __verify_array__(pointer: number, data: any) {
        try {
            const node = data[pointer];

            if (node?.type === 'array') {
                for (let i = 0; i < node.children.length; i++) {
                    let temp: any[] = [node.children[i]]

                    this.__verify__(0, temp);

                    node.children[i] = temp[0];
                }
                data[pointer] = node.children;
            }
        } catch (err) {
            throw err;
        }
    }

    private __verify__(pointer: number, data: any) {

        // Parse string
        this.__verify_primitive__(pointer, 'string', String, data);

        // Parse boolean
        this.__verify_primitive__(pointer, 'bool', Boolean, data);

        // Parse number
        this.__verify_primitive__(pointer, 'number', Number, data);

        // Parse null
        this.__verify_primitive__(pointer, 'null', () => null, data)

        // Parse parents
        this.__verify_array__(pointer, data);
        this.__verify_object__(pointer, data);
    }

    parse(ast: ASTNode[]) {
        this.data = [...ast];

        for (let p = 0; p < this.data.length; p++) {
            this.__verify__(p, this.data);
        }

        return this.data[0];
    }
}
