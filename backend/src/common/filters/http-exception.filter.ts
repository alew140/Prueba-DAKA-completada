import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? (exception.getResponse() as any).message || exception.message
                : 'Internal server error';

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`Exception caught at ${request.url}`, exception instanceof Error ? exception.stack : exception);
        } else {
            this.logger.warn(`Http Exception at ${request.url}: ${message}`);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: status === HttpStatus.INTERNAL_SERVER_ERROR ? 'An unexpected error occurred' : message,
        });
    }
}
