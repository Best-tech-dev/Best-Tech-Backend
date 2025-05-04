// src/utils/response.ts

export function successResponse(
    statusCode: number,
    success: boolean = true,
    message: string,
    length?: number,
    data?: any
  ): any {
    const response: any = {
      statusCode,
      success,
      message,
    };
  
    if (length !== undefined) {
      response.length = length;
    }
  
    if (data !== undefined) {
      response.data = data;
    }
  
    return response;
  }
  
  export function failureResponse(
    statusCode: number,
    message: string,
    success: boolean = false, 
    error: any = null, 
): any {
    return {
        statusCode,
        success,
        message,
        error,
    };
  }
  