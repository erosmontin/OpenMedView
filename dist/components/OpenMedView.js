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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { Niivue, NVImage, NVMesh } from '@niivue/niivue';
var allColorMaps = [
    'gray', 'hot', 'red', 'blue',
    'warm', 'cool', 'plasma', 'viridis', 'inferno'
];
// Available mesh colors with friendly names
var meshColors = {
    'Green': [0, 1, 0, 1],
    'Red': [1, 0, 0, 1],
    'Blue': [0, 0, 1, 1],
    'Yellow': [1, 1, 0, 1],
    'Cyan': [0, 1, 1, 1],
    'Magenta': [1, 0, 1, 1],
    'White': [1, 1, 1, 1],
};
var OpenMedView = function (_a) {
    var availableVolumes = _a.availableVolumes, _b = _a.availableMeshes, availableMeshes = _b === void 0 ? {} : _b;
    var canvasRef = useRef(null);
    var _c = useState(null), nv = _c[0], setNv = _c[1];
    // Volume states
    var _d = useState(""), targetUrl = _d[0], setTargetUrl = _d[1];
    var _e = useState(""), sourceUrl = _e[0], setSourceUrl = _e[1];
    var _f = useState("gray"), targetColorMap = _f[0], setTargetColorMap = _f[1];
    var _g = useState("red"), sourceColorMap = _g[0], setSourceColorMap = _g[1];
    var _h = useState(0.5), blend = _h[0], setBlend = _h[1];
    // New mesh states
    var _j = useState(""), meshUrl = _j[0], setMeshUrl = _j[1];
    var _k = useState("Green"), meshColor = _k[0], setMeshColor = _k[1];
    var _l = useState(1.0), meshOpacity = _l[0], setMeshOpacity = _l[1];
    var _m = useState(false), wireframe = _m[0], setWireframe = _m[1];
    var _o = useState(true), showTarget = _o[0], setShowTarget = _o[1];
    var _p = useState(true), showSource = _p[0], setShowSource = _p[1];
    // View states
    var _q = useState('combined'), viewMode = _q[0], setViewMode = _q[1];
    var _r = useState('slice'), wheelMode = _r[0], setWheelMode = _r[1];
    var _s = useState(true), showCrosshair = _s[0], setShowCrosshair = _s[1];
    var _t = useState(true), showColorbar = _t[0], setShowColorbar = _t[1];
    var _u = useState(false), showRuler = _u[0], setShowRuler = _u[1];
    var _v = useState(false), showOrientCube = _v[0], setShowOrientCube = _v[1];
    // initialize Niivue
    useEffect(function () {
        if (!canvasRef.current || nv)
            return;
        // cast to any to bypass Partial<NVConfigOptions> strictness
        var inst = new Niivue({
            show3Dcrosshair: showCrosshair,
            isColorbar: showColorbar,
            isRuler: showRuler,
            isOrientCube: showOrientCube,
            crosshairWidth: showCrosshair ? 1 : 0,
            textHeight: 0.04,
            colorbarHeight: 0.02
        });
        inst.attachToCanvas(canvasRef.current);
        setNv(inst);
    }, [canvasRef, nv, showCrosshair, showColorbar, wheelMode, showRuler, showOrientCube]);
    // Unified loader for volumes and meshes
    useEffect(function () {
        if (!nv)
            return;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var img, img, mesh, m;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Clear previous volumes & meshes
                        nv.loadVolumes([]);
                        nv.loadMeshes([]);
                        if (!(targetUrl && showTarget)) return [3 /*break*/, 2];
                        return [4 /*yield*/, NVImage.loadFromUrl({
                                url: targetUrl,
                                name: targetUrl.split('/').pop()
                            })];
                    case 1:
                        img = _a.sent();
                        img.colormap = targetColorMap;
                        img.opacity = 1 - blend;
                        nv.addVolume(img);
                        _a.label = 2;
                    case 2:
                        if (!(sourceUrl && showSource)) return [3 /*break*/, 4];
                        return [4 /*yield*/, NVImage.loadFromUrl({
                                url: sourceUrl,
                                name: sourceUrl.split('/').pop()
                            })];
                    case 3:
                        img = _a.sent();
                        img.colormap = sourceColorMap;
                        img.opacity = blend;
                        nv.addVolume(img);
                        _a.label = 4;
                    case 4:
                        if (!meshUrl) return [3 /*break*/, 6];
                        return [4 /*yield*/, NVMesh.loadFromUrl({
                                url: meshUrl,
                                name: meshUrl.split('/').pop(),
                                gl: nv.gl
                            })
                            // TS types don’t declare color/opacity/wireframe on NVMesh,
                            // so cast to any before setting.
                        ];
                    case 5:
                        mesh = _a.sent();
                        m = mesh;
                        m.color = meshColors[meshColor];
                        m.opacity = meshOpacity;
                        m.wireframe = wireframe;
                        nv.addMesh(mesh);
                        _a.label = 6;
                    case 6:
                        applyViewMode();
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [
        nv, targetUrl, sourceUrl, targetColorMap, sourceColorMap, blend,
        meshUrl, meshColor, meshOpacity, wireframe, showTarget, showSource
    ]);
    // toggle display options
    useEffect(function () {
        if (!nv)
            return;
        nv.opts.crosshairWidth = showCrosshair ? 1 : 0;
        nv.opts.show3Dcrosshair = showCrosshair;
        nv.opts.isColorbar = showColorbar;
        nv.opts.isRuler = showRuler;
        nv.opts.isOrientCube = showOrientCube;
        nv.updateGLVolume();
        nv.drawScene();
    }, [nv, showCrosshair, showColorbar, showRuler, showOrientCube]);
    // update scroll behavior for zoom/slice
    useEffect(function () {
        if (!nv)
            return;
        // scroll behavior is handled in your wheel-handler effect
        nv.updateGLVolume();
        nv.drawScene();
    }, [nv, wheelMode]);
    // update blend opacity
    useEffect(function () {
        if (!nv)
            return;
        // per-volume opacity was set on each NVImage already
        nv.updateGLVolume();
        nv.drawScene();
    }, [nv, blend]);
    // apply view layouts
    var applyViewMode = function () {
        if (!nv)
            return;
        var _nv = nv;
        switch (viewMode) {
            case 'combined':
                _nv.setSliceType(_nv.sliceTypeMultiplanar);
                _nv.setMultiplanarLayout(2);
                _nv.opts.multiplanarEqualSize = true;
                break;
            case 'axial':
                _nv.setSliceType(_nv.sliceTypeAxial);
                break;
            case 'coronal':
                _nv.setSliceType(_nv.sliceTypeCoronal);
                break;
            case 'sagittal':
                _nv.setSliceType(_nv.sliceTypeSagittal);
                break;
            case '3d':
                _nv.setSliceType(_nv.sliceTypeRender);
                break;
        }
        _nv.drawScene();
    };
    useEffect(applyViewMode, [nv, viewMode]);
    // wheel handler for blend
    useEffect(function () {
        if (!nv || !canvasRef.current)
            return;
        var handler = function (e) {
            if (wheelMode === 'blend') {
                e.preventDefault();
                e.stopImmediatePropagation();
                setBlend(function (b) { return Math.max(0, Math.min(1, b + (e.deltaY < 0 ? 0.05 : -0.05))); });
            }
        };
        var c = canvasRef.current;
        c.addEventListener('wheel', handler, { passive: false, capture: true });
        return function () { return c.removeEventListener('wheel', handler, { capture: true }); };
    }, [nv, wheelMode]);
    return (_jsxs("div", __assign({ style: { position: 'relative', height: '100%', touchAction: 'none' } }, { children: [_jsxs("div", __assign({ style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    padding: 8,
                    background: '#fff',
                    overflowY: 'auto',
                    maxHeight: '180px'
                } }, { children: [_jsxs("div", __assign({ style: { display: 'flex', flexDirection: 'column', gap: 4 } }, { children: [_jsx("div", __assign({ style: { fontWeight: 'bold', borderBottom: '1px solid #ccc' } }, { children: "Volumes" })), _jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center', gap: 4 } }, { children: [_jsx("input", { type: "checkbox", checked: showTarget, onChange: function () { return setShowTarget(function (v) { return !v; }); } }), _jsx("label", { children: "Target:" }), _jsxs("select", __assign({ value: targetUrl, onChange: function (e) { return setTargetUrl(e.target.value); } }, { children: [_jsx("option", __assign({ value: "" }, { children: "\u2013 Select \u2013" })), Object.entries(availableVolumes).map(function (_a) {
                                                var name = _a[0], url = _a[1];
                                                return _jsx("option", __assign({ value: url }, { children: name }), url);
                                            })] })), _jsx("select", __assign({ value: targetColorMap, onChange: function (e) { return setTargetColorMap(e.target.value); } }, { children: allColorMaps.map(function (cm) { return _jsx("option", { children: cm }, cm); }) }))] })), _jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center', gap: 4 } }, { children: [_jsx("input", { type: "checkbox", checked: showSource, onChange: function () { return setShowSource(function (v) { return !v; }); } }), _jsx("label", { children: "Source:" }), _jsxs("select", __assign({ value: sourceUrl, onChange: function (e) { return setSourceUrl(e.target.value); } }, { children: [_jsx("option", __assign({ value: "" }, { children: "\u2013 Select \u2013" })), Object.entries(availableVolumes).map(function (_a) {
                                                var name = _a[0], url = _a[1];
                                                return _jsx("option", __assign({ value: url }, { children: name }), url);
                                            })] })), _jsx("select", __assign({ value: sourceColorMap, onChange: function (e) { return setSourceColorMap(e.target.value); } }, { children: allColorMaps.map(function (cm) { return _jsx("option", { children: cm }, cm); }) }))] })), _jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center', gap: 4 } }, { children: [_jsx("label", { children: "Blend:" }), _jsx("input", { type: "range", min: 0, max: 1, step: 0.01, value: blend, onChange: function (e) { return setBlend(+e.target.value); }, style: { width: '100px' } }), _jsxs("span", { children: [(blend * 100).toFixed(0), "%"] })] }))] })), availableMeshes && Object.keys(availableMeshes).length > 0 && (_jsxs("div", __assign({ style: { display: 'flex', flexDirection: 'column', gap: 4 } }, { children: [_jsx("div", __assign({ style: { fontWeight: 'bold', borderBottom: '1px solid #ccc' } }, { children: "Mesh" })), _jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center', gap: 4 } }, { children: [_jsx("label", { children: "Mesh:" }), _jsxs("select", __assign({ value: meshUrl, onChange: function (e) { return setMeshUrl(e.target.value); } }, { children: [_jsx("option", __assign({ value: "" }, { children: "\u2013 None \u2013" })), Object.entries(availableMeshes).map(function (_a) {
                                                var name = _a[0], url = _a[1];
                                                return _jsx("option", __assign({ value: url }, { children: name }), url);
                                            })] }))] })), _jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center', gap: 4 } }, { children: [_jsx("label", { children: "Color:" }), _jsx("select", __assign({ value: meshColor, onChange: function (e) { return setMeshColor(e.target.value); } }, { children: Object.keys(meshColors).map(function (color) {
                                            return _jsx("option", __assign({ value: color }, { children: color }), color);
                                        }) })), _jsx("label", { children: "Opacity:" }), _jsx("input", { type: "range", min: 0, max: 1, step: 0.1, value: meshOpacity, onChange: function (e) { return setMeshOpacity(+e.target.value); }, style: { width: '80px' } }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: wireframe, onChange: function () { return setWireframe(function (w) { return !w; }); } }), " Wireframe"] })] }))] }))), _jsxs("div", __assign({ style: { display: 'flex', flexDirection: 'column', gap: 4 } }, { children: [_jsx("div", __assign({ style: { fontWeight: 'bold', borderBottom: '1px solid #ccc' } }, { children: "View" })), _jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center', gap: 4 } }, { children: [_jsx("label", { children: "View:" }), _jsxs("select", __assign({ value: viewMode, onChange: function (e) { return setViewMode(e.target.value); } }, { children: [_jsx("option", __assign({ value: "combined" }, { children: "Combined" })), _jsx("option", __assign({ value: "axial" }, { children: "Axial" })), _jsx("option", __assign({ value: "coronal" }, { children: "Coronal" })), _jsx("option", __assign({ value: "sagittal" }, { children: "Sagittal" })), _jsx("option", __assign({ value: "3d" }, { children: "3D" }))] })), _jsx("label", { children: "Wheel:" }), _jsxs("select", __assign({ value: wheelMode, onChange: function (e) { return setWheelMode(e.target.value); } }, { children: [_jsx("option", __assign({ value: "slice" }, { children: "Slice" })), _jsx("option", __assign({ value: "blend" }, { children: "Blend" })), _jsx("option", __assign({ value: "zoom" }, { children: "Zoom" }))] }))] })), _jsxs("div", __assign({ style: { display: 'flex', alignItems: 'center', gap: 10 } }, { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: showCrosshair, onChange: function () { return setShowCrosshair(function (c) { return !c; }); } }), " Crosshair"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: showColorbar, onChange: function () { return setShowColorbar(function (c) { return !c; }); } }), " Colorbar"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: showRuler, onChange: function () { return setShowRuler(function (c) { return !c; }); } }), " Ruler"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: showOrientCube, onChange: function () { return setShowOrientCube(function (c) { return !c; }); } }), " Orient Cube"] })] }))] }))] })), _jsx("canvas", { ref: canvasRef, style: { width: '100%', height: 'calc(100% - 180px)' }, onContextMenu: function (e) { return e.preventDefault(); } }), meshUrl && viewMode !== '3d' && (_jsx("div", __assign({ style: {
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px'
                } }, { children: "Switch to 3D view to see the full mesh" })))] })));
};
export default OpenMedView;
//# sourceMappingURL=OpenMedView.js.map