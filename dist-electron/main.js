var En = Object.defineProperty;
var Pt = (e) => {
  throw TypeError(e);
};
var gn = (e, t, r) => t in e ? En(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var z = (e, t, r) => gn(e, typeof t != "symbol" ? t + "" : t, r), je = (e, t, r) => t.has(e) || Pt("Cannot " + r);
var I = (e, t, r) => (je(e, t, "read from private field"), r ? r.call(e) : t.get(e)), M = (e, t, r) => t.has(e) ? Pt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), X = (e, t, r, n) => (je(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), De = (e, t, r) => (je(e, t, "access private method"), r);
import { app as Re, BrowserWindow as vr } from "electron";
import { fileURLToPath as Oe } from "node:url";
import N from "node:path";
import A from "node:process";
import tt, { execFile as Pe, ChildProcess as $n, spawn as wn } from "node:child_process";
import Sn from "node:http";
import { Buffer as Rr } from "node:buffer";
import rt, { constants as Tr } from "node:fs/promises";
import lt, { constants as br } from "node:os";
import Le, { createWriteStream as yn, createReadStream as In } from "node:fs";
import { promisify as Ne, debuglog as vn } from "node:util";
import Rn from "child_process";
import ut from "path";
import ft from "fs";
import { setTimeout as Tn } from "node:timers/promises";
import bn from "stream";
import Ar from "node:vm";
import An from "node:net";
let Ue;
function On() {
  try {
    return Le.statSync("/.dockerenv"), !0;
  } catch {
    return !1;
  }
}
function Pn() {
  try {
    return Le.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return !1;
  }
}
function Ln() {
  return Ue === void 0 && (Ue = On() || Pn()), Ue;
}
let ke;
const Nn = () => {
  try {
    return Le.statSync("/run/.containerenv"), !0;
  } catch {
    return !1;
  }
};
function nt() {
  return ke === void 0 && (ke = Nn() || Ln()), ke;
}
const Lt = () => {
  if (A.platform !== "linux")
    return !1;
  if (lt.release().toLowerCase().includes("microsoft"))
    return !nt();
  try {
    return Le.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !nt() : !1;
  } catch {
    return !1;
  }
}, Se = A.env.__IS_WSL_TEST__ ? Lt : Lt();
function ce(e, t, r) {
  const n = (s) => Object.defineProperty(e, t, { value: s, enumerable: !0, writable: !0 });
  return Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    get() {
      const s = r();
      return n(s), s;
    },
    set(s) {
      n(s);
    }
  }), e;
}
const xn = Ne(Pe);
async function Cn() {
  if (A.platform !== "darwin")
    throw new Error("macOS only");
  const { stdout: e } = await xn("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]), t = /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(e);
  return (t == null ? void 0 : t.groups.id) ?? "com.apple.Safari";
}
const _n = Ne(Pe);
async function Gn(e, { humanReadableOutput: t = !0 } = {}) {
  if (A.platform !== "darwin")
    throw new Error("macOS only");
  const r = t ? [] : ["-ss"], { stdout: n } = await _n("osascript", ["-e", e, r]);
  return n.trim();
}
async function Fn(e) {
  return Gn(`tell application "Finder" to set app_path to application file id "${e}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`);
}
const jn = Ne(Pe), Dn = {
  AppXq0fevzme2pys62n3e0fbqa7peapykr8v: { name: "Edge", id: "com.microsoft.edge.old" },
  MSEdgeDHTML: { name: "Edge", id: "com.microsoft.edge" },
  // On macOS, it's "com.microsoft.edgemac"
  MSEdgeHTM: { name: "Edge", id: "com.microsoft.edge" },
  // Newer Edge/Win10 releases
  "IE.HTTP": { name: "Internet Explorer", id: "com.microsoft.ie" },
  FirefoxURL: { name: "Firefox", id: "org.mozilla.firefox" },
  ChromeHTML: { name: "Chrome", id: "com.google.chrome" },
  BraveHTML: { name: "Brave", id: "com.brave.Browser" },
  BraveBHTML: { name: "Brave Beta", id: "com.brave.Browser.beta" },
  BraveSSHTM: { name: "Brave Nightly", id: "com.brave.Browser.nightly" }
};
class Nt extends Error {
}
async function Un(e = jn) {
  const { stdout: t } = await e("reg", [
    "QUERY",
    " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
    "/v",
    "ProgId"
  ]), r = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(t);
  if (!r)
    throw new Nt(`Cannot find Windows browser in stdout: ${JSON.stringify(t)}`);
  const { id: n } = r.groups, s = Dn[n];
  if (!s)
    throw new Nt(`Unknown browser ID: ${n}`);
  return s;
}
const kn = Ne(Pe), Bn = (e) => e.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (t) => t.toUpperCase());
async function Mn() {
  if (A.platform === "darwin") {
    const e = await Cn();
    return { name: await Fn(e), id: e };
  }
  if (A.platform === "linux") {
    const { stdout: e } = await kn("xdg-mime", ["query", "default", "x-scheme-handler/http"]), t = e.trim();
    return { name: Bn(t.replace(/.desktop$/, "").replace("-", " ")), id: t };
  }
  if (A.platform === "win32")
    return Un();
  throw new Error("Only macOS, Linux, and Windows are supported");
}
const st = N.dirname(Oe(import.meta.url)), xt = N.join(st, "xdg-open"), { platform: Z, arch: Ct } = A, Vn = /* @__PURE__ */ (() => {
  const e = "/mnt/";
  let t;
  return async function() {
    if (t)
      return t;
    const r = "/etc/wsl.conf";
    let n = !1;
    try {
      await rt.access(r, Tr.F_OK), n = !0;
    } catch {
    }
    if (!n)
      return e;
    const s = await rt.readFile(r, { encoding: "utf8" }), o = new RegExp("(?<!#.*)root\\s*=\\s*(?<mountPoint>.*)", "g").exec(s);
    return o ? (t = o.groups.mountPoint.trim(), t = t.endsWith("/") ? t : `${t}/`, t) : e;
  };
})(), _t = async (e, t) => {
  let r;
  for (const n of e)
    try {
      return await t(n);
    } catch (s) {
      r = s;
    }
  throw r;
}, ye = async (e) => {
  if (e = {
    wait: !1,
    background: !1,
    newInstance: !1,
    allowNonzeroExitCode: !1,
    ...e
  }, Array.isArray(e.app))
    return _t(e.app, (l) => ye({
      ...e,
      app: l
    }));
  let { name: t, arguments: r = [] } = e.app ?? {};
  if (r = [...r], Array.isArray(t))
    return _t(t, (l) => ye({
      ...e,
      app: {
        name: l,
        arguments: r
      }
    }));
  if (t === "browser" || t === "browserPrivate") {
    const l = {
      "com.google.chrome": "chrome",
      "google-chrome.desktop": "chrome",
      "org.mozilla.firefox": "firefox",
      "firefox.desktop": "firefox",
      "com.microsoft.msedge": "edge",
      "com.microsoft.edge": "edge",
      "microsoft-edge.desktop": "edge"
    }, a = {
      chrome: "--incognito",
      firefox: "--private-window",
      edge: "--inPrivate"
    }, u = await Mn();
    if (u.id in l) {
      const c = l[u.id];
      return t === "browserPrivate" && r.push(a[c]), ye({
        ...e,
        app: {
          name: re[c],
          arguments: r
        }
      });
    }
    throw new Error(`${u.name} is not supported as a default browser`);
  }
  let n;
  const s = [], o = {};
  if (Z === "darwin")
    n = "open", e.wait && s.push("--wait-apps"), e.background && s.push("--background"), e.newInstance && s.push("--new"), t && s.push("-a", t);
  else if (Z === "win32" || Se && !nt() && !t) {
    const l = await Vn();
    n = Se ? `${l}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` : `${A.env.SYSTEMROOT || A.env.windir || "C:\\Windows"}\\System32\\WindowsPowerShell\\v1.0\\powershell`, s.push(
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-EncodedCommand"
    ), Se || (o.windowsVerbatimArguments = !0);
    const a = ["Start"];
    e.wait && a.push("-Wait"), t ? (a.push(`"\`"${t}\`""`), e.target && r.push(e.target)) : e.target && a.push(`"${e.target}"`), r.length > 0 && (r = r.map((u) => `"\`"${u}\`""`), a.push("-ArgumentList", r.join(","))), e.target = Rr.from(a.join(" "), "utf16le").toString("base64");
  } else {
    if (t)
      n = t;
    else {
      const l = !st || st === "/";
      let a = !1;
      try {
        await rt.access(xt, Tr.X_OK), a = !0;
      } catch {
      }
      n = A.versions.electron ?? (Z === "android" || l || !a) ? "xdg-open" : xt;
    }
    r.length > 0 && s.push(...r), e.wait || (o.stdio = "ignore", o.detached = !0);
  }
  Z === "darwin" && r.length > 0 && s.push("--args", ...r), e.target && s.push(e.target);
  const i = tt.spawn(n, s, o);
  return e.wait ? new Promise((l, a) => {
    i.once("error", a), i.once("close", (u) => {
      if (!e.allowNonzeroExitCode && u > 0) {
        a(new Error(`Exited with code ${u}`));
        return;
      }
      l(i);
    });
  }) : (i.unref(), i);
}, Xn = (e, t) => {
  if (typeof e != "string")
    throw new TypeError("Expected a `target`");
  return ye({
    ...t,
    target: e
  });
};
function Gt(e) {
  if (typeof e == "string" || Array.isArray(e))
    return e;
  const { [Ct]: t } = e;
  if (!t)
    throw new Error(`${Ct} is not supported`);
  return t;
}
function dt({ [Z]: e }, { wsl: t }) {
  if (t && Se)
    return Gt(t);
  if (!e)
    throw new Error(`${Z} is not supported`);
  return Gt(e);
}
const re = {};
ce(re, "chrome", () => dt({
  darwin: "google chrome",
  win32: "chrome",
  linux: ["google-chrome", "google-chrome-stable", "chromium"]
}, {
  wsl: {
    ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
  }
}));
ce(re, "firefox", () => dt({
  darwin: "firefox",
  win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  linux: "firefox"
}, {
  wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
}));
ce(re, "edge", () => dt({
  darwin: "microsoft edge",
  win32: "msedge",
  linux: ["microsoft-edge", "microsoft-edge-dev"]
}, {
  wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
}));
ce(re, "browser", () => "browser");
ce(re, "browserPrivate", () => "browserPrivate");
var Hn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function mt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ot = { exports: {} };
const Wn = "2.0.0", Or = 256, zn = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, qn = 16, Yn = Or - 6, Kn = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var xe = {
  MAX_LENGTH: Or,
  MAX_SAFE_COMPONENT_LENGTH: qn,
  MAX_SAFE_BUILD_LENGTH: Yn,
  MAX_SAFE_INTEGER: zn,
  RELEASE_TYPES: Kn,
  SEMVER_SPEC_VERSION: Wn,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Zn = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ce = Zn;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = xe, o = Ce;
  t = e.exports = {};
  const i = t.re = [], l = t.safeRe = [], a = t.src = [], u = t.safeSrc = [], c = t.t = {};
  let m = 0;
  const $ = "[a-zA-Z0-9-]", d = [
    ["\\s", 1],
    ["\\d", s],
    [$, n]
  ], O = (x) => {
    for (const [C, j] of d)
      x = x.split(`${C}*`).join(`${C}{0,${j}}`).split(`${C}+`).join(`${C}{1,${j}}`);
    return x;
  }, p = (x, C, j) => {
    const T = O(C), D = m++;
    o(x, D, C), c[x] = D, a[D] = C, u[D] = T, i[D] = new RegExp(C, j ? "g" : void 0), l[D] = new RegExp(T, j ? "g" : void 0);
  };
  p("NUMERICIDENTIFIER", "0|[1-9]\\d*"), p("NUMERICIDENTIFIERLOOSE", "\\d+"), p("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${$}*`), p("MAINVERSION", `(${a[c.NUMERICIDENTIFIER]})\\.(${a[c.NUMERICIDENTIFIER]})\\.(${a[c.NUMERICIDENTIFIER]})`), p("MAINVERSIONLOOSE", `(${a[c.NUMERICIDENTIFIERLOOSE]})\\.(${a[c.NUMERICIDENTIFIERLOOSE]})\\.(${a[c.NUMERICIDENTIFIERLOOSE]})`), p("PRERELEASEIDENTIFIER", `(?:${a[c.NUMERICIDENTIFIER]}|${a[c.NONNUMERICIDENTIFIER]})`), p("PRERELEASEIDENTIFIERLOOSE", `(?:${a[c.NUMERICIDENTIFIERLOOSE]}|${a[c.NONNUMERICIDENTIFIER]})`), p("PRERELEASE", `(?:-(${a[c.PRERELEASEIDENTIFIER]}(?:\\.${a[c.PRERELEASEIDENTIFIER]})*))`), p("PRERELEASELOOSE", `(?:-?(${a[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${a[c.PRERELEASEIDENTIFIERLOOSE]})*))`), p("BUILDIDENTIFIER", `${$}+`), p("BUILD", `(?:\\+(${a[c.BUILDIDENTIFIER]}(?:\\.${a[c.BUILDIDENTIFIER]})*))`), p("FULLPLAIN", `v?${a[c.MAINVERSION]}${a[c.PRERELEASE]}?${a[c.BUILD]}?`), p("FULL", `^${a[c.FULLPLAIN]}$`), p("LOOSEPLAIN", `[v=\\s]*${a[c.MAINVERSIONLOOSE]}${a[c.PRERELEASELOOSE]}?${a[c.BUILD]}?`), p("LOOSE", `^${a[c.LOOSEPLAIN]}$`), p("GTLT", "((?:<|>)?=?)"), p("XRANGEIDENTIFIERLOOSE", `${a[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), p("XRANGEIDENTIFIER", `${a[c.NUMERICIDENTIFIER]}|x|X|\\*`), p("XRANGEPLAIN", `[v=\\s]*(${a[c.XRANGEIDENTIFIER]})(?:\\.(${a[c.XRANGEIDENTIFIER]})(?:\\.(${a[c.XRANGEIDENTIFIER]})(?:${a[c.PRERELEASE]})?${a[c.BUILD]}?)?)?`), p("XRANGEPLAINLOOSE", `[v=\\s]*(${a[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[c.XRANGEIDENTIFIERLOOSE]})(?:${a[c.PRERELEASELOOSE]})?${a[c.BUILD]}?)?)?`), p("XRANGE", `^${a[c.GTLT]}\\s*${a[c.XRANGEPLAIN]}$`), p("XRANGELOOSE", `^${a[c.GTLT]}\\s*${a[c.XRANGEPLAINLOOSE]}$`), p("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), p("COERCE", `${a[c.COERCEPLAIN]}(?:$|[^\\d])`), p("COERCEFULL", a[c.COERCEPLAIN] + `(?:${a[c.PRERELEASE]})?(?:${a[c.BUILD]})?(?:$|[^\\d])`), p("COERCERTL", a[c.COERCE], !0), p("COERCERTLFULL", a[c.COERCEFULL], !0), p("LONETILDE", "(?:~>?)"), p("TILDETRIM", `(\\s*)${a[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", p("TILDE", `^${a[c.LONETILDE]}${a[c.XRANGEPLAIN]}$`), p("TILDELOOSE", `^${a[c.LONETILDE]}${a[c.XRANGEPLAINLOOSE]}$`), p("LONECARET", "(?:\\^)"), p("CARETTRIM", `(\\s*)${a[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", p("CARET", `^${a[c.LONECARET]}${a[c.XRANGEPLAIN]}$`), p("CARETLOOSE", `^${a[c.LONECARET]}${a[c.XRANGEPLAINLOOSE]}$`), p("COMPARATORLOOSE", `^${a[c.GTLT]}\\s*(${a[c.LOOSEPLAIN]})$|^$`), p("COMPARATOR", `^${a[c.GTLT]}\\s*(${a[c.FULLPLAIN]})$|^$`), p("COMPARATORTRIM", `(\\s*)${a[c.GTLT]}\\s*(${a[c.LOOSEPLAIN]}|${a[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", p("HYPHENRANGE", `^\\s*(${a[c.XRANGEPLAIN]})\\s+-\\s+(${a[c.XRANGEPLAIN]})\\s*$`), p("HYPHENRANGELOOSE", `^\\s*(${a[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${a[c.XRANGEPLAINLOOSE]})\\s*$`), p("STAR", "(<|>)?=?\\s*\\*"), p("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), p("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ot, ot.exports);
var le = ot.exports;
const Qn = Object.freeze({ loose: !0 }), Jn = Object.freeze({}), es = (e) => e ? typeof e != "object" ? Qn : e : Jn;
var ht = es;
const Ft = /^[0-9]+$/, Pr = (e, t) => {
  const r = Ft.test(e), n = Ft.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, ts = (e, t) => Pr(t, e);
var Lr = {
  compareIdentifiers: Pr,
  rcompareIdentifiers: ts
};
const me = Ce, { MAX_LENGTH: jt, MAX_SAFE_INTEGER: he } = xe, { safeRe: Dt, safeSrc: Ut, t: pe } = le, rs = ht, { compareIdentifiers: q } = Lr;
let ns = class B {
  constructor(t, r) {
    if (r = rs(r), t instanceof B) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > jt)
      throw new TypeError(
        `version is longer than ${jt} characters`
      );
    me("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Dt[pe.LOOSE] : Dt[pe.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > he || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > he || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > he || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const o = +s;
        if (o >= 0 && o < he)
          return o;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (me("SemVer.compare", this.version, this.options, t), !(t instanceof B)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new B(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof B || (t = new B(t, this.options)), q(this.major, t.major) || q(this.minor, t.minor) || q(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof B || (t = new B(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (me("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return q(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof B || (t = new B(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (me("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return q(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = new RegExp(`^${this.options.loose ? Ut[pe.PRERELEASELOOSE] : Ut[pe.PRERELEASE]}$`), o = `-${r}`.match(s);
        if (!o || o[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let o = [r, s];
          n === !1 && (o = [r]), q(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var _ = ns;
const kt = _, ss = (e, t, r = !1) => {
  if (e instanceof kt)
    return e;
  try {
    return new kt(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var ne = ss;
const os = ne, is = (e, t) => {
  const r = os(e, t);
  return r ? r.version : null;
};
var as = is;
const cs = ne, ls = (e, t) => {
  const r = cs(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var us = ls;
const Bt = _, fs = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Bt(
      e instanceof Bt ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var ds = fs;
const Mt = ne, ms = (e, t) => {
  const r = Mt(e, null, !0), n = Mt(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const o = s > 0, i = o ? r : n, l = o ? n : r, a = !!i.prerelease.length;
  if (!!l.prerelease.length && !a) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(i) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const c = a ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var hs = ms;
const ps = _, Es = (e, t) => new ps(e, t).major;
var gs = Es;
const $s = _, ws = (e, t) => new $s(e, t).minor;
var Ss = ws;
const ys = _, Is = (e, t) => new ys(e, t).patch;
var vs = Is;
const Rs = ne, Ts = (e, t) => {
  const r = Rs(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var bs = Ts;
const Vt = _, As = (e, t, r) => new Vt(e, r).compare(new Vt(t, r));
var U = As;
const Os = U, Ps = (e, t, r) => Os(t, e, r);
var Ls = Ps;
const Ns = U, xs = (e, t) => Ns(e, t, !0);
var Cs = xs;
const Xt = _, _s = (e, t, r) => {
  const n = new Xt(e, r), s = new Xt(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var pt = _s;
const Gs = pt, Fs = (e, t) => e.sort((r, n) => Gs(r, n, t));
var js = Fs;
const Ds = pt, Us = (e, t) => e.sort((r, n) => Ds(n, r, t));
var ks = Us;
const Bs = U, Ms = (e, t, r) => Bs(e, t, r) > 0;
var _e = Ms;
const Vs = U, Xs = (e, t, r) => Vs(e, t, r) < 0;
var Et = Xs;
const Hs = U, Ws = (e, t, r) => Hs(e, t, r) === 0;
var Nr = Ws;
const zs = U, qs = (e, t, r) => zs(e, t, r) !== 0;
var xr = qs;
const Ys = U, Ks = (e, t, r) => Ys(e, t, r) >= 0;
var gt = Ks;
const Zs = U, Qs = (e, t, r) => Zs(e, t, r) <= 0;
var $t = Qs;
const Js = Nr, eo = xr, to = _e, ro = gt, no = Et, so = $t, oo = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Js(e, r, n);
    case "!=":
      return eo(e, r, n);
    case ">":
      return to(e, r, n);
    case ">=":
      return ro(e, r, n);
    case "<":
      return no(e, r, n);
    case "<=":
      return so(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Cr = oo;
const io = _, ao = ne, { safeRe: Ee, t: ge } = le, co = (e, t) => {
  if (e instanceof io)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ee[ge.COERCEFULL] : Ee[ge.COERCE]);
  else {
    const a = t.includePrerelease ? Ee[ge.COERCERTLFULL] : Ee[ge.COERCERTL];
    let u;
    for (; (u = a.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), a.lastIndex = u.index + u[1].length + u[2].length;
    a.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", i = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return ao(`${n}.${s}.${o}${i}${l}`, t);
};
var lo = co;
class uo {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var fo = uo, Be, Ht;
function k() {
  if (Ht) return Be;
  Ht = 1;
  const e = /\s+/g;
  class t {
    constructor(f, w) {
      if (w = s(w), f instanceof t)
        return f.loose === !!w.loose && f.includePrerelease === !!w.includePrerelease ? f : new t(f.raw, w);
      if (f instanceof o)
        return this.raw = f.value, this.set = [[f]], this.formatted = void 0, this;
      if (this.options = w, this.loose = !!w.loose, this.includePrerelease = !!w.includePrerelease, this.raw = f.trim().replace(e, " "), this.set = this.raw.split("||").map((E) => this.parseRange(E.trim())).filter((E) => E.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const E = this.set[0];
        if (this.set = this.set.filter((S) => !p(S[0])), this.set.length === 0)
          this.set = [E];
        else if (this.set.length > 1) {
          for (const S of this.set)
            if (S.length === 1 && x(S[0])) {
              this.set = [S];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let f = 0; f < this.set.length; f++) {
          f > 0 && (this.formatted += "||");
          const w = this.set[f];
          for (let E = 0; E < w.length; E++)
            E > 0 && (this.formatted += " "), this.formatted += w[E].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(f) {
      const E = ((this.options.includePrerelease && d) | (this.options.loose && O)) + ":" + f, S = n.get(E);
      if (S)
        return S;
      const g = this.options.loose, y = g ? a[u.HYPHENRANGELOOSE] : a[u.HYPHENRANGE];
      f = f.replace(y, hn(this.options.includePrerelease)), i("hyphen replace", f), f = f.replace(a[u.COMPARATORTRIM], c), i("comparator trim", f), f = f.replace(a[u.TILDETRIM], m), i("tilde trim", f), f = f.replace(a[u.CARETTRIM], $), i("caret trim", f);
      let R = f.split(" ").map((L) => j(L, this.options)).join(" ").split(/\s+/).map((L) => mn(L, this.options));
      g && (R = R.filter((L) => (i("loose invalid filter", L, this.options), !!L.match(a[u.COMPARATORLOOSE])))), i("range list", R);
      const v = /* @__PURE__ */ new Map(), b = R.map((L) => new o(L, this.options));
      for (const L of b) {
        if (p(L))
          return [L];
        v.set(L.value, L);
      }
      v.size > 1 && v.has("") && v.delete("");
      const G = [...v.values()];
      return n.set(E, G), G;
    }
    intersects(f, w) {
      if (!(f instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((E) => C(E, w) && f.set.some((S) => C(S, w) && E.every((g) => S.every((y) => g.intersects(y, w)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(f) {
      if (!f)
        return !1;
      if (typeof f == "string")
        try {
          f = new l(f, this.options);
        } catch {
          return !1;
        }
      for (let w = 0; w < this.set.length; w++)
        if (pn(this.set[w], f, this.options))
          return !0;
      return !1;
    }
  }
  Be = t;
  const r = fo, n = new r(), s = ht, o = Ge(), i = Ce, l = _, {
    safeRe: a,
    t: u,
    comparatorTrimReplace: c,
    tildeTrimReplace: m,
    caretTrimReplace: $
  } = le, { FLAG_INCLUDE_PRERELEASE: d, FLAG_LOOSE: O } = xe, p = (h) => h.value === "<0.0.0-0", x = (h) => h.value === "", C = (h, f) => {
    let w = !0;
    const E = h.slice();
    let S = E.pop();
    for (; w && E.length; )
      w = E.every((g) => S.intersects(g, f)), S = E.pop();
    return w;
  }, j = (h, f) => (i("comp", h, f), h = fe(h, f), i("caret", h), h = D(h, f), i("tildes", h), h = un(h, f), i("xrange", h), h = dn(h, f), i("stars", h), h), T = (h) => !h || h.toLowerCase() === "x" || h === "*", D = (h, f) => h.trim().split(/\s+/).map((w) => ue(w, f)).join(" "), ue = (h, f) => {
    const w = f.loose ? a[u.TILDELOOSE] : a[u.TILDE];
    return h.replace(w, (E, S, g, y, R) => {
      i("tilde", h, E, S, g, y, R);
      let v;
      return T(S) ? v = "" : T(g) ? v = `>=${S}.0.0 <${+S + 1}.0.0-0` : T(y) ? v = `>=${S}.${g}.0 <${S}.${+g + 1}.0-0` : R ? (i("replaceTilde pr", R), v = `>=${S}.${g}.${y}-${R} <${S}.${+g + 1}.0-0`) : v = `>=${S}.${g}.${y} <${S}.${+g + 1}.0-0`, i("tilde return", v), v;
    });
  }, fe = (h, f) => h.trim().split(/\s+/).map((w) => de(w, f)).join(" "), de = (h, f) => {
    i("caret", h, f);
    const w = f.loose ? a[u.CARETLOOSE] : a[u.CARET], E = f.includePrerelease ? "-0" : "";
    return h.replace(w, (S, g, y, R, v) => {
      i("caret", h, S, g, y, R, v);
      let b;
      return T(g) ? b = "" : T(y) ? b = `>=${g}.0.0${E} <${+g + 1}.0.0-0` : T(R) ? g === "0" ? b = `>=${g}.${y}.0${E} <${g}.${+y + 1}.0-0` : b = `>=${g}.${y}.0${E} <${+g + 1}.0.0-0` : v ? (i("replaceCaret pr", v), g === "0" ? y === "0" ? b = `>=${g}.${y}.${R}-${v} <${g}.${y}.${+R + 1}-0` : b = `>=${g}.${y}.${R}-${v} <${g}.${+y + 1}.0-0` : b = `>=${g}.${y}.${R}-${v} <${+g + 1}.0.0-0`) : (i("no pr"), g === "0" ? y === "0" ? b = `>=${g}.${y}.${R}${E} <${g}.${y}.${+R + 1}-0` : b = `>=${g}.${y}.${R}${E} <${g}.${+y + 1}.0-0` : b = `>=${g}.${y}.${R} <${+g + 1}.0.0-0`), i("caret return", b), b;
    });
  }, un = (h, f) => (i("replaceXRanges", h, f), h.split(/\s+/).map((w) => fn(w, f)).join(" ")), fn = (h, f) => {
    h = h.trim();
    const w = f.loose ? a[u.XRANGELOOSE] : a[u.XRANGE];
    return h.replace(w, (E, S, g, y, R, v) => {
      i("xRange", h, E, S, g, y, R, v);
      const b = T(g), G = b || T(y), L = G || T(R), oe = L;
      return S === "=" && oe && (S = ""), v = f.includePrerelease ? "-0" : "", b ? S === ">" || S === "<" ? E = "<0.0.0-0" : E = "*" : S && oe ? (G && (y = 0), R = 0, S === ">" ? (S = ">=", G ? (g = +g + 1, y = 0, R = 0) : (y = +y + 1, R = 0)) : S === "<=" && (S = "<", G ? g = +g + 1 : y = +y + 1), S === "<" && (v = "-0"), E = `${S + g}.${y}.${R}${v}`) : G ? E = `>=${g}.0.0${v} <${+g + 1}.0.0-0` : L && (E = `>=${g}.${y}.0${v} <${g}.${+y + 1}.0-0`), i("xRange return", E), E;
    });
  }, dn = (h, f) => (i("replaceStars", h, f), h.trim().replace(a[u.STAR], "")), mn = (h, f) => (i("replaceGTE0", h, f), h.trim().replace(a[f.includePrerelease ? u.GTE0PRE : u.GTE0], "")), hn = (h) => (f, w, E, S, g, y, R, v, b, G, L, oe) => (T(E) ? w = "" : T(S) ? w = `>=${E}.0.0${h ? "-0" : ""}` : T(g) ? w = `>=${E}.${S}.0${h ? "-0" : ""}` : y ? w = `>=${w}` : w = `>=${w}${h ? "-0" : ""}`, T(b) ? v = "" : T(G) ? v = `<${+b + 1}.0.0-0` : T(L) ? v = `<${b}.${+G + 1}.0-0` : oe ? v = `<=${b}.${G}.${L}-${oe}` : h ? v = `<${b}.${G}.${+L + 1}-0` : v = `<=${v}`, `${w} ${v}`.trim()), pn = (h, f, w) => {
    for (let E = 0; E < h.length; E++)
      if (!h[E].test(f))
        return !1;
    if (f.prerelease.length && !w.includePrerelease) {
      for (let E = 0; E < h.length; E++)
        if (i(h[E].semver), h[E].semver !== o.ANY && h[E].semver.prerelease.length > 0) {
          const S = h[E].semver;
          if (S.major === f.major && S.minor === f.minor && S.patch === f.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Be;
}
var Me, Wt;
function Ge() {
  if (Wt) return Me;
  Wt = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, m) {
      if (m = r(m), c instanceof t) {
        if (c.loose === !!m.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), i("comparator", c, m), this.options = m, this.loose = !!m.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(c) {
      const m = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], $ = c.match(m);
      if (!$)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = $[1] !== void 0 ? $[1] : "", this.operator === "=" && (this.operator = ""), $[2] ? this.semver = new l($[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (i("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new l(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, m) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new a(c.value, m).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new a(this.value, m).test(c.semver) : (m = r(m), m.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !m.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, m) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, m) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  Me = t;
  const r = ht, { safeRe: n, t: s } = le, o = Cr, i = Ce, l = _, a = k();
  return Me;
}
const mo = k(), ho = (e, t, r) => {
  try {
    t = new mo(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Fe = ho;
const po = k(), Eo = (e, t) => new po(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var go = Eo;
const $o = _, wo = k(), So = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new wo(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    o.test(i) && (!n || s.compare(i) === -1) && (n = i, s = new $o(n, r));
  }), n;
};
var yo = So;
const Io = _, vo = k(), Ro = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new vo(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    o.test(i) && (!n || s.compare(i) === 1) && (n = i, s = new Io(n, r));
  }), n;
};
var To = Ro;
const Ve = _, bo = k(), zt = _e, Ao = (e, t) => {
  e = new bo(e, t);
  let r = new Ve("0.0.0");
  if (e.test(r) || (r = new Ve("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((i) => {
      const l = new Ve(i.semver.version);
      switch (i.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!o || zt(l, o)) && (o = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${i.operator}`);
      }
    }), o && (!r || zt(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var Oo = Ao;
const Po = k(), Lo = (e, t) => {
  try {
    return new Po(e, t).range || "*";
  } catch {
    return null;
  }
};
var No = Lo;
const xo = _, _r = Ge(), { ANY: Co } = _r, _o = k(), Go = Fe, qt = _e, Yt = Et, Fo = $t, jo = gt, Do = (e, t, r, n) => {
  e = new xo(e, n), t = new _o(t, n);
  let s, o, i, l, a;
  switch (r) {
    case ">":
      s = qt, o = Fo, i = Yt, l = ">", a = ">=";
      break;
    case "<":
      s = Yt, o = jo, i = qt, l = "<", a = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Go(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const c = t.set[u];
    let m = null, $ = null;
    if (c.forEach((d) => {
      d.semver === Co && (d = new _r(">=0.0.0")), m = m || d, $ = $ || d, s(d.semver, m.semver, n) ? m = d : i(d.semver, $.semver, n) && ($ = d);
    }), m.operator === l || m.operator === a || (!$.operator || $.operator === l) && o(e, $.semver))
      return !1;
    if ($.operator === a && i(e, $.semver))
      return !1;
  }
  return !0;
};
var wt = Do;
const Uo = wt, ko = (e, t, r) => Uo(e, t, ">", r);
var Bo = ko;
const Mo = wt, Vo = (e, t, r) => Mo(e, t, "<", r);
var Xo = Vo;
const Kt = k(), Ho = (e, t, r) => (e = new Kt(e, r), t = new Kt(t, r), e.intersects(t, r));
var Wo = Ho;
const zo = Fe, qo = U;
var Yo = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const i = e.sort((c, m) => qo(c, m, r));
  for (const c of i)
    zo(c, t, r) ? (o = c, s || (s = c)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [c, m] of n)
    c === m ? l.push(c) : !m && c === i[0] ? l.push("*") : m ? c === i[0] ? l.push(`<=${m}`) : l.push(`${c} - ${m}`) : l.push(`>=${c}`);
  const a = l.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return a.length < u.length ? a : t;
};
const Zt = k(), St = Ge(), { ANY: Xe } = St, ie = Fe, yt = U, Ko = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Zt(e, r), t = new Zt(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const i = Qo(s, o, r);
      if (n = n || i !== null, i)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Zo = [new St(">=0.0.0-0")], Qt = [new St(">=0.0.0")], Qo = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Xe) {
    if (t.length === 1 && t[0].semver === Xe)
      return !0;
    r.includePrerelease ? e = Zo : e = Qt;
  }
  if (t.length === 1 && t[0].semver === Xe) {
    if (r.includePrerelease)
      return !0;
    t = Qt;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const d of e)
    d.operator === ">" || d.operator === ">=" ? s = Jt(s, d, r) : d.operator === "<" || d.operator === "<=" ? o = er(o, d, r) : n.add(d.semver);
  if (n.size > 1)
    return null;
  let i;
  if (s && o) {
    if (i = yt(s.semver, o.semver, r), i > 0)
      return null;
    if (i === 0 && (s.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const d of n) {
    if (s && !ie(d, String(s), r) || o && !ie(d, String(o), r))
      return null;
    for (const O of t)
      if (!ie(d, String(O), r))
        return !1;
    return !0;
  }
  let l, a, u, c, m = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, $ = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  m && m.prerelease.length === 1 && o.operator === "<" && m.prerelease[0] === 0 && (m = !1);
  for (const d of t) {
    if (c = c || d.operator === ">" || d.operator === ">=", u = u || d.operator === "<" || d.operator === "<=", s) {
      if ($ && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === $.major && d.semver.minor === $.minor && d.semver.patch === $.patch && ($ = !1), d.operator === ">" || d.operator === ">=") {
        if (l = Jt(s, d, r), l === d && l !== s)
          return !1;
      } else if (s.operator === ">=" && !ie(s.semver, String(d), r))
        return !1;
    }
    if (o) {
      if (m && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === m.major && d.semver.minor === m.minor && d.semver.patch === m.patch && (m = !1), d.operator === "<" || d.operator === "<=") {
        if (a = er(o, d, r), a === d && a !== o)
          return !1;
      } else if (o.operator === "<=" && !ie(o.semver, String(d), r))
        return !1;
    }
    if (!d.operator && (o || s) && i !== 0)
      return !1;
  }
  return !(s && u && !o && i !== 0 || o && c && !s && i !== 0 || $ || m);
}, Jt = (e, t, r) => {
  if (!e)
    return t;
  const n = yt(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, er = (e, t, r) => {
  if (!e)
    return t;
  const n = yt(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Jo = Ko;
const He = le, tr = xe, ei = _, rr = Lr, ti = ne, ri = as, ni = us, si = ds, oi = hs, ii = gs, ai = Ss, ci = vs, li = bs, ui = U, fi = Ls, di = Cs, mi = pt, hi = js, pi = ks, Ei = _e, gi = Et, $i = Nr, wi = xr, Si = gt, yi = $t, Ii = Cr, vi = lo, Ri = Ge(), Ti = k(), bi = Fe, Ai = go, Oi = yo, Pi = To, Li = Oo, Ni = No, xi = wt, Ci = Bo, _i = Xo, Gi = Wo, Fi = Yo, ji = Jo;
var Di = {
  parse: ti,
  valid: ri,
  clean: ni,
  inc: si,
  diff: oi,
  major: ii,
  minor: ai,
  patch: ci,
  prerelease: li,
  compare: ui,
  rcompare: fi,
  compareLoose: di,
  compareBuild: mi,
  sort: hi,
  rsort: pi,
  gt: Ei,
  lt: gi,
  eq: $i,
  neq: wi,
  gte: Si,
  lte: yi,
  cmp: Ii,
  coerce: vi,
  Comparator: Ri,
  Range: Ti,
  satisfies: bi,
  toComparators: Ai,
  maxSatisfying: Oi,
  minSatisfying: Pi,
  minVersion: Li,
  validRange: Ni,
  outside: xi,
  gtr: Ci,
  ltr: _i,
  intersects: Gi,
  simplifyRange: Fi,
  subset: ji,
  SemVer: ei,
  re: He.re,
  src: He.src,
  tokens: He.t,
  SEMVER_SPEC_VERSION: tr.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: tr.RELEASE_TYPES,
  compareIdentifiers: rr.compareIdentifiers,
  rcompareIdentifiers: rr.rcompareIdentifiers
};
const it = /* @__PURE__ */ mt(Di);
var se = { exports: {} }, We, nr;
function Ui() {
  if (nr) return We;
  nr = 1, We = n, n.sync = s;
  var e = ft;
  function t(o, i) {
    var l = i.pathExt !== void 0 ? i.pathExt : process.env.PATHEXT;
    if (!l || (l = l.split(";"), l.indexOf("") !== -1))
      return !0;
    for (var a = 0; a < l.length; a++) {
      var u = l[a].toLowerCase();
      if (u && o.substr(-u.length).toLowerCase() === u)
        return !0;
    }
    return !1;
  }
  function r(o, i, l) {
    return !o.isSymbolicLink() && !o.isFile() ? !1 : t(i, l);
  }
  function n(o, i, l) {
    e.stat(o, function(a, u) {
      l(a, a ? !1 : r(u, o, i));
    });
  }
  function s(o, i) {
    return r(e.statSync(o), o, i);
  }
  return We;
}
var ze, sr;
function ki() {
  if (sr) return ze;
  sr = 1, ze = t, t.sync = r;
  var e = ft;
  function t(o, i, l) {
    e.stat(o, function(a, u) {
      l(a, a ? !1 : n(u, i));
    });
  }
  function r(o, i) {
    return n(e.statSync(o), i);
  }
  function n(o, i) {
    return o.isFile() && s(o, i);
  }
  function s(o, i) {
    var l = o.mode, a = o.uid, u = o.gid, c = i.uid !== void 0 ? i.uid : process.getuid && process.getuid(), m = i.gid !== void 0 ? i.gid : process.getgid && process.getgid(), $ = parseInt("100", 8), d = parseInt("010", 8), O = parseInt("001", 8), p = $ | d, x = l & O || l & d && u === m || l & $ && a === c || l & p && c === 0;
    return x;
  }
  return ze;
}
var Te;
process.platform === "win32" || Hn.TESTING_WINDOWS ? Te = Ui() : Te = ki();
var Bi = It;
It.sync = Mi;
function It(e, t, r) {
  if (typeof t == "function" && (r = t, t = {}), !r) {
    if (typeof Promise != "function")
      throw new TypeError("callback not provided");
    return new Promise(function(n, s) {
      It(e, t || {}, function(o, i) {
        o ? s(o) : n(i);
      });
    });
  }
  Te(e, t || {}, function(n, s) {
    n && (n.code === "EACCES" || t && t.ignoreErrors) && (n = null, s = !1), r(n, s);
  });
}
function Mi(e, t) {
  try {
    return Te.sync(e, t || {});
  } catch (r) {
    if (t && t.ignoreErrors || r.code === "EACCES")
      return !1;
    throw r;
  }
}
const K = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys", Gr = ut, Vi = K ? ";" : ":", Fr = Bi, jr = (e) => Object.assign(new Error(`not found: ${e}`), { code: "ENOENT" }), Dr = (e, t) => {
  const r = t.colon || Vi, n = e.match(/\//) || K && e.match(/\\/) ? [""] : [
    // windows always checks the cwd first
    ...K ? [process.cwd()] : [],
    ...(t.path || process.env.PATH || /* istanbul ignore next: very unusual */
    "").split(r)
  ], s = K ? t.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "", o = K ? s.split(r) : [""];
  return K && e.indexOf(".") !== -1 && o[0] !== "" && o.unshift(""), {
    pathEnv: n,
    pathExt: o,
    pathExtExe: s
  };
}, Ur = (e, t, r) => {
  typeof t == "function" && (r = t, t = {}), t || (t = {});
  const { pathEnv: n, pathExt: s, pathExtExe: o } = Dr(e, t), i = [], l = (u) => new Promise((c, m) => {
    if (u === n.length)
      return t.all && i.length ? c(i) : m(jr(e));
    const $ = n[u], d = /^".*"$/.test($) ? $.slice(1, -1) : $, O = Gr.join(d, e), p = !d && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + O : O;
    c(a(p, u, 0));
  }), a = (u, c, m) => new Promise(($, d) => {
    if (m === s.length)
      return $(l(c + 1));
    const O = s[m];
    Fr(u + O, { pathExt: o }, (p, x) => {
      if (!p && x)
        if (t.all)
          i.push(u + O);
        else
          return $(u + O);
      return $(a(u, c, m + 1));
    });
  });
  return r ? l(0).then((u) => r(null, u), r) : l(0);
}, Xi = (e, t) => {
  t = t || {};
  const { pathEnv: r, pathExt: n, pathExtExe: s } = Dr(e, t), o = [];
  for (let i = 0; i < r.length; i++) {
    const l = r[i], a = /^".*"$/.test(l) ? l.slice(1, -1) : l, u = Gr.join(a, e), c = !a && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + u : u;
    for (let m = 0; m < n.length; m++) {
      const $ = c + n[m];
      try {
        if (Fr.sync($, { pathExt: s }))
          if (t.all)
            o.push($);
          else
            return $;
      } catch {
      }
    }
  }
  if (t.all && o.length)
    return o;
  if (t.nothrow)
    return null;
  throw jr(e);
};
var Hi = Ur;
Ur.sync = Xi;
var vt = { exports: {} };
const kr = (e = {}) => {
  const t = e.env || process.env;
  return (e.platform || process.platform) !== "win32" ? "PATH" : Object.keys(t).reverse().find((n) => n.toUpperCase() === "PATH") || "Path";
};
vt.exports = kr;
vt.exports.default = kr;
var Wi = vt.exports;
const or = ut, zi = Hi, qi = Wi;
function ir(e, t) {
  const r = e.options.env || process.env, n = process.cwd(), s = e.options.cwd != null, o = s && process.chdir !== void 0 && !process.chdir.disabled;
  if (o)
    try {
      process.chdir(e.options.cwd);
    } catch {
    }
  let i;
  try {
    i = zi.sync(e.command, {
      path: r[qi({ env: r })],
      pathExt: t ? or.delimiter : void 0
    });
  } catch {
  } finally {
    o && process.chdir(n);
  }
  return i && (i = or.resolve(s ? e.options.cwd : "", i)), i;
}
function Yi(e) {
  return ir(e) || ir(e, !0);
}
var Ki = Yi, Rt = {};
const at = /([()\][%!^"`<>&|;, *?])/g;
function Zi(e) {
  return e = e.replace(at, "^$1"), e;
}
function Qi(e, t) {
  return e = `${e}`, e = e.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"'), e = e.replace(/(?=(\\+?)?)\1$/, "$1$1"), e = `"${e}"`, e = e.replace(at, "^$1"), t && (e = e.replace(at, "^$1")), e;
}
Rt.command = Zi;
Rt.argument = Qi;
var Ji = /^#!(.*)/;
const ea = Ji;
var ta = (e = "") => {
  const t = e.match(ea);
  if (!t)
    return null;
  const [r, n] = t[0].replace(/#! ?/, "").split(" "), s = r.split("/").pop();
  return s === "env" ? n : n ? `${s} ${n}` : s;
};
const qe = ft, ra = ta;
function na(e) {
  const r = Buffer.alloc(150);
  let n;
  try {
    n = qe.openSync(e, "r"), qe.readSync(n, r, 0, 150, 0), qe.closeSync(n);
  } catch {
  }
  return ra(r.toString());
}
var sa = na;
const oa = ut, ar = Ki, cr = Rt, ia = sa, aa = process.platform === "win32", ca = /\.(?:com|exe)$/i, la = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
function ua(e) {
  e.file = ar(e);
  const t = e.file && ia(e.file);
  return t ? (e.args.unshift(e.file), e.command = t, ar(e)) : e.file;
}
function fa(e) {
  if (!aa)
    return e;
  const t = ua(e), r = !ca.test(t);
  if (e.options.forceShell || r) {
    const n = la.test(t);
    e.command = oa.normalize(e.command), e.command = cr.command(e.command), e.args = e.args.map((o) => cr.argument(o, n));
    const s = [e.command].concat(e.args).join(" ");
    e.args = ["/d", "/s", "/c", `"${s}"`], e.command = process.env.comspec || "cmd.exe", e.options.windowsVerbatimArguments = !0;
  }
  return e;
}
function da(e, t, r) {
  t && !Array.isArray(t) && (r = t, t = null), t = t ? t.slice(0) : [], r = Object.assign({}, r);
  const n = {
    command: e,
    args: t,
    options: r,
    file: void 0,
    original: {
      command: e,
      args: t
    }
  };
  return r.shell ? n : fa(n);
}
var ma = da;
const Tt = process.platform === "win32";
function bt(e, t) {
  return Object.assign(new Error(`${t} ${e.command} ENOENT`), {
    code: "ENOENT",
    errno: "ENOENT",
    syscall: `${t} ${e.command}`,
    path: e.command,
    spawnargs: e.args
  });
}
function ha(e, t) {
  if (!Tt)
    return;
  const r = e.emit;
  e.emit = function(n, s) {
    if (n === "exit") {
      const o = Br(s, t);
      if (o)
        return r.call(e, "error", o);
    }
    return r.apply(e, arguments);
  };
}
function Br(e, t) {
  return Tt && e === 1 && !t.file ? bt(t.original, "spawn") : null;
}
function pa(e, t) {
  return Tt && e === 1 && !t.file ? bt(t.original, "spawnSync") : null;
}
var Ea = {
  hookChildProcess: ha,
  verifyENOENT: Br,
  verifyENOENTSync: pa,
  notFoundError: bt
};
const Mr = Rn, At = ma, Ot = Ea;
function Vr(e, t, r) {
  const n = At(e, t, r), s = Mr.spawn(n.command, n.args, n.options);
  return Ot.hookChildProcess(s, n), s;
}
function ga(e, t, r) {
  const n = At(e, t, r), s = Mr.spawnSync(n.command, n.args, n.options);
  return s.error = s.error || Ot.verifyENOENTSync(s.status, n), s;
}
se.exports = Vr;
se.exports.spawn = Vr;
se.exports.sync = ga;
se.exports._parse = At;
se.exports._enoent = Ot;
var $a = se.exports;
const wa = /* @__PURE__ */ mt($a);
function Sa(e) {
  const t = typeof e == "string" ? `
` : 10, r = typeof e == "string" ? "\r" : 13;
  return e[e.length - 1] === t && (e = e.slice(0, -1)), e[e.length - 1] === r && (e = e.slice(0, -1)), e;
}
function Xr(e = {}) {
  const {
    env: t = process.env,
    platform: r = process.platform
  } = e;
  return r !== "win32" ? "PATH" : Object.keys(t).reverse().find((n) => n.toUpperCase() === "PATH") || "Path";
}
const ya = ({
  cwd: e = A.cwd(),
  path: t = A.env[Xr()],
  preferLocal: r = !0,
  execPath: n = A.execPath,
  addExecPath: s = !0
} = {}) => {
  const o = e instanceof URL ? Oe(e) : e, i = N.resolve(o), l = [];
  return r && Ia(l, i), s && va(l, n, i), [...l, t].join(N.delimiter);
}, Ia = (e, t) => {
  let r;
  for (; r !== t; )
    e.push(N.join(t, "node_modules/.bin")), r = t, t = N.resolve(t, "..");
}, va = (e, t, r) => {
  const n = t instanceof URL ? Oe(t) : t;
  e.push(N.resolve(r, n, ".."));
}, Ra = ({ env: e = A.env, ...t } = {}) => {
  e = { ...e };
  const r = Xr({ env: e });
  return t.path = e[r], e[r] = ya(t), e;
}, Ta = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !ba(s, o) && n || Object.defineProperty(e, r, o);
}, ba = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Aa = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Oa = (e, t) => `/* Wrapped ${e}*/
${t}`, Pa = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), La = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Na = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Oa.bind(null, n, t.toString());
  Object.defineProperty(s, "name", La), Object.defineProperty(e, "toString", { ...Pa, value: s });
};
function xa(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Ta(e, t, s, r);
  return Aa(e, t), Na(e, t, n), e;
}
const be = /* @__PURE__ */ new WeakMap(), Hr = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError("Expected a function");
  let r, n = 0;
  const s = e.displayName || e.name || "<anonymous>", o = function(...i) {
    if (be.set(o, ++n), n === 1)
      r = e.apply(this, i), e = null;
    else if (t.throw === !0)
      throw new Error(`Function \`${s}\` can only be called once`);
    return r;
  };
  return xa(o, e), be.set(o, n), o;
};
Hr.callCount = (e) => {
  if (!be.has(e))
    throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);
  return be.get(e);
};
const Ca = () => {
  const e = zr - Wr + 1;
  return Array.from({ length: e }, _a);
}, _a = (e, t) => ({
  name: `SIGRT${t + 1}`,
  number: Wr + t,
  action: "terminate",
  description: "Application-specific signal (realtime)",
  standard: "posix"
}), Wr = 34, zr = 64, Ga = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: 'Paused using CTRL-Z or "suspend"',
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
], qr = () => {
  const e = Ca();
  return [...Ga, ...e].map(Fa);
}, Fa = ({
  name: e,
  number: t,
  description: r,
  action: n,
  forced: s = !1,
  standard: o
}) => {
  const {
    signals: { [e]: i }
  } = br, l = i !== void 0;
  return { name: e, number: l ? i : t, description: r, supported: l, action: n, forced: s, standard: o };
}, ja = () => {
  const e = qr();
  return Object.fromEntries(e.map(Da));
}, Da = ({
  name: e,
  number: t,
  description: r,
  supported: n,
  action: s,
  forced: o,
  standard: i
}) => [e, { name: e, number: t, description: r, supported: n, action: s, forced: o, standard: i }], Ua = ja(), ka = () => {
  const e = qr(), t = zr + 1, r = Array.from(
    { length: t },
    (n, s) => Ba(s, e)
  );
  return Object.assign({}, ...r);
}, Ba = (e, t) => {
  const r = Ma(e, t);
  if (r === void 0)
    return {};
  const { name: n, description: s, supported: o, action: i, forced: l, standard: a } = r;
  return {
    [e]: {
      name: n,
      number: e,
      description: s,
      supported: o,
      action: i,
      forced: l,
      standard: a
    }
  };
}, Ma = (e, t) => {
  const r = t.find(({ name: n }) => br.signals[n] === e);
  return r !== void 0 ? r : t.find((n) => n.number === e);
};
ka();
const Va = ({ timedOut: e, timeout: t, errorCode: r, signal: n, signalDescription: s, exitCode: o, isCanceled: i }) => e ? `timed out after ${t} milliseconds` : i ? "was canceled" : r !== void 0 ? `failed with ${r}` : n !== void 0 ? `was killed with ${n} (${s})` : o !== void 0 ? `failed with exit code ${o}` : "failed", lr = ({
  stdout: e,
  stderr: t,
  all: r,
  error: n,
  signal: s,
  exitCode: o,
  command: i,
  escapedCommand: l,
  timedOut: a,
  isCanceled: u,
  killed: c,
  parsed: { options: { timeout: m, cwd: $ = A.cwd() } }
}) => {
  o = o === null ? void 0 : o, s = s === null ? void 0 : s;
  const d = s === void 0 ? void 0 : Ua[s].description, O = n && n.code, x = `Command ${Va({ timedOut: a, timeout: m, errorCode: O, signal: s, signalDescription: d, exitCode: o, isCanceled: u })}: ${i}`, C = Object.prototype.toString.call(n) === "[object Error]", j = C ? `${x}
${n.message}` : x, T = [j, t, e].filter(Boolean).join(`
`);
  return C ? (n.originalMessage = n.message, n.message = T) : n = new Error(T), n.shortMessage = j, n.command = i, n.escapedCommand = l, n.exitCode = o, n.signal = s, n.signalDescription = d, n.stdout = e, n.stderr = t, n.cwd = $, r !== void 0 && (n.all = r), "bufferedData" in n && delete n.bufferedData, n.failed = !0, n.timedOut = !!a, n.isCanceled = u, n.killed = c && !a, n;
}, Ie = ["stdin", "stdout", "stderr"], Xa = (e) => Ie.some((t) => e[t] !== void 0), Ha = (e) => {
  if (!e)
    return;
  const { stdio: t } = e;
  if (t === void 0)
    return Ie.map((n) => e[n]);
  if (Xa(e))
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${Ie.map((n) => `\`${n}\``).join(", ")}`);
  if (typeof t == "string")
    return t;
  if (!Array.isArray(t))
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);
  const r = Math.max(t.length, Ie.length);
  return Array.from({ length: r }, (n, s) => t[s]);
}, Q = [];
Q.push("SIGHUP", "SIGINT", "SIGTERM");
process.platform !== "win32" && Q.push(
  "SIGALRM",
  "SIGABRT",
  "SIGVTALRM",
  "SIGXCPU",
  "SIGXFSZ",
  "SIGUSR2",
  "SIGTRAP",
  "SIGSYS",
  "SIGQUIT",
  "SIGIOT"
  // should detect profiler and enable/disable accordingly.
  // see #21
  // 'SIGPROF'
);
process.platform === "linux" && Q.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
const ve = (e) => !!e && typeof e == "object" && typeof e.removeListener == "function" && typeof e.emit == "function" && typeof e.reallyExit == "function" && typeof e.listeners == "function" && typeof e.kill == "function" && typeof e.pid == "number" && typeof e.on == "function", Ye = Symbol.for("signal-exit emitter"), Ke = globalThis, Wa = Object.defineProperty.bind(Object);
class za {
  constructor() {
    z(this, "emitted", {
      afterExit: !1,
      exit: !1
    });
    z(this, "listeners", {
      afterExit: [],
      exit: []
    });
    z(this, "count", 0);
    z(this, "id", Math.random());
    if (Ke[Ye])
      return Ke[Ye];
    Wa(Ke, Ye, {
      value: this,
      writable: !1,
      enumerable: !1,
      configurable: !1
    });
  }
  on(t, r) {
    this.listeners[t].push(r);
  }
  removeListener(t, r) {
    const n = this.listeners[t], s = n.indexOf(r);
    s !== -1 && (s === 0 && n.length === 1 ? n.length = 0 : n.splice(s, 1));
  }
  emit(t, r, n) {
    if (this.emitted[t])
      return !1;
    this.emitted[t] = !0;
    let s = !1;
    for (const o of this.listeners[t])
      s = o(r, n) === !0 || s;
    return t === "exit" && (s = this.emit("afterExit", r, n) || s), s;
  }
}
class Yr {
}
const qa = (e) => ({
  onExit(t, r) {
    return e.onExit(t, r);
  },
  load() {
    return e.load();
  },
  unload() {
    return e.unload();
  }
});
class Ya extends Yr {
  onExit() {
    return () => {
    };
  }
  load() {
  }
  unload() {
  }
}
var Ae, F, P, J, ee, W, V, te, Kr, Zr;
class Ka extends Yr {
  constructor(r) {
    super();
    M(this, te);
    // "SIGHUP" throws an `ENOSYS` error on Windows,
    // so use a supported signal instead
    /* c8 ignore start */
    M(this, Ae, ct.platform === "win32" ? "SIGINT" : "SIGHUP");
    /* c8 ignore stop */
    M(this, F, new za());
    M(this, P);
    M(this, J);
    M(this, ee);
    M(this, W, {});
    M(this, V, !1);
    X(this, P, r), X(this, W, {});
    for (const n of Q)
      I(this, W)[n] = () => {
        const s = I(this, P).listeners(n);
        let { count: o } = I(this, F);
        const i = r;
        if (typeof i.__signal_exit_emitter__ == "object" && typeof i.__signal_exit_emitter__.count == "number" && (o += i.__signal_exit_emitter__.count), s.length === o) {
          this.unload();
          const l = I(this, F).emit("exit", null, n), a = n === "SIGHUP" ? I(this, Ae) : n;
          l || r.kill(r.pid, a);
        }
      };
    X(this, ee, r.reallyExit), X(this, J, r.emit);
  }
  onExit(r, n) {
    if (!ve(I(this, P)))
      return () => {
      };
    I(this, V) === !1 && this.load();
    const s = n != null && n.alwaysLast ? "afterExit" : "exit";
    return I(this, F).on(s, r), () => {
      I(this, F).removeListener(s, r), I(this, F).listeners.exit.length === 0 && I(this, F).listeners.afterExit.length === 0 && this.unload();
    };
  }
  load() {
    if (!I(this, V)) {
      X(this, V, !0), I(this, F).count += 1;
      for (const r of Q)
        try {
          const n = I(this, W)[r];
          n && I(this, P).on(r, n);
        } catch {
        }
      I(this, P).emit = (r, ...n) => De(this, te, Zr).call(this, r, ...n), I(this, P).reallyExit = (r) => De(this, te, Kr).call(this, r);
    }
  }
  unload() {
    I(this, V) && (X(this, V, !1), Q.forEach((r) => {
      const n = I(this, W)[r];
      if (!n)
        throw new Error("Listener not defined for signal: " + r);
      try {
        I(this, P).removeListener(r, n);
      } catch {
      }
    }), I(this, P).emit = I(this, J), I(this, P).reallyExit = I(this, ee), I(this, F).count -= 1);
  }
}
Ae = new WeakMap(), F = new WeakMap(), P = new WeakMap(), J = new WeakMap(), ee = new WeakMap(), W = new WeakMap(), V = new WeakMap(), te = new WeakSet(), Kr = function(r) {
  return ve(I(this, P)) ? (I(this, P).exitCode = r || 0, I(this, F).emit("exit", I(this, P).exitCode, null), I(this, ee).call(I(this, P), I(this, P).exitCode)) : 0;
}, Zr = function(r, ...n) {
  const s = I(this, J);
  if (r === "exit" && ve(I(this, P))) {
    typeof n[0] == "number" && (I(this, P).exitCode = n[0]);
    const o = s.call(I(this, P), r, ...n);
    return I(this, F).emit("exit", I(this, P).exitCode, null), o;
  } else
    return s.call(I(this, P), r, ...n);
};
const ct = globalThis.process, {
  /**
   * Called when the process is exiting, whether via signal, explicit
   * exit, or running out of stuff to do.
   *
   * If the global process object is not suitable for instrumentation,
   * then this will be a no-op.
   *
   * Returns a function that may be used to unload signal-exit.
   */
  onExit: Za
} = qa(ve(ct) ? new Ka(ct) : new Ya()), Qa = 1e3 * 5, Ja = (e, t = "SIGTERM", r = {}) => {
  const n = e(t);
  return ec(e, t, r, n), n;
}, ec = (e, t, r, n) => {
  if (!tc(t, r, n))
    return;
  const s = nc(r), o = setTimeout(() => {
    e("SIGKILL");
  }, s);
  o.unref && o.unref();
}, tc = (e, { forceKillAfterTimeout: t }, r) => rc(e) && t !== !1 && r, rc = (e) => e === lt.constants.signals.SIGTERM || typeof e == "string" && e.toUpperCase() === "SIGTERM", nc = ({ forceKillAfterTimeout: e = !0 }) => {
  if (e === !0)
    return Qa;
  if (!Number.isFinite(e) || e < 0)
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
  return e;
}, sc = (e, t) => {
  e.kill() && (t.isCanceled = !0);
}, oc = (e, t, r) => {
  e.kill(t), r(Object.assign(new Error("Timed out"), { timedOut: !0, signal: t }));
}, ic = (e, { timeout: t, killSignal: r = "SIGTERM" }, n) => {
  if (t === 0 || t === void 0)
    return n;
  let s;
  const o = new Promise((l, a) => {
    s = setTimeout(() => {
      oc(e, r, a);
    }, t);
  }), i = n.finally(() => {
    clearTimeout(s);
  });
  return Promise.race([o, i]);
}, ac = ({ timeout: e }) => {
  if (e !== void 0 && (!Number.isFinite(e) || e < 0))
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
}, cc = async (e, { cleanup: t, detached: r }, n) => {
  if (!t || r)
    return n;
  const s = Za(() => {
    e.kill();
  });
  return n.finally(() => {
    s();
  });
};
function Qr(e) {
  return e !== null && typeof e == "object" && typeof e.pipe == "function";
}
function ur(e) {
  return Qr(e) && e.writable !== !1 && typeof e._write == "function" && typeof e._writableState == "object";
}
const lc = (e) => e instanceof $n && typeof e.then == "function", Ze = (e, t, r) => {
  if (typeof r == "string")
    return e[t].pipe(yn(r)), e;
  if (ur(r))
    return e[t].pipe(r), e;
  if (!lc(r))
    throw new TypeError("The second argument must be a string, a stream or an Execa child process.");
  if (!ur(r.stdin))
    throw new TypeError("The target child process's stdin must be available.");
  return e[t].pipe(r.stdin), r;
}, uc = (e) => {
  e.stdout !== null && (e.pipeStdout = Ze.bind(void 0, e, "stdout")), e.stderr !== null && (e.pipeStderr = Ze.bind(void 0, e, "stderr")), e.all !== void 0 && (e.pipeAll = Ze.bind(void 0, e, "all"));
}, Jr = async (e, { init: t, convertChunk: r, getSize: n, truncateChunk: s, addChunk: o, getFinalChunk: i, finalize: l }, { maxBuffer: a = Number.POSITIVE_INFINITY } = {}) => {
  if (!dc(e))
    throw new Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
  const u = t();
  u.length = 0;
  try {
    for await (const c of e) {
      const m = mc(c), $ = r[m](c, u);
      en({ convertedChunk: $, state: u, getSize: n, truncateChunk: s, addChunk: o, maxBuffer: a });
    }
    return fc({ state: u, convertChunk: r, getSize: n, truncateChunk: s, addChunk: o, getFinalChunk: i, maxBuffer: a }), l(u);
  } catch (c) {
    throw c.bufferedData = l(u), c;
  }
}, fc = ({ state: e, getSize: t, truncateChunk: r, addChunk: n, getFinalChunk: s, maxBuffer: o }) => {
  const i = s(e);
  i !== void 0 && en({ convertedChunk: i, state: e, getSize: t, truncateChunk: r, addChunk: n, maxBuffer: o });
}, en = ({ convertedChunk: e, state: t, getSize: r, truncateChunk: n, addChunk: s, maxBuffer: o }) => {
  const i = r(e), l = t.length + i;
  if (l <= o) {
    fr(e, t, s, l);
    return;
  }
  const a = n(e, o - t.length);
  throw a !== void 0 && fr(a, t, s, o), new hc();
}, fr = (e, t, r, n) => {
  t.contents = r(e, t, n), t.length = n;
}, dc = (e) => typeof e == "object" && e !== null && typeof e[Symbol.asyncIterator] == "function", mc = (e) => {
  var n;
  const t = typeof e;
  if (t === "string")
    return "string";
  if (t !== "object" || e === null)
    return "others";
  if ((n = globalThis.Buffer) != null && n.isBuffer(e))
    return "buffer";
  const r = dr.call(e);
  return r === "[object ArrayBuffer]" ? "arrayBuffer" : r === "[object DataView]" ? "dataView" : Number.isInteger(e.byteLength) && Number.isInteger(e.byteOffset) && dr.call(e.buffer) === "[object ArrayBuffer]" ? "typedArray" : "others";
}, { toString: dr } = Object.prototype;
class hc extends Error {
  constructor() {
    super("maxBuffer exceeded");
    z(this, "name", "MaxBufferError");
  }
}
const pc = (e) => e, Ec = () => {
}, gc = ({ contents: e }) => e, tn = (e) => {
  throw new Error(`Streams in object mode are not supported: ${String(e)}`);
}, rn = (e) => e.length;
async function $c(e, t) {
  return Jr(e, Ac, t);
}
const wc = () => ({ contents: new ArrayBuffer(0) }), Sc = (e) => yc.encode(e), yc = new TextEncoder(), mr = (e) => new Uint8Array(e), hr = (e) => new Uint8Array(e.buffer, e.byteOffset, e.byteLength), Ic = (e, t) => e.slice(0, t), vc = (e, { contents: t, length: r }, n) => {
  const s = sn() ? Tc(t, n) : Rc(t, n);
  return new Uint8Array(s).set(e, r), s;
}, Rc = (e, t) => {
  if (t <= e.byteLength)
    return e;
  const r = new ArrayBuffer(nn(t));
  return new Uint8Array(r).set(new Uint8Array(e), 0), r;
}, Tc = (e, t) => {
  if (t <= e.maxByteLength)
    return e.resize(t), e;
  const r = new ArrayBuffer(t, { maxByteLength: nn(t) });
  return new Uint8Array(r).set(new Uint8Array(e), 0), r;
}, nn = (e) => pr ** Math.ceil(Math.log(e) / Math.log(pr)), pr = 2, bc = ({ contents: e, length: t }) => sn() ? e : e.slice(0, t), sn = () => "resize" in ArrayBuffer.prototype, Ac = {
  init: wc,
  convertChunk: {
    string: Sc,
    buffer: mr,
    arrayBuffer: mr,
    dataView: hr,
    typedArray: hr,
    others: tn
  },
  getSize: rn,
  truncateChunk: Ic,
  addChunk: vc,
  getFinalChunk: Ec,
  finalize: bc
};
async function on(e, t) {
  if (!("Buffer" in globalThis))
    throw new Error("getStreamAsBuffer() is only supported in Node.js");
  try {
    return Er(await $c(e, t));
  } catch (r) {
    throw r.bufferedData !== void 0 && (r.bufferedData = Er(r.bufferedData)), r;
  }
}
const Er = (e) => globalThis.Buffer.from(e);
async function Oc(e, t) {
  return Jr(e, Cc, t);
}
const Pc = () => ({ contents: "", textDecoder: new TextDecoder() }), $e = (e, { textDecoder: t }) => t.decode(e, { stream: !0 }), Lc = (e, { contents: t }) => t + e, Nc = (e, t) => e.slice(0, t), xc = ({ textDecoder: e }) => {
  const t = e.decode();
  return t === "" ? void 0 : t;
}, Cc = {
  init: Pc,
  convertChunk: {
    string: pc,
    buffer: $e,
    arrayBuffer: $e,
    dataView: $e,
    typedArray: $e,
    others: tn
  },
  getSize: rn,
  truncateChunk: Nc,
  addChunk: Lc,
  getFinalChunk: xc,
  finalize: gc
}, { PassThrough: _c } = bn;
var Gc = function() {
  var e = [], t = new _c({ objectMode: !0 });
  return t.setMaxListeners(0), t.add = r, t.isEmpty = n, t.on("unpipe", s), Array.prototype.slice.call(arguments).forEach(r), t;
  function r(o) {
    return Array.isArray(o) ? (o.forEach(r), this) : (e.push(o), o.once("end", s.bind(null, o)), o.once("error", t.emit.bind(t, "error")), o.pipe(t, { end: !1 }), this);
  }
  function n() {
    return e.length == 0;
  }
  function s(o) {
    e = e.filter(function(i) {
      return i !== o;
    }), !e.length && t.readable && t.end();
  }
};
const Fc = /* @__PURE__ */ mt(Gc), jc = (e) => {
  if (e !== void 0)
    throw new TypeError("The `input` and `inputFile` options cannot be both set.");
}, Dc = ({ input: e, inputFile: t }) => typeof t != "string" ? e : (jc(e), In(t)), Uc = (e, t) => {
  const r = Dc(t);
  r !== void 0 && (Qr(r) ? r.pipe(e.stdin) : e.stdin.end(r));
}, kc = (e, { all: t }) => {
  if (!t || !e.stdout && !e.stderr)
    return;
  const r = Fc();
  return e.stdout && r.add(e.stdout), e.stderr && r.add(e.stderr), r;
}, Qe = async (e, t) => {
  if (!(!e || t === void 0)) {
    await Tn(0), e.destroy();
    try {
      return await t;
    } catch (r) {
      return r.bufferedData;
    }
  }
}, Je = (e, { encoding: t, buffer: r, maxBuffer: n }) => {
  if (!(!e || !r))
    return t === "utf8" || t === "utf-8" ? Oc(e, { maxBuffer: n }) : t === null || t === "buffer" ? on(e, { maxBuffer: n }) : Bc(e, n, t);
}, Bc = async (e, t, r) => (await on(e, { maxBuffer: t })).toString(r), Mc = async ({ stdout: e, stderr: t, all: r }, { encoding: n, buffer: s, maxBuffer: o }, i) => {
  const l = Je(e, { encoding: n, buffer: s, maxBuffer: o }), a = Je(t, { encoding: n, buffer: s, maxBuffer: o }), u = Je(r, { encoding: n, buffer: s, maxBuffer: o * 2 });
  try {
    return await Promise.all([i, l, a, u]);
  } catch (c) {
    return Promise.all([
      { error: c, signal: c.signal, timedOut: c.timedOut },
      Qe(e, l),
      Qe(t, a),
      Qe(r, u)
    ]);
  }
}, Vc = (async () => {
})().constructor.prototype, Xc = ["then", "catch", "finally"].map((e) => [
  e,
  Reflect.getOwnPropertyDescriptor(Vc, e)
]), gr = (e, t) => {
  for (const [r, n] of Xc) {
    const s = typeof t == "function" ? (...o) => Reflect.apply(n.value, t(), o) : n.value.bind(t);
    Reflect.defineProperty(e, r, { ...n, value: s });
  }
}, Hc = (e) => new Promise((t, r) => {
  e.on("exit", (n, s) => {
    t({ exitCode: n, signal: s });
  }), e.on("error", (n) => {
    r(n);
  }), e.stdin && e.stdin.on("error", (n) => {
    r(n);
  });
}), an = (e, t = []) => Array.isArray(t) ? [e, ...t] : [e], Wc = /^[\w.-]+$/, zc = (e) => typeof e != "string" || Wc.test(e) ? e : `"${e.replaceAll('"', '\\"')}"`, qc = (e, t) => an(e, t).join(" "), Yc = (e, t) => an(e, t).map((r) => zc(r)).join(" "), Kc = vn("execa").enabled, we = (e, t) => String(e).padStart(t, "0"), Zc = () => {
  const e = /* @__PURE__ */ new Date();
  return `${we(e.getHours(), 2)}:${we(e.getMinutes(), 2)}:${we(e.getSeconds(), 2)}.${we(e.getMilliseconds(), 3)}`;
}, Qc = (e, { verbose: t }) => {
  t && A.stderr.write(`[${Zc()}] ${e}
`);
}, Jc = 1e3 * 1e3 * 100, el = ({ env: e, extendEnv: t, preferLocal: r, localDir: n, execPath: s }) => {
  const o = t ? { ...A.env, ...e } : e;
  return r ? Ra({ env: o, cwd: n, execPath: s }) : o;
}, tl = (e, t, r = {}) => {
  const n = wa._parse(e, t, r);
  return e = n.command, t = n.args, r = n.options, r = {
    maxBuffer: Jc,
    buffer: !0,
    stripFinalNewline: !0,
    extendEnv: !0,
    preferLocal: !1,
    localDir: r.cwd || A.cwd(),
    execPath: A.execPath,
    encoding: "utf8",
    reject: !0,
    cleanup: !0,
    all: !1,
    windowsHide: !0,
    verbose: Kc,
    ...r
  }, r.env = el(r), r.stdio = Ha(r), A.platform === "win32" && N.basename(e, ".exe") === "cmd" && t.unshift("/q"), { file: e, args: t, options: r, parsed: n };
}, et = (e, t, r) => typeof t != "string" && !Rr.isBuffer(t) ? r === void 0 ? void 0 : "" : e.stripFinalNewline ? Sa(t) : t;
function rl(e, t, r) {
  const n = tl(e, t, r), s = qc(e, t), o = Yc(e, t);
  Qc(o, n.options), ac(n.options);
  let i;
  try {
    i = tt.spawn(n.file, n.args, n.options);
  } catch (d) {
    const O = new tt.ChildProcess(), p = Promise.reject(lr({
      error: d,
      stdout: "",
      stderr: "",
      all: "",
      command: s,
      escapedCommand: o,
      parsed: n,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    }));
    return gr(O, p), O;
  }
  const l = Hc(i), a = ic(i, n.options, l), u = cc(i, n.options, a), c = { isCanceled: !1 };
  i.kill = Ja.bind(null, i.kill.bind(i)), i.cancel = sc.bind(null, i, c);
  const $ = Hr(async () => {
    const [{ error: d, exitCode: O, signal: p, timedOut: x }, C, j, T] = await Mc(i, n.options, u), D = et(n.options, C), ue = et(n.options, j), fe = et(n.options, T);
    if (d || O !== 0 || p !== null) {
      const de = lr({
        error: d,
        exitCode: O,
        signal: p,
        stdout: D,
        stderr: ue,
        all: fe,
        command: s,
        escapedCommand: o,
        parsed: n,
        timedOut: x,
        isCanceled: c.isCanceled || (n.options.signal ? n.options.signal.aborted : !1),
        killed: i.killed
      });
      if (!n.options.reject)
        return de;
      throw de;
    }
    return {
      command: s,
      escapedCommand: o,
      exitCode: 0,
      stdout: D,
      stderr: ue,
      all: fe,
      failed: !1,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    };
  });
  return Uc(i, n.options), i.all = kc(i, n.options), uc(i), gr(i, $), i;
}
function $r() {
  return new RegExp("(?<=^v?|\\sv?)(?:(?:0|[1-9]\\d{0,9}?)\\.){2}(?:0|[1-9]\\d{0,9})(?:-(?:--+)?(?:0|[1-9]\\d*|\\d*[a-z]+\\d*)){0,100}(?=$| |\\+|\\.)(?:(?<=-\\S+)(?:\\.(?:--?|[\\da-z-]*[a-z-]\\d*|0|[1-9]\\d*)){1,100}?)?(?!\\.)(?:\\+(?:[\\da-z]\\.?-?){1,100}?(?!\\w))?(?!\\+)", "gi");
}
const nl = new Ar.Script("returnValue = functionToRun()");
function sl(e, { timeout: t, context: r = Ar.createContext() } = {}) {
  const n = (...s) => (r.functionToRun = () => e(...s), nl.runInNewContext(r, { timeout: t }), r.returnValue);
  return Object.defineProperty(n, "name", {
    value: `functionTimeout(${e.name || "<anonymous>"})`,
    configurable: !0
  }), n;
}
function ol(e) {
  return (e == null ? void 0 : e.code) === "ERR_SCRIPT_EXECUTION_TIMEOUT";
}
function il(e) {
  const t = e, r = Number(t), n = r / 1e6;
  return {
    seconds: r / 1e9,
    milliseconds: n,
    nanoseconds: t
  };
}
function al() {
  const e = process.hrtime.bigint(), t = (n) => il(process.hrtime.bigint() - e)[n], r = () => t("milliseconds");
  return r.rounded = () => Math.round(t("milliseconds")), r.seconds = () => t("seconds"), r.nanoseconds = () => t("nanoseconds"), r;
}
const cl = (e) => ({
  match: e[0],
  index: e.index,
  groups: e.slice(1),
  namedGroups: e.groups ?? {},
  input: e.input
}), ll = {};
function ul(e, t, { timeout: r = Number.POSITIVE_INFINITY, matchTimeout: n = Number.POSITIVE_INFINITY } = {}) {
  if (!e.global)
    throw new Error("The regex must have the global flag, otherwise, use `firstMatch()` instead");
  return {
    *[Symbol.iterator]() {
      try {
        const s = t.matchAll(e);
        for (; ; ) {
          const o = sl(() => s.next(), {
            context: ll,
            timeout: r !== Number.POSITIVE_INFINITY || n !== Number.POSITIVE_INFINITY ? Math.min(r, n) : void 0
          }), i = al(), { value: l, done: a } = o();
          if (r -= Math.ceil(i()), a)
            break;
          yield cl(l);
        }
      } catch (s) {
        if (!ol(s))
          throw s;
      }
    }
  };
}
function fl(e, { loose: t = !1 } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const r = t ? new RegExp(`(?:${$r().source})|(?:v?(?:\\d+\\.\\d+)(?:\\.\\d+)?)`, "g") : $r(), n = [...ul(r, e)].map(({ match: s }) => s.trim().replace(/^v/, "").replace(/^\d+\.\d+$/, "$&.0"));
  return [...new Set(n)];
}
const dl = 1e3 * 1e3, ml = new Map([
  ...[
    "ffmpeg",
    "ffprobe",
    "ffplay"
  ].map((e) => [e, ["-version"]]),
  ["openssl", ["version"]]
]), hl = [
  ["--version"],
  ["version"]
];
async function pl(e, t = {}) {
  let r;
  if (t.args === void 0) {
    const n = ml.get(e);
    r = n === void 0 ? hl : [n];
  } else
    r = [t.args];
  for (const n of r)
    try {
      const { all: s } = await rl(e, n, {
        all: !0,
        maxBuffer: dl
      }), [o] = fl(s, { loose: !0 });
      if (o !== void 0)
        return o;
    } catch (s) {
      if (s.code === "ENOENT") {
        const o = new Error(`Couldn't find the \`${e}\` binary. Make sure it's installed and in your $PATH.`);
        throw o.sourceError = s, o;
      }
      if (s.code === "EACCES")
        throw s;
    }
  throw new Error(`Couldn't find version of \`${e}\``);
}
function El(e, t) {
  if (!["major", "minor", "patch"].includes(t))
    throw new TypeError(`Invalid version type: ${e}`);
  if (e = it.parse(e, { loose: !0 }), !e)
    throw new Error(`Version ${e} is not valid semver`);
  return e.build = "", e.prerelease = "", e.format();
}
async function gl(e, t, r) {
  if (typeof e != "string")
    throw new TypeError("`binary` and `semverRange` arguments required");
  if (!it.validRange(t))
    throw new Error("Invalid version range");
  const n = await pl(e, r);
  if (it.satisfies(El(n, "patch"), t))
    return;
  const s = new Error(`${e} ${n} does not satisfy the version requirement of ${t}`);
  throw s.name = "InvalidBinaryVersion", s;
}
class wr extends Error {
  constructor(t) {
    super(`${t} is locked`);
  }
}
const Y = {
  old: /* @__PURE__ */ new Set(),
  young: /* @__PURE__ */ new Set()
}, $l = 1e3 * 15;
let ae;
const wl = () => {
  const e = lt.networkInterfaces(), t = /* @__PURE__ */ new Set([void 0, "0.0.0.0"]);
  for (const r of Object.values(e))
    for (const n of r)
      t.add(n.address);
  return t;
}, Sr = (e) => new Promise((t, r) => {
  const n = An.createServer();
  n.unref(), n.on("error", r), n.listen(e, () => {
    const { port: s } = n.address();
    n.close(() => {
      t(s);
    });
  });
}), yr = async (e, t) => {
  if (e.host || e.port === 0)
    return Sr(e);
  for (const r of t)
    try {
      await Sr({ port: e.port, host: r });
    } catch (n) {
      if (!["EADDRNOTAVAIL", "EINVAL"].includes(n.code))
        throw n;
    }
  return e.port;
}, Sl = function* (e) {
  yield 0;
};
async function yl(e) {
  let t = /* @__PURE__ */ new Set();
  ae === void 0 && (ae = setTimeout(() => {
    ae = void 0, Y.old = Y.young, Y.young = /* @__PURE__ */ new Set();
  }, $l), ae.unref && ae.unref());
  const r = wl();
  for (const n of Sl())
    try {
      if (t.has(n))
        continue;
      let s = await yr({ ...e, port: n }, r);
      for (; Y.old.has(s) || Y.young.has(s); ) {
        if (n !== 0)
          throw new wr(n);
        s = await yr({ ...e, port: n }, r);
      }
      return Y.young.add(s), s;
    } catch (s) {
      if (!["EADDRINUSE", "EACCES"].includes(s.code) && !(s instanceof wr))
        throw s;
    }
  throw new Error("No available ports found");
}
const Il = (e, t, r) => new Promise((n, s) => {
  let l = 0;
  const a = () => {
    setTimeout(() => {
      Sn.request({
        method: "HEAD",
        hostname: e,
        port: t,
        path: r
      }, (u) => {
        const c = Number.parseInt(u.statusCode.toString()[0], 10);
        if ([2, 3, 4].includes(c)) {
          n();
          return;
        }
        if (c === 5) {
          s(new Error("Server docroot returned 500-level response. Please check your configuration for possible errors."));
          return;
        }
        a();
      }).on("error", (u) => {
        if (++l > 20) {
          s(new Error(`Could not start the PHP server: ${u.message}`));
          return;
        }
        a();
      }).end();
    }, 50);
  };
  a();
});
async function vl(e) {
  e = {
    port: 0,
    hostname: "127.0.0.1",
    base: ".",
    open: !1,
    env: {},
    binary: "php",
    directives: {},
    ...e
  }, e.port === 0 && (e.port = await yl());
  const t = `${e.hostname}:${e.port}`, r = `http://${t}`, n = ["-S", t];
  if (e.base && n.push("-t", N.resolve(e.base)), e.ini && n.push("-c", e.ini), e.directives)
    for (const [i, l] of Object.entries(e.directives))
      n.push("-d", `${i}=${l}`);
  e.router && n.push(e.router), await gl(e.binary, ">=5.4");
  const s = wn(e.binary, n, {
    env: {
      ...A.env,
      ...e.env
    }
  });
  s.ref(), A.on("exit", () => {
    s.kill();
  });
  let o = "/";
  return typeof e.open == "string" && (o += e.open.replace(/^\//, "")), await Il(e.hostname, e.port, o), e.open && await Xn(`${r}${o}`), {
    stdout: s.stdout,
    stderr: s.stderr,
    url: r,
    stop() {
      s.kill();
    }
  };
}
const cn = N.dirname(Oe(import.meta.url));
process.env.APP_ROOT = N.join(cn, "..");
const Rl = process.env.VITE_DEV_SERVER_URL, ql = N.join(process.env.APP_ROOT, "dist-electron"), Tl = N.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Rl ? N.join(process.env.APP_ROOT, "public") : Tl;
let H, Ir = null;
const bl = N.join(process.env.APP_ROOT, "php", "php.exe"), Al = N.join(process.env.APP_ROOT, "apps");
async function Ol() {
  try {
    Ir = await vl({
      port: 8005,
      hostname: "127.0.0.1",
      base: Al,
      binary: bl
      // Sesuaikan dengan path PHP di sistem kamu
    }), console.log("PHP Server started at:", Ir.url);
  } catch (e) {
    console.error("Failed to start PHP server:", e);
  }
}
function ln() {
  H = new vr({
    icon: N.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: N.join(cn, "preload.mjs")
    }
  }), H.webContents.on("did-finish-load", () => {
    H == null || H.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), H.loadURL("http://127.0.0.1:8005");
}
Re.on("window-all-closed", () => {
  process.platform !== "darwin" && (Re.quit(), H = null);
});
Re.on("activate", () => {
  vr.getAllWindows().length === 0 && ln();
});
Re.whenReady().then(() => {
  Ol(), ln();
});
export {
  ql as MAIN_DIST,
  Tl as RENDERER_DIST,
  Rl as VITE_DEV_SERVER_URL
};
