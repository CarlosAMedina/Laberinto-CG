/**
 * game.js
 * Lógica principal del juego
 */

import { CONFIG, GAME_STATE } from './config.js';
import { LEVELS } from './levels.js';
import { SceneManager } from './scene.js';
import { ObjectManager } from './objects.js';
import { PhysicsManager } from './physics.js';
import { ControlManager } from './controls.js';

export class Game {
    constructor() {
        this.sceneManager = new SceneManager();
        this.objectManager = null;
        this.physicsManager = null;
        this.controlManager = null;
    }

    init() {
        // Inicializar sistemas
        this.sceneManager.init();
        this.objectManager = new ObjectManager(this.sceneManager);
        this.physicsManager = new PhysicsManager(this.sceneManager);
        this.controlManager = new ControlManager(this.sceneManager, this.physicsManager);
        
        this.physicsManager.init();
        
        // Crear elementos del nivel inicial
        this.loadLevel(GAME_STATE.currentLevel);
        
        // Iniciar bucle de animación
        this.animate();
    }

    loadLevel(levelNumber) {
        if (!LEVELS[levelNumber]) return;
        
        GAME_STATE.currentLevel = levelNumber;
        GAME_STATE.levelCompleted = false;
        
        // Actualizar UI
        document.getElementById('currentLevelText').textContent = levelNumber;
        document.getElementById('victory').style.display = 'none';
        document.getElementById('levelSelect').style.display = 'none';
        
        // Limpiar nivel anterior
        this.objectManager.clearLevel();
        this.physicsManager.clearPhysics();
        
        // Obtener datos del nivel
        const level = LEVELS[levelNumber];
        
        // Crear plano y física base (solo la primera vez)
        if (levelNumber === 1 && !this.physicsManager.groundBody) {
            this.objectManager.createGround();
            this.physicsManager.createGroundBody();
        }
        
        // Crear bola (solo la primera vez)
        if (!this.objectManager.getBallMesh()) {
            this.objectManager.createBall(level.startPos);
            this.physicsManager.createBallBody(level.startPos);
        } else {
            // Resetear posición si ya existe
            this.physicsManager.resetBall(level.startPos);
            this.objectManager.getBallMesh().position.copy(this.physicsManager.getBall().position);
        }
        
        // Crear elementos del nivel
        this.objectManager.createMaze(level.maze);
        this.physicsManager.createMazePhysics(level.maze);
        this.objectManager.createGoal(level.goalPos);
        this.objectManager.createTraps(level.traps);
        
        // Resetear inclinación
        this.controlManager.resetTilt();
    }

    checkVictory() {
        if (GAME_STATE.levelCompleted) return;
        
        const ballMesh = this.objectManager.getBallMesh();
        const goalZone = this.objectManager.getGoalZone();
        
        if (!ballMesh || !goalZone) return;
        
        // Obtener posición mundial de la meta
        const goalWorldPosition = new THREE.Vector3();
        goalZone.getWorldPosition(goalWorldPosition);
        
        const distance = ballMesh.position.distanceTo(goalWorldPosition);
        if (distance < 1.5) {
            GAME_STATE.levelCompleted = true;
            this.controlManager.clearAllKeys();
            
            // Mensaje personalizado según el nivel
            const victoryMsg = document.getElementById('victoryMessage');
            const nextBtn = document.getElementById('nextLevelBtn');
            
            if (GAME_STATE.currentLevel === 3) {
                victoryMsg.textContent = '¡Has completado todos los niveles! ¡Eres un maestro!';
                nextBtn.style.display = 'none';
            } else {
                victoryMsg.textContent = `¡Nivel ${GAME_STATE.currentLevel} completado! ¿Listo para el siguiente reto?`;
                nextBtn.style.display = 'inline-block';
            }
            
            document.getElementById('victory').style.display = 'block';
        }
    }

    checkTraps() {
        const ballMesh = this.objectManager.getBallMesh();
        const traps = this.objectManager.getTraps();
        
        traps.forEach(trap => {
            // Obtener posición mundial de la trampa (porque está en el groundGroup que rota)
            const trapWorldPos = new THREE.Vector3();
            trap.mesh.getWorldPosition(trapWorldPos);
            
            const distance = new THREE.Vector2(
                ballMesh.position.x - trapWorldPos.x,
                ballMesh.position.z - trapWorldPos.z
            ).length();
            
            if (distance < CONFIG.TRAP_DETECTION_DISTANCE) {
                // Marcar como trampa activada y reiniciar inmediatamente
                this.showTrapMessage();
                setTimeout(() => {
                    this.resetGame();
                }, 100);
            }
        });
    }

    showTrapMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(231, 76, 60, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 250;
        `;
        message.textContent = '¡Caíste en una trampa!';
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 1500);
    }

    resetGame() {
        const level = LEVELS[GAME_STATE.currentLevel];
        
        // Limpiar teclas presionadas
        this.controlManager.clearAllKeys();
        
        // Resetear inclinación del plano
        this.controlManager.resetTilt();
        
        // Resetear física de la bola
        this.physicsManager.resetBall(level.startPos);
        
        // Sincronizar posición visual
        this.objectManager.getBallMesh().position.copy(this.physicsManager.getBall().position);
        this.objectManager.getBallMesh().quaternion.copy(this.physicsManager.getBall().quaternion);
        
        // Ocultar pantalla de victoria
        document.getElementById('victory').style.display = 'none';
        GAME_STATE.levelCompleted = false;
    }

    nextLevel() {
        if (GAME_STATE.currentLevel < 3) {
            this.loadLevel(GAME_STATE.currentLevel + 1);
        }
    }

    showLevelSelect() {
        document.getElementById('levelSelect').style.display = 'block';
        document.getElementById('victory').style.display = 'none';
    }

    hideLevelSelect() {
        document.getElementById('levelSelect').style.display = 'none';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Actualizar física
        this.physicsManager.step();

        // Actualizar inclinación
        this.controlManager.updateTilt();

        // Sincronizar física con visual
        this.physicsManager.syncGroundRotation();
        this.physicsManager.syncWallsWithVisual(this.objectManager.getWalls());
        this.physicsManager.syncBallWithVisual(this.objectManager.getBallMesh());

        // Actualizar cámara
        this.sceneManager.updateCamera(this.objectManager.getBallMesh().position);

        // Animaciones
        this.objectManager.animateGoal();
        this.objectManager.animateTraps();

        // Verificaciones
        this.checkTraps();
        this.checkVictory();

        // Reiniciar si cae del mapa
        if (this.objectManager.getBallMesh().position.y < -5) {
            this.resetGame();
        }

        // Manejar teclas especiales
        if (this.controlManager.isKeyPressed('r') || this.controlManager.isKeyPressed('R')) {
            this.resetGame();
            this.controlManager.clearKey('r');
            this.controlManager.clearKey('R');
        }

        if (this.controlManager.isKeyPressed('1')) {
            this.loadLevel(1);
            this.controlManager.clearKey('1');
        }
        if (this.controlManager.isKeyPressed('2')) {
            this.loadLevel(2);
            this.controlManager.clearKey('2');
        }
        if (this.controlManager.isKeyPressed('3')) {
            this.loadLevel(3);
            this.controlManager.clearKey('3');
        }

        if (this.controlManager.isKeyPressed('m') || this.controlManager.isKeyPressed('M')) {
            this.showLevelSelect();
            this.controlManager.clearKey('m');
            this.controlManager.clearKey('M');
        }

        // Renderizar escena
        this.sceneManager.render();
    }
}
