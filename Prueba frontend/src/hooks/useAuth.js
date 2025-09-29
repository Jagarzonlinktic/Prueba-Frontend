import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

// Este es un "Custom Hook"
export const useAuth = () => {
  // 1. Usa el hook `useContext` de React para acceder al valor de nuestro AuthContext.
  const context = useContext(AuthContext);

  // 2. Añade una comprobación de seguridad.
  // Si un componente intenta usar este hook fuera del AuthProvider,
  // el valor del contexto será `undefined`. Esta línea lanzará un error claro
  // para que el desarrollador sepa que olvidó envolver el componente en el AuthProvider.
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  // 3. Devuelve el valor del contexto.
  // Este valor es el objeto que definimos en AuthContext.jsx:
  // { isAuthenticated, user, login, logout, isLoading }
  return context;
};

