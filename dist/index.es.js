import Ne, { useRef as cr, useState as y, useEffect as F } from "react";
import { Niivue as ur, NVImage as We, NVMesh as fr } from "@niivue/niivue";
var _e = { exports: {} }, J = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var ye, Ve;
function Fe() {
  if (Ve)
    return ye;
  Ve = 1;
  var w = Object.getOwnPropertySymbols, k = Object.prototype.hasOwnProperty, m = Object.prototype.propertyIsEnumerable;
  function o(x) {
    if (x == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(x);
  }
  function W() {
    try {
      if (!Object.assign)
        return !1;
      var x = new String("abc");
      if (x[5] = "de", Object.getOwnPropertyNames(x)[0] === "5")
        return !1;
      for (var T = {}, c = 0; c < 10; c++)
        T["_" + String.fromCharCode(c)] = c;
      var v = Object.getOwnPropertyNames(T).map(function(d) {
        return T[d];
      });
      if (v.join("") !== "0123456789")
        return !1;
      var h = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(d) {
        h[d] = d;
      }), Object.keys(Object.assign({}, h)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return ye = W() ? Object.assign : function(x, T) {
    for (var c, v = o(x), h, d = 1; d < arguments.length; d++) {
      c = Object(arguments[d]);
      for (var j in c)
        k.call(c, j) && (v[j] = c[j]);
      if (w) {
        h = w(c);
        for (var _ = 0; _ < h.length; _++)
          m.call(c, h[_]) && (v[h[_]] = c[h[_]]);
      }
    }
    return v;
  }, ye;
}
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ye;
function dr() {
  if (Ye)
    return J;
  Ye = 1, Fe();
  var w = Ne, k = 60103;
  if (J.Fragment = 60107, typeof Symbol == "function" && Symbol.for) {
    var m = Symbol.for;
    k = m("react.element"), J.Fragment = m("react.fragment");
  }
  var o = w.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, W = Object.prototype.hasOwnProperty, x = { key: !0, ref: !0, __self: !0, __source: !0 };
  function T(c, v, h) {
    var d, j = {}, _ = null, O = null;
    h !== void 0 && (_ = "" + h), v.key !== void 0 && (_ = "" + v.key), v.ref !== void 0 && (O = v.ref);
    for (d in v)
      W.call(v, d) && !x.hasOwnProperty(d) && (j[d] = v[d]);
    if (c && c.defaultProps)
      for (d in v = c.defaultProps, v)
        j[d] === void 0 && (j[d] = v[d]);
    return { $$typeof: k, type: c, key: _, ref: O, props: j, _owner: o.current };
  }
  return J.jsx = T, J.jsxs = T, J;
}
var je = {};
/** @license React v17.0.2
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ue;
function pr() {
  return Ue || (Ue = 1, function(w) {
    process.env.NODE_ENV !== "production" && function() {
      var k = Ne, m = Fe(), o = 60103, W = 60106;
      w.Fragment = 60107;
      var x = 60108, T = 60114, c = 60109, v = 60110, h = 60112, d = 60113, j = 60120, _ = 60115, O = 60116, L = 60121, A = 60122, ee = 60117, B = 60129, re = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var p = Symbol.for;
        o = p("react.element"), W = p("react.portal"), w.Fragment = p("react.fragment"), x = p("react.strict_mode"), T = p("react.profiler"), c = p("react.provider"), v = p("react.context"), h = p("react.forward_ref"), d = p("react.suspense"), j = p("react.suspense_list"), _ = p("react.memo"), O = p("react.lazy"), L = p("react.block"), A = p("react.server.block"), ee = p("react.fundamental"), p("react.scope"), p("react.opaque.id"), B = p("react.debug_trace_mode"), p("react.offscreen"), re = p("react.legacy_hidden");
      }
      var te = typeof Symbol == "function" && Symbol.iterator, H = "@@iterator";
      function fe(e) {
        if (e === null || typeof e != "object")
          return null;
        var r = te && e[te] || e[H];
        return typeof r == "function" ? r : null;
      }
      var D = k.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function R(e) {
        {
          for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++)
            n[i - 1] = arguments[i];
          K("error", e, n);
        }
      }
      function K(e, r, n) {
        {
          var i = D.ReactDebugCurrentFrame, u = i.getStackAddendum();
          u !== "" && (r += "%s", n = n.concat([u]));
          var f = n.map(function(l) {
            return "" + l;
          });
          f.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, f);
        }
      }
      var de = !1;
      function q(e) {
        return !!(typeof e == "string" || typeof e == "function" || e === w.Fragment || e === T || e === B || e === x || e === d || e === j || e === re || de || typeof e == "object" && e !== null && (e.$$typeof === O || e.$$typeof === _ || e.$$typeof === c || e.$$typeof === v || e.$$typeof === h || e.$$typeof === ee || e.$$typeof === L || e[0] === A));
      }
      function pe(e, r, n) {
        var i = r.displayName || r.name || "";
        return e.displayName || (i !== "" ? n + "(" + i + ")" : n);
      }
      function V(e) {
        return e.displayName || "Context";
      }
      function P(e) {
        if (e == null)
          return null;
        if (typeof e.tag == "number" && R("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof e == "function")
          return e.displayName || e.name || null;
        if (typeof e == "string")
          return e;
        switch (e) {
          case w.Fragment:
            return "Fragment";
          case W:
            return "Portal";
          case T:
            return "Profiler";
          case x:
            return "StrictMode";
          case d:
            return "Suspense";
          case j:
            return "SuspenseList";
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case v:
              var r = e;
              return V(r) + ".Consumer";
            case c:
              var n = e;
              return V(n._context) + ".Provider";
            case h:
              return pe(e, e.render, "ForwardRef");
            case _:
              return P(e.type);
            case L:
              return P(e._render);
            case O: {
              var i = e, u = i._payload, f = i._init;
              try {
                return P(f(u));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var S = 0, ne, Y, ae, U, ie, $, oe;
      function X() {
      }
      X.__reactDisabledLog = !0;
      function t() {
        {
          if (S === 0) {
            ne = console.log, Y = console.info, ae = console.warn, U = console.error, ie = console.group, $ = console.groupCollapsed, oe = console.groupEnd;
            var e = {
              configurable: !0,
              enumerable: !0,
              value: X,
              writable: !0
            };
            Object.defineProperties(console, {
              info: e,
              log: e,
              warn: e,
              error: e,
              group: e,
              groupCollapsed: e,
              groupEnd: e
            });
          }
          S++;
        }
      }
      function E() {
        {
          if (S--, S === 0) {
            var e = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: m({}, e, {
                value: ne
              }),
              info: m({}, e, {
                value: Y
              }),
              warn: m({}, e, {
                value: ae
              }),
              error: m({}, e, {
                value: U
              }),
              group: m({}, e, {
                value: ie
              }),
              groupCollapsed: m({}, e, {
                value: $
              }),
              groupEnd: m({}, e, {
                value: oe
              })
            });
          }
          S < 0 && R("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var N = D.ReactCurrentDispatcher, Z;
      function se(e, r, n) {
        {
          if (Z === void 0)
            try {
              throw Error();
            } catch (u) {
              var i = u.stack.trim().match(/\n( *(at )?)/);
              Z = i && i[1] || "";
            }
          return `
` + Z + e;
        }
      }
      var ve = !1, le;
      {
        var Be = typeof WeakMap == "function" ? WeakMap : Map;
        le = new Be();
      }
      function Ee(e, r) {
        if (!e || ve)
          return "";
        {
          var n = le.get(e);
          if (n !== void 0)
            return n;
        }
        var i;
        ve = !0;
        var u = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var f;
        f = N.current, N.current = null, t();
        try {
          if (r) {
            var l = function() {
              throw Error();
            };
            if (Object.defineProperty(l.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(l, []);
              } catch (M) {
                i = M;
              }
              Reflect.construct(e, [], l);
            } else {
              try {
                l.call();
              } catch (M) {
                i = M;
              }
              e.call(l.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (M) {
              i = M;
            }
            e();
          }
        } catch (M) {
          if (M && i && typeof M.stack == "string") {
            for (var s = M.stack.split(`
`), C = i.stack.split(`
`), g = s.length - 1, b = C.length - 1; g >= 1 && b >= 0 && s[g] !== C[b]; )
              b--;
            for (; g >= 1 && b >= 0; g--, b--)
              if (s[g] !== C[b]) {
                if (g !== 1 || b !== 1)
                  do
                    if (g--, b--, b < 0 || s[g] !== C[b]) {
                      var I = `
` + s[g].replace(" at new ", " at ");
                      return typeof e == "function" && le.set(e, I), I;
                    }
                  while (g >= 1 && b >= 0);
                break;
              }
          }
        } finally {
          ve = !1, N.current = f, E(), Error.prepareStackTrace = u;
        }
        var z = e ? e.displayName || e.name : "", Me = z ? se(z) : "";
        return typeof e == "function" && le.set(e, Me), Me;
      }
      function Re(e, r, n) {
        return Ee(e, !1);
      }
      function qe(e) {
        var r = e.prototype;
        return !!(r && r.isReactComponent);
      }
      function ce(e, r, n) {
        if (e == null)
          return "";
        if (typeof e == "function")
          return Ee(e, qe(e));
        if (typeof e == "string")
          return se(e);
        switch (e) {
          case d:
            return se("Suspense");
          case j:
            return se("SuspenseList");
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case h:
              return Re(e.render);
            case _:
              return ce(e.type, r, n);
            case L:
              return Re(e._render);
            case O: {
              var i = e, u = i._payload, f = i._init;
              try {
                return ce(f(u), r, n);
              } catch {
              }
            }
          }
        return "";
      }
      var we = {}, Ce = D.ReactDebugCurrentFrame;
      function ue(e) {
        if (e) {
          var r = e._owner, n = ce(e.type, e._source, r ? r.type : null);
          Ce.setExtraStackFrame(n);
        } else
          Ce.setExtraStackFrame(null);
      }
      function Ge(e, r, n, i, u) {
        {
          var f = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var l in e)
            if (f(e, l)) {
              var s = void 0;
              try {
                if (typeof e[l] != "function") {
                  var C = Error((i || "React class") + ": " + n + " type `" + l + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[l] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw C.name = "Invariant Violation", C;
                }
                s = e[l](r, l, i, n, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (g) {
                s = g;
              }
              s && !(s instanceof Error) && (ue(u), R("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", n, l, typeof s), ue(null)), s instanceof Error && !(s.message in we) && (we[s.message] = !0, ue(u), R("Failed %s type: %s", n, s.message), ue(null));
            }
        }
      }
      var Q = D.ReactCurrentOwner, he = Object.prototype.hasOwnProperty, ze = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Oe, Te, ge;
      ge = {};
      function Je(e) {
        if (he.call(e, "ref")) {
          var r = Object.getOwnPropertyDescriptor(e, "ref").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.ref !== void 0;
      }
      function He(e) {
        if (he.call(e, "key")) {
          var r = Object.getOwnPropertyDescriptor(e, "key").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.key !== void 0;
      }
      function Ke(e, r) {
        if (typeof e.ref == "string" && Q.current && r && Q.current.stateNode !== r) {
          var n = P(Q.current.type);
          ge[n] || (R('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', P(Q.current.type), e.ref), ge[n] = !0);
        }
      }
      function Xe(e, r) {
        {
          var n = function() {
            Oe || (Oe = !0, R("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
          };
          n.isReactWarning = !0, Object.defineProperty(e, "key", {
            get: n,
            configurable: !0
          });
        }
      }
      function Ze(e, r) {
        {
          var n = function() {
            Te || (Te = !0, R("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
          };
          n.isReactWarning = !0, Object.defineProperty(e, "ref", {
            get: n,
            configurable: !0
          });
        }
      }
      var Qe = function(e, r, n, i, u, f, l) {
        var s = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: o,
          // Built-in properties that belong on the element
          type: e,
          key: r,
          ref: n,
          props: l,
          // Record the component responsible for creating this element.
          _owner: f
        };
        return s._store = {}, Object.defineProperty(s._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(s, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: i
        }), Object.defineProperty(s, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: u
        }), Object.freeze && (Object.freeze(s.props), Object.freeze(s)), s;
      };
      function er(e, r, n, i, u) {
        {
          var f, l = {}, s = null, C = null;
          n !== void 0 && (s = "" + n), He(r) && (s = "" + r.key), Je(r) && (C = r.ref, Ke(r, u));
          for (f in r)
            he.call(r, f) && !ze.hasOwnProperty(f) && (l[f] = r[f]);
          if (e && e.defaultProps) {
            var g = e.defaultProps;
            for (f in g)
              l[f] === void 0 && (l[f] = g[f]);
          }
          if (s || C) {
            var b = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
            s && Xe(l, b), C && Ze(l, b);
          }
          return Qe(e, s, C, u, i, Q.current, l);
        }
      }
      var xe = D.ReactCurrentOwner, Se = D.ReactDebugCurrentFrame;
      function G(e) {
        if (e) {
          var r = e._owner, n = ce(e.type, e._source, r ? r.type : null);
          Se.setExtraStackFrame(n);
        } else
          Se.setExtraStackFrame(null);
      }
      var be;
      be = !1;
      function me(e) {
        return typeof e == "object" && e !== null && e.$$typeof === o;
      }
      function Pe() {
        {
          if (xe.current) {
            var e = P(xe.current.type);
            if (e)
              return `

Check the render method of \`` + e + "`.";
          }
          return "";
        }
      }
      function rr(e) {
        {
          if (e !== void 0) {
            var r = e.fileName.replace(/^.*[\\\/]/, ""), n = e.lineNumber;
            return `

Check your code at ` + r + ":" + n + ".";
          }
          return "";
        }
      }
      var ke = {};
      function tr(e) {
        {
          var r = Pe();
          if (!r) {
            var n = typeof e == "string" ? e : e.displayName || e.name;
            n && (r = `

Check the top-level render call using <` + n + ">.");
          }
          return r;
        }
      }
      function De(e, r) {
        {
          if (!e._store || e._store.validated || e.key != null)
            return;
          e._store.validated = !0;
          var n = tr(r);
          if (ke[n])
            return;
          ke[n] = !0;
          var i = "";
          e && e._owner && e._owner !== xe.current && (i = " It was passed a child from " + P(e._owner.type) + "."), G(e), R('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', n, i), G(null);
        }
      }
      function Ae(e, r) {
        {
          if (typeof e != "object")
            return;
          if (Array.isArray(e))
            for (var n = 0; n < e.length; n++) {
              var i = e[n];
              me(i) && De(i, r);
            }
          else if (me(e))
            e._store && (e._store.validated = !0);
          else if (e) {
            var u = fe(e);
            if (typeof u == "function" && u !== e.entries)
              for (var f = u.call(e), l; !(l = f.next()).done; )
                me(l.value) && De(l.value, r);
          }
        }
      }
      function nr(e) {
        {
          var r = e.type;
          if (r == null || typeof r == "string")
            return;
          var n;
          if (typeof r == "function")
            n = r.propTypes;
          else if (typeof r == "object" && (r.$$typeof === h || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          r.$$typeof === _))
            n = r.propTypes;
          else
            return;
          if (n) {
            var i = P(r);
            Ge(n, e.props, "prop", i, e);
          } else if (r.PropTypes !== void 0 && !be) {
            be = !0;
            var u = P(r);
            R("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", u || "Unknown");
          }
          typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && R("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function ar(e) {
        {
          for (var r = Object.keys(e.props), n = 0; n < r.length; n++) {
            var i = r[n];
            if (i !== "children" && i !== "key") {
              G(e), R("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", i), G(null);
              break;
            }
          }
          e.ref !== null && (G(e), R("Invalid attribute `ref` supplied to `React.Fragment`."), G(null));
        }
      }
      function Ie(e, r, n, i, u, f) {
        {
          var l = q(e);
          if (!l) {
            var s = "";
            (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (s += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var C = rr(u);
            C ? s += C : s += Pe();
            var g;
            e === null ? g = "null" : Array.isArray(e) ? g = "array" : e !== void 0 && e.$$typeof === o ? (g = "<" + (P(e.type) || "Unknown") + " />", s = " Did you accidentally export a JSX literal instead of a component?") : g = typeof e, R("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", g, s);
          }
          var b = er(e, r, n, u, f);
          if (b == null)
            return b;
          if (l) {
            var I = r.children;
            if (I !== void 0)
              if (i)
                if (Array.isArray(I)) {
                  for (var z = 0; z < I.length; z++)
                    Ae(I[z], e);
                  Object.freeze && Object.freeze(I);
                } else
                  R("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                Ae(I, e);
          }
          return e === w.Fragment ? ar(b) : nr(b), b;
        }
      }
      function ir(e, r, n) {
        return Ie(e, r, n, !0);
      }
      function or(e, r, n) {
        return Ie(e, r, n, !1);
      }
      var sr = or, lr = ir;
      w.jsx = sr, w.jsxs = lr;
    }();
  }(je)), je;
}
process.env.NODE_ENV === "production" ? _e.exports = dr() : _e.exports = pr();
var a = _e.exports;
const $e = [
  "gray",
  "hot",
  "red",
  "blue",
  "warm",
  "cool",
  "plasma",
  "viridis",
  "inferno"
], Le = {
  Green: [0, 1, 0, 1],
  Red: [1, 0, 0, 1],
  Blue: [0, 0, 1, 1],
  Yellow: [1, 1, 0, 1],
  Cyan: [0, 1, 1, 1],
  Magenta: [1, 0, 1, 1],
  White: [1, 1, 1, 1]
}, gr = ({ availableVolumes: w, availableMeshes: k = {} }) => {
  const m = cr(null), [o, W] = y(null), [x, T] = y(""), [c, v] = y(""), [h, d] = y("gray"), [j, _] = y("red"), [O, L] = y(0.5), [A, ee] = y(""), [B, re] = y("Green"), [p, te] = y(1), [H, fe] = y(!1), [D, R] = y(!0), [K, de] = y(!0), [q, pe] = y("combined"), [V, P] = y("slice"), [S, ne] = y(!0), [Y, ae] = y(!0), [U, ie] = y(!1), [$, oe] = y(!1);
  F(() => {
    if (!m.current || o)
      return;
    const t = new ur({
      show3Dcrosshair: S,
      isColorbar: Y,
      isRuler: U,
      isOrientCube: $,
      crosshairWidth: S ? 1 : 0,
      textHeight: 0.04,
      colorbarHeight: 0.02
    });
    t.attachToCanvas(m.current), W(t);
  }, [m, o, S, Y, V, U, $]), F(() => {
    o && (async () => {
      if (o.loadVolumes([]), o.loadMeshes([]), x && D) {
        const t = await We.loadFromUrl({
          url: x,
          name: x.split("/").pop()
        });
        t.colormap = h, t.opacity = 1 - O, o.addVolume(t);
      }
      if (c && K) {
        const t = await We.loadFromUrl({
          url: c,
          name: c.split("/").pop()
        });
        t.colormap = j, t.opacity = O, o.addVolume(t);
      }
      if (A) {
        const t = await fr.loadFromUrl({
          url: A,
          name: A.split("/").pop(),
          gl: o.gl
        }), E = t;
        E.color = Le[B], E.opacity = p, E.wireframe = H, o.addMesh(t);
      }
      X();
    })();
  }, [
    o,
    x,
    c,
    h,
    j,
    O,
    A,
    B,
    p,
    H,
    D,
    K
  ]), F(() => {
    o && (o.opts.crosshairWidth = S ? 1 : 0, o.opts.show3Dcrosshair = S, o.opts.isColorbar = Y, o.opts.isRuler = U, o.opts.isOrientCube = $, o.updateGLVolume(), o.drawScene());
  }, [o, S, Y, U, $]), F(() => {
    o && (o.updateGLVolume(), o.drawScene());
  }, [o, V]), F(() => {
    o && (o.updateGLVolume(), o.drawScene());
  }, [o, O]);
  const X = () => {
    if (!o)
      return;
    const t = o;
    switch (q) {
      case "combined":
        t.setSliceType(t.sliceTypeMultiplanar), t.setMultiplanarLayout(2), t.opts.multiplanarEqualSize = !0;
        break;
      case "axial":
        t.setSliceType(t.sliceTypeAxial);
        break;
      case "coronal":
        t.setSliceType(t.sliceTypeCoronal);
        break;
      case "sagittal":
        t.setSliceType(t.sliceTypeSagittal);
        break;
      case "3d":
        t.setSliceType(t.sliceTypeRender);
        break;
    }
    t.drawScene();
  };
  return F(X, [o, q]), F(() => {
    if (!o || !m.current)
      return;
    const t = (N) => {
      V === "blend" && (N.preventDefault(), N.stopImmediatePropagation(), L((Z) => Math.max(0, Math.min(1, Z + (N.deltaY < 0 ? 0.05 : -0.05)))));
    }, E = m.current;
    return E.addEventListener("wheel", t, { passive: !1, capture: !0 }), () => E.removeEventListener("wheel", t, { capture: !0 });
  }, [o, V]), /* @__PURE__ */ a.jsxs("div", { style: { position: "relative", height: "100%", touchAction: "none" }, children: [
    /* @__PURE__ */ a.jsxs("div", { style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      padding: 8,
      background: "#fff",
      overflowY: "auto",
      maxHeight: "180px"
    }, children: [
      /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
        /* @__PURE__ */ a.jsx("div", { style: { fontWeight: "bold", borderBottom: "1px solid #ccc" }, children: "Volumes" }),
        /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "checkbox",
              checked: D,
              onChange: () => R((t) => !t)
            }
          ),
          /* @__PURE__ */ a.jsx("label", { children: "Target:" }),
          /* @__PURE__ */ a.jsxs("select", { value: x, onChange: (t) => T(t.target.value), children: [
            /* @__PURE__ */ a.jsx("option", { value: "", children: "– Select –" }),
            Object.entries(w).map(
              ([t, E]) => /* @__PURE__ */ a.jsx("option", { value: E, children: t }, E)
            )
          ] }),
          /* @__PURE__ */ a.jsx("select", { value: h, onChange: (t) => d(t.target.value), children: $e.map((t) => /* @__PURE__ */ a.jsx("option", { children: t }, t)) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "checkbox",
              checked: K,
              onChange: () => de((t) => !t)
            }
          ),
          /* @__PURE__ */ a.jsx("label", { children: "Source:" }),
          /* @__PURE__ */ a.jsxs("select", { value: c, onChange: (t) => v(t.target.value), children: [
            /* @__PURE__ */ a.jsx("option", { value: "", children: "– Select –" }),
            Object.entries(w).map(
              ([t, E]) => /* @__PURE__ */ a.jsx("option", { value: E, children: t }, E)
            )
          ] }),
          /* @__PURE__ */ a.jsx("select", { value: j, onChange: (t) => _(t.target.value), children: $e.map((t) => /* @__PURE__ */ a.jsx("option", { children: t }, t)) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ a.jsx("label", { children: "Blend:" }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: 1,
              step: 0.01,
              value: O,
              onChange: (t) => L(+t.target.value),
              style: { width: "100px" }
            }
          ),
          /* @__PURE__ */ a.jsxs("span", { children: [
            (O * 100).toFixed(0),
            "%"
          ] })
        ] })
      ] }),
      k && Object.keys(k).length > 0 && /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
        /* @__PURE__ */ a.jsx("div", { style: { fontWeight: "bold", borderBottom: "1px solid #ccc" }, children: "Mesh" }),
        /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ a.jsx("label", { children: "Mesh:" }),
          /* @__PURE__ */ a.jsxs("select", { value: A, onChange: (t) => ee(t.target.value), children: [
            /* @__PURE__ */ a.jsx("option", { value: "", children: "– None –" }),
            Object.entries(k).map(
              ([t, E]) => /* @__PURE__ */ a.jsx("option", { value: E, children: t }, E)
            )
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ a.jsx("label", { children: "Color:" }),
          /* @__PURE__ */ a.jsx("select", { value: B, onChange: (t) => re(t.target.value), children: Object.keys(Le).map(
            (t) => /* @__PURE__ */ a.jsx("option", { value: t, children: t }, t)
          ) }),
          /* @__PURE__ */ a.jsx("label", { children: "Opacity:" }),
          /* @__PURE__ */ a.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: 1,
              step: 0.1,
              value: p,
              onChange: (t) => te(+t.target.value),
              style: { width: "80px" }
            }
          ),
          /* @__PURE__ */ a.jsxs("label", { children: [
            /* @__PURE__ */ a.jsx(
              "input",
              {
                type: "checkbox",
                checked: H,
                onChange: () => fe((t) => !t)
              }
            ),
            " Wireframe"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
        /* @__PURE__ */ a.jsx("div", { style: { fontWeight: "bold", borderBottom: "1px solid #ccc" }, children: "View" }),
        /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ a.jsx("label", { children: "View:" }),
          /* @__PURE__ */ a.jsxs("select", { value: q, onChange: (t) => pe(t.target.value), children: [
            /* @__PURE__ */ a.jsx("option", { value: "combined", children: "Combined" }),
            /* @__PURE__ */ a.jsx("option", { value: "axial", children: "Axial" }),
            /* @__PURE__ */ a.jsx("option", { value: "coronal", children: "Coronal" }),
            /* @__PURE__ */ a.jsx("option", { value: "sagittal", children: "Sagittal" }),
            /* @__PURE__ */ a.jsx("option", { value: "3d", children: "3D" })
          ] }),
          /* @__PURE__ */ a.jsx("label", { children: "Wheel:" }),
          /* @__PURE__ */ a.jsxs("select", { value: V, onChange: (t) => P(t.target.value), children: [
            /* @__PURE__ */ a.jsx("option", { value: "slice", children: "Slice" }),
            /* @__PURE__ */ a.jsx("option", { value: "blend", children: "Blend" }),
            /* @__PURE__ */ a.jsx("option", { value: "zoom", children: "Zoom" })
          ] })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ a.jsxs("label", { children: [
            /* @__PURE__ */ a.jsx(
              "input",
              {
                type: "checkbox",
                checked: S,
                onChange: () => ne((t) => !t)
              }
            ),
            " Crosshair"
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            /* @__PURE__ */ a.jsx(
              "input",
              {
                type: "checkbox",
                checked: Y,
                onChange: () => ae((t) => !t)
              }
            ),
            " Colorbar"
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            /* @__PURE__ */ a.jsx(
              "input",
              {
                type: "checkbox",
                checked: U,
                onChange: () => ie((t) => !t)
              }
            ),
            " Ruler"
          ] }),
          /* @__PURE__ */ a.jsxs("label", { children: [
            /* @__PURE__ */ a.jsx(
              "input",
              {
                type: "checkbox",
                checked: $,
                onChange: () => oe((t) => !t)
              }
            ),
            " Orient Cube"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a.jsx(
      "canvas",
      {
        ref: m,
        style: { width: "100%", height: "calc(100% - 180px)" },
        onContextMenu: (t) => t.preventDefault()
      }
    ),
    A && q !== "3d" && /* @__PURE__ */ a.jsx("div", { style: {
      position: "absolute",
      bottom: 10,
      right: 10,
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "5px 10px",
      borderRadius: "4px",
      fontSize: "12px"
    }, children: "Switch to 3D view to see the full mesh" })
  ] });
};
export {
  gr as OpenMedView
};
