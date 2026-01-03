/**
 * scene.js
 * Configuración de la escena, cámara, renderer e iluminación
 */

import { CONFIG } from './config.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.groundGroup = null;
    }

    init() {
        // Crear escena
        this.scene = new THREE.Scene();
        
        // Crear skybox del espacio
        this.createSpaceSkybox();

        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.CAMERA_FOV,
            window.innerWidth / window.innerHeight,
            CONFIG.CAMERA_NEAR,
            CONFIG.CAMERA_FAR
        );
        this.camera.position.set(
            CONFIG.CAMERA_OFFSET.x,
            CONFIG.CAMERA_OFFSET.y,
            CONFIG.CAMERA_OFFSET.z
        );
        this.camera.lookAt(0, 0, 0);

        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Crear grupo para el plano y paredes (permite inclinación)
        this.groundGroup = new THREE.Group();
        this.scene.add(this.groundGroup);

        // Configurar iluminación tipo sol
        this.setupLighting();

        // Event listener para redimensionar ventana
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createSpaceSkybox() {
        // Crear textura de espacio con estrellas
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');
        
        // Fondo negro del espacio
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 2048, 2048);
        
        // Agregar nebulosa sutil
        const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
        gradient.addColorStop(0, 'rgba(25, 25, 60, 0.3)');
        gradient.addColorStop(0.5, 'rgba(15, 15, 40, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2048, 2048);
        
        // Agregar estrellas
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 2048;
            const y = Math.random() * 2048;
            const size = Math.random() * 2;
            const brightness = Math.random();
            
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Agregar algunas estrellas grandes brillantes
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 2048;
            const y = Math.random() * 2048;
            const size = Math.random() * 3 + 2;
            
            const starGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            starGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            starGradient.addColorStop(0.5, 'rgba(200, 200, 255, 0.5)');
            starGradient.addColorStop(1, 'rgba(150, 150, 255, 0)');
            ctx.fillStyle = starGradient;
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        
        // Crear skybox esférico
        const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
        const skyMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(skybox);
    }

    setupLighting() {
        // Luz ambiental tenue (luz de las estrellas)
        const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
        this.scene.add(ambientLight);

        // Luz direccional simulando el sol
        const sunLight = new THREE.DirectionalLight(0xffffee, 1.2);
        sunLight.position.set(15, 25, 15);
        sunLight.castShadow = true;
        
        // Configuración de sombras optimizada
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -25;
        sunLight.shadow.camera.right = 25;
        sunLight.shadow.camera.top = 25;
        sunLight.shadow.camera.bottom = -25;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.bias = -0.0001;
        
        this.scene.add(sunLight);
        
        // Añadir un pequeño resplandor del sol (opcional, para efecto visual)
        const sunSphere = new THREE.Mesh(
            new THREE.SphereGeometry(2, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        sunSphere.position.copy(sunLight.position);
        this.scene.add(sunSphere);
    }

    updateCamera(targetPosition) {
        const cameraOffset = new THREE.Vector3(
            CONFIG.CAMERA_OFFSET.x,
            CONFIG.CAMERA_OFFSET.y,
            CONFIG.CAMERA_OFFSET.z
        );
        
        this.camera.position.lerp(
            targetPosition.clone().add(cameraOffset),
            CONFIG.CAMERA_LERP_SPEED
        );
        this.camera.lookAt(targetPosition);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getGroundGroup() {
        return this.groundGroup;
    }
}
