import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

const ARTWORKS = [
  {
    id: 1,
    title: 'Inside Pancha-mama',
    artiste: 'Sandra Vasquez',
    position: new THREE.Vector3(13.5, 1.2, -3.95),
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    size: [1.5, 1.3] as [number, number],
    imageUrl: '/src/assets/bg-expo.webp',
    route: '/oeuvres/1',
  },
  {
    id: 2,
    title: 'Formes Vivantes',
    artiste: 'Yayoi Kusama',
    position: new THREE.Vector3(13.5, 1.2, 4.27),
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    size: [1.4, 2.07] as [number, number],
    imageUrl: 'src/assets/bg-artiste.webp',
    route: '/oeuvres/2',
  },
  {
    id: 3,
    title: 'Corps & Territoire',
    artiste: 'Gordon Parks',
    position: new THREE.Vector3(13.35, 0.99, 5.5),
    rotation: new THREE.Euler(0, 0, 0),
    size: [1.44, 1.01] as [number, number],
    imageUrl: 'src/assets/carCard1.jpg',
    route: '/oeuvres/3',
  },
  {
    id: 4,
    title: 'Mémoire collective',
    artiste: 'Kara Walker',
    position: new THREE.Vector3(11.23, 0.97, 5.5),
    rotation: new THREE.Euler(0, 0, 0),
    size: [1.09, 1.54] as [number, number],
    imageUrl: 'src/assets/carCard2.jpg',
    route: '/oeuvres/4',
  },
  {
    id: 5,
    title: 'Résonances',
    artiste: 'Basquiat',
    position: new THREE.Vector3(2.65, 0.85, 5.5),
    rotation: new THREE.Euler(0, 0, 0),
    size: [2.23, 1.58] as [number, number],
    imageUrl: '',
    route: '/oeuvres/5',
  },
  {
    id: 6,
    title: 'La Voyante',
    artiste: 'Frida Kahlo',
    position: new THREE.Vector3(0.7, 0.95, 4.38),
    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    size: [1.7, 2.4] as [number, number],
    imageUrl: '',
    route: '/oeuvres/6',
  },
]

const MOVE_SPEED = 0.08
const PLAYER_HEIGHT = 1.7
const BOUNDS = { minX: 0.5, maxX: 14.5, minZ: -16, maxZ: 5.8 }

const buildProceduralGallery = (scene: THREE.Scene) => {
  const W = 15, L = 20, H = 4.5
  const wallMat  = new THREE.MeshStandardMaterial({ color: 0xf8f5f0, roughness: 0.9 })
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.8 })
  const ceilMat  = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0 })

  // Sol
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, L), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(W / 2, 0, -L / 2 + 3)
  floor.receiveShadow = true
  scene.add(floor)

  // Plafond
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, L), ceilMat)
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(W / 2, H, -L / 2 + 3)
  scene.add(ceil)

  // Murs
  const walls: { size: [number, number]; pos: [number, number, number]; rot: [number, number, number] }[] = [
    { size: [W, H], pos: [W / 2, H / 2,  3],      rot: [0, 0,            0] },
    { size: [W, H], pos: [W / 2, H / 2, -L + 3],  rot: [0, Math.PI,     0] },
    { size: [L, H], pos: [0,     H / 2, -L / 2 + 3], rot: [0, Math.PI / 2,  0] },
    { size: [L, H], pos: [W,     H / 2, -L / 2 + 3], rot: [0, -Math.PI / 2, 0] },
  ]
  walls.forEach(({ size, pos, rot }) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), wallMat)
    mesh.position.set(...pos)
    mesh.rotation.set(...rot)
    mesh.receiveShadow = true
    scene.add(mesh)
  })

  // Plinthes
  const plintheMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.9 });
  [0, W].forEach((x) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, L), plintheMat)
    m.position.set(x, 0.075, -L / 2 + 3)
    scene.add(m)
  })
}

