/**
 * config.js
 * Configuración global y constantes del juego
 */

export const CONFIG = {
    // Configuración de física
    GRAVITY: -20,
    PHYSICS_TIMESTEP: 1 / 60,
    
    // Configuración de control
    TILT_SPEED: 0.3,
    MAX_TILT: 0.15,
    TILT_SMOOTHING: 0.1,
    
    // Configuración de cámara
    CAMERA_FOV: 60,
    CAMERA_NEAR: 0.1,
    CAMERA_FAR: 1000,
    CAMERA_OFFSET: { x: 0, y: 12, z: 15 },
    CAMERA_LERP_SPEED: 0.05,
    
    // Configuración de laberinto
    CELL_SIZE: 2,
    MAZE_START_X: -9,
    MAZE_START_Z: -9,
    WALL_HEIGHT: 1,
    
    // Configuración de objetos
    BALL_RADIUS: 0.5,
    BALL_MASS: 1,
    BALL_DAMPING: 0.3,
    
    GOAL_RADIUS: 1.5,
    GOAL_HEIGHT: 0.1,
    
    TRAP_RADIUS: 0.8,
    TRAP_DETECTION_DISTANCE: 0.8,
    
    // Configuración de materiales
    GROUND_SIZE: 20,
    WALL_SIZE: 1.8,
    
    // Colores
    COLORS: {
        BACKGROUND: 0x1a1a2e,
        GROUND: 0x2c3e50,
        BALL: 0xe74c3c,
        WALL: 0x34495e,
        GOAL: 0x4CAF50,
        TRAP: 0xff0000,
        TRAP_BORDER: 0x330000
    },
    
    // Física de contacto
    FRICTION: 0.4,
    RESTITUTION: 0.3
};

// Estado global del juego
export const GAME_STATE = {
    currentLevel: 1,
    levelCompleted: false,
    currentTiltX: 0,
    currentTiltZ: 0,
    keys: {}
};
