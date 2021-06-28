import { RequestValidationError } from './errors';

export default function (schema: any, request: any) {
    try {
        schema.parse(request);
    } catch (e) {
        const errorMessage = JSON.parse(e.message)[0];
        if(errorMessage.received === 'undefined') {
            throw new RequestValidationError(`${errorMessage.path[0]} of type ${errorMessage.expected} is required`);
        } else {
            throw new RequestValidationError(
                `Expected ${errorMessage.path[0]} to be of type ${errorMessage.expected}, received ${errorMessage.received}`
            );
        }
    }
}