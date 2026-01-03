/**
 * controls.js
 * Gestión de controles e input del usuario
 */

import { CONFIG, GAME_STATE } from './config.js';

export class ControlManager {
    constructor(sceneManager, physicsManager) {
        this.sceneManager = sceneManager;
        this.physicsManager = physicsManager;
        this.groundGroup = sceneManager.getGroundGroup();
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            GAME_STATE.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            GAME_STATE.keys[e.key] = false;
        });
    }

    updateTilt() {
        let targetTiltX = 0;
        let targetTiltZ = 0;

        // Determinar inclinación objetivo según teclas presionadas
        if (GAME_STATE.keys['ArrowUp']) targetTiltX = -CONFIG.MAX_TILT;
        if (GAME_STATE.keys['ArrowDown']) targetTiltX = CONFIG.MAX_TILT;
        if (GAME_STATE.keys['ArrowLeft']) targetTiltZ = CONFIG.MAX_TILT;
        if (GAME_STATE.keys['ArrowRight']) targetTiltZ = -CONFIG.MAX_TILT;

        // Suavizar transición
        GAME_STATE.currentTiltX += (targetTiltX - GAME_STATE.currentTiltX) * CONFIG.TILT_SMOOTHING;
        GAME_STATE.currentTiltZ += (targetTiltZ - GAME_STATE.currentTiltZ) * CONFIG.TILT_SMOOTHING;

        // Aplicar rotación al grupo visual
        this.groundGroup.rotation.x = GAME_STATE.currentTiltX;
        this.groundGroup.rotation.z = GAME_STATE.currentTiltZ;

        // Actualizar gravedad según inclinación
        this.physicsManager.updateGravity(
            GAME_STATE.currentTiltX,
            GAME_STATE.currentTiltZ
        );
    }

    resetTilt() {
        GAME_STATE.currentTiltX = 0;
        GAME_STATE.currentTiltZ = 0;
        this.groundGroup.rotation.x = 0;
        this.groundGroup.rotation.z = 0;
    }

    isKeyPressed(key) {
        return GAME_STATE.keys[key] === true;
    }

    clearKey(key) {
        GAME_STATE.keys[key] = false;
    }

    clearAllKeys() {
        GAME_STATE.keys = {};
    }
}