// Ici on ajoute les oeuvres 
const addArtworks = (scene: THREE.Scene, artworkMeshes: THREE.Mesh[]) => {
  const textureLoader = new THREE.TextureLoader()
  const placeholderColors = [0xd4956a, 0xe8eef5, 0xede8f0, 0xe8f0ec, 0xf5ece8, 0xeaf0e8]

  ARTWORKS.forEach((artwork) => {
    const [w, h] = artwork.size

    // Cadre
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x2a1f0f, roughness: 0.8 })
    )
    frameMesh.position.copy(artwork.position)
    frameMesh.rotation.copy(artwork.rotation)
    scene.add(frameMesh)

    // Toile
    const mat: THREE.MeshStandardMaterial = artwork.imageUrl
      ? (() => {
          const tex = textureLoader.load(artwork.imageUrl)
          tex.colorSpace = THREE.SRGBColorSpace
          return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 })
        })()
      : new THREE.MeshStandardMaterial({
          color: placeholderColors[artwork.id % placeholderColors.length],
          roughness: 0.7,
        })

    const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
    const offset = new THREE.Vector3(0, 0, 0.03).applyEuler(artwork.rotation)
    canvas.position.copy(artwork.position).add(offset)
    canvas.rotation.copy(artwork.rotation)
    canvas.userData = {
      artworkId: artwork.id,
      title: artwork.title,
      artiste: artwork.artiste,
      route: artwork.route,
    }
    scene.add(canvas)
    artworkMeshes.push(canvas)

    // Label flottant (CanvasTexture → Sprite)
    const labelCanvas = document.createElement('canvas')
    labelCanvas.width = 512
    labelCanvas.height = 80
    const ctx = labelCanvas.getContext('2d')!
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.roundRect(0, 0, 512, 80, 8)
    ctx.fill()
    ctx.fillStyle = '#E2725B'
    ctx.font = 'bold 24px Georgia'
    ctx.fillText(artwork.title, 16, 32)
    ctx.fillStyle = '#666'
    ctx.font = '18px sans-serif'
    ctx.fillText(artwork.artiste, 16, 58)

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(labelCanvas), transparent: true })
    )
    sprite.scale.set(1.2, 0.19, 1)
    const labelOffset = new THREE.Vector3(0, -h / 2 - 0.2, 0.05).applyEuler(artwork.rotation)
    sprite.position.copy(artwork.position).add(labelOffset)
    scene.add(sprite)
  })
}


