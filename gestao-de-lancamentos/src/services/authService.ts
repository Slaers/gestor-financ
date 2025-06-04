import axios from 'axios';

// Define the base URL for the API.
// In a real application, this would likely come from an environment variable.
const API_BASE_URL = 'https://gestao-de-lancamentos.web.app/api/v1'; // Using the URL provided in the issue

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  // Add other user properties as defined by your API
}

interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Calls the login API endpoint.
 * @param credentials - The user's email and password.
 * @returns A promise that resolves with the login response (token and user data).
 */
export const loginAPI = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    // Axios wraps errors, so we can inspect error.response
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Login API error:', error.response.data);
      throw new Error(error.response.data.message || 'Login failed due to server error');
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      console.error('Login API no response:', error.request);
      throw new Error('No response from server. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Login API request setup error:', error.message);
      throw new Error('An unexpected error occurred during login.');
    }
  }
};
