import { ApiError, handleApiError } from '../utils/errorHandler';

export class BaseService {
  protected static async request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, any> } = {}
  ): Promise<T> {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');

    if (options.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      endpoint = `${endpoint}?${queryParams.toString()}`;
      delete options.params;
    }

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText || 'An error occurred'
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      return handleApiError(error);
    }
  }

  protected static get<T>(endpoint: string, options: { params?: Record<string, any> } = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  protected static post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  protected static put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  protected static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
} 