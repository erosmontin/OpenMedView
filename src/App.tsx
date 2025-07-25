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
  }, [nv, blend]);

  return (
    <div style={{ padding: 10, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h3>Niivue Dual Viewer with Blending</h3>
      <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
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
      </div>

      <canvas ref={canvasRef} style={{ flex: 1, width: '100%' }} />
    </div>
  );
};

export default App;
