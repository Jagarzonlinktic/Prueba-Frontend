"use client";
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Este efecto se asegura de que el nombre en el input
    // se actualice si los datos del usuario cambian.
    if (user) {
      setName(user.name);
    }
  }, [user]);

  // --- CAMBIO IMPORTANTE ---
  // Si el usuario no está disponible (ej. durante el logout),
  // no renderizamos nada. El layout se encargará de la redirección.
  if (!user) {
    return null; // O puedes poner un spinner: <div>Cargando perfil...</div>
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    const accessToken = localStorage.getItem('accessToken');

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('Error al actualizar el perfil.');

      const updatedUser = await res.json();
      setMessage('¡Nombre actualizado con éxito!');
      setIsEditing(false);
      // Idealmente, aquí deberías refrescar el estado del usuario en el AuthContext
      // para que el cambio se vea en el Navbar sin recargar.
      // Por ahora, actualizamos el estado local.
      setName(updatedUser.name);

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>
      <div className="space-y-3">
        {/* Usamos optional chaining (?.) como buena práctica */}
        <p><strong>Email:</strong> {user?.email}</p>
        {!isEditing ? (
          <div className="flex items-center gap-4">
            <p><strong>Nombre:</strong> {name}</p>
            <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-blue-600 hover:underline">Editar</button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="flex items-center gap-2">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="px-2 py-1 border rounded-md" />
            <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Cancelar</button>
          </form>
        )}
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>
    </div>
  );
}

