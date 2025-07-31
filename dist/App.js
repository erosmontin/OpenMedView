var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import OpenMedView from './components/OpenMedView';
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
var exampleMeshes = {
    "brain": "brain/BrainMesh_ICBM152.lh.mz3",
    "motor": "brain/BrainMesh_ICBM152.lh.motor.mz3"
};
var exampleVolumes = {
    "brain": "brain/mni152.nii.gz"
};
var App = function () { return (_jsx("div", __assign({ style: { height: '100vh' } }, { children: _jsx(OpenMedView, { availableVolumes: exampleVolumes }) }))); };
export default App;
//# sourceMappingURL=App.js.map