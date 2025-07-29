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

const NiivueDualViewer: React.FC<NiivueDualViewerProps> = ({ availableVolumes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nv, setNv]                  = useState<Niivue|null>(null)
  const [targetUrl, setTargetUrl]    = useState<string>("")
  const [sourceUrl, setSourceUrl]    = useState<string>("")
  const [targetColorMap, setTargetColorMap] = useState("gray")
  const [sourceColorMap, setSourceColorMap] = useState("red")
  const [blend, setBlend]         = useState(0.5)
  const [viewMode, setViewMode]   = useState<'combined'|'axial'|'coronal'|'sagittal'|'3d'>('combined')
  // ROI and zoom removed
  const [wheelMode, setWheelMode] = useState<'slice'|'blend'>('slice')

  // 1) init Niivue
  useEffect(() => {
    if (!canvasRef.current || nv) return
    const inst = new Niivue({ show3Dcrosshair:true })
    inst.opts.isScrollSlice = false
    inst.opts.isScrollZoom  = false
    inst.attachToCanvas(canvasRef.current)
    setNv(inst)
  }, [canvasRef, nv])

  // 2) load / reload volumes
  useEffect(() => {
    if (!nv) return
    ;(async () => {
      await nv.loadVolumes([])
      const imgs: NVImage[] = []
      if (targetUrl)   imgs.push({ url: targetUrl,   colormap: targetColorMap, opacity: 1 - blend })
      if (sourceUrl)   imgs.push({ url: sourceUrl,   colormap: sourceColorMap, opacity: blend })
      await nv.loadVolumes(imgs)
      applyViewMode()
    })()
  }, [nv, targetUrl, sourceUrl, targetColorMap, sourceColorMap, blend])

  // 3) apply blend slider
  useEffect(() => {
    if (!nv) return
    nv.opts.volumeOpacity = [1 - blend, blend]
    nv.updateGLVolume()
    nv.drawScene(true)
  }, [nv, blend])

  // 5) view mode helper
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

  // 6) wheel handler for blend (slice by Niivue)
  useEffect(() => {
    if (!nv || !canvasRef.current) return
    nv.opts.isScrollSlice = (wheelMode === 'slice')
    const handler = (e: WheelEvent) => {
      if (wheelMode === 'blend') {
        e.preventDefault(); e.stopImmediatePropagation()
        setBlend(b => Math.max(0, Math.min(1, b + (e.deltaY < 0 ? 0.05 : -0.05))))
      }
    }
    const c = canvasRef.current
    c.addEventListener('wheel', handler, { passive:false, capture:true })
    return () => { c.removeEventListener('wheel', handler, { capture:true }) }
  }, [nv, wheelMode])

  return (
    <div style={{position:'relative', height:'100%', touchAction:'none'}}>
      <div style={{display:'flex', gap:12, padding:8, background:'#fff'}}>
        <div>
          <label>Target:</label>
          <select
            value={targetUrl}
            onChange={e=>setTargetUrl(e.target.value)}
          >
            <option value="">– Select –</option>
            {Object.entries(availableVolumes).map(([name,url])=>
              <option key={url} value={url}>{name}</option>
            )}
          </select>
          <select
            value={targetColorMap}
            onChange={e=>setTargetColorMap(e.target.value)}
          >
            {allColorMaps.map(cm=><option key={cm}>{cm}</option>)}
          </select>
        </div>
        <div>
          <label>Source:</label>
          <select
            value={sourceUrl}
            onChange={e=>setSourceUrl(e.target.value)}
          >
            <option value="">– Select –</option>
            {Object.entries(availableVolumes).map(([name,url])=>
              <option key={url} value={url}>{name}</option>
            )}
          </select>
          <select
            value={sourceColorMap}
            onChange={e=>setSourceColorMap(e.target.value)}
          >
            {allColorMaps.map(cm=><option key={cm}>{cm}</option>)}
          </select>
        </div>
        <div>
          <label>Blend</label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={blend}
            onChange={e=>setBlend(+e.target.value)}
          />
        </div>
        {/* Zoom control removed */}
        <div>
          <label>Wheel Mode</label>
          <select
            value={wheelMode}
            onChange={e=>setWheelMode(e.target.value as any)}
          >
            <option value="slice">Slice</option>
            <option value="blend">Blend</option>
          </select>
        </div>
        <div>
          <label>View</label>
          <select
            value={viewMode}
            onChange={e=>setViewMode(e.target.value as any)}
          >
            <option value="combined">Combined</option>
            <option value="axial">Axial</option>
            <option value="coronal">Coronal</option>
            <option value="sagittal">Sagittal</option>
            <option value="3d">3D</option>
          </select>
        </div>
        {/* ROI toggle removed */}
      </div>
      <canvas
        ref={canvasRef}
        style={{width:'100%', height:'100%'}}
        onContextMenu={e=>e.preventDefault()}
      />
    </div>
  )
}

export default NiivueDualViewer