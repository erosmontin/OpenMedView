import React, { useRef, useEffect, useState } from 'react';
import { Niivue, NVImage } from '@niivue/niivue';

const exampleVolumes: { [key: string]: string } = {
  BloodPerfusion: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/BloodPerfusion.nii.gz",
  HeatCapacity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/HeatCapacity.nii.gz",
  MaterialDensity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/MaterialDensity.nii.gz",
  Metabolism: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/Metabolism.nii.gz",
  SAR: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/SAR.nii.gz",
  TermalConductivity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/ThermalConductivity.nii.gz"
};

const allColorMaps = [
  'gray','hot','red','blue',
  'warm','cool','plasma','viridis','inferno'
];

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nv, setNv] = useState<Niivue | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [blend, setBlend] = useState<number>(0.5);
  const [targetColorMap, setTargetColorMap] = useState("gray");
  const [sourceColorMap, setSourceColorMap] = useState("red");
  const [viewMode, setViewMode] = useState<
    'combined' | 'axial' | 'coronal' | 'sagittal' | '3d'
  >('combined');
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [penValue, setPenValue] = useState(1);
  const [fillMode, setFillMode] = useState(false);
  const [drawOpacity, setDrawOpacity] = useState(0.8);
  const [zoom, setZoom] = useState(1.0); // 1.0 == 100%
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  // add wheelMode state to toggle slice vs blend
  const [wheelMode, setWheelMode] = useState<'slice'|'blend'|'zoom'>('slice');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; offX: number; offY: number } | null>(null);
  const [targetWindow, setTargetWindow] = useState<[number,number]>([0,1]);
  const [sourceWindow, setSourceWindow] = useState<[number,number]>([0,1]);
  const [interactionMode, setInteractionMode] = useState<'roi'>('roi');

  // for Contrast rectangle
  const [contrastRect, setContrastRect] = useState<{ x:number; y:number; w:number; h:number }|null>(null)
  const rectStartRef = useRef<{ x:number; y:number }|null>(null)

  useEffect(() => {
    if (canvasRef.current && !nv) {
      const nvInstance = new Niivue({
        show3Dcrosshair: true,
        isRadiologicalConvention: true,
        dragAndDropEnabled: false,
        showAxial: true,
        showCoronal: true,
        showSagittal: true,
        show3D: true,
      });
      // disable built‐in scroll, we’ll handle slice vs blend below
      nvInstance.opts.isScrollZoom  = false;
      nvInstance.opts.isScrollSlice = false;

      nvInstance.attachToCanvas(canvasRef.current);
      setNv(nvInstance);
    }
  }, [canvasRef, nv]);

  // always use Niivue’s built-in slice scroll
  useEffect(() => {
    if (!nv) return;
    // only one mode active at a time:
    nv.opts.isScrollSlice = (wheelMode === 'slice');
    nv.opts.isScrollZoom  = (wheelMode === 'zoom');
  }, [nv, wheelMode]);

  // Attach our blend‐on‐wheel handler (passive:false)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nv) return;
    // capture‐phase handler to intercept blend only
    const handler = (e: WheelEvent) => {
      if (wheelMode !== 'blend') return;
      e.preventDefault();
      // stop Niivue’s own slice‐scroll from running
      e.stopImmediatePropagation();

      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      const newBlend = Math.max(0, Math.min(1, blend + delta));
      setBlend(newBlend);
      nv.opts.volumeOpacity = [1 - newBlend, newBlend];
      nv.updateGLVolume();
      nv.drawScene(true);
    };
    // attach in capture phase
    canvas.addEventListener('wheel', handler, {
      passive: false,
      capture: true
    });
    return () => {
      canvas.removeEventListener('wheel', handler, {
        capture: true
      });
    };
  }, [nv, wheelMode, blend]);

  // helper to switch Niivue’s sliceType + redraw
  const applyViewMode = () => {
    if (!nv) return;
    console.log('applyViewMode →', viewMode);
    switch (viewMode) {
      case 'combined':
        nv.setSliceType(nv.sliceTypeMultiplanar);
        nv.setMultiplanarLayout(2);          // 2×2 grid
        nv.opts.multiplanarEqualSize = true; // force square tiles
        break;
      case 'axial':
        nv.setSliceType(nv.sliceTypeAxial);
        break;
      case 'coronal':
        nv.setSliceType(nv.sliceTypeCoronal);
        break;
      case 'sagittal':
        nv.setSliceType(nv.sliceTypeSagittal);
        break;
      case '3d':
        nv.setSliceType(nv.sliceTypeRender);
        break;
    }
    // redraw everything
    nv.drawScene(true);
  };

  // ONLY toggle panels here; do NOT reload volumes
  useEffect(() => {
    applyViewMode();
  }, [nv, viewMode]);

  const setOpacity = (layer: number, value: number) => {
    if (nv?.setVolumeOpacity) {
      nv.setVolumeOpacity(layer, value);
    } else if (nv?.volumes?.[layer]) {
      nv.volumes[layer].opacity = value;
    }
  };

  const updateVolumes = async () => {
    if (!nv) return;

    // clear any existing volumes
    await nv.loadVolumes([]);

    // build the list with initial colormap & opacity
    const vols: NVImage[] = [];
    if (targetUrl) {
      vols.push({
        url: targetUrl,
        colormap: targetColorMap,
        opacity: 1 - blend,
      });
    }
    if (sourceUrl) {
      vols.push({
        url: sourceUrl,
        colormap: sourceColorMap,
        opacity: blend,
      });
    }

    // now load them; Niivue will apply colormap & opacity immediately
    await nv.loadVolumes(vols);
    
    // re‐apply your panel flags after reloading
    applyViewMode();
  };

  // reload volumes only when URLs or colormaps change
  useEffect(() => {
    updateVolumes();
  }, [targetUrl, sourceUrl, targetColorMap, sourceColorMap]);

  // adjust opacity on slider moves only
  useEffect(() => {
    if (!nv) return;
    setOpacity(0, 1 - blend);
    setOpacity(1, blend);
    nv.updateGLVolume();
    nv.drawScene(true);         // ← force a redraw after changing opacity
  }, [nv, blend]);

  useEffect(() => {
    if (!nv) return;
    // apply drawing settings
    nv.setDrawingEnabled(drawingEnabled);
    nv.setPenValue(penValue, fillMode);
    nv.setDrawOpacity(drawOpacity);

    // apply zoom
    nv.opts.zoomFactor = zoom;
    nv.drawScene(true);
  }, [nv, drawingEnabled, penValue, fillMode, drawOpacity, zoom]);

  useEffect(() => {
    if (!nv) return;
    console.log('🔍 zoom →', zoom);
    nv.opts.zoomFactor = zoom;
    nv.drawScene(true);
  }, [nv, zoom]);

  useEffect(() => {
    if (!nv) return;
    if (nv.volumes[0]) {
      const [lo, hi] = nv.volumes[0].dataRange;
      setTargetWindow([lo, hi]);
    }
    if (nv.volumes[1]) {
      const [lo, hi] = nv.volumes[1].dataRange;
      setSourceWindow([lo, hi]);
    }
  }, [nv, targetUrl, sourceUrl]);

  useEffect(() => {
    if (!nv) return;
    // only touch layers that actually exist
    if (nv.volumes[0]) {
      nv.opts.clipVolumeLow[0]  = targetWindow[0];
      nv.opts.clipVolumeHigh[0] = targetWindow[1];
    }
    if (nv.volumes[1]) {
      nv.opts.clipVolumeLow[1]  = sourceWindow[0];
      nv.opts.clipVolumeHigh[1] = sourceWindow[1];
    }
    nv.updateGLVolume();      // ← upload new window/level to GPU
    nv.drawScene(true);       // ← redraw with new settings
  }, [nv, targetWindow, sourceWindow]);

  const undoDraw = () => {
    if (!nv) return;
    nv.drawUndo();
  };

  const saveDrawing = () => {
    if (!nv) return;
    nv.saveImage({ filename: 'drawing.nii.gz', isSaveDrawing: true });
  };

  // new helper to prompt window/level on demand
  const adjustContrast = () => {
    if (!nv) return;
    const loStr = prompt('New Min:', String(nv.opts.clipVolumeLow[0] ?? 0));
    const hiStr = prompt('New Max:', String(nv.opts.clipVolumeHigh[0] ?? 1));
    if (loStr !== null && hiStr !== null) {
      const lo = parseFloat(loStr), hi = parseFloat(hiStr);
      nv.opts.clipVolumeLow[0]  = lo;
      nv.opts.clipVolumeHigh[0] = hi;
      nv.updateGLVolume();
      nv.drawScene(true);
    }
    setContrastRect(null);
    setInteractionMode('drag');
  };

  // pointer handlers
  // we don’t need drag/contrast here any more – Niivue handles those internally

  // only intercept blend‐wheel; Zoom/Slice go to Niivue’s own handlers
  const onBlendWheel = (e: React.WheelEvent) => {
    if (!nv || wheelMode !== 'blend') return
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.05 : -0.05
    const newBlend = Math.max(0, Math.min(1, blend + delta))
    setBlend(newBlend)
    nv.opts.volumeOpacity = [1 - newBlend, newBlend]
    nv.updateGLVolume()
    nv.drawScene(true)
  }

  // 2) BEHAVIOR effect: map interactionMode → Niivue flags
  useEffect(() => {
    if (!nv) return;
    // we only care about ROI drawing now
    nv.opts.isUseTranslate = false;
    nv.opts.isUseContrast  = false;
    nv.setDrawingEnabled(interactionMode === 'roi' && drawingEnabled);
    nv.drawScene(true);
  }, [nv, interactionMode, drawingEnabled]);

  // 3) DISABLE ROI in 3D mode
  useEffect(() => {
    if (viewMode === '3d' && interactionMode === 'roi') {
      setInteractionMode('drag')
      setDrawingEnabled(false)
    }
  }, [viewMode])

  // wheel is handled by:
  //  • Niivue’s internal slice‐scroll when wheelMode==='slice' (nv.opts.isScrollSlice)
  //  • your native blend listener (attached above with passive:false)

  // apply drawing settings + zoom + ROI draw toggle
  useEffect(() => {
    if (!nv) return
    // only enable Niivue drawing when in ROI mode AND "Start ROI" is on
    const enableDraw = interactionMode === 'roi' && drawingEnabled
    nv.setDrawingEnabled(enableDraw)
    nv.setPenValue(penValue, fillMode)
    nv.setDrawOpacity(drawOpacity)

    // apply zoom
    nv.opts.zoomFactor = zoom
    nv.drawScene(true)
  }, [
    nv,
    interactionMode,    // so we disable draw when exiting ROI mode
    drawingEnabled,
    penValue,
    fillMode,
    drawOpacity,
    zoom
  ])

  // Wrap everything in a fixed‐height container so flex:1 has space to grow
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none'
      }}
    >
      <h3>Niivue Dual Viewer with Blending & Drawing</h3>

      {/* ——— CONTROL PANEL ——— */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginBottom: 10,
          position: 'relative',
          zIndex: 1,
          background: '#fff'
        }}
      >
        <div>
          <label>View Mode:</label>
          <select value={viewMode} onChange={e => setViewMode(e.target.value as any)}>
            <option value="combined">Combined</option>
            <option value="axial">Axial</option>
            <option value="coronal">Coronal</option>
            <option value="sagittal">Sagittal</option>
            <option value="3d">3D</option>
          </select>
        </div>

        <div>
          <label>Target Image:</label>
          <select value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)}>
            <option value="">-- Select Target --</option>
            {Object.entries(exampleVolumes).map(([name, url]) => (
              <option key={url} value={url}>{name}</option>
            ))}
          </select>
          <select value={targetColorMap} onChange={(e) => setTargetColorMap(e.target.value)}>
            {allColorMaps.map(cm => (
              <option key={cm} value={cm}>{cm}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Source Image:</label>
          <select value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)}>
            <option value="">-- Select Source --</option>
            {Object.entries(exampleVolumes).map(([name, url]) => (
              <option key={url} value={url}>{name}</option>
            ))}
          </select>
          <select value={sourceColorMap} onChange={(e) => setSourceColorMap(e.target.value)}>
            {allColorMaps.map(cm => (
              <option key={cm} value={cm}>{cm}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label>Blend</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={blend}
            onChange={(e) => setBlend(parseFloat(e.target.value))}
          />
          <span>{Math.round((1 - blend) * 100)}% Target / {Math.round(blend * 100)}% Source</span>
        </div>

        {/* NEW: Zoom slider */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label>Zoom:</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            style={{ width: 120, marginLeft: 6 }}
          />
          <span>{Math.round(zoom * 100)}%</span>
        </div>

        {/* Only ROI remains as a “mode” */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label>ROI Design:</label>
          <button
            disabled={viewMode === '3d'}
            onClick={() => {
              if (drawingEnabled) {
                // Stop ROI
                setDrawingEnabled(false);
                setInteractionMode('drag');
              } else {
                // Start ROI
                setInteractionMode('roi');
                setDrawingEnabled(true);
              }
            }}
          >
            {drawingEnabled ? 'Stop ROI' : 'Start ROI'}
          </button>
        </div>
        {/* NEW: wheelMode selector */}
        <div>
          <label>Wheel Mode:</label>
          <select
            value={wheelMode}
            onChange={e => setWheelMode(e.target.value as any)}
            style={{ marginLeft: 6 }}
          >
            <option value="slice">Slice</option>
            <option value="blend">Blend</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </div>

      {/* ——— VIEWER + CONTEXT‐MENU ——— */}
      <div style={{
        flex: 1,            // <— now flex:1 has actual height
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none'
      }}
      >
        {/* ROI panel & contrast rectangle */}
        {interactionMode === 'roi' && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 4, zIndex: 11
          }}>
            <button onClick={() => setDrawingEnabled(d => !d)}>
              {drawingEnabled ? 'Stop ROI' : 'Start ROI'}
            </button>
            <div>
              <label>Pen Value:</label>
              <input
                type="number" min={0} max={255}
                value={penValue}
                onChange={e => setPenValue(+e.target.value)}
                style={{ width: 50, marginLeft: 6 }}
              />
            </div>
            <div>
              <label>Fill Mode:</label>
              <input
                type="checkbox"
                checked={fillMode}
                onChange={e => setFillMode(e.target.checked)}
                style={{ marginLeft: 6 }}
              />
            </div>
            <div>
              <label>Opacity:</label>
              <input
                type="range" min={0} max={1} step={0.01}
                value={drawOpacity}
                onChange={e => setDrawOpacity(+e.target.value)}
              />
              <span>{Math.round(drawOpacity * 100)}%</span>
            </div>
            <div>
              <button onClick={undoDraw}>Undo</button>
              <button onClick={saveDrawing}>Save Drawing</button>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',    // full fill parent
            height: '100%',
            touchAction: 'none',
            zIndex: 0
          }}
          onContextMenu={e => e.preventDefault()}   // allow Niivue r-click window/level
          /* Niivue’s internal pan/zoom & contrast handlers will now do their thing */
        />
      </div>
    </div>
  );
};

export default App;
