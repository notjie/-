<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps({
  modelPath: { type: String, required: true },
  modelName: { type: String, required: true },
  hotspotData: { type: Object, default: null },
})

const root = ref(null)
const status = ref('加载中…')

const baseUrl = import.meta.env.BASE_URL

let renderer = null
let scene = null
let camera = null
let modelGroup = null
let controls = null
let frameId = 0
let resizeObserver = null
let isAutoRotating = true
let idleTimer = null

// 热点相关
let hotspotSprite = null
let pulseRing = null
let raycaster = null
let mouse = null
let tooltip = null
let modal = null
let isHoveringHotspot = false

function disposeScene() {
  if (!scene) return
  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.geometry?.dispose()
      const mat = obj.material
      if (Array.isArray(mat)) mat.forEach(m => m.dispose())
      else mat?.dispose()
    }
  })
}

function startIdleTimer() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { isAutoRotating = true }, 3000)
}

// ---------- 热点 Sprite ----------
function createHotspotSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const outerGrad = ctx.createRadialGradient(64, 64, 20, 64, 64, 60)
  outerGrad.addColorStop(0, 'rgba(200, 16, 46, 0.35)')
  outerGrad.addColorStop(1, 'rgba(200, 16, 46, 0)')
  ctx.fillStyle = outerGrad
  ctx.fillRect(0, 0, 128, 128)
  ctx.beginPath()
  ctx.arc(64, 64, 18, 0, Math.PI * 2)
  ctx.fillStyle = '#c8102e'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(64, 64, 8, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(18, 18, 1)
  sprite.userData = { isHotspot: true }
  return sprite
}

// ---------- 脉冲环 ----------
function createPulseRing() {
  const geometry = new THREE.RingGeometry(3, 4, 32)
  const material = new THREE.MeshBasicMaterial({
    color: 0xc8102e,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  })
  const ring = new THREE.Mesh(geometry, material)
  ring.rotation.x = -Math.PI / 2
  ring.userData = { isPulse: true }
  return ring
}

// ---------- Tooltip ----------
function createTooltip() {
  const el = document.createElement('div')
  el.id = 'hotspot-tooltip'
  Object.assign(el.style, {
    position: 'fixed',
    pointerEvents: 'none',
    background: 'rgba(255, 255, 255, 0.92)',
    color: '#1c1917',
    padding: '10px 16px',
    borderRadius: '12px',
    opacity: '0',
    transform: 'translateY(5px)',
    transition: 'all 0.2s ease',
    zIndex: '1000',
    boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
    border: '1px solid rgba(200,16,46,0.25)',
    fontFamily: "'Noto Sans SC', sans-serif",
    fontSize: '13px',
    maxWidth: '220px',
  })
  document.body.appendChild(el)
  return el
}

function updateTooltip(event) {
  const d = props.hotspotData
  if (!d || !tooltip) return
  tooltip.innerHTML = `
    <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${d.title || props.modelName}</div>
    <div style="color:#c8102e;margin-bottom:6px;">${d.info || ''}</div>
    <div style="font-size:11px;color:#78716c;border-top:1px solid rgba(0,0,0,0.12);padding-top:4px;">点击查看详情</div>
  `
  tooltip.style.left = (event.clientX + 12) + 'px'
  tooltip.style.top = (event.clientY - 8) + 'px'
  tooltip.style.opacity = '1'
  tooltip.style.transform = 'translateY(0)'
}

function hideTooltip() {
  if (tooltip) {
    tooltip.style.opacity = '0'
    tooltip.style.transform = 'translateY(5px)'
  }
}

// ---------- 详情弹窗 ----------
function createModal() {
  const el = document.createElement('div')
  el.id = 'detail-modal'
  Object.assign(el.style, {
    position: 'fixed',
    top: '0', left: '0', right: '0', bottom: '0',
    background: 'rgba(0,0,0,0.25)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '2000',
    opacity: '0',
    visibility: 'hidden',
    transition: 'all 0.3s ease',
    fontFamily: "'Noto Sans SC', sans-serif",
  })
  el.innerHTML = `
    <div style="position:relative;background:rgba(255,255,255,0.95);border-radius:16px;padding:28px 32px;width:460px;max-width:90vw;box-shadow:0 12px 48px rgba(0,0,0,0.35);transform:scale(0.9);transition:transform 0.3s ease;">
      <span class="modal-close" style="position:absolute;top:14px;right:22px;font-size:28px;color:#78716c;cursor:pointer;line-height:1;">&times;</span>
      <h2 id="modal-title" style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1c1917;"></h2>
      <div id="modal-subtitle" style="color:#c8102e;font-size:16px;font-weight:600;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #d6d3d1;"></div>
      <ul id="modal-details" style="list-style:none;padding:0;margin:0;"></ul>
    </div>
  `
  document.body.appendChild(el)
  el.querySelector('.modal-close').addEventListener('click', hideModal)
  el.addEventListener('click', (e) => { if (e.target === el) hideModal() })
  return el
}

