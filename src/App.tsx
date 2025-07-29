import React from 'react'
import NiivueDualViewer from './components/NiivueDualViewer'

const exampleVolumes: Record<string,string> = {

  BloodPerfusion: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/BloodPerfusion.nii.gz",
  HeatCapacity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/HeatCapacity.nii.gz",
  MaterialDensity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/MaterialDensity.nii.gz",
  Metabolism: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/Metabolism.nii.gz",
  SAR: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/SAR.nii.gz",
  TermalConductivity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/ThermalConductivity.nii.gz"
};
const App: React.FC = () => (
  <div style={{height:'100vh'}}>
    <NiivueDualViewer availableVolumes={exampleVolumes} />
  </div>
)

export default App