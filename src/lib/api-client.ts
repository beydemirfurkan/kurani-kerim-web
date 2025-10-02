import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorHandler } from './error-handler';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

export class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  private errorHandler: ErrorHandler;

  private constructor(config: ApiConfig) {
    this.errorHandler = ErrorHandler.getInstance();
    
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(config?: ApiConfig): ApiClient {
    if (!ApiClient.instance) {
      const defaultConfig: ApiConfig = {
        baseURL: 'https://api.alquran.cloud/v1',
        timeout: 10000,
        retries: 3,
      };
      ApiClient.instance = new ApiClient(config || defaultConfig);
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        const appError = this.errorHandler.handleApiError(error);
        this.errorHandler.logError(appError);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
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

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleApiError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleApiError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
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
}