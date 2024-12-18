(this["webpackJsonpthe-feed-woman"] = this["webpackJsonpthe-feed-woman"] || []).push([
    [3], {
        113: function(e, t, n) {
            e.exports = "#define GLSLIFY 1\n/* \nuniform vec2 resolution;\nuniform vec2 texelSize;\nuniform float cameraNear;\nuniform float cameraFar;\nuniform float aspect;\nuniform float time;\nuniform sampler2D inputBuffer;\nuniform sampler2D depthBuffer; \n*/\n\nuniform float strength;\n\n" + n(114) + " \n\n /* float random (vec2 st) {\n    return fract(sin(dot(st.xy,  vec2(12.9898,78.233)))* 43758.5453123);\n} */\n\nhighp float rand(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\n// Given a vec2 in [-1,+1], generate a texture coord in [0,+1]\nvec2 barrelDistortion( vec2 p, vec2 amt )\n{\n    p = 2.0 * p - 1.0;\n\n    /*\n    const float maxBarrelPower = 5.0;\n\t//note: http://glsl.heroku.com/e#3290.7 , copied from Little Grasshopper\n    float theta  = atan(p.y, p.x);\n    vec2 radius = vec2( length(p) );\n    radius = pow(radius, 1.0 + maxBarrelPower * amt);\n    p.x = radius.x * cos(theta);\n    p.y = radius.y * sin(theta);\n\n\t/*/\n    // much faster version\n    //const float maxBarrelPower = 5.0;\n    //float radius = length(p);\n    float maxBarrelPower = sqrt(5.0);\n    float radius = dot(p,p); //faster but doesn't match above accurately\n    p *= pow(vec2(radius), maxBarrelPower * amt);\n\n    return p * 0.5 + 0.5;\n}\n\n//note: from https://www.shadertoy.com/view/MlSXR3\nvec2 brownConradyDistortion(vec2 uv, float scalar)\n{\n    uv = (uv - 0.5 ) * 2.0;   \n    // positive values of K1 give barrel distortion, negative give pincushion\n    float barrelDistortion1 = -0.02 * scalar; // K1 in text books\n    //float barrelDistortion2 = 0.0 * scalar; // K2 in text books\n    float r2 = dot(uv,uv);\n    uv *= 1.0 + barrelDistortion1 * r2/* +  barrelDistortion2 * r2 * r2 */;\n   return (uv / 2.0) + 0.5;\n}\n\n/* float curve(float x, float e) {\n    return x == 0. ? 0. : pow(e, 10. * x - 10.);\n} */\n\nfloat curve(float t) {\n    return  t * t * t * t * t * t * t;\n}\n\nvoid mainImage( in vec4 fragColor, in vec2 uv, out vec4 outputColor )\n{\n    float offset = 0.;\n    #ifdef e0USE_EDGE_DITHER\n        float ratio = resolution.x / resolution.y;\n        vec2 uvR = vec2(uv.x, uv.y / ratio);\n       /*  float n0 = cnoise(vec3(uvR * 1000., time * 1.4)) * .05; */\n        float n1 = cnoise(vec3(uvR * 5., time * .2)) * .3;\n        float d = curve(distance(uv, vec2(0.5)));\n        offset = d * /* n0 * */ n1;  \n    #endif\n    vec2 distortion = brownConradyDistortion(uv, 5.5 * strength);\n    fragColor = texture2D(inputBuffer, distortion + offset);\n    fragColor.a = 1.;\n    outputColor = fragColor;\n}\n"
        },
        115: function(e, t, n) {
            e.exports = "#define GLSLIFY 1\n/* \nuniform vec2 resolution;\nuniform vec2 texelSize;\nuniform float cameraNear;\nuniform float cameraFar;\nuniform float aspect;\nuniform float time;\nuniform sampler2D inputBuffer;\nuniform sampler2D depthBuffer; \n*/\n\nuniform float strength;\n\n" + n(116) + " \n\nfloat blendScreen(float base, float blend) {\n\treturn 1.0-((1.0-base)*(1.0-blend));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend) {\n\treturn vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend, float opacity) {\n\treturn (blendScreen(base, blend) * opacity + base * (1.0 - opacity));\n}\n/* \nvec3 blendGlow(vec3 base, vec3 blend) {\n\treturn blendReflect(blend,base);\n}\n\nvec3 blendGlow(vec3 base, vec3 blend, float opacity) {\n\treturn (blendGlow(base, blend) * opacity + base * (1.0 - opacity));\n} */\n\nfloat curve(float t) {\n    return t * t * t;\n}\n\nfloat quintCurveOut(float t) {\n    //return  1. - --t * t * t * t;\n    return  1. + --t * t * t * t * t;\n}\n\nvoid mainImage( in vec4 fragColor, in vec2 uv, out vec4 outputColor )\n{\n    float ratio = resolution.x / resolution.y;\n    vec2 uvR = vec2(uv.x, uv.y / ratio);\n    \n    float d = curve(distance(uv, vec2(0.5))) * 4.5;\n\n    float n0 = quintCurveOut(snoise(vec3(uvR * 1.5, time * .085)));\n    float n1 = quintCurveOut(snoise(vec3(uvR * 1.5, time * .09 + 2.5)));\n    \n    vec3 grey = vec3(.5, .5, .5);\n    vec3 blue = vec3(104./255., 148./255., 171./255.) * n0;\n    vec3 orange = vec3(255./255., 174./255., 0./255.) * n1;\n\n    vec3 vignette = blendScreen( orange, blue, 1.) * d;\n    vignette = clamp(vignette, 0., 1.);\n   // vignette = blendScreen(vignette, vec3(.5, .5, .5), 1.);\n\n    outputColor = vec4(vignette * strength, 1.);\n    //utputColor = vec4(blue, 1.);\n}\n"
        },
        117: function(e, t, n) {
            e.exports = n.p + "static/media/angry.c0cbd50f.svg"
        },
        118: function(e, t, n) {
            e.exports = n.p + "static/media/happy.f98a083a.svg"
        },
        119: function(e, t, n) {
            e.exports = n.p + "static/media/love.4a956039.svg"
        },
        12: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, "main", (function() {
                return _a
            }));
            var a = n(0),
                r = n.n(a),
                i = n(2),
                o = (n(70), n(13)),
                c = n.n(o),
                s = n(33),
                u = n.n(s),
                l = n(1),
                f = n.n(l),
                m = n(49),
                d = n(76),
                p = f.a.name,
                v = parseFloat(f.a.version, 10),
                g = {};
            g.PLATFORM = f.a, g.MOBILE = Object(m.a)(window.navigator).any, g.THREE_9716 = "Safari" === p || "Firefox" === p && v < 57, g.USE_CONCURRENT = "Chrome" === p, g.WEBGL_MAX_TEXTURE_UNITS = 0, g.WEBGL_AVAILABLE = function() {
                try {
                    var e = document.createElement("canvas");
                    if (!window.WebGLRenderingContext) return !1;
                    var t = e.getContext("webgl") || e.getContext("experimental-webgl");
                    return g.WEBGL_MAX_TEXTURE_UNITS = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), !!t
                } catch (n) {
                    return console.warn(n), !1
                }
            }();
            var h = document.createElement("canvas").getContext("webgl");
            g.GPU_VENDOR = function() {
                try {
                    var e = h.getExtension("WEBGL_debug_renderer_info");
                    return e ? h.getParameter(e.UNMASKED_VENDOR_WEBGL) + " " + h.getParameter(e.UNMASKED_RENDERER_WEBGL) : ""
                } catch (t) {
                    return ""
                }
            }(), g.ALWAYS_UNLOCK_AUDIO = "Safari" === g.PLATFORM.name || "WebKit" === g.PLATFORM.layout || -1 !== g.PLATFORM.os.family.indexOf("iOS"), g.RESIZE_BUG = -1 !== g.PLATFORM.os.family.indexOf("iOS"), g.IS_DX_INTEL_GPU = -1 !== g.GPU_VENDOR.toLowerCase().indexOf("intel") && -1 !== g.GPU_VENDOR.toLowerCase().indexOf("direct3d"), g.IS_INTEL_GPU = -1 !== g.GPU_VENDOR.toLowerCase().indexOf("intel"), g.WEBAUDIO_AVAILABLE = !(!window.AudioContext && !window.webkitAudioContext) && !g.IS_DX_INTEL_GPU && !g.MOBILE && "Safari" !== g.PLATFORM.name, g.WEBGL_FAUX_SHADOWS_BROKEN = -1 !== g.PLATFORM.name.indexOf("Microsoft"), g.REQUIRES_LOW_RES_TEXTURES = !!g.IS_DX_INTEL_GPU || !!(h && h.getParameter(h.MAX_TEXTURE_SIZE) <= 4096) || !window.devicePixelRatio || window.devicePixelRatio <= 1, g.REQUIRES_FAST_POST_PROCESSING = g.IS_DX_INTEL_GPU, g.DISABLE_FULLSCREEN = g.PLATFORM.name.includes("Safari");
            g.init = Object(i.a)(r.a.mark((function e() {
                var t, n;
                return r.a.wrap((function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            if (!g.INITIALISED) {
                                e.next = 2;
                                break
                            }
                            return e.abrupt("return");
                        case 2:
                            if (g.INITIALISED = !0, e.t0 = !g.MOBILE, !e.t0) {
                                e.next = 8;
                                break
                            }
                            return e.next = 7, new Promise((function(e, t) {
                                var n = document.createElement("video");
                                n.autoplay = !1, n.loop = !1, n.style.display = "none", n.addEventListener("loadeddata", (function() {
                                    document.body.removeChild(n);
                                    var t = document.createElement("canvas");
                                    if (t.getContext && t.getContext("2d")) {
                                        var a = t.getContext("2d");
                                        a.drawImage(n, 0, 0), 0 === a.getImageData(0, 0, 1, 1).data[3] ? e(!0) : e(!1)
                                    } else e(!1)
                                }), !1), n.addEventListener("error", (function() {
                                    document.body.removeChild(n), e(!1)
                                })), n.addEventListener("stalled", (function() {
                                    document.body.removeChild(n), e(!1)
                                })), n.addEventListener("abort", (function() {
                                    document.body.removeChild(n), e(!1)
                                }));
                                var a = document.createElement("source");
                                a.src = "data:video/webm;base64,GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACBRFNm3RALE27i1OrhBVJqWZTrIHlTbuMU6uEFlSua1OsggEjTbuMU6uEHFO7a1OsggHo7AEAAAAAAACqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAADIq17GDD0JATYCNTGF2ZjU3LjU3LjEwMFdBjUxhdmY1Ny41Ny4xMDBEiYhARAAAAAAAABZUrmsBAAAAAAAARq4BAAAAAAAAPdeBAXPFgQGcgQAitZyDdW5khoVWX1ZQOYOBASPjg4QCYloA4AEAAAAAAAARsIFAuoFAmoECU8CBAVSygQQfQ7Z1AQAAAAAAAGfngQCgAQAAAAAAAFuhooEAAACCSYNCAAPwA/YAOCQcGFQAADBgAABnP///NXgndmB1oQEAAAAAAAAtpgEAAAAAAAAk7oEBpZ+CSYNCAAPwA/YAOCQcGFQAADBgAABnP///Vttk7swAHFO7awEAAAAAAAARu4+zgQC3iveBAfGCAXXwgQM=", a.addEventListener("error", (function() {
                                    try {
                                        document.body.removeChild(n)
                                    } catch (t) {}
                                    e(!1)
                                })), n.appendChild(a), document.body.appendChild(n)
                            }));
                        case 7:
                            e.t0 = e.sent;
                        case 8:
                            return g.WEBM_ALPHA_AVAILABLE = e.t0, e.next = 11, d.a.video();
                        case 11:
                            t = e.sent, n = t.result, g.AUTOPLAY = n;
                        case 14:
                        case "end":
                            return e.stop()
                    }
                }), e)
            })));
            var b, A, y, O, x, E, w, j, I, S, M, k, C, D, L, P, B, T = g,
                R = n(15),
                H = n(55),
                N = n(77),
                U = n(21),
                z = n(23),
                Q = n(78),
                X = (n(79), n(28)),
                W = (b = function() {
                    function e() {
                        Object(U.a)(this, e), Object(N.a)(this, "appReady", A, this), Object(N.a)(this, "activeId", y, this), Object(N.a)(this, "activePosition", O, this), Object(N.a)(this, "content", x, this), Object(N.a)(this, "showUI", E, this), Object(N.a)(this, "isDragging", w, this), Object(N.a)(this, "isHovering", j, this), Object(N.a)(this, "hoverId", I, this), Object(N.a)(this, "hasDragged", S, this), Object(N.a)(this, "mediaProgress", M, this), Object(N.a)(this, "autoplay", k, this), Object(N.a)(this, "cameraHintId", C, this), Object(N.a)(this, "cameraTransitionHint", D, this), Object(N.a)(this, "cameraBounds", L, this), Object(N.a)(this, "showHomeCursor", P, this), Object(N.a)(this, "requestHome", B, this)
                    }
                    return Object(z.a)(e, [{
                        key: "setAppReady",
                        value: function(e) {
                            this.appReady = e
                        }
                    }, {
                        key: "setIsDragging",
                        value: function(e) {
                            this.isDragging = e
                        }
                    }, {
                        key: "setActiveId",
                        value: function(e) {
                            this.activeId = e
                        }
                    }, {
                        key: "setActivePosition",
                        value: function(e) {
                            this.activePosition = e
                        }
                    }, {
                        key: "setContent",
                        value: function(e) {
                            this.content = e
                        }
                    }, {
                        key: "setShowUI",
                        value: function(e) {
                            this.showUI = e
                        }
                    }, {
                        key: "setHover",
                        value: function(e, t) {
                            this.isHovering = e, this.hoverId = t
                        }
                    }, {
                        key: "setHasDragged",
                        value: function(e) {
                            this.hasDragged = e
                        }
                    }, {
                        key: "setMediaProgress",
                        value: function(e) {
                            this.mediaProgress = e
                        }
                    }, {
                        key: "setAutoplayState",
                        value: function(e) {
                            this.autoplay = e
                        }
                    }, {
                        key: "setCameraHintId",
                        value: function(e) {
                            this.cameraHintId = e
                        }
                    }, {
                        key: "setCameraTransitionHint",
                        value: function(e) {
                            this.cameraTransitionHint = e
                        }
                    }, {
                        key: "setCameraBounds",
                        value: function(e) {
                            this.cameraBounds = e
                        }
                    }, {
                        key: "setShowHomeCursor",
                        value: function(e) {
                            this.showHomeCursor = e
                        }
                    }, {
                        key: "setRequestHome",
                        value: function(e) {
                            this.requestHome = e
                        }
                    }, {
                        key: "activeItemType",
                        get: function() {
                            var e = this,
                                t = null;
                            return this.activeId && (t = this.content.video.find((function(t) {
                                return t.id === e.activeId
                            })) ? "video" : "audio"), t
                        }
                    }, {
                        key: "activeItem",
                        get: function() {
                            var e = this;
                            return this.content[this.activeItemType].find((function(t) {
                                return t.id === e.activeId
                            }))
                        }
                    }, {
                        key: "hoverItemType",
                        get: function() {
                            var e = this,
                                t = null;
                            return this.hoverId && (t = this.content.video.find((function(t) {
                                return t.id === e.hoverId
                            })) ? "video" : "audio"), t
                        }
                    }, {
                        key: "hoverItem",
                        get: function() {
                            var e = this;
                            return this.hoverId ? this.content[this.hoverItemType].find((function(t) {
                                return t.id === e.hoverId
                            })) : null
                        }
                    }]), e
                }(), A = Object(Q.a)(b.prototype, "appReady", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return !1
                    }
                }), y = Object(Q.a)(b.prototype, "activeId", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return ""
                    }
                }), O = Object(Q.a)(b.prototype, "activePosition", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return null
                    }
                }), x = Object(Q.a)(b.prototype, "content", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return []
                    }
                }), E = Object(Q.a)(b.prototype, "showUI", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return !1
                    }
                }), w = Object(Q.a)(b.prototype, "isDragging", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return !1
                    }
                }), j = Object(Q.a)(b.prototype, "isHovering", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return !1
                    }
                }), I = Object(Q.a)(b.prototype, "hoverId", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return ""
                    }
                }), S = Object(Q.a)(b.prototype, "hasDragged", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return !1
                    }
                }), M = Object(Q.a)(b.prototype, "mediaProgress", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return 0
                    }
                }), k = Object(Q.a)(b.prototype, "autoplay", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return "pending"
                    }
                }), C = Object(Q.a)(b.prototype, "cameraHintId", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return null
                    }
                }), D = Object(Q.a)(b.prototype, "cameraTransitionHint", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return null
                    }
                }), L = Object(Q.a)(b.prototype, "cameraBounds", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return null
                    }
                }), P = Object(Q.a)(b.prototype, "showHomeCursor", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return !1
                    }
                }), B = Object(Q.a)(b.prototype, "requestHome", [X.observable], {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function() {
                        return !1
                    }
                }), Object(Q.a)(b.prototype, "activeItemType", [X.computed], Object.getOwnPropertyDescriptor(b.prototype, "activeItemType"), b.prototype), Object(Q.a)(b.prototype, "activeItem", [X.computed], Object.getOwnPropertyDescriptor(b.prototype, "activeItem"), b.prototype), Object(Q.a)(b.prototype, "hoverItemType", [X.computed], Object.getOwnPropertyDescriptor(b.prototype, "hoverItemType"), b.prototype), Object(Q.a)(b.prototype, "hoverItem", [X.computed], Object.getOwnPropertyDescriptor(b.prototype, "hoverItem"), b.prototype), Object(Q.a)(b.prototype, "setAppReady", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setAppReady"), b.prototype), Object(Q.a)(b.prototype, "setIsDragging", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setIsDragging"), b.prototype), Object(Q.a)(b.prototype, "setActiveId", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setActiveId"), b.prototype), Object(Q.a)(b.prototype, "setActivePosition", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setActivePosition"), b.prototype), Object(Q.a)(b.prototype, "setContent", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setContent"), b.prototype), Object(Q.a)(b.prototype, "setShowUI", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setShowUI"), b.prototype), Object(Q.a)(b.prototype, "setHover", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setHover"), b.prototype), Object(Q.a)(b.prototype, "setHasDragged", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setHasDragged"), b.prototype), Object(Q.a)(b.prototype, "setMediaProgress", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setMediaProgress"), b.prototype), Object(Q.a)(b.prototype, "setAutoplayState", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setAutoplayState"), b.prototype), Object(Q.a)(b.prototype, "setCameraHintId", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setCameraHintId"), b.prototype), Object(Q.a)(b.prototype, "setCameraTransitionHint", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setCameraTransitionHint"), b.prototype), Object(Q.a)(b.prototype, "setCameraBounds", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setCameraBounds"), b.prototype), Object(Q.a)(b.prototype, "setShowHomeCursor", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setShowHomeCursor"), b.prototype), Object(Q.a)(b.prototype, "setRequestHome", [X.action], Object.getOwnPropertyDescriptor(b.prototype, "setRequestHome"), b.prototype), b),
                F = c.a.createContext({
                    store: new W
                }),
                V = function() {
                    return c.a.useContext(F).store
                },
                G = (Math.PI, Math.sqrt(5), function(e, t, n) {
                    return e + (t - e) * n
                }),
                Y = function(e, t, n) {
                    return Math.max(t, Math.min(n, e))
                },
                _ = function(e) {
                    return Math.pow(2, Math.ceil(Math.log(e) / Math.log(2)))
                },
                q = function(e) {
                    return e
                },
                J = function(e) {
                    return e * e * e
                },
                K = function(e) {
                    return --e * e * e + 1
                },
                Z = function(e) {
                    return e * e * e * e * e
                },
                $ = function(e) {
                    return 1 + --e * e * e * e * e
                },
                ee = function(e) {
                    return e < .5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e
                },
                te = {
                    linear: q,
                    easeInQuad: function(e) {
                        return e * e
                    },
                    easeOutQuad: function(e) {
                        return e * (2 - e)
                    },
                    easeInOutQuad: function(e) {
                        return e < .5 ? 2 * e * e : (4 - 2 * e) * e - 1
                    },
                    easeInCubic: J,
                    easeOutCubic: K,
                    easeInOutCubic: function(e) {
                        return e < .5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1
                    },
                    easeInQuart: function(e) {
                        return e * e * e * e
                    },
                    easeOutQuart: function(e) {
                        return 1 - --e * e * e * e
                    },
                    easeInOutQuart: function(e) {
                        return e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e
                    },
                    easeInQuint: Z,
                    easeInOutQuint: ee
                },
                ne = function(e, t, n, a, r) {
                    var i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : q,
                        o = arguments.length > 6 && void 0 !== arguments[6] && arguments[6],
                        c = a + (i = "string" === typeof i || i instanceof String ? te(i) : i)((r - a) / (n - t)) * (e - t);
                    if (o) {
                        var s = Math.min(a, r),
                            u = Math.max(a, r);
                        c = Y(c, s, u)
                    }
                    return c
                },
                ae = n(24),
                re = n(32),
                ie = n(16),
                oe = n(87),
                ce = Object(ae.a)((function(e) {
                    var t = {
                            browsing: T.MOBILE ? 6.1 : 5.5,
                            activeVideo: T.MOBILE ? 3.5 : 2.2,
                            activeAudio: T.MOBILE ? 1.9 : 2.2,
                            dragging: T.MOBILE ? 2.5 : 10,
                            initial: -24
                        },
                        n = V(),
                        a = Object(o.useRef)(),
                        r = Object(ie.i)().setDefaultCamera;
                    Object(o.useLayoutEffect)((function() {
                        return r(a.current)
                    }), [r]);
                    var i = Object(o.useRef)({
                            x: .33,
                            y: .5
                        }),
                        s = {
                            active: {
                                precision: 1e-4,
                                mass: 1,
                                tension: 100,
                                friction: 40
                            },
                            browsing: {
                                precision: 1e-4,
                                mass: 1,
                                tension: 200,
                                friction: 40
                            }
                        },
                        u = Object(re.d)((function() {
                            return Object(H.a)(Object(H.a)({}, i.current), {}, {
                                config: s.browsing
                            })
                        })),
                        l = Object(R.a)(u, 2),
                        f = l[0],
                        m = l[1],
                        d = Object(re.d)((function() {
                            return {
                                x: 0,
                                y: 0,
                                config: {
                                    precision: 1e-4,
                                    mass: 1,
                                    tension: 400,
                                    friction: 50
                                }
                            }
                        })),
                        p = Object(R.a)(d, 2),
                        v = p[0],
                        g = p[1],
                        h = Object(re.d)((function() {
                            return {
                                strength: 0,
                                config: {
                                    precision: 1e-4,
                                    mass: 1,
                                    tension: 10,
                                    friction: 10
                                }
                            }
                        })),
                        b = Object(R.a)(h, 2),
                        A = b[0],
                        y = b[1],
                        O = Object(re.d)((function() {
                            return {
                                z: t.initial,
                                config: {
                                    precision: 1e-4,
                                    mass: 1,
                                    tension: 300,
                                    friction: 120
                                }
                            }
                        })),
                        x = Object(R.a)(O, 2),
                        E = x[0],
                        w = x[1],
                        j = Object(re.d)((function() {
                            return {
                                z: -.15 * Math.PI,
                                config: {
                                    precision: .001,
                                    mass: 1,
                                    tension: 20,
                                    friction: 20
                                }
                            }
                        })),
                        I = Object(R.a)(j, 2),
                        S = I[0],
                        M = I[1],
                        k = Object(oe.a)((function(e) {
                            if (n.isDragging !== e.dragging && n.setIsDragging(e.dragging), !n.activeId && e.dragging) {
                                n.hasDragged || n.setHasDragged(!0);
                                var a = e.delta,
                                    r = D({
                                        x: a[0],
                                        y: a[1]
                                    });
                                i.current.x += -15 * r.x, i.current.y += 15 * r.y;
                                var o = n.cameraBounds,
                                    c = {
                                        top: 0,
                                        bottom: 9,
                                        left: 9,
                                        right: 9
                                    };
                                i.current.x < o.min.x - c.left && (i.current.x = o.min.x - c.left), i.current.x > o.max.x + c.right && (i.current.x = o.max.x + c.right), i.current.y > o.max.y + c.top && (i.current.y = o.max.y + c.top), i.current.y < o.min.y - c.bottom && (i.current.y = o.min.y - c.bottom);
                                var u = {
                                    top: -4,
                                    bottom: 4,
                                    left: 3,
                                    right: 3
                                };
                                i.current.x < o.min.x - u.left || i.current.x > o.max.x + u.right || i.current.y > o.max.y + u.top || i.current.y < o.min.y - u.bottom ? n.showHomeCursor || n.setShowHomeCursor(!0) : n.showHomeCursor && n.setShowHomeCursor(!1);
                                var l = {
                                    x: i.current.x,
                                    y: i.current.y
                                };
                                m(Object(H.a)(Object(H.a)({}, l), {}, {
                                    config: s.browsing,
                                    reset: !1
                                })), w({
                                    z: ne(e.velocity, 0, 3, t.browsing, t.dragging)
                                })
                            } else n.activeId || e.dragging || w({
                                z: t.browsing
                            });
                            Math.sqrt(Math.pow(f.x.value, 2) + Math.pow(f.y.value, 2)) > 2 ? n.showUI || n.setShowUI(!0) : n.showUI && n.setShowUI(!1)
                        }), {
                            domTarget: document.body,
                            filterTaps: !0
                        }),
                        C = Object(oe.b)((function(e) {
                            if (!e.dragging && n.appReady) {
                                var t = e.xy,
                                    a = D({
                                        x: t[0],
                                        y: t[1]
                                    }, !0);
                                a.x *= .5, a.y *= -.5, g(a)
                            }
                        }), {
                            domTarget: window,
                            filterTaps: !0
                        });
                    Object(o.useEffect)((function() {
                        k(), T.MOBILE || C()
                    }), [k, C]), Object(o.useEffect)((function() {
                        if (!0 === n.appReady) {
                            var e = 0;
                            e = n.activeId ? "video" === n.activeItemType ? t.activeVideo : t.activeAudio : t.browsing, setTimeout((function() {
                                m(Object(H.a)(Object(H.a)({}, n.activePosition), {}, {
                                    reset: !0
                                })), M({
                                    z: 0
                                }), w({
                                    z: e
                                })
                            }), 600)
                        }
                    }), [n.appReady]), Object(o.useEffect)((function() {
                        n.activeId ? y({
                            strength: .15
                        }) : y({
                            strength: 1
                        })
                    }), [n.activeId]), Object(o.useEffect)((function() {
                        n.activeId ? (i.current = Object(H.a)({}, n.activePosition), setTimeout((function() {
                            m(Object(H.a)(Object(H.a)({}, n.activePosition), {}, {
                                config: s.active,
                                reset: !1
                            })), w({
                                z: "audio" === n.activeItemType ? t.activeAudio : t.activeVideo,
                                delay: 0,
                                config: {
                                    mass: 1,
                                    tension: 40,
                                    friction: 30
                                }
                            })
                        }), 1)) : n.appReady && w({
                            z: t.browsing,
                            config: {
                                mass: 1,
                                tension: 300,
                                friction: 120
                            }
                        })
                    }), [n.activeId, n.activePosition]), Object(o.useEffect)((function() {
                        n.requestHome && (i.current = {
                            x: .33,
                            y: .5
                        }, m(i.current), n.setRequestHome(!1), n.setShowHomeCursor(!1), n.showUI && n.setShowUI(!1))
                    }), [n.requestHome]);
                    var D = Object(o.useCallback)((function(e, t) {
                        var n = e.x,
                            a = e.y,
                            r = {
                                x: n / document.body.clientWidth,
                                y: a / document.body.clientHeight
                            };
                        return t && (r.x = ne(r.x, 0, 1, -1, 1), r.y = ne(r.y, 0, 1, -1, 1)), r
                    }), [document.body.clientWidth, document.body.clientHeight]);
                    return c.a.createElement(re.a.perspectiveCamera, {
                        ref: a,
                        "position-x": Object(re.c)([f.x, v.x, A.strength], (function(e, t, n) {
                            return e + t * n
                        })),
                        "position-y": Object(re.c)([f.y, v.y, A.strength], (function(e, t, n) {
                            return e + t * n
                        })),
                        "position-z": E.z,
                        "rotation-z": S.z
                    })
                })),
                se = n(18),
                ue = n(20),
                le = n(19);

            function fe() {
                var e = Object(se.a)(['\n  position: absolute;\n  display: inline-block;\n  transform-origin: left center;\n  border-radius: 100px;\n  background-color: #000;\n  font-family: "Neue Machina", sans-serif;\n  font-weight: bold;\n  font-size: 1.2em;\n  color: #fff;\n  opacity: 0;\n  overflow: hidden;\n  user-select: none;\n  pointer-events: none;\n  /* display: none; */\n\n  .message {\n    padding: 10px 25px;\n  }\n\n  .location {\n    font-weight: normal;\n  }\n']);
                return fe = function() {
                    return e
                }, e
            }
            var me = Object(le.a)(ue.a.div)(fe()),
                de = function(e) {
                    var t = Object(ue.c)((function() {
                            return {
                                opacity: 0
                            }
                        })),
                        n = Object(R.a)(t, 2),
                        a = n[0],
                        r = n[1],
                        i = Object(ue.c)((function() {
                            return {
                                translateX: 0,
                                distanceX: 30,
                                config: {
                                    mass: 1,
                                    tension: 90,
                                    friction: 25
                                }
                            }
                        })),
                        s = Object(R.a)(i, 2),
                        u = s[0],
                        l = s[1];
                    return Object(o.useEffect)((function() {
                        e.moveLeft ? l({
                            translateX: -100,
                            distanceX: -30
                        }) : l({
                            translateX: 0,
                            distanceX: 30
                        })
                    }), [e.moveLeft]), Object(o.useEffect)((function() {
                        switch (e.animate) {
                            case "in":
                                r({
                                    opacity: 1,
                                    delay: e.animationDelay,
                                    config: {
                                        duration: 200,
                                        easing: $
                                    }
                                });
                                break;
                            case "out":
                                r({
                                    opacity: 0,
                                    delay: 0,
                                    config: {
                                        duration: 300,
                                        easing: Z
                                    }
                                })
                        }
                    }), [e.animate]), c.a.createElement(me, {
                        style: {
                            opacity: a.opacity,
                            transform: Object(ue.b)([u.translateX, u.distanceX], (function(e, t) {
                                return "translateX(".concat(e, "%) translateX(").concat(t, "px) translateY(-50%)")
                            }))
                        }
                    }, c.a.createElement("div", {
                        className: "message"
                    }, e.children))
                },
                pe = function(e) {
                    var t = e.className,
                        n = void 0 === t ? "" : t,
                        a = Object(o.useMemo)((function() {
                            return e.children.toString().split(" ")
                        }), [e.children]),
                        r = Object(ue.d)(a.length, (function(e) {
                            return {
                                opacity: 0,
                                config: {
                                    mass: 1,
                                    friction: 25,
                                    tension: 150
                                }
                            }
                        })),
                        i = Object(R.a)(r, 2),
                        s = i[0],
                        u = i[1];
                    return Object(o.useEffect)((function() {
                        "in" == e.animate ? u({
                            delay: 600,
                            opacity: 1
                        }) : u({
                            opacity: 0
                        })
                    }), [e.animate]), c.a.createElement("span", {
                        className: n
                    }, s.map((function(e, t) {
                        return c.a.createElement(ue.a.span, {
                            key: t,
                            style: e
                        }, "".concat(a[t], " "))
                    })))
                };

            function ve() {
                return (ve = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
                    }
                    return e
                }).apply(this, arguments)
            }
            var ge = ({
                styles: e = {},
                ...t
            }) => c.a.createElement("svg", ve({
                "data-name": "Layer 1",
                xmlns: "http://www.w3.org/2000/svg",
                width: "25.21",
                height: "20.44"
            }, t), c.a.createElement("path", {
                d: "M20.62 9.47h2.13v9.14a1.83 1.83 0 01-1.83 1.83H4.27a1.82 1.82 0 01-1.82-1.83v-8.08h-.61A1.83 1.83 0 01.28 7.74v-.07l5.07-7 1.74 1.29",
                "data-name": "Layer 3"
            }), c.a.createElement("path", {
                d: "M23.37 10.53H9.94a1.83 1.83 0 01-1.67-1.06L5.15 2.59A1.85 1.85 0 016.07.16a1.9 1.9 0 01.77-.2h12.3a1.82 1.82 0 011.55.87l4.25 6.9a1.82 1.82 0 01-1.56 2.78z",
                "data-name": "Layer 5"
            }), c.a.createElement("path", {
                fill: "#fff",
                d: "M22.84 8.4l-3.86-6.28H7.28L10.1 8.4h12.74z"
            }));

            function he() {
                var e = Object(se.a)(["\n  display: block;\n  opacity: 0;\n  -webkit-tap-highlight-color: transparent;\n\n  circle.svg-circle-bg {\n    fill: #fff;\n  }\n\n  circle.svg-circle-thin {\n    fill: none;\n    stroke: #000;\n  }\n"]);
                return he = function() {
                    return e
                }, e
            }

            function be() {
                var e = Object(se.a)(['\n  position: absolute;\n  font-weight: normal;\n  user-select: none;\n  pointer-events: auto;\n  cursor: pointer;\n  display: none;\n\n  div.container {\n    display: flex;\n    align-items: center;\n    transform: translate(-30px, -50%);\n\n    @media (max-width: 768px) {\n      transform: none;\n    }\n\n    .cta {\n      font-family: "Neue Machina";\n      font-size: 1.2rem;\n      white-space: pre;\n      margin-left: 10px;\n\n      @media (max-width: 768px) {\n        font-size: 0.8rem;\n      }\n    }\n  }\n']);
                return be = function() {
                    return e
                }, e
            }
            var Ae = Object(ue.a)(le.a.div(be())),
                ye = Object(le.a)(ue.a.svg)(he()),
                Oe = function(e) {
                    var t = V(),
                        n = Object(ue.c)((function() {
                            return {
                                opacity: 0,
                                config: {
                                    duration: 200
                                },
                                delay: 50
                            }
                        })),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1],
                        s = Object(ue.c)((function() {
                            return {
                                radius: 0,
                                config: {
                                    duration: 500
                                }
                            }
                        })),
                        u = Object(R.a)(s, 2),
                        l = u[0],
                        f = u[1];
                    return Object(o.useEffect)((function() {
                        switch (e.animate) {
                            case "in":
                                i({
                                    opacity: 1,
                                    delay: 1500
                                }), f({
                                    radius: 28,
                                    delay: 1500
                                });
                                break;
                            case "out":
                                i({
                                    opacity: 0,
                                    delay: 0
                                }), f({
                                    radius: 0,
                                    delay: 0
                                })
                        }
                    }), [e.animate]), c.a.createElement(Ae, {
                        style: {
                            display: r.opacity && r.opacity.interpolate((function(e) {
                                return e > 0 ? "block" : "none"
                            }))
                        }
                    }, c.a.createElement("div", {
                        onClick: function() {
                            t.setRequestHome(!0)
                        },
                        className: "container"
                    }, c.a.createElement(ye, {
                        width: 60,
                        height: 60,
                        style: r
                    }, c.a.createElement(ue.a.circle, {
                        className: "svg-circle-bg",
                        cx: 30,
                        cy: 30,
                        r: l.radius,
                        strokeWidth: 0
                    }), c.a.createElement("circle", {
                        className: "svg-circle-thin",
                        cx: 30,
                        cy: 30,
                        r: 23,
                        strokeWidth: 1
                    }), c.a.createElement(ge, {
                        x: 18,
                        y: 20
                    })), c.a.createElement("div", {
                        className: "cta"
                    }, c.a.createElement(pe, {
                        animate: e.animate
                    }, "Başlangıca Dön."))))
                },
                xe = n(149),
                Ee = n(17),
                we = function() {
                    return T.IS_DX_INTEL_GPU ? 0 : T.IS_INTEL_GPU ? 1 : 2
                },
                je = 0,
                Ie = 2,
                Se = n(92),
                Me = n.n(Se),
                ke = n(40),
                Ce = n.n(ke),
                De = new WeakMap,
                Le = function() {
                    function e() {
                        Object(U.a)(this, e), window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext, this.context = new AudioContext
                    }
                    return Object(z.a)(e, [{
                        key: "setEl",
                        value: function(e) {
                            if (e != this.el) {
                                var t = this.context,
                                    n = {
                                        source: function(e, t) {
                                            if (De.has(e)) return De.get(e);
                                            var n = t.createMediaElementSource(e);
                                            return De.set(e, n), n
                                        }(e, this.context),
                                        analyser: t.createAnalyser()
                                    },
                                    a = n.analyser.frequencyBinCount;
                                this.dataArray = new Uint8Array(a), n.source.connect(n.analyser), n.source.connect(t.destination), this.nodes = n, this.el = e
                            }
                        }
                    }, {
                        key: "release",
                        value: function() {
                            console.log("release");
                            var e = this.nodes;
                            e.source.disconnect(), e.analyser.disconnect()
                        }
                    }, {
                        key: "resume",
                        value: function() {
                            this.context && this.context.resume()
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            if (this.context) {
                                var e = this.nodes,
                                    t = this.context;
                                e.source.disconnect(), e.analyser.disconnect(), t.destination.disconnect(), t.close().then((function() {})), this.nodes = this.context = null
                            }
                            this.el = null
                        }
                    }, {
                        key: "audioData",
                        get: function() {
                            return this.context ? (this.nodes.analyser.getByteFrequencyData(this.dataArray), Array.from(this.dataArray).map((function(e) {
                                return e / 128
                            }))) : [0, 0]
                        }
                    }]), e
                }(),
                Pe = function() {
                    function e() {
                        Object(U.a)(this, e), this.step = 0, this.map = function(e, t, n, a) {
                            var r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : q,
                                i = arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
                            return function(o) {
                                return ne(o, e, t, n, a, r, i)
                            }
                        }(-1, 1, 0, 1)
                    }
                    return Object(z.a)(e, [{
                        key: "setEl",
                        value: function() {
                            var e = this,
                                t = new ke.Chance;
                            this.step = 1e3 * Math.random();
                            this.params = {}, ["wave1", "wave2", "wave3"].forEach((function(n) {
                                e.params[n] = {
                                    size: t.floating({
                                        min: .1,
                                        max: 2
                                    }),
                                    stepFactor: t.floating({
                                        min: .05,
                                        max: .15
                                    }),
                                    stepOffset: t.integer({
                                        min: 1,
                                        max: 1e3
                                    })
                                }
                            }))
                        }
                    }, {
                        key: "resume",
                        value: function() {}
                    }, {
                        key: "destroy",
                        value: function() {}
                    }, {
                        key: "audioData",
                        get: function() {
                            var e = this,
                                t = new Array(1024).fill(null);
                            return t = t.map((function(t, n) {
                                return .5 * e.map(Math.sin(.1 * n + .1 * e.step + 7)) + .1 * e.map(Math.sin(.25 * n + .05 * e.step + 6.1)) + .3 * e.map(Math.cos(3 * n + .15 * e.step + 1.4))
                            })), this.step++, t
                        }
                    }]), e
                }(),
                Be = new(T.WEBAUDIO_AVAILABLE ? Le : Pe),
                Te = Me()((function(e, t) {
                    var n = !1,
                        a = "none",
                        r = document.createElement(t);
                    r.src = "video" === t ? "videos/".concat(e, "-").concat(we() <= je || T.MOBILE ? "512" : "1024", ".mp4") : "audio/".concat(e, ".mp3"), "video" === t && (r.playsInline = !0), r.preload = "none";
                    return [r, function() {
                        n || (Be.resume(), r.muted = !1, r.play().then((function() {
                            a = "success", n = !0
                        })).catch((function(e) {
                            a = "success-muted", n = !0, r.muted = !0, r.play().catch((function() {
                                a = "failed", n = !1
                            }))
                        })))
                    }, function() {
                        n && (n = !1, r.pause())
                    }, function(e) {
                        r.currentTime = e
                    }, function() {
                        r.muted = !1, a = "success"
                    }, function() {
                        return !r || r.muted
                    }, function() {
                        return a
                    }]
                })),
                Re = function(e, t) {
                    var n = Te(e, t);
                    return Object(Ee.a)(n)
                };

            function He() {
                return (He = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
                    }
                    return e
                }).apply(this, arguments)
            }
            var Ne = ({
                styles: e = {},
                ...t
            }) => c.a.createElement("svg", He({
                xmlns: "http://www.w3.org/2000/svg",
                width: "48.13",
                height: "48.13"
            }, t), c.a.createElement("g", {
                "data-name": "Layer 2"
            }, c.a.createElement("path", {
                d: "M29.89 22L47.35 4.63a2.68 2.68 0 000-3.79 2.67 2.67 0 00-3.77 0L26.12 18.25a2.9 2.9 0 01-4.09 0L4.63.79A2.68 2.68 0 00.84.78a2.67 2.67 0 000 3.77L18.25 22a2.9 2.9 0 010 4.09L.79 43.5a2.68 2.68 0 000 3.79 2.67 2.67 0 003.77 0L22 29.88a2.9 2.9 0 014.09 0L43.5 47.35a2.68 2.68 0 003.79 0 2.67 2.67 0 000-3.77L29.88 26.12a2.9 2.9 0 01.01-4.12z",
                fill: "#fff",
                fillRule: "evenodd",
                "data-name": "cross alt"
            })));

            function Ue() {
                return (Ue = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
                    }
                    return e
                }).apply(this, arguments)
            }
            var ze = ({
                styles: e = {},
                ...t
            }) => c.a.createElement("svg", Ue({
                xmlns: "http://www.w3.org/2000/svg",
                width: "38.16",
                height: "44.07"
            }, t), c.a.createElement("path", {
                d: "M35.01 24.04L5.57 41.74a2.36 2.36 0 01-3.57-2V4.37a2.36 2.36 0 013.57-2l29.44 17.67a2.35 2.35 0 010 4z",
                fill: "none",
                stroke: "#fff",
                strokeMiterlimit: "10",
                strokeWidth: "4"
            }));

            function Qe() {
                return (Qe = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
                    }
                    return e
                }).apply(this, arguments)
            }
            var Xe = ({
                styles: e = {},
                ...t
            }) => c.a.createElement("svg", Qe({
                xmlns: "http://www.w3.org/2000/svg",
                width: "49",
                height: "49"
            }, t), c.a.createElement("g", {
                fill: "#fff",
                "data-name": "Layer 2"
            }, c.a.createElement("path", {
                d: "M6 37.35l3.71-3.7h-2.2a.23.23 0 01-.23-.24v-16.6a.23.23 0 01.23-.23h7.79L33 5.43a.22.22 0 01.24 0 .2.2 0 01.13.2V10l4-4v-.37a4.24 4.24 0 00-6.5-3.58L14.14 12.58H7.51a4.24 4.24 0 00-4.23 4.23v16.6A4.23 4.23 0 006 37.35zM33.34 44.59a.22.22 0 01-.13.21.21.21 0 01-.24 0L18.8 35.86l-2.9 2.9 14.94 9.42a4.24 4.24 0 006.5-3.59V17.32l-4 4zM48.41.59a2 2 0 00-2.83 0l-45 45a2 2 0 000 2.82 2 2 0 002.82 0l45-45a2 2 0 00.01-2.82z"
            })));

            function We() {
                var e = Object(se.a)(["\n  position: absolute;\n  display: block;\n  left: 0;\n  top: 0;\n  transform: translate(-50%, -50%);\n  opacity: 0;\n  cursor: pointer;\n  pointer-events: auto;\n  display: none;\n  -webkit-tap-highlight-color: transparent;\n\n  circle.svg-circle-bg {\n    fill: #000;\n  }\n\n  circle.svg-circle-thin {\n    fill: none;\n    stroke: #fff;\n    transform-origin: center;\n    transform: rotate(-90deg);\n  }\n\n  circle.svg-circle-thick {\n    stroke: #fff;\n    fill: none;\n    stroke-linecap: round;\n    transform-origin: center;\n    transform: rotate(-90deg);\n    transition: stroke-dashoffset 400ms ease-in-out;\n  }\n\n  svg {\n    path {\n      transform: ", ";\n    }\n  }\n"]);
                return We = function() {
                    return e
                }, e
            }
            var Fe = Object(le.a)(ue.a.svg)(We(), (function(e) {
                    return e.ismobile ? "scale(0.6, 0.6)" : "scale(1, 1)"
                })),
                Ve = Object(ae.a)((function(e) {
                    var t = Object(xe.c)(),
                        n = V(),
                        a = Object(o.useMemo)((function() {
                            var t = e.isMobile ? 80 : 110,
                                n = e.isMobile ? 5 : 7,
                                a = t / 2 - n / 2,
                                r = a - 8;
                            return [t, n, t / 2, a, 2 * Math.PI * a, r, 2 * Math.PI * r]
                        }), []),
                        r = Object(R.a)(a, 7),
                        i = r[0],
                        s = r[1],
                        u = r[2],
                        l = r[3],
                        f = r[4],
                        m = r[5],
                        d = r[6],
                        p = Object(ue.c)((function() {
                            return {
                                opacity: 0,
                                config: {
                                    duration: 200
                                },
                                delay: 200
                            }
                        })),
                        v = Object(R.a)(p, 2),
                        g = v[0],
                        h = v[1],
                        b = Object(ue.c)((function() {
                            return {
                                radius: l,
                                config: {
                                    duration: 500
                                }
                            }
                        })),
                        A = Object(R.a)(b, 2),
                        y = A[0],
                        O = A[1],
                        x = Object(ue.c)((function() {
                            return {
                                percent: 0,
                                config: {
                                    duration: 500
                                }
                            }
                        })),
                        E = Object(R.a)(x, 2),
                        w = E[0],
                        j = E[1],
                        I = Re(e.contentId, n.activeItemType),
                        S = Object(R.a)(I, 7),
                        M = (S[0], S[1]),
                        k = (S[2], S[3], S[4]),
                        C = (S[5], S[6]),
                        D = Object(o.useState)(),
                        L = Object(R.a)(D, 2),
                        P = L[0],
                        B = L[1];
                    Object(o.useEffect)((function() {
                        n.activeId && B(C())
                    }), [C(), n.activeId]);
                    Object(o.useEffect)((function() {
                        switch (e.animate) {
                            case "in":
                                h({
                                    opacity: 1,
                                    delay: 750
                                }), O({
                                    radius: l,
                                    delay: 750
                                }), j({
                                    from: {
                                        percent: 0
                                    },
                                    percent: 1,
                                    delay: 1200
                                });
                                break;
                            case "out":
                                h({
                                    opacity: 0,
                                    delay: 0
                                }), O({
                                    radius: 0,
                                    delay: 0
                                }), j({
                                    percent: 0,
                                    delay: 300
                                })
                        }
                    }), [e.animate]);
                    var T = Object(o.useMemo)((function() {
                        return ne(e.progress, 0, 1, d, 0) || d
                    }), [f, e.progress]);
                    return c.a.createElement(c.a.Fragment, null, c.a.createElement(Fe, {
                        ismobile: !!e.isMobile || void 0,
                        onClick: function() {
                            ! function() {
                                switch (C()) {
                                    case "success":
                                        t.push("");
                                        break;
                                    case "success-muted":
                                        k();
                                        break;
                                    case "failed":
                                    case "none":
                                        M()
                                }
                            }()
                        },
                        width: i,
                        height: i,
                        style: {
                            opacity: g.opacity,
                            display: g.opacity && g.opacity.interpolate((function(e) {
                                return e > 0 ? "block" : "none"
                            }))
                        }
                    }, c.a.createElement(ue.a.circle, {
                        className: "svg-circle-bg",
                        cx: u,
                        cy: u,
                        r: y.radius,
                        strokeWidth: 0
                    }), c.a.createElement(ue.a.circle, {
                        className: "svg-circle-thin",
                        cx: u,
                        cy: u,
                        r: m,
                        strokeWidth: 1,
                        strokeDasharray: d,
                        strokeDashoffset: w.percent.interpolate((function(e) {
                            return d * (1 - e)
                        }))
                    }), c.a.createElement("circle", {
                        className: "svg-circle-thick",
                        cx: u,
                        cy: u,
                        r: m,
                        strokeWidth: s,
                        strokeDasharray: d,
                        strokeDashoffset: T
                    }), function() {
                        switch (P) {
                            case "success":
                                return c.a.createElement(Ne, {
                                    x: e.isMobile ? 26 : 31,
                                    y: e.isMobile ? 26 : 31
                                });
                            case "success-muted":
                                return c.a.createElement(Xe, {
                                    x: e.isMobile ? 26 : 31,
                                    y: e.isMobile ? 26 : 31
                                });
                            case "failed":
                            case "none":
                                return c.a.createElement(ze, {
                                    x: e.isMobile ? 30 : 40,
                                    y: e.isMobile ? 26 : 33
                                })
                        }
                    }()))
                }));

            function Ge() {
                var e = Object(se.a)(["\n  position: fixed;\n  z-index: 997;\n  pointer-events: none;\n  width: 100%;\n  height: 100%;\n"]);
                return Ge = function() {
                    return e
                }, e
            }
            var Ye = Object(le.a)(ue.a.div)(Ge()),
                _e = function(e, t) {
                    return "translate(".concat(e, "px,").concat(t, "px)")
                },
                qe = Object(ae.a)((function() {
                    var e = V(),
                        t = Object(o.useRef)(),
                        n = Object(o.useState)(c.a.createElement("span", null, "Keşfetmek İçin Kaydır.")),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1],
                        s = Object(o.useState)(0),
                        u = Object(R.a)(s, 2),
                        l = u[0],
                        f = u[1],
                        m = Object(o.useState)(!1),
                        d = Object(R.a)(m, 2),
                        p = d[0],
                        v = d[1],
                        g = Object(o.useState)(!1),
                        h = Object(R.a)(g, 2),
                        b = h[0],
                        A = h[1],
                        y = Object(o.useState)(!1),
                        O = Object(R.a)(y, 2),
                        x = O[0],
                        E = O[1],
                        w = Object(o.useState)(!1),
                        j = Object(R.a)(w, 2),
                        I = j[0],
                        S = j[1],
                        M = Object(o.useState)(!1),
                        k = Object(R.a)(M, 2),
                        C = k[0],
                        D = k[1],
                        L = Object(o.useState)(!1),
                        P = Object(R.a)(L, 2),
                        B = P[0],
                        H = P[1],
                        N = Object(ue.c)((function() {
                            return {
                                xy: [0, 0],
                                config: {
                                    mass: 1,
                                    tension: 500,
                                    friction: 50
                                }
                            }
                        })),
                        U = Object(R.a)(N, 2),
                        z = U[0],
                        Q = U[1];
                    Object(o.useEffect)((function() {
                        var e = 0,
                            t = function(t) {
                                !b && e < 15 ? e++ : e >= 15 && A(!0), T.MOBILE || (Q({
                                    xy: [t.clientX, t.clientY > 100 ? t.clientY : 100]
                                }), E(t.clientY < 100), v(window.innerWidth - t.clientX <= 150))
                            };
                        return document.addEventListener("mousemove", t),
                            function() {
                                document.removeEventListener("mousemove", t)
                            }
                    }), []), Object(o.useEffect)((function() {
                        if (e.hasDragged && e.hoverId) {
                            var t = Object(X.toJS)(e.hoverItem);
                            if (!t) return;
                            f(800), i(c.a.createElement(c.a.Fragment, null, c.a.createElement("span", {
                                className: "name"
                            }, t.text.name), c.a.createElement("span", {
                                className: "location"
                            }, " \u2014 ", t.text.location)))
                        }
                    }), [e.hoverId]);
                    var W = Object(o.useRef)();
                    return Object(o.useEffect)((function() {
                        clearTimeout(W.current), T.MOBILE ? S(!1) : !b || e.hasDragged || e.activeId ? !e.hoverId || e.isDragging || e.activeId ? e.hoverId || e.isDragging || e.activeId ? e.hasDragged || e.activeId ? S(!1) : (H(!1), S(!1), D(!1)) : W.current = setTimeout((function() {
                            e.hoverId || S(!1)
                        }), 300) : (W.current = setTimeout((function() {
                            e.hoverId && S(!0)
                        }), 300), H(!1)) : (S(!0), H(!1))
                    }), [b, e.hasDragged, e.activeId, e.hoverId, e.isDragging]), Object(o.useEffect)((function() {
                        e.activeId ? T.MOBILE ? (t.current.style.top = "calc(100% - 60px)", t.current.style.left = "video" === e.activeItemType ? "70px" : "50%", D(!0)) : D(!x) : D(!1)
                    }), [e.activeId, x]), Object(o.useEffect)((function() {
                        !e.showHomeCursor || e.isDragging || I ? e.showHomeCursor || H(!1) : (H(!0), T.MOBILE && (t.current.style.top = "calc(50% - 30px)", t.current.style.left = "calc(50% - 110px)"), S(!1))
                    }), [e.isDragging, e.showHomeCursor, I]), Object(o.useEffect)((function() {
                        e.isDragging && (H(!1), S(!1), D(!!e.activeId))
                    }), [e.isDragging]), c.a.createElement(Ye, {
                        ref: t,
                        style: {
                            transform: z.xy.interpolate(_e)
                        }
                    }, c.a.createElement(de, {
                        animationDelay: l,
                        animate: I ? "in" : "out",
                        moveLeft: p
                    }, r), c.a.createElement(Ve, {
                        contentId: e.activeId,
                        autoplay: e.autoplay,
                        progress: e.mediaProgress,
                        animate: C ? "in" : "out",
                        isMobile: T.MOBILE
                    }), c.a.createElement(Oe, {
                        animationDelay: l,
                        animate: B ? "in" : "out"
                    }))
                })),
                Je = c.a.forwardRef((function(e, t) {
                    var n = e.children,
                        a = e.styles,
                        r = e.className,
                        i = e.prepend,
                        s = e.portal,
                        l = Object(ie.i)().gl,
                        f = Object(o.useState)((function() {
                            return document.createElement("div")
                        })),
                        m = Object(R.a)(f, 1)[0],
                        d = Object(o.useRef)(null),
                        p = s && s.current || l.domElement.parentNode;
                    return Object(o.useEffect)((function() {
                        if (d.current) return p && (i ? p.prepend(m) : p.appendChild(m)),
                            function() {
                                p && p.removeChild(m), u.a.unmountComponentAtNode(m)
                            }
                    }), [p]), Object(o.useEffect)((function() {
                        u.a.render(c.a.createElement("div", {
                            ref: t,
                            style: a,
                            className: r,
                            children: n
                        }), m)
                    })), c.a.createElement("group", {
                        ref: d
                    })
                })),
                Ke = n(36),
                Ze = n(42),
                $e = n(25),
                et = n(26),
                tt = n(14),
                nt = n(113),
                at = n.n(nt),
                rt = function(e) {
                    Object($e.a)(n, e);
                    var t = Object(et.a)(n);

                    function n(e) {
                        Object(U.a)(this, n);
                        var a = new Map;
                        return e.useEdgeDither && a.set("USE_EDGE_DITHER", "1"), t.call(this, "BarrelEffect", at.a, {
                            defines: a,
                            uniforms: new Map([
                                ["strength", new tt.Uniform(e.strength)]
                            ])
                        })
                    }
                    return Object(z.a)(n, [{
                        key: "strength",
                        set: function(e) {
                            this.uniforms.get("strength").value = e
                        },
                        get: function() {
                            return this.uniforms.get("strength").value
                        }
                    }]), n
                }(Ze.d),
                it = n(115),
                ot = n.n(it),
                ct = function(e) {
                    Object($e.a)(n, e);
                    var t = Object(et.a)(n);

                    function n(e) {
                        return Object(U.a)(this, n), t.call(this, "ColorVignetteEffect", ot.a, {
                            uniforms: new Map([
                                ["strength", new tt.Uniform(e.strength)]
                            ])
                        })
                    }
                    return Object(z.a)(n, [{
                        key: "strength",
                        set: function(e) {
                            this.uniforms.get("strength").value = e
                        },
                        get: function() {
                            return this.uniforms.get("strength").value
                        }
                    }]), n
                }(Ze.d);
            Object(ie.e)({
                EffectComposer: Ze.e,
                RenderPass: Ze.i,
                EffectPass: Ze.f,
                ColorVignetteEffect: ct
            });
            var st = Object(re.a)((function(e) {
                    var t = Object(ie.i)(),
                        n = t.gl,
                        a = t.scene,
                        r = t.camera,
                        i = t.size,
                        c = Object(o.useMemo)((function() {
                            var e = new Ze.e(n);
                            e.addPass(new Ze.i(a, r));
                            var t, i, o = [];
                            if ((t = new rt({
                                    useEdgeDither: we() >= Ie,
                                    strength: 1
                                })).blendMode = new Ze.b(Ze.a.NORMAL, 1), o.push(t), we() >= Ie) {
                                var c = T.MOBILE ? {
                                    scale: 2,
                                    strength: .65
                                } : {
                                    scale: 1,
                                    strength: 1
                                };
                                (i = new ct(c)).blendMode = new Ze.b(Ze.a.SCREEN, 1), o.push(i)
                            }
                            var s = Object(Ke.a)(Ze.f, [r].concat(o));
                            return e.addPass(s), [e, t, i]
                        }), [r, n, a]),
                        s = Object(R.a)(c, 2),
                        u = s[0],
                        l = s[1];
                    return Object(o.useEffect)((function() {
                        l && (l.strength = e.barrelStrength)
                    }), [l, e.barrelStrength]), Object(o.useEffect)((function() {
                        u.setSize(i.width, i.height)
                    }), [u, i]), Object(ie.g)((function(e, t) {
                        return u.render(t)
                    }), 1)
                })),
                ut = Object(ae.a)((function() {
                    var e = V(),
                        t = T.MOBILE ? .4 : 1,
                        n = Object(re.d)((function() {
                            return {
                                barrelStrength: e.activeId ? 0 : t,
                                config: {
                                    mass: 1,
                                    tension: 40,
                                    friction: 30
                                }
                            }
                        })),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1];
                    return Object(o.useEffect)((function() {
                        T.MOBILE ? e.hasDragged && !e.activeId ? i({
                            barrelStrength: t
                        }) : i({
                            barrelStrength: 0
                        }) : i({
                            barrelStrength: e.activeId ? 0 : t
                        })
                    }), [i, e.activeId, e.hasDragged]), we() <= je ? c.a.createElement(c.a.Fragment, null) : c.a.createElement(st, r)
                })),
                lt = function() {
                    var e = V();
                    return Object(o.useEffect)((function() {
                        return document.body.style.pointerEvents = "none",
                            function() {
                                document.body.style.pointerEvents = "auto", e.setAppReady(!0)
                            }
                    }), []), c.a.createElement(c.a.Fragment, null)
                };

            function ft() {
                var e = Object(se.a)(["\n  position: fixed;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  z-index: 998;\n  mix-blend-mode: screen;\n  pointer-events: none;\n"]);
                return ft = function() {
                    return e
                }, e
            }
            var mt = le.a.div(ft()),
                dt = function(e) {
                    var t = Object(o.useRef)(),
                        n = Object(ue.c)((function() {
                            return {
                                x: window.innerWidth / 2,
                                y: window.innerHeight / 2,
                                width: 0,
                                height: 0,
                                angle: 8,
                                config: {
                                    easing: Z,
                                    duration: 2e3
                                }
                            }
                        })),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1];
                    return Object(o.useEffect)((function() {
                        e.ready && i({
                            width: Math.max(window.innerWidth, window.innerHeight) + 40,
                            height: Math.max(window.innerWidth, window.innerHeight) + 40,
                            angle: 0,
                            onRest: function(e) {
                                0 === e.angle && (t.current.style.display = "none")
                            }
                        })
                    }), [e.ready]), c.a.createElement(mt, null, c.a.createElement("svg", {
                        ref: t,
                        style: {
                            width: "100%",
                            height: "100%"
                        },
                        width: "100%",
                        height: "100%",
                        viewBox: "0 0 100% 100%",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg"
                    }, c.a.createElement("rect", {
                        x: 0,
                        y: 0,
                        width: "100%",
                        height: "100%",
                        fill: "white"
                    }), c.a.createElement("g", {
                        transform: "translate(".concat(window.innerWidth / 2, " ").concat(window.innerHeight / 2, ")")
                    }, c.a.createElement(ue.a.rect, {
                        width: r.width,
                        height: r.height,
                        fill: "black",
                        rx: "25",
                        transform: Object(ue.b)([r.angle, r.width, r.height], (function(e, t, n) {
                            return "\n              translate(".concat(-.5 * t, " ").concat(-.5 * n, ") \n              rotate(").concat(e, " ").concat(.5 * t, " ").concat(.5 * n, ")\n              ")
                        }))
                    }))))
                };

            function pt() {
                return (pt = Object.assign || function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
                    }
                    return e
                }).apply(this, arguments)
            }

            function vt() {
                var e = Object(se.a)(["\n  .spinner-circle {\n    stroke: #000;\n    fill: none;\n    stroke-linecap: round;\n    stroke-width: 1px;\n    stroke-dasharray: 20px 350px;\n    transform-origin: center center;\n    animation-name: ", ";\n    animation-duration: 0.25s;\n    animation-timing-function: linear;\n    animation-iteration-count: infinite;\n  }\n\n  .red-circle {\n    fill: rgb(173, 0, 0);\n  }\n\n  .phone {\n  }\n\n  .test {\n    border: 1px solid green;\n  }\n"]);
                return vt = function() {
                    return e
                }, e
            }

            function gt() {
                var e = Object(se.a)(["\n  0% {\n    transform: rotate(0);\n  }\n  25% {\n    transform: rotate(90deg);\n  }\n  50% {\n    transform: rotate(180deg);\n  }\n  75% {\n    transform: rotate(270deg);\n  } \n  100% {\n    transform: rotate(360deg);\n  }\n"]);
                return gt = function() {
                    return e
                }, e
            }

            function ht() {
                var e = Object(se.a)(['\n  background: transparent;\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: "Neue Machina";\n  font-weight: regular;\n  text-align: center;\n  z-index: 999;\n  pointer-events: none;\n']);
                return ht = function() {
                    return e
                }, e
            }
            var bt = Object(ue.a)(({
                    styles: e = {},
                    ...t
                }) => c.a.createElement("svg", pt({
                    "data-name": "Layer 1",
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "36.75",
                    height: "12.26"
                }, t), c.a.createElement("path", {
                    d: "M1.13 12.26H9a5.81 5.81 0 001-2.28H.19a5.66 5.66 0 00.94 2.28zM36.76 7.13a5.05 5.05 0 00-2.83-4.53C30.55 1.11 24.33.05 18.39.05S6.22 1.06 2.84 2.55A5.05 5.05 0 00.01 7.13 7.61 7.61 0 00.2 8.69h9.76a8.31 8.31 0 00.17-1.56v-.35a1.44 1.44 0 01.84-1.44 18 18 0 017.41-1.54 18 18 0 017.42 1.51 1.44 1.44 0 01.84 1.44v.35a8.31 8.31 0 00.18 1.56h9.76a7.61 7.61 0 00.18-1.53zM26.81 9.98a5.81 5.81 0 00.95 2.28h7.87a5.66 5.66 0 00.94-2.28z",
                    fillRule: "evenodd"
                }))),
                At = le.a.div(ht()),
                yt = Object(le.b)(gt()),
                Ot = Object(le.a)(ue.a.svg)(vt(), yt),
                xt = function(e) {
                    var t = Object(ue.e)(!e.ready, null, {
                            trail: 333,
                            from: {
                                opacity: 0
                            },
                            enter: {
                                opacity: 1
                            },
                            leave: {
                                opacity: 0
                            }
                        }),
                        n = Object(ue.c)((function() {
                            return {
                                r: 0,
                                fill: 0,
                                config: {
                                    duration: 100
                                }
                            }
                        })),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1];
                    return Object(o.useEffect)((function() {
                        e.ready && i({
                            r: 30,
                            fill: 1
                        })
                    }), [e.ready]), c.a.createElement(At, null, t.map((function(e) {
                        var t = e.item,
                            n = e.props,
                            a = e.key;
                        return t && c.a.createElement(ue.a.div, {
                            style: {
                                opacity: n.opacity
                            },
                            key: a,
                            className: "content"
                        }, c.a.createElement(Ot, {
                            width: 60,
                            height: 60
                        }, c.a.createElement(ue.a.circle, {
                            className: "spinner-circle",
                            cx: 30,
                            cy: 30,
                            r: 28
                        }), c.a.createElement(ue.a.circle, {
                            className: "red-circle",
                            cx: 30,
                            cy: 30,
                            r: r.r
                        }), c.a.createElement(bt, {
                            x: 12,
                            y: 22,
                            fill: r.fill.interpolate((function(e) {
                                return "rgb(".concat(255 * e, ",").concat(255 * e, ",").concat(255 * e, ")")
                            })),
                            className: "phone"
                        })))
                    })))
                },
                Et = Object(ae.a)((function() {
                    var e = V();
                    return c.a.createElement(c.a.Fragment, null, c.a.createElement(xt, {
                        ready: e.appReady
                    }), c.a.createElement(dt, {
                        ready: e.appReady
                    }))
                })),
                wt = n(117),
                jt = n.n(wt),
                It = n(118),
                St = n.n(It),
                Mt = n(119),
                kt = n.n(Mt),
                Ct = n(120),
                Dt = n.n(Ct),
                Lt = n(121),
                Pt = n.n(Lt),
                Bt = n(122),
                Tt = n.n(Bt);

            function Rt() {
                var e = Object(se.a)(['\n  display: block;\n  position: absolute;\n  bottom: 30px;\n  left: 30px;\n  z-index: 100;\n  overflow-x: hidden;\n  height: 40px;\n\n  @media (max-width: 1000px) {\n    display: none;\n  }\n\n  .content {\n    display: flex;\n    align-items: center;\n    position: absolute;\n    bottom: 0;\n    white-space: pre;\n\n    .cta {\n      font-family: "Neue Machina";\n      font-weight: normal;\n      font-size: 1.2em;\n      margin-right: 18px;\n    }\n\n    .emoji {\n      background-color: transparent;\n      width: 31px;\n      height: 31px;\n      border-radius: 200px;\n      overflow: hidden;\n      transition: background-color 0.4s;\n      margin-right: 10px;\n\n      img {\n        cursor: pointer;\n        height: 35px;\n        transform: translate(-2px, -2px);\n      }\n\n      &:hover {\n        background-color: black;\n        transition: background-color 0.005s;\n        img {\n          filter: invert(100%);\n        }\n      }\n    }\n  }\n']);
                return Rt = function() {
                    return e
                }, e
            }
            var Ht = Object(ue.a)(le.a.div(Rt())),
    Nt = function(e) {
        var t = Object(xe.c)(),
            n = V(),
            a = Object(o.useRef)(),
            r = function(e) {
                var a = new Ce.a,
                    r = [].concat(Object(Ee.a)(Object(X.toJS)(n.content.video)), Object(Ee.a)(Object(X.toJS)(n.content.audio))),
                    i = a.pickone(e),
                    o = r.filter((function(e) {
                        return e.mood.includes(i)
                    })),
                    c = a.pickone(o);
                c && (n.setCameraHintId(null), t.push(c.id))
            },
            i = Object(ue.c)((function() {
                return {
                    width: 0,
                    config: {
                        duration: 800,
                        easing: $
                    }
                }
            })),
            s = Object(R.a)(i, 2),
            u = s[0],
            l = s[1],
            f = Object(ue.c)((function() {
                return {
                    opacity: 0,
                    config: {
                        duration: 500,
                        easing: K
                    }
                }
            })),
            m = Object(R.a)(f, 2),
            d = m[0],
            p = m[1];
        return Object(o.useEffect)((function() {
            "in" == e.animate ? (l({
                width: a.current.clientWidth
            }), p({
                opacity: 1
            })) : (l({
                width: 0
            }), p({
                opacity: 0,
                delay: 100,
                config: {
                    duration: 50
                }
            }))
        }), [e.animate]), c.a.createElement(Ht, {
            style: {
                width: u.width,
                opacity: d.opacity
            }
        }, c.a.createElement("div", {
            className: "content",
            ref: a
        }));
    },
    Ut = n(123),
    zt = n.n(Ut);

            function Qt() {
                var e = Object(se.a)(["\n  overflow: hidden;\n  position: absolute;\n  height: 75px;\n  top: 30px;\n  left: 30px;\n\n  .content {\n    position: absolute;\n    top: 0;\n    display: block;\n    white-space: pre;\n\n    a {\n      -webkit-user-drag: none;\n    }\n\n    img {\n      width: 180px;\n      /* filter: invert(100%); */\n      &:hover {\n        animation-name: ", ";\n        animation-duration: 0.05s;\n        animation-timing-function: linear;\n        animation-iteration-count: infinite;\n      }\n\n      @media (max-width: 768px) {\n        width: 115px;\n      }\n    }\n  }\n"]);
                return Qt = function() {
                    return e
                }, e
            }

            function Xt() {
                var e = Object(se.a)(["\n    0% {\n      filter: invert(0%);\n    }   \n     50% {\n      filter: invert(40%);\n    }\n    100% {\n      filter: invert(0%);\n    }  \n"]);
                return Xt = function() {
                    return e
                }, e
            }
            var Wt = Object(le.b)(Xt()),
                Ft = Object(ue.a)(le.a.div(Qt(), Wt)),
                Vt = function(e) {
                    var t = Object(o.useRef)(),
                        n = Object(o.useState)(0),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1],
                        s = Object(ue.c)((function() {
                            return {
                                width: 0,
                                config: {
                                    duration: 800,
                                    easing: $
                                }
                            }
                        })),
                        u = Object(R.a)(s, 2),
                        l = u[0],
                        f = u[1],
                        m = Object(ue.c)((function() {
                            return {
                                opacity: 0,
                                config: {
                                    duration: 500,
                                    easing: K
                                }
                            }
                        })),
                        d = Object(R.a)(m, 2),
                        p = d[0],
                        v = d[1];
                    return Object(o.useEffect)((function() {
                        t.current && i(t.current.clientWidth)
                    }), []), Object(o.useLayoutEffect)((function() {
                        var e = function(e) {
                            t.current && i(t.current.clientWidth)
                        };
                        return window.addEventListener("resize", e),
                            function() {
                                window.removeEventListener("resize", e)
                            }
                    }), []), Object(o.useEffect)((function() {
                        "in" == e.animate ? (f({
                            width: r
                        }), v({
                            opacity: 1
                        })) : (f({
                            width: 0
                        }), v({
                            opacity: 0,
                            delay: 100,
                            config: {
                                duration: 100
                            }
                        }))
                    }), [e.animate, r]), c.a.createElement(Ft, {
                        style: {
                            width: l.width,
                            opacity: p.opacity
                        }
                    }, c.a.createElement("div", {
                        ref: t,
                        className: "content"
                    }, c.a.createElement("a", {
                        target: "_blank",
                        rel: "noopener noreferrer"
                    }, c.a.createElement("img", {
                        draggable: "false",
                        src: zt.a,
                        alt: "The Feed"
                    }))))
                };

            function Gt() {
                var e = Object(se.a)(['\n  position: absolute;\n  bottom: 30px;\n  right: 30px;\n  font-family: "Neue Machina", sans-serif;\n  color: #fff;\n  letter-spacing: 0px;\n  font-size: 1.2em;\n\n  @media (max-width: 768px) {\n    left: 0;\n    right: 0;\n    bottom: 15px;\n    display: flex;\n    justify-content: center;\n    font-size: 0.8em;\n  }\n\n  div {\n    white-space: pre;\n  }\n\n  div.recorder {\n    display: flex;\n    align-items: center;\n    background: #000;\n    border-radius: 100px;\n    height: 33px;\n    overflow: hidden;\n\n    div.recorder-content {\n      display: flex;\n      align-items: center;\n      position: relative;\n      right: 0;\n      @media (max-width: 768px) {\n        position: relative;\n        right: auto;\n      }\n    }\n\n    div.recorder-text {\n      padding: 0 0 0 15px;\n      height: 100%;\n    }\n\n    div.record-button-container {\n      height: 100%;\n      display: inline-block;\n      font-family: "Neue Machina", sans-serif;\n      background: white;\n      border-radius: 100px;\n      margin: 0 3px 0 5px;\n\n      &:hover {\n        animation-name: ', ";\n        animation-duration: 0.1s;\n        animation-timing-function: linear;\n        animation-iteration-count: infinite;\n      }\n\n      a {\n        text-decoration: none;\n      }\n\n      div.record-button {\n        display: flex;\n        align-items: center;\n        padding: 0 8px;\n        color: #000;\n        font-weight: bold;\n        padding-left: 2px;\n        overflow: hidden;\n        cursor: pointer;\n\n        div.record-dot {\n          background: rgb(173, 0, 0);\n          border-radius: 50%;\n          margin-left: 5px;\n          width: 13px;\n          height: 13px;\n          opacity: 0;\n          display: inline-block;\n          animation-name: ", ";\n          animation-duration: 4s;\n          animation-iteration-count: infinite;\n        }\n\n        span {\n          margin: 0px 5px;\n          margin-top: 1px;\n        }\n      }\n    }\n  }\n"]);
                return Gt = function() {
                    return e
                }, e
            }

            function Yt() {
                var e = Object(se.a)(["\n    0% {\n      background: #fff;\n    }   \n     50% {\n      background: #efefef;\n    }\n    100% {\n      background: #fff;\n    }  \n"]);
                return Yt = function() {
                    return e
                }, e
            }

            function _t() {
                var e = Object(se.a)(["\n    0% {\n      opacity: 0;\n    }\n    1% {\n      opacity: 1;\n    }\n    8% {\n      opacity: 0;\n    }\n    9% {\n      opacity: 1;\n    }\n    16% {\n      opacity: 0;\n    }\n    17% {\n      opacity: 1;\n    }\n    24% {\n      opacity: 0;\n    }\n    25% {\n      opacity: 1;\n    } \n    100% {\n      opacity: 1;\n    }\n"]);
                return _t = function() {
                    return e
                }, e
            }
            var qt = Object(le.b)(_t()),
                Jt = Object(le.b)(Yt()),
                Kt = le.a.div(Gt(), Jt, qt),
                Zt = function(e) {
                    var t = Object(o.useRef)(),
                        n = Object(o.useState)(0),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1],
                        s = Object(ue.c)((function() {
                            return {
                                width: 0,
                                config: {
                                    duration: 800,
                                    easing: $
                                }
                            }
                        })),
                        u = Object(R.a)(s, 2),
                        l = u[0],
                        f = u[1],
                        m = Object(ue.c)((function() {
                            return {
                                height: 0,
                                config: {
                                    duration: 400,
                                    easing: $
                                }
                            }
                        })),
                        d = Object(R.a)(m, 2),
                        p = d[0],
                        v = d[1],
                        g = Object(ue.c)((function() {
                            return {
                                opacity: 0,
                                config: {
                                    duration: 500,
                                    easing: K
                                }
                            }
                        })),
                        h = Object(R.a)(g, 2),
                        b = h[0],
                        A = h[1];
                    return Object(o.useLayoutEffect)((function() {
                        var e = function(e) {
                            t.current && i(t.current.clientWidth)
                        };
                        return window.addEventListener("resize", e),
                            function() {
                                window.removeEventListener("resize", e)
                            }
                    }), []), Object(o.useEffect)((function() {
                        "in" == e.animate ? (f({
                            width: r
                        }), A({
                            opacity: 1
                        }), v({
                            from: {
                                height: 0
                            },
                            delay: 500,
                            height: 27
                        })) : (f({
                            width: 0
                        }), A({
                            opacity: 0,
                            delay: 100,
                            config: {
                                duration: 100
                            }
                        }), v({
                            delay: 500,
                            height: 0
                        }))
                    }), [e.animate, r]), c.a.createElement(Kt, null, c.a.createElement(ue.a.div, {
                        style: {
                            opacity: b.opacity,
                            width: l.width.interpolate((function(e) {
                                return "".concat(e, "px")
                            }))
                        },
                        className: "recorder"
                    }, c.a.createElement("div", {
                        ref: function(e) {
                            e && (t.current = e, i(e.clientWidth))
                        },
                        className: "recorder-content"
                    }, c.a.createElement("div", {
                        className: "recorder-text"
                    }, c.a.createElement(pe, {
                        animate: e.animate
                    }, "Anlatmak ya da Eklemek İçin Ulaşın.")), c.a.createElement("div", {
                        className: "record-button-container"
                    }, c.a.createElement("a", {
                        href: "8433333"
                    }, c.a.createElement(ue.a.div, {
                        style: {
                            height: p.height.interpolate((function(e) {
                                return "".concat(e, "px")
                            }))
                        },
                        className: "record-button"
                    }, c.a.createElement("div", {
                        className: "record-dot"
                    }), c.a.createElement("span", null, "destek@sessizcigliklar.com")))))))
                },
                $t = n(124),
                en = n(125),
                tn = n.n(en),
                nn = n(126),
                an = n.n(nn);

            function rn() {
                var e = Object(se.a)(['\n  /*   display: flex;\n  align-items: center; */\n\n  /* overflow: hidden; */\n  position: absolute;\n  height: 75px;\n  top: 30px;\n  right: 30px;\n  /*   border: 1px solid red; */\n\n  .cta {\n    display: "block";\n    position: absolute;\n    top: 13px;\n    right: 125px;\n    font-family: "Neue Machina";\n    font-weight: normal;\n    font-size: 1.2em;\n    margin-right: 5px;\n    text-align: right;\n    white-space: nowrap;\n    @media (max-width: 768px) {\n      display: none;\n    }\n  }\n\n  .icon {\n    display: inline-block;\n    background-color: transparent;\n    width: 45px;\n    height: 45px;\n    border-radius: 200px;\n    overflow: hidden;\n    transition: background-color 0.4s;\n    cursor: pointer;\n\n    @media (max-width: 768px) {\n      width: 29px;\n      height: 29px;\n    }\n\n    img {\n      position: relative;\n      top: 4px;\n      left: 4px;\n      height: 37px;\n\n      @media (max-width: 768px) {\n        top: 2px;\n        left: 2px;\n        height: 25px;\n      }\n    }\n\n    &:not(:first-child) {\n      margin-left: 15px;\n      @media (max-width: 768px) {\n        margin-left: 6px;\n      }\n    }\n\n    &:hover {\n      background-color: black;\n      transition: background-color 0.005s;\n      img {\n        filter: invert(100%);\n      }\n    }\n  }\n']);
                return rn = function() {
                    return e
                }, e
            }
            var on = le.a.div(rn()),
                cn = Object(ae.a)((function() {
                    var e = V(),
                        t = function(t) {
                            var n = null;
                            e.activeId && (n = Object(X.toJS)(e.activeItem));
                            var a = n ? "Sessiz Çıglıklar - Unutulmasın Diye ".concat(n.text.name, " - ").concat(n.text.location) : "twitter.cb4ecdb8.svg";
                            "twitter" === t ? Object($t.b)({
                                url: window.location,
                                title: a
                            }) : "facebook" === t && Object($t.a)({
                                url: window.location
                            })
                        };
                    return c.a.createElement(on, null, c.a.createElement(pe, {
                        className: "cta",
                        animate: e.activeId ? "in" : "out"
                    }, "Share this story"), c.a.createElement("div", {
                        className: "icon"
                    }, c.a.createElement("img", {
                        draggable: "false",
                        src: an.a,
                        alt: "Share to Twitter",
                        onClick: function() {
                            return t("twitter")
                        }
                    })), c.a.createElement("div", {
                        className: "icon"
                    }, c.a.createElement("img", {
                        draggable: "false",
                        src: tn.a,
                        alt: "Share to Facebook",
                        onClick: function() {
                            return t("facebook")
                        }
                    })))
                }));

            function sn() {
                var e = Object(se.a)(["\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  pointer-events: none;\n  z-index: 100;\n  user-select: none;\n\n  @media (orientation: landscape) and (max-width: 1024px) {\n    display: none;\n  }\n\n  > * {\n    pointer-events: auto;\n  }\n"]);
                return sn = function() {
                    return e
                }, e
            }
            var un = Object(le.a)(ue.a.div)(sn()),
                ln = Object(ae.a)((function() {
                    var e = V(),
                        t = e.showUI && !e.activeId ? "in" : "out";
                    return c.a.createElement(un, null, c.a.createElement(Vt, {
                        animate: t
                    }), c.a.createElement(cn, null), c.a.createElement(Nt, {
                        animate: t
                    }), c.a.createElement(Zt, {
                        animate: t
                    }))
                })),
                fn = function(e) {
                    return Object(ie.h)(tt.TextureLoader, e, (function(e) {}))
                },
                mn = n(127),
                dn = n.n(mn),
                pn = function(e) {
                    var t = fn(dn.a);
                    return t && (t.wrapS = tt.RepeatWrapping, t.wrapT = tt.RepeatWrapping, t.repeat = new tt.Vector2(70, 70)), c.a.createElement("mesh", {
                        position: e.position
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [1e3, 1e3]
                    }), c.a.createElement("meshStandardMaterial", {
                        attach: "material",
                        side: tt.FrontSide,
                        flatShading: !0,
                        map: t
                    }))
                },
                vn = n(47),
                gn = n.n(vn),
                hn = n(48),
                bn = n(39),
                An = n.n(bn),
                yn = function(e) {
                    return new Promise((function(t, n) {
                        return Object(hn.preloadFont)(e, "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'\".,!?&$@\u2026\u2018\u2019\u201c\u201d:", (function() {
                                t()
                            })),
                            function() {
                                console.log("Do cleanup!")
                            }
                    }))
                },
                On = function(e) {
                    An()(yn, [e])
                },
                xn = new tt.MeshBasicMaterial({
                    depthTest: !1,
                    depthWrite: !1,
                    side: tt.FrontSide,
                    flatShading: !0
                }),
                En = function(e) {
                    var t = Object(o.useRef)(),
                        n = Object(o.useRef)();
                    On(e.font);
                    var a = Object(o.useMemo)((function() {
                        var t = new hn.TextMesh(xn),
                            n = e.color,
                            a = e.fontSize,
                            r = void 0 === a ? 1 : a,
                            i = e.lineHeight,
                            o = void 0 === i ? 1 : i,
                            c = e.textAlign,
                            s = void 0 === c ? "left" : c,
                            u = e.font,
                            l = void 0 === u ? "Arial" : u,
                            f = e.anchorX,
                            m = void 0 === f ? 0 : f,
                            d = e.anchorY,
                            p = void 0 === d ? 0 : d,
                            v = e.maxWidth,
                            g = void 0 === v ? 5 : v;
                        return t.color = n, t.fontSize = r, t.lineHeight = o, t.maxWidth = g, t.textAlign = s, t.font = l, t.anchorX = m, t.anchorY = p, t.text = e.children.toString().replace(/\\n/g, "\n"), t
                    }));
                    return Object(o.useEffect)((function() {
                        a.sync()
                    }), []), c.a.createElement("group", {
                        ref: t,
                        position: e.position,
                        renderOrder: 0
                    }, c.a.createElement("primitive", {
                        ref: n,
                        object: a
                    }))
                },
                wn = {
                    attach: "material",
                    transparent: !0,
                    flatShading: !0,
                    depthWrite: !0,
                    depthTest: !0,
                    side: tt.FrontSide
                },
                jn = function(e) {
                    if (!0 !== e.userData.leftified) {
                        e.computeBoundingBox();
                        var t = Math.abs(e.boundingBox.max.x - e.boundingBox.min.x);
                        e.translate(.5 * t, 0, 0), e.userData.leftified = !0
                    }
                },
                In = n(64),
                Sn = n.n(In),
                Mn = n(65),
                kn = n.n(Mn),
                Cn = n(132),
                Dn = n.n(Cn),
                Ln = n(133),
                Pn = n.n(Ln),
                Bn = c.a.memo((function(e) {
                    var t = Object(re.d)((function(e) {
                            return {
                                distortion: 1,
                                pixelation: 1,
                                config: {
                                    duration: 2e3,
                                    easing: $
                                }
                            }
                        })),
                        n = Object(R.a)(t, 2),
                        a = n[0],
                        r = n[1],
                        i = Object(re.d)((function(e) {
                            return {
                                opacity: 0,
                                config: {
                                    duration: 500,
                                    easing: $
                                }
                            }
                        })),
                        s = Object(R.a)(i, 2),
                        u = s[0],
                        l = s[1],
                        f = Object(re.d)((function(e) {
                            return {
                                interlace: 1,
                                config: {
                                    duration: 500,
                                    easing: $
                                }
                            }
                        })),
                        m = Object(R.a)(f, 2),
                        d = m[0],
                        p = m[1],
                        v = Object(o.useRef)(50 * Math.random());
                    Object(o.useEffect)((function() {
                        var t;
                        switch (e.animate) {
                            case "in":
                                t = 500 * Math.random() + 500, r({
                                    distortion: 0,
                                    pixelation: 0,
                                    delay: t
                                }), l({
                                    opacity: 1,
                                    delay: t
                                });
                                break;
                            case "in-intro":
                                r({
                                    distortion: 0,
                                    pixelation: 0,
                                    delay: t = 1200,
                                    config: {
                                        duration: 1500,
                                        easing: K
                                    }
                                }), p({
                                    from: {
                                        interlace: 50
                                    },
                                    to: {
                                        interlace: 1
                                    },
                                    delay: t,
                                    reset: !0,
                                    ease: {
                                        easing: J
                                    }
                                }), l({
                                    opacity: 1,
                                    delay: t
                                });
                                break;
                            case "out":
                                r({
                                    distortion: 1,
                                    pixelation: 1,
                                    opacity: 0
                                }), l({
                                    opacity: 0,
                                    delay: 1e3
                                })
                        }
                    }), [e.animate]);
                    var g = Object(o.useMemo)((function() {
                            var t = {};
                            e.alphaTest && (t.alphaTest = !0);
                            var n = {
                                type: "AudioStoryMaterial",
                                defines: t,
                                uniforms: {
                                    uTime: {
                                        value: 1
                                    },
                                    uResolution: {
                                        value: e.map ? new tt.Vector2(e.map.width, e.map.height) : new tt.Vector2
                                    },
                                    uDistortionStrength: {
                                        value: 1
                                    },
                                    uPixelationStrength: {
                                        value: 1
                                    },
                                    uOpacityStrength: {
                                        value: 1
                                    },
                                    uInterlaceStrength: {
                                        value: 1
                                    },
                                    tDiffuse: {
                                        type: "t",
                                        value: e.map
                                    }
                                },
                                vertexShader: Pn.a,
                                fragmentShader: Dn.a,
                                transparent: !0,
                                depthWrite: !1
                            };
                            return new tt.ShaderMaterial(n)
                        }), [e.map]),
                        h = Object(ie.i)().clock;
                    return c.a.createElement(re.a.primitive, {
                        attach: "material",
                        object: g,
                        "uniforms-uTime-value": h.elapsedTime + v.current,
                        "uniforms-uDistortionStrength-value": a.distortion,
                        "uniforms-uPixelationStrength-value": a.pixelation,
                        "uniforms-uOpacityStrength-value": u.opacity,
                        "uniforms-uInterlaceStrength-value": d.interlace
                    })
                }), (function(e, t) {
                    var n = e.map == t.map,
                        a = e.animate == t.animate;
                    return n && a
                })),
                Tn = function(e) {
                    var t = fn([Sn.a, kn.a]),
                        n = Object(R.a)(t, 2),
                        a = n[0],
                        r = n[1],
                        i = Object(o.useRef)(),
                        s = Object(o.useRef)();
                    Object(o.useEffect)((function() {
                        i.current && s.current && (jn(i.current.geometry), jn(s.current.geometry))
                    }), []);
                    var u = function(e) {
                        e.stopPropagation()
                    };
                    return c.a.createElement("group", null, c.a.createElement("mesh", {
                        visible: !1,
                        position: [0, 0, .01],
                        onPointerOver: function(e) {
                            return u(e)
                        },
                        onPointerOut: function(e) {
                            return u(e)
                        }
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [5.4, 2.7]
                    })), c.a.createElement("mesh", {
                        ref: i,
                        position: [-1.995, 1, 0],
                        scale: [.45, .45, 1],
                        renderOrder: 10
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [3.5, 1]
                    }), c.a.createElement("meshBasicMaterial", Object.assign({
                        attach: "material",
                        map: a
                    }, wn))), c.a.createElement("mesh", {
                        ref: s,
                        position: [-2, 0, 0],
                        scale: [.75, .75, 1],
                        renderOrder: 10
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [6.22, 1]
                    }), c.a.createElement(Bn, {
                        map: r,
                        animate: "in-intro"
                    })), c.a.createElement(En, {
                        position: [-2, -.65, 0],
                        color: 0,
                        fontSize: .132,
                        lineHeight: 1.33,
                        textAlign: "left",
                        font: gn.a,
                        anchorX: "left",
                        anchorY: "top",
                        maxWidth: 5
                    }, "Her kadın bir hikaye taşıyor, her bir hayat eşsiz ve değerli. Bu platform, şiddet ve haksızlık sonucu hayatlarını kaybeden kadınların hatıralarını yaşatmak, toplumda farkındalık yaratmak ve adalet için bir araya gelmiş bir dayanışma alanıdır."), c.a.createElement(En, {
                        position: [-2, -1.43, 0],
                        color: 0,
                        fontSize: .132,
                        lineHeight: 1.33,
                        textAlign: "left",
                        font: gn.a,
                        anchorX: "left",
                        anchorY: "top",
                        maxWidth: 5
                    }, "'Kaybolan Hayatlar, Sessiz Kalmayacak'"))
                },
                Rn = n(134),
                Hn = n.n(Rn),
                Nn = {
                    color: 0,
                    fontSize: .14,
                    lineHeight: 1.33,
                    textAlign: "left",
                    font: gn.a,
                    anchorX: "left",
                    anchorY: "middle",
                    maxWidth: 2.65
                },
                Un = function(e) {
                    var t = fn([Sn.a, kn.a]),
                        n = Object(R.a)(t, 2),
                        a = n[0],
                        r = n[1],
                        i = Object(o.useRef)(),
                        s = Object(o.useRef)();
                    return Object(o.useEffect)((function() {
                        i.current && s.current && (jn(i.current.geometry), jn(s.current.geometry))
                    }), []), c.a.createElement("group", null, c.a.createElement("mesh", {
                        ref: i,
                        position: [-1.05, 2, 0],
                        scale: [.35, .35, 1],
                        renderOrder: 10
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [3.5, 1]
                    }), c.a.createElement("meshBasicMaterial", Object.assign({
                        attach: "material",
                        map: a
                    }, wn))), c.a.createElement("mesh", {
                        ref: s,
                        position: [-1.05, .95, 0],
                        scale: [.45, .45, 1],
                        renderOrder: 10
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [6.22, 1]
                    }), c.a.createElement("meshBasicMaterial", Object.assign({
                        attach: "material",
                        map: r
                    }, wn))), c.a.createElement("group", {
                        position: [-1.05, .04, 0]
                    }, c.a.createElement(En, Nn, "Her kadın bir hikaye taşıyor, her bir hayat eşsiz ve değerli. Bu platform, şiddet ve haksızlık sonucu hayatlarını kaybeden kadınların hatıralarını yaşatmak, toplumda farkındalık yaratmak ve adalet için bir araya gelmiş bir dayanışma alanıdır.")), c.a.createElement("group", {
                        position: [-1.05, -1, 0]
                    }, c.a.createElement(En, Nn, "Kaybolan Hayatlar, Sessiz Kalmayacak")), c.a.createElement("group", {
                        position: [-1.05, -2, 0]
                    }, c.a.createElement(En, Object.assign({}, Nn, {
                        font: Hn.a
                    }), "Keşfetmek İçin Kaydır.")))
                },
                zn = function(e) {
                    return c.a.createElement("group", {
                        position: e.position
                    }, T.MOBILE ? c.a.createElement(Un, {
                        position: [0, .5, 0]
                    }) : c.a.createElement(Tn, {
                        position: [0, .5, 0]
                    }))
                },
                Qn = {
                    geometry: new tt.PlaneBufferGeometry(1e3, .01),
                    material: new tt.MeshBasicMaterial({
                        color: "white",
                        flatShading: !0
                    })
                },
                Xn = function(e) {
                    return c.a.createElement("mesh", {
                        position: e.position,
                        "position-z": -.001
                    }, c.a.createElement("primitive", {
                        object: Qn.material,
                        attach: "material"
                    }), c.a.createElement("primitive", {
                        object: Qn.geometry,
                        attach: "geometry"
                    }))
                },
                Wn = function() {
                    return c.a.createElement("group", null, function() {
                        var e = 0,
                            t = 0;
                        return new Array(70).fill().map((function(n, a) {
                            if (0 !== a) {
                                var r = a % 2 === 0 ? 1 : -1;
                                1 === r && (e += 1), t = e * r
                            }
                            return c.a.createElement(Xn, {
                                key: a,
                                position: [0, t, 0]
                            })
                        }))
                    }())
                },
                Fn = n(22),
                Vn = function(e, t) {
                    if (!t) return !1;
                    var n = new tt.Vector3;
                    t.localToWorld(n);
                    var a = new tt.Vector2(n.x, n.y);
                    if (a.x + a.y === 0) return !1;
                    var r = new tt.Vector2(e.position.x, e.position.y).sub(a);
                    return r.x = Math.abs(r.x), r.y = Math.abs(r.y), {
                        isOnScreen: r.x < 6 && r.y < 3,
                        shouldLoad: r.x < 9 && r.y < 6,
                        shouldAnimate: r.x < 2.5 && r.y < 2
                    }
                },
                Gn = function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 250,
                        t = Object(o.useCallback)(Object(Fn.throttle)((function(e, t) {
                            return Vn(e, t)
                        }), e + 150 * Math.random()), []);
                    return t
                },
                Yn = function(e, t) {
                    var n = Object(xe.c)();
                    Object(o.useEffect)((function() {
                        var a = -1,
                            r = function(e) {
                                var n = Math.round(e.target.currentTime / e.target.duration * 300) / 300;
                                n != a && (t.setMediaProgress(n), a = n)
                            },
                            i = function(e) {
                                t.setMediaProgress(0), a = 0
                            },
                            o = function() {
                                n.push("")
                            };
                        return e.addEventListener("timeupdate", r), e.addEventListener("pause", i), e.addEventListener("ended", o),
                            function() {
                                e.removeEventListener("timeupdate", r), e.removeEventListener("pause", i), e.addEventListener("ended", o)
                            }
                    }), [e])
                },
                _n = function(e) {
                    var t = !1,
                        n = {
                            x: 0,
                            y: 0
                        };
                    return {
                        onPointerUp: function(a) {
                            var r = a.screenX,
                                i = a.screenY,
                                o = r - n.x,
                                c = i - n.y,
                                s = Math.sqrt(o * o + c + c);
                            t && s < 6 && (a.stopPropagation(), t = !1, e())
                        },
                        onPointerDown: function(e) {
                            n = {
                                x: e.screenX,
                                y: e.screenY
                            }, t = !0
                        }
                    }
                },
                qn = n(135),
                Jn = [],
                Kn = function(e) {
                    return function(t) {
                        return t.url === e
                    }
                },
                Zn = function(e) {
                    var t = Jn.find(Kn(e));
                    if (t) return t.value
                },
                $n = function(e, t) {
                    var n = Jn.find(Kn(e));
                    n ? n.value = t : Jn.push({
                        url: e,
                        value: t
                    })
                },
                ea = function(e) {
                    return new Promise((function(t, n) {
                        var a, r = Array.isArray(e),
                            i = 0,
                            o = 0,
                            c = function() {
                                ++o === i && t(r ? a : a[0])
                            };
                        a = (r ? e : [e]).map((function(e) {
                            var t = Zn(e);
                            if (t) return t;
                            i++;
                            var n = (new tt.TextureLoader).load(e, c);
                            return $n(e, n), n
                        }))
                    }))
                },
                ta = function(e) {
                    return An()(ea, [e])
                },
                na = function(e) {
                    var t = Array.isArray(e) ? e : [e],
                        n = Object(o.useState)(Array.isArray(e) ? [new Array(e.length).fill(null)] : null),
                        a = Object(R.a)(n, 2),
                        c = a[0],
                        s = a[1];
                    return Object(o.useEffect)((function() {
                        (function() {
                            var t = Object(i.a)(r.a.mark((function t() {
                                var n;
                                return r.a.wrap((function(t) {
                                    for (;;) switch (t.prev = t.next) {
                                        case 0:
                                            return t.next = 2, ea(e);
                                        case 2:
                                            n = t.sent, s(n);
                                        case 4:
                                        case "end":
                                            return t.stop()
                                    }
                                }), t)
                            })));
                            return function() {
                                return t.apply(this, arguments)
                            }
                        })()()
                    }), t), c
                },
                aa = n(136),
                ra = n.n(aa),
                ia = {
                    geometry: new tt.PlaneBufferGeometry(.2, .2),
                    material: new tt.MeshBasicMaterial({
                        color: "white",
                        flatShading: !0,
                        transparent: !0
                    })
                };
            ia.geometry.translate(-.0985, .0985, 0);
            var oa = function(e) {
                var t = ta(ra.a);
                return c.a.createElement("mesh", {
                    renderOrder: 0,
                    rotation: function(e) {
                        var t = {
                            tl: -1.5 * Math.PI,
                            tr: -1 * Math.PI,
                            br: -.5 * Math.PI,
                            bl: 0
                        }[e];
                        return new tt.Euler(0, 0, t)
                    }(e.orientation),
                    position: e.position
                }, c.a.createElement("meshBasicMaterial", Object.assign({}, wn, {
                    attach: "material",
                    alphaMap: t,
                    color: "white",
                    depthWrite: !1,
                    depthTest: !1,
                    transparent: !0
                })), c.a.createElement("primitive", {
                    object: ia.geometry,
                    attach: "geometry"
                }))
            };
            Object(ie.e)(qn.MeshLine, qn.MeshLineMaterial, qn.MeshLineRaycast);
            var ca = {
                    geometry: new tt.PlaneBufferGeometry(.01, 1),
                    material: new tt.MeshBasicMaterial({
                        color: 16777215
                    })
                },
                sa = c.a.memo((function(e) {
                    var t = Object(o.useRef)();
                    return c.a.createElement("group", {
                        position: e.position,
                        ref: t
                    }, c.a.createElement(oa, {
                        position: [0, .5, 0],
                        orientation: "tl"
                    }), c.a.createElement(oa, {
                        position: [0, .5, 0],
                        orientation: "tr"
                    }), c.a.createElement(oa, {
                        position: [0, -.5, 0],
                        orientation: "bl"
                    }), c.a.createElement(oa, {
                        position: [0, -.5, 0],
                        orientation: "br"
                    }), c.a.createElement("mesh", null, c.a.createElement("primitive", {
                        object: ca.material,
                        attach: "material"
                    }), c.a.createElement("primitive", {
                        object: ca.geometry,
                        attach: "geometry"
                    })))
                }), (function(e, t) {
                    return Object(Fn.isEqual)(e.position, t.position)
                })),
                ua = n(68),
                la = {
                    available: [],
                    allocate: function(e, t, n) {
                        var a;
                        return la.available.length <= 0 ? a = new tt.WebGLRenderTarget(e, t, n) : (a = la.available.pop()).width === e && a.height === t || a.setSize(e, t), a
                    },
                    release: function(e) {
                        -1 === la.available.indexOf(e) ? la.available.push(e) : console.warn("wot")
                    }
                },
                fa = la,
                ma = function(e) {
                    var t = e.material,
                        n = e.unitToTextureSize,
                        a = e.planeDimensions,
                        r = e.rendering,
                        i = e.clearColor,
                        s = e.textureScaleFactor,
                        u = void 0 === s ? 1 : s,
                        l = Object(o.useRef)(),
                        f = Object(o.useRef)(),
                        m = Object(o.useMemo)((function() {
                            return new tt.Scene({
                                background: "white"
                            })
                        }), []),
                        d = Object(o.useRef)(),
                        p = Object(o.useMemo)((function() {
                            if (r && !d.current) {
                                var e = fa.allocate(_(n[0] * a[0]), _(n[1] * a[1]), {
                                    wrapS: tt.MirroredRepeatWrapping,
                                    wrapT: tt.MirroredRepeatWrapping,
                                    depthBuffer: !1,
                                    stencilBuffer: !1
                                });
                                return d.current = e, e
                            }
                            if (d.current) return fa.release(d.current), d.current = null, null
                        }), [r, a[0], a[1]]);
                    Object(o.useEffect)((function() {
                        return function() {
                            d.current && (fa.release(d.current), d.current = null)
                        }
                    }), [p]), Object(o.useLayoutEffect)((function() {
                        var t = l.current;
                        t && (t.left = -.5 * e.planeDimensions[0] * e.unitToTextureSize[0] * u, t.right = .5 * e.planeDimensions[0] * e.unitToTextureSize[0] * u, t.top = .5 * e.planeDimensions[1] * e.unitToTextureSize[1] * u, t.bottom = -.5 * e.planeDimensions[1] * e.unitToTextureSize[1] * u, t.updateProjectionMatrix())
                    }), [window.innerWidth, window.innerHeight]);
                    var v = Object(o.useMemo)((function() {
                            return c.a.cloneElement(t, {
                                map: p ? p.texture : null
                            })
                        }), [t, p]),
                        g = Object(o.useRef)(0),
                        h = Object(o.useCallback)(Object(Fn.throttle)((function(e) {
                            if (g.current++, r) {
                                var t = l.current;
                                if (t && p) {
                                    var n = e.gl.getClearColor(),
                                        a = e.gl.getClearAlpha();
                                    e.gl.setRenderTarget(p), i && i != n && e.gl.setClearColor(i, 1), e.gl.clear(), e.gl.render(m, t), e.gl.setRenderTarget(null), e.gl.setClearColor(n, a)
                                }
                                f.current && (f.current.visible = !0)
                            }
                        }), 1e3 / e.framerate), [e.framerate]);
                    return Object(ie.g)((function(e) {
                        h(e)
                    })), c.a.createElement(c.a.Fragment, null, c.a.createElement(ua.b, {
                        ref: l,
                        position: [0, 0, 1]
                    }), Object(ie.d)(e.children || c.a.createElement(c.a.Fragment, null), m), c.a.createElement("mesh", {
                        visible: !1,
                        ref: f,
                        scale: e.scale || [1, 1, 1]
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: a
                    }), v))
                };

            function da(e, t) {
                var n = Object(o.useRef)();
                Object(o.useEffect)((function() {
                    if (n.current) {
                        var a = Object.keys(Object(H.a)(Object(H.a)({}, n.current), t)),
                            r = {};
                        a.forEach((function(e) {
                            n.current[e] !== t[e] && (r[e] = {
                                from: n.current[e],
                                to: t[e]
                            })
                        })), Object.keys(r).length && console.log("[why-did-you-update]", e, r)
                    }
                    n.current = t
                }))
            }
            var pa = new tt.MeshBasicMaterial({
                depthTest: !1,
                depthWrite: !1,
                side: tt.FrontSide,
                flatShading: !0
            });
            Object(hn.preloadFont)(gn.a, "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'\".,!?&$@\u2026\u2019:", (function() {}));
            var va = c.a.memo((function(e) {
                    da("Ticker", e);
                    var t = Object(o.useRef)(),
                        n = Object(o.useState)({}),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1],
                        s = (e.text.length > 200 ? e.text.substring(0, 200) : e.text).length > 30 ? 3 : 6,
                        u = Object(o.useMemo)((function() {
                            return new Array(s).fill(null).map((function() {
                                var t = e.text,
                                    n = new hn.TextMesh(pa);
                                return n.color = 0, n.fontSize = e.fontSize, n.lineHeight = 50, n.maxWidth = Number.MAX_VALUE, n.textAlign = "center", n.text = t, n.font = gn.a, n.anchorX = "center", n.anchorY = "middle", n
                            }))
                        }), []);
                    return Object(o.useLayoutEffect)((function() {
                        if (!r.synced) {
                            var e = 0;
                            return u.forEach((function(t) {
                                    t.sync((function() {
                                        ++e === s && i({
                                            itemWidth: 2 * t.geometry.boundingSphere.radius,
                                            tickerWidth: 2 * t.geometry.boundingSphere.radius * s,
                                            synced: !0
                                        })
                                    }))
                                })),
                                function() {
                                    u.forEach((function(e) {
                                        e.dispose()
                                    }))
                                }
                        }
                    }), [u]), Object(o.useLayoutEffect)((function() {
                        if (!0 === r.synced) {
                            var e, n = 0;
                            u.forEach((function(e, t) {
                                e.userData.i = t, e.position.x = n, 0 === n || t % 2 === 0 ? n = Math.abs(n) + r.itemWidth + 100 : n *= -1
                            })), (e = t.current).add.apply(e, Object(Ee.a)(u))
                        }
                        return function() {}
                    }), [r]), Object(ie.g)((function(t, n) {
                        if (e.running && r.synced) {
                            var a = e.direction,
                                i = e.direction * n * 70,
                                o = r.itemWidth,
                                c = r.tickerWidth,
                                s = u.sort((function(e, t) {
                                    return 1 === a ? e.position.x < t.position.x ? 1 : -1 : -1 === a ? e.position.x > t.position.x ? 1 : -1 : void 0
                                })),
                                l = s[0],
                                f = s[s.length - 1];
                            l.position.x += i, s.forEach((function(e, t) {
                                e != l && (e.position.x = l.position.x + (t * o + 100 * t) * a * -1)
                            })), l.position.x > .5 * c && (l.position.x = f.position.x - o - 100), l.position.x < .5 * -c && (l.position.x = f.position.x + o + 100)
                        }
                    })), c.a.createElement("group", {
                        position: [0, 0, -10],
                        ref: t
                    })
                }), (function(e, t) {
                    var n = e.running === t.running,
                        a = e.direction === t.direction,
                        r = e.text === t.text;
                    return n && a & r
                })),
                ga = n(143),
                ha = n.n(ga),
                ba = function() {
                    for (var e = [], t = new tt.BufferGeometry, n = 0; n < 128; n++) {
                        var a = ne(n, 0, 128, -1024, 1024);
                        e.push(a, 0, 0)
                    }
                    return t.setAttribute("position", new tt.Float32BufferAttribute(e, 3)), t
                },
                Aa = function(e, t, n, a) {
                    for (var r = e.getAttribute("position"), i = 0; i < r.array.length; i += r.itemSize) {
                        var o = t[i / 3],
                            c = i % 2 ? -1 : 1,
                            s = .12 * Math.sin(5 * n + 1 * i),
                            u = ne(o + s, 0, 1, 0, 150 * c);
                        r.array[i + 1] = G(r.array[i + 1], u, a)
                    }
                    r.needsUpdate = !0
                },
                ya = function(e) {
                    var t = ta(ha.a),
                        n = Object(o.useRef)(),
                        a = Object(o.useRef)(),
                        r = Object(o.useRef)(),
                        i = Object(o.useMemo)((function() {
                            return [ba(), ba(), ba(), ba(), ba(), ba()]
                        }), []),
                        s = Object(R.a)(i, 6),
                        u = s[0],
                        l = s[1],
                        f = s[2],
                        m = s[3],
                        d = s[4],
                        p = s[5];
                    Object(o.useEffect)((function() {
                        return e.audio && Be.setEl(e.audio),
                            function() {}
                    }), [e.audio]), Object(ie.g)((function(t) {
                        if (Be) {
                            var n = Be.audioData;
                            if (!n) return;
                            var i = {
                                    high: 340,
                                    low: 860
                                }[e.audioQuality || "high"],
                                o = Object(Ee.a)(n),
                                c = function(e, t) {
                                    var n = function(e, t, n) {
                                            return e + (t - e) * n
                                        },
                                        a = new Array,
                                        r = new Number((e.length - 1) / (t - 1));
                                    a[0] = e[0];
                                    for (var i = 1; i < t - 1; i++) {
                                        var o = i * r,
                                            c = new Number(Math.floor(o)).toFixed(),
                                            s = new Number(Math.ceil(o)).toFixed(),
                                            u = o - c;
                                        a[i] = n(e[c], e[s], u)
                                    }
                                    return a[t - 1] = e[e.length - 1], a
                                }(o = (o = o.slice(0, o.length - i)).slice(20), 64),
                                s = Object(Ee.a)(c).reverse(),
                                v = [].concat(Object(Ee.a)(s), Object(Ee.a)(c));
                            if (Aa(u, v, t.clock.elapsedTime, .5), Aa(l, v, t.clock.elapsedTime, .2), Aa(f, v, t.clock.elapsedTime, .1), Aa(m, v, t.clock.elapsedTime, .05), Aa(d, v, t.clock.elapsedTime, .025), Aa(p, v, t.clock.elapsedTime, .01), Aa(d, v, t.clock.elapsedTime, .025), Aa(p, v, t.clock.elapsedTime, .01), a.current) {
                                var g = a.current.scale.x,
                                    h = ne(G(g, o[0], .2), 0, 1, 0, 1, ee);
                                a.current.scale.x = a.current.scale.y = a.current.scale.z = h
                            }
                            if (r.current) {
                                var b = r.current.scale.x,
                                    A = ne(G(b, o[0], .3), 0, 1, 0, 1, ee);
                                A = Object(Fn.clamp)(A, .4, .8), r.current.scale.x = r.current.scale.y = r.current.scale.z = A
                            }
                        }
                    }));
                    var v = Object(o.useMemo)((function() {
                            var e = 2 / window.devicePixelRatio;
                            return [c.a.createElement("pointsMaterial", {
                                args: {
                                    size: 6 * e,
                                    color: "black"
                                },
                                attach: "material"
                            }), c.a.createElement("pointsMaterial", {
                                args: {
                                    size: 2 * e,
                                    color: "black"
                                },
                                attach: "material"
                            })]
                        }), []),
                        g = Object(R.a)(v, 2),
                        h = g[0],
                        b = g[1];
                    return c.a.createElement(c.a.Fragment, null, c.a.createElement("mesh", {
                        ref: a,
                        position: [0, 0, -2e3]
                    }, c.a.createElement("sphereBufferGeometry", {
                        attach: "geometry",
                        args: [75, 4, 20]
                    }), c.a.createElement("meshBasicMaterial", {
                        attach: "material",
                        color: 11337728
                    })), c.a.createElement("mesh", {
                        ref: r,
                        position: [0, 0, -1200]
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [150, 150, 1, 1]
                    }), c.a.createElement("meshBasicMaterial", {
                        attach: "material",
                        map: t,
                        alphaTest: .5,
                        transparent: !0
                    })), c.a.createElement("group", {
                        position: [0, 0, -1e3],
                        ref: n
                    }, c.a.createElement("points", null, h, c.a.createElement("primitive", {
                        object: u,
                        attach: "geometry"
                    })), c.a.createElement("points", null, b, c.a.createElement("primitive", {
                        object: l,
                        attach: "geometry"
                    })), c.a.createElement("points", null, b, c.a.createElement("primitive", {
                        object: f,
                        attach: "geometry"
                    })), c.a.createElement("points", null, b, c.a.createElement("primitive", {
                        object: m,
                        attach: "geometry"
                    })), " ", c.a.createElement("points", null, b, c.a.createElement("primitive", {
                        object: d,
                        attach: "geometry"
                    })), " ", c.a.createElement("points", null, b, c.a.createElement("primitive", {
                        object: p,
                        attach: "geometry"
                    }))))
                },
                Oa = c.a.memo((function(e) {
                    var t = e.dimensions,
                        n = Object(ie.i)().camera,
                        a = Object(o.useRef)(),
                        r = Object(o.useState)(!1),
                        i = Object(R.a)(r, 2),
                        s = i[0],
                        u = i[1],
                        l = Object(o.useState)(!1),
                        f = Object(R.a)(l, 2),
                        m = f[0],
                        d = f[1],
                        p = Gn(),
                        v = Object(xe.c)(),
                        g = V(),
                        h = Re(e.id, "audio"),
                        b = Object(R.a)(h, 5),
                        A = b[0],
                        y = b[1],
                        O = b[2],
                        x = b[3],
                        E = (b[4], Object(re.d)((function() {
                            return {
                                opacity: 0,
                                config: {
                                    mass: 1,
                                    friction: 5,
                                    tension: 150
                                }
                            }
                        }))),
                        w = Object(R.a)(E, 2),
                        j = w[0],
                        I = w[1];
                    Yn(A, g), Object(ie.g)((function() {
                        var e = p(n, a.current);
                        s != e.isOnScreen && u(e.isOnScreen)
                    })), Object(o.useEffect)((function() {
                        e.isActive ? y() : O()
                    }), [e.isActive]);
                    var S = Object(o.useMemo)((function() {
                            return _n((function() {
                                v.location.pathname !== "/".concat(e.id) && (v.push(e.id), x(0), y(), g.setCameraHintId(e.cameraHintId))
                            }))
                        }), [v, e.id]),
                        M = function(e, t) {
                            g.setHover(e, t)
                        },
                        k = Object(ie.i)();
                    return Object(o.useEffect)((function() {
                        k.gl.domElement.style.cursor = m ? "pointer" : "auto"
                    }), [m]), c.a.createElement(c.a.Fragment, null, c.a.createElement("group", {
                        ref: a,
                        onPointerUp: S.onPointerUp,
                        onPointerDown: S.onPointerDown,
                        onPointerOver: function() {
                            I({
                                opacity: .66
                            }), d(!0)
                        },
                        onPointerMove: function() {
                            M(!0, e.id)
                        },
                        onPointerOut: function() {
                            M(!1, null), I({
                                opacity: 0
                            }), d(!1)
                        },
                        position: e.position,
                        "position-z": -.01
                    }, s && e.isActive ? c.a.createElement(c.a.Fragment, null, c.a.createElement(ma, {
                        position: e.position,
                        planeDimensions: t,
                        unitToTextureSize: [1024, 1024],
                        textureScaleFactor: .5,
                        rendering: s,
                        clearColor: 16777215,
                        material: c.a.createElement("meshBasicMaterial", {
                            transparent: !0,
                            blending: tt.MultiplyBlending,
                            attach: "material"
                        })
                    }, c.a.createElement(ya, {
                        audio: A,
                        audioQuality: e.quality
                    }))) : null, s ? c.a.createElement(c.a.Fragment, null, c.a.createElement(o.Suspense, {
                        fallback: null
                    }, c.a.createElement(ma, {
                        position: e.position,
                        planeDimensions: t,
                        unitToTextureSize: T.REQUIRES_LOW_RES_TEXTURES ? [256, 128] : [512, 256],
                        scale: [1, .5, 1],
                        rendering: s,
                        framerate: 30,
                        material: c.a.createElement(Bn, {
                            animate: s && !e.isActive ? "in" : "out",
                            alphaTest: !0
                        })
                    }, c.a.createElement(va, {
                        running: s,
                        direction: e.direction,
                        text: e.tickerText,
                        fontSize: T.REQUIRES_LOW_RES_TEXTURES ? 36 : 72
                    })), c.a.createElement(sa, {
                        position: [-.5 * t[0], 0, 0]
                    }), c.a.createElement(sa, {
                        position: [.5 * t[0], 0, 0]
                    }), c.a.createElement(re.a.mesh, {
                        visible: j.opacity.interpolate((function(e) {
                            return e > 0
                        })),
                        position: [0, 0, -.01]
                    }, c.a.createElement(re.a.meshBasicMaterial, {
                        opacity: j.opacity,
                        transparent: !0,
                        attach: "material",
                        color: 16777215,
                        depthTest: !1
                    }), c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [].concat(Object(Ee.a)(t), [1, 1])
                    })))) : null))
                }), (function(e, t) {
                    var n = Object(Fn.isEqual)(e.position, t.position),
                        a = Object(Fn.isEqual)(e.dimensions, t.dimensions),
                        r = Object(Fn.isEqual)(e.isActive, t.isActive);
                    return n && a && r
                })),
                xa = function(e) {
                    var t = document.createElement("div");
                    return t.innerHTML = e.trim(), t.firstChild
                };

            function Ea() {
                var e = Object(se.a)(['\n  display: flex;\n  flex-wrap: nowrap;\n  font-family: "Neue Machina";\n  font-size: 1.6rem;\n  font-weight: normal;\n  justify-content: center;\n  position: relative;\n  text-align: center;\n  top: 39vh;\n  width: 580px;\n  user-select: none;\n  .text {\n    background-color: black;\n    border-radius: 15px;\n    color: white;\n    display: none;\n    padding: 18px 15px;\n  }\n  @media (max-width: 768px) {\n    font-size: 0.8rem;\n    width: 65vw;\n    margin-right: ', ";\n    margin-bottom: 30px;\n    top: 0;\n  }\n"]);
                return Ea = function() {
                    return e
                }, e
            }
            var wa = le.a.div(Ea(), (function() {
                    return T.MOBILE ? "20px" : "0px"
                })),
                ja = function(e) {
                    var t = e.video,
                        n = e.vttURL,
                        a = Object(o.useRef)(),
                        r = Object(o.useRef)();
                    return Object(o.useEffect)((function() {
                        var e;
                        return function(t, n) {
                                e = xa('<track label="English" kind="captions" srclang="en" src='.concat(n, " default>")), t.appendChild(e), e.oncuechange = function(e) {
                                    var t = e.target.track.activeCues;
                                    t && t.length ? (r.current.innerHTML = t[0].text, r.current.style.display = "inline-block") : (r.current.innerHTML = "", r.current.style.display = "none")
                                }
                            }(t, n),
                            function() {
                                ! function(t) {
                                    e.oncuechange = null, t.removeChild(e), r.current.innerHTML = ""
                                }(t)
                            }
                    }), [t, n]), c.a.createElement(wa, {
                        ref: a
                    }, c.a.createElement("div", {
                        className: "text",
                        ref: r
                    }))
                },
                Ia = function(e) {
                    return c.a.createElement("group", {
                        rotation: function(e) {
                            var t = {
                                cl: 0,
                                cr: -1 * Math.PI
                            }[e];
                            return new tt.Euler(0, 0, t)
                        }(e.orientation),
                        position: e.position
                    }, c.a.createElement(oa, {
                        orientation: "tl"
                    }), c.a.createElement(oa, {
                        orientation: "bl"
                    }))
                },
                Sa = c.a.memo((function(e) {
                    da("Fillets", e);
                    var t = e.dimensions,
                        n = function(e) {
                            var n = 0,
                                a = 0;
                            return "t" === e[0] && (a = .5 * t[1]), "c" === e[0] && (a = 0), "b" === e[0] && (a = -.5 * t[1]), "l" === e[1] && (n = -.5 * t[0]), "r" === e[1] && (n = .5 * t[0]), new tt.Vector3(n, a, 0)
                        };
                    return c.a.createElement("group", {
                        renderOrder: 2
                    }, function() {
                        if ("left" === e.side || "both" === e.side) return c.a.createElement(c.a.Fragment, null, c.a.createElement(oa, {
                            orientation: "tl",
                            position: n("tl")
                        }), c.a.createElement(oa, {
                            orientation: "bl",
                            position: n("bl")
                        }))
                    }(), function() {
                        if ("right" === e.side || "both" === e.side) return c.a.createElement(c.a.Fragment, null, c.a.createElement(oa, {
                            orientation: "tr",
                            position: n("tr")
                        }), c.a.createElement(oa, {
                            orientation: "br",
                            position: n("br")
                        }))
                    }(), function() {
                        if (e.isMain) return c.a.createElement(c.a.Fragment, null, c.a.createElement(Ia, {
                            orientation: "cl",
                            position: n("cl")
                        }), c.a.createElement(Ia, {
                            orientation: "cr",
                            position: n("cr")
                        }))
                    }())
                }), (function(e, t) {
                    return Object(Fn.isEqual)(e.dimensions, t.dimensions) && e.isMain == t.isMain
                })),
                Ma = n(66),
                ka = n.n(Ma),
                Ca = n(67),
                Da = n.n(Ca),
                La = function(e) {
                    da("Player", e);
                    var t = ta(e.isMain ? ka.a : Da.a);
                    return c.a.createElement("group", {
                        position: e.position,
                        renderOrder: 6,
                        visible: e.isActive
                    }, c.a.createElement("mesh", {
                        position: [0, 0, 0]
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: [e.dimensions[0] + .005, e.dimensions[1] + .005]
                    }), c.a.createElement("meshStandardMaterial", Object.assign({}, wn, {
                        alphaMap: t
                    }), c.a.createElement("videoTexture", {
                        attach: "map",
                        image: e.video
                    }))))
                },
                Pa = n(144),
                Ba = n.n(Pa),
                Ta = n(146),
                Ra = n.n(Ta),
                Ha = c.a.forwardRef((function(e, t) {
                    var n = Object(re.d)((function(e) {
                            return {
                                brightness: .1,
                                contrast: .3,
                                inverse: 1,
                                saturation: .1,
                                scale: .93,
                                config: {
                                    duration: 200,
                                    easing: $
                                }
                            }
                        })),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1],
                        s = Object(re.d)((function(e) {
                            return {
                                whiteOverlay: 1,
                                config: {
                                    duration: 1e3,
                                    easing: $
                                }
                            }
                        })),
                        u = Object(R.a)(s, 2),
                        l = u[0],
                        f = u[1],
                        m = Object(re.d)((function(e) {
                            return {
                                scale: .93,
                                rolloverStrength: 0,
                                config: re.b.slow
                            }
                        })),
                        d = Object(R.a)(m, 2),
                        p = d[0],
                        v = d[1];
                    Object(o.useLayoutEffect)((function() {
                        switch (e.animate) {
                            case "in-initial":
                                f({
                                    whiteOverlay: 0,
                                    delay: 200 * e.index
                                });
                            case "in":
                                i({
                                    brightness: 0,
                                    contrast: 1,
                                    inverse: 0,
                                    saturation: 1,
                                    config: {
                                        duration: 1500 + 2e3 * Math.random()
                                    },
                                    delay: 100 * e.index
                                });
                                break;
                            case "out":
                                i({
                                    brightness: .1,
                                    contrast: .3,
                                    inverse: 1,
                                    saturation: .1,
                                    config: {
                                        duration: 500
                                    },
                                    delay: 2e3
                                });
                                break;
                            case "rollover":
                                v({
                                    scale: .85,
                                    rolloverStrength: 1,
                                    delay: 0
                                });
                                break;
                            case "rollout":
                                v({
                                    scale: .93,
                                    rolloverStrength: 0,
                                    delay: 0
                                })
                        }
                    }), [e.animate]);
                    var g = Object(o.useMemo)((function() {
                        if (e.map && e.alphaMap) {
                            var t = {
                                uniforms: {
                                    type: "ThumbnailMaterial",
                                    uBrightness: {
                                        type: "f",
                                        value: 0
                                    },
                                    uContrast: {
                                        type: "f",
                                        value: 1
                                    },
                                    uInverse: {
                                        type: "f",
                                        value: 0
                                    },
                                    uSaturation: {
                                        type: "f",
                                        value: 1
                                    },
                                    tDiffuse: {
                                        type: "t",
                                        value: e.map
                                    },
                                    tAlpha: {
                                        type: "t",
                                        value: e.alphaMap
                                    },
                                    uOffset: {
                                        type: "v2",
                                        value: new tt.Vector2(0, 0)
                                    },
                                    uWhiteOverlay: {
                                        type: "f",
                                        value: 1
                                    },
                                    uScale: {
                                        type: "f",
                                        value: .93
                                    },
                                    uTime: {
                                        type: "f",
                                        value: 0
                                    },
                                    uTimeOffset: {
                                        type: "f",
                                        value: 10 * Math.random()
                                    },
                                    uRolloverStrength: {
                                        type: "f",
                                        value: 0
                                    }
                                },
                                vertexShader: Ra.a,
                                fragmentShader: Ba.a,
                                transparent: !1,
                                depthTest: !1,
                                depthWrite: !0
                            };
                            return new tt.ShaderMaterial(t)
                        }
                    }), [e.map, e.alphaMap]);
                    return Object(ie.g)((function(e) {
                        t.current && (t.current.uniforms.uTime.value = e.clock.elapsedTime)
                    })), g ? c.a.createElement(re.a.primitive, {
                        ref: t,
                        attach: "material",
                        object: g,
                        "uniforms-uBrightness-value": r.brightness,
                        "uniforms-uContrast-value": r.contrast,
                        "uniforms-uInverse-value": r.inverse,
                        "uniforms-uSaturation-value": r.saturation,
                        "uniforms-uScale-value": p.scale,
                        "uniforms-uRolloverStrength-value": p.rolloverStrength,
                        "uniforms-uWhiteOverlay-value": l.whiteOverlay
                    }) : null
                })),
                Na = c.a.memo((function(e) {
                    var t = Object(o.useRef)(),
                        n = Object(o.useRef)(),
                        a = Object(ue.c)((function() {
                            return {
                                x: 0,
                                y: 0,
                                config: {
                                    precision: 1e-4,
                                    mass: 1,
                                    tension: 25,
                                    friction: 15
                                }
                            }
                        })),
                        r = Object(R.a)(a, 1)[0],
                        i = ta(e.isMain ? ka.a : Da.a),
                        s = na("img/image".concat(e.index + 1, ".jpg"));
                        u = Object(o.useState)("none"), 
                        l = Object(R.a)(u, 2),
                        f = l[0],
                        m = l[1],
                        d = Object(o.useState)(!1),
                        p = Object(R.a)(d, 2),
                        v = p[0],
                        g = p[1];
                    return Object(o.useEffect)((function() {
                        s && !v ? (m("in-initial"), g(!0)) : m(e.animate)
                    }), [s, e.animate]), Object(o.useEffect)((function() {
                        e.isOver ? m("rollover") : m("rollout")
                    }), [e.isOver]), Object(ie.g)((function(a) {
                        if (e.isOnScreen && t.current) {
                            var r = function(e, t) {
                                    if (t && e) {
                                        var n = new tt.Vector3;
                                        return (n = t.localToWorld(n)).project(e), n
                                    }
                                }(a.camera, t.current),
                                i = e.isMain ? .1 : .15,
                                o = n.current;
                            if (o) {
                                var c = o.uniforms;
                                c.uOffset.value.set(G(c.uOffset.value.x, r.x * i, .1), G(c.uOffset.value.y, r.y * i, .1))
                            }
                        }
                    })), c.a.createElement(o.Suspense, {
                        fallback: null
                    }, c.a.createElement("mesh", {
                        ref: t,
                        position: [0, 0, 0],
                        renderOrder: 6
                    }, c.a.createElement("planeBufferGeometry", {
                        attach: "geometry",
                        args: e.dimensions
                    }), c.a.createElement("meshBasicMaterial", {
                        color: "white"
                    }), c.a.createElement(Ha, {
                        ref: n,
                        index: e.index,
                        attach: "material",
                        offset: r,
                        animate: f,
                        isOver: e.isOver,
                        map: s,
                        alphaMap: i
                    })))
                }), (function(e, t) {
                    var n = e.id && t.id,
                        a = e.animate && t.animate,
                        r = e.thumbOrder && t.thumbOrder,
                        i = e.isMain && t.isMain,
                        o = e.isOver && t.isOver,
                        c = e.isOnScreen && t.isOnScreen,
                        s = Object(Fn.isEqual)(e.dimensions, t.dimensions);
                    return n && a && r && i && o && c && s
                })),
                Ua = c.a.memo((function(e) {
                    var t = Object(o.useMemo)((function() {
                            return e.isMain ? [2, 2] : [1, 1]
                        }), [e.isMain]),
                        n = Object(o.useState)(!1),
                        a = Object(R.a)(n, 2),
                        r = a[0],
                        i = a[1];
                    Object(o.useEffect)((function() {
                        !r && e.load && i(!0)
                    }), [e.load]);
                    return c.a.createElement("group", {
                        position: e.position
                    }, e.isMain && e.isActive ? c.a.createElement(La, {
                        position: e.position,
                        isActive: e.isActive,
                        isMain: e.isMain,
                        video: e.video,
                        dimensions: t
                    }) : null, r ? c.a.createElement(Na, {
                        id: e.id,
                        animate: e.animate,
                        index: e.index,
                        thumbOrder: e.thumbOrder,
                        isMain: e.isMain,
                        isOver: e.isOver,
                        isOnScreen: e.isOnScreen,
                        dimensions: t
                    }) : null, c.a.createElement(o.Suspense, {
                        fallback: null
                    }, c.a.createElement(Sa, {
                        side: function() {
                            var t = e.position[0],
                                n = e.position[1];
                            return Math.abs(n) > 1 || e.isMain ? "both" : t < 0 ? "left" : "right"
                        }(),
                        isMain: e.isMain,
                        dimensions: t
                    })))
                }), (function(e, t) {
                    var n = Object(Fn.isEqual)(e.position, t.position),
                        a = e.animate == t.animate,
                        r = e.load == t.load,
                        i = e.isActive == t.isActive,
                        o = e.isOver == t.isOver,
                        c = e.isOnScreen == t.isOnScreen;
                    return n && a && r && i && o && c
                })),
                za = c.a.memo((function(e) {
                    da("VideoStory", e);
                    var t = Object(xe.c)(),
                        n = V(),
                        a = Object(o.useState)(new Ce.a(e.id)),
                        r = Object(R.a)(a, 1)[0],
                        i = Object(o.useState)({
                            isOnScreen: !1,
                            shouldLoad: !1,
                            shouldAnimate: !1
                        }),
                        s = Object(R.a)(i, 2),
                        u = s[0],
                        l = s[1],
                        f = Object(o.useState)(!1),
                        m = Object(R.a)(f, 2),
                        d = m[0],
                        p = m[1],
                        v = Object(o.useRef)(document.getElementById("ui")),
                        g = Object(o.useState)(r.integer({
                            min: 3,
                            max: 5
                        })),
                        h = Object(R.a)(g, 1)[0],
                        b = Re(e.id, "video"),
                        A = Object(R.a)(b, 5),
                        y = A[0],
                        O = A[1],
                        x = A[2],
                        E = A[3];
                    A[4];
                    Yn(y, n);
                    var w = Object(o.useMemo)((function() {
                        var e, t = [{
                                x: -.5,
                                y: 1.5
                            }, {
                                x: .5,
                                y: 1.5
                            }, {
                                x: .5,
                                y: -1.5
                            }, {
                                x: -.5,
                                y: -1.5
                            }],
                            n = [{
                                x: 1.5,
                                y: .5
                            }, {
                                x: 1.5,
                                y: -.5
                            }, {
                                x: -1.5,
                                y: -.5
                            }, {
                                x: -1.5,
                                y: .5
                            }];
                        if (T.MOBILE) {
                            var a = r.shuffle(t),
                                i = Object(Ee.a)(a.slice(0, 3)),
                                o = Object(Ee.a)(a.slice(3));
                            e = [].concat(Object(Ee.a)(i), Object(Ee.a)(r.shuffle(n)), Object(Ee.a)(o))
                        } else e = r.shuffle([].concat(t, n));
                        return e.unshift({
                            x: 0,
                            y: 0
                        }), e
                    }), []);
                    Object(o.useEffect)((function() {
                        e.isActive ? O() : x()
                    }), [e.isActive]);
                    var j = Object(ie.i)();
                    Object(o.useEffect)((function() {
                        j.gl.domElement.style.cursor = d ? "pointer" : "auto"
                    }), [d]);
                    var I = Object(o.useMemo)((function() {
                            return _n((function() {
                                t.location.pathname !== "/".concat(e.id) && (t.push(e.id), E(0), O())
                            }))
                        }), [t, e.id]),
                        S = function(e, t) {
                            n.setHover(e, t)
                        },
                        M = Object(o.useRef)(),
                        k = Gn(),
                        C = Object(ie.i)().camera;
                    Object(ie.g)((function() {
                        var e = k(C, M.current);
                        l(e)
                    }));
                    var D = Object(o.useMemo)((function() {
                        var t = e.hero || 1,
                            n = [1, 2, 3, 4, 5];
                        return (n = n.filter((function(e) {
                            return e != t
                        }))).unshift(t), n
                    }), []);
                    return c.a.createElement("group", {
                        ref: M,
                        position: e.position,
                        onPointerUp: I.onPointerUp,
                        onPointerDown: I.onPointerDown,
                        onPointerOver: function() {
                            p(!0)
                        },
                        onPointerMove: function() {
                            S(!0, e.id)
                        },
                        onPointerOut: function() {
                            S(!1, null), p(!1)
                        }
                    }, new Array(h).fill().map((function(t, n) {
                        var a = 0 === n;
                        return c.a.createElement(Ua, Object.assign({}, e, {
                            video: a ? y : null,
                            thumbOrder: D,
                            key: n,
                            index: n,
                            isMain: a,
                            isActive: e.isActive,
                            position: [w[n].x, w[n].y, 0],
                            isOnScreen: u.isOnScreen,
                            animate: u.shouldAnimate ? "in" : "out",
                            isOver: d,
                            load: u.shouldLoad
                        }))
                    })), e.isActive && e.subtitles ? window.innerWidth <= 768 ? c.a.createElement(Je, {
                        zIndexRange: [100, 0],
                        portal: v,
                        styles: {
                            position: "absolute",
                            top: "0",
                            width: "100%",
                            height: "100%",
                            zIndex: "100",
                            display: "flex",
                            flexDirection: "column-reverse",
                            alignItems: T.MOBILE ? "flex-end" : "center"
                        }
                    }, c.a.createElement(ja, {
                        video: y,
                        vttURL: "videos/".concat(e.id, ".vtt")
                    })) : c.a.createElement(ua.a, {
                        position: [0, 0, .7],
                        zIndexRange: [100, 0],
                        portal: v,
                        center: !0
                    }, c.a.createElement(ja, {
                        video: y,
                        vttURL: "videos/".concat(e.id, ".vtt")
                    })) : null)
                }), (function(e, t) {
                    var n = e.isActive === t.isActive,
                        a = Object(Fn.isEqual)(e.position, t.position);
                    return n && a
                })),
                Qa = function() {
                    function e(t, n) {
                        Object(U.a)(this, e), this.stepSize = t, this.seed = n, this.clear()
                    }
                    return Object(z.a)(e, [{
                        key: "clear",
                        value: function() {
                            this.boxes = [], this.partitions = [], this.position = {
                                x: 0,
                                y: 0
                            }, this.delta = {
                                x: 0,
                                y: this.stepSize
                            }, this.segmentLength = 1, this.segmentPassed = 0, this.chance = new Ce.a(this.seed)
                        }
                    }, {
                        key: "assignPosition",
                        value: function() {
                            var e = this.position,
                                t = this.delta;
                            if (e.x += t.x, e.y += t.y, this.segmentPassed += 1, this.segmentPassed >= this.segmentLength) {
                                this.segmentPassed = 0;
                                var n = t.y;
                                t.y = -t.x, t.x = n, 0 == t.x && this.segmentLength++
                            }
                            var a = 0,
                                r = 0;
                            return new tt.Vector2(e.x + a, e.y + r)
                        }
                    }, {
                        key: "addBox",
                        value: function(e) {
                            var t = this.assignPosition(),
                                n = new tt.Box2(new tt.Vector2(t.x - .5 * e.x, t.y - .5 * e.y), new tt.Vector2(t.x + .5 * e.x, t.y + .5 * e.y));
                            return this.boxes.push(n), n.getCenter(new tt.Vector2)
                        }
                    }, {
                        key: "stepNulls",
                        value: function() {
                            for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, t = 0; t <= e; t++) this.assignPosition()
                        }
                    }, {
                        key: "stepRandomNulls",
                        value: function() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
                            this.stepNulls(this.chance.integer({
                                min: e,
                                max: t
                            }))
                        }
                    }, {
                        key: "getBounds",
                        value: function() {
                            var e = new tt.Box2;
                            return this.boxes.forEach((function(t) {
                                t.min.x < e.min.x && (e.min.x = t.min.x), t.min.y < e.min.y && (e.min.y = t.min.y), t.max.x > e.max.x && (e.max.x = t.max.x), t.max.y > e.max.y && (e.max.y = t.max.y)
                            })), e
                        }
                    }, {
                        key: "computePartitions",
                        value: function() {
                            for (var e = this, t = this.getBounds(), n = new tt.Box2(new tt.Vector2(t.min.x, t.min.y), new tt.Vector2(t.max.x, t.min.y + 1)), a = function() {
                                    n.min.y += 1, n.max.y += 1;
                                    var t = n.clone(),
                                        a = t.getCenter(new tt.Vector2);
                                    t.min.y = a.y, t.max.y = a.y;
                                    var r, i = (r = t, e.boxes.filter((function(e) {
                                        if (r.intersectsBox(e)) return e
                                    }))).sort((function(e, t) {
                                        var n = e.getCenter(new tt.Vector2),
                                            a = t.getCenter(new tt.Vector2);
                                        return n.x < a.x ? -1 : 1
                                    }));
                                    i.length <= 0 && e.addPartition(n.clone()), i.forEach((function(t, a) {
                                        var r;
                                        if (0 == a) r = new tt.Box2(new tt.Vector2(n.min.x, n.min.y), new tt.Vector2(t.min.x, n.max.y)), e.addPartition(r);
                                        else if (a > 0) {
                                            var o = i[a - 1];
                                            r = new tt.Box2(new tt.Vector2(o.max.x, n.min.y), new tt.Vector2(t.min.x, n.max.y)), e.addPartition(r), a >= i.length - 1 && (r = new tt.Box2(new tt.Vector2(t.max.x, n.min.y), new tt.Vector2(n.max.x, n.max.y)), e.addPartition(r))
                                        }
                                    }))
                                }; n.max.y < t.max.y;) a()
                        }
                    }, {
                        key: "addPartition",
                        value: function(e) {
                            e && (e.getSize(new tt.Vector2).x > 0 && this.partitions.push(e))
                        }
                    }, {
                        key: "subDividePartitions",
                        value: function(e) {
                            for (var t = this, n = function(t) {
                                    if (t.getSize(new tt.Vector2).x > e) return t
                                }, a = this.partitions.filter(n); a.length > 0;) Fn.pullAll(this.partitions, a), a.forEach((function(e) {
                                var n, a = e.getSize(new tt.Vector2),
                                    r = t.chance.random(),
                                    i = Math.floor(a.x * r),
                                    o = [new tt.Box2(e.min, new tt.Vector2(e.min.x + i, e.max.y)), new tt.Box2(new tt.Vector2(e.min.x + i, e.min.y), new tt.Vector2(e.max.x, e.max.y))];
                                (n = t.partitions).push.apply(n, o)
                            })), a = this.partitions.filter(n)
                        }
                    }, {
                        key: "allocateRandomPartitions",
                        value: function(e) {
                            for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = 0, a = this.partitions.filter((function(e) {
                                    if (e.getSize(new tt.Vector2).x > t) return e
                                })), r = []; n <= e;) {
                                var i = a.splice(this.chance.integer({
                                    min: 0,
                                    max: a.length
                                }), 1);
                                r.push.apply(r, Object(Ee.a)(i)), n++
                            }
                            return this.partitions = Fn.pullAll(this.partitions, r), r
                        }
                    }]), e
                }(),
                Xa = Object(ae.a)((function(e) {
                    var t = V(),
                        n = Object(ie.i)();
                    Object(o.useEffect)((function() {
                        n.gl.setClearColor(16777215, 0)
                    }), []), Object(o.useEffect)((function() {
                        var n = e.pathname.replace("/", "");
                        t.setActiveId(n)
                    }), [e.pathname]), Object(o.useEffect)((function() {
                        if ("video" === t.activeItemType) {
                            var e = l.find((function(e) {
                                return e.id === t.activeId
                            }));
                            t.setActivePosition(new tt.Vector3(e.position.x, e.position.y + -3, 0))
                        }
                        var n;
                        "audio" === t.activeItemType && (t.cameraHintId ? (console.log("a"), n = l.find((function(e) {
                            return e.id === t.activeId && e.cameraHintId == t.cameraHintId
                        }))) : (n = l.find((function(e) {
                            return e.id === t.activeId
                        })), console.log("b", n.id, t.activeId, n)), n ? t.setActivePosition(new tt.Vector3(n.position.x, n.position.y + -3, 0)) : console.log("No position found?"))
                    }), [t.activeId, t.cameraHintId]);
                    var a = Object(o.useState)((function() {
                            var e = new Qa(4, "hi ram!"),
                                n = T.MOBILE ? new tt.Vector2(5, 5) : new tt.Vector2(8, 5);
                            e.addBox(n), e.stepNulls(4);
                            var a = new Array(t.content.video.length).fill();
                            a = a.map((function() {
                                var t = e.addBox(new tt.Vector2(4, 4));
                                return T.MOBILE, e.stepRandomNulls(0, 1), t
                            })), e.computePartitions(), e.subDividePartitions(4);
                            var r = e.allocateRandomPartitions(e.partitions.length, 2);
                            return r = r.sort((function(e, t) {
                                var n = e.getCenter(new tt.Vector2),
                                    a = t.getCenter(new tt.Vector2);
                                return n.y == a.y ? n.x > a.x ? 1 : -1 : n.y > a.y ? 1 : -1
                            })), t.setCameraBounds(e.getBounds()), {
                                videos: a,
                                audio: r
                            }
                        })),
                        r = Object(R.a)(a, 1)[0],
                        i = Object(o.useMemo)((function() {
                            performance.now();
                            var e = [],
                                n = t.content && t.content.video.map((function(n, a) {
                                    var i = r.videos[a];
                                    return e.push({
                                        id: n.id,
                                        position: i
                                    }), c.a.createElement(za, {
                                        id: n.id,
                                        isActive: n.id == t.activeId,
                                        key: "video-".concat(a),
                                        type: "video",
                                        position: [i.x, i.y + -3, 0],
                                        subtitles: n.subtitles,
                                        hero: n.hero
                                    })
                                })),
                                a = 0,
                                i = !1,
                                o = r.audio.map((function(n, r) {
                                    var o = t.content.audio[a],
                                        s = n.getCenter(new tt.Vector2),
                                        u = n.getSize(new tt.Vector2),
                                        l = "".concat(o.id, "-").concat(r),
                                        f = t.cameraHintId ? o.id === t.activeId && l === t.cameraHintId : o.id === t.activeId && !i;
                                    f && (i = !0);
                                    var m = c.a.createElement(Oa, {
                                        cameraHintId: l,
                                        id: o.link,
                                        isActive: f,
                                        key: "audio-".concat(r),
                                        type: "audio",
                                        direction: r % 2 === 0 ? -1 : 1,
                                        position: [s.x, s.y + -3, 0],
                                        quality: o.quality,
                                        tickerText: o.text.ticker,
                                        dimensions: [u.x, 1]
                                    });
                                    return e.push({
                                        cameraHintId: l,
                                        id: o.id,
                                        position: s
                                    }), ++a >= t.content.audio.length && (a = 0), m
                                }));
                            return [
                                [].concat(Object(Ee.a)(n), Object(Ee.a)(o)), e
                            ]
                        }), [t.activeId]),
                        s = Object(R.a)(i, 2),
                        u = s[0],
                        l = s[1];
                    return c.a.createElement(c.a.Fragment, null, c.a.createElement(zn, {
                        position: [0, .5, 0]
                    }), u, c.a.createElement(Wn, null), c.a.createElement(pn, {
                        position: [0, 0, -25]
                    }))
                })),
                Wa = n(69);
            n(147);
            window.digitalData = {
                events: [],
                page: {
                    pageInfo: {
                        pageID: "",
                        language: "en",
                        pageName: "Sessiz Çığlıklar - Unutulmasın Diye",
                        destinationURL: "https://www.sessizcigliklar.com/",
                        referralURL: "",
                        originalReferrerURL: "",
                        previousPageURL: "",
                        previousPageName: "",
                        title: document.title,
                        siteName: "Sessiz Çığlıklar - Unutulmasın Diye",
                        domain: "www.sessizcigliklar.com",
                        path: window.location.pathname,
                        clickSource: "",
                        campaign: {
                            trackingCode: "",
                            campaignType: "",
                            channelSource: ""
                        }
                    },
                    category: {
                        primaryCategory: "interactive",
                        siteSubSection1: "",
                        siteSubSection2: "",
                        siteSubSection3: "",
                        siteSubSection4: ""
                    },
                    attributes: {
                        content: {
                            contentType: "Creative Content",
                            publishedDate: "",
                            updatedDate: ""
                        },
                        error: {
                            errorPage: "",
                            errorMessage: ""
                        }
                    }
                },
                user: {
                    userInfo: {
                        loggedIn: "",
                        userID: "",
                        syncUserID: [],
                        loggedInVisit: "",
                        loggedInType: "",
                        userType: "",
                        newsletterName: ""
                    },
                    userSegment: {
                        cxenseSegmentIDs: "",
                        adobeSegmentIDs: "",
                        strategicSegmentIDs: ""
                    }
                },
                environment: {
                    browser: {
                        userAgent: "",
                        version: ""
                    },
                    platform: {
                        deviceType: "",
                        deviceName: "",
                        sourceType: "web",
                        osName: ""
                    }
                }
            }, digitalData.page.pageInfo.previousPageURL = sessionStorage.getItem("pageURL") || "", digitalData.page.pageInfo.previousPageName = sessionStorage.getItem("pageName") || "", void 0 !== digitalData.environment.browser || (digitalData.environment.browser = {}), digitalData.environment.browser.userAgent = navigator.userAgent, digitalData.page.pageInfo.hasOwnProperty("destinationURL") && sessionStorage.setItem("pageURL", digitalData.page.pageInfo.destinationURL), digitalData.page.pageInfo.hasOwnProperty("pageName") && sessionStorage.setItem("pageName", digitalData.page.pageInfo.pageName), "" !== document.referrer && -1 === document.referrer.indexOf("sessizcigliklar.com") && (digitalData.page.pageInfo.referralURL = document.referrer, null === localStorage.getItem("originalReferrerURL") && localStorage.setItem("originalReferrerURL", document.referrer)), digitalData.page.pageInfo.originalReferrerURL = localStorage.getItem("originalReferrerURL") || "";
            var Fa = {
                    initialised: !1,
                    init: function() {
                        window.addEventListener("load", (function() {
                            (window.observerService = window.observerService || []).push(["notify", "pageLoadSuccess"]), Fa.initialised = !0
                        }))
                    },
                    trackRoute: function(e) {
                        e = (e = e.replace(/^\//g, "")).replace(/\/$/g, ""), Fa.trackUserInteraction("route", "route:" + e.split("/").join(":"))
                    }
                },
                Va = Fa,
                Ga = function() {
                    var e = V(),
                        t = Object(Wa.a)({
                            basename: ""
                        }),
                        n = function(e, t) {
                            var n = Object(o.useState)(null),
                                a = Object(R.a)(n, 2),
                                c = a[0],
                                s = a[1];
                            return Object(o.useEffect)((function() {
                                (function() {
                                    var n = Object(i.a)(r.a.mark((function n() {
                                        var a, i;
                                        return r.a.wrap((function(n) {
                                            for (;;) switch (n.prev = n.next) {
                                                case 0:
                                                    return n.next = 2, fetch(e, t);
                                                case 2:
                                                    return a = n.sent, n.next = 5, a.json();
                                                case 5:
                                                    i = n.sent, s(i);
                                                case 7:
                                                case "end":
                                                    return n.stop()
                                            }
                                        }), n)
                                    })));
                                    return function() {
                                        return n.apply(this, arguments)
                                    }
                                })()()
                            }), []), c
                        }("data/content.json");
                    Object(o.useEffect)((function() {
                        n && (n.video = n.video.sort((function() {
                            return Math.random() > .5 ? -1 : 1
                        })), e.setContent(n))
                    }), [n]), Object(o.useEffect)((function() {
                        "/" === t.location.pathname ? e.setAutoplayState(!0) : e.setAutoplayState(T.AUTOPLAY)
                    }), [T.AUTOPLAY]), Object(o.useEffect)((function() {
                        Va.init()
                    }), []);
                    var a = we() < Ie ? 1.5 : 2;
                    return c.a.createElement("div", {
                        id: "app"
                    }, n ? c.a.createElement(xe.b, {
                        history: t
                    }, c.a.createElement("div", {
                        id: "ui"
                    }, c.a.createElement(Et, null), c.a.createElement(qe, null), c.a.createElement(ln, null)), c.a.createElement(ie.a, {
                        id: "three-canvas",
                        style: !0,
                        concurrent: !0,
                        gl: {
                            powerPreference: "high-performance"
                        },
                        pixelRatio: Math.min(window.devicePixelRatio, a)
                    }, c.a.createElement(ce, null), c.a.createElement(o.Suspense, {
                        fallback: c.a.createElement(Je, {
                            children: c.a.createElement(lt, null)
                        })
                    }, c.a.createElement("ambientLight", {
                        intensity: 1
                    }), c.a.createElement(ut, null), c.a.createElement(xe.b, {
                        history: t
                    }, c.a.createElement(xe.a, {
                        path: "/:link?",
                        render: function(e) {
                            return c.a.createElement(Xa, {
                                key: "story-browser",
                                pathname: e.location.pathname
                            })
                        }
                    }))))) : null)
                },
                Ya = function() {
                    ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn", "log"].forEach((function(e) {
                        console[e] = function() {}
                    }))
                },
                _a = function() {
                    var e = Object(i.a)(r.a.mark((function e() {
                        var t;
                        return r.a.wrap((function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return t = "\n  Hello! Coded by us:\n  \ud83e\uddd0https://instagram.com/mikailustunerr | mikail ustuner\n  \ud83d\ude0bhttps://instagram.com/hamzakahraman | hamza kahraman\n  \n  Version: ".concat("1.4.0", "\n  "), console.log(t), Ya(), e.next = 5, T.init();
                                case 5:
                                    u.a.render(c.a.createElement(c.a.StrictMode, null, c.a.createElement(Ga, null)), document.getElementById("root"));
                                case 6:
                                case "end":
                                    return e.stop()
                            }
                        }), e)
                    })));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }()
        },
        120: function(e, t, n) {
            e.exports = n.p + "static/media/sad.d935710d.svg"
        },
        121: function(e, t, n) {
            e.exports = n.p + "static/media/shocked.a381ad5f.svg"
        },
        122: function(e, t, n) {
            e.exports = n.p + "static/media/thankful.1dc15d3b.svg"
        },
        123: function(e, t, n) {
            e.exports = n.p + "static/media/tittle.svg"
        },
        125: function(e, t, n) {
            e.exports = n.p + "static/media/facebook.d06798eb.svg"
        },
        126: function(e, t, n) {
            e.exports = n.p + "static/media/twitter.cb4ecdb8.svg"
        },
        127: function(e, t, n) {
            e.exports = n.p + "static/media/map.a963840f.png"
        },
        132: function(e, t) {
            e.exports = "#define GLSLIFY 1\nuniform float uTime;\nuniform float uDistortionStrength;\nuniform float uPixelationStrength;\nuniform float uOpacityStrength;\nuniform float uInterlaceStrength;\nuniform vec2 uResolution;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\n\nfloat map(float value, float min1, float max1, float min2, float max2) {\n  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n}\n\nvoid main() {\n    float d2 = map(sin(vUv.y * 5. + uTime * 20.), -.5, .5, 0., 1.) * .15;\n    d2 = floor(d2 /.033) * .033;\n\n    if (mod(gl_FragCoord.y, uInterlaceStrength) > 2. ) discard;\n\n    vec2 distortion = vec2(vUv.x +  d2 * uDistortionStrength, vUv.y);\n    vec4 color = texture2D(tDiffuse, distortion);\n/*     #ifdef alphaTest\n      if (color.a < 0.5)  discard;\n      gl_FragColor = vec4(color.rgb, uOpacityStrength);\n    #else */\n      gl_FragColor = vec4(color.rgb, color.a * uOpacityStrength);\n   /*  #endif */\n\n}"
        },
        133: function(e, t) {
            e.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\tvUv = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}"
        },
        134: function(e, t, n) {
            e.exports = n.p + "static/media/neue-machina-bold.30dbbdf8.woff"
        },
        136: function(e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAANTElEQVR4nO3d2W9VVRTH8UUHOkGLtLRIpUAtiIDQEikt1JYEKEJJoy0NFFSodUIlKokiwUAwxgdfjANEAaMRRYUHTXwAI3GIQIxBKKlTHGKMcXpw/Ac0a0cIQ4c7nnvOXt9P0vT17H27fl1733P2GSEi/woAk7L42AG7CADAMAIAMIwAAAwjAADDCADAMAIAMIwAAAwjAADDCADAMAIAMIwAAAwjAADDCADAMAIAMIwAAAwjAADDCADAMAIAMIwAAAwjAADDCADAMAIAMIwAAAwjAACjsrOzCQDAqrKyMgIAsKqiooIAAKwqLy8nAACrKisrCQDAqokTJxIAgFUEAGAYAQAYpgEwQkT+5Y8AsOfvv/+mAwAsKikpkeLiYgIAsKimpsaNmgAADCIAAMOuvPJKN3gCADCIDgAwjAAADDsbANwHABijXwH+9ddfbtB0AIAxM2fOPDdgAgAwZsaMGecGTAAAxhAAgGEEAGDY+XsAfAsAGDJ27Fj5/fffzw2YDgAwpK6u7oLBEgCAIbW1tRcMlgAADKEDAAybO3fuBYNnExAworCwUP755x/3TsCz6AAAI3T9f37xCwEA2NHQ0HDJWAkAwAgCADBs3rx5lwyeTUDAgPHjx8svv/xyyUDpAAADGhsbBxwkAQAYMND6XwgAwIbm5uYBx8keAOC5oqIi+fPPPyU3N/eSgdIBAJ7T9f9AxS8EAOC/lpaWQcdIAACeG2z9L+wBAH4rKCiQP/74Q/Lz8wccJx0A4LGmpqZBi18IAMBvS5cuHXJ8BADgsdbW1iEHxx4A4Kny8nL59ddfZcSIEYMOkA4A8NSSJUuGLH4hAAB/Ddf+C0sAwE9ZWVnu8V9dBgyFDgDwkB7+MVzxCwEA+KmtrS2mcREAgIdWrlwZ06DYAwA8U1VVJT/88ENMg6IDADwTa/svBADgn46OjpjHxBIA8Ehpaan7+m+wA0AuRgcAeKS9vT3m4hcCAPBLZ2dnXONhCQB4oqSkRH777TfJy8uLeUB0AIAn9Lv/eIpfCADAH93d3XGPhSUA4IGysjL5+eef49oAFDoAwA9dXV1xF78QAIAf1q5dm9A4WAIAETdp0iT5/vvvhz39ZyB0AEDE6X//RIpf6ACAaNPC//LLL+Wqq65KaBx0AECELVy4MOHiFwIAiLYNGzYkdf0sAYCI0vf+65N/o0ePTngAdABAROl3/8kUvxAAQHT19vYmfe0sAYAImjVrlvT39yd94XQAQARt3LgxJRdNBwBEzKhRo+Snn36S4uLipC+cDgCImHXr1qWk+IUOAIie06dPS21tbUqumw4AiJBFixalrPiFAACiJVWbf2exBAAiQl/59d1330lOTk7KLpgOAIiITZs2pbT4hQ4AiAb96u/HH3+UMWPGpPR66QCACOjp6Ul58QsdABB+2vZ/8803Mnny5JRfKx0AEHKrV69OS/ELHQAQbnrkV19fn8yePTst10kHAITY8uXL01b8QgAA4bZly5a0Xh9LACCkmpqa5KOPPkrrxdEBACG1ffv2tF8YHQAQQgsWLJDjx4+n/cLoAIAQ2rFjRyAXRQcAhExjY6OcOHEikIuiAwBCJqj//kIHAIRLS0uLfPDBB4FdEwEAhIh+7adf/wWFJQAQEm1tbYEWv9ABAOGQlZUlp06dkjlz5gR6PXQAQAisWbMm8OIXOgAg8/Ly8uSLL76Q6urqwK+FDgDIMD3rLxPFL3QAQGaVlpbKt99+m5bjvmJBBwBkkD7wk6niFzoAIHOmTZsmn332meTm5mbsGugAgAx54oknMlr8QgcAZEZra6u88847GZ99AgAI2MiRI+XMmTMyffr0jE89SwAgYJs3bw5F8QsdABCsyspK+eqrr9yrvsKADgAIkG78haX4hQ4ACM7ixYvl6NGjoZpxAgAIQH5+vvT390tNTU2oppslABCAbdu2ha74hQ4ASL+rr75aTp8+7Z76Cxs6ACCN9OWezz33XCiLXwgAIL3uuOMOaW5uDu0sswQA0qSqqso97DN69OjQTjEdAJAme/bsCXXxCwEApMeGDRtk2bJloZ9dlgBAik2YMMG1/pdddlnop5YOAEgh3fXfu3dvJIpfCAAgtXTXf8WKFZGZVZYAQIronX59fX1SVFQUmSmlAwBSIDs7W/bv3x+p4hcCAEiNrVu3SkNDQ+RmkyUAkKT6+no5duxYxg/4TAQBACShuLjYrfunTJkSyWlkCQAkQR/0iWrxCwEAJK6np0e6u7sjPYMsAYAE6Km+J0+ejNyu/8XoAIA4FRYWyhtvvBH54hcCAIjfrl27ZPbs2V7MHAEAxOG2225zT/r5gj0AIEZ1dXVy/PhxKSgo8GbKCAAgBiUlJXLq1Cmprq72arpYAgDD0Pv8Dxw44F3xCwEADG/nzp2ResQ3HiwBgCF0dXW5r/z0oA8fEQDAIK655hr5+OOP3ff+vmIJAAxg3Lhx8tZbb3ld/EIAAJcaOXKkHDp0yMtNv4sRAMBF9u3bJy0tLSamhQAAzvPwww/LzTffbGZK2AQE/tfZ2elaf193/AdCAAAiMn/+fHnvvfe83/S7GAEA8/Q47xMnTridf2vYA4BpWvSHDx82WfxCAMAybffffvtt1wFYRQDAJD3C+7XXXnNrf8sIAJiju/wvvviitLe3m//wCQCY8+yzz8q6devMf/BCAMCaRx99VO6++24+9//xNSDMuP/+++XJJ5/kAz8PAQATbr31VnePv6W7/GJBAMB769evlxdeeMEd7YULEQDw2po1a+SVV16h+AdBAMBbq1atktdff53iHwLfAsBLHR0d8uqrr1L8wyAA4B39z693+enJPhgaAQCv6Ou6te2n+GNDAMAbt9xyi+zfv5+2Pw4EALzQ29vr7u+n+ONDACDy9A6/vXv3SlYWf87xYsYQaXpvv97eyx1+icmJ4kUDWvDPPPOM3HPPPebnIhkEACJHD/PQ9T6P9CaPAECkjBo1yr2s09e39QaNAEBkVFRUuDP85s2bx4eWIgQAImHq1Kly5MgRE+/rCxLfAiD09OBOPbef4k89AgChpvf1v//++1JWVsYHlQYEAEJr69atcvDgQSkoKOBDShP2ABA6eXl58vzzz7uTfJBeBABCRVv9N998U5qamvhgAsASAKFRV1cnn3zyCcUfIAIAoaDtvu70T5kyhQ8kQAQAMkoP7ti1a5e89NJLkp+fz4cRMPYAkDGVlZVy6NAhaWxs5EPIEDoAZERLS4t8+umnFH+GEQAI3AMPPCBHjx519/Yjs1gCIDD6JJ+e3KMv60A4EAAIxPTp0916f9asWUx4iLAEQNrpizlPnjxJ8YcQHQDSpri42N3SS8sfXgQA0qK+vt69nYdHeMONJQBSKicnR7Zt2ybHjh2j+COADgApU1NTIy+//DLf7UcIHQCSpkd033XXXdLX10fxRwwdAJIyYcIE2bdvnyxfvpyJjCA6ACSsp6dHPv/8c4o/wugAELeqqirZs2ePLFu2jMmLODoAxEzX+nfeeaf09/dT/J6gA0BM9FZevamnubmZCfMIHQCGpCfy6ht4z5w5Q/F7iA4Ag1qyZIns3r3bvZUHfqIDwCUuv/xyOXDggLz77rsUv+cIAJyj5/M99NBD8vXXX0t3dzcTYwBLADjXX3+9PPXUUzJt2jQmxBA6AOP0/n19Ecfhw4cpfoMIAKP0DTxPP/20u5PvhhtusD4dZrEEMEbX+Zs2bZJHHnlExowZY306zCMAjMjKynIn8+zcudO1/YAQADasXLlSHnvsMZkzZ471qcBFCACP6Z17jz/+uCxcuND6VGAQbAJ6SA/lOHLkiHz44YcUP4ZEB+CRBQsWyI4dO6S1tdX6VCBGBIAH9H3627dvl6VLl1qfCsSJAIgofTZf797bsmWLe9EmkAgCIGL02O3Vq1fLgw8+yK4+kkYARIS+WFPP4Nu8ebNMnjzZ+nQgRQiAkNNiv/fee6W3t5c795ByBEBI6cbefffdJzfeeKNkZ2dbnw6kCQEQItrmr1271r1ko66uzvp0IAAEQAjoa7M3btwoN910k3ujLhAUAiBD9L/9qlWr3Npe230gEwiAgOnderfffrsrfg0BIJMIgADom3R0bb9+/Xp3vj4QFgRAmuiJO11dXa7w9YEcvXMPCBsCIIV0A6+9vd0dvKEP5OTm5nozNviJAEhSaWmpK/rOzk73Io28vLxIjwe2EAAJmDhxojtlp6OjQxYtWuTuzweiiL/cGOh5evX19a7o29rapLa2NvTXDMSCABhEeXm5e75e23ot+nHjxoXyOoFkEAD/y8/Pl+uuu84Vvf7oo7bs3MN3ZgOgqKjI3ZSjRa8HamiLryEAWGImAPSNt/Pnz3cHZmrRX3vttXxNB/O8DIDCwkK3UacF39DQ4H70bjwAF4p8AIwdO9Y9OqsFr7/nzp3rXnLJM/TA8CITAHoazowZM879zJw5091Xz392IHGhCgAtcn1vXXV1tft99mfq1Kkyfvz4EFwh4JdAAkB33PWWWf0uXR+SqaiocP+5r7jiCvdbf/TuOg7DAAIkIv8BULJWCL2VTyIAAAAASUVORK5CYII="
        },
        143: function(e, t, n) {
            e.exports = n.p + "static/media/phone.54ac0c5e.png"
        },
        144: function(e, t, n) {
            e.exports = "#define GLSLIFY 1\nuniform float uInverse;\nuniform float uSaturation;\nuniform float uBrightness;\nuniform float uContrast;\nuniform float uWhiteOverlay;\nuniform float uTime;\nuniform float uTimeOffset;\nuniform float uRolloverStrength;\nuniform vec2 uOffset;\nuniform float uScale;\nuniform sampler2D tDiffuse;\nuniform sampler2D tAlpha;\nvarying vec2 vUv;\n\n/* const float scale = .93; */\nconst vec4 white = vec4(1.);\nconst vec4 yellow = vec4(250./255., 235./255., 175./255., 1.);\n\n" + n(145) + " \n\nfloat map(float value, float min1, float max1, float min2, float max2) {\n  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n}\n\nvec4 invert(vec4 color) {\n    return vec4(1.0 - color.r, 1.0 -color.g, 1.0 -color.b, 1);\n}\n\nvec4 saturation(vec3 color, float strength) {\n    float desaturation = 1. - strength;\n\tvec3 grayXfer = vec3(0.3, 0.59, 0.11);\n\tvec3 gray = vec3(dot(grayXfer, color));\n\treturn vec4(mix(color, gray, desaturation), 1.0);\n}\n\nvec4 brightnessContrast(vec3 color, float brightness, float contrast) {\n    vec3 colorContrasted = color * contrast;\n\tvec3 bright = colorContrasted + vec3(brightness, brightness, brightness);\n    return vec4(bright, 1.);\n}\n\nvoid main() {\n    vec2 vUvScaled = (vUv - 0.5) * uScale + (0.5 /* * uScale */);\n    vec4 color = texture2D(tDiffuse, vUvScaled  + uOffset );\n    if (uInverse > 0.) {\n        vec4 colorInverse = invert(color);\n        color = mix(color, colorInverse, uInverse);\n    }\n    if (uSaturation < 1.) {\n        color = saturation(color.rgb, uSaturation);\n    }\n    color = brightnessContrast(color.rgb, uBrightness, uContrast);\n\n    if (uRolloverStrength > 0.) {\n        float s1 = map(sin(uTime * uRolloverStrength * 7. + 3. + uTimeOffset), -1., 1., 0., 1.) * uRolloverStrength * .3;\n        float s2 = map(sin(uTime * 1. + uTimeOffset), -1., 1., 0., 1.) * uRolloverStrength;\n        float s = (s1 + s2) *.5 * (1. - uInverse);\n        color = vec4(blendOverlay( color.rgb, yellow.rgb, s), color.a);\n    }\n\n    // this is not alpha anymore, it just cuts a white border arounnd the image\n    vec4 alpha = texture2D(tAlpha, vUv);\n    color = color + 1. - alpha.r;\n    color = mix(color, white, uWhiteOverlay);\n    \n    gl_FragColor = vec4(color.rgb, 1. );\n}"
        },
        146: function(e, t) {
            e.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\tvUv = uv;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}"
        },
        47: function(e, t, n) {
            e.exports = n.p + "static/media/neue-machina-light.405b7e66.woff"
        },
        64: function(e, t, n) {
            e.exports = n.p + "static/media/sessizcigliklar.png"
        },
        65: function(e, t, n) {
            e.exports = n.p + "static/media/tittle.png"
        },
        66: function(e, t, n) {
            e.exports = n.p + "static/media/large-alpha-map.92efc6e8.png"
        },
        67: function(e, t, n) {
            e.exports = n.p + "static/media/small-alpha-map.696c8731.png"
        }
    }
]);