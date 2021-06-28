interface JSON {
    [key: string]: any;
}

interface ResponseOptions {
    json: JSON;
    statusCode: number;
    allowCORS?: boolean;
}

export interface Response {
    statusCode: number;
    body: string;
    headers?: {
        [key: string]: string;
    };
}

function lambdaResponse({
    json,
    statusCode,
    allowCORS = false,
}: ResponseOptions): Response {
    const response: Response = {
        statusCode,
        body: JSON.stringify(json),
    };

    if (allowCORS) {
        response.headers = {
            'Access-Control-Allow-Origin': '*',
        };
    }

    return response;
}

export function successResponse(json: JSON): Response {
    return lambdaResponse({
        json,
        statusCode: 200,
    });
}

export function requestValidationErrorResponse(json: JSON): Response {
    return lambdaResponse({
        json,
        statusCode: 400,
    });
}

export function resourceNotFoundErrorResponse(json: JSON): Response {
    return lambdaResponse({
        json,
        statusCode: 404,
    });
}

export function errorResponse(json: JSON): Response {
    return lambdaResponse({
        json,
        statusCode: 500,
    });
}

export function corsSuccessResponse(json: JSON): Response {
    return lambdaResponse({
        json,
        statusCode: 200,
        allowCORS: true,
    });
}

export function corsErrorResponse(json: JSON): Response {
    return lambdaResponse({
        json,
        statusCode: 500,
        allowCORS: true,
    });
}
