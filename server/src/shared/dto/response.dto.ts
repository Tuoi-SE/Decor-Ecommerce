export class ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: any;
    timestamp: string;

    constructor(success: boolean, data?: T, message?: string, error?: any) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
        this.timestamp = new Date().toISOString();
    }

    static success<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse(true, data, message);
    }

    static error(error: any, message?: string): ApiResponse<any> {
        return new ApiResponse(false, undefined, message, error);
    }
}

export class PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };

    constructor(data: T[], total: number, page: number, limit: number) {
        this.data = data;
        this.meta = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
