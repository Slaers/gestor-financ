import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { loginAPI } from '../services/authService';

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AuthError {
  type: 'email' | 'password' | 'api';
  message: string;
}

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserAndToken } = useUserStore();

  const validate = (): boolean => {
    const newErrors: AuthError[] = [];
    if (!email) {
      newErrors.push({ type: 'email', message: 'Email é obrigatório.' });
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.push({ type: 'email', message: 'Formato de email inválido.' });
    }

    if (!password) {
      newErrors.push({ type: 'password', message: 'Senha é obrigatória.' });
    } else if (password.length < 8) {
      newErrors.push({ type: 'password', message: 'Senha deve ter no mínimo 8 caracteres.' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors([]); // Clear previous API errors

    try {
      const { token, user } = await loginAPI({ email, password });
      setUserAndToken(user, token);
      // Token is also persisted to localStorage by Zustand middleware
      navigate('/dashboard');
    } catch (error: any) {
      // Display a generic error message for API errors
      setErrors([{ type: 'api', message: error.message || 'Email ou senha inválidos. Tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (type: 'email' | 'password' | 'api') => {
    const error = errors.find(err => err.type === type);
    return error ? error.message : undefined;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    getErrorMessage,
    apiError: errors.find(err => err.type === 'api')?.message, // Convenience for general API error
  };
};
