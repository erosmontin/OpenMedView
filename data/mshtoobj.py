import pyvista as pv

m = pv.read('data/TunedhighBirdcage_rad_12p3cm_legs_8_len_22cm_mesh_0.0015.msh')


# 1. Read your .msh

# 2. Extract just the outer surface
surf = m.extract_surface()

# 3. Decimate to ~5 000 faces (or fewer if you still hit memory issues)
#    target_reduction = fraction of faces to REMOVE
# target_reduction = 1 - (5000 / surf.n_faces)
# target_reduction = .9
# surf = surf.decimate(target_reduction, preserve_topology=True)

# 4. (Optional) apply your affine/scale here:
#    surf.transform(affine, inplace=True)
#    surf.scale([1000,1000,1000], inplace=True)

# 5. Save as OBJ (much lighter binary than GLB)
surf.save("data/coil_smpl.obj")

# 6. Convert to GLB
surf.save("coil_smpl.glb")