import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { ErrorHandler } from './error-handler';

export interface DiyanetApiConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
}

export class DiyanetApiClient {
  private static instance: DiyanetApiClient;
  private client: AxiosInstance;
  private errorHandler: ErrorHandler;
  private apiKey: string;

  private constructor(config: DiyanetApiConfig) {
    this.errorHandler = ErrorHandler.getInstance();
    this.apiKey = config.apiKey;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(config?: DiyanetApiConfig): DiyanetApiClient {
    if (!DiyanetApiClient.instance) {
      const defaultConfig: DiyanetApiConfig = {
        baseURL: '/api', // Use Next.js API routes instead of direct API calls
        apiKey: '', // Not needed for client-side, API routes handle authentication
        timeout: 15000,
      };
      DiyanetApiClient.instance = new DiyanetApiClient(config || defaultConfig);
    }
    return DiyanetApiClient.instance;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Diyanet API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        const appError = this.errorHandler.handleApiError(error);
        this.errorHandler.logError(appError);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`Diyanet API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        const appError = this.errorHandler.handleApiError(error);
        this.errorHandler.logError(appError);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleApiError(error);
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleApiError(error);
    }
  }

  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  updateApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  }
}