const Galerie = () => {
  const navigate = useNavigate()
  const mountRef        = useRef<HTMLDivElement>(null)
  const rendererRef     = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef     = useRef<PointerLockControls | null>(null)
  const cameraRef       = useRef<THREE.PerspectiveCamera | null>(null)
  const frameRef        = useRef<number>(0)
  const keysRef         = useRef<Record<string, boolean>>({})
  const raycasterRef    = useRef(new THREE.Raycaster())
  const artworkMeshesRef = useRef<THREE.Mesh[]>([])

  const [locked,       setLocked]       = useState(false)
  const [tooltip,      setTooltip]      = useState<{ title: string; artiste: string; route: string } | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scène
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f2ee)
    scene.fog = new THREE.Fog(0xf5f2ee, 15, 35)

    // Caméra
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(7, PLAYER_HEIGHT, -1)
    cameraRef.current = camera

    // Rendu
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Gestion de la luminosité
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    ;[[4,4,-12],[4,4,-6],[4,4,0],[10,4,-12],[10,4,-6],[10,4,0]].forEach(([x,y,z]) => {
      const spot = new THREE.SpotLight(0xfff5e0, 1.5, 12, Math.PI / 5, 0.4, 1.5)
      spot.position.set(x, y, z)
      spot.castShadow = true
      spot.shadow.mapSize.set(512, 512)
      scene.add(spot, spot.target)
    })

    // Oeuvres
    addArtworks(scene, artworkMeshesRef.current)

    // GLTF
    new GLTFLoader().load(
      '/models/scene.gltf',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        scene.add(gltf.scene)
        setLoading(false)
      },
      (progress) => {
        if (progress.total > 0)
          setLoadProgress(Math.round((progress.loaded / progress.total) * 100))
      },
      () => {
        buildProceduralGallery(scene)
        setLoading(false)
      }
    )

    // Gestion de la position
    const controls = new PointerLockControls(camera, renderer.domElement)
    controlsRef.current = controls
    scene.add(controls.object)   

    controls.addEventListener('lock',   () => setLocked(true))
    controls.addEventListener('unlock', () => setLocked(false))

    
    const onKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true }
    const onKeyUp   = (e: KeyboardEvent) => { keysRef.current[e.code] = false }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup',   onKeyUp)

    // Boucle principale
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (controls.isLocked) {
        const keys = keysRef.current
        const dir = new THREE.Vector3()
        if (keys['KeyW'] || keys['ArrowUp'])    dir.z -= 1
        if (keys['KeyS'] || keys['ArrowDown'])  dir.z += 1
        if (keys['KeyD'] || keys['ArrowRight'])  dir.x -= 1
        if (keys['KeyA'] || keys['ArrowLeft']) dir.x += 1
        if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(MOVE_SPEED)

        controls.moveRight(-dir.x)
        controls.moveForward(-dir.z)

        // Contraintes
        const pos = camera.position
        pos.x = THREE.MathUtils.clamp(pos.x, BOUNDS.minX, BOUNDS.maxX)
        pos.z = THREE.MathUtils.clamp(pos.z, BOUNDS.minZ, BOUNDS.maxZ)
        pos.y = PLAYER_HEIGHT

        // Détection des œuvres
        raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), camera)
        const hits = raycasterRef.current.intersectObjects(artworkMeshesRef.current)
        if (hits.length > 0 && hits[0].distance < 4) {
          const ud = hits[0].object.userData
          setTooltip({ title: ud.title, artiste: ud.artiste, route: ud.route })
        } else {
          setTooltip(null)
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // ── RESIZE ──
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── CLEANUP ──
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup',   onKeyUp)
      controls.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!locked) {
      controlsRef.current?.lock()
    } else if (tooltip) {
      navigate(tooltip.route)
    }
  }, [locked, tooltip, navigate])

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 56px)' }}>

      <div ref={mountRef} className="w-full h-full cursor-crosshair" onClick={handleClick} />

      {/* Chargement */}
      {loading && (
        <div className="absolute inset-0 bg-[#f5f2ee] flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-gray-400 tracking-widest uppercase">Chargement de la galerie</p>
          <div className="w-48 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#E2725B] transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
          <p className="text-xs text-gray-400">{loadProgress}%</p>
        </div>
      )}

      {/* Invitation */}
      {!locked && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-6 text-center max-w-xs pointer-events-auto cursor-pointer"
            onClick={handleClick}
          >
            <p className="text-xs tracking-widest text-[#E2725B] uppercase mb-2">Visite immersive</p>
            <p className="text-lg font-normal text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              Entrer dans la galerie
            </p>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              Cliquez pour commencer · ZQSD / flèches pour vous déplacer<br />
              Échap pour quitter · Cliquez sur une œuvre pour l'ouvrir
            </p>
          </div>
        </div>
      )}

      {/* Viseur */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/80 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-white/80 -translate-x-1/2" />
            <div className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 ${tooltip ? 'bg-[#E2725B]' : 'bg-white/90'}`} />
          </div>
        </div>
      )}

      {/* Tooltip œuvre */}
      {locked && tooltip && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-5 py-3 text-center">
            <p className="text-sm text-gray-900 italic" style={{ fontFamily: 'Georgia, serif' }}>{tooltip.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{tooltip.artiste}</p>
            <p className="text-[10px] text-[#E2725B] mt-2 tracking-wide uppercase">Cliquer pour voir l'œuvre →</p>
          </div>
        </div>
      )}

      {/* HUD */}
      {locked && (
        <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2 pointer-events-none">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            ZQSD · flèches — déplacer<br />
            Souris — regarder<br />
            Échap — quitter
          </p>
        </div>
      )}
    </div>
  )
}

export default Galerie