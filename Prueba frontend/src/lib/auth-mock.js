import { cookies } from 'next/headers';

// --- Configuración Mock ---
// Access Token expira rápido (60 segundos)
const ACCESS_TOKEN_EXPIRY = 60; 
// Refresh Token expira lento (7 días)
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; 

// Simulación de la base de datos de usuarios
const MOCK_USER = {
    id: 'user-123',
    email: 'user@example.com',
    name: 'Carlos Solano',
    createdAt: new Date('2023-01-01T10:00:00Z').toISOString(),
    password: 'password123', // Solo para el mock
};

// Función para simular la creación de un JWT (objeto simple)
const createMockToken = (data, expiresIn) => ({
    ...data,
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    iat: Math.floor(Date.now() / 1000),
    signature: 'mock_jwt_signature', // Simulación de firma JWT
});

/**
 * Establece el token en una cookie HTTP-only y segura.
 */
function setAuthCookie(name, tokenData, maxAge) {
    cookies().set(name, JSON.stringify(tokenData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAge,
        path: '/',
        sameSite: 'lax',
    });
}

/**
 * Obtiene y valida un token de las cookies.
 */
function getAuthToken(name) {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get(name);
    if (!tokenCookie) return null;

    try {
        const token = JSON.parse(tokenCookie.value);
        // Verifica expiración
        if (token.exp * 1000 > Date.now()) {
            return token; // Token válido y no expirado
        }
    } catch (error) {
        console.error(`Error al parsear o validar el token ${name}:`, error);
        return null;
    }
    return null; // Token expirado o inválido
}

/**
 * Mock: Inicia sesión (POST /users/login).
 * Establece el access_token y refresh_token como cookies HTTP-only.
 */
export async function mockLogin(email, password) {
    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
        throw new Error('Credenciales inválidas.');
    }

    const accessTokenPayload = createMockToken({ userId: MOCK_USER.id }, ACCESS_TOKEN_EXPIRY);
    const refreshTokenPayload = createMockToken({ userId: MOCK_USER.id }, REFRESH_TOKEN_EXPIRY);

    // Almacenar en Cookies HTTP-only
    setAuthCookie('access_token', accessTokenPayload, ACCESS_TOKEN_EXPIRY);
    setAuthCookie('refresh_token', refreshTokenPayload, REFRESH_TOKEN_EXPIRY);

    return { id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name };
}

/**
 * Mock: Obtiene el perfil del usuario (GET /users/me).
 * Requiere un access_token válido.
 */
export async function mockGetUserProfile() {
    const accessToken = getAuthToken('access_token');
    
    if (!accessToken) {
        return null;
    }

    // Simulación de fetch al DB con el userId del token
    return {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name,
        createdAt: MOCK_USER.createdAt,
    };
}

/**
 * Mock: Actualiza el perfil del usuario (PUT /users/me).
 * Requiere un access_token válido.
 */
export async function mockUpdateUserProfile(newName) {
    const accessToken = getAuthToken('access_token');
    
    if (!accessToken) {
        throw new Error('No autorizado.'); // Error 401 simulado
    }
    
    // Simulación de actualización de DB
    MOCK_USER.name = newName; 

    return {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name,
        createdAt: MOCK_USER.createdAt,
    };
}

/**
 * Mock: Cierra la sesión (Elimina los tokens).
 */
export function mockLogout() {
    cookies().delete('access_token');
    cookies().delete('refresh_token');
}
