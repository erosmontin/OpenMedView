import React, { useRef, useEffect, useState } from 'react'
import { Niivue, NVImage, NVMesh } from '@niivue/niivue'

export interface OpenMedViewProps {
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

const OpenMedView: React.FC<OpenMedViewProps> = ({ availableVolumes, availableMeshes = {} }) => {
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

  // X-ray mode states
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [xrayIntensity, setXrayIntensity] = useState<number>(0.3);

  // Clipping plane states
  const [clipEnabled, setClipEnabled] = useState<boolean>(false);
  const [clipAxis, setClipAxis] = useState<'x' | 'y' | 'z'>('z');
  const [clipPosition, setClipPosition] = useState<number>(0.5);

  // initialize Niivue
  useEffect(() => {
    if (!canvasRef.current || nv) return
    // cast to any to bypass Partial<NVConfigOptions> strictness
    const inst = new Niivue({
      show3Dcrosshair:   showCrosshair,
      isColorbar:        showColorbar,
      isRuler:           showRuler,
      isOrientCube:      showOrientCube,
      crosshairWidth:    showCrosshair ? 1 : 0,
      textHeight:        0.04,
      colorbarHeight:    0.02
    } as any)
    inst.attachToCanvas(canvasRef.current)
    setNv(inst)
  }, [canvasRef, nv, showCrosshair, showColorbar, wheelMode, showRuler, showOrientCube])

  // Unified loader for volumes and meshes
  useEffect(() => {
    if (!nv) return;
    
    (async () => {
      // Clear previous volumes & meshes
      nv.loadVolumes([])
      nv.loadMeshes([])
      
      // Load target & source via NVImage helpers
      if (targetUrl && showTarget) {
        // Extract clean filename without query parameters
        let fileName = targetUrl.split('/').pop() || 'volume.nii.gz';
        // Remove any query parameters
        fileName = fileName.split('?')[0];
        
        const img = await NVImage.loadFromUrl({
          url:  targetUrl,
          name: fileName
        })
        img.colormap = targetColorMap
        // Apply xray mode if enabled
        img.opacity = xrayMode ? xrayIntensity : (1 - blend)
        nv.addVolume(img)
      }
      if (sourceUrl && showSource) {
        // Extract clean filename without query parameters
        let fileName = sourceUrl.split('/').pop() || 'volume.nii.gz';
        // Remove any query parameters
        fileName = fileName.split('?')[0];
        
        const img = await NVImage.loadFromUrl({
          url:  sourceUrl,
          name: fileName
        })
        img.colormap = sourceColorMap
        // Apply xray mode if enabled
        img.opacity = xrayMode ? xrayIntensity : blend
        nv.addVolume(img)
      }
      
      // Then load mesh via NVMesh helper
      if (meshUrl) {
        const mesh = await NVMesh.loadFromUrl({
          url:  meshUrl,
          name: meshUrl.split('/').pop()!,
          gl:   nv.gl!
        })
        // TS types don’t declare color/opacity/wireframe on NVMesh,
        // so cast to any before setting.
        const m = mesh as any
        m.color     = meshColors[meshColor as keyof typeof meshColors]
        m.opacity   = meshOpacity
        m.wireframe = wireframe
        nv.addMesh(mesh)
      }
      
      applyViewMode()
    })()
  }, [
    nv, targetUrl, sourceUrl, targetColorMap, sourceColorMap, blend, 
    meshUrl, meshColor, meshOpacity, wireframe, showTarget, showSource,
    xrayMode, xrayIntensity
  ])

  // toggle display options
  useEffect(() => {
    if (!nv) return
    nv.opts.crosshairWidth = showCrosshair ? 1 : 0
    nv.opts.show3Dcrosshair = showCrosshair
    nv.opts.isColorbar    = showColorbar
    nv.opts.isRuler       = showRuler
    nv.opts.isOrientCube  = showOrientCube
    nv.updateGLVolume()
    nv.drawScene()
  }, [nv, showCrosshair, showColorbar, showRuler, showOrientCube])

  // update scroll behavior for zoom/slice
  useEffect(() => {
    if (!nv) return;
    // scroll behavior is handled in your wheel-handler effect
    nv.updateGLVolume()
    nv.drawScene()
  }, [nv, wheelMode])

  // update blend opacity
  useEffect(() => {
    if (!nv) return;
    // per-volume opacity was set on each NVImage already
    nv.updateGLVolume()
    nv.drawScene()
  }, [nv, blend])

  // apply view layouts
  const applyViewMode = () => {
    if (!nv) return
    const _nv = nv as any
    switch (viewMode) {
      case 'combined':
        _nv.setSliceType(_nv.sliceTypeMultiplanar)
        _nv.setMultiplanarLayout(2)
        _nv.opts.multiplanarEqualSize = true
        break
      case 'axial':    _nv.setSliceType(_nv.sliceTypeAxial);    break
      case 'coronal':  _nv.setSliceType(_nv.sliceTypeCoronal);  break
      case 'sagittal': _nv.setSliceType(_nv.sliceTypeSagittal); break
      case '3d':       _nv.setSliceType(_nv.sliceTypeRender);   break
    }
    _nv.drawScene()
  }
  useEffect(applyViewMode, [nv, viewMode])

  // Update mesh appearance
  const updateMeshAppearance = () => {
    if (!nv || !meshUrl) return;
    
    const meshes = nv.meshes;
    if (meshes.length === 0) return;
    
    try {
      // Need to cast mesh to any to access these properties
      const mesh = meshes[0] as any; 
      
      // Store the new values
      const newColor = meshColors[meshColor as keyof typeof meshColors];
      const newOpacity = meshOpacity;
      const newWireframe = wireframe;
      
      // Update the mesh properties directly first
      mesh.color = newColor;
      mesh.opacity = newOpacity;
      mesh.wireframe = newWireframe;
      
      // Then use setMeshProperty to ensure NiiVue registers the changes
      nv.setMeshProperty(0, 'color', newColor);
      nv.setMeshProperty(0, 'opacity', newOpacity); 
      nv.setMeshProperty(0, 'wireframe', newWireframe);
      
      // Force redraw
      nv.updateGLVolume();
      nv.drawScene();
    } catch (error) {
      console.error("Error updating mesh properties:", error);
    }
  }

  const applyClipPlane = () => {
    if (!nv) return;
  
    try {
      // Only apply clipping in 3D mode when enabled
      if (clipEnabled && viewMode === '3d') {
        // build [a,b,c,d] plane equation: ax + by + cz + d = 0
        const plane = [0, 0, 0, 0]; // Initialize with zeros
        const pos = clipPosition * 2 - 1; // Map 0-1 to -1 to 1 range
        
        // Set normal vector component based on selected axis
        switch (clipAxis) {
          case 'x':
            plane[0] = 1; // Normal points along x-axis
            plane[3] = -pos; // Distance from origin
            break;
          case 'y':
            plane[1] = 1; // Normal points along y-axis
            plane[3] = -pos; // Distance from origin
            break;
          case 'z':
            plane[2] = 1; // Normal points along z-axis
            plane[3] = -pos; // Distance from origin
            break;
        }
        
        // Apply the clip plane
        nv.setClipPlane(plane);
      } else {
        // Disable clipping by setting a zero plane
        nv.setClipPlane([0, 0, 0, 0]);
      }
      
      // Update the view
      nv.updateGLVolume();
      nv.drawScene();
    } catch (error) {
      console.error("Error applying clip plane:", error);
    }
  }

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

  // Update mesh appearance when properties change
  useEffect(() => {
    updateMeshAppearance();
  }, [nv, meshUrl, meshColor, meshOpacity, wireframe]);

  // Apply clipping plane
  useEffect(() => {
    applyClipPlane()
  }, [nv, clipEnabled, clipAxis, clipPosition, viewMode]);

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
        
        {availableMeshes && Object.keys(availableMeshes).length > 0 && (
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <label>
                <input
                  type="checkbox"
                  checked={xrayMode}
                  onChange={() => setXrayMode(x => !x)}
                /> X-ray Mode
              </label>
              
              {xrayMode && (
                <>
                  <label>Intensity:</label>
                  <input
                    type="range"
                    min={0.1}
                    max={0.6}
                    step={0.05}
                    value={xrayIntensity}
                    onChange={e => setXrayIntensity(+e.target.value)}
                    style={{ width: '80px' }}
                  />
                </>
              )}
            </div>
          </div>
        )}

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

        {/* Clipping controls - only shown in 3D mode */}
        {viewMode === '3d' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Clipping</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label>
                <input
                  type="checkbox"
                  checked={clipEnabled}
                  onChange={() => {
                    setClipEnabled(prev => !prev);
                    // Don't call applyClipPlane here - let the effect handle it
                  }}
                /> Enable Clipping
              </label>

              {/* Axis selector always present but disabled when clipEnabled is false */}
              <label>Axis:</label>
              <select
                value={clipAxis}
                onChange={e => {
                  setClipAxis(e.target.value as 'x' | 'y' | 'z');
                  // Don't call applyClipPlane here - let the effect handle it
                }}
                disabled={!clipEnabled}
              >
                <option value="x">X</option>
                <option value="y">Y</option>
                <option value="z">Z</option>
              </select>

              <label>Position:</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={clipPosition}
                onChange={e => {
                  setClipPosition(+e.target.value);
                  // Immediate feedback for slider position is good UX
                  if (nv && clipEnabled && viewMode === '3d') {
                    applyClipPlane();
                  }
                }}
                disabled={!clipEnabled}
                style={{ width: '100px' }}
              />
            </div>
          </div>
        )}
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

export default OpenMedView
