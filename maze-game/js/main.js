/**
 * main.js
 * Punto de entrada del juego
 */

import { Game } from './game.js';

// Crear instancia global del juego
window.game = new Game();

// Iniciar el juego cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.game.init();
    });
} else {
    window.game.init();
}

console.log('Laberinto 3D - Proyecto Final de Computación Gráfica');
console.log('Proyecto modularizado y listo para editar');
