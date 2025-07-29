import React, { useRef, useEffect, useState } from 'react'
import { Niivue, NVImage } from '@niivue/niivue'

export interface NiivueDualViewerProps {
  /** map from display name → URL */
  availableVolumes: Record<string,string>
}

const allColorMaps = [
  'gray','hot','red','blue',
  'warm','cool','plasma','viridis','inferno'
]

type WheelMode = 'slice' | 'blend' | 'zoom'
type ViewMode = 'combined'|'axial'|'coronal'|'sagittal'|'3d'

const NiivueDualViewer: React.FC<NiivueDualViewerProps> = ({ availableVolumes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nv, setNv]                  = useState<Niivue|null>(null)
  const [targetUrl, setTargetUrl]    = useState<string>("")
  const [sourceUrl, setSourceUrl]    = useState<string>("")
  const [targetColorMap, setTargetColorMap] = useState<string>("gray")
  const [sourceColorMap, setSourceColorMap] = useState<string>("red")
  const [blend, setBlend]             = useState<number>(0.5)
  const [viewMode, setViewMode]       = useState<ViewMode>('combined')
  const [wheelMode, setWheelMode]     = useState<WheelMode>('slice')
  const [showCrosshair, setShowCrosshair] = useState<boolean>(true)
  const [showColorbar, setShowColorbar]   = useState<boolean>(true)

  // initialize Niivue
  useEffect(() => {
    if (!canvasRef.current || nv) return
    const inst = new Niivue({
      // control slice and 3D crosshairs
      showSliceCrosshair: showCrosshair,
      show3Dcrosshair: showCrosshair,
      // use `isColorbar` to toggle colorbar
      isColorbar: showColorbar,
      // default crosshair width
      crosshairWidth: showCrosshair ? 1 : 0,
      // set initial scroll modes
      isScrollSlice: wheelMode === 'slice',
      isScrollZoom: wheelMode === 'zoom',
      // optional: adjust these defaults as needed
      textHeight: 0.04,
      colorbarHeight: 0.02,
    })
    inst.attachToCanvas(canvasRef.current)
    setNv(inst)
  }, [canvasRef, nv, showCrosshair, showColorbar, wheelMode])

  // reload volumes on change
  useEffect(() => {
    if (!nv) return
    ;(async () => {
      await nv.loadVolumes([])
      const imgs: NVImage[] = []
      if (targetUrl) imgs.push({ url: targetUrl, colormap: targetColorMap, opacity: 1 - blend })
      if (sourceUrl) imgs.push({ url: sourceUrl, colormap: sourceColorMap, opacity: blend })
      await nv.loadVolumes(imgs)
      applyViewMode()
    })()
  }, [nv, targetUrl, sourceUrl, targetColorMap, sourceColorMap, blend])

  // update blend opacity
  useEffect(() => {
    if (!nv) return
    nv.opts.volumeOpacity = [1 - blend, blend]
    nv.updateGLVolume()
    nv.drawScene(true)
  }, [nv, blend])

  // toggle crosshair width and colorbar flag
  useEffect(() => {
    if (!nv) return
    nv.opts.crosshairWidth = showCrosshair ? 1 : 0
    nv.opts.showSliceCrosshair = showCrosshair
    nv.opts.show3Dcrosshair = showCrosshair
    nv.opts.isColorbar = showColorbar
    nv.updateGLVolume()
    nv.drawScene(true)
  }, [nv, showCrosshair, showColorbar])

  // update scroll behavior for zoom/slice
  useEffect(() => {
    if (!nv) return
    nv.opts.isScrollSlice = wheelMode === 'slice'
    nv.opts.isScrollZoom = wheelMode === 'zoom'
    nv.updateGLVolume()
    nv.drawScene(true)
  }, [nv, wheelMode])

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

  // blend wheel handler – Niivue handles slice/zoom
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
      <div style={{ display: 'flex', gap: 12, padding: 8, background: '#fff' }}>
        {/* Volume selectors */}
        <div>
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
        <div>
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
        {/* Blend slider */}
        <div>
          <label>Blend</label>
          <input type="range" min={0} max={1} step={0.01}
            value={blend} onChange={e => setBlend(+e.target.value)}
          />
        </div>
        {/* Wheel mode selector */}
        <div>
          <label>Wheel Mode</label>
          <select value={wheelMode} onChange={e => setWheelMode(e.target.value as WheelMode)}>
            <option value="slice">Slice</option>
            <option value="blend">Blend</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
        {/* View mode selector */}
        <div>
          <label>View</label>
          <select value={viewMode} onChange={e => setViewMode(e.target.value as ViewMode)}>
            <option value="combined">Combined</option>
            <option value="axial">Axial</option>
            <option value="coronal">Coronal</option>
            <option value="sagittal">Sagittal</option>
            <option value="3d">3D</option>
          </select>
        </div>
        {/* Toggles */}
        <label>
          <input type="checkbox" checked={showCrosshair}
            onChange={() => setShowCrosshair(c => !c)} /> Show Crosshair
        </label>
        <label>
          <input type="checkbox" checked={showColorbar}
            onChange={() => setShowColorbar(c => !c)} /> Show Colorbar
        </label>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} onContextMenu={e => e.preventDefault()} />
    </div>
  )
}

export default NiivueDualViewer
