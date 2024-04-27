import { CommonResponse } from "@base/api/interfaces/CommonResponse"
import { Error } from "@base/api/interfaces/Error"

export const createCommonResponse = (success: boolean, status: number, message: string, data?: any, errors?: any): CommonResponse<any> => {
    return {
        success,
        status,
        message,
        data,
        errors
    }
}