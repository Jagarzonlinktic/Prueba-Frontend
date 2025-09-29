// Importa las herramientas necesarias de 'msw'
import { http, HttpResponse } from 'msw';

// 1. SIMULACIÓN DE BASE DE DATOS
// En una app real, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
// Para nuestro mock, es suficiente con un simple objeto.
let mockUser = {
  id: '1',
  email: 'user@example.com',
  password: 'password123', // En un backend real, esto estaría hasheado
  name: 'Juan Pérez',
  createdAt: new Date().toISOString(),
};

// 2. FUNCIÓN PARA CREAR UN JWT FALSO
// Esto simula cómo un backend crearía un token. No es un JWT real y seguro,
// pero sirve para nuestra simulación.
const createFakeJWT = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const finalPayload = btoa(JSON.stringify(payload));
  const signature = 'fake-signature-that-is-not-secure';
  return `${header}.${finalPayload}.${signature}`;
};

// 3. ARRAY DE HANDLERS
// MSW usará este array para interceptar las peticiones de red.
export const handlers = [

  // Handler para el Login: POST /api/users/login
  http.post('/api/users/login', async ({ request }) => {
    const { email, password } = await request.json();

    if (email !== mockUser.email || password !== mockUser.password) {
      // Si las credenciales son incorrectas, devuelve un error 401
      return HttpResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // Si son correctas, crea los tokens y devuelve los datos
    const accessToken = createFakeJWT({ userId: mockUser.id });
    const refreshToken = createFakeJWT({ userId: mockUser.id });

    return HttpResponse.json({
      user: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
      accessToken,
      refreshToken,
    });
  }),

  // Handler para obtener perfil: GET /api/users/me
  http.get('/api/users/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
    
    // Devuelve los datos del usuario logueado
    return HttpResponse.json({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      createdAt: mockUser.createdAt,
    });
  }),

  // Handler para actualizar perfil: PUT /api/users/me
  http.put('/api/users/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name) {
      return HttpResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
    }

    // Actualiza el nombre en nuestra "base de datos"
    mockUser.name = name;

    // Devuelve el usuario actualizado
    return HttpResponse.json(mockUser);
  }),

  // Handler para refrescar el token: POST /api/users/refresh
  http.post('/api/users/refresh', () => {
    // Para la simulación, simplemente creamos un nuevo accessToken.
    const newAccessToken = createFakeJWT({ userId: mockUser.id });
    return HttpResponse.json({ accessToken: newAccessToken });
  }),
];

