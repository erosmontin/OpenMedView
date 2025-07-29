import React from 'react'
import NiivueDualViewer from './components/NiivueDualViewer'

// const exampleVolumes: Record<string,string> = {

//   BloodPerfusion: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/BloodPerfusion.nii.gz",
//   HeatCapacity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/HeatCapacity.nii.gz",
//   MaterialDensity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/MaterialDensity.nii.gz",
//   Metabolism: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/Metabolism.nii.gz",
//   SAR: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/SAR.nii.gz",
//   TermalConductivity: "https://raw.githubusercontent.com/cloudmrhub/tess-tools/main/tess/testdata/Head/ThermalConductivity.nii.gz"
// };

// const exampleVolumes: Record<string, string> = {
//   k:"data/k.nii.gz",
//   mur:"data/mur.nii.gz",
//   t1: "data/t1.nii.gz",
//   t2: "data/t2.nii.gz",
// }
// const exampleMesh: Record<string,string> = {"coil":"data/coil_smpl.obj"}



const exampleMeshes: Record<string, string> = {
  "brain":"brain/BrainMesh_ICBM152.lh.mz3",
  "motor":"brain/BrainMesh_ICBM152.lh.motor.mz3"
}


const exampleVolumes: Record<string, string> = {
  "brain": "brain/mni152.nii.gz"
}
const App: React.FC = () => (
  <div style={{height:'100vh'}}>
    <NiivueDualViewer availableVolumes={exampleVolumes}
    availableMeshes={exampleMeshes} />
  </div>
)

export default App