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
  const [blend, setBlend] = useState<number>(0.0);
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
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; offX: number; offY: number } | null>(null);
  const [targetWindow, setTargetWindow] = useState<[number,number]>([0,1]);
  const [sourceWindow, setSourceWindow] = useState<[number,number]>([0,1]);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);

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
      nvInstance.attachToCanvas(canvasRef.current);
      setNv(nvInstance);
    }
  }, [canvasRef, nv]);

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

  // show custom context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  };
  // hide menu
  const closeCtxMenu = () => setCtxMenu(null);

  return (
    <div style={{ padding: 10, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h3>Niivue Dual Viewer with Blending & Drawing</h3>
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginBottom: 10,
          position: 'relative',
          zIndex: 1,               // ← keep controls on top
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

        {/* Drawing Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={() => setDrawingEnabled(!drawingEnabled)}>
            {drawingEnabled ? 'Disable Drawing' : 'Enable Drawing'}
          </button>
          <div>
            <label>Pen Value:</label>
            <input
              type="number"
              min="0" max="255"
              value={penValue}
              onChange={e => setPenValue(parseInt(e.target.value, 10))}
              style={{ width: 60, marginLeft: 6 }}
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
              type="range"
              min="0" max="1" step="0.01"
              value={drawOpacity}
              onChange={e => setDrawOpacity(parseFloat(e.target.value))}
            />
            <span>{Math.round(drawOpacity * 100)}%</span>
          </div>
          <div>
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
          <button onClick={undoDraw}>Undo</button>
          <button onClick={saveDrawing}>Save Drawing</button>
        </div>

        <div style={{ display:'flex', gap:40, marginTop:10 }}>
          <div>
            <h4>Target ({targetColorMap})</h4>
            <div style={{
              width: 20,
              height: 150,
              background: 'lightgray',
              border: '1px solid #999'
            }} />
            <label>Min:</label>
            <input
              type="number"
              value={targetWindow[0]}
              onChange={e => setTargetWindow([+e.target.value, targetWindow[1]])}
              style={{ width: 60, marginLeft: 6 }}
            />
            <label>Max:</label>
            <input
              type="number"
              value={targetWindow[1]}
              onChange={e => setTargetWindow([targetWindow[0], +e.target.value])}
              style={{ width: 60, marginLeft: 6 }}
            />
          </div>

          <div>
            <h4>Source ({sourceColorMap})</h4>
            <div style={{
              width: 20,
              height: 150,
              background: 'lightgray',
              border: '1px solid #999'
            }} />
            <label>Min:</label>
            <input
              type="number"
              value={sourceWindow[0]}
              onChange={e => setSourceWindow([+e.target.value, sourceWindow[1]])}
              style={{ width: 60, marginLeft: 6 }}
            />
            <label>Max:</label>
            <input
              type="number"
              value={sourceWindow[1]}
              onChange={e => setSourceWindow([sourceWindow[0], +e.target.value])}
              style={{ width: 60, marginLeft: 6 }}
            />
          </div>
        </div>
      </div>

      <div
        style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onContextMenu={handleContextMenu}
        onClick={closeCtxMenu}
      >
        {/* context menu */}
        {ctxMenu && (
          <ul
            style={{
              position: 'absolute',
              top: ctxMenu.y,
              left: ctxMenu.x,
              listStyle: 'none',
              margin: 0,
              padding: 4,
              background: '#fff',
              border: '1px solid #ccc',
              zIndex: 10
            }}
          >
            <li onClick={() => { setZoom(z => Math.min(3, z * 1.2)); closeCtxMenu(); }}>
              Zoom In
            </li>
            <li onClick={() => { setZoom(z => Math.max(0.5, z / 1.2)); closeCtxMenu(); }}>
              Zoom Out
            </li>
            <li onClick={() => { setZoom(1); closeCtxMenu(); }}>
              Reset Zoom
            </li>
            <li onClick={() => {
              if (!nv) return;
              nv.opts.isColorbar = !nv.opts.isColorbar;
              nv.drawScene(true);
              closeCtxMenu();
            }}>
              Toggle Colorbars
            </li>
            <li onClick={() => {
              const vol = prompt('Volume index (0=target,1=source):', '0');
              if (vol == null) return closeCtxMenu();
              const idx = Number(vol);
              const cur = idx === 0 ? targetWindow : sourceWindow;
              const lo = prompt('Min:', String(cur[0]));
              const hi = prompt('Max:', String(cur[1]));
              if (lo != null && hi != null) {
                const bounds: [number, number] = [parseFloat(lo), parseFloat(hi)];
                if (idx === 0) setTargetWindow(bounds);
                else setSourceWindow(bounds);
              }
              closeCtxMenu();
            }}>
              Adjust Window/Level
            </li>
          </ul>
        )}

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            touchAction: 'none',
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
            transformOrigin: 'top left',
            zIndex: 0
          }}
          onWheel={e => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            setZoom(z => Math.max(0.5, Math.min(3, z * factor)));
          }}
          onPointerDown={e => {
            e.preventDefault();
            setIsDragging(true);
            dragStartRef.current = { x: e.clientX, y: e.clientY, offX: offsetX, offY: offsetY };
          }}
          onPointerMove={e => {
            if (!isDragging || !dragStartRef.current) return;
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            setOffsetX(dragStartRef.current.offX + dx);
            setOffsetY(dragStartRef.current.offY + dy);
          }}
          onPointerUp={() => {
            setIsDragging(false);
            dragStartRef.current = null;
          }}
          onPointerLeave={() => {
            setIsDragging(false);
            dragStartRef.current = null;
          }}
        />
      </div>
    </div>
  );
};

export default App;
