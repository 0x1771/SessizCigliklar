(this["webpackJsonpthe-feed-woman"] = this["webpackJsonpthe-feed-woman"] || []).push([
    [5], {
        11: function(e, o, n) {
            "use strict";
            n.r(o), n.d(o, "check", (function() {
                return c
            }));
            var t = n(1),
                i = n.n(t),
                r = n(49),
                a = i.a.name,
                d = parseFloat(i.a.version, 10),
                c = function() {
                    var e = {
                        webgl: !1,
                        proxy: !1,
                        goodBrowser: !1
                    };
                    try {
                        var o = document.createElement("canvas");
                        e.webgl = !!window.WebGLRenderingContext && (o.getContext("webgl") || o.getContext("experimental-webgl"))
                    } catch (t) {
                        e.webgl = !1
                    }
                    e.proxy = !!window.Proxy;
                    var n = Object(r.a)(window.navigator).any;
                    return a.includes("Firefox") && n || a.includes("Safari") && d <= 11 || a.includes("IE") ? e.goodBrowser = !1 : e.goodBrowser = !0, e.webgl && e.proxy && e.goodBrowser
                }
        },
        49: function(e, o, n) {
            "use strict";
            n.d(o, "a", (function() {
                return m
            }));
            var t = /iPhone/i,
                i = /iPod/i,
                r = /iPad/i,
                a = /\biOS-universal(?:.+)Mac\b/i,
                d = /\bAndroid(?:.+)Mobile\b/i,
                c = /Android/i,
                p = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,
                s = /Silk/i,
                u = /Windows Phone/i,
                l = /\bWindows(?:.+)ARM\b/i,
                b = /BlackBerry/i,
                f = /BB10/i,
                h = /Opera Mini/i,
                w = /\b(CriOS|Chrome)(?:.+)Mobile/i,
                v = /Mobile(?:.+)Firefox\b/i,
                g = function(e) {
                    return "undefined" !== typeof e && "MacIntel" === e.platform && "number" === typeof e.maxTouchPoints && e.maxTouchPoints > 1 && "undefined" === typeof MSStream
                };

            function m(e) {
                var o = {
                    userAgent: "",
                    platform: "",
                    maxTouchPoints: 0
                };
                e || "undefined" === typeof navigator ? "string" === typeof e ? o.userAgent = e : e && e.userAgent && (o = {
                    userAgent: e.userAgent,
                    platform: e.platform,
                    maxTouchPoints: e.maxTouchPoints || 0
                }) : o = {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    maxTouchPoints: navigator.maxTouchPoints || 0
                };
                var n = o.userAgent,
                    m = n.split("[FBAN");
                "undefined" !== typeof m[1] && (n = m[0]), "undefined" !== typeof(m = n.split("Twitter"))[1] && (n = m[0]);
                var x = function(e) {
                        return function(o) {
                            return o.test(e)
                        }
                    }(n),
                    y = {
                        apple: {
                            phone: x(t) && !x(u),
                            ipod: x(i),
                            tablet: !x(t) && (x(r) || g(o)) && !x(u),
                            universal: x(a),
                            device: (x(t) || x(i) || x(r) || x(a) || g(o)) && !x(u)
                        },
                        amazon: {
                            phone: x(p),
                            tablet: !x(p) && x(s),
                            device: x(p) || x(s)
                        },
                        android: {
                            phone: !x(u) && x(p) || !x(u) && x(d),
                            tablet: !x(u) && !x(p) && !x(d) && (x(s) || x(c)),
                            device: !x(u) && (x(p) || x(s) || x(d) || x(c)) || x(/\bokhttp\b/i)
                        },
                        windows: {
                            phone: x(u),
                            tablet: x(l),
                            device: x(u) || x(l)
                        },
                        other: {
                            blackberry: x(b),
                            blackberry10: x(f),
                            opera: x(h),
                            firefox: x(v),
                            chrome: x(w),
                            device: x(b) || x(f) || x(h) || x(v) || x(w)
                        },
                        any: !1,
                        phone: !1,
                        tablet: !1
                    };
                return y.any = y.apple.device || y.android.device || y.windows.device || y.other.device, y.phone = y.apple.phone || y.android.phone || y.windows.phone, y.tablet = y.apple.tablet || y.android.tablet || y.windows.tablet, y
            }
        }
    }
]);
//# sourceMappingURL=5.83b0cf51.chunk.js.map