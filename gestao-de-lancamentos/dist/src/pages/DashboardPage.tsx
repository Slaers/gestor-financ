import React from 'react';
import { useNavigate } from 'react-router-dom'; // Added import
import { useUserStore } from '../store/userStore';

const DashboardPage: React.FC = () => {
  const { user, clearUserAndToken } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserAndToken();
    // No need to manually remove from localStorage if persist middleware is used correctly
    navigate('/login'); // Navigate to login after logout
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Bem-vindo, {user?.name || 'Usuário'}!</p>
      <p className="mt-2">Seu ID de usuário é: {user?.id || 'Não disponível'}</p>
      <p className="mt-2">Seu token é: {useUserStore.getState().token ? 'Presente' : 'Ausente'}</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  );
};

export default DashboardPage;
