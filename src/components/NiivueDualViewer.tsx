import React, { useRef, useEffect, useState } from 'react'
import { Niivue, NVImage, NVMesh } from '@niivue/niivue'  // Add NVMesh import

export interface NiivueDualViewerProps {
  /** map from display name → URL */
  availableVolumes: Record<string,string>
  /** map from display name → URL for meshes */
  availableMeshes?: Record<string,string>
}

const allColorMaps = [
  'gray','hot','red','blue',
  'warm','cool','plasma','viridis','inferno'
]

// Available mesh colors with friendly names
const meshColors = {
  'Green': [0, 1, 0, 1],
  'Red': [1, 0, 0, 1],
  'Blue': [0, 0, 1, 1],
  'Yellow': [1, 1, 0, 1],
  'Cyan': [0, 1, 1, 1],
  'Magenta': [1, 0, 1, 1],
  'White': [1, 1, 1, 1],
}

type WheelMode = 'slice' | 'blend' | 'zoom'
type ViewMode = 'combined'|'axial'|'coronal'|'sagittal'|'3d'

const NiivueDualViewer: React.FC<NiivueDualViewerProps> = ({ availableVolumes, availableMeshes = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nv, setNv] = useState<Niivue|null>(null)
  
  // Volume states
  const [targetUrl, setTargetUrl] = useState<string>("")
  const [sourceUrl, setSourceUrl] = useState<string>("")
  const [targetColorMap, setTargetColorMap] = useState<string>("gray")
  const [sourceColorMap, setSourceColorMap] = useState<string>("red")
  const [blend, setBlend] = useState<number>(0.5)
  
  // New mesh states
  const [meshUrl, setMeshUrl] = useState<string>("")
  const [meshColor, setMeshColor] = useState<string>("Green") 
  const [meshOpacity, setMeshOpacity] = useState<number>(1.0)
  const [wireframe, setWireframe] = useState<boolean>(false)
  const [showTarget, setShowTarget] = useState<boolean>(true)
  const [showSource, setShowSource] = useState<boolean>(true)
  
  // View states
  const [viewMode, setViewMode] = useState<ViewMode>('combined')
  const [wheelMode, setWheelMode] = useState<WheelMode>('slice')
  const [showCrosshair, setShowCrosshair] = useState<boolean>(true)
  const [showColorbar, setShowColorbar] = useState<boolean>(true)
  const [showRuler, setShowRuler] = useState<boolean>(false)
  const [showOrientCube, setShowOrientCube] = useState<boolean>(false)

  // initialize Niivue
  useEffect(() => {
    if (!canvasRef.current || nv) return
    const inst = new Niivue({
      showSliceCrosshair: showCrosshair,
      show3Dcrosshair: showCrosshair,
      isColorbar: showColorbar,
      isRuler: showRuler,
      isOrientCube: showOrientCube,
      crosshairWidth: showCrosshair ? 1 : 0,
      isScrollSlice: wheelMode === 'slice',
      isScrollZoom: wheelMode === 'zoom',
      textHeight: 0.04,
      colorbarHeight: 0.02,
    })
    inst.attachToCanvas(canvasRef.current)
    setNv(inst)
  }, [canvasRef, nv, showCrosshair, showColorbar, wheelMode, showRuler, showOrientCube])

  // Unified loader for volumes and meshes
  useEffect(() => {
    if (!nv) return
    
    (async () => {
      // Clear previous data
      await nv.loadVolumes([])
      await nv.loadMeshes([])
      
      // Load volumes first
      const volumes: NVImage[] = []
      
      if (targetUrl && showTarget) {
        volumes.push({ 
          url: targetUrl, 
          colormap: targetColorMap, 
          opacity: 1 - blend 
        })
      }
      
      if (sourceUrl && showSource) {
        volumes.push({ 
          url: sourceUrl, 
          colormap: sourceColorMap, 
          opacity: blend 
        })
      }
      
      if (volumes.length > 0) {
        await nv.loadVolumes(volumes)
      }
      
      // Then load mesh separately
      if (meshUrl) {
        const meshOptions: NVMesh = {
          url: meshUrl,
          name: meshUrl.split('/').pop(),
          gl: nv.canvas.gl,
          color: meshColors[meshColor] || [0, 1, 0, 1], // Default to green
          opacity: meshOpacity,
          wireframe: wireframe
        }
        
        try {
          await nv.loadMeshes([meshOptions])
          console.log('Mesh loaded successfully', nv.scene.meshes?.length ?? 0)
        } catch (e) {
          console.error('Failed to load mesh:', e)
        }
      }
      
      applyViewMode()
    })()
  }, [
    nv, targetUrl, sourceUrl, targetColorMap, sourceColorMap, blend, 
    meshUrl, meshColor, meshOpacity, wireframe, showTarget, showSource
  ])

  // toggle display options
  useEffect(() => {
    if (!nv) return
    nv.opts.crosshairWidth = showCrosshair ? 1 : 0
    nv.opts.showSliceCrosshair = showCrosshair
    nv.opts.show3Dcrosshair = showCrosshair
    nv.opts.isColorbar = showColorbar
    nv.opts.isRuler = showRuler
    nv.opts.isOrientCube = showOrientCube
    nv.updateGLVolume()
    nv.drawScene(true)
  }, [nv, showCrosshair, showColorbar, showRuler, showOrientCube])

  // update scroll behavior for zoom/slice
  useEffect(() => {
    if (!nv) return
    nv.opts.isScrollSlice = wheelMode === 'slice'
    nv.opts.isScrollZoom = wheelMode === 'zoom'
    nv.updateGLVolume()
    nv.drawScene(true)
  }, [nv, wheelMode])

  // update blend opacity
  useEffect(() => {
    if (!nv) return
    nv.opts.volumeOpacity = [1 - blend, blend]
    nv.updateGLVolume()
    nv.drawScene(true)
  }, [nv, blend])

  // apply view layouts
  const applyViewMode = () => {
    if (!nv) return
    switch (viewMode) {
      case 'combined':
        nv.setSliceType(nv.sliceTypeMultiplanar)
        nv.setMultiplanarLayout(2)
        nv.opts.multiplanarEqualSize = true
        break
      case 'axial':    nv.setSliceType(nv.sliceTypeAxial);    break
      case 'coronal':  nv.setSliceType(nv.sliceTypeCoronal);  break
      case 'sagittal': nv.setSliceType(nv.sliceTypeSagittal); break
      case '3d':       nv.setSliceType(nv.sliceTypeRender);   break
    }
    nv.drawScene(true)
  }
  useEffect(applyViewMode, [nv, viewMode])

  // wheel handler for blend
  useEffect(() => {
    if (!nv || !canvasRef.current) return
    const handler = (e: WheelEvent) => {
      if (wheelMode === 'blend') {
        e.preventDefault(); e.stopImmediatePropagation()
        setBlend(b => Math.max(0, Math.min(1, b + (e.deltaY < 0 ? 0.05 : -0.05))))
      }
    }
    const c = canvasRef.current
    c.addEventListener('wheel', handler, { passive: false, capture: true })
    return () => c.removeEventListener('wheel', handler, { capture: true })
  }, [nv, wheelMode])

  return (
    <div style={{ position: 'relative', height: '100%', touchAction: 'none' }}>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 12, 
        padding: 8, 
        background: '#fff', 
        overflowY: 'auto', 
        maxHeight: '180px' 
      }}>
        {/* Volume controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Volumes</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input 
              type="checkbox" 
              checked={showTarget} 
              onChange={() => setShowTarget(v => !v)} 
            />
            <label>Target:</label>
            <select value={targetUrl} onChange={e => setTargetUrl(e.target.value)}>
              <option value="">– Select –</option>
              {Object.entries(availableVolumes).map(([name, url]) =>
                <option key={url} value={url}>{name}</option>
              )}
            </select>
            <select value={targetColorMap} onChange={e => setTargetColorMap(e.target.value)}>
              {allColorMaps.map(cm => <option key={cm}>{cm}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input 
              type="checkbox" 
              checked={showSource} 
              onChange={() => setShowSource(v => !v)} 
            />
            <label>Source:</label>
            <select value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}>
              <option value="">– Select –</option>
              {Object.entries(availableVolumes).map(([name, url]) =>
                <option key={url} value={url}>{name}</option>
              )}
            </select>
            <select value={sourceColorMap} onChange={e => setSourceColorMap(e.target.value)}>
              {allColorMaps.map(cm => <option key={cm}>{cm}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label>Blend:</label>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.01}
              value={blend} 
              onChange={e => setBlend(+e.target.value)}
              style={{ width: '100px' }}
            />
            <span>{(blend * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        {/* Mesh controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Mesh</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label>Mesh:</label>
            <select value={meshUrl} onChange={e => setMeshUrl(e.target.value)}>
              <option value="">– None –</option>
              {Object.entries(availableMeshes).map(([name, url]) =>
                <option key={url} value={url}>{name}</option>
              )}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label>Color:</label>
            <select value={meshColor} onChange={e => setMeshColor(e.target.value)}>
              {Object.keys(meshColors).map(color => 
                <option key={color} value={color}>{color}</option>
              )}
            </select>
            
            <label>Opacity:</label>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.1} 
              value={meshOpacity}
              onChange={e => setMeshOpacity(+e.target.value)} 
              style={{ width: '80px' }}
            />
            
            <label>
              <input 
                type="checkbox" 
                checked={wireframe}
                onChange={() => setWireframe(w => !w)} 
              /> Wireframe
            </label>
          </div>
        </div>
        
        {/* View controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>View</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label>View:</label>
            <select value={viewMode} onChange={e => setViewMode(e.target.value as ViewMode)}>
              <option value="combined">Combined</option>
              <option value="axial">Axial</option>
              <option value="coronal">Coronal</option>
              <option value="sagittal">Sagittal</option>
              <option value="3d">3D</option>
            </select>
            
            <label>Wheel:</label>
            <select value={wheelMode} onChange={e => setWheelMode(e.target.value as WheelMode)}>
              <option value="slice">Slice</option>
              <option value="blend">Blend</option>
              <option value="zoom">Zoom</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label>
              <input 
                type="checkbox" 
                checked={showCrosshair}
                onChange={() => setShowCrosshair(c => !c)} 
              /> Crosshair
            </label>
            
            <label>
              <input 
                type="checkbox" 
                checked={showColorbar}
                onChange={() => setShowColorbar(c => !c)} 
              /> Colorbar
            </label>
            
            <label>
              <input 
                type="checkbox" 
                checked={showRuler}
                onChange={() => setShowRuler(c => !c)} 
              /> Ruler
            </label>
            
            <label>
              <input 
                type="checkbox" 
                checked={showOrientCube}
                onChange={() => setShowOrientCube(c => !c)} 
              /> Orient Cube
            </label>
          </div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: 'calc(100% - 180px)' }} 
        onContextMenu={e => e.preventDefault()} 
      />
      
      {/* Mesh display tip */}
      {meshUrl && viewMode !== '3d' && (
        <div style={{ 
          position: 'absolute', 
          bottom: 10, 
          right: 10, 
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Switch to 3D view to see the full mesh
        </div>
      )}
    </div>
  )
}

export default NiivueDualViewer
