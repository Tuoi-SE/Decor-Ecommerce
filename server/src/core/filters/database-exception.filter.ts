import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError & { code: string; sqlMessage?: string }, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        // Handle MySQL duplicate entry error
        if (exception.code === 'ER_DUP_ENTRY') {
            status = HttpStatus.CONFLICT;

            // Extract field name from MySQL error message
            // Example: "Duplicate entry 'test@test.com' for key 'users.IDX_97672ac88f789774dd47f7c8be'"
            const sqlMessage = exception.sqlMessage || '';
            console.log('SQL Message:', sqlMessage); // Debug log

            // Try to extract column name from the key name
            // Pattern: for key 'table.column' or for key 'table.IDX_xxx'
            const keyMatch = sqlMessage.match(/for key '[\w]+\.([\w]+)'/i);

            if (keyMatch) {
                const indexName = keyMatch[1].toLowerCase();
                console.log('Index Name:', indexName); // Debug log

                // Map known index names to user-friendly messages
                if (indexName.includes('email') || indexName === 'idx_97672ac88f789774dd47f7c8be') {
                    message = 'Email already exists';
                } else if (indexName.includes('phone')) {
                    message = 'Phone number already exists';
                } else {
                    // Fallback: try to extract from the duplicate value
                    // Pattern: Duplicate entry 'value' for key...
                    const valueMatch = sqlMessage.match(/Duplicate entry '([^']+)'/);
                    if (valueMatch) {
                        const duplicateValue = valueMatch[1];
                        // Check if it looks like an email
                        if (duplicateValue.includes('@')) {
                            message = 'Email already exists';
                        } else if (/^\+?\d+$/.test(duplicateValue)) {
                            message = 'Phone number already exists';
                        } else {
                            message = `Duplicate entry: ${duplicateValue}`;
                        }
                    } else {
                        message = 'Duplicate entry detected';
                    }
                }
            } else {
                message = 'Duplicate entry detected';
            }
        }

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        });
    }
}
