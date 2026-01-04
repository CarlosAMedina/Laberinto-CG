# Laberinto 3D - Proyecto Final de Computación Gráfica

Juego 3D interactivo tipo laberinto con bola, desarrollado con Three.js y Cannon.js.

## Descripción

Mini-juego tridimensional donde el usuario controla indirectamente el movimiento de una esfera mediante la inclinación del plano base. El objetivo es guiar la bola desde un punto inicial hasta una meta, evitando trampas y paredes.

## Tecnologías Utilizadas

- **Three.js (r128)**: Motor de renderizado 3D
- **Cannon.js (0.6.2)**: Motor de física
- **JavaScript ES6+**: Módulos nativos
- **HTML5 & CSS3**: Interfaz de usuario

## Estructura del Proyecto

```
maze-game/
├── index.html              # Archivo principal HTML
├── css/
│   └── styles.css         # Estilos del juego
├── js/
│   ├── config.js          # Configuración y constantes
│   ├── levels.js          # Definición de los 3 niveles
│   ├── scene.js           # Gestión de escena Three.js
│   ├── objects.js         # Creación de objetos 3D
│   ├── physics.js         # Motor de física Cannon.js
│   ├── controls.js        # Gestión de controles
│   ├── game.js            # Lógica principal del juego
│   └── main.js            # Punto de entrada
└── README.md              # Este archivo
```

## 🎮 Controles

- **Flechas del Teclado**: Inclinar el laberinto
  - ⬆️ Arriba: Inclinar adelante
  - ⬇️ Abajo: Inclinar atrás
  - ⬅️ Izquierda: Inclinar a la izquierda
  - ➡️ Derecha: Inclinar a la derecha
- **R**: Reiniciar nivel actual
- **1, 2, 3**: Cambiar entre niveles
- **M**: Abrir menú de selección de niveles

## 🎯 Características

### Elementos Visuales

- Bola roja con efecto metálico
- Laberinto con paredes grises
- Zona de meta verde con animación de pulso
- Trampas rojas con efecto de brillo
- Sombras en tiempo real

## Cómo Usar

### Opción 1: Abrir directamente
1. Abre `index.html` en tu navegador (Chrome, Firefox, Edge)
2. ¡Listo para jugar!


## Personalización

### Modificar Configuración

Edita `js/config.js` para cambiar:
- Gravedad y física
- Velocidad de inclinación
- Tamaño del laberinto
- Colores de objetos
- Fricción y rebote

### Agregar/Modificar Niveles

Edita `js/levels.js`:
```javascript
export const LEVELS = {
    4: {  // Nuevo nivel
        name: "Nivel 4: Imposible",
        startPos: { x: -8, y: 1, z: -8 },
        goalPos: { x: 7, y: 0.05, z: 7 },
        traps: [
            { x: 0, z: 0 },
            // Más trampas...
        ],
        maze: [
            // Matriz 10x10 (1=pared, 0=espacio)
        ]
    }
};
```

### Cambiar Estilos Visuales

Edita `css/styles.css` para modificar:
- Colores de la interfaz
- Tamaño de botones
- Posición de elementos UI

## Conceptos de CG Implementados

- ✅ Transformaciones geométricas (matrices)
- ✅ Pipeline gráfico (vertex/fragment shaders)
- ✅ Mallas poligonales generadas
- ✅ Iluminación (Phong/Blinn-Phong)
- ✅ Proyección en perspectiva
- ✅ Renderizado en tiempo real
- ✅ Simulación física básica
- ✅ Detección de colisiones

## Solución de Problemas

### El juego no carga
- Verifica que estés usando un servidor local (no `file://`)
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de tener conexión a internet (CDN de librerías)

### La física no funciona correctamente
- Verifica que Cannon.js se haya cargado correctamente
- Revisa los valores en `config.js`

### Los controles no responden
- Asegúrate de hacer click en la ventana del juego
- Verifica que las teclas no estén siendo bloqueadas

## Notas de Desarrollo

Este proyecto utiliza **módulos ES6 nativos**, por lo que necesita ejecutarse desde un servidor (no funciona con `file://` debido a políticas CORS).

