import React from 'react'
import OpenMedView from './components/OpenMedView'

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
  "femur":"brain/femur.obj",
   "acetabulum":"brain/acetabulum.obj",
}


const exampleVolumes: Record<string, string> = {

  "PD corr":"brain/_RT_Cor_PD_FS_20130819105810_601.nii",
  "PD sag":"brain/_RT_Sag_PD_FS_20130819105810_501.nii",
  "T1 cor":"brain/_RT_cor_T1_DRIVE_CLEAR_20130819105810_701.nii",
  "T1 obl":"brain/_RT_TRA_OBL_T1_20130819105810_901.nii",

  "segmentation":"brain/segmentation.nii",
}
const App: React.FC = () => (
  <div style={{height:'100vh'}}>
    <OpenMedView availableVolumes={exampleVolumes}

    availableMeshes={exampleMeshes} 
    />
  </div>
)

export default App