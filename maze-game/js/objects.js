/**
 * objects.js
 * Creación y gestión de objetos 3D (bola, paredes, meta, trampas)
 */

import { CONFIG } from './config.js';

export class ObjectManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.groundGroup = sceneManager.getGroundGroup();
        
        this.ballMesh = null;
        this.goalZone = null;
        this.walls = [];
        this.traps = [];
        
        // Crear texturas de madera procedurales
        this.woodTexture = this.createWoodTexture();
        this.darkWoodTexture = this.createDarkWoodTexture();
    }

    createWoodTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Color base de madera
        ctx.fillStyle = '#8B6F47';
        ctx.fillRect(0, 0, 512, 512);
        
        // Añadir vetas de madera
        for (let i = 0; i < 512; i += 2) {
            const darkness = Math.random() * 0.3;
            ctx.fillStyle = `rgba(101, 67, 33, ${darkness})`;
            ctx.fillRect(i, 0, 2, 512);
        }
        
        // Añadir nudos de madera
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const radius = Math.random() * 20 + 10;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(80, 50, 20, 0.8)');
            gradient.addColorStop(1, 'rgba(80, 50, 20, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        return texture;
    }

    createDarkWoodTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Color base de madera oscura
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(0, 0, 512, 512);
        
        // Añadir vetas verticales
        for (let i = 0; i < 512; i += 3) {
            const darkness = Math.random() * 0.4;
            ctx.fillStyle = `rgba(20, 15, 10, ${darkness})`;
            ctx.fillRect(i, 0, 3, 512);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return texture;
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(
            CONFIG.GROUND_SIZE,
            CONFIG.GROUND_SIZE
        );
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: this.darkWoodTexture,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.groundGroup.add(ground);
    }

    createBall(startPos) {
        const ballGeometry = new THREE.SphereGeometry(CONFIG.BALL_RADIUS, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.BALL,
            roughness: 0.4,
            metalness: 0.6
        });
        this.ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ballMesh.castShadow = true;
        this.ballMesh.receiveShadow = true;
        this.ballMesh.position.set(startPos.x, startPos.y, startPos.z);
        this.scene.add(this.ballMesh);
        
        return this.ballMesh;
    }

    createWall(x, y, z, height) {
        const wallGeometry = new THREE.BoxGeometry(
            CONFIG.WALL_SIZE,
            height,
            CONFIG.WALL_SIZE
        );
        const wallMaterial = new THREE.MeshStandardMaterial({
            map: this.woodTexture,
            roughness: 0.7,
            metalness: 0.1
        });
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        wallMesh.position.set(x, y, z);
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        this.groundGroup.add(wallMesh);
        
        return wallMesh;
    }

    createMaze(mazeData) {
        const startX = CONFIG.MAZE_START_X;
        const startZ = CONFIG.MAZE_START_Z;
        
        mazeData.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 1) {
                    const wallMesh = this.createWall(
                        startX + j * CONFIG.CELL_SIZE,
                        CONFIG.WALL_HEIGHT / 2,
                        startZ + i * CONFIG.CELL_SIZE,
                        CONFIG.WALL_HEIGHT
                    );
                    this.walls.push(wallMesh);
                }
            });
        });
    }

    createGoal(goalPos) {
        const goalGeometry = new THREE.CircleGeometry(CONFIG.GOAL_RADIUS, 32);
        const goalMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.COLORS.GOAL,
            emissive: CONFIG.COLORS.GOAL,
            emissiveIntensity: 0.5,
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
        });
        this.goalZone = new THREE.Mesh(goalGeometry, goalMaterial);
        this.goalZone.position.set(goalPos.x, 0.01, goalPos.z);
        this.goalZone.rotation.x = -Math.PI / 2;
        this.goalZone.userData.time = 0;
        this.groundGroup.add(this.goalZone);
        
        return this.goalZone;
    }

    createTraps(trapPositions) {
        trapPositions.forEach(trapPos => {
            // Trampa visual (agujero rojo) - Círculo plano
            const trapGeometry = new THREE.CircleGeometry(CONFIG.TRAP_RADIUS, 32);
            const trapMaterial = new THREE.MeshStandardMaterial({
                color: CONFIG.COLORS.TRAP,
                emissive: CONFIG.COLORS.TRAP,
                emissiveIntensity: 0.7,
                roughness: 0.3,
                metalness: 0.8,
                side: THREE.DoubleSide
            });
            const trapMesh = new THREE.Mesh(trapGeometry, trapMaterial);
            trapMesh.position.set(trapPos.x, 0.01, trapPos.z);
            trapMesh.rotation.x = -Math.PI / 2;
            this.groundGroup.add(trapMesh);
            
            // Borde oscuro
            const borderGeometry = new THREE.RingGeometry(
                CONFIG.TRAP_RADIUS,
                CONFIG.TRAP_RADIUS + 0.2,
                32
            );
            const borderMaterial = new THREE.MeshStandardMaterial({
                color: CONFIG.COLORS.TRAP_BORDER,
                side: THREE.DoubleSide
            });
            const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
            borderMesh.position.set(trapPos.x, 0.02, trapPos.z);
            borderMesh.rotation.x = -Math.PI / 2;
            this.groundGroup.add(borderMesh);
            
            this.traps.push({ 
                mesh: trapMesh, 
                border: borderMesh,
                position: new THREE.Vector3(trapPos.x, 0, trapPos.z),
                time: Math.random() * Math.PI * 2
            });
        });
    }

    animateGoal() {
        if (this.goalZone) {
            this.goalZone.userData.time += 0.05;
            this.goalZone.scale.set(
                1 + Math.sin(this.goalZone.userData.time) * 0.1,
                1,
                1 + Math.sin(this.goalZone.userData.time) * 0.1
            );
        }
    }

    animateTraps() {
        this.traps.forEach(trap => {
            trap.time += 0.08;
            const pulse = 0.5 + Math.sin(trap.time) * 0.3;
            trap.mesh.material.emissiveIntensity = pulse;
            trap.mesh.scale.set(
                1 + Math.sin(trap.time) * 0.05,
                1,
                1 + Math.sin(trap.time) * 0.05
            );
        });
    }

    clearLevel() {
        // Eliminar paredes
        this.walls.forEach(wall => {
            this.groundGroup.remove(wall);
        });
        this.walls = [];
        
        // Eliminar trampas
        this.traps.forEach(trap => {
            this.groundGroup.remove(trap.mesh);
            this.groundGroup.remove(trap.border);
        });
        this.traps = [];
        
        // Eliminar meta
        if (this.goalZone) {
            this.groundGroup.remove(this.goalZone);
            this.goalZone = null;
        }
    }

    getBallMesh() {
        return this.ballMesh;
    }

    getGoalZone() {
        return this.goalZone;
    }

    getWalls() {
        return this.walls;
    }

    getTraps() {
        return this.traps;
    }
}