function showModal() {
  const d = props.hotspotData
  if (!d || !modal) return
  modal.querySelector('#modal-title').textContent = d.title || props.modelName
  modal.querySelector('#modal-subtitle').textContent = d.info || ''
  const ul = modal.querySelector('#modal-details')
  ul.innerHTML = (d.details || []).map(t =>
    `<li style="position:relative;padding:10px 0 10px 20px;color:#44403c;font-size:14px;font-weight:500;border-bottom:1px solid #f5f5f4;">${t}</li>`
  ).join('')
  modal.style.opacity = '1'
  modal.style.visibility = 'visible'
  modal.querySelector('div').style.transform = 'scale(1)'
}

function hideModal() {
  if (!modal) return
  modal.style.opacity = '0'
  modal.style.visibility = 'hidden'
  modal.querySelector('div').style.transform = 'scale(0.9)'
}

// ---------- 鼠标事件 ----------
function getMouseNDC(event) {
  const el = root.value
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
  }
}

function onMouseMove(event) {
  if (!scene || !hotspotSprite || !camera) return
  const ndc = getMouseNDC(event)
  if (!ndc) return
  mouse.set(ndc.x, ndc.y)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(hotspotSprite)
  if (intersects.length > 0) {
    if (!isHoveringHotspot) {
      isHoveringHotspot = true
      hotspotSprite.scale.set(24, 24, 1)
    }
    updateTooltip(event)
  } else {
    if (isHoveringHotspot) {
      isHoveringHotspot = false
      hotspotSprite.scale.set(18, 18, 1)
    }
    hideTooltip()
  }
}

function onClick(event) {
  if (isHoveringHotspot && props.hotspotData) {
    showModal()
  }
}

onMounted(() => {
  const el = root.value
  if (!el) return

  const width = el.clientWidth
  const height = el.clientHeight || 380

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f3f0)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
  camera.position.set(120, 80, 120)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  el.appendChild(renderer.domElement)

  // 光照
  const hemi = new THREE.HemisphereLight(0xfff7ed, 0xe7e5e4, 0.7)
  scene.add(hemi)
  const dir = new THREE.DirectionalLight(0xffffff, 1.1)
  dir.position.set(80, 140, 60)
  scene.add(dir)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 20
  controls.maxDistance = 400
  controls.target.set(0, 0, 0)

  controls.addEventListener('start', () => {
    isAutoRotating = false
    clearTimeout(idleTimer)
  })
  controls.addEventListener('end', () => { startIdleTimer() })

  // Raycaster
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Tooltip & Modal (create on first use if hotspotData exists)
  if (props.hotspotData) {
    tooltip = createTooltip()
    modal = createModal()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
  }

  modelGroup = new THREE.Group()
  scene.add(modelGroup)

  const loader = new GLTFLoader()
  loader.load(
    props.modelPath,
    (gltf) => {
      modelGroup.add(gltf.scene)
      status.value = ''

      // 居中模型
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z, 1)
      const s = 80 / maxDim
      modelGroup.scale.setScalar(s)
      modelGroup.position.set(-center.x * s, -center.y * s, -center.z * s)
      controls.target.set(0, 0, 0)
      controls.update()

      // 添加热点
      if (props.hotspotData) {
        hotspotSprite = createHotspotSprite()
        const hp = props.hotspotData.position
        hotspotSprite.position.set(hp[0], hp[1], hp[2])
        scene.add(hotspotSprite)

        pulseRing = createPulseRing()
        pulseRing.position.set(hp[0], 0.5, hp[2])
        scene.add(pulseRing)
      }
    },
    undefined,
    () => { status.value = '加载失败' },
  )

  const resize = () => {
    const w = el.clientWidth
    const h = el.clientHeight || 380
    if (renderer) renderer.setSize(w, h, false)
    if (camera) {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
  }
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(el)

  const tick = () => {
    frameId = requestAnimationFrame(tick)
    controls.update()
    if (isAutoRotating && modelGroup) {
      modelGroup.rotation.y += 0.001
    }
    // 脉冲动画
    if (pulseRing) {
      const t = Date.now() * 0.002
      const s = 1 + Math.sin(t * 2) * 0.3
      pulseRing.scale.set(s, s, 1)
      pulseRing.material.opacity = 0.2 + Math.sin(t * 2) * 0.2
    }
    renderer.render(scene, camera)
  }
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  clearTimeout(idleTimer)
  resizeObserver?.disconnect()
  controls?.dispose()
  renderer?.dispose()
  const el = root.value
  if (el && renderer?.domElement && el.contains(renderer.domElement)) {
    el.removeChild(renderer.domElement)
  }
  disposeScene()
  // 清理热点相关 DOM 和事件
  if (tooltip) {
    document.body.removeChild(tooltip)
    tooltip = null
  }
  if (modal) {
    document.body.removeChild(modal)
    modal = null
  }
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onClick)
})
</script>

<template>
  <div class="building-card">
    <div class="card-title">{{ modelName }}</div>
    <div v-if="status" class="card-status">{{ status }}</div>
    <div ref="root" class="card-canvas" />
  </div>
</template>

<style scoped>
.building-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}
.building-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
}

.card-title {
  position: absolute;
  top: 12px;
  left: 16px;
  z-index: 10;
  padding: 4px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1c1917;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(200, 16, 46, 0.15);
  pointer-events: none;
}

.card-status {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(87, 83, 78, 0.8);
  pointer-events: none;
}

.card-canvas {
  width: 100%;
  min-height: 340px;
  height: 380px;
}

.card-canvas :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>