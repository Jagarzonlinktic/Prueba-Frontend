import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Obtiene la cookie que creamos en el AuthContext al hacer login.
  const tokenCookie = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;

  // 2. Define las rutas que queremos proteger.
  const protectedPaths = ['/dashboard', '/me'];

  // 3. Revisa si el usuario está intentando acceder a una ruta protegida.
  const isAccessingProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // 4. Si está intentando acceder a una ruta protegida Y NO tiene la cookie...
  if (isAccessingProtectedPath && !tokenCookie) {
    // ...lo redirigimos a la página de login.
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Si tiene la cookie o no está en una ruta protegida, lo dejamos pasar.
  return NextResponse.next();
}

// 6. Configuración para que el middleware se ejecute solo en las rutas necesarias.
// Esto mejora el rendimiento de la aplicación.
export const config = {
  matcher: ['/dashboard/:path*', '/me/:path*'],
};

