export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error instanceof ApiError) {
    // Handle specific API errors
    if (error.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
  throw error;
}; 