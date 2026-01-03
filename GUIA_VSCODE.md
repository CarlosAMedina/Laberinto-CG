# 🎯 GUÍA RÁPIDA - EDICIÓN EN VS CODE

## 📂 Estructura del Proyecto Modular

```
maze-game/
│
├── 📄 index.html              ← HTML principal (UI y estructura)
│
├── 📁 css/
│   └── styles.css            ← TODOS los estilos (colores, botones, UI)
│
├── 📁 js/
│   ├── config.js             ← ⚙️ CONFIGURACIÓN (física, colores, velocidades)
│   ├── levels.js             ← 🎮 NIVELES (laberintos, trampas, posiciones)
│   ├── scene.js              ← 🎬 ESCENA (Three.js, cámara, luces)
│   ├── objects.js            ← 🎨 OBJETOS 3D (bola, paredes, meta, trampas)
│   ├── physics.js            ← ⚛️ FÍSICA (Cannon.js, gravedad, colisiones)
│   ├── controls.js           ← 🎮 CONTROLES (teclado, inclinación)
│   ├── game.js               ← 🎯 LÓGICA DEL JUEGO (victoria, trampas, niveles)
│   └── main.js               ← 🚀 INICIALIZACIÓN (punto de entrada)
│
└── 📄 README.md              ← Documentación completa

```

---

## 🔧 ¿QUÉ EDITAR SEGÚN LO QUE QUIERAS CAMBIAR?

### 🎨 CAMBIAR COLORES
👉 Archivo: `js/config.js`
```javascript
COLORS: {
    BACKGROUND: 0x1a1a2e,  // Color de fondo
    GROUND: 0x2c3e50,      // Color del plano
    BALL: 0xe74c3c,        // Color de la bola (rojo)
    WALL: 0x34495e,        // Color de las paredes
    GOAL: 0x4CAF50,        // Color de la meta (verde)
    TRAP: 0xff0000,        // Color de las trampas (rojo)
}
```

### 🎮 AGREGAR/MODIFICAR NIVELES
👉 Archivo: `js/levels.js`

**Estructura de un nivel:**
```javascript
4: {  // Número del nivel
    name: "Nivel 4: Mi Nivel",
    startPos: { x: -8, y: 1, z: -8 },    // Posición inicial
    goalPos: { x: 7, y: 0.05, z: 7 },    // Posición de la meta
    traps: [
        { x: 0, z: 0 },   // Coordenadas de trampas
        { x: 2, z: 2 }
    ],
    maze: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 1 = pared
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],  // 0 = espacio
        // ... 10 filas x 10 columnas
    ]
}
```

### ⚡ CAMBIAR VELOCIDAD/FÍSICA
👉 Archivo: `js/config.js`
```javascript
GRAVITY: -20,           // Fuerza de gravedad (más negativo = más fuerte)
MAX_TILT: 0.15,         // Máxima inclinación (más = más difícil)
TILT_SMOOTHING: 0.1,    // Suavidad del movimiento (menos = más rápido)
BALL_DAMPING: 0.3,      // Fricción de la bola (más = frena más)
```

### 🎯 CAMBIAR TAMAÑO DE OBJETOS
👉 Archivo: `js/config.js`
```javascript
BALL_RADIUS: 0.5,       // Radio de la bola
TRAP_RADIUS: 0.8,       // Radio de las trampas
WALL_HEIGHT: 1,         // Altura de las paredes
GOAL_RADIUS: 1.5,       // Radio de la meta
```

### 📐 CAMBIAR TAMAÑO DEL LABERINTO
👉 Archivo: `js/config.js`
```javascript
CELL_SIZE: 2,           // Tamaño de cada celda
MAZE_START_X: -9,       // Posición X inicial
MAZE_START_Z: -9,       // Posición Z inicial
```

### 🎨 CAMBIAR ESTILOS DE LA UI
👉 Archivo: `css/styles.css`
- Cambiar colores de botones
- Tamaño de texto
- Posición de elementos
- Efectos hover

---

## 🚀 CÓMO EJECUTAR EL PROYECTO

### Método 1: Python (más fácil)
```bash
cd maze-game
python -m http.server 8000
```
Luego abre: http://localhost:8000

### Método 2: VS Code - Live Server
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

### Método 3: Node.js
```bash
cd maze-game
npx http-server
```

---

## 🐛 TIPS DE DEPURACIÓN

### Ver errores en el navegador:
1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña "Console"
3. Busca mensajes de error en rojo

### Recargar cambios:
- `Ctrl + R` (Windows/Linux) o `Cmd + R` (Mac)
- `Ctrl + Shift + R` para hard reload (ignora caché)

### Verificar que los módulos carguen:
Abre la consola y deberías ver:
```
🎮 Laberinto 3D - Proyecto Final de Computación Gráfica
📦 Proyecto modularizado y listo para editar
```

---

## 📝 FLUJO DE TRABAJO RECOMENDADO

1. **Abre el proyecto en VS Code:**
   ```bash
   code maze-game
   ```

2. **Instala extensiones útiles:**
   - Live Server
   - JavaScript (ES6) code snippets
   - Prettier (formateo de código)

3. **Edita archivos según lo que necesites cambiar**
   (usa la guía de arriba)

4. **Ejecuta servidor local y prueba cambios**

5. **Recarga el navegador para ver cambios**

---

## 🎯 EJEMPLO DE EDICIÓN COMÚN

**Quiero hacer la bola más grande y cambiar su color a azul:**

1. Abre `js/config.js`
2. Busca `BALL_RADIUS: 0.5` → cambia a `0.8`
3. Busca `BALL: 0xe74c3c` → cambia a `0x3498db` (azul)
4. Guarda el archivo
5. Recarga el navegador

**¡Listo!** 🎉

---

## 📞 SOLUCIÓN DE PROBLEMAS

**❌ Error: "Cannot use import statement outside a module"**
✅ Solución: Debes usar un servidor local (no abrir con file://)

**❌ La página está en blanco**
✅ Solución: Revisa la consola (F12) para ver errores

**❌ Los controles no funcionan**
✅ Solución: Haz click en la ventana del juego primero

**❌ Los cambios no se ven**
✅ Solución: Hard reload (Ctrl + Shift + R)

---

**¡Tu proyecto está listo para editar! 🚀**
