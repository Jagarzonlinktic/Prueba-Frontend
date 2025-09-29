// CAMBIO: La importación ahora es desde 'msw/browser' en lugar de 'msw'
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Esta parte no cambia.
// Configura el Service Worker con los handlers que ya actualizaste.
export const worker = setupWorker(...handlers);

