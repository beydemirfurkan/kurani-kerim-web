export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: AppError): void {
    this.errorLog.push(error);
    console.error(`[${error.timestamp}] ${error.code}: ${error.message}`, error.details);
  }

  createError(code: string, message: string, details?: string): AppError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  handleApiError(error: unknown): AppError {
    if (error instanceof Error) {
      return this.createError('API_ERROR', error.message, error.stack);
    }
    return this.createError('UNKNOWN_ERROR', 'An unknown error occurred');
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}