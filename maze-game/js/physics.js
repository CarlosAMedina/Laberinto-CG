/**
 * physics.js
 * Motor de física con Cannon.js
 */

import { CONFIG } from './config.js';

export class PhysicsManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.groundGroup = sceneManager.getGroundGroup();
        
        this.world = null;
        this.ball = null;
        this.groundBody = null;
        this.wallBodies = [];
    }

    init() {
        // Crear mundo de física
        this.world = new CANNON.World();
        this.world.gravity.set(0, CONFIG.GRAVITY, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
    }

    createGroundBody() {
        const groundShape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape
        });
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(this.groundBody);
    }

    createBallBody(startPos) {
        const ballShape = new CANNON.Sphere(CONFIG.BALL_RADIUS);
        this.ball = new CANNON.Body({
            mass: CONFIG.BALL_MASS,
            shape: ballShape,
            linearDamping: CONFIG.BALL_DAMPING,
            angularDamping: CONFIG.BALL_DAMPING
        });
        this.ball.position.set(startPos.x, startPos.y, startPos.z);
        this.world.addBody(this.ball);

        // Material de contacto para fricción
        const ballPhysicsMaterial = new CANNON.Material();
        const groundPhysicsMaterial = new CANNON.Material();
        const ballGroundContact = new CANNON.ContactMaterial(
            ballPhysicsMaterial,
            groundPhysicsMaterial,
            {
                friction: CONFIG.FRICTION,
                restitution: CONFIG.RESTITUTION
            }
        );
        this.world.addContactMaterial(ballGroundContact);
        
        return this.ball;
    }

    createWallBody(x, y, z, height) {
        const wallShape = new CANNON.Box(new CANNON.Vec3(
            CONFIG.WALL_SIZE / 2,
            height / 2,
            CONFIG.WALL_SIZE / 2
        ));
        const wallBody = new CANNON.Body({
            mass: 0,
            shape: wallShape
        });
        wallBody.position.set(x, y, z);
        this.world.addBody(wallBody);
        this.wallBodies.push(wallBody);
        
        return wallBody;
    }

    createMazePhysics(mazeData) {
        const startX = CONFIG.MAZE_START_X;
        const startZ = CONFIG.MAZE_START_Z;
        
        mazeData.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 1) {
                    this.createWallBody(
                        startX + j * CONFIG.CELL_SIZE,
                        CONFIG.WALL_HEIGHT / 2,
                        startZ + i * CONFIG.CELL_SIZE,
                        CONFIG.WALL_HEIGHT
                    );
                }
            });
        });
    }

    updateGravity(tiltX, tiltZ) {
        const gravityStrength = -CONFIG.GRAVITY;
        this.world.gravity.set(
            -Math.sin(tiltZ) * gravityStrength,
            CONFIG.GRAVITY,
            Math.sin(tiltX) * gravityStrength
        );
    }

    syncGroundRotation() {
        this.groundBody.quaternion.copy(this.groundGroup.quaternion);
        this.groundBody.quaternion.mult(
            new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0),
            this.groundBody.quaternion
        );
    }

    syncWallsWithVisual(walls) {
        walls.forEach((wallMesh, index) => {
            if (this.wallBodies[index]) {
                const worldPos = new THREE.Vector3();
                const worldQuat = new THREE.Quaternion();
                wallMesh.getWorldPosition(worldPos);
                wallMesh.getWorldQuaternion(worldQuat);
                this.wallBodies[index].position.copy(worldPos);
                this.wallBodies[index].quaternion.copy(worldQuat);
            }
        });
    }

    syncBallWithVisual(ballMesh) {
        ballMesh.position.copy(this.ball.position);
        ballMesh.quaternion.copy(this.ball.quaternion);
    }

    resetBall(startPos) {
        this.ball.position.set(startPos.x, startPos.y, startPos.z);
        this.ball.velocity.set(0, 0, 0);
        this.ball.angularVelocity.set(0, 0, 0);
    }

    clearPhysics() {
        // Eliminar cuerpos de paredes
        this.wallBodies.forEach(body => {
            this.world.removeBody(body);
        });
        this.wallBodies = [];
    }

    step() {
        this.world.step(CONFIG.PHYSICS_TIMESTEP);
    }

    getWorld() {
        return this.world;
    }

    getBall() {
        return this.ball;
    }
}
