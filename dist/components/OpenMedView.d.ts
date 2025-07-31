import React from 'react';
export interface OpenMedViewProps {
    /** map from display name → URL */
    availableVolumes: Record<string, string>;
    /** map from display name → URL for meshes */
    availableMeshes?: Record<string, string>;
}
declare const OpenMedView: React.FC<OpenMedViewProps>;
export default OpenMedView;
//# sourceMappingURL=OpenMedView.d.ts.map