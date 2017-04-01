! function(e, t) {
    "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.SuperGif = t()
}(this, function() {
    var e = function(e) {
            return e.reduce(function(e, t) {
                return 2 * e + t
            }, 0)
        },
        t = function(e) {
            for (var t = [], n = 7; n >= 0; n--) t.push(!!(e & 1 << n));
            return t
        },
        n = function(e) {
            this.data = e, this.len = this.data.length, this.pos = 0, this.readByte = function() {
                if (this.pos >= this.data.length) throw new Error("Attempted to read past end of stream.");
                return e instanceof Uint8Array ? e[this.pos++] : 255 & e.charCodeAt(this.pos++)
            }, this.readBytes = function(e) {
                for (var t = [], n = 0; e > n; n++) t.push(this.readByte());
                return t
            }, this.read = function(e) {
                for (var t = "", n = 0; e > n; n++) t += String.fromCharCode(this.readByte());
                return t
            }, this.readUnsigned = function() {
                var e = this.readBytes(2);
                return (e[1] << 8) + e[0]
            }
        },
        r = function(e, t) {
            for (var n, r, a = 0, i = function(e) {
                    for (var n = 0, r = 0; e > r; r++) t.charCodeAt(a >> 3) & 1 << (7 & a) && (n |= 1 << r), a++;
                    return n
                }, o = [], u = 1 << e, l = u + 1, f = e + 1, c = [], s = function() {
                    c = [], f = e + 1;
                    for (var t = 0; u > t; t++) c[t] = [t];
                    c[u] = [], c[l] = null
                };;)
                if (r = n, n = i(f), n !== u) {
                    if (n === l) break;
                    if (n < c.length) r !== u && c.push(c[r].concat(c[n][0]));
                    else {
                        if (n !== c.length) throw new Error("Invalid LZW code.");
                        c.push(c[r].concat(c[r][0]))
                    }
                    o.push.apply(o, c[n]), c.length === 1 << f && 12 > f && f++
                } else s();
            return o
        },
        a = function(n, a) {
            a || (a = {});
            var i = function(e) {
                    for (var t = [], r = 0; e > r; r++) t.push(n.readBytes(3));
                    return t
                },
                o = function() {
                    var e, t;
                    t = "";
                    do e = n.readByte(), t += n.read(e); while (0 !== e);
                    return t
                },
                u = function() {
                    var r = {};
                    if (r.sig = n.read(3), r.ver = n.read(3), "GIF" !== r.sig) throw new Error("Not a GIF file.");
                    r.width = n.readUnsigned(), r.height = n.readUnsigned();
                    var o = t(n.readByte());
                    r.gctFlag = o.shift(), r.colorRes = e(o.splice(0, 3)), r.sorted = o.shift(), r.gctSize = e(o.splice(0, 3)), r.bgColor = n.readByte(), r.pixelAspectRatio = n.readByte(), r.gctFlag && (r.gct = i(1 << r.gctSize + 1)), a.hdr && a.hdr(r)
                },
                l = function(r) {
                    var i = function(r) {
                            var i = (n.readByte(), t(n.readByte()));
                            r.reserved = i.splice(0, 3), r.disposalMethod = e(i.splice(0, 3)), r.userInput = i.shift(), r.transparencyGiven = i.shift(), r.delayTime = n.readUnsigned(), r.transparencyIndex = n.readByte(), r.terminator = n.readByte(), a.gce && a.gce(r)
                        },
                        u = function(e) {
                            e.comment = o(), a.com && a.com(e)
                        },
                        l = function(e) {
                            n.readByte();
                            e.ptHeader = n.readBytes(12), e.ptData = o(), a.pte && a.pte(e)
                        },
                        f = function(e) {
                            var t = function(e) {
                                    n.readByte();
                                    e.unknown = n.readByte(), e.iterations = n.readUnsigned(), e.terminator = n.readByte(), a.app && a.app.NETSCAPE && a.app.NETSCAPE(e)
                                },
                                r = function(e) {
                                    e.appData = o(), a.app && a.app[e.identifier] && a.app[e.identifier](e)
                                };
                            n.readByte();
                            switch (e.identifier = n.read(8), e.authCode = n.read(3), e.identifier) {
                                case "NETSCAPE":
                                    t(e);
                                    break;
                                default:
                                    r(e)
                            }
                        },
                        c = function(e) {
                            e.data = o(), a.unknown && a.unknown(e)
                        };
                    switch (r.label = n.readByte(), r.label) {
                        case 249:
                            r.extType = "gce", i(r);
                            break;
                        case 254:
                            r.extType = "com", u(r);
                            break;
                        case 1:
                            r.extType = "pte", l(r);
                            break;
                        case 255:
                            r.extType = "app", f(r);
                            break;
                        default:
                            r.extType = "unknown", c(r)
                    }
                },
                f = function(u) {
                    var l = function(e, t) {
                        for (var n = new Array(e.length), r = e.length / t, a = function(r, a) {
                                var i = e.slice(a * t, (a + 1) * t);
                                n.splice.apply(n, [r * t, t].concat(i))
                            }, i = [0, 4, 2, 1], o = [8, 8, 4, 2], u = 0, l = 0; 4 > l; l++)
                            for (var f = i[l]; r > f; f += o[l]) a(f, u), u++;
                        return n
                    };
                    u.leftPos = n.readUnsigned(), u.topPos = n.readUnsigned(), u.width = n.readUnsigned(), u.height = n.readUnsigned();
                    var f = t(n.readByte());
                    u.lctFlag = f.shift(), u.interlaced = f.shift(), u.sorted = f.shift(), u.reserved = f.splice(0, 2), u.lctSize = e(f.splice(0, 3)), u.lctFlag && (u.lct = i(1 << u.lctSize + 1)), u.lzwMinCodeSize = n.readByte();
                    var c = o();
                    u.pixels = r(u.lzwMinCodeSize, c), u.interlaced && (u.pixels = l(u.pixels, u.width)), a.img && a.img(u)
                },
                c = function() {
                    var e = {};
                    switch (e.sentinel = n.readByte(), String.fromCharCode(e.sentinel)) {
                        case "!":
                            e.type = "ext", l(e);
                            break;
                        case ",":
                            e.type = "img", f(e);
                            break;
                        case ";":
                            e.type = "eof", a.eof && a.eof(e);
                            break;
                        default:
                            throw new Error("Unknown block: 0x" + e.sentinel.toString(16))
                    }
                    "eof" !== e.type && setTimeout(c, 0)
                },
                s = function() {
                    u(), setTimeout(c, 0)
                };
            s()
        },
        i = function(e) {
            var t = {
                vp_l: 0,
                vp_t: 0,
                vp_w: null,
                vp_h: null,
                c_w: null,
                c_h: null,
                auto_play: !0
            };
            for (var r in e) t[r] = e[r];
            t.vp_w && t.vp_h && (t.is_vp = !0);
            var i, o, u = null,
                l = !1,
                f = null,
                c = null,
                s = null,
                d = null,
                p = null,
                h = null,
                g = null,
                y = !0,
                v = !0,
                m = !1,
                _ = [],
                w = [],
                x = document.createElement("img");
            x.src = t.gif;
            var B, b, T = t.hasOwnProperty("on_end") ? t.on_end : null,
                P = t.hasOwnProperty("loop_delay") ? t.loop_delay : 0,
                k = t.hasOwnProperty("loop_mode") ? t.loop_mode : "auto",
                C = function() {
                    f = null, c = null, p = s, s = null, h = null
                },
                S = function() {
                    try {
                        a(i, N)
                    } catch (e) {
                        U("parse")
                    }
                },
                E = function(e, t) {
                    b.resize(e, t), b.width = e, b.height = t
                },
                I = function(e, t) {
                    return w[e] ? ("undefined" != typeof t.x && (w[e].x = t.x), void("undefined" != typeof t.y && (w[e].y = t.y))) : void(w[e] = t)
                },
                U = function(e) {
                    u = e, _ = []
                },
                A = function(e) {
                    o = e, E(o.width, o.height)
                },
                G = function(e) {
                    z(), C(), f = e.transparencyGiven ? e.transparencyIndex : null, c = e.delayTime, s = e.disposalMethod
                },
                z = function() {
                    h && (_.push({
                        data: h.getImageData(0, 0, o.width, o.height),
                        delay: c
                    }), w.push({
                        x: 0,
                        y: 0
                    }))
                },
                F = function(e) {
                    h || (h = B.getContext("2d"));
                    var t = _.length,
                        n = e.lctFlag ? e.lct : o.gct;
                    t > 0 && (3 === p ? null !== d ? h.putImageData(_[d].data, 0, 0) : h.clearRect(g.leftPos, g.topPos, g.width, g.height) : d = t - 1, 2 === p && h.clearRect(g.leftPos, g.topPos, g.width, g.height));
                    var r = h.getImageData(e.leftPos, e.topPos, e.width, e.height),
                        a = r.data;
                    e.pixels.forEach(function(e, t) {
                        e !== f && (a[4 * t + 0] = n[e][0], a[4 * t + 1] = n[e][1], a[4 * t + 2] = n[e][2], a[4 * t + 3] = 255)
                    }), r.data.set(a), h.putImageData(r, e.leftPos, e.topPos), m || (m = !0), g = e
                },
                D = function() {
                    var e = -1,
                        n = 0,
                        r = function() {
                            var t = v ? 1 : -1;
                            return (e + t + _.length) % _.length
                        },
                        a = function(t) {
                            e += t, l()
                        },
                        i = function() {
                            null !== T && T(x), n++
                        },
                        o = function() {
                            var t = !1,
                                o = function() {
                                    if (t = y) {
                                        a(1);
                                        var u = 10 * _[e].delay;
                                        u || (u = 100);
                                        var l = r();
                                        0 === l && (u += P, setTimeout(i, u - 1)), (k !== !1 || 0 !== l || 0 > n) && setTimeout(o, u)
                                    }
                                };
                            return function() {
                                t || setTimeout(o, 0)
                            }
                        }(),
                        l = function() {
                            var t;
                            e = parseInt(e, 10), e > _.length - 1 && (e = 0), 0 > e && (e = 0), t = w[e], B.getContext("2d").putImageData(_[e].data, t.x, t.y)
                        },
                        f = function() {
                            y = !0, o()
                        },
                        c = function() {
                            y = !1
                        };
                    return {
                        init: function() {
                            u || (t.auto_play ? o() : (e = 0, l()))
                        },
                        step: o,
                        play: f,
                        pause: c,
                        playing: y,
                        move_relative: a,
                        current_frame: function() {
                            return e
                        },
                        length: function() {
                            return _.length
                        },
                        move_to: function(t) {
                            e = t, l()
                        },
                        get_frames: function() {
                            return _
                        },
                        buffer: function() {
                            return b
                        },
                        get_playing: function() {
                            return y
                        }
                    }
                }(),
                M = function() {},
                R = function(e, t) {
                    return function(t) {
                        e(t)
                    }
                },
                N = {
                    hdr: R(A),
                    gce: R(G),
                    com: R(M),
                    app: {
                        NETSCAPE: R(M)
                    },
                    img: R(F, !0),
                    eof: function(e) {
                        z(), D.init(), l = !1, console.log('loading-gif-library') , j && j(x)
                    }
                },
                O = function() {
                    b = t.p5inst.createImage(0, 0), B = b.canvas, L = !0
                },
                H = function() {
                    var e;
                    return e = t.max_width && o && o.width > t.max_width ? t.max_width / o.width : 1
                },
                L = !1,
                j = !1,
                q = function(e) {
                    return l ? !1 : (j = e ? e : !1, l = !0, _ = [], C(), d = null, p = null, h = null, g = null, !0)
                };
            return {
                play: D.play,
                pause: D.pause,
                move_relative: D.move_relative,
                move_to: D.move_to,
                get_playing: D.get_playing,
                get_canvas: function() {
                    return canvas
                },
                get_canvas_scale: function() {
                    return H()
                },
                get_loading: function() {
                    return l
                },
                get_auto_play: function() {
                    return t.auto_play
                },
                get_length: function() {
                    return D.length()
                },
                get_current_frame: function() {
                    return D.current_frame()
                },
                get_frames: function() {
                    return D.get_frames()
                },
                buffer: function() {
                    return D.buffer()
                },
                load_url: function(e, t) {
                    if (q(t)) {
                        var r = new XMLHttpRequest;
                        r.overrideMimeType("text/plain; charset=x-user-defined"), r.onloadstart = function() {
                            L || O()
                        }, r.onload = function(e) {
                            i = new n(r.responseText), setTimeout(S, 0)
                        }, r.onerror = function() {
                            U("xhr")
                        }, r.open("GET", e, !0), r.send()
                    }
                },
                load: function(e) {
                    this.load_url(x.src, e)
                },
                load_raw: function(e, t) {
                    q(t) && (L || O(), i = new n(e), setTimeout(S, 0))
                },
                set_frame_offset: I
            }
        };
    return i
}),
function() {
    p5.prototype.loadGif = function(e, t) {
        var n = new SuperGif({
            gif: e,
            p5inst: this
        });
        n.load(t);
        var r = n.buffer();
        return r.play = n.play, r.pause = n.pause, r.playing = n.get_playing, r.frames = n.get_frames, r.totalFrames = n.get_length, r.loaded = function() {
            return !n.get_loading()
        }, r.frame = function(e) {
            return "number" != typeof e ? n.get_current_frame() : void n.move_to(e)
        }, r
    }, p5.prototype.loadRawGif = function(e, t) {
        var n = new SuperGif({
            gif: "",
            p5inst: this
        });
        n.load_raw(e, t);
        var r = n.buffer();
        return r.play = n.play, r.pause = n.pause, r.playing = n.get_playing, r.frames = n.get_frames, r.totalFrames = n.get_length, r.loaded = function() {
            return !n.get_loading()
        }, r.frame = function(e) {
            return "number" != typeof e ? n.get_current_frame() : void n.move_to(e)
        }, r
    }
}();