<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const root = ref(null)
const status = ref('加载中…')

/** 将校园 GLB 放在 public/models/campus.glb 可自动加载；否则显示内置演示场景 */
const OPTIONAL_GLB = `${import.meta.env.BASE_URL}models/campus.glb`

let renderer
let frameId
let controls
let resizeObserver
let sceneRef

function makeDemoCampus(scene) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.88, metalness: 0.02 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.65,
    metalness: 0.12,
  })
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xc8102e,
    roughness: 0.4,
    metalness: 0.25,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.2,
  })

  function addBuilding(w, h, d, x, z, mat = buildingMat) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    mesh.position.set(x, h / 2, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
    return mesh
  }

  addBuilding(14, 10, 8, -6, -4)
  addBuilding(10, 7, 10, 8, 2)
  addBuilding(6, 16, 6, 0, 10, accentMat)
  addBuilding(18, 5, 12, -10, 12)

  const treeMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 })
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2
    const r = 22 + Math.random() * 8
    const x = Math.cos(a) * r + (Math.random() - 0.5) * 4
    const z = Math.sin(a) * r + (Math.random() - 0.5) * 4
    const h = 1.2 + Math.random() * 1.8
    const tree = new THREE.Mesh(new THREE.ConeGeometry(0.7, h, 8), treeMat)
    tree.position.set(x, h / 2, z)
    tree.castShadow = true
    scene.add(tree)
  }
}

function disposeScene(scene) {
  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.geometry?.dispose()
      const mat = obj.material
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
    }
  })
}

onMounted(() => {
  const el = root.value
  if (!el) return

  const scene = new THREE.Scene()
  sceneRef = scene
  scene.background = new THREE.Color(0xfafaf9)

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500)
  camera.position.set(28, 18, 32)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  el.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.maxPolarAngle = Math.PI / 2 - 0.08
  controls.minDistance = 8
  controls.maxDistance = 90
  controls.target.set(0, 4, 0)

  const hemi = new THREE.HemisphereLight(0xfff7ed, 0xf5f5f4, 0.65)
  scene.add(hemi)
  const dir = new THREE.DirectionalLight(0xffffff, 1.15)
  dir.position.set(20, 36, 14)
  dir.castShadow = true
  dir.shadow.mapSize.set(1024, 1024)
  dir.shadow.camera.near = 0.5
  dir.shadow.camera.far = 120
  dir.shadow.camera.left = -40
  dir.shadow.camera.right = 40
  dir.shadow.camera.top = 40
  dir.shadow.camera.bottom = -40
  scene.add(dir)

  const loader = new GLTFLoader()
  loader.load(
    OPTIONAL_GLB,
    (gltf) => {
      status.value = '已加载 campus.glb'
      const model = gltf.scene
      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true
          obj.receiveShadow = true
        }
      })
      scene.add(model)

      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      controls.target.copy(center)
      const maxDim = Math.max(size.x, size.y, size.z, 1)
      camera.position.set(center.x + maxDim * 1.2, center.y + maxDim * 0.85, center.z + maxDim * 1.2)
      controls.update()
    },
    undefined,
    () => {
      status.value = '演示场景（未找到 models/campus.glb）'
      makeDemoCampus(scene)
      controls.update()
    },
  )

  const resize = () => {
    const w = el.clientWidth
    const h = el.clientHeight || 420
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(el)

  const tick = () => {
    frameId = requestAnimationFrame(tick)
    controls.update()
    renderer.render(scene, camera)
  }
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  controls?.dispose()
  renderer?.dispose()
  const el = root.value
  if (el && renderer?.domElement && el.contains(renderer.domElement)) {
    el.removeChild(renderer.domElement)
  }
  if (sceneRef) {
    disposeScene(sceneRef)
    sceneRef = null
  }
})
</script>

<template>
  <div class="wrap">
    <div ref="root" class="canvas-host" role="img" aria-label="深圳职业技术大学校园三维模型演示" />
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  min-height: 420px;
  background: var(--bg);
}

.canvas-host {
  width: 100%;
  height: min(62vh, 560px);
  min-height: 360px;
}

.canvas-host :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.status {
  position: absolute;
  left: 0.75rem;
  bottom: 0.65rem;
  margin: 0;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.78rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(200, 16, 46, 0.12);
  backdrop-filter: blur(8px);
  pointer-events: none;
}
</style>
