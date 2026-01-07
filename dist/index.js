var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/worker-string.ts
var worker_string_exports = {};
__export(worker_string_exports, {
  workerCode: () => workerCode
});
var workerCode;
var init_worker_string = __esm({
  "src/worker-string.ts"() {
    "use strict";
    workerCode = `// node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.mjs
async function sqlite3InitModule(moduleArg = {}) {
  var moduleRtn;
  var Module = moduleArg;
  var ENVIRONMENT_IS_WEB = !!globalThis.window;
  var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
  var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
  var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
  (function(Module2) {
    const sIMS = globalThis.sqlite3InitModuleState || Object.assign(/* @__PURE__ */ Object.create(null), {
      debugModule: () => {
        console.warn("globalThis.sqlite3InitModuleState is missing");
      }
    });
    delete globalThis.sqlite3InitModuleState;
    sIMS.debugModule("pre-js.js sqlite3InitModuleState =", sIMS);
    Module2["locateFile"] = function(path, prefix) {
      return new URL(path, import.meta.url).href;
    }.bind(sIMS);
    Module2["instantiateWasm"] = function callee3(imports, onSuccess) {
      const sims = this;
      const uri = Module2.locateFile(
        sims.wasmFilename,
        "undefined" === typeof scriptDirectory ? "" : scriptDirectory
      );
      sims.debugModule("instantiateWasm() uri =", uri, "sIMS =", this);
      const wfetch = () => fetch(uri, { credentials: "same-origin" });
      const finalThen = (arg) => {
        arg.imports = imports;
        sims.instantiateWasm = arg;
        onSuccess(arg.instance, arg.module);
      };
      const loadWasm = WebAssembly.instantiateStreaming ? async () => WebAssembly.instantiateStreaming(wfetch(), imports).then(finalThen) : async () => wfetch().then((response) => response.arrayBuffer()).then((bytes) => WebAssembly.instantiate(bytes, imports)).then(finalThen);
      return loadWasm();
    }.bind(sIMS);
  })(Module);
  var arguments_ = [];
  var thisProgram = "./this.program";
  var quit_ = (status, toThrow) => {
    throw toThrow;
  };
  var _scriptName = import.meta.url;
  var scriptDirectory = "";
  function locateFile(path) {
    if (Module["locateFile"]) {
      return Module["locateFile"](path, scriptDirectory);
    }
    return scriptDirectory + path;
  }
  var readAsync, readBinary;
  if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    try {
      scriptDirectory = new URL(".", _scriptName).href;
    } catch {
    }
    {
      if (ENVIRONMENT_IS_WORKER) {
        readBinary = (url) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }
      readAsync = async (url) => {
        var response = await fetch(url, { credentials: "same-origin" });
        if (response.ok) {
          return response.arrayBuffer();
        }
        throw new Error(response.status + " : " + response.url);
      };
    }
  } else {
  }
  var out = console.log.bind(console);
  var err = console.error.bind(console);
  var wasmBinary;
  var ABORT = false;
  var EXITSTATUS;
  function assert(condition, text) {
    if (!condition) {
      abort(text);
    }
  }
  var isFileURI = (filename) => filename.startsWith("file://");
  var readyPromiseResolve, readyPromiseReject;
  var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
  var HEAP64, HEAPU64;
  var runtimeInitialized = false;
  function updateMemoryViews() {
    var b = wasmMemory.buffer;
    HEAP8 = new Int8Array(b);
    HEAP16 = new Int16Array(b);
    HEAPU8 = new Uint8Array(b);
    HEAPU16 = new Uint16Array(b);
    HEAP32 = new Int32Array(b);
    HEAPU32 = new Uint32Array(b);
    HEAPF32 = new Float32Array(b);
    HEAPF64 = new Float64Array(b);
    HEAP64 = new BigInt64Array(b);
    HEAPU64 = new BigUint64Array(b);
  }
  function initMemory() {
    if (Module["wasmMemory"]) {
      wasmMemory = Module["wasmMemory"];
    } else {
      var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 8388608;
      wasmMemory = new WebAssembly.Memory({
        initial: INITIAL_MEMORY / 65536,
        maximum: 32768
      });
    }
    updateMemoryViews();
  }
  function preRun() {
    if (Module["preRun"]) {
      if (typeof Module["preRun"] == "function")
        Module["preRun"] = [Module["preRun"]];
      while (Module["preRun"].length) {
        addOnPreRun(Module["preRun"].shift());
      }
    }
    callRuntimeCallbacks(onPreRuns);
  }
  function initRuntime() {
    runtimeInitialized = true;
    if (!Module["noFSInit"] && !FS.initialized) FS.init();
    TTY.init();
    wasmExports["__wasm_call_ctors"]();
    FS.ignorePermissions = false;
  }
  function postRun() {
    if (Module["postRun"]) {
      if (typeof Module["postRun"] == "function")
        Module["postRun"] = [Module["postRun"]];
      while (Module["postRun"].length) {
        addOnPostRun(Module["postRun"].shift());
      }
    }
    callRuntimeCallbacks(onPostRuns);
  }
  function abort(what) {
    Module["onAbort"]?.(what);
    what = "Aborted(" + what + ")";
    err(what);
    ABORT = true;
    what += ". Build with -sASSERTIONS for more info.";
    var e = new WebAssembly.RuntimeError(what);
    readyPromiseReject?.(e);
    throw e;
  }
  var wasmBinaryFile;
  function findWasmBinary() {
    if (Module["locateFile"]) {
      return locateFile("sqlite3.wasm");
    }
    return new URL("sqlite3.wasm", import.meta.url).href;
  }
  function getBinarySync(file) {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    if (readBinary) {
      return readBinary(file);
    }
    throw "both async and sync fetching of the wasm failed";
  }
  async function getWasmBinary(binaryFile) {
    if (!wasmBinary) {
      try {
        var response = await readAsync(binaryFile);
        return new Uint8Array(response);
      } catch {
      }
    }
    return getBinarySync(binaryFile);
  }
  async function instantiateArrayBuffer(binaryFile, imports) {
    try {
      var binary = await getWasmBinary(binaryFile);
      var instance = await WebAssembly.instantiate(binary, imports);
      return instance;
    } catch (reason) {
      err(\`failed to asynchronously prepare wasm: \${reason}\`);
      abort(reason);
    }
  }
  async function instantiateAsync(binary, binaryFile, imports) {
    if (!binary) {
      try {
        var response = fetch(binaryFile, { credentials: "same-origin" });
        var instantiationResult = await WebAssembly.instantiateStreaming(
          response,
          imports
        );
        return instantiationResult;
      } catch (reason) {
        err(\`wasm streaming compile failed: \${reason}\`);
        err("falling back to ArrayBuffer instantiation");
      }
    }
    return instantiateArrayBuffer(binaryFile, imports);
  }
  function getWasmImports() {
    var imports = {
      env: wasmImports,
      wasi_snapshot_preview1: wasmImports
    };
    return imports;
  }
  async function createWasm() {
    function receiveInstance(instance, module) {
      wasmExports = instance.exports;
      assignWasmExports(wasmExports);
      return wasmExports;
    }
    function receiveInstantiationResult(result2) {
      return receiveInstance(result2["instance"]);
    }
    var info = getWasmImports();
    if (Module["instantiateWasm"]) {
      return new Promise((resolve, reject) => {
        Module["instantiateWasm"](info, (inst, mod) => {
          resolve(receiveInstance(inst, mod));
        });
      });
    }
    wasmBinaryFile ??= findWasmBinary();
    var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
    var exports = receiveInstantiationResult(result);
    return exports;
  }
  class ExitStatus {
    name = "ExitStatus";
    constructor(status) {
      this.message = \`Program terminated with exit(\${status})\`;
      this.status = status;
    }
  }
  var callRuntimeCallbacks = (callbacks) => {
    while (callbacks.length > 0) {
      callbacks.shift()(Module);
    }
  };
  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);
  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);
  function getValue(ptr, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
      case "i1":
        return HEAP8[ptr];
      case "i8":
        return HEAP8[ptr];
      case "i16":
        return HEAP16[ptr >> 1];
      case "i32":
        return HEAP32[ptr >> 2];
      case "i64":
        return HEAP64[ptr >> 3];
      case "float":
        return HEAPF32[ptr >> 2];
      case "double":
        return HEAPF64[ptr >> 3];
      case "*":
        return HEAPU32[ptr >> 2];
      default:
        abort(\`invalid type for getValue: \${type}\`);
    }
  }
  var noExitRuntime = true;
  function setValue(ptr, value, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
      case "i1":
        HEAP8[ptr] = value;
        break;
      case "i8":
        HEAP8[ptr] = value;
        break;
      case "i16":
        HEAP16[ptr >> 1] = value;
        break;
      case "i32":
        HEAP32[ptr >> 2] = value;
        break;
      case "i64":
        HEAP64[ptr >> 3] = BigInt(value);
        break;
      case "float":
        HEAPF32[ptr >> 2] = value;
        break;
      case "double":
        HEAPF64[ptr >> 3] = value;
        break;
      case "*":
        HEAPU32[ptr >> 2] = value;
        break;
      default:
        abort(\`invalid type for setValue: \${type}\`);
    }
  }
  var stackRestore = (val) => __emscripten_stack_restore(val);
  var stackSave = () => _emscripten_stack_get_current();
  var wasmMemory;
  var PATH = {
    isAbs: (path) => path.charAt(0) === "/",
    splitPath: (filename) => {
      var splitPathRe = /^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/;
      return splitPathRe.exec(filename).slice(1);
    },
    normalizeArray: (parts, allowAboveRoot) => {
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === ".") {
          parts.splice(i, 1);
        } else if (last === "..") {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }
      if (allowAboveRoot) {
        for (; up; up--) {
          parts.unshift("..");
        }
      }
      return parts;
    },
    normalize: (path) => {
      var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
      path = PATH.normalizeArray(
        path.split("/").filter((p) => !!p),
        !isAbsolute
      ).join("/");
      if (!path && !isAbsolute) {
        path = ".";
      }
      if (path && trailingSlash) {
        path += "/";
      }
      return (isAbsolute ? "/" : "") + path;
    },
    dirname: (path) => {
      var result = PATH.splitPath(path), root = result[0], dir = result[1];
      if (!root && !dir) {
        return ".";
      }
      if (dir) {
        dir = dir.slice(0, -1);
      }
      return root + dir;
    },
    basename: (path) => path && path.match(/([^\\/]+|\\/)\\/*$/)[1],
    join: (...paths) => PATH.normalize(paths.join("/")),
    join2: (l, r) => PATH.normalize(l + "/" + r)
  };
  var initRandomFill = () => {
    return (view) => crypto.getRandomValues(view);
  };
  var randomFill = (view) => {
    (randomFill = initRandomFill())(view);
  };
  var PATH_FS = {
    resolve: (...args) => {
      var resolvedPath = "", resolvedAbsolute = false;
      for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = i >= 0 ? args[i] : FS.cwd();
        if (typeof path != "string") {
          throw new TypeError("Arguments to path.resolve must be strings");
        } else if (!path) {
          return "";
        }
        resolvedPath = path + "/" + resolvedPath;
        resolvedAbsolute = PATH.isAbs(path);
      }
      resolvedPath = PATH.normalizeArray(
        resolvedPath.split("/").filter((p) => !!p),
        !resolvedAbsolute
      ).join("/");
      return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
    },
    relative: (from, to) => {
      from = PATH_FS.resolve(from).slice(1);
      to = PATH_FS.resolve(to).slice(1);
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== "") break;
        }
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== "") break;
        }
        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }
      var fromParts = trim(from.split("/"));
      var toParts = trim(to.split("/"));
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push("..");
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join("/");
    }
  };
  var UTF8Decoder = new TextDecoder();
  var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
    var maxIdx = idx + maxBytesToRead;
    if (ignoreNul) return maxIdx;
    while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
    return idx;
  };
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
    var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
    return UTF8Decoder.decode(
      heapOrArray.buffer ? heapOrArray.subarray(idx, endPtr) : new Uint8Array(heapOrArray.slice(idx, endPtr))
    );
  };
  var FS_stdin_getChar_buffer = [];
  var lengthBytesUTF8 = (str) => {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
      var c = str.charCodeAt(i);
      if (c <= 127) {
        len++;
      } else if (c <= 2047) {
        len += 2;
      } else if (c >= 55296 && c <= 57343) {
        len += 4;
        ++i;
      } else {
        len += 3;
      }
    }
    return len;
  };
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
      var u = str.codePointAt(i);
      if (u <= 127) {
        if (outIdx >= endIdx) break;
        heap[outIdx++] = u;
      } else if (u <= 2047) {
        if (outIdx + 1 >= endIdx) break;
        heap[outIdx++] = 192 | u >> 6;
        heap[outIdx++] = 128 | u & 63;
      } else if (u <= 65535) {
        if (outIdx + 2 >= endIdx) break;
        heap[outIdx++] = 224 | u >> 12;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
      } else {
        if (outIdx + 3 >= endIdx) break;
        heap[outIdx++] = 240 | u >> 18;
        heap[outIdx++] = 128 | u >> 12 & 63;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
        i++;
      }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx;
  };
  var intArrayFromString = (stringy, dontAddNull, length) => {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(
      stringy,
      u8array,
      0,
      u8array.length
    );
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  };
  var FS_stdin_getChar = () => {
    if (!FS_stdin_getChar_buffer.length) {
      var result = null;
      if (globalThis.window?.prompt) {
        result = window.prompt("Input: ");
        if (result !== null) {
          result += "\\n";
        }
      } else {
      }
      if (!result) {
        return null;
      }
      FS_stdin_getChar_buffer = intArrayFromString(result, true);
    }
    return FS_stdin_getChar_buffer.shift();
  };
  var TTY = {
    ttys: [],
    init() {
    },
    shutdown() {
    },
    register(dev, ops) {
      TTY.ttys[dev] = { input: [], output: [], ops };
      FS.registerDevice(dev, TTY.stream_ops);
    },
    stream_ops: {
      open(stream) {
        var tty = TTY.ttys[stream.node.rdev];
        if (!tty) {
          throw new FS.ErrnoError(43);
        }
        stream.tty = tty;
        stream.seekable = false;
      },
      close(stream) {
        stream.tty.ops.fsync(stream.tty);
      },
      fsync(stream) {
        stream.tty.ops.fsync(stream.tty);
      },
      read(stream, buffer, offset, length, pos) {
        if (!stream.tty || !stream.tty.ops.get_char) {
          throw new FS.ErrnoError(60);
        }
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = stream.tty.ops.get_char(stream.tty);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === void 0 && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === void 0) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.atime = Date.now();
        }
        return bytesRead;
      },
      write(stream, buffer, offset, length, pos) {
        if (!stream.tty || !stream.tty.ops.put_char) {
          throw new FS.ErrnoError(60);
        }
        try {
          for (var i = 0; i < length; i++) {
            stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
          }
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (length) {
          stream.node.mtime = stream.node.ctime = Date.now();
        }
        return i;
      }
    },
    default_tty_ops: {
      get_char(tty) {
        return FS_stdin_getChar();
      },
      put_char(tty, val) {
        if (val === null || val === 10) {
          out(UTF8ArrayToString(tty.output));
          tty.output = [];
        } else {
          if (val != 0) tty.output.push(val);
        }
      },
      fsync(tty) {
        if (tty.output?.length > 0) {
          out(UTF8ArrayToString(tty.output));
          tty.output = [];
        }
      },
      ioctl_tcgets(tty) {
        return {
          c_iflag: 25856,
          c_oflag: 5,
          c_cflag: 191,
          c_lflag: 35387,
          c_cc: [
            3,
            28,
            127,
            21,
            4,
            0,
            1,
            0,
            17,
            19,
            26,
            0,
            18,
            15,
            23,
            22,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ]
        };
      },
      ioctl_tcsets(tty, optional_actions, data) {
        return 0;
      },
      ioctl_tiocgwinsz(tty) {
        return [24, 80];
      }
    },
    default_tty1_ops: {
      put_char(tty, val) {
        if (val === null || val === 10) {
          err(UTF8ArrayToString(tty.output));
          tty.output = [];
        } else {
          if (val != 0) tty.output.push(val);
        }
      },
      fsync(tty) {
        if (tty.output?.length > 0) {
          err(UTF8ArrayToString(tty.output));
          tty.output = [];
        }
      }
    }
  };
  var zeroMemory = (ptr, size) => HEAPU8.fill(0, ptr, ptr + size);
  var alignMemory = (size, alignment) => {
    return Math.ceil(size / alignment) * alignment;
  };
  var mmapAlloc = (size) => {
    size = alignMemory(size, 65536);
    var ptr = _emscripten_builtin_memalign(65536, size);
    if (ptr) zeroMemory(ptr, size);
    return ptr;
  };
  var MEMFS = {
    ops_table: null,
    mount(mount) {
      return MEMFS.createNode(null, "/", 16895, 0);
    },
    createNode(parent, name, mode, dev) {
      if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
        throw new FS.ErrnoError(63);
      }
      MEMFS.ops_table ||= {
        dir: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek
          }
        },
        file: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            mmap: MEMFS.stream_ops.mmap,
            msync: MEMFS.stream_ops.msync
          }
        },
        link: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink
          },
          stream: {}
        },
        chrdev: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: FS.chrdev_stream_ops
        }
      };
      var node = FS.createNode(parent, name, mode, dev);
      if (FS.isDir(node.mode)) {
        node.node_ops = MEMFS.ops_table.dir.node;
        node.stream_ops = MEMFS.ops_table.dir.stream;
        node.contents = {};
      } else if (FS.isFile(node.mode)) {
        node.node_ops = MEMFS.ops_table.file.node;
        node.stream_ops = MEMFS.ops_table.file.stream;
        node.usedBytes = 0;
        node.contents = null;
      } else if (FS.isLink(node.mode)) {
        node.node_ops = MEMFS.ops_table.link.node;
        node.stream_ops = MEMFS.ops_table.link.stream;
      } else if (FS.isChrdev(node.mode)) {
        node.node_ops = MEMFS.ops_table.chrdev.node;
        node.stream_ops = MEMFS.ops_table.chrdev.stream;
      }
      node.atime = node.mtime = node.ctime = Date.now();
      if (parent) {
        parent.contents[name] = node;
        parent.atime = parent.mtime = parent.ctime = node.atime;
      }
      return node;
    },
    getFileDataAsTypedArray(node) {
      if (!node.contents) return new Uint8Array(0);
      if (node.contents.subarray)
        return node.contents.subarray(0, node.usedBytes);
      return new Uint8Array(node.contents);
    },
    expandFileStorage(node, newCapacity) {
      var prevCapacity = node.contents ? node.contents.length : 0;
      if (prevCapacity >= newCapacity) return;
      var CAPACITY_DOUBLING_MAX = 1024 * 1024;
      newCapacity = Math.max(
        newCapacity,
        prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0
      );
      if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
      var oldContents = node.contents;
      node.contents = new Uint8Array(newCapacity);
      if (node.usedBytes > 0)
        node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
    },
    resizeFileStorage(node, newSize) {
      if (node.usedBytes == newSize) return;
      if (newSize == 0) {
        node.contents = null;
        node.usedBytes = 0;
      } else {
        var oldContents = node.contents;
        node.contents = new Uint8Array(newSize);
        if (oldContents) {
          node.contents.set(
            oldContents.subarray(0, Math.min(newSize, node.usedBytes))
          );
        }
        node.usedBytes = newSize;
      }
    },
    node_ops: {
      getattr(node) {
        var attr = {};
        attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
        attr.ino = node.id;
        attr.mode = node.mode;
        attr.nlink = 1;
        attr.uid = 0;
        attr.gid = 0;
        attr.rdev = node.rdev;
        if (FS.isDir(node.mode)) {
          attr.size = 4096;
        } else if (FS.isFile(node.mode)) {
          attr.size = node.usedBytes;
        } else if (FS.isLink(node.mode)) {
          attr.size = node.link.length;
        } else {
          attr.size = 0;
        }
        attr.atime = new Date(node.atime);
        attr.mtime = new Date(node.mtime);
        attr.ctime = new Date(node.ctime);
        attr.blksize = 4096;
        attr.blocks = Math.ceil(attr.size / attr.blksize);
        return attr;
      },
      setattr(node, attr) {
        for (const key of ["mode", "atime", "mtime", "ctime"]) {
          if (attr[key] != null) {
            node[key] = attr[key];
          }
        }
        if (attr.size !== void 0) {
          MEMFS.resizeFileStorage(node, attr.size);
        }
      },
      lookup(parent, name) {
        if (!MEMFS.doesNotExistError) {
          MEMFS.doesNotExistError = new FS.ErrnoError(44);
          MEMFS.doesNotExistError.stack = "<generic error, no stack>";
        }
        throw MEMFS.doesNotExistError;
      },
      mknod(parent, name, mode, dev) {
        return MEMFS.createNode(parent, name, mode, dev);
      },
      rename(old_node, new_dir, new_name) {
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
        }
        if (new_node) {
          if (FS.isDir(old_node.mode)) {
            for (var i in new_node.contents) {
              throw new FS.ErrnoError(55);
            }
          }
          FS.hashRemoveNode(new_node);
        }
        delete old_node.parent.contents[old_node.name];
        new_dir.contents[new_name] = old_node;
        old_node.name = new_name;
        new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
      },
      unlink(parent, name) {
        delete parent.contents[name];
        parent.ctime = parent.mtime = Date.now();
      },
      rmdir(parent, name) {
        var node = FS.lookupNode(parent, name);
        for (var i in node.contents) {
          throw new FS.ErrnoError(55);
        }
        delete parent.contents[name];
        parent.ctime = parent.mtime = Date.now();
      },
      readdir(node) {
        return [".", "..", ...Object.keys(node.contents)];
      },
      symlink(parent, newname, oldpath) {
        var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
        node.link = oldpath;
        return node;
      },
      readlink(node) {
        if (!FS.isLink(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        return node.link;
      }
    },
    stream_ops: {
      read(stream, buffer, offset, length, position) {
        var contents = stream.node.contents;
        if (position >= stream.node.usedBytes) return 0;
        var size = Math.min(stream.node.usedBytes - position, length);
        if (size > 8 && contents.subarray) {
          buffer.set(contents.subarray(position, position + size), offset);
        } else {
          for (var i = 0; i < size; i++)
            buffer[offset + i] = contents[position + i];
        }
        return size;
      },
      write(stream, buffer, offset, length, position, canOwn) {
        if (buffer.buffer === HEAP8.buffer) {
          canOwn = false;
        }
        if (!length) return 0;
        var node = stream.node;
        node.mtime = node.ctime = Date.now();
        if (buffer.subarray && (!node.contents || node.contents.subarray)) {
          if (canOwn) {
            node.contents = buffer.subarray(offset, offset + length);
            node.usedBytes = length;
            return length;
          } else if (node.usedBytes === 0 && position === 0) {
            node.contents = buffer.slice(offset, offset + length);
            node.usedBytes = length;
            return length;
          } else if (position + length <= node.usedBytes) {
            node.contents.set(
              buffer.subarray(offset, offset + length),
              position
            );
            return length;
          }
        }
        MEMFS.expandFileStorage(node, position + length);
        if (node.contents.subarray && buffer.subarray) {
          node.contents.set(buffer.subarray(offset, offset + length), position);
        } else {
          for (var i = 0; i < length; i++) {
            node.contents[position + i] = buffer[offset + i];
          }
        }
        node.usedBytes = Math.max(node.usedBytes, position + length);
        return length;
      },
      llseek(stream, offset, whence) {
        var position = offset;
        if (whence === 1) {
          position += stream.position;
        } else if (whence === 2) {
          if (FS.isFile(stream.node.mode)) {
            position += stream.node.usedBytes;
          }
        }
        if (position < 0) {
          throw new FS.ErrnoError(28);
        }
        return position;
      },
      mmap(stream, length, position, prot, flags) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        var ptr;
        var allocated;
        var contents = stream.node.contents;
        if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
          allocated = false;
          ptr = contents.byteOffset;
        } else {
          allocated = true;
          ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          if (contents) {
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(
                  contents,
                  position,
                  position + length
                );
              }
            }
            HEAP8.set(contents, ptr);
          }
        }
        return { ptr, allocated };
      },
      msync(stream, buffer, offset, length, mmapFlags) {
        MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
        return 0;
      }
    }
  };
  var FS_modeStringToFlags = (str) => {
    var flagModes = {
      r: 0,
      "r+": 2,
      w: 512 | 64 | 1,
      "w+": 512 | 64 | 2,
      a: 1024 | 64 | 1,
      "a+": 1024 | 64 | 2
    };
    var flags = flagModes[str];
    if (typeof flags == "undefined") {
      throw new Error(\`Unknown file open mode: \${str}\`);
    }
    return flags;
  };
  var FS_getMode = (canRead, canWrite) => {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode;
  };
  var asyncLoad = async (url) => {
    var arrayBuffer = await readAsync(url);
    return new Uint8Array(arrayBuffer);
  };
  var FS_createDataFile = (...args) => FS.createDataFile(...args);
  var getUniqueRunDependency = (id) => {
    return id;
  };
  var runDependencies = 0;
  var dependenciesFulfilled = null;
  var removeRunDependency = (id) => {
    runDependencies--;
    Module["monitorRunDependencies"]?.(runDependencies);
    if (runDependencies == 0) {
      if (dependenciesFulfilled) {
        var callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback();
      }
    }
  };
  var addRunDependency = (id) => {
    runDependencies++;
    Module["monitorRunDependencies"]?.(runDependencies);
  };
  var preloadPlugins = [];
  var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
    if (typeof Browser != "undefined") Browser.init();
    for (var plugin of preloadPlugins) {
      if (plugin["canHandle"](fullname)) {
        return plugin["handle"](byteArray, fullname);
      }
    }
    return byteArray;
  };
  var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
    var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
    var dep = getUniqueRunDependency(\`cp \${fullname}\`);
    addRunDependency(dep);
    try {
      var byteArray = url;
      if (typeof url == "string") {
        byteArray = await asyncLoad(url);
      }
      byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
      preFinish?.();
      if (!dontCreateFile) {
        FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
      }
    } finally {
      removeRunDependency(dep);
    }
  };
  var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
    FS_preloadFile(
      parent,
      name,
      url,
      canRead,
      canWrite,
      dontCreateFile,
      canOwn,
      preFinish
    ).then(onload).catch(onerror);
  };
  var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    filesystems: null,
    syncFSRequests: 0,
    readFiles: {},
    ErrnoError: class {
      name = "ErrnoError";
      constructor(errno) {
        this.errno = errno;
      }
    },
    FSStream: class {
      shared = {};
      get object() {
        return this.node;
      }
      set object(val) {
        this.node = val;
      }
      get isRead() {
        return (this.flags & 2097155) !== 1;
      }
      get isWrite() {
        return (this.flags & 2097155) !== 0;
      }
      get isAppend() {
        return this.flags & 1024;
      }
      get flags() {
        return this.shared.flags;
      }
      set flags(val) {
        this.shared.flags = val;
      }
      get position() {
        return this.shared.position;
      }
      set position(val) {
        this.shared.position = val;
      }
    },
    FSNode: class {
      node_ops = {};
      stream_ops = {};
      readMode = 292 | 73;
      writeMode = 146;
      mounted = null;
      constructor(parent, name, mode, rdev) {
        if (!parent) {
          parent = this;
        }
        this.parent = parent;
        this.mount = parent.mount;
        this.id = FS.nextInode++;
        this.name = name;
        this.mode = mode;
        this.rdev = rdev;
        this.atime = this.mtime = this.ctime = Date.now();
      }
      get read() {
        return (this.mode & this.readMode) === this.readMode;
      }
      set read(val) {
        val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
      }
      get write() {
        return (this.mode & this.writeMode) === this.writeMode;
      }
      set write(val) {
        val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
      }
      get isFolder() {
        return FS.isDir(this.mode);
      }
      get isDevice() {
        return FS.isChrdev(this.mode);
      }
    },
    lookupPath(path, opts = {}) {
      if (!path) {
        throw new FS.ErrnoError(44);
      }
      opts.follow_mount ??= true;
      if (!PATH.isAbs(path)) {
        path = FS.cwd() + "/" + path;
      }
      linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
        var parts = path.split("/").filter((p) => !!p);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
          var islast = i === parts.length - 1;
          if (islast && opts.parent) {
            break;
          }
          if (parts[i] === ".") {
            continue;
          }
          if (parts[i] === "..") {
            current_path = PATH.dirname(current_path);
            if (FS.isRoot(current)) {
              path = current_path + "/" + parts.slice(i + 1).join("/");
              nlinks--;
              continue linkloop;
            } else {
              current = current.parent;
            }
            continue;
          }
          current_path = PATH.join2(current_path, parts[i]);
          try {
            current = FS.lookupNode(current, parts[i]);
          } catch (e) {
            if (e?.errno === 44 && islast && opts.noent_okay) {
              return { path: current_path };
            }
            throw e;
          }
          if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
            current = current.mounted.root;
          }
          if (FS.isLink(current.mode) && (!islast || opts.follow)) {
            if (!current.node_ops.readlink) {
              throw new FS.ErrnoError(52);
            }
            var link = current.node_ops.readlink(current);
            if (!PATH.isAbs(link)) {
              link = PATH.dirname(current_path) + "/" + link;
            }
            path = link + "/" + parts.slice(i + 1).join("/");
            continue linkloop;
          }
        }
        return { path: current_path, node: current };
      }
      throw new FS.ErrnoError(32);
    },
    getPath(node) {
      var path;
      while (true) {
        if (FS.isRoot(node)) {
          var mount = node.mount.mountpoint;
          if (!path) return mount;
          return mount[mount.length - 1] !== "/" ? \`\${mount}/\${path}\` : mount + path;
        }
        path = path ? \`\${node.name}/\${path}\` : node.name;
        node = node.parent;
      }
    },
    hashName(parentid, name) {
      var hash = 0;
      for (var i = 0; i < name.length; i++) {
        hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
      }
      return (parentid + hash >>> 0) % FS.nameTable.length;
    },
    hashAddNode(node) {
      var hash = FS.hashName(node.parent.id, node.name);
      node.name_next = FS.nameTable[hash];
      FS.nameTable[hash] = node;
    },
    hashRemoveNode(node) {
      var hash = FS.hashName(node.parent.id, node.name);
      if (FS.nameTable[hash] === node) {
        FS.nameTable[hash] = node.name_next;
      } else {
        var current = FS.nameTable[hash];
        while (current) {
          if (current.name_next === node) {
            current.name_next = node.name_next;
            break;
          }
          current = current.name_next;
        }
      }
    },
    lookupNode(parent, name) {
      var errCode = FS.mayLookup(parent);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      var hash = FS.hashName(parent.id, name);
      for (var node = FS.nameTable[hash]; node; node = node.name_next) {
        var nodeName = node.name;
        if (node.parent.id === parent.id && nodeName === name) {
          return node;
        }
      }
      return FS.lookup(parent, name);
    },
    createNode(parent, name, mode, rdev) {
      var node = new FS.FSNode(parent, name, mode, rdev);
      FS.hashAddNode(node);
      return node;
    },
    destroyNode(node) {
      FS.hashRemoveNode(node);
    },
    isRoot(node) {
      return node === node.parent;
    },
    isMountpoint(node) {
      return !!node.mounted;
    },
    isFile(mode) {
      return (mode & 61440) === 32768;
    },
    isDir(mode) {
      return (mode & 61440) === 16384;
    },
    isLink(mode) {
      return (mode & 61440) === 40960;
    },
    isChrdev(mode) {
      return (mode & 61440) === 8192;
    },
    isBlkdev(mode) {
      return (mode & 61440) === 24576;
    },
    isFIFO(mode) {
      return (mode & 61440) === 4096;
    },
    isSocket(mode) {
      return (mode & 49152) === 49152;
    },
    flagsToPermissionString(flag) {
      var perms = ["r", "w", "rw"][flag & 3];
      if (flag & 512) {
        perms += "w";
      }
      return perms;
    },
    nodePermissions(node, perms) {
      if (FS.ignorePermissions) {
        return 0;
      }
      if (perms.includes("r") && !(node.mode & 292)) {
        return 2;
      } else if (perms.includes("w") && !(node.mode & 146)) {
        return 2;
      } else if (perms.includes("x") && !(node.mode & 73)) {
        return 2;
      }
      return 0;
    },
    mayLookup(dir) {
      if (!FS.isDir(dir.mode)) return 54;
      var errCode = FS.nodePermissions(dir, "x");
      if (errCode) return errCode;
      if (!dir.node_ops.lookup) return 2;
      return 0;
    },
    mayCreate(dir, name) {
      if (!FS.isDir(dir.mode)) {
        return 54;
      }
      try {
        var node = FS.lookupNode(dir, name);
        return 20;
      } catch (e) {
      }
      return FS.nodePermissions(dir, "wx");
    },
    mayDelete(dir, name, isdir) {
      var node;
      try {
        node = FS.lookupNode(dir, name);
      } catch (e) {
        return e.errno;
      }
      var errCode = FS.nodePermissions(dir, "wx");
      if (errCode) {
        return errCode;
      }
      if (isdir) {
        if (!FS.isDir(node.mode)) {
          return 54;
        }
        if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
          return 10;
        }
      } else {
        if (FS.isDir(node.mode)) {
          return 31;
        }
      }
      return 0;
    },
    mayOpen(node, flags) {
      if (!node) {
        return 44;
      }
      if (FS.isLink(node.mode)) {
        return 32;
      } else if (FS.isDir(node.mode)) {
        if (FS.flagsToPermissionString(flags) !== "r" || flags & (512 | 64)) {
          return 31;
        }
      }
      return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
    },
    checkOpExists(op, err2) {
      if (!op) {
        throw new FS.ErrnoError(err2);
      }
      return op;
    },
    MAX_OPEN_FDS: 4096,
    nextfd() {
      for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
        if (!FS.streams[fd]) {
          return fd;
        }
      }
      throw new FS.ErrnoError(33);
    },
    getStreamChecked(fd) {
      var stream = FS.getStream(fd);
      if (!stream) {
        throw new FS.ErrnoError(8);
      }
      return stream;
    },
    getStream: (fd) => FS.streams[fd],
    createStream(stream, fd = -1) {
      stream = Object.assign(new FS.FSStream(), stream);
      if (fd == -1) {
        fd = FS.nextfd();
      }
      stream.fd = fd;
      FS.streams[fd] = stream;
      return stream;
    },
    closeStream(fd) {
      FS.streams[fd] = null;
    },
    dupStream(origStream, fd = -1) {
      var stream = FS.createStream(origStream, fd);
      stream.stream_ops?.dup?.(stream);
      return stream;
    },
    doSetAttr(stream, node, attr) {
      var setattr = stream?.stream_ops.setattr;
      var arg = setattr ? stream : node;
      setattr ??= node.node_ops.setattr;
      FS.checkOpExists(setattr, 63);
      setattr(arg, attr);
    },
    chrdev_stream_ops: {
      open(stream) {
        var device = FS.getDevice(stream.node.rdev);
        stream.stream_ops = device.stream_ops;
        stream.stream_ops.open?.(stream);
      },
      llseek() {
        throw new FS.ErrnoError(70);
      }
    },
    major: (dev) => dev >> 8,
    minor: (dev) => dev & 255,
    makedev: (ma, mi) => ma << 8 | mi,
    registerDevice(dev, ops) {
      FS.devices[dev] = { stream_ops: ops };
    },
    getDevice: (dev) => FS.devices[dev],
    getMounts(mount) {
      var mounts = [];
      var check = [mount];
      while (check.length) {
        var m = check.pop();
        mounts.push(m);
        check.push(...m.mounts);
      }
      return mounts;
    },
    syncfs(populate, callback) {
      if (typeof populate == "function") {
        callback = populate;
        populate = false;
      }
      FS.syncFSRequests++;
      if (FS.syncFSRequests > 1) {
        err(
          \`warning: \${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work\`
        );
      }
      var mounts = FS.getMounts(FS.root.mount);
      var completed = 0;
      function doCallback(errCode) {
        FS.syncFSRequests--;
        return callback(errCode);
      }
      function done(errCode) {
        if (errCode) {
          if (!done.errored) {
            done.errored = true;
            return doCallback(errCode);
          }
          return;
        }
        if (++completed >= mounts.length) {
          doCallback(null);
        }
      }
      for (var mount of mounts) {
        if (mount.type.syncfs) {
          mount.type.syncfs(mount, populate, done);
        } else {
          done(null);
        }
      }
    },
    mount(type, opts, mountpoint) {
      var root = mountpoint === "/";
      var pseudo = !mountpoint;
      var node;
      if (root && FS.root) {
        throw new FS.ErrnoError(10);
      } else if (!root && !pseudo) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
        mountpoint = lookup.path;
        node = lookup.node;
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        if (!FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
      }
      var mount = {
        type,
        opts,
        mountpoint,
        mounts: []
      };
      var mountRoot = type.mount(mount);
      mountRoot.mount = mount;
      mount.root = mountRoot;
      if (root) {
        FS.root = mountRoot;
      } else if (node) {
        node.mounted = mount;
        if (node.mount) {
          node.mount.mounts.push(mount);
        }
      }
      return mountRoot;
    },
    unmount(mountpoint) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
      if (!FS.isMountpoint(lookup.node)) {
        throw new FS.ErrnoError(28);
      }
      var node = lookup.node;
      var mount = node.mounted;
      var mounts = FS.getMounts(mount);
      for (var [hash, current] of Object.entries(FS.nameTable)) {
        while (current) {
          var next = current.name_next;
          if (mounts.includes(current.mount)) {
            FS.destroyNode(current);
          }
          current = next;
        }
      }
      node.mounted = null;
      var idx = node.mount.mounts.indexOf(mount);
      node.mount.mounts.splice(idx, 1);
    },
    lookup(parent, name) {
      return parent.node_ops.lookup(parent, name);
    },
    mknod(path, mode, dev) {
      var lookup = FS.lookupPath(path, { parent: true });
      var parent = lookup.node;
      var name = PATH.basename(path);
      if (!name) {
        throw new FS.ErrnoError(28);
      }
      if (name === "." || name === "..") {
        throw new FS.ErrnoError(20);
      }
      var errCode = FS.mayCreate(parent, name);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.mknod) {
        throw new FS.ErrnoError(63);
      }
      return parent.node_ops.mknod(parent, name, mode, dev);
    },
    statfs(path) {
      return FS.statfsNode(FS.lookupPath(path, { follow: true }).node);
    },
    statfsStream(stream) {
      return FS.statfsNode(stream.node);
    },
    statfsNode(node) {
      var rtn = {
        bsize: 4096,
        frsize: 4096,
        blocks: 1e6,
        bfree: 5e5,
        bavail: 5e5,
        files: FS.nextInode,
        ffree: FS.nextInode - 1,
        fsid: 42,
        flags: 2,
        namelen: 255
      };
      if (node.node_ops.statfs) {
        Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
      }
      return rtn;
    },
    create(path, mode = 438) {
      mode &= 4095;
      mode |= 32768;
      return FS.mknod(path, mode, 0);
    },
    mkdir(path, mode = 511) {
      mode &= 511 | 512;
      mode |= 16384;
      return FS.mknod(path, mode, 0);
    },
    mkdirTree(path, mode) {
      var dirs = path.split("/");
      var d = "";
      for (var dir of dirs) {
        if (!dir) continue;
        if (d || PATH.isAbs(path)) d += "/";
        d += dir;
        try {
          FS.mkdir(d, mode);
        } catch (e) {
          if (e.errno != 20) throw e;
        }
      }
    },
    mkdev(path, mode, dev) {
      if (typeof dev == "undefined") {
        dev = mode;
        mode = 438;
      }
      mode |= 8192;
      return FS.mknod(path, mode, dev);
    },
    symlink(oldpath, newpath) {
      if (!PATH_FS.resolve(oldpath)) {
        throw new FS.ErrnoError(44);
      }
      var lookup = FS.lookupPath(newpath, { parent: true });
      var parent = lookup.node;
      if (!parent) {
        throw new FS.ErrnoError(44);
      }
      var newname = PATH.basename(newpath);
      var errCode = FS.mayCreate(parent, newname);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.symlink) {
        throw new FS.ErrnoError(63);
      }
      return parent.node_ops.symlink(parent, newname, oldpath);
    },
    rename(old_path, new_path) {
      var old_dirname = PATH.dirname(old_path);
      var new_dirname = PATH.dirname(new_path);
      var old_name = PATH.basename(old_path);
      var new_name = PATH.basename(new_path);
      var lookup, old_dir, new_dir;
      lookup = FS.lookupPath(old_path, { parent: true });
      old_dir = lookup.node;
      lookup = FS.lookupPath(new_path, { parent: true });
      new_dir = lookup.node;
      if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
      if (old_dir.mount !== new_dir.mount) {
        throw new FS.ErrnoError(75);
      }
      var old_node = FS.lookupNode(old_dir, old_name);
      var relative = PATH_FS.relative(old_path, new_dirname);
      if (relative.charAt(0) !== ".") {
        throw new FS.ErrnoError(28);
      }
      relative = PATH_FS.relative(new_path, old_dirname);
      if (relative.charAt(0) !== ".") {
        throw new FS.ErrnoError(55);
      }
      var new_node;
      try {
        new_node = FS.lookupNode(new_dir, new_name);
      } catch (e) {
      }
      if (old_node === new_node) {
        return;
      }
      var isdir = FS.isDir(old_node.mode);
      var errCode = FS.mayDelete(old_dir, old_name, isdir);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!old_dir.node_ops.rename) {
        throw new FS.ErrnoError(63);
      }
      if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
        throw new FS.ErrnoError(10);
      }
      if (new_dir !== old_dir) {
        errCode = FS.nodePermissions(old_dir, "w");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
      }
      FS.hashRemoveNode(old_node);
      try {
        old_dir.node_ops.rename(old_node, new_dir, new_name);
        old_node.parent = new_dir;
      } catch (e) {
        throw e;
      } finally {
        FS.hashAddNode(old_node);
      }
    },
    rmdir(path) {
      var lookup = FS.lookupPath(path, { parent: true });
      var parent = lookup.node;
      var name = PATH.basename(path);
      var node = FS.lookupNode(parent, name);
      var errCode = FS.mayDelete(parent, name, true);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.rmdir) {
        throw new FS.ErrnoError(63);
      }
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      parent.node_ops.rmdir(parent, name);
      FS.destroyNode(node);
    },
    readdir(path) {
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
      return readdir(node);
    },
    unlink(path) {
      var lookup = FS.lookupPath(path, { parent: true });
      var parent = lookup.node;
      if (!parent) {
        throw new FS.ErrnoError(44);
      }
      var name = PATH.basename(path);
      var node = FS.lookupNode(parent, name);
      var errCode = FS.mayDelete(parent, name, false);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.unlink) {
        throw new FS.ErrnoError(63);
      }
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      parent.node_ops.unlink(parent, name);
      FS.destroyNode(node);
    },
    readlink(path) {
      var lookup = FS.lookupPath(path);
      var link = lookup.node;
      if (!link) {
        throw new FS.ErrnoError(44);
      }
      if (!link.node_ops.readlink) {
        throw new FS.ErrnoError(28);
      }
      return link.node_ops.readlink(link);
    },
    stat(path, dontFollow) {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      var node = lookup.node;
      var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
      return getattr(node);
    },
    fstat(fd) {
      var stream = FS.getStreamChecked(fd);
      var node = stream.node;
      var getattr = stream.stream_ops.getattr;
      var arg = getattr ? stream : node;
      getattr ??= node.node_ops.getattr;
      FS.checkOpExists(getattr, 63);
      return getattr(arg);
    },
    lstat(path) {
      return FS.stat(path, true);
    },
    doChmod(stream, node, mode, dontFollow) {
      FS.doSetAttr(stream, node, {
        mode: mode & 4095 | node.mode & ~4095,
        ctime: Date.now(),
        dontFollow
      });
    },
    chmod(path, mode, dontFollow) {
      var node;
      if (typeof path == "string") {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        node = lookup.node;
      } else {
        node = path;
      }
      FS.doChmod(null, node, mode, dontFollow);
    },
    lchmod(path, mode) {
      FS.chmod(path, mode, true);
    },
    fchmod(fd, mode) {
      var stream = FS.getStreamChecked(fd);
      FS.doChmod(stream, stream.node, mode, false);
    },
    doChown(stream, node, dontFollow) {
      FS.doSetAttr(stream, node, {
        timestamp: Date.now(),
        dontFollow
      });
    },
    chown(path, uid, gid, dontFollow) {
      var node;
      if (typeof path == "string") {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        node = lookup.node;
      } else {
        node = path;
      }
      FS.doChown(null, node, dontFollow);
    },
    lchown(path, uid, gid) {
      FS.chown(path, uid, gid, true);
    },
    fchown(fd, uid, gid) {
      var stream = FS.getStreamChecked(fd);
      FS.doChown(stream, stream.node, false);
    },
    doTruncate(stream, node, len) {
      if (FS.isDir(node.mode)) {
        throw new FS.ErrnoError(31);
      }
      if (!FS.isFile(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      var errCode = FS.nodePermissions(node, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      FS.doSetAttr(stream, node, {
        size: len,
        timestamp: Date.now()
      });
    },
    truncate(path, len) {
      if (len < 0) {
        throw new FS.ErrnoError(28);
      }
      var node;
      if (typeof path == "string") {
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
      } else {
        node = path;
      }
      FS.doTruncate(null, node, len);
    },
    ftruncate(fd, len) {
      var stream = FS.getStreamChecked(fd);
      if (len < 0 || (stream.flags & 2097155) === 0) {
        throw new FS.ErrnoError(28);
      }
      FS.doTruncate(stream, stream.node, len);
    },
    utime(path, atime, mtime) {
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
      setattr(node, {
        atime,
        mtime
      });
    },
    open(path, flags, mode = 438) {
      if (path === "") {
        throw new FS.ErrnoError(44);
      }
      flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
      if (flags & 64) {
        mode = mode & 4095 | 32768;
      } else {
        mode = 0;
      }
      var node;
      var isDirPath;
      if (typeof path == "object") {
        node = path;
      } else {
        isDirPath = path.endsWith("/");
        var lookup = FS.lookupPath(path, {
          follow: !(flags & 131072),
          noent_okay: true
        });
        node = lookup.node;
        path = lookup.path;
      }
      var created = false;
      if (flags & 64) {
        if (node) {
          if (flags & 128) {
            throw new FS.ErrnoError(20);
          }
        } else if (isDirPath) {
          throw new FS.ErrnoError(31);
        } else {
          node = FS.mknod(path, mode | 511, 0);
          created = true;
        }
      }
      if (!node) {
        throw new FS.ErrnoError(44);
      }
      if (FS.isChrdev(node.mode)) {
        flags &= ~512;
      }
      if (flags & 65536 && !FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
      if (!created) {
        var errCode = FS.mayOpen(node, flags);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
      }
      if (flags & 512 && !created) {
        FS.truncate(node, 0);
      }
      flags &= ~(128 | 512 | 131072);
      var stream = FS.createStream({
        node,
        path: FS.getPath(node),
        flags,
        seekable: true,
        position: 0,
        stream_ops: node.stream_ops,
        ungotten: [],
        error: false
      });
      if (stream.stream_ops.open) {
        stream.stream_ops.open(stream);
      }
      if (created) {
        FS.chmod(node, mode & 511);
      }
      if (Module["logReadFiles"] && !(flags & 1)) {
        if (!(path in FS.readFiles)) {
          FS.readFiles[path] = 1;
        }
      }
      return stream;
    },
    close(stream) {
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if (stream.getdents) stream.getdents = null;
      try {
        if (stream.stream_ops.close) {
          stream.stream_ops.close(stream);
        }
      } catch (e) {
        throw e;
      } finally {
        FS.closeStream(stream.fd);
      }
      stream.fd = null;
    },
    isClosed(stream) {
      return stream.fd === null;
    },
    llseek(stream, offset, whence) {
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if (!stream.seekable || !stream.stream_ops.llseek) {
        throw new FS.ErrnoError(70);
      }
      if (whence != 0 && whence != 1 && whence != 2) {
        throw new FS.ErrnoError(28);
      }
      stream.position = stream.stream_ops.llseek(stream, offset, whence);
      stream.ungotten = [];
      return stream.position;
    },
    read(stream, buffer, offset, length, position) {
      if (length < 0 || position < 0) {
        throw new FS.ErrnoError(28);
      }
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if ((stream.flags & 2097155) === 1) {
        throw new FS.ErrnoError(8);
      }
      if (FS.isDir(stream.node.mode)) {
        throw new FS.ErrnoError(31);
      }
      if (!stream.stream_ops.read) {
        throw new FS.ErrnoError(28);
      }
      var seeking = typeof position != "undefined";
      if (!seeking) {
        position = stream.position;
      } else if (!stream.seekable) {
        throw new FS.ErrnoError(70);
      }
      var bytesRead = stream.stream_ops.read(
        stream,
        buffer,
        offset,
        length,
        position
      );
      if (!seeking) stream.position += bytesRead;
      return bytesRead;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      if (length < 0 || position < 0) {
        throw new FS.ErrnoError(28);
      }
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if ((stream.flags & 2097155) === 0) {
        throw new FS.ErrnoError(8);
      }
      if (FS.isDir(stream.node.mode)) {
        throw new FS.ErrnoError(31);
      }
      if (!stream.stream_ops.write) {
        throw new FS.ErrnoError(28);
      }
      if (stream.seekable && stream.flags & 1024) {
        FS.llseek(stream, 0, 2);
      }
      var seeking = typeof position != "undefined";
      if (!seeking) {
        position = stream.position;
      } else if (!stream.seekable) {
        throw new FS.ErrnoError(70);
      }
      var bytesWritten = stream.stream_ops.write(
        stream,
        buffer,
        offset,
        length,
        position,
        canOwn
      );
      if (!seeking) stream.position += bytesWritten;
      return bytesWritten;
    },
    mmap(stream, length, position, prot, flags) {
      if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
        throw new FS.ErrnoError(2);
      }
      if ((stream.flags & 2097155) === 1) {
        throw new FS.ErrnoError(2);
      }
      if (!stream.stream_ops.mmap) {
        throw new FS.ErrnoError(43);
      }
      if (!length) {
        throw new FS.ErrnoError(28);
      }
      return stream.stream_ops.mmap(stream, length, position, prot, flags);
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      if (!stream.stream_ops.msync) {
        return 0;
      }
      return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
    },
    ioctl(stream, cmd, arg) {
      if (!stream.stream_ops.ioctl) {
        throw new FS.ErrnoError(59);
      }
      return stream.stream_ops.ioctl(stream, cmd, arg);
    },
    readFile(path, opts = {}) {
      opts.flags = opts.flags || 0;
      opts.encoding = opts.encoding || "binary";
      if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
        abort(\`Invalid encoding type "\${opts.encoding}"\`);
      }
      var stream = FS.open(path, opts.flags);
      var stat = FS.stat(path);
      var length = stat.size;
      var buf = new Uint8Array(length);
      FS.read(stream, buf, 0, length, 0);
      if (opts.encoding === "utf8") {
        buf = UTF8ArrayToString(buf);
      }
      FS.close(stream);
      return buf;
    },
    writeFile(path, data, opts = {}) {
      opts.flags = opts.flags || 577;
      var stream = FS.open(path, opts.flags, opts.mode);
      if (typeof data == "string") {
        data = new Uint8Array(intArrayFromString(data, true));
      }
      if (ArrayBuffer.isView(data)) {
        FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
      } else {
        abort("Unsupported data type");
      }
      FS.close(stream);
    },
    cwd: () => FS.currentPath,
    chdir(path) {
      var lookup = FS.lookupPath(path, { follow: true });
      if (lookup.node === null) {
        throw new FS.ErrnoError(44);
      }
      if (!FS.isDir(lookup.node.mode)) {
        throw new FS.ErrnoError(54);
      }
      var errCode = FS.nodePermissions(lookup.node, "x");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      FS.currentPath = lookup.path;
    },
    createDefaultDirectories() {
      FS.mkdir("/tmp");
      FS.mkdir("/home");
      FS.mkdir("/home/web_user");
    },
    createDefaultDevices() {
      FS.mkdir("/dev");
      FS.registerDevice(FS.makedev(1, 3), {
        read: () => 0,
        write: (stream, buffer, offset, length, pos) => length,
        llseek: () => 0
      });
      FS.mkdev("/dev/null", FS.makedev(1, 3));
      TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
      TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
      FS.mkdev("/dev/tty", FS.makedev(5, 0));
      FS.mkdev("/dev/tty1", FS.makedev(6, 0));
      var randomBuffer = new Uint8Array(1024), randomLeft = 0;
      var randomByte = () => {
        if (randomLeft === 0) {
          randomFill(randomBuffer);
          randomLeft = randomBuffer.byteLength;
        }
        return randomBuffer[--randomLeft];
      };
      FS.createDevice("/dev", "random", randomByte);
      FS.createDevice("/dev", "urandom", randomByte);
      FS.mkdir("/dev/shm");
      FS.mkdir("/dev/shm/tmp");
    },
    createSpecialDirectories() {
      FS.mkdir("/proc");
      var proc_self = FS.mkdir("/proc/self");
      FS.mkdir("/proc/self/fd");
      FS.mount(
        {
          mount() {
            var node = FS.createNode(proc_self, "fd", 16895, 73);
            node.stream_ops = {
              llseek: MEMFS.stream_ops.llseek
            };
            node.node_ops = {
              lookup(parent, name) {
                var fd = +name;
                var stream = FS.getStreamChecked(fd);
                var ret = {
                  parent: null,
                  mount: { mountpoint: "fake" },
                  node_ops: { readlink: () => stream.path },
                  id: fd + 1
                };
                ret.parent = ret;
                return ret;
              },
              readdir() {
                return Array.from(FS.streams.entries()).filter(([k, v2]) => v2).map(([k, v2]) => k.toString());
              }
            };
            return node;
          }
        },
        {},
        "/proc/self/fd"
      );
    },
    createStandardStreams(input, output, error) {
      if (input) {
        FS.createDevice("/dev", "stdin", input);
      } else {
        FS.symlink("/dev/tty", "/dev/stdin");
      }
      if (output) {
        FS.createDevice("/dev", "stdout", null, output);
      } else {
        FS.symlink("/dev/tty", "/dev/stdout");
      }
      if (error) {
        FS.createDevice("/dev", "stderr", null, error);
      } else {
        FS.symlink("/dev/tty1", "/dev/stderr");
      }
      var stdin = FS.open("/dev/stdin", 0);
      var stdout = FS.open("/dev/stdout", 1);
      var stderr = FS.open("/dev/stderr", 1);
    },
    staticInit() {
      FS.nameTable = new Array(4096);
      FS.mount(MEMFS, {}, "/");
      FS.createDefaultDirectories();
      FS.createDefaultDevices();
      FS.createSpecialDirectories();
      FS.filesystems = {
        MEMFS
      };
    },
    init(input, output, error) {
      FS.initialized = true;
      input ??= Module["stdin"];
      output ??= Module["stdout"];
      error ??= Module["stderr"];
      FS.createStandardStreams(input, output, error);
    },
    quit() {
      FS.initialized = false;
      for (var stream of FS.streams) {
        if (stream) {
          FS.close(stream);
        }
      }
    },
    findObject(path, dontResolveLastLink) {
      var ret = FS.analyzePath(path, dontResolveLastLink);
      if (!ret.exists) {
        return null;
      }
      return ret.object;
    },
    analyzePath(path, dontResolveLastLink) {
      try {
        var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
        path = lookup.path;
      } catch (e) {
      }
      var ret = {
        isRoot: false,
        exists: false,
        error: 0,
        name: null,
        path: null,
        object: null,
        parentExists: false,
        parentPath: null,
        parentObject: null
      };
      try {
        var lookup = FS.lookupPath(path, { parent: true });
        ret.parentExists = true;
        ret.parentPath = lookup.path;
        ret.parentObject = lookup.node;
        ret.name = PATH.basename(path);
        lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
        ret.exists = true;
        ret.path = lookup.path;
        ret.object = lookup.node;
        ret.name = lookup.node.name;
        ret.isRoot = lookup.path === "/";
      } catch (e) {
        ret.error = e.errno;
      }
      return ret;
    },
    createPath(parent, path, canRead, canWrite) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      var parts = path.split("/").reverse();
      while (parts.length) {
        var part = parts.pop();
        if (!part) continue;
        var current = PATH.join2(parent, part);
        try {
          FS.mkdir(current);
        } catch (e) {
          if (e.errno != 20) throw e;
        }
        parent = current;
      }
      return current;
    },
    createFile(parent, name, properties, canRead, canWrite) {
      var path = PATH.join2(
        typeof parent == "string" ? parent : FS.getPath(parent),
        name
      );
      var mode = FS_getMode(canRead, canWrite);
      return FS.create(path, mode);
    },
    createDataFile(parent, name, data, canRead, canWrite, canOwn) {
      var path = name;
      if (parent) {
        parent = typeof parent == "string" ? parent : FS.getPath(parent);
        path = name ? PATH.join2(parent, name) : parent;
      }
      var mode = FS_getMode(canRead, canWrite);
      var node = FS.create(path, mode);
      if (data) {
        if (typeof data == "string") {
          var arr = new Array(data.length);
          for (var i = 0, len = data.length; i < len; ++i)
            arr[i] = data.charCodeAt(i);
          data = arr;
        }
        FS.chmod(node, mode | 146);
        var stream = FS.open(node, 577);
        FS.write(stream, data, 0, data.length, 0, canOwn);
        FS.close(stream);
        FS.chmod(node, mode);
      }
    },
    createDevice(parent, name, input, output) {
      var path = PATH.join2(
        typeof parent == "string" ? parent : FS.getPath(parent),
        name
      );
      var mode = FS_getMode(!!input, !!output);
      FS.createDevice.major ??= 64;
      var dev = FS.makedev(FS.createDevice.major++, 0);
      FS.registerDevice(dev, {
        open(stream) {
          stream.seekable = false;
        },
        close(stream) {
          if (output?.buffer?.length) {
            output(10);
          }
        },
        read(stream, buffer, offset, length, pos) {
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = input();
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === void 0 && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === void 0) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.atime = Date.now();
          }
          return bytesRead;
        },
        write(stream, buffer, offset, length, pos) {
          for (var i = 0; i < length; i++) {
            try {
              output(buffer[offset + i]);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          }
          if (length) {
            stream.node.mtime = stream.node.ctime = Date.now();
          }
          return i;
        }
      });
      return FS.mkdev(path, mode, dev);
    },
    forceLoadFile(obj) {
      if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
      if (globalThis.XMLHttpRequest) {
        abort(
          "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
        );
      } else {
        try {
          obj.contents = readBinary(obj.url);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
      }
    },
    createLazyFile(parent, name, url, canRead, canWrite) {
      class LazyUint8Array {
        lengthKnown = false;
        chunks = [];
        get(idx) {
          if (idx > this.length - 1 || idx < 0) {
            return void 0;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = idx / this.chunkSize | 0;
          return this.getter(chunkNum)[chunkOffset];
        }
        setDataGetter(getter) {
          this.getter = getter;
        }
        cacheLength() {
          var xhr = new XMLHttpRequest();
          xhr.open("HEAD", url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
            abort("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
          var chunkSize = 1024 * 1024;
          if (!hasByteServing) chunkSize = datalength;
          var doXHR = (from, to) => {
            if (from > to)
              abort(
                "invalid range (" + from + ", " + to + ") or no bytes requested!"
              );
            if (to > datalength - 1)
              abort(
                "only " + datalength + " bytes available! programmer error!"
              );
            var xhr2 = new XMLHttpRequest();
            xhr2.open("GET", url, false);
            if (datalength !== chunkSize)
              xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
            xhr2.responseType = "arraybuffer";
            if (xhr2.overrideMimeType) {
              xhr2.overrideMimeType("text/plain; charset=x-user-defined");
            }
            xhr2.send(null);
            if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304))
              abort("Couldn't load " + url + ". Status: " + xhr2.status);
            if (xhr2.response !== void 0) {
              return new Uint8Array(xhr2.response || []);
            }
            return intArrayFromString(xhr2.responseText || "", true);
          };
          var lazyArray2 = this;
          lazyArray2.setDataGetter((chunkNum) => {
            var start = chunkNum * chunkSize;
            var end = (chunkNum + 1) * chunkSize - 1;
            end = Math.min(end, datalength - 1);
            if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
              lazyArray2.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray2.chunks[chunkNum] == "undefined")
              abort("doXHR failed!");
            return lazyArray2.chunks[chunkNum];
          });
          if (usesGzip || !datalength) {
            chunkSize = datalength = 1;
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out(
              "LazyFiles on gzip forces download of the whole file when length is accessed"
            );
          }
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        }
        get length() {
          if (!this.lengthKnown) {
            this.cacheLength();
          }
          return this._length;
        }
        get chunkSize() {
          if (!this.lengthKnown) {
            this.cacheLength();
          }
          return this._chunkSize;
        }
      }
      if (globalThis.XMLHttpRequest) {
        if (!ENVIRONMENT_IS_WORKER)
          abort(
            "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc"
          );
        var lazyArray = new LazyUint8Array();
        var properties = { isDevice: false, contents: lazyArray };
      } else {
        var properties = { isDevice: false, url };
      }
      var node = FS.createFile(parent, name, properties, canRead, canWrite);
      if (properties.contents) {
        node.contents = properties.contents;
      } else if (properties.url) {
        node.contents = null;
        node.url = properties.url;
      }
      Object.defineProperties(node, {
        usedBytes: {
          get: function() {
            return this.contents.length;
          }
        }
      });
      var stream_ops = {};
      for (const [key, fn] of Object.entries(node.stream_ops)) {
        stream_ops[key] = (...args) => {
          FS.forceLoadFile(node);
          return fn(...args);
        };
      }
      function writeChunks(stream, buffer, offset, length, position) {
        var contents = stream.node.contents;
        if (position >= contents.length) return 0;
        var size = Math.min(contents.length - position, length);
        if (contents.slice) {
          for (var i = 0; i < size; i++) {
            buffer[offset + i] = contents[position + i];
          }
        } else {
          for (var i = 0; i < size; i++) {
            buffer[offset + i] = contents.get(position + i);
          }
        }
        return size;
      }
      stream_ops.read = (stream, buffer, offset, length, position) => {
        FS.forceLoadFile(node);
        return writeChunks(stream, buffer, offset, length, position);
      };
      stream_ops.mmap = (stream, length, position, prot, flags) => {
        FS.forceLoadFile(node);
        var ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        writeChunks(stream, HEAP8, ptr, length, position);
        return { ptr, allocated: true };
      };
      node.stream_ops = stream_ops;
      return node;
    }
  };
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
    if (!ptr) return "";
    var end = findStringEnd(HEAPU8, ptr, maxBytesToRead, ignoreNul);
    return UTF8Decoder.decode(HEAPU8.subarray(ptr, end));
  };
  var SYSCALLS = {
    DEFAULT_POLLMASK: 5,
    calculateAt(dirfd, path, allowEmpty) {
      if (PATH.isAbs(path)) {
        return path;
      }
      var dir;
      if (dirfd === -100) {
        dir = FS.cwd();
      } else {
        var dirstream = SYSCALLS.getStreamFromFD(dirfd);
        dir = dirstream.path;
      }
      if (path.length == 0) {
        if (!allowEmpty) {
          throw new FS.ErrnoError(44);
        }
        return dir;
      }
      return dir + "/" + path;
    },
    writeStat(buf, stat) {
      HEAPU32[buf >> 2] = stat.dev;
      HEAPU32[buf + 4 >> 2] = stat.mode;
      HEAPU32[buf + 8 >> 2] = stat.nlink;
      HEAPU32[buf + 12 >> 2] = stat.uid;
      HEAPU32[buf + 16 >> 2] = stat.gid;
      HEAPU32[buf + 20 >> 2] = stat.rdev;
      HEAP64[buf + 24 >> 3] = BigInt(stat.size);
      HEAP32[buf + 32 >> 2] = 4096;
      HEAP32[buf + 36 >> 2] = stat.blocks;
      var atime = stat.atime.getTime();
      var mtime = stat.mtime.getTime();
      var ctime = stat.ctime.getTime();
      HEAP64[buf + 40 >> 3] = BigInt(Math.floor(atime / 1e3));
      HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
      HEAP64[buf + 56 >> 3] = BigInt(Math.floor(mtime / 1e3));
      HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
      HEAP64[buf + 72 >> 3] = BigInt(Math.floor(ctime / 1e3));
      HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
      HEAP64[buf + 88 >> 3] = BigInt(stat.ino);
      return 0;
    },
    writeStatFs(buf, stats) {
      HEAPU32[buf + 4 >> 2] = stats.bsize;
      HEAPU32[buf + 60 >> 2] = stats.bsize;
      HEAP64[buf + 8 >> 3] = BigInt(stats.blocks);
      HEAP64[buf + 16 >> 3] = BigInt(stats.bfree);
      HEAP64[buf + 24 >> 3] = BigInt(stats.bavail);
      HEAP64[buf + 32 >> 3] = BigInt(stats.files);
      HEAP64[buf + 40 >> 3] = BigInt(stats.ffree);
      HEAPU32[buf + 48 >> 2] = stats.fsid;
      HEAPU32[buf + 64 >> 2] = stats.flags;
      HEAPU32[buf + 56 >> 2] = stats.namelen;
    },
    doMsync(addr, stream, len, flags, offset) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (flags & 2) {
        return 0;
      }
      var buffer = HEAPU8.slice(addr, addr + len);
      FS.msync(stream, buffer, offset, len, flags);
    },
    getStreamFromFD(fd) {
      var stream = FS.getStreamChecked(fd);
      return stream;
    },
    varargs: void 0,
    getStr(ptr) {
      var ret = UTF8ToString(ptr);
      return ret;
    }
  };
  function ___syscall_chmod(path, mode) {
    try {
      path = SYSCALLS.getStr(path);
      FS.chmod(path, mode);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_faccessat(dirfd, path, amode, flags) {
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (amode & ~7) {
        return -28;
      }
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      if (!node) {
        return -44;
      }
      var perms = "";
      if (amode & 4) perms += "r";
      if (amode & 2) perms += "w";
      if (amode & 1) perms += "x";
      if (perms && FS.nodePermissions(node, perms)) {
        return -2;
      }
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_fchmod(fd, mode) {
    try {
      FS.fchmod(fd, mode);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_fchown32(fd, owner, group) {
    try {
      FS.fchown(fd, owner, group);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var syscallGetVarargI = () => {
    var ret = HEAP32[+SYSCALLS.varargs >> 2];
    SYSCALLS.varargs += 4;
    return ret;
  };
  var syscallGetVarargP = syscallGetVarargI;
  function ___syscall_fcntl64(fd, cmd, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = syscallGetVarargI();
          if (arg < 0) {
            return -28;
          }
          while (FS.streams[arg]) {
            arg++;
          }
          var newStream;
          newStream = FS.dupStream(stream, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;
        case 3:
          return stream.flags;
        case 4: {
          var arg = syscallGetVarargI();
          stream.flags |= arg;
          return 0;
        }
        case 12: {
          var arg = syscallGetVarargP();
          var offset = 0;
          HEAP16[arg + offset >> 1] = 2;
          return 0;
        }
        case 13:
        case 14:
          return 0;
      }
      return -28;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_fstat64(fd, buf) {
    try {
      return SYSCALLS.writeStat(buf, FS.fstat(fd));
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var INT53_MAX = 9007199254740992;
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
  function ___syscall_ftruncate64(fd, length) {
    length = bigintToI53Checked(length);
    try {
      if (isNaN(length)) return -61;
      FS.ftruncate(fd, length);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
  };
  function ___syscall_getcwd(buf, size) {
    try {
      if (size === 0) return -28;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
      if (size < cwdLengthInBytes) return -68;
      stringToUTF8(cwd, buf, size);
      return cwdLengthInBytes;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_ioctl(fd, op, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21505: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcgets) {
            var termios = stream.tty.ops.ioctl_tcgets(stream);
            var argp = syscallGetVarargP();
            HEAP32[argp >> 2] = termios.c_iflag || 0;
            HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
            HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
            HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
            for (var i = 0; i < 32; i++) {
              HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
            }
            return 0;
          }
          return 0;
        }
        case 21510:
        case 21511:
        case 21512: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcsets) {
            var argp = syscallGetVarargP();
            var c_iflag = HEAP32[argp >> 2];
            var c_oflag = HEAP32[argp + 4 >> 2];
            var c_cflag = HEAP32[argp + 8 >> 2];
            var c_lflag = HEAP32[argp + 12 >> 2];
            var c_cc = [];
            for (var i = 0; i < 32; i++) {
              c_cc.push(HEAP8[argp + i + 17]);
            }
            return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
              c_iflag,
              c_oflag,
              c_cflag,
              c_lflag,
              c_cc
            });
          }
          return 0;
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = syscallGetVarargP();
          HEAP32[argp >> 2] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28;
        }
        case 21537:
        case 21531: {
          var argp = syscallGetVarargP();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tiocgwinsz) {
            var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
            var argp = syscallGetVarargP();
            HEAP16[argp >> 1] = winsize[0];
            HEAP16[argp + 2 >> 1] = winsize[1];
          }
          return 0;
        }
        case 21524: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21515: {
          if (!stream.tty) return -59;
          return 0;
        }
        default:
          return -28;
      }
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_lstat64(path, buf) {
    try {
      path = SYSCALLS.getStr(path);
      return SYSCALLS.writeStat(buf, FS.lstat(path));
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_mkdirat(dirfd, path, mode) {
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      FS.mkdir(path, mode, 0);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_newfstatat(dirfd, path, buf, flags) {
    try {
      path = SYSCALLS.getStr(path);
      var nofollow = flags & 256;
      var allowEmpty = flags & 4096;
      flags = flags & ~6400;
      path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
      return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_openat(dirfd, path, flags, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      var mode = varargs ? syscallGetVarargI() : 0;
      return FS.open(path, flags, mode).fd;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (bufsize <= 0) return -28;
      var ret = FS.readlink(path);
      var len = Math.min(bufsize, lengthBytesUTF8(ret));
      var endChar = HEAP8[buf + len];
      stringToUTF8(ret, buf, bufsize + 1);
      HEAP8[buf + len] = endChar;
      return len;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_rmdir(path) {
    try {
      path = SYSCALLS.getStr(path);
      FS.rmdir(path);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_stat64(path, buf) {
    try {
      path = SYSCALLS.getStr(path);
      return SYSCALLS.writeStat(buf, FS.stat(path));
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_unlinkat(dirfd, path, flags) {
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (!flags) {
        FS.unlink(path);
      } else if (flags === 512) {
        FS.rmdir(path);
      } else {
        return -28;
      }
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var readI53FromI64 = (ptr) => {
    return HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296;
  };
  function ___syscall_utimensat(dirfd, path, times, flags) {
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path, true);
      var now = Date.now(), atime, mtime;
      if (!times) {
        atime = now;
        mtime = now;
      } else {
        var seconds = readI53FromI64(times);
        var nanoseconds = HEAP32[times + 8 >> 2];
        if (nanoseconds == 1073741823) {
          atime = now;
        } else if (nanoseconds == 1073741822) {
          atime = null;
        } else {
          atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
        }
        times += 16;
        seconds = readI53FromI64(times);
        nanoseconds = HEAP32[times + 8 >> 2];
        if (nanoseconds == 1073741823) {
          mtime = now;
        } else if (nanoseconds == 1073741822) {
          mtime = null;
        } else {
          mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
        }
      }
      if ((mtime ?? atime) !== null) {
        FS.utime(path, atime, mtime);
      }
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  var MONTH_DAYS_LEAP_CUMULATIVE = [
    0,
    31,
    60,
    91,
    121,
    152,
    182,
    213,
    244,
    274,
    305,
    335
  ];
  var MONTH_DAYS_REGULAR_CUMULATIVE = [
    0,
    31,
    59,
    90,
    120,
    151,
    181,
    212,
    243,
    273,
    304,
    334
  ];
  var ydayFromDate = (date) => {
    var leap = isLeapYear(date.getFullYear());
    var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
    var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
    return yday;
  };
  function __localtime_js(time, tmPtr) {
    time = bigintToI53Checked(time);
    var date = new Date(time * 1e3);
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var yday = ydayFromDate(date) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
    HEAP32[tmPtr + 32 >> 2] = dst;
  }
  function __mmap_js(len, prot, flags, fd, offset, allocated, addr) {
    offset = bigintToI53Checked(offset);
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var res = FS.mmap(stream, len, offset, prot, flags);
      var ptr = res.ptr;
      HEAP32[allocated >> 2] = res.allocated;
      HEAPU32[addr >> 2] = ptr;
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function __munmap_js(addr, len, prot, flags, fd, offset) {
    offset = bigintToI53Checked(offset);
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      if (prot & 2) {
        SYSCALLS.doMsync(addr, stream, len, flags, offset);
      }
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var __tzset_js = (timezone, daylight, std_name, dst_name) => {
    var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    var winter = new Date(currentYear, 0, 1);
    var summer = new Date(currentYear, 6, 1);
    var winterOffset = winter.getTimezoneOffset();
    var summerOffset = summer.getTimezoneOffset();
    var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
    HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
    HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
    var extractZone = (timezoneOffset) => {
      var sign = timezoneOffset >= 0 ? "-" : "+";
      var absOffset = Math.abs(timezoneOffset);
      var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
      var minutes = String(absOffset % 60).padStart(2, "0");
      return \`UTC\${sign}\${hours}\${minutes}\`;
    };
    var winterName = extractZone(winterOffset);
    var summerName = extractZone(summerOffset);
    if (summerOffset < winterOffset) {
      stringToUTF8(winterName, std_name, 17);
      stringToUTF8(summerName, dst_name, 17);
    } else {
      stringToUTF8(winterName, dst_name, 17);
      stringToUTF8(summerName, std_name, 17);
    }
  };
  var _emscripten_get_now = () => performance.now();
  var _emscripten_date_now = () => Date.now();
  var nowIsMonotonic = 1;
  var checkWasiClock = (clock_id) => clock_id >= 0 && clock_id <= 3;
  function _clock_time_get(clk_id, ignored_precision, ptime) {
    ignored_precision = bigintToI53Checked(ignored_precision);
    if (!checkWasiClock(clk_id)) {
      return 28;
    }
    var now;
    if (clk_id === 0) {
      now = _emscripten_date_now();
    } else if (nowIsMonotonic) {
      now = _emscripten_get_now();
    } else {
      return 52;
    }
    var nsec = Math.round(now * 1e3 * 1e3);
    HEAP64[ptime >> 3] = BigInt(nsec);
    return 0;
  }
  var getHeapMax = () => 2147483648;
  var _emscripten_get_heap_max = () => getHeapMax();
  var growMemory = (size) => {
    var oldHeapSize = wasmMemory.buffer.byteLength;
    var pages = (size - oldHeapSize + 65535) / 65536 | 0;
    try {
      wasmMemory.grow(pages);
      updateMemoryViews();
      return 1;
    } catch (e) {
    }
  };
  var _emscripten_resize_heap = (requestedSize) => {
    var oldSize = HEAPU8.length;
    requestedSize >>>= 0;
    var maxHeapSize = getHeapMax();
    if (requestedSize > maxHeapSize) {
      return false;
    }
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
      var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
      overGrownHeapSize = Math.min(
        overGrownHeapSize,
        requestedSize + 100663296
      );
      var newSize = Math.min(
        maxHeapSize,
        alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536)
      );
      var replacement = growMemory(newSize);
      if (replacement) {
        return true;
      }
    }
    return false;
  };
  var ENV = {};
  var getExecutableName = () => thisProgram || "./this.program";
  var getEnvStrings = () => {
    if (!getEnvStrings.strings) {
      var lang = (typeof navigator == "object" && navigator.language || "C").replace(
        "-",
        "_"
      ) + ".UTF-8";
      var env = {
        USER: "web_user",
        LOGNAME: "web_user",
        PATH: "/",
        PWD: "/",
        HOME: "/home/web_user",
        LANG: lang,
        _: getExecutableName()
      };
      for (var x in ENV) {
        if (ENV[x] === void 0) delete env[x];
        else env[x] = ENV[x];
      }
      var strings = [];
      for (var x in env) {
        strings.push(\`\${x}=\${env[x]}\`);
      }
      getEnvStrings.strings = strings;
    }
    return getEnvStrings.strings;
  };
  var _environ_get = (__environ, environ_buf) => {
    var bufSize = 0;
    var envp = 0;
    for (var string of getEnvStrings()) {
      var ptr = environ_buf + bufSize;
      HEAPU32[__environ + envp >> 2] = ptr;
      bufSize += stringToUTF8(string, ptr, Infinity) + 1;
      envp += 4;
    }
    return 0;
  };
  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
    var strings = getEnvStrings();
    HEAPU32[penviron_count >> 2] = strings.length;
    var bufSize = 0;
    for (var string of strings) {
      bufSize += lengthBytesUTF8(string) + 1;
    }
    HEAPU32[penviron_buf_size >> 2] = bufSize;
    return 0;
  };
  function _fd_close(fd) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  function _fd_fdstat_get(fd, pbuf) {
    try {
      var rightsBase = 0;
      var rightsInheriting = 0;
      var flags = 0;
      {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
      }
      HEAP8[pbuf] = type;
      HEAP16[pbuf + 2 >> 1] = flags;
      HEAP64[pbuf + 8 >> 3] = BigInt(rightsBase);
      HEAP64[pbuf + 16 >> 3] = BigInt(rightsInheriting);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  var doReadv = (stream, iov, iovcnt, offset) => {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAPU32[iov >> 2];
      var len = HEAPU32[iov + 4 >> 2];
      iov += 8;
      var curr = FS.read(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
      if (curr < len) break;
      if (typeof offset != "undefined") {
        offset += curr;
      }
    }
    return ret;
  };
  function _fd_read(fd, iov, iovcnt, pnum) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[pnum >> 2] = num;
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
    try {
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      HEAP64[newOffset >> 3] = BigInt(stream.position);
      if (stream.getdents && offset === 0 && whence === 0)
        stream.getdents = null;
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  function _fd_sync(fd) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      if (stream.stream_ops?.fsync) {
        return stream.stream_ops.fsync(stream);
      }
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  var doWritev = (stream, iov, iovcnt, offset) => {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAPU32[iov >> 2];
      var len = HEAPU32[iov + 4 >> 2];
      iov += 8;
      var curr = FS.write(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
      if (curr < len) {
        break;
      }
      if (typeof offset != "undefined") {
        offset += curr;
      }
    }
    return ret;
  };
  function _fd_write(fd, iov, iovcnt, pnum) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[pnum >> 2] = num;
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.preloadFile = FS_preloadFile;
  FS.staticInit();
  {
    initMemory();
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
    if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
    if (Module["print"]) out = Module["print"];
    if (Module["printErr"]) err = Module["printErr"];
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].shift()();
      }
    }
  }
  Module["wasmMemory"] = wasmMemory;
  var _sqlite3_status64, _sqlite3_status, _sqlite3_db_status64, _sqlite3_msize, _sqlite3_db_status, _sqlite3_vfs_find, _sqlite3_initialize, _sqlite3_malloc, _sqlite3_free, _sqlite3_vfs_register, _sqlite3_vfs_unregister, _sqlite3_malloc64, _sqlite3_realloc, _sqlite3_realloc64, _sqlite3_value_text, _sqlite3_randomness, _sqlite3_stricmp, _sqlite3_strnicmp, _sqlite3_uri_parameter, _sqlite3_uri_boolean, _sqlite3_serialize, _sqlite3_prepare_v2, _sqlite3_step, _sqlite3_column_int64, _sqlite3_reset, _sqlite3_exec, _sqlite3_column_int, _sqlite3_finalize, _sqlite3_file_control, _sqlite3_column_name, _sqlite3_column_text, _sqlite3_column_type, _sqlite3_errmsg, _sqlite3_deserialize, _sqlite3_clear_bindings, _sqlite3_value_blob, _sqlite3_value_bytes, _sqlite3_value_double, _sqlite3_value_int, _sqlite3_value_int64, _sqlite3_value_subtype, _sqlite3_value_pointer, _sqlite3_value_type, _sqlite3_value_nochange, _sqlite3_value_frombind, _sqlite3_value_dup, _sqlite3_value_free, _sqlite3_result_blob, _sqlite3_result_error_toobig, _sqlite3_result_error_nomem, _sqlite3_result_double, _sqlite3_result_error, _sqlite3_result_int, _sqlite3_result_int64, _sqlite3_result_null, _sqlite3_result_pointer, _sqlite3_result_subtype, _sqlite3_result_text, _sqlite3_result_zeroblob, _sqlite3_result_zeroblob64, _sqlite3_result_error_code, _sqlite3_user_data, _sqlite3_context_db_handle, _sqlite3_vtab_nochange, _sqlite3_vtab_in_first, _sqlite3_vtab_in_next, _sqlite3_aggregate_context, _sqlite3_get_auxdata, _sqlite3_set_auxdata, _sqlite3_column_count, _sqlite3_data_count, _sqlite3_column_blob, _sqlite3_column_bytes, _sqlite3_column_double, _sqlite3_column_value, _sqlite3_column_decltype, _sqlite3_column_database_name, _sqlite3_column_table_name, _sqlite3_column_origin_name, _sqlite3_bind_blob, _sqlite3_bind_double, _sqlite3_bind_int, _sqlite3_bind_int64, _sqlite3_bind_null, _sqlite3_bind_pointer, _sqlite3_bind_text, _sqlite3_bind_parameter_count, _sqlite3_bind_parameter_name, _sqlite3_bind_parameter_index, _sqlite3_db_handle, _sqlite3_stmt_readonly, _sqlite3_stmt_isexplain, _sqlite3_stmt_explain, _sqlite3_stmt_busy, _sqlite3_stmt_status, _sqlite3_sql, _sqlite3_expanded_sql, _sqlite3_preupdate_old, _sqlite3_preupdate_count, _sqlite3_preupdate_depth, _sqlite3_preupdate_blobwrite, _sqlite3_preupdate_new, _sqlite3_value_numeric_type, _sqlite3_set_authorizer, _sqlite3_strglob, _sqlite3_strlike, _sqlite3_auto_extension, _sqlite3_cancel_auto_extension, _sqlite3_reset_auto_extension, _sqlite3_prepare_v3, _sqlite3_create_module, _sqlite3_create_module_v2, _sqlite3_drop_modules, _sqlite3_declare_vtab, _sqlite3_vtab_on_conflict, _sqlite3_vtab_collation, _sqlite3_vtab_in, _sqlite3_vtab_rhs_value, _sqlite3_vtab_distinct, _sqlite3_keyword_name, _sqlite3_keyword_count, _sqlite3_keyword_check, _sqlite3_complete, _sqlite3_libversion, _sqlite3_libversion_number, _sqlite3_shutdown, _sqlite3_last_insert_rowid, _sqlite3_set_last_insert_rowid, _sqlite3_changes64, _sqlite3_changes, _sqlite3_total_changes64, _sqlite3_total_changes, _sqlite3_txn_state, _sqlite3_close_v2, _sqlite3_busy_handler, _sqlite3_progress_handler, _sqlite3_busy_timeout, _sqlite3_interrupt, _sqlite3_is_interrupted, _sqlite3_create_function, _sqlite3_create_function_v2, _sqlite3_create_window_function, _sqlite3_overload_function, _sqlite3_trace_v2, _sqlite3_commit_hook, _sqlite3_update_hook, _sqlite3_rollback_hook, _sqlite3_preupdate_hook, _sqlite3_set_errmsg, _sqlite3_error_offset, _sqlite3_errcode, _sqlite3_extended_errcode, _sqlite3_errstr, _sqlite3_limit, _sqlite3_open, _sqlite3_open_v2, _sqlite3_create_collation, _sqlite3_create_collation_v2, _sqlite3_collation_needed, _sqlite3_get_autocommit, _sqlite3_table_column_metadata, _sqlite3_extended_result_codes, _sqlite3_uri_key, _sqlite3_uri_int64, _sqlite3_db_name, _sqlite3_db_filename, _sqlite3_db_readonly, _sqlite3_compileoption_used, _sqlite3_compileoption_get, _sqlite3session_diff, _sqlite3session_attach, _sqlite3session_create, _sqlite3session_delete, _sqlite3session_table_filter, _sqlite3session_changeset, _sqlite3session_changeset_strm, _sqlite3session_patchset_strm, _sqlite3session_patchset, _sqlite3session_enable, _sqlite3session_indirect, _sqlite3session_isempty, _sqlite3session_memory_used, _sqlite3session_object_config, _sqlite3session_changeset_size, _sqlite3changeset_start, _sqlite3changeset_start_v2, _sqlite3changeset_start_strm, _sqlite3changeset_start_v2_strm, _sqlite3changeset_next, _sqlite3changeset_op, _sqlite3changeset_pk, _sqlite3changeset_old, _sqlite3changeset_new, _sqlite3changeset_conflict, _sqlite3changeset_fk_conflicts, _sqlite3changeset_finalize, _sqlite3changeset_invert, _sqlite3changeset_invert_strm, _sqlite3changeset_apply_v2, _sqlite3changeset_apply_v3, _sqlite3changeset_apply, _sqlite3changeset_apply_v3_strm, _sqlite3changeset_apply_v2_strm, _sqlite3changeset_apply_strm, _sqlite3changegroup_new, _sqlite3changegroup_add, _sqlite3changegroup_output, _sqlite3changegroup_add_strm, _sqlite3changegroup_output_strm, _sqlite3changegroup_delete, _sqlite3changeset_concat, _sqlite3changeset_concat_strm, _sqlite3session_config, _sqlite3_sourceid, _sqlite3__wasm_pstack_ptr, _sqlite3__wasm_pstack_restore, _sqlite3__wasm_pstack_alloc, _sqlite3__wasm_pstack_remaining, _sqlite3__wasm_pstack_quota, _sqlite3__wasm_test_struct, _sqlite3__wasm_enum_json, _sqlite3__wasm_vfs_unlink, _sqlite3__wasm_db_vfs, _sqlite3__wasm_db_reset, _sqlite3__wasm_db_export_chunked, _sqlite3__wasm_db_serialize, _sqlite3__wasm_vfs_create_file, _sqlite3__wasm_posix_create_file, _sqlite3__wasm_kvvfsMakeKeyOnPstack, _sqlite3__wasm_kvvfs_methods, _sqlite3__wasm_vtab_config, _sqlite3__wasm_db_config_ip, _sqlite3__wasm_db_config_pii, _sqlite3__wasm_db_config_s, _sqlite3__wasm_config_i, _sqlite3__wasm_config_ii, _sqlite3__wasm_config_j, _sqlite3__wasm_qfmt_token, _sqlite3__wasm_init_wasmfs, _sqlite3__wasm_test_intptr, _sqlite3__wasm_test_voidptr, _sqlite3__wasm_test_int64_max, _sqlite3__wasm_test_int64_min, _sqlite3__wasm_test_int64_times2, _sqlite3__wasm_test_int64_minmax, _sqlite3__wasm_test_int64ptr, _sqlite3__wasm_test_stack_overflow, _sqlite3__wasm_test_str_hello, _sqlite3__wasm_SQLTester_strglob, _malloc, _free, _realloc, _emscripten_builtin_memalign, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current, __indirect_function_table;
  function assignWasmExports(wasmExports2) {
    _sqlite3_status64 = Module["_sqlite3_status64"] = wasmExports2["sqlite3_status64"];
    _sqlite3_status = Module["_sqlite3_status"] = wasmExports2["sqlite3_status"];
    _sqlite3_db_status64 = Module["_sqlite3_db_status64"] = wasmExports2["sqlite3_db_status64"];
    _sqlite3_msize = Module["_sqlite3_msize"] = wasmExports2["sqlite3_msize"];
    _sqlite3_db_status = Module["_sqlite3_db_status"] = wasmExports2["sqlite3_db_status"];
    _sqlite3_vfs_find = Module["_sqlite3_vfs_find"] = wasmExports2["sqlite3_vfs_find"];
    _sqlite3_initialize = Module["_sqlite3_initialize"] = wasmExports2["sqlite3_initialize"];
    _sqlite3_malloc = Module["_sqlite3_malloc"] = wasmExports2["sqlite3_malloc"];
    _sqlite3_free = Module["_sqlite3_free"] = wasmExports2["sqlite3_free"];
    _sqlite3_vfs_register = Module["_sqlite3_vfs_register"] = wasmExports2["sqlite3_vfs_register"];
    _sqlite3_vfs_unregister = Module["_sqlite3_vfs_unregister"] = wasmExports2["sqlite3_vfs_unregister"];
    _sqlite3_malloc64 = Module["_sqlite3_malloc64"] = wasmExports2["sqlite3_malloc64"];
    _sqlite3_realloc = Module["_sqlite3_realloc"] = wasmExports2["sqlite3_realloc"];
    _sqlite3_realloc64 = Module["_sqlite3_realloc64"] = wasmExports2["sqlite3_realloc64"];
    _sqlite3_value_text = Module["_sqlite3_value_text"] = wasmExports2["sqlite3_value_text"];
    _sqlite3_randomness = Module["_sqlite3_randomness"] = wasmExports2["sqlite3_randomness"];
    _sqlite3_stricmp = Module["_sqlite3_stricmp"] = wasmExports2["sqlite3_stricmp"];
    _sqlite3_strnicmp = Module["_sqlite3_strnicmp"] = wasmExports2["sqlite3_strnicmp"];
    _sqlite3_uri_parameter = Module["_sqlite3_uri_parameter"] = wasmExports2["sqlite3_uri_parameter"];
    _sqlite3_uri_boolean = Module["_sqlite3_uri_boolean"] = wasmExports2["sqlite3_uri_boolean"];
    _sqlite3_serialize = Module["_sqlite3_serialize"] = wasmExports2["sqlite3_serialize"];
    _sqlite3_prepare_v2 = Module["_sqlite3_prepare_v2"] = wasmExports2["sqlite3_prepare_v2"];
    _sqlite3_step = Module["_sqlite3_step"] = wasmExports2["sqlite3_step"];
    _sqlite3_column_int64 = Module["_sqlite3_column_int64"] = wasmExports2["sqlite3_column_int64"];
    _sqlite3_reset = Module["_sqlite3_reset"] = wasmExports2["sqlite3_reset"];
    _sqlite3_exec = Module["_sqlite3_exec"] = wasmExports2["sqlite3_exec"];
    _sqlite3_column_int = Module["_sqlite3_column_int"] = wasmExports2["sqlite3_column_int"];
    _sqlite3_finalize = Module["_sqlite3_finalize"] = wasmExports2["sqlite3_finalize"];
    _sqlite3_file_control = Module["_sqlite3_file_control"] = wasmExports2["sqlite3_file_control"];
    _sqlite3_column_name = Module["_sqlite3_column_name"] = wasmExports2["sqlite3_column_name"];
    _sqlite3_column_text = Module["_sqlite3_column_text"] = wasmExports2["sqlite3_column_text"];
    _sqlite3_column_type = Module["_sqlite3_column_type"] = wasmExports2["sqlite3_column_type"];
    _sqlite3_errmsg = Module["_sqlite3_errmsg"] = wasmExports2["sqlite3_errmsg"];
    _sqlite3_deserialize = Module["_sqlite3_deserialize"] = wasmExports2["sqlite3_deserialize"];
    _sqlite3_clear_bindings = Module["_sqlite3_clear_bindings"] = wasmExports2["sqlite3_clear_bindings"];
    _sqlite3_value_blob = Module["_sqlite3_value_blob"] = wasmExports2["sqlite3_value_blob"];
    _sqlite3_value_bytes = Module["_sqlite3_value_bytes"] = wasmExports2["sqlite3_value_bytes"];
    _sqlite3_value_double = Module["_sqlite3_value_double"] = wasmExports2["sqlite3_value_double"];
    _sqlite3_value_int = Module["_sqlite3_value_int"] = wasmExports2["sqlite3_value_int"];
    _sqlite3_value_int64 = Module["_sqlite3_value_int64"] = wasmExports2["sqlite3_value_int64"];
    _sqlite3_value_subtype = Module["_sqlite3_value_subtype"] = wasmExports2["sqlite3_value_subtype"];
    _sqlite3_value_pointer = Module["_sqlite3_value_pointer"] = wasmExports2["sqlite3_value_pointer"];
    _sqlite3_value_type = Module["_sqlite3_value_type"] = wasmExports2["sqlite3_value_type"];
    _sqlite3_value_nochange = Module["_sqlite3_value_nochange"] = wasmExports2["sqlite3_value_nochange"];
    _sqlite3_value_frombind = Module["_sqlite3_value_frombind"] = wasmExports2["sqlite3_value_frombind"];
    _sqlite3_value_dup = Module["_sqlite3_value_dup"] = wasmExports2["sqlite3_value_dup"];
    _sqlite3_value_free = Module["_sqlite3_value_free"] = wasmExports2["sqlite3_value_free"];
    _sqlite3_result_blob = Module["_sqlite3_result_blob"] = wasmExports2["sqlite3_result_blob"];
    _sqlite3_result_error_toobig = Module["_sqlite3_result_error_toobig"] = wasmExports2["sqlite3_result_error_toobig"];
    _sqlite3_result_error_nomem = Module["_sqlite3_result_error_nomem"] = wasmExports2["sqlite3_result_error_nomem"];
    _sqlite3_result_double = Module["_sqlite3_result_double"] = wasmExports2["sqlite3_result_double"];
    _sqlite3_result_error = Module["_sqlite3_result_error"] = wasmExports2["sqlite3_result_error"];
    _sqlite3_result_int = Module["_sqlite3_result_int"] = wasmExports2["sqlite3_result_int"];
    _sqlite3_result_int64 = Module["_sqlite3_result_int64"] = wasmExports2["sqlite3_result_int64"];
    _sqlite3_result_null = Module["_sqlite3_result_null"] = wasmExports2["sqlite3_result_null"];
    _sqlite3_result_pointer = Module["_sqlite3_result_pointer"] = wasmExports2["sqlite3_result_pointer"];
    _sqlite3_result_subtype = Module["_sqlite3_result_subtype"] = wasmExports2["sqlite3_result_subtype"];
    _sqlite3_result_text = Module["_sqlite3_result_text"] = wasmExports2["sqlite3_result_text"];
    _sqlite3_result_zeroblob = Module["_sqlite3_result_zeroblob"] = wasmExports2["sqlite3_result_zeroblob"];
    _sqlite3_result_zeroblob64 = Module["_sqlite3_result_zeroblob64"] = wasmExports2["sqlite3_result_zeroblob64"];
    _sqlite3_result_error_code = Module["_sqlite3_result_error_code"] = wasmExports2["sqlite3_result_error_code"];
    _sqlite3_user_data = Module["_sqlite3_user_data"] = wasmExports2["sqlite3_user_data"];
    _sqlite3_context_db_handle = Module["_sqlite3_context_db_handle"] = wasmExports2["sqlite3_context_db_handle"];
    _sqlite3_vtab_nochange = Module["_sqlite3_vtab_nochange"] = wasmExports2["sqlite3_vtab_nochange"];
    _sqlite3_vtab_in_first = Module["_sqlite3_vtab_in_first"] = wasmExports2["sqlite3_vtab_in_first"];
    _sqlite3_vtab_in_next = Module["_sqlite3_vtab_in_next"] = wasmExports2["sqlite3_vtab_in_next"];
    _sqlite3_aggregate_context = Module["_sqlite3_aggregate_context"] = wasmExports2["sqlite3_aggregate_context"];
    _sqlite3_get_auxdata = Module["_sqlite3_get_auxdata"] = wasmExports2["sqlite3_get_auxdata"];
    _sqlite3_set_auxdata = Module["_sqlite3_set_auxdata"] = wasmExports2["sqlite3_set_auxdata"];
    _sqlite3_column_count = Module["_sqlite3_column_count"] = wasmExports2["sqlite3_column_count"];
    _sqlite3_data_count = Module["_sqlite3_data_count"] = wasmExports2["sqlite3_data_count"];
    _sqlite3_column_blob = Module["_sqlite3_column_blob"] = wasmExports2["sqlite3_column_blob"];
    _sqlite3_column_bytes = Module["_sqlite3_column_bytes"] = wasmExports2["sqlite3_column_bytes"];
    _sqlite3_column_double = Module["_sqlite3_column_double"] = wasmExports2["sqlite3_column_double"];
    _sqlite3_column_value = Module["_sqlite3_column_value"] = wasmExports2["sqlite3_column_value"];
    _sqlite3_column_decltype = Module["_sqlite3_column_decltype"] = wasmExports2["sqlite3_column_decltype"];
    _sqlite3_column_database_name = Module["_sqlite3_column_database_name"] = wasmExports2["sqlite3_column_database_name"];
    _sqlite3_column_table_name = Module["_sqlite3_column_table_name"] = wasmExports2["sqlite3_column_table_name"];
    _sqlite3_column_origin_name = Module["_sqlite3_column_origin_name"] = wasmExports2["sqlite3_column_origin_name"];
    _sqlite3_bind_blob = Module["_sqlite3_bind_blob"] = wasmExports2["sqlite3_bind_blob"];
    _sqlite3_bind_double = Module["_sqlite3_bind_double"] = wasmExports2["sqlite3_bind_double"];
    _sqlite3_bind_int = Module["_sqlite3_bind_int"] = wasmExports2["sqlite3_bind_int"];
    _sqlite3_bind_int64 = Module["_sqlite3_bind_int64"] = wasmExports2["sqlite3_bind_int64"];
    _sqlite3_bind_null = Module["_sqlite3_bind_null"] = wasmExports2["sqlite3_bind_null"];
    _sqlite3_bind_pointer = Module["_sqlite3_bind_pointer"] = wasmExports2["sqlite3_bind_pointer"];
    _sqlite3_bind_text = Module["_sqlite3_bind_text"] = wasmExports2["sqlite3_bind_text"];
    _sqlite3_bind_parameter_count = Module["_sqlite3_bind_parameter_count"] = wasmExports2["sqlite3_bind_parameter_count"];
    _sqlite3_bind_parameter_name = Module["_sqlite3_bind_parameter_name"] = wasmExports2["sqlite3_bind_parameter_name"];
    _sqlite3_bind_parameter_index = Module["_sqlite3_bind_parameter_index"] = wasmExports2["sqlite3_bind_parameter_index"];
    _sqlite3_db_handle = Module["_sqlite3_db_handle"] = wasmExports2["sqlite3_db_handle"];
    _sqlite3_stmt_readonly = Module["_sqlite3_stmt_readonly"] = wasmExports2["sqlite3_stmt_readonly"];
    _sqlite3_stmt_isexplain = Module["_sqlite3_stmt_isexplain"] = wasmExports2["sqlite3_stmt_isexplain"];
    _sqlite3_stmt_explain = Module["_sqlite3_stmt_explain"] = wasmExports2["sqlite3_stmt_explain"];
    _sqlite3_stmt_busy = Module["_sqlite3_stmt_busy"] = wasmExports2["sqlite3_stmt_busy"];
    _sqlite3_stmt_status = Module["_sqlite3_stmt_status"] = wasmExports2["sqlite3_stmt_status"];
    _sqlite3_sql = Module["_sqlite3_sql"] = wasmExports2["sqlite3_sql"];
    _sqlite3_expanded_sql = Module["_sqlite3_expanded_sql"] = wasmExports2["sqlite3_expanded_sql"];
    _sqlite3_preupdate_old = Module["_sqlite3_preupdate_old"] = wasmExports2["sqlite3_preupdate_old"];
    _sqlite3_preupdate_count = Module["_sqlite3_preupdate_count"] = wasmExports2["sqlite3_preupdate_count"];
    _sqlite3_preupdate_depth = Module["_sqlite3_preupdate_depth"] = wasmExports2["sqlite3_preupdate_depth"];
    _sqlite3_preupdate_blobwrite = Module["_sqlite3_preupdate_blobwrite"] = wasmExports2["sqlite3_preupdate_blobwrite"];
    _sqlite3_preupdate_new = Module["_sqlite3_preupdate_new"] = wasmExports2["sqlite3_preupdate_new"];
    _sqlite3_value_numeric_type = Module["_sqlite3_value_numeric_type"] = wasmExports2["sqlite3_value_numeric_type"];
    _sqlite3_set_authorizer = Module["_sqlite3_set_authorizer"] = wasmExports2["sqlite3_set_authorizer"];
    _sqlite3_strglob = Module["_sqlite3_strglob"] = wasmExports2["sqlite3_strglob"];
    _sqlite3_strlike = Module["_sqlite3_strlike"] = wasmExports2["sqlite3_strlike"];
    _sqlite3_auto_extension = Module["_sqlite3_auto_extension"] = wasmExports2["sqlite3_auto_extension"];
    _sqlite3_cancel_auto_extension = Module["_sqlite3_cancel_auto_extension"] = wasmExports2["sqlite3_cancel_auto_extension"];
    _sqlite3_reset_auto_extension = Module["_sqlite3_reset_auto_extension"] = wasmExports2["sqlite3_reset_auto_extension"];
    _sqlite3_prepare_v3 = Module["_sqlite3_prepare_v3"] = wasmExports2["sqlite3_prepare_v3"];
    _sqlite3_create_module = Module["_sqlite3_create_module"] = wasmExports2["sqlite3_create_module"];
    _sqlite3_create_module_v2 = Module["_sqlite3_create_module_v2"] = wasmExports2["sqlite3_create_module_v2"];
    _sqlite3_drop_modules = Module["_sqlite3_drop_modules"] = wasmExports2["sqlite3_drop_modules"];
    _sqlite3_declare_vtab = Module["_sqlite3_declare_vtab"] = wasmExports2["sqlite3_declare_vtab"];
    _sqlite3_vtab_on_conflict = Module["_sqlite3_vtab_on_conflict"] = wasmExports2["sqlite3_vtab_on_conflict"];
    _sqlite3_vtab_collation = Module["_sqlite3_vtab_collation"] = wasmExports2["sqlite3_vtab_collation"];
    _sqlite3_vtab_in = Module["_sqlite3_vtab_in"] = wasmExports2["sqlite3_vtab_in"];
    _sqlite3_vtab_rhs_value = Module["_sqlite3_vtab_rhs_value"] = wasmExports2["sqlite3_vtab_rhs_value"];
    _sqlite3_vtab_distinct = Module["_sqlite3_vtab_distinct"] = wasmExports2["sqlite3_vtab_distinct"];
    _sqlite3_keyword_name = Module["_sqlite3_keyword_name"] = wasmExports2["sqlite3_keyword_name"];
    _sqlite3_keyword_count = Module["_sqlite3_keyword_count"] = wasmExports2["sqlite3_keyword_count"];
    _sqlite3_keyword_check = Module["_sqlite3_keyword_check"] = wasmExports2["sqlite3_keyword_check"];
    _sqlite3_complete = Module["_sqlite3_complete"] = wasmExports2["sqlite3_complete"];
    _sqlite3_libversion = Module["_sqlite3_libversion"] = wasmExports2["sqlite3_libversion"];
    _sqlite3_libversion_number = Module["_sqlite3_libversion_number"] = wasmExports2["sqlite3_libversion_number"];
    _sqlite3_shutdown = Module["_sqlite3_shutdown"] = wasmExports2["sqlite3_shutdown"];
    _sqlite3_last_insert_rowid = Module["_sqlite3_last_insert_rowid"] = wasmExports2["sqlite3_last_insert_rowid"];
    _sqlite3_set_last_insert_rowid = Module["_sqlite3_set_last_insert_rowid"] = wasmExports2["sqlite3_set_last_insert_rowid"];
    _sqlite3_changes64 = Module["_sqlite3_changes64"] = wasmExports2["sqlite3_changes64"];
    _sqlite3_changes = Module["_sqlite3_changes"] = wasmExports2["sqlite3_changes"];
    _sqlite3_total_changes64 = Module["_sqlite3_total_changes64"] = wasmExports2["sqlite3_total_changes64"];
    _sqlite3_total_changes = Module["_sqlite3_total_changes"] = wasmExports2["sqlite3_total_changes"];
    _sqlite3_txn_state = Module["_sqlite3_txn_state"] = wasmExports2["sqlite3_txn_state"];
    _sqlite3_close_v2 = Module["_sqlite3_close_v2"] = wasmExports2["sqlite3_close_v2"];
    _sqlite3_busy_handler = Module["_sqlite3_busy_handler"] = wasmExports2["sqlite3_busy_handler"];
    _sqlite3_progress_handler = Module["_sqlite3_progress_handler"] = wasmExports2["sqlite3_progress_handler"];
    _sqlite3_busy_timeout = Module["_sqlite3_busy_timeout"] = wasmExports2["sqlite3_busy_timeout"];
    _sqlite3_interrupt = Module["_sqlite3_interrupt"] = wasmExports2["sqlite3_interrupt"];
    _sqlite3_is_interrupted = Module["_sqlite3_is_interrupted"] = wasmExports2["sqlite3_is_interrupted"];
    _sqlite3_create_function = Module["_sqlite3_create_function"] = wasmExports2["sqlite3_create_function"];
    _sqlite3_create_function_v2 = Module["_sqlite3_create_function_v2"] = wasmExports2["sqlite3_create_function_v2"];
    _sqlite3_create_window_function = Module["_sqlite3_create_window_function"] = wasmExports2["sqlite3_create_window_function"];
    _sqlite3_overload_function = Module["_sqlite3_overload_function"] = wasmExports2["sqlite3_overload_function"];
    _sqlite3_trace_v2 = Module["_sqlite3_trace_v2"] = wasmExports2["sqlite3_trace_v2"];
    _sqlite3_commit_hook = Module["_sqlite3_commit_hook"] = wasmExports2["sqlite3_commit_hook"];
    _sqlite3_update_hook = Module["_sqlite3_update_hook"] = wasmExports2["sqlite3_update_hook"];
    _sqlite3_rollback_hook = Module["_sqlite3_rollback_hook"] = wasmExports2["sqlite3_rollback_hook"];
    _sqlite3_preupdate_hook = Module["_sqlite3_preupdate_hook"] = wasmExports2["sqlite3_preupdate_hook"];
    _sqlite3_set_errmsg = Module["_sqlite3_set_errmsg"] = wasmExports2["sqlite3_set_errmsg"];
    _sqlite3_error_offset = Module["_sqlite3_error_offset"] = wasmExports2["sqlite3_error_offset"];
    _sqlite3_errcode = Module["_sqlite3_errcode"] = wasmExports2["sqlite3_errcode"];
    _sqlite3_extended_errcode = Module["_sqlite3_extended_errcode"] = wasmExports2["sqlite3_extended_errcode"];
    _sqlite3_errstr = Module["_sqlite3_errstr"] = wasmExports2["sqlite3_errstr"];
    _sqlite3_limit = Module["_sqlite3_limit"] = wasmExports2["sqlite3_limit"];
    _sqlite3_open = Module["_sqlite3_open"] = wasmExports2["sqlite3_open"];
    _sqlite3_open_v2 = Module["_sqlite3_open_v2"] = wasmExports2["sqlite3_open_v2"];
    _sqlite3_create_collation = Module["_sqlite3_create_collation"] = wasmExports2["sqlite3_create_collation"];
    _sqlite3_create_collation_v2 = Module["_sqlite3_create_collation_v2"] = wasmExports2["sqlite3_create_collation_v2"];
    _sqlite3_collation_needed = Module["_sqlite3_collation_needed"] = wasmExports2["sqlite3_collation_needed"];
    _sqlite3_get_autocommit = Module["_sqlite3_get_autocommit"] = wasmExports2["sqlite3_get_autocommit"];
    _sqlite3_table_column_metadata = Module["_sqlite3_table_column_metadata"] = wasmExports2["sqlite3_table_column_metadata"];
    _sqlite3_extended_result_codes = Module["_sqlite3_extended_result_codes"] = wasmExports2["sqlite3_extended_result_codes"];
    _sqlite3_uri_key = Module["_sqlite3_uri_key"] = wasmExports2["sqlite3_uri_key"];
    _sqlite3_uri_int64 = Module["_sqlite3_uri_int64"] = wasmExports2["sqlite3_uri_int64"];
    _sqlite3_db_name = Module["_sqlite3_db_name"] = wasmExports2["sqlite3_db_name"];
    _sqlite3_db_filename = Module["_sqlite3_db_filename"] = wasmExports2["sqlite3_db_filename"];
    _sqlite3_db_readonly = Module["_sqlite3_db_readonly"] = wasmExports2["sqlite3_db_readonly"];
    _sqlite3_compileoption_used = Module["_sqlite3_compileoption_used"] = wasmExports2["sqlite3_compileoption_used"];
    _sqlite3_compileoption_get = Module["_sqlite3_compileoption_get"] = wasmExports2["sqlite3_compileoption_get"];
    _sqlite3session_diff = Module["_sqlite3session_diff"] = wasmExports2["sqlite3session_diff"];
    _sqlite3session_attach = Module["_sqlite3session_attach"] = wasmExports2["sqlite3session_attach"];
    _sqlite3session_create = Module["_sqlite3session_create"] = wasmExports2["sqlite3session_create"];
    _sqlite3session_delete = Module["_sqlite3session_delete"] = wasmExports2["sqlite3session_delete"];
    _sqlite3session_table_filter = Module["_sqlite3session_table_filter"] = wasmExports2["sqlite3session_table_filter"];
    _sqlite3session_changeset = Module["_sqlite3session_changeset"] = wasmExports2["sqlite3session_changeset"];
    _sqlite3session_changeset_strm = Module["_sqlite3session_changeset_strm"] = wasmExports2["sqlite3session_changeset_strm"];
    _sqlite3session_patchset_strm = Module["_sqlite3session_patchset_strm"] = wasmExports2["sqlite3session_patchset_strm"];
    _sqlite3session_patchset = Module["_sqlite3session_patchset"] = wasmExports2["sqlite3session_patchset"];
    _sqlite3session_enable = Module["_sqlite3session_enable"] = wasmExports2["sqlite3session_enable"];
    _sqlite3session_indirect = Module["_sqlite3session_indirect"] = wasmExports2["sqlite3session_indirect"];
    _sqlite3session_isempty = Module["_sqlite3session_isempty"] = wasmExports2["sqlite3session_isempty"];
    _sqlite3session_memory_used = Module["_sqlite3session_memory_used"] = wasmExports2["sqlite3session_memory_used"];
    _sqlite3session_object_config = Module["_sqlite3session_object_config"] = wasmExports2["sqlite3session_object_config"];
    _sqlite3session_changeset_size = Module["_sqlite3session_changeset_size"] = wasmExports2["sqlite3session_changeset_size"];
    _sqlite3changeset_start = Module["_sqlite3changeset_start"] = wasmExports2["sqlite3changeset_start"];
    _sqlite3changeset_start_v2 = Module["_sqlite3changeset_start_v2"] = wasmExports2["sqlite3changeset_start_v2"];
    _sqlite3changeset_start_strm = Module["_sqlite3changeset_start_strm"] = wasmExports2["sqlite3changeset_start_strm"];
    _sqlite3changeset_start_v2_strm = Module["_sqlite3changeset_start_v2_strm"] = wasmExports2["sqlite3changeset_start_v2_strm"];
    _sqlite3changeset_next = Module["_sqlite3changeset_next"] = wasmExports2["sqlite3changeset_next"];
    _sqlite3changeset_op = Module["_sqlite3changeset_op"] = wasmExports2["sqlite3changeset_op"];
    _sqlite3changeset_pk = Module["_sqlite3changeset_pk"] = wasmExports2["sqlite3changeset_pk"];
    _sqlite3changeset_old = Module["_sqlite3changeset_old"] = wasmExports2["sqlite3changeset_old"];
    _sqlite3changeset_new = Module["_sqlite3changeset_new"] = wasmExports2["sqlite3changeset_new"];
    _sqlite3changeset_conflict = Module["_sqlite3changeset_conflict"] = wasmExports2["sqlite3changeset_conflict"];
    _sqlite3changeset_fk_conflicts = Module["_sqlite3changeset_fk_conflicts"] = wasmExports2["sqlite3changeset_fk_conflicts"];
    _sqlite3changeset_finalize = Module["_sqlite3changeset_finalize"] = wasmExports2["sqlite3changeset_finalize"];
    _sqlite3changeset_invert = Module["_sqlite3changeset_invert"] = wasmExports2["sqlite3changeset_invert"];
    _sqlite3changeset_invert_strm = Module["_sqlite3changeset_invert_strm"] = wasmExports2["sqlite3changeset_invert_strm"];
    _sqlite3changeset_apply_v2 = Module["_sqlite3changeset_apply_v2"] = wasmExports2["sqlite3changeset_apply_v2"];
    _sqlite3changeset_apply_v3 = Module["_sqlite3changeset_apply_v3"] = wasmExports2["sqlite3changeset_apply_v3"];
    _sqlite3changeset_apply = Module["_sqlite3changeset_apply"] = wasmExports2["sqlite3changeset_apply"];
    _sqlite3changeset_apply_v3_strm = Module["_sqlite3changeset_apply_v3_strm"] = wasmExports2["sqlite3changeset_apply_v3_strm"];
    _sqlite3changeset_apply_v2_strm = Module["_sqlite3changeset_apply_v2_strm"] = wasmExports2["sqlite3changeset_apply_v2_strm"];
    _sqlite3changeset_apply_strm = Module["_sqlite3changeset_apply_strm"] = wasmExports2["sqlite3changeset_apply_strm"];
    _sqlite3changegroup_new = Module["_sqlite3changegroup_new"] = wasmExports2["sqlite3changegroup_new"];
    _sqlite3changegroup_add = Module["_sqlite3changegroup_add"] = wasmExports2["sqlite3changegroup_add"];
    _sqlite3changegroup_output = Module["_sqlite3changegroup_output"] = wasmExports2["sqlite3changegroup_output"];
    _sqlite3changegroup_add_strm = Module["_sqlite3changegroup_add_strm"] = wasmExports2["sqlite3changegroup_add_strm"];
    _sqlite3changegroup_output_strm = Module["_sqlite3changegroup_output_strm"] = wasmExports2["sqlite3changegroup_output_strm"];
    _sqlite3changegroup_delete = Module["_sqlite3changegroup_delete"] = wasmExports2["sqlite3changegroup_delete"];
    _sqlite3changeset_concat = Module["_sqlite3changeset_concat"] = wasmExports2["sqlite3changeset_concat"];
    _sqlite3changeset_concat_strm = Module["_sqlite3changeset_concat_strm"] = wasmExports2["sqlite3changeset_concat_strm"];
    _sqlite3session_config = Module["_sqlite3session_config"] = wasmExports2["sqlite3session_config"];
    _sqlite3_sourceid = Module["_sqlite3_sourceid"] = wasmExports2["sqlite3_sourceid"];
    _sqlite3__wasm_pstack_ptr = Module["_sqlite3__wasm_pstack_ptr"] = wasmExports2["sqlite3__wasm_pstack_ptr"];
    _sqlite3__wasm_pstack_restore = Module["_sqlite3__wasm_pstack_restore"] = wasmExports2["sqlite3__wasm_pstack_restore"];
    _sqlite3__wasm_pstack_alloc = Module["_sqlite3__wasm_pstack_alloc"] = wasmExports2["sqlite3__wasm_pstack_alloc"];
    _sqlite3__wasm_pstack_remaining = Module["_sqlite3__wasm_pstack_remaining"] = wasmExports2["sqlite3__wasm_pstack_remaining"];
    _sqlite3__wasm_pstack_quota = Module["_sqlite3__wasm_pstack_quota"] = wasmExports2["sqlite3__wasm_pstack_quota"];
    _sqlite3__wasm_test_struct = Module["_sqlite3__wasm_test_struct"] = wasmExports2["sqlite3__wasm_test_struct"];
    _sqlite3__wasm_enum_json = Module["_sqlite3__wasm_enum_json"] = wasmExports2["sqlite3__wasm_enum_json"];
    _sqlite3__wasm_vfs_unlink = Module["_sqlite3__wasm_vfs_unlink"] = wasmExports2["sqlite3__wasm_vfs_unlink"];
    _sqlite3__wasm_db_vfs = Module["_sqlite3__wasm_db_vfs"] = wasmExports2["sqlite3__wasm_db_vfs"];
    _sqlite3__wasm_db_reset = Module["_sqlite3__wasm_db_reset"] = wasmExports2["sqlite3__wasm_db_reset"];
    _sqlite3__wasm_db_export_chunked = Module["_sqlite3__wasm_db_export_chunked"] = wasmExports2["sqlite3__wasm_db_export_chunked"];
    _sqlite3__wasm_db_serialize = Module["_sqlite3__wasm_db_serialize"] = wasmExports2["sqlite3__wasm_db_serialize"];
    _sqlite3__wasm_vfs_create_file = Module["_sqlite3__wasm_vfs_create_file"] = wasmExports2["sqlite3__wasm_vfs_create_file"];
    _sqlite3__wasm_posix_create_file = Module["_sqlite3__wasm_posix_create_file"] = wasmExports2["sqlite3__wasm_posix_create_file"];
    _sqlite3__wasm_kvvfsMakeKeyOnPstack = Module["_sqlite3__wasm_kvvfsMakeKeyOnPstack"] = wasmExports2["sqlite3__wasm_kvvfsMakeKeyOnPstack"];
    _sqlite3__wasm_kvvfs_methods = Module["_sqlite3__wasm_kvvfs_methods"] = wasmExports2["sqlite3__wasm_kvvfs_methods"];
    _sqlite3__wasm_vtab_config = Module["_sqlite3__wasm_vtab_config"] = wasmExports2["sqlite3__wasm_vtab_config"];
    _sqlite3__wasm_db_config_ip = Module["_sqlite3__wasm_db_config_ip"] = wasmExports2["sqlite3__wasm_db_config_ip"];
    _sqlite3__wasm_db_config_pii = Module["_sqlite3__wasm_db_config_pii"] = wasmExports2["sqlite3__wasm_db_config_pii"];
    _sqlite3__wasm_db_config_s = Module["_sqlite3__wasm_db_config_s"] = wasmExports2["sqlite3__wasm_db_config_s"];
    _sqlite3__wasm_config_i = Module["_sqlite3__wasm_config_i"] = wasmExports2["sqlite3__wasm_config_i"];
    _sqlite3__wasm_config_ii = Module["_sqlite3__wasm_config_ii"] = wasmExports2["sqlite3__wasm_config_ii"];
    _sqlite3__wasm_config_j = Module["_sqlite3__wasm_config_j"] = wasmExports2["sqlite3__wasm_config_j"];
    _sqlite3__wasm_qfmt_token = Module["_sqlite3__wasm_qfmt_token"] = wasmExports2["sqlite3__wasm_qfmt_token"];
    _sqlite3__wasm_init_wasmfs = Module["_sqlite3__wasm_init_wasmfs"] = wasmExports2["sqlite3__wasm_init_wasmfs"];
    _sqlite3__wasm_test_intptr = Module["_sqlite3__wasm_test_intptr"] = wasmExports2["sqlite3__wasm_test_intptr"];
    _sqlite3__wasm_test_voidptr = Module["_sqlite3__wasm_test_voidptr"] = wasmExports2["sqlite3__wasm_test_voidptr"];
    _sqlite3__wasm_test_int64_max = Module["_sqlite3__wasm_test_int64_max"] = wasmExports2["sqlite3__wasm_test_int64_max"];
    _sqlite3__wasm_test_int64_min = Module["_sqlite3__wasm_test_int64_min"] = wasmExports2["sqlite3__wasm_test_int64_min"];
    _sqlite3__wasm_test_int64_times2 = Module["_sqlite3__wasm_test_int64_times2"] = wasmExports2["sqlite3__wasm_test_int64_times2"];
    _sqlite3__wasm_test_int64_minmax = Module["_sqlite3__wasm_test_int64_minmax"] = wasmExports2["sqlite3__wasm_test_int64_minmax"];
    _sqlite3__wasm_test_int64ptr = Module["_sqlite3__wasm_test_int64ptr"] = wasmExports2["sqlite3__wasm_test_int64ptr"];
    _sqlite3__wasm_test_stack_overflow = Module["_sqlite3__wasm_test_stack_overflow"] = wasmExports2["sqlite3__wasm_test_stack_overflow"];
    _sqlite3__wasm_test_str_hello = Module["_sqlite3__wasm_test_str_hello"] = wasmExports2["sqlite3__wasm_test_str_hello"];
    _sqlite3__wasm_SQLTester_strglob = Module["_sqlite3__wasm_SQLTester_strglob"] = wasmExports2["sqlite3__wasm_SQLTester_strglob"];
    _malloc = Module["_malloc"] = wasmExports2["malloc"];
    _free = Module["_free"] = wasmExports2["free"];
    _realloc = Module["_realloc"] = wasmExports2["realloc"];
    _emscripten_builtin_memalign = wasmExports2["emscripten_builtin_memalign"];
    __emscripten_stack_restore = wasmExports2["_emscripten_stack_restore"];
    __emscripten_stack_alloc = wasmExports2["_emscripten_stack_alloc"];
    _emscripten_stack_get_current = wasmExports2["emscripten_stack_get_current"];
    __indirect_function_table = wasmExports2["__indirect_function_table"];
  }
  var wasmImports = {
    __syscall_chmod: ___syscall_chmod,
    __syscall_faccessat: ___syscall_faccessat,
    __syscall_fchmod: ___syscall_fchmod,
    __syscall_fchown32: ___syscall_fchown32,
    __syscall_fcntl64: ___syscall_fcntl64,
    __syscall_fstat64: ___syscall_fstat64,
    __syscall_ftruncate64: ___syscall_ftruncate64,
    __syscall_getcwd: ___syscall_getcwd,
    __syscall_ioctl: ___syscall_ioctl,
    __syscall_lstat64: ___syscall_lstat64,
    __syscall_mkdirat: ___syscall_mkdirat,
    __syscall_newfstatat: ___syscall_newfstatat,
    __syscall_openat: ___syscall_openat,
    __syscall_readlinkat: ___syscall_readlinkat,
    __syscall_rmdir: ___syscall_rmdir,
    __syscall_stat64: ___syscall_stat64,
    __syscall_unlinkat: ___syscall_unlinkat,
    __syscall_utimensat: ___syscall_utimensat,
    _localtime_js: __localtime_js,
    _mmap_js: __mmap_js,
    _munmap_js: __munmap_js,
    _tzset_js: __tzset_js,
    clock_time_get: _clock_time_get,
    emscripten_date_now: _emscripten_date_now,
    emscripten_get_heap_max: _emscripten_get_heap_max,
    emscripten_get_now: _emscripten_get_now,
    emscripten_resize_heap: _emscripten_resize_heap,
    environ_get: _environ_get,
    environ_sizes_get: _environ_sizes_get,
    fd_close: _fd_close,
    fd_fdstat_get: _fd_fdstat_get,
    fd_read: _fd_read,
    fd_seek: _fd_seek,
    fd_sync: _fd_sync,
    fd_write: _fd_write,
    memory: wasmMemory
  };
  function run() {
    if (runDependencies > 0) {
      dependenciesFulfilled = run;
      return;
    }
    preRun();
    if (runDependencies > 0) {
      dependenciesFulfilled = run;
      return;
    }
    function doRun() {
      Module["calledRun"] = true;
      if (ABORT) return;
      initRuntime();
      readyPromiseResolve?.(Module);
      Module["onRuntimeInitialized"]?.();
      postRun();
    }
    if (Module["setStatus"]) {
      Module["setStatus"]("Running...");
      setTimeout(() => {
        setTimeout(() => Module["setStatus"](""), 1);
        doRun();
      }, 1);
    } else {
      doRun();
    }
  }
  var wasmExports;
  wasmExports = await createWasm();
  run();
  Module.runSQLite3PostLoadInit = function(sqlite3InitScriptInfo, EmscriptenModule, sqlite3IsUnderTest) {
    "use strict";
    delete EmscriptenModule.runSQLite3PostLoadInit;
    "use strict";
    globalThis.sqlite3ApiBootstrap = async function sqlite3ApiBootstrap(apiConfig = globalThis.sqlite3ApiConfig || sqlite3ApiBootstrap.defaultConfig) {
      if (sqlite3ApiBootstrap.sqlite3) {
        (sqlite3ApiBootstrap.sqlite3.config || console).warn(
          "sqlite3ApiBootstrap() called multiple times.",
          "Config and external initializers are ignored on calls after the first."
        );
        return sqlite3ApiBootstrap.sqlite3;
      }
      const config = Object.assign(
        /* @__PURE__ */ Object.create(null),
        {
          exports: void 0,
          memory: void 0,
          bigIntEnabled: !!globalThis.BigInt64Array,
          debug: console.debug.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console),
          log: console.log.bind(console),
          wasmfsOpfsDir: "/opfs",
          useStdAlloc: false
        },
        apiConfig || {}
      );
      Object.assign(config, {
        allocExportName: config.useStdAlloc ? "malloc" : "sqlite3_malloc",
        deallocExportName: config.useStdAlloc ? "free" : "sqlite3_free",
        reallocExportName: config.useStdAlloc ? "realloc" : "sqlite3_realloc"
      });
      ["exports", "memory", "functionTable", "wasmfsOpfsDir"].forEach((k) => {
        if ("function" === typeof config[k]) {
          config[k] = config[k]();
        }
      });
      delete globalThis.sqlite3ApiConfig;
      delete sqlite3ApiBootstrap.defaultConfig;
      const capi = /* @__PURE__ */ Object.create(null);
      const wasm = /* @__PURE__ */ Object.create(null);
      const __rcStr = (rc) => {
        return capi.sqlite3_js_rc_str && capi.sqlite3_js_rc_str(rc) || "Unknown result code #" + rc;
      };
      const isInt32 = (n) => "number" === typeof n && n === (n | 0) && n <= 2147483647 && n >= -2147483648;
      class SQLite3Error extends Error {
        constructor(...args) {
          let rc;
          if (args.length) {
            if (isInt32(args[0])) {
              rc = args[0];
              if (1 === args.length) {
                super(__rcStr(args[0]));
              } else {
                const rcStr = __rcStr(rc);
                if ("object" === typeof args[1]) {
                  super(rcStr, args[1]);
                } else {
                  args[0] = rcStr + ":";
                  super(args.join(" "));
                }
              }
            } else {
              if (2 === args.length && "object" === typeof args[1]) {
                super(...args);
              } else {
                super(args.join(" "));
              }
            }
          }
          this.resultCode = rc || capi.SQLITE_ERROR;
          this.name = "SQLite3Error";
        }
      }
      SQLite3Error.toss = (...args) => {
        throw new SQLite3Error(...args);
      };
      const toss3 = SQLite3Error.toss;
      if (config.wasmfsOpfsDir && !/^\\/[^/]+$/.test(config.wasmfsOpfsDir)) {
        toss3("config.wasmfsOpfsDir must be falsy or in the form '/dir-name'.");
      }
      const bigIntFits64 = function f(b) {
        if (!f._max) {
          f._max = BigInt("0x7fffffffffffffff");
          f._min = ~f._max;
        }
        return b >= f._min && b <= f._max;
      };
      const bigIntFits32 = (b) => b >= -0x7fffffffn - 1n && b <= 0x7fffffffn;
      const bigIntFitsDouble = function f(b) {
        if (!f._min) {
          f._min = Number.MIN_SAFE_INTEGER;
          f._max = Number.MAX_SAFE_INTEGER;
        }
        return b >= f._min && b <= f._max;
      };
      const isTypedArray = (v2) => {
        return v2 && v2.constructor && isInt32(v2.constructor.BYTES_PER_ELEMENT) ? v2 : false;
      };
      const isBindableTypedArray = (v2) => v2 && (v2 instanceof Uint8Array || v2 instanceof Int8Array || v2 instanceof ArrayBuffer);
      const isSQLableTypedArray = (v2) => v2 && (v2 instanceof Uint8Array || v2 instanceof Int8Array || v2 instanceof ArrayBuffer);
      const affirmBindableTypedArray = (v2) => isBindableTypedArray(v2) || toss3("Value is not of a supported TypedArray type.");
      const flexibleString = function(v2) {
        if (isSQLableTypedArray(v2)) {
          return wasm.typedArrayToString(
            v2 instanceof ArrayBuffer ? new Uint8Array(v2) : v2,
            0,
            v2.length
          );
        } else if (Array.isArray(v2)) return v2.join("");
        else if (wasm.isPtr(v2)) v2 = wasm.cstrToJs(v2);
        return v2;
      };
      class WasmAllocError extends Error {
        constructor(...args) {
          if (2 === args.length && "object" === typeof args[1]) {
            super(...args);
          } else if (args.length) {
            super(args.join(" "));
          } else {
            super("Allocation failed.");
          }
          this.resultCode = capi.SQLITE_NOMEM;
          this.name = "WasmAllocError";
        }
      }
      WasmAllocError.toss = (...args) => {
        throw new WasmAllocError(...args);
      };
      Object.assign(capi, {
        sqlite3_bind_blob: void 0,
        sqlite3_bind_text: void 0,
        sqlite3_create_function_v2: (pDb2, funcName, nArg, eTextRep, pApp, xFunc, xStep, xFinal, xDestroy) => {
        },
        sqlite3_create_function: (pDb2, funcName, nArg, eTextRep, pApp, xFunc, xStep, xFinal) => {
        },
        sqlite3_create_window_function: (pDb2, funcName, nArg, eTextRep, pApp, xStep, xFinal, xValue, xInverse, xDestroy) => {
        },
        sqlite3_prepare_v3: (dbPtr, sql, sqlByteLen, prepFlags, stmtPtrPtr, strPtrPtr) => {
        },
        sqlite3_prepare_v2: (dbPtr, sql, sqlByteLen, stmtPtrPtr, strPtrPtr) => {
        },
        sqlite3_exec: (pDb2, sql, callback, pVoid, pErrMsg) => {
        },
        sqlite3_randomness: (n, outPtr) => {
        }
      });
      const util = {
        affirmBindableTypedArray,
        flexibleString,
        bigIntFits32,
        bigIntFits64,
        bigIntFitsDouble,
        isBindableTypedArray,
        isInt32,
        isSQLableTypedArray,
        isTypedArray,
        isUIThread: () => globalThis.window === globalThis && !!globalThis.document,
        toss: function(...args) {
          throw new Error(args.join(" "));
        },
        toss3,
        typedArrayPart: wasm.typedArrayPart,
        affirmDbHeader: function(bytes) {
          if (bytes instanceof ArrayBuffer) bytes = new Uint8Array(bytes);
          const header = "SQLite format 3";
          if (header.length > bytes.byteLength) {
            toss3("Input does not contain an SQLite3 database header.");
          }
          for (let i = 0; i < header.length; ++i) {
            if (header.charCodeAt(i) !== bytes[i]) {
              toss3("Input does not contain an SQLite3 database header.");
            }
          }
        },
        affirmIsDb: function(bytes) {
          if (bytes instanceof ArrayBuffer) bytes = new Uint8Array(bytes);
          const n = bytes.byteLength;
          if (n < 512 || n % 512 !== 0) {
            toss3("Byte array size", n, "is invalid for an SQLite3 db.");
          }
          util.affirmDbHeader(bytes);
        }
      };
      Object.assign(wasm, {
        pointerIR: config.wasmPtrIR,
        bigIntEnabled: !!config.bigIntEnabled,
        exports: config.exports || toss3("Missing API config.exports (WASM module exports)."),
        memory: config.memory || config.exports["memory"] || toss3(
          "API config object requires a WebAssembly.Memory object",
          "in either config.exports.memory (exported)",
          "or config.memory (imported)."
        ),
        functionTable: config.functionTable,
        alloc: void 0,
        realloc: void 0,
        dealloc: void 0
      });
      wasm.allocFromTypedArray = function(srcTypedArray) {
        if (srcTypedArray instanceof ArrayBuffer) {
          srcTypedArray = new Uint8Array(srcTypedArray);
        }
        affirmBindableTypedArray(srcTypedArray);
        const pRet = wasm.alloc(srcTypedArray.byteLength || 1);
        wasm.heapForSize(srcTypedArray.constructor).set(srcTypedArray.byteLength ? srcTypedArray : [0], Number(pRet));
        return pRet;
      };
      {
        const keyAlloc = config.allocExportName, keyDealloc = config.deallocExportName, keyRealloc = config.reallocExportName;
        for (const key of [keyAlloc, keyDealloc, keyRealloc]) {
          const f = wasm.exports[key];
          if (!(f instanceof Function))
            toss3("Missing required exports[", key, "] function.");
        }
        wasm.alloc = function f(n) {
          return f.impl(n) || WasmAllocError.toss("Failed to allocate", n, " bytes.");
        };
        wasm.alloc.impl = wasm.exports[keyAlloc];
        wasm.realloc = function f(m, n) {
          const m2 = f.impl(wasm.ptr.coerce(m), n);
          return n ? m2 || WasmAllocError.toss("Failed to reallocate", n, " bytes.") : wasm.ptr.null;
        };
        wasm.realloc.impl = wasm.exports[keyRealloc];
        wasm.dealloc = function f(m) {
          f.impl(wasm.ptr.coerce(m));
        };
        wasm.dealloc.impl = wasm.exports[keyDealloc];
      }
      wasm.compileOptionUsed = function f(optName) {
        if (!arguments.length) {
          if (f._result) return f._result;
          else if (!f._opt) {
            f._rx = /^([^=]+)=(.+)/;
            f._rxInt = /^-?\\d+$/;
            f._opt = function(opt, rv) {
              const m = f._rx.exec(opt);
              rv[0] = m ? m[1] : opt;
              rv[1] = m ? f._rxInt.test(m[2]) ? +m[2] : m[2] : true;
            };
          }
          const rc = /* @__PURE__ */ Object.create(null), ov = [0, 0];
          let i = 0, k;
          while (k = capi.sqlite3_compileoption_get(i++)) {
            f._opt(k, ov);
            rc[ov[0]] = ov[1];
          }
          return f._result = rc;
        } else if (Array.isArray(optName)) {
          const rc = /* @__PURE__ */ Object.create(null);
          optName.forEach((v2) => {
            rc[v2] = capi.sqlite3_compileoption_used(v2);
          });
          return rc;
        } else if ("object" === typeof optName) {
          Object.keys(optName).forEach((k) => {
            optName[k] = capi.sqlite3_compileoption_used(k);
          });
          return optName;
        }
        return "string" === typeof optName ? !!capi.sqlite3_compileoption_used(optName) : false;
      };
      wasm.pstack = Object.assign(/* @__PURE__ */ Object.create(null), {
        restore: wasm.exports.sqlite3__wasm_pstack_restore,
        alloc: function(n) {
          if ("string" === typeof n && !(n = wasm.sizeofIR(n))) {
            WasmAllocError.toss(
              "Invalid value for pstack.alloc(",
              arguments[0],
              ")"
            );
          }
          return wasm.exports.sqlite3__wasm_pstack_alloc(n) || WasmAllocError.toss(
            "Could not allocate",
            n,
            "bytes from the pstack."
          );
        },
        allocChunks: function(n, sz) {
          if ("string" === typeof sz && !(sz = wasm.sizeofIR(sz))) {
            WasmAllocError.toss(
              "Invalid size value for allocChunks(",
              arguments[1],
              ")"
            );
          }
          const mem = wasm.pstack.alloc(n * sz);
          const rc = [mem];
          let i = 1, offset = sz;
          for (; i < n; ++i, offset += sz) rc.push(wasm.ptr.add(mem, offset));
          return rc;
        },
        allocPtr: (n = 1, safePtrSize = true) => {
          return 1 === n ? wasm.pstack.alloc(safePtrSize ? 8 : wasm.ptr.size) : wasm.pstack.allocChunks(n, safePtrSize ? 8 : wasm.ptr.size);
        },
        call: function(f) {
          const stackPos = wasm.pstack.pointer;
          try {
            return f(sqlite32);
          } finally {
            wasm.pstack.restore(stackPos);
          }
        }
      });
      Object.defineProperties(wasm.pstack, {
        pointer: {
          configurable: false,
          iterable: true,
          writeable: false,
          get: wasm.exports.sqlite3__wasm_pstack_ptr
        },
        quota: {
          configurable: false,
          iterable: true,
          writeable: false,
          get: wasm.exports.sqlite3__wasm_pstack_quota
        },
        remaining: {
          configurable: false,
          iterable: true,
          writeable: false,
          get: wasm.exports.sqlite3__wasm_pstack_remaining
        }
      });
      capi.sqlite3_randomness = (...args) => {
        if (1 === args.length && util.isTypedArray(args[0]) && 1 === args[0].BYTES_PER_ELEMENT) {
          const ta = args[0];
          if (0 === ta.byteLength) {
            wasm.exports.sqlite3_randomness(0, wasm.ptr.null);
            return ta;
          }
          const stack = wasm.pstack.pointer;
          try {
            let n = ta.byteLength, offset = 0;
            const r = wasm.exports.sqlite3_randomness;
            const heap = wasm.heap8u();
            const nAlloc = n < 512 ? n : 512;
            const ptr = wasm.pstack.alloc(nAlloc);
            do {
              const j = n > nAlloc ? nAlloc : n;
              r(j, ptr);
              ta.set(
                wasm.typedArrayPart(heap, ptr, wasm.ptr.add(ptr, j)),
                offset
              );
              n -= j;
              offset += j;
            } while (n > 0);
          } catch (e) {
            config.error(
              "Highly unexpected (and ignored!) exception in sqlite3_randomness():",
              e
            );
          } finally {
            wasm.pstack.restore(stack);
          }
          return ta;
        }
        wasm.exports.sqlite3_randomness(...args);
      };
      let __wasmfsOpfsDir = void 0;
      capi.sqlite3_wasmfs_opfs_dir = function() {
        if (void 0 !== __wasmfsOpfsDir) return __wasmfsOpfsDir;
        const pdir = config.wasmfsOpfsDir;
        if (!pdir || !globalThis.FileSystemHandle || !globalThis.FileSystemDirectoryHandle || !globalThis.FileSystemFileHandle || !wasm.exports.sqlite3__wasm_init_wasmfs) {
          return __wasmfsOpfsDir = "";
        }
        try {
          if (pdir && 0 === wasm.xCallWrapped(
            "sqlite3__wasm_init_wasmfs",
            "i32",
            ["string"],
            pdir
          )) {
            return __wasmfsOpfsDir = pdir;
          } else {
            return __wasmfsOpfsDir = "";
          }
        } catch (e) {
          return __wasmfsOpfsDir = "";
        }
      };
      capi.sqlite3_wasmfs_filename_is_persistent = function(name) {
        const p = capi.sqlite3_wasmfs_opfs_dir();
        return p && name ? name.startsWith(p + "/") : false;
      };
      capi.sqlite3_js_db_uses_vfs = function(pDb2, vfsName, dbName = 0) {
        try {
          const pK = capi.sqlite3_vfs_find(vfsName);
          if (!pK) return false;
          else if (!pDb2) {
            return pK === capi.sqlite3_vfs_find(0) ? pK : false;
          } else {
            return pK === capi.sqlite3_js_db_vfs(pDb2, dbName) ? pK : false;
          }
        } catch (e) {
          return false;
        }
      };
      capi.sqlite3_js_vfs_list = function() {
        const rc = [];
        let pVfs = capi.sqlite3_vfs_find(wasm.ptr.coerce(0));
        while (pVfs) {
          const oVfs = new capi.sqlite3_vfs(pVfs);
          rc.push(wasm.cstrToJs(oVfs.$zName));
          pVfs = oVfs.$pNext;
          oVfs.dispose();
        }
        return rc;
      };
      capi.sqlite3_js_db_export = function(pDb2, schema = 0) {
        pDb2 = wasm.xWrap.testConvertArg("sqlite3*", pDb2);
        if (!pDb2) toss3("Invalid sqlite3* argument.");
        if (!wasm.bigIntEnabled) toss3("BigInt support is not enabled.");
        const scope = wasm.scopedAllocPush();
        let pOut;
        try {
          const pSize = wasm.scopedAlloc(8 + wasm.ptr.size);
          const ppOut = wasm.ptr.add(pSize, 8);
          const zSchema = schema ? wasm.isPtr(schema) ? schema : wasm.scopedAllocCString("" + schema) : wasm.ptr.null;
          let rc = wasm.exports.sqlite3__wasm_db_serialize(
            pDb2,
            zSchema,
            ppOut,
            pSize,
            0
          );
          if (rc) {
            toss3(
              "Database serialization failed with code",
              sqlite32.capi.sqlite3_js_rc_str(rc)
            );
          }
          pOut = wasm.peekPtr(ppOut);
          const nOut = wasm.peek(pSize, "i64");
          rc = nOut ? wasm.heap8u().slice(Number(pOut), Number(pOut) + Number(nOut)) : new Uint8Array();
          return rc;
        } finally {
          if (pOut) wasm.exports.sqlite3_free(pOut);
          wasm.scopedAllocPop(scope);
        }
      };
      capi.sqlite3_js_db_vfs = (dbPointer, dbName = 0) => util.sqlite3__wasm_db_vfs(dbPointer, dbName);
      capi.sqlite3_js_aggregate_context = (pCtx, n) => {
        return capi.sqlite3_aggregate_context(pCtx, n) || (n ? WasmAllocError.toss(
          "Cannot allocate",
          n,
          "bytes for sqlite3_aggregate_context()"
        ) : 0);
      };
      capi.sqlite3_js_posix_create_file = function(filename, data, dataLen) {
        let pData;
        if (data && wasm.isPtr(data)) {
          pData = data;
        } else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
          pData = wasm.allocFromTypedArray(data);
          if (arguments.length < 3 || !util.isInt32(dataLen) || dataLen < 0) {
            dataLen = data.byteLength;
          }
        } else {
          SQLite3Error.toss(
            "Invalid 2nd argument for sqlite3_js_posix_create_file()."
          );
        }
        try {
          if (!util.isInt32(dataLen) || dataLen < 0) {
            SQLite3Error.toss(
              "Invalid 3rd argument for sqlite3_js_posix_create_file()."
            );
          }
          const rc = util.sqlite3__wasm_posix_create_file(
            filename,
            pData,
            dataLen
          );
          if (rc)
            SQLite3Error.toss(
              "Creation of file failed with sqlite3 result code",
              capi.sqlite3_js_rc_str(rc)
            );
        } finally {
          if (pData && pData !== data) wasm.dealloc(pData);
        }
      };
      capi.sqlite3_js_vfs_create_file = function(vfs, filename, data, dataLen) {
        config.warn(
          "sqlite3_js_vfs_create_file() is deprecated and",
          "should be avoided because it can lead to C-level crashes.",
          "See its documentation for alternatives."
        );
        let pData;
        if (data) {
          if (wasm.isPtr(data)) {
            pData = data;
          } else {
            if (data instanceof ArrayBuffer) {
              data = new Uint8Array(data);
            }
            if (data instanceof Uint8Array) {
              pData = wasm.allocFromTypedArray(data);
              if (arguments.length < 4 || !util.isInt32(dataLen) || dataLen < 0) {
                dataLen = data.byteLength;
              }
            } else {
              SQLite3Error.toss(
                "Invalid 3rd argument type for sqlite3_js_vfs_create_file()."
              );
            }
          }
        } else {
          pData = 0;
        }
        if (!util.isInt32(dataLen) || dataLen < 0) {
          if (pData && pData !== data) wasm.dealloc(pData);
          SQLite3Error.toss(
            "Invalid 4th argument for sqlite3_js_vfs_create_file()."
          );
        }
        try {
          const rc = util.sqlite3__wasm_vfs_create_file(
            vfs,
            filename,
            pData,
            dataLen
          );
          if (rc)
            SQLite3Error.toss(
              "Creation of file failed with sqlite3 result code",
              capi.sqlite3_js_rc_str(rc)
            );
        } finally {
          if (pData && pData !== data) wasm.dealloc(pData);
        }
      };
      capi.sqlite3_js_sql_to_string = (sql) => {
        if ("string" === typeof sql) {
          return sql;
        }
        const x = flexibleString(v);
        return x === v ? void 0 : x;
      };
      if (util.isUIThread()) {
        const __kvvfsInfo = function(which) {
          const rc = /* @__PURE__ */ Object.create(null);
          rc.prefix = "kvvfs-" + which;
          rc.stores = [];
          if ("session" === which || "" === which)
            rc.stores.push(globalThis.sessionStorage);
          if ("local" === which || "" === which)
            rc.stores.push(globalThis.localStorage);
          return rc;
        };
        capi.sqlite3_js_kvvfs_clear = function(which = "") {
          let rc = 0;
          const kvinfo = __kvvfsInfo(which);
          kvinfo.stores.forEach((s) => {
            const toRm = [];
            let i;
            for (i = 0; i < s.length; ++i) {
              const k = s.key(i);
              if (k.startsWith(kvinfo.prefix)) toRm.push(k);
            }
            toRm.forEach((kk) => s.removeItem(kk));
            rc += toRm.length;
          });
          return rc;
        };
        capi.sqlite3_js_kvvfs_size = function(which = "") {
          let sz = 0;
          const kvinfo = __kvvfsInfo(which);
          kvinfo.stores.forEach((s) => {
            let i;
            for (i = 0; i < s.length; ++i) {
              const k = s.key(i);
              if (k.startsWith(kvinfo.prefix)) {
                sz += k.length;
                sz += s.getItem(k).length;
              }
            }
          });
          return sz * 2;
        };
      }
      capi.sqlite3_db_config = function(pDb2, op, ...args) {
        switch (op) {
          case capi.SQLITE_DBCONFIG_ENABLE_FKEY:
          case capi.SQLITE_DBCONFIG_ENABLE_TRIGGER:
          case capi.SQLITE_DBCONFIG_ENABLE_FTS3_TOKENIZER:
          case capi.SQLITE_DBCONFIG_ENABLE_LOAD_EXTENSION:
          case capi.SQLITE_DBCONFIG_NO_CKPT_ON_CLOSE:
          case capi.SQLITE_DBCONFIG_ENABLE_QPSG:
          case capi.SQLITE_DBCONFIG_TRIGGER_EQP:
          case capi.SQLITE_DBCONFIG_RESET_DATABASE:
          case capi.SQLITE_DBCONFIG_DEFENSIVE:
          case capi.SQLITE_DBCONFIG_WRITABLE_SCHEMA:
          case capi.SQLITE_DBCONFIG_LEGACY_ALTER_TABLE:
          case capi.SQLITE_DBCONFIG_DQS_DML:
          case capi.SQLITE_DBCONFIG_DQS_DDL:
          case capi.SQLITE_DBCONFIG_ENABLE_VIEW:
          case capi.SQLITE_DBCONFIG_LEGACY_FILE_FORMAT:
          case capi.SQLITE_DBCONFIG_TRUSTED_SCHEMA:
          case capi.SQLITE_DBCONFIG_STMT_SCANSTATUS:
          case capi.SQLITE_DBCONFIG_REVERSE_SCANORDER:
          case capi.SQLITE_DBCONFIG_ENABLE_ATTACH_CREATE:
          case capi.SQLITE_DBCONFIG_ENABLE_ATTACH_WRITE:
          case capi.SQLITE_DBCONFIG_ENABLE_COMMENTS:
            if (!this.ip) {
              this.ip = wasm.xWrap("sqlite3__wasm_db_config_ip", "int", [
                "sqlite3*",
                "int",
                "int",
                "*"
              ]);
            }
            return this.ip(pDb2, op, args[0], args[1] || 0);
          case capi.SQLITE_DBCONFIG_LOOKASIDE:
            if (!this.pii) {
              this.pii = wasm.xWrap("sqlite3__wasm_db_config_pii", "int", [
                "sqlite3*",
                "int",
                "*",
                "int",
                "int"
              ]);
            }
            return this.pii(pDb2, op, args[0], args[1], args[2]);
          case capi.SQLITE_DBCONFIG_MAINDBNAME:
            if (!this.s) {
              this.s = wasm.xWrap("sqlite3__wasm_db_config_s", "int", [
                "sqlite3*",
                "int",
                "string:static"
              ]);
            }
            return this.s(pDb2, op, args[0]);
          default:
            return capi.SQLITE_MISUSE;
        }
      }.bind(/* @__PURE__ */ Object.create(null));
      capi.sqlite3_value_to_js = function(pVal, throwIfCannotConvert = true) {
        let arg;
        const valType = capi.sqlite3_value_type(pVal);
        switch (valType) {
          case capi.SQLITE_INTEGER:
            if (wasm.bigIntEnabled) {
              arg = capi.sqlite3_value_int64(pVal);
              if (util.bigIntFitsDouble(arg)) arg = Number(arg);
            } else arg = capi.sqlite3_value_double(pVal);
            break;
          case capi.SQLITE_FLOAT:
            arg = capi.sqlite3_value_double(pVal);
            break;
          case capi.SQLITE_TEXT:
            arg = capi.sqlite3_value_text(pVal);
            break;
          case capi.SQLITE_BLOB: {
            const n = capi.sqlite3_value_bytes(pVal);
            const pBlob = capi.sqlite3_value_blob(pVal);
            if (n && !pBlob)
              sqlite32.WasmAllocError.toss(
                "Cannot allocate memory for blob argument of",
                n,
                "byte(s)"
              );
            arg = n ? wasm.heap8u().slice(Number(pBlob), Number(pBlob) + Number(n)) : null;
            break;
          }
          case capi.SQLITE_NULL:
            arg = null;
            break;
          default:
            if (throwIfCannotConvert) {
              toss3(
                capi.SQLITE_MISMATCH,
                "Unhandled sqlite3_value_type():",
                valType
              );
            }
            arg = void 0;
        }
        return arg;
      };
      capi.sqlite3_values_to_js = function(argc, pArgv, throwIfCannotConvert = true) {
        let i;
        const tgt = [];
        for (i = 0; i < argc; ++i) {
          tgt.push(
            capi.sqlite3_value_to_js(
              wasm.peekPtr(wasm.ptr.add(pArgv, wasm.ptr.size * i)),
              throwIfCannotConvert
            )
          );
        }
        return tgt;
      };
      capi.sqlite3_result_error_js = function(pCtx, e) {
        if (e instanceof WasmAllocError) {
          capi.sqlite3_result_error_nomem(pCtx);
        } else {
          capi.sqlite3_result_error(pCtx, "" + e, -1);
        }
      };
      capi.sqlite3_result_js = function(pCtx, val) {
        if (val instanceof Error) {
          capi.sqlite3_result_error_js(pCtx, val);
          return;
        }
        try {
          switch (typeof val) {
            case "undefined":
              break;
            case "boolean":
              capi.sqlite3_result_int(pCtx, val ? 1 : 0);
              break;
            case "bigint":
              if (util.bigIntFits32(val)) {
                capi.sqlite3_result_int(pCtx, Number(val));
              } else if (util.bigIntFitsDouble(val)) {
                capi.sqlite3_result_double(pCtx, Number(val));
              } else if (wasm.bigIntEnabled) {
                if (util.bigIntFits64(val))
                  capi.sqlite3_result_int64(pCtx, val);
                else
                  toss3(
                    "BigInt value",
                    val.toString(),
                    "is too BigInt for int64."
                  );
              } else {
                toss3("BigInt value", val.toString(), "is too BigInt.");
              }
              break;
            case "number": {
              let f;
              if (util.isInt32(val)) {
                f = capi.sqlite3_result_int;
              } else if (wasm.bigIntEnabled && Number.isInteger(val) && util.bigIntFits64(BigInt(val))) {
                f = capi.sqlite3_result_int64;
              } else {
                f = capi.sqlite3_result_double;
              }
              f(pCtx, val);
              break;
            }
            case "string": {
              const [p, n] = wasm.allocCString(val, true);
              capi.sqlite3_result_text(pCtx, p, n, capi.SQLITE_WASM_DEALLOC);
              break;
            }
            case "object":
              if (null === val) {
                capi.sqlite3_result_null(pCtx);
                break;
              } else if (util.isBindableTypedArray(val)) {
                const pBlob = wasm.allocFromTypedArray(val);
                capi.sqlite3_result_blob(
                  pCtx,
                  pBlob,
                  val.byteLength,
                  capi.SQLITE_WASM_DEALLOC
                );
                break;
              }
            default:
              toss3(
                "Don't not how to handle this UDF result value:",
                typeof val,
                val
              );
          }
        } catch (e) {
          capi.sqlite3_result_error_js(pCtx, e);
        }
      };
      capi.sqlite3_column_js = function(pStmt, iCol, throwIfCannotConvert = true) {
        const v2 = capi.sqlite3_column_value(pStmt, iCol);
        return 0 === v2 ? void 0 : capi.sqlite3_value_to_js(v2, throwIfCannotConvert);
      };
      const __newOldValue = function(pObj, iCol, impl) {
        impl = capi[impl];
        if (!this.ptr) this.ptr = wasm.allocPtr();
        else wasm.pokePtr(this.ptr, 0);
        const rc = impl(pObj, iCol, this.ptr);
        if (rc)
          return SQLite3Error.toss(
            rc,
            arguments[2] + "() failed with code " + rc
          );
        const pv = wasm.peekPtr(this.ptr);
        return pv ? capi.sqlite3_value_to_js(pv, true) : void 0;
      }.bind(/* @__PURE__ */ Object.create(null));
      capi.sqlite3_preupdate_new_js = (pDb2, iCol) => __newOldValue(pDb2, iCol, "sqlite3_preupdate_new");
      capi.sqlite3_preupdate_old_js = (pDb2, iCol) => __newOldValue(pDb2, iCol, "sqlite3_preupdate_old");
      capi.sqlite3changeset_new_js = (pChangesetIter, iCol) => __newOldValue(pChangesetIter, iCol, "sqlite3changeset_new");
      capi.sqlite3changeset_old_js = (pChangesetIter, iCol) => __newOldValue(pChangesetIter, iCol, "sqlite3changeset_old");
      const sqlite32 = {
        WasmAllocError,
        SQLite3Error,
        capi,
        util,
        wasm,
        config,
        version: /* @__PURE__ */ Object.create(null),
        client: void 0,
        asyncPostInit: async function ff() {
          if (ff.isReady instanceof Promise) return ff.isReady;
          let lia = sqlite3ApiBootstrap.initializersAsync;
          delete sqlite3ApiBootstrap.initializersAsync;
          const postInit = async () => {
            if (!sqlite32.__isUnderTest) {
              delete sqlite32.util;
              delete sqlite32.StructBinder;
            }
            return sqlite32;
          };
          const catcher = (e) => {
            config.error("an async sqlite3 initializer failed:", e);
            throw e;
          };
          if (!lia || !lia.length) {
            return ff.isReady = postInit().catch(catcher);
          }
          lia = lia.map((f) => {
            return f instanceof Function ? async (x) => f(sqlite32) : f;
          });
          lia.push(postInit);
          let p = Promise.resolve(sqlite32);
          while (lia.length) p = p.then(lia.shift());
          return ff.isReady = p.catch(catcher);
        },
        scriptInfo: void 0
      };
      try {
        sqlite3ApiBootstrap.initializers.forEach((f) => {
          f(sqlite32);
        });
      } catch (e) {
        console.error("sqlite3 bootstrap initializer threw:", e);
        throw e;
      }
      delete sqlite3ApiBootstrap.initializers;
      sqlite3ApiBootstrap.sqlite3 = sqlite32;
      delete globalThis.sqlite3ApiBootstrap;
      delete globalThis.sqlite3ApiConfig;
      sqlite3InitScriptInfo.debugModule(
        "sqlite3ApiBootstrap() complete",
        sqlite32
      );
      sqlite32.scriptInfo = sqlite3InitScriptInfo;
      if (sqlite32.__isUnderTest = sqlite3IsUnderTest) {
        sqlite32.config.emscripten = EmscriptenModule;
        const iw = sqlite3InitScriptInfo.instantiateWasm;
        if (iw) {
          sqlite32.wasm.module = iw.module;
          sqlite32.wasm.instance = iw.instance;
          sqlite32.wasm.imports = iw.imports;
        }
      }
      return sqlite32.asyncPostInit().then((s) => {
        sqlite3InitScriptInfo.debugModule(
          "sqlite3.asyncPostInit() complete",
          sqlite32
        );
        delete s.asyncPostInit;
        delete s.scriptInfo;
        delete s.emscripten;
        return s;
      });
    };
    globalThis.sqlite3ApiBootstrap.initializers = [];
    globalThis.sqlite3ApiBootstrap.initializersAsync = [];
    globalThis.sqlite3ApiBootstrap.defaultConfig = /* @__PURE__ */ Object.create(null);
    globalThis.sqlite3ApiBootstrap.sqlite3 = void 0;
    globalThis.WhWasmUtilInstaller = function(target) {
      "use strict";
      if (void 0 === target.bigIntEnabled) {
        target.bigIntEnabled = !!globalThis["BigInt64Array"];
      }
      const toss = (...args) => {
        throw new Error(args.join(" "));
      };
      if (target.pointerSize && !target.pointerIR) {
        target.pointerIR = 4 === target.pointerSize ? "i32" : "i64";
      }
      const __ptrIR = target.pointerIR ??= "i32";
      const __ptrSize = target.pointerSize ??= "i32" === __ptrIR ? 4 : "i64" === __ptrIR ? 8 : 0;
      delete target.pointerSize;
      delete target.pointerIR;
      if ("i32" !== __ptrIR && "i64" !== __ptrIR) {
        toss("Invalid pointerIR:", __ptrIR);
      } else if (8 !== __ptrSize && 4 !== __ptrSize) {
        toss("Invalid pointerSize:", __ptrSize);
      }
      const __BigInt = target.bigIntEnabled ? (v2) => BigInt(v2 || 0) : (v2) => toss("BigInt support is disabled in this build.");
      const __Number = (v2) => Number(v2 || 0);
      const __asPtrType = 4 === __ptrSize ? __Number : __BigInt;
      const __NullPtr = __asPtrType(0);
      const __ptrAdd = function(...args) {
        let rc = __asPtrType(0);
        for (const v2 of args) rc += __asPtrType(v2);
        return rc;
      };
      {
        const __ptr = /* @__PURE__ */ Object.create(null);
        Object.defineProperty(target, "ptr", {
          enumerable: true,
          get: () => __ptr,
          set: () => toss("The ptr property is read-only.")
        });
        (function f(name, val) {
          Object.defineProperty(__ptr, name, {
            enumerable: true,
            get: () => val,
            set: () => toss("ptr[" + name + "] is read-only.")
          });
          return f;
        })("null", __NullPtr)("size", __ptrSize)("ir", __ptrIR)(
          "coerce",
          __asPtrType
        )("add", __ptrAdd)(
          "addn",
          4 === __ptrIR ? __ptrAdd : (...args) => Number(__ptrAdd(...args))
        );
      }
      if (!target.exports) {
        Object.defineProperty(target, "exports", {
          enumerable: true,
          configurable: true,
          get: () => target.instance?.exports
        });
      }
      const cache = /* @__PURE__ */ Object.create(null);
      cache.heapSize = 0;
      cache.memory = null;
      cache.freeFuncIndexes = [];
      cache.scopedAlloc = [];
      cache.scopedAlloc.pushPtr = (ptr) => {
        cache.scopedAlloc[cache.scopedAlloc.length - 1].push(ptr);
        return ptr;
      };
      cache.utf8Decoder = new TextDecoder();
      cache.utf8Encoder = new TextEncoder("utf-8");
      target.sizeofIR = (n) => {
        switch (n) {
          case "i8":
            return 1;
          case "i16":
            return 2;
          case "i32":
          case "f32":
          case "float":
            return 4;
          case "i64":
          case "f64":
          case "double":
            return 8;
          case "*":
            return __ptrSize;
          default:
            return ("" + n).endsWith("*") ? __ptrSize : void 0;
        }
      };
      const heapWrappers = function() {
        if (!cache.memory) {
          cache.memory = target.memory instanceof WebAssembly.Memory ? target.memory : target.exports.memory;
        } else if (cache.heapSize === cache.memory.buffer.byteLength) {
          return cache;
        }
        const b = cache.memory.buffer;
        cache.HEAP8 = new Int8Array(b);
        cache.HEAP8U = new Uint8Array(b);
        cache.HEAP16 = new Int16Array(b);
        cache.HEAP16U = new Uint16Array(b);
        cache.HEAP32 = new Int32Array(b);
        cache.HEAP32U = new Uint32Array(b);
        cache.HEAP32F = new Float32Array(b);
        cache.HEAP64F = new Float64Array(b);
        if (target.bigIntEnabled) {
          if ("undefined" !== typeof BigInt64Array) {
            cache.HEAP64 = new BigInt64Array(b);
            cache.HEAP64U = new BigUint64Array(b);
          } else {
            toss(
              "BigInt support is enabled, but the BigInt64Array type is missing."
            );
          }
        }
        cache.heapSize = b.byteLength;
        return cache;
      };
      target.heap8 = () => heapWrappers().HEAP8;
      target.heap8u = () => heapWrappers().HEAP8U;
      target.heap16 = () => heapWrappers().HEAP16;
      target.heap16u = () => heapWrappers().HEAP16U;
      target.heap32 = () => heapWrappers().HEAP32;
      target.heap32u = () => heapWrappers().HEAP32U;
      target.heapForSize = function(n, unsigned = true) {
        let ctor;
        const c = cache.memory && cache.heapSize === cache.memory.buffer.byteLength ? cache : heapWrappers();
        switch (n) {
          case Int8Array:
            return c.HEAP8;
          case Uint8Array:
            return c.HEAP8U;
          case Int16Array:
            return c.HEAP16;
          case Uint16Array:
            return c.HEAP16U;
          case Int32Array:
            return c.HEAP32;
          case Uint32Array:
            return c.HEAP32U;
          case 8:
            return unsigned ? c.HEAP8U : c.HEAP8;
          case 16:
            return unsigned ? c.HEAP16U : c.HEAP16;
          case 32:
            return unsigned ? c.HEAP32U : c.HEAP32;
          case 64:
            if (c.HEAP64) return unsigned ? c.HEAP64U : c.HEAP64;
            break;
          default:
            if (target.bigIntEnabled) {
              if (n === globalThis["BigUint64Array"]) return c.HEAP64U;
              else if (n === globalThis["BigInt64Array"]) return c.HEAP64;
              break;
            }
        }
        toss(
          "Invalid heapForSize() size: expecting 8, 16, 32,",
          "or (if BigInt is enabled) 64."
        );
      };
      const __funcTable = target.functionTable;
      delete target.functionTable;
      target.functionTable = __funcTable ? () => __funcTable : () => target.exports.__indirect_function_table;
      target.functionEntry = function(fptr) {
        const ft = target.functionTable();
        return fptr < ft.length ? ft.get(__asPtrType(fptr)) : void 0;
      };
      target.jsFuncToWasm = function f(func, sig) {
        if (!f._) {
          f._ = {
            sigTypes: Object.assign(/* @__PURE__ */ Object.create(null), {
              i: "i32",
              p: __ptrIR,
              P: __ptrIR,
              s: __ptrIR,
              j: "i64",
              f: "f32",
              d: "f64"
            }),
            typeCodes: Object.assign(/* @__PURE__ */ Object.create(null), {
              f64: 124,
              f32: 125,
              i64: 126,
              i32: 127
            }),
            uleb128Encode: (tgt, method, n) => {
              if (n < 128) tgt[method](n);
              else tgt[method](n % 128 | 128, n >> 7);
            },
            rxJSig: /^(\\w)\\((\\w*)\\)$/,
            sigParams: (sig2) => {
              const m = f._.rxJSig.exec(sig2);
              return m ? m[2] : sig2.substr(1);
            },
            letterType: (x) => f._.sigTypes[x] || toss("Invalid signature letter:", x),
            pushSigType: (dest, letter) => dest.push(f._.typeCodes[f._.letterType(letter)])
          };
        }
        if ("string" === typeof func) {
          const x = sig;
          sig = func;
          func = x;
        }
        const _ = f._;
        const sigParams = _.sigParams(sig);
        const wasmCode = [1, 96];
        _.uleb128Encode(wasmCode, "push", sigParams.length);
        for (const x of sigParams) _.pushSigType(wasmCode, x);
        if ("v" === sig[0]) wasmCode.push(0);
        else {
          wasmCode.push(1);
          _.pushSigType(wasmCode, sig[0]);
        }
        _.uleb128Encode(wasmCode, "unshift", wasmCode.length);
        wasmCode.unshift(0, 97, 115, 109, 1, 0, 0, 0, 1);
        wasmCode.push(
          2,
          7,
          1,
          1,
          101,
          1,
          102,
          0,
          0,
          7,
          5,
          1,
          1,
          102,
          0,
          0
        );
        return new WebAssembly.Instance(
          new WebAssembly.Module(new Uint8Array(wasmCode)),
          {
            e: { f: func }
          }
        ).exports["f"];
      };
      const __installFunction = function f(func, sig, scoped) {
        if (scoped && !cache.scopedAlloc.length) {
          toss("No scopedAllocPush() scope is active.");
        }
        if ("string" === typeof func) {
          const x = sig;
          sig = func;
          func = x;
        }
        if ("string" !== typeof sig || !(func instanceof Function)) {
          toss(
            "Invalid arguments: expecting (function,signature) or (signature,function)."
          );
        }
        const ft = target.functionTable();
        const oldLen = __asPtrType(ft.length);
        let ptr;
        while (cache.freeFuncIndexes.length) {
          ptr = cache.freeFuncIndexes.pop();
          if (ft.get(ptr)) {
            ptr = null;
            continue;
          } else {
            break;
          }
        }
        if (!ptr) {
          ptr = __asPtrType(oldLen);
          ft.grow(__asPtrType(1));
        }
        try {
          ft.set(ptr, func);
          if (scoped) {
            cache.scopedAlloc.pushPtr(ptr);
          }
          return ptr;
        } catch (e) {
          if (!(e instanceof TypeError)) {
            if (ptr === oldLen) cache.freeFuncIndexes.push(oldLen);
            throw e;
          }
        }
        try {
          const fptr = target.jsFuncToWasm(func, sig);
          ft.set(ptr, fptr);
          if (scoped) {
            cache.scopedAlloc.pushPtr(ptr);
          }
        } catch (e) {
          if (ptr === oldLen) cache.freeFuncIndexes.push(oldLen);
          throw e;
        }
        return ptr;
      };
      target.installFunction = (func, sig) => __installFunction(func, sig, false);
      target.scopedInstallFunction = (func, sig) => __installFunction(func, sig, true);
      target.uninstallFunction = function(ptr) {
        if (!ptr && 0 !== ptr) return void 0;
        const fi = cache.freeFuncIndexes;
        const ft = target.functionTable();
        fi.push(ptr);
        const rc = ft.get(ptr);
        ft.set(ptr, null);
        return rc;
      };
      target.peek = function f(ptr, type = "i8") {
        if (type.endsWith("*")) type = __ptrIR;
        const c = cache.memory && cache.heapSize === cache.memory.buffer.byteLength ? cache : heapWrappers();
        const list = Array.isArray(ptr) ? [] : void 0;
        let rc;
        do {
          if (list) ptr = arguments[0].shift();
          switch (type) {
            case "i1":
            case "i8":
              rc = c.HEAP8[Number(ptr) >> 0];
              break;
            case "i16":
              rc = c.HEAP16[Number(ptr) >> 1];
              break;
            case "i32":
              rc = c.HEAP32[Number(ptr) >> 2];
              break;
            case "float":
            case "f32":
              rc = c.HEAP32F[Number(ptr) >> 2];
              break;
            case "double":
            case "f64":
              rc = Number(c.HEAP64F[Number(ptr) >> 3]);
              break;
            case "i64":
              if (c.HEAP64) {
                rc = __BigInt(c.HEAP64[Number(ptr) >> 3]);
                break;
              }
            default:
              toss("Invalid type for peek():", type);
          }
          if (list) list.push(rc);
        } while (list && arguments[0].length);
        return list || rc;
      };
      target.poke = function(ptr, value, type = "i8") {
        if (type.endsWith("*")) type = __ptrIR;
        const c = cache.memory && cache.heapSize === cache.memory.buffer.byteLength ? cache : heapWrappers();
        for (const p of Array.isArray(ptr) ? ptr : [ptr]) {
          switch (type) {
            case "i1":
            case "i8":
              c.HEAP8[Number(p) >> 0] = value;
              continue;
            case "i16":
              c.HEAP16[Number(p) >> 1] = value;
              continue;
            case "i32":
              c.HEAP32[Number(p) >> 2] = value;
              continue;
            case "float":
            case "f32":
              c.HEAP32F[Number(p) >> 2] = value;
              continue;
            case "double":
            case "f64":
              c.HEAP64F[Number(p) >> 3] = value;
              continue;
            case "i64":
              if (c.HEAP64) {
                c.HEAP64[Number(p) >> 3] = __BigInt(value);
                continue;
              }
            default:
              toss("Invalid type for poke(): " + type);
          }
        }
        return this;
      };
      target.peekPtr = (...ptr) => target.peek(1 === ptr.length ? ptr[0] : ptr, __ptrIR);
      target.pokePtr = (ptr, value = 0) => target.poke(ptr, value, __ptrIR);
      target.peek8 = (...ptr) => target.peek(1 === ptr.length ? ptr[0] : ptr, "i8");
      target.poke8 = (ptr, value) => target.poke(ptr, value, "i8");
      target.peek16 = (...ptr) => target.peek(1 === ptr.length ? ptr[0] : ptr, "i16");
      target.poke16 = (ptr, value) => target.poke(ptr, value, "i16");
      target.peek32 = (...ptr) => target.peek(1 === ptr.length ? ptr[0] : ptr, "i32");
      target.poke32 = (ptr, value) => target.poke(ptr, value, "i32");
      target.peek64 = (...ptr) => target.peek(1 === ptr.length ? ptr[0] : ptr, "i64");
      target.poke64 = (ptr, value) => target.poke(ptr, value, "i64");
      target.peek32f = (...ptr) => target.peek(1 === ptr.length ? ptr[0] : ptr, "f32");
      target.poke32f = (ptr, value) => target.poke(ptr, value, "f32");
      target.peek64f = (...ptr) => target.peek(1 === ptr.length ? ptr[0] : ptr, "f64");
      target.poke64f = (ptr, value) => target.poke(ptr, value, "f64");
      target.getMemValue = target.peek;
      target.getPtrValue = target.peekPtr;
      target.setMemValue = target.poke;
      target.setPtrValue = target.pokePtr;
      target.isPtr32 = (ptr) => "number" === typeof ptr && ptr >= 0 && ptr === (ptr | 0);
      target.isPtr64 = (ptr) => "bigint" === typeof ptr ? ptr >= 0 : target.isPtr32(ptr);
      target.isPtr = 4 === __ptrSize ? target.isPtr32 : target.isPtr64;
      target.cstrlen = function(ptr) {
        if (!ptr || !target.isPtr(ptr)) return null;
        ptr = Number(ptr);
        const h = heapWrappers().HEAP8U;
        let pos = ptr;
        for (; h[pos] !== 0; ++pos) {
        }
        return Number(pos - ptr);
      };
      const __SAB = "undefined" === typeof SharedArrayBuffer ? function() {
      } : SharedArrayBuffer;
      const isSharedTypedArray = (aTypedArray) => aTypedArray.buffer instanceof __SAB;
      target.isSharedTypedArray = isSharedTypedArray;
      const typedArrayPart = (aTypedArray, begin, end) => {
        if (8 === __ptrSize) {
          if ("bigint" === typeof begin) begin = Number(begin);
          if ("bigint" === typeof end) end = Number(end);
        }
        return isSharedTypedArray(aTypedArray) ? aTypedArray.slice(begin, end) : aTypedArray.subarray(begin, end);
      };
      target.typedArrayPart = typedArrayPart;
      const typedArrayToString = (typedArray, begin, end) => cache.utf8Decoder.decode(typedArrayPart(typedArray, begin, end));
      target.typedArrayToString = typedArrayToString;
      target.cstrToJs = function(ptr) {
        const n = target.cstrlen(ptr);
        return n ? typedArrayToString(
          heapWrappers().HEAP8U,
          Number(ptr),
          Number(ptr) + n
        ) : null === n ? n : "";
      };
      target.jstrlen = function(str) {
        if ("string" !== typeof str) return null;
        const n = str.length;
        let len = 0;
        for (let i = 0; i < n; ++i) {
          let u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
          }
          if (u <= 127) ++len;
          else if (u <= 2047) len += 2;
          else if (u <= 65535) len += 3;
          else len += 4;
        }
        return len;
      };
      target.jstrcpy = function(jstr, tgt, offset = 0, maxBytes = -1, addNul = true) {
        if (!tgt || !(tgt instanceof Int8Array) && !(tgt instanceof Uint8Array)) {
          toss("jstrcpy() target must be an Int8Array or Uint8Array.");
        }
        maxBytes = Number(maxBytes);
        offset = Number(offset);
        if (maxBytes < 0) maxBytes = tgt.length - offset;
        if (!(maxBytes > 0) || !(offset >= 0)) return 0;
        let i = 0, max = jstr.length;
        const begin = offset, end = offset + maxBytes - (addNul ? 1 : 0);
        for (; i < max && offset < end; ++i) {
          let u = jstr.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            u = 65536 + ((u & 1023) << 10) | jstr.charCodeAt(++i) & 1023;
          }
          if (u <= 127) {
            if (offset >= end) break;
            tgt[offset++] = u;
          } else if (u <= 2047) {
            if (offset + 1 >= end) break;
            tgt[offset++] = 192 | u >> 6;
            tgt[offset++] = 128 | u & 63;
          } else if (u <= 65535) {
            if (offset + 2 >= end) break;
            tgt[offset++] = 224 | u >> 12;
            tgt[offset++] = 128 | u >> 6 & 63;
            tgt[offset++] = 128 | u & 63;
          } else {
            if (offset + 3 >= end) break;
            tgt[offset++] = 240 | u >> 18;
            tgt[offset++] = 128 | u >> 12 & 63;
            tgt[offset++] = 128 | u >> 6 & 63;
            tgt[offset++] = 128 | u & 63;
          }
        }
        if (addNul) tgt[offset++] = 0;
        return offset - begin;
      };
      target.cstrncpy = function(tgtPtr, srcPtr, n) {
        if (!tgtPtr || !srcPtr)
          toss("cstrncpy() does not accept NULL strings.");
        if (n < 0) n = target.cstrlen(strPtr) + 1;
        else if (!(n > 0)) return 0;
        const heap = target.heap8u();
        let i = 0, ch;
        const tgtNumber = Number(tgtPtr), srcNumber = Number(srcPtr);
        for (; i < n && (ch = heap[srcNumber + i]); ++i) {
          heap[tgtNumber + i] = ch;
        }
        if (i < n) heap[tgtNumber + i++] = 0;
        return i;
      };
      target.jstrToUintArray = (str, addNul = false) => {
        return cache.utf8Encoder.encode(addNul ? str + "\\0" : str);
      };
      const __affirmAlloc = (obj, funcName) => {
        if (!(obj.alloc instanceof Function) || !(obj.dealloc instanceof Function)) {
          toss(
            "Object is missing alloc() and/or dealloc() function(s)",
            "required by",
            funcName + "()."
          );
        }
      };
      const __allocCStr = function(jstr, returnWithLength, allocator, funcName) {
        __affirmAlloc(target, funcName);
        if ("string" !== typeof jstr) return null;
        const u = cache.utf8Encoder.encode(jstr), ptr = allocator(u.length + 1);
        let toFree = ptr;
        try {
          const heap = heapWrappers().HEAP8U;
          heap.set(u, Number(ptr));
          heap[__ptrAdd(ptr, u.length)] = 0;
          toFree = __NullPtr;
          return returnWithLength ? [ptr, u.length] : ptr;
        } finally {
          if (toFree) target.dealloc(toFree);
        }
      };
      target.allocCString = (jstr, returnWithLength = false) => __allocCStr(jstr, returnWithLength, target.alloc, "allocCString()");
      target.scopedAllocPush = function() {
        __affirmAlloc(target, "scopedAllocPush");
        const a = [];
        cache.scopedAlloc.push(a);
        return a;
      };
      target.scopedAllocPop = function(state) {
        __affirmAlloc(target, "scopedAllocPop");
        const n = arguments.length ? cache.scopedAlloc.indexOf(state) : cache.scopedAlloc.length - 1;
        if (n < 0) toss("Invalid state object for scopedAllocPop().");
        if (0 === arguments.length) state = cache.scopedAlloc[n];
        cache.scopedAlloc.splice(n, 1);
        for (let p; p = state.pop(); ) {
          if (target.functionEntry(p)) {
            target.uninstallFunction(p);
          } else {
            target.dealloc(p);
          }
        }
      };
      target.scopedAlloc = function(n) {
        if (!cache.scopedAlloc.length) {
          toss("No scopedAllocPush() scope is active.");
        }
        const p = __asPtrType(target.alloc(n));
        return cache.scopedAlloc.pushPtr(p);
      };
      Object.defineProperty(target.scopedAlloc, "level", {
        configurable: false,
        enumerable: false,
        get: () => cache.scopedAlloc.length,
        set: () => toss("The 'active' property is read-only.")
      });
      target.scopedAllocCString = (jstr, returnWithLength = false) => __allocCStr(
        jstr,
        returnWithLength,
        target.scopedAlloc,
        "scopedAllocCString()"
      );
      const __allocMainArgv = function(isScoped, list) {
        const pList = target[isScoped ? "scopedAlloc" : "alloc"](
          (list.length + 1) * target.ptr.size
        );
        let i = 0;
        list.forEach((e) => {
          target.pokePtr(
            __ptrAdd(pList, target.ptr.size * i++),
            target[isScoped ? "scopedAllocCString" : "allocCString"]("" + e)
          );
        });
        target.pokePtr(__ptrAdd(pList, target.ptr.size * i), 0);
        return pList;
      };
      target.scopedAllocMainArgv = (list) => __allocMainArgv(true, list);
      target.allocMainArgv = (list) => __allocMainArgv(false, list);
      target.cArgvToJs = (argc, pArgv) => {
        const list = [];
        for (let i = 0; i < argc; ++i) {
          const arg = target.peekPtr(__ptrAdd(pArgv, target.ptr.size * i));
          list.push(arg ? target.cstrToJs(arg) : null);
        }
        return list;
      };
      target.scopedAllocCall = function(func) {
        target.scopedAllocPush();
        try {
          return func();
        } finally {
          target.scopedAllocPop();
        }
      };
      const __allocPtr = function(howMany, safePtrSize, method) {
        __affirmAlloc(target, method);
        const pIr = safePtrSize ? "i64" : __ptrIR;
        let m = target[method](howMany * (safePtrSize ? 8 : __ptrSize));
        target.poke(m, 0, pIr);
        if (1 === howMany) {
          return m;
        }
        const a = [m];
        for (let i = 1; i < howMany; ++i) {
          m = __ptrAdd(m, safePtrSize ? 8 : __ptrSize);
          a[i] = m;
          target.poke(m, 0, pIr);
        }
        return a;
      };
      target.allocPtr = (howMany = 1, safePtrSize = true) => __allocPtr(howMany, safePtrSize, "alloc");
      target.scopedAllocPtr = (howMany = 1, safePtrSize = true) => __allocPtr(howMany, safePtrSize, "scopedAlloc");
      target.xGet = function(name) {
        return target.exports[name] || toss("Cannot find exported symbol:", name);
      };
      const __argcMismatch = (f, n) => toss(f + "() requires", n, "argument(s).");
      target.xCall = function(fname, ...args) {
        const f = fname instanceof Function ? fname : target.xGet(fname);
        if (!(f instanceof Function))
          toss("Exported symbol", fname, "is not a function.");
        if (f.length !== args.length) {
          __argcMismatch(f === fname ? f.name : fname, f.length);
        }
        return 2 === arguments.length && Array.isArray(arguments[1]) ? f.apply(null, arguments[1]) : f.apply(null, args);
      };
      cache.xWrap = /* @__PURE__ */ Object.create(null);
      cache.xWrap.convert = /* @__PURE__ */ Object.create(null);
      cache.xWrap.convert.arg = /* @__PURE__ */ new Map();
      cache.xWrap.convert.result = /* @__PURE__ */ new Map();
      const xArg = cache.xWrap.convert.arg, xResult = cache.xWrap.convert.result;
      const __xArgPtr = __asPtrType;
      xArg.set("i64", __BigInt).set("i32", (i) => i | 0).set("i16", (i) => (i | 0) & 65535).set("i8", (i) => (i | 0) & 255).set("f32", (i) => Number(i).valueOf()).set("float", xArg.get("f32")).set("f64", xArg.get("f32")).set("double", xArg.get("f64")).set("int", xArg.get("i32")).set("null", (i) => i).set(null, xArg.get("null")).set("**", __xArgPtr).set("*", __xArgPtr);
      xResult.set("*", __xArgPtr).set("pointer", __xArgPtr).set("number", (v2) => Number(v2)).set("void", (v2) => void 0).set(void 0, xResult.get("void")).set("null", (v2) => v2).set(null, xResult.get("null"));
      for (const t of [
        "i8",
        "i16",
        "i32",
        "i64",
        "int",
        "f32",
        "float",
        "f64",
        "double"
      ]) {
        xArg.set(t + "*", __xArgPtr);
        xResult.set(t + "*", __xArgPtr);
        xResult.set(
          t,
          xArg.get(t) || toss("Maintenance required: missing arg converter for", t)
        );
      }
      const __xArgString = (v2) => {
        return "string" === typeof v2 ? target.scopedAllocCString(v2) : __asPtrType(v2);
      };
      xArg.set("string", __xArgString).set("utf8", __xArgString);
      xResult.set("string", (i) => target.cstrToJs(i)).set("utf8", xResult.get("string")).set("string:dealloc", (i) => {
        try {
          return i ? target.cstrToJs(i) : null;
        } finally {
          target.dealloc(i);
        }
      }).set("utf8:dealloc", xResult.get("string:dealloc")).set("json", (i) => JSON.parse(target.cstrToJs(i))).set("json:dealloc", (i) => {
        try {
          return i ? JSON.parse(target.cstrToJs(i)) : null;
        } finally {
          target.dealloc(i);
        }
      });
      const AbstractArgAdapter = class {
        constructor(opt) {
          this.name = opt.name || "unnamed adapter";
        }
        convertArg(v2, argv, argIndex) {
          toss("AbstractArgAdapter must be subclassed.");
        }
      };
      xArg.FuncPtrAdapter = class FuncPtrAdapter extends AbstractArgAdapter {
        constructor(opt) {
          super(opt);
          if (xArg.FuncPtrAdapter.warnOnUse) {
            console.warn(
              "xArg.FuncPtrAdapter is an internal-only API",
              "and is not intended to be invoked from",
              "client-level code. Invoked with:",
              opt
            );
          }
          this.name = opt.name || "unnamed";
          this.signature = opt.signature;
          if (opt.contextKey instanceof Function) {
            this.contextKey = opt.contextKey;
            if (!opt.bindScope) opt.bindScope = "context";
          }
          this.bindScope = opt.bindScope || toss(
            "FuncPtrAdapter options requires a bindScope (explicit or implied)."
          );
          if (FuncPtrAdapter.bindScopes.indexOf(opt.bindScope) < 0) {
            toss(
              "Invalid options.bindScope (" + opt.bindMod + ") for FuncPtrAdapter. Expecting one of: (" + FuncPtrAdapter.bindScopes.join(", ") + ")"
            );
          }
          this.isTransient = "transient" === this.bindScope;
          this.isContext = "context" === this.bindScope;
          this.isPermanent = "permanent" === this.bindScope;
          this.singleton = "singleton" === this.bindScope ? [] : void 0;
          this.callProxy = opt.callProxy instanceof Function ? opt.callProxy : void 0;
        }
        contextKey(argv, argIndex) {
          return this;
        }
        contextMap(key) {
          const cm = this.__cmap || (this.__cmap = /* @__PURE__ */ new Map());
          let rc = cm.get(key);
          if (void 0 === rc) cm.set(key, rc = []);
          return rc;
        }
        convertArg(v2, argv, argIndex) {
          let pair = this.singleton;
          if (!pair && this.isContext) {
            pair = this.contextMap(this.contextKey(argv, argIndex));
          }
          if (0) {
            FuncPtrAdapter.debugOut(
              "FuncPtrAdapter.convertArg()",
              this.name,
              "signature =",
              this.signature,
              "transient ?=",
              this.transient,
              "pair =",
              pair,
              "v =",
              v2
            );
          }
          if (pair && 2 === pair.length && pair[0] === v2) {
            return pair[1];
          }
          if (v2 instanceof Function) {
            if (this.callProxy) {
              v2 = this.callProxy(v2);
            }
            const fp = __installFunction(v2, this.signature, this.isTransient);
            if (FuncPtrAdapter.debugFuncInstall) {
              FuncPtrAdapter.debugOut(
                "FuncPtrAdapter installed",
                this,
                this.contextKey(argv, argIndex),
                "@" + fp,
                v2
              );
            }
            if (pair) {
              if (pair[1]) {
                if (FuncPtrAdapter.debugFuncInstall) {
                  FuncPtrAdapter.debugOut(
                    "FuncPtrAdapter uninstalling",
                    this,
                    this.contextKey(argv, argIndex),
                    "@" + pair[1],
                    v2
                  );
                }
                try {
                  cache.scopedAlloc.pushPtr(pair[1]);
                } catch (e) {
                }
              }
              pair[0] = arguments[0] || __NullPtr;
              pair[1] = fp;
            }
            return fp;
          } else if (target.isPtr(v2) || null === v2 || void 0 === v2) {
            if (pair && pair[1] && pair[1] !== v2) {
              if (FuncPtrAdapter.debugFuncInstall) {
                FuncPtrAdapter.debugOut(
                  "FuncPtrAdapter uninstalling",
                  this,
                  this.contextKey(argv, argIndex),
                  "@" + pair[1],
                  v2
                );
              }
              try {
                cache.scopedAlloc.pushPtr(pair[1]);
              } catch (e) {
              }
              pair[0] = pair[1] = v2 || __NullPtr;
            }
            return v2 || __NullPtr;
          } else {
            throw new TypeError(
              "Invalid FuncPtrAdapter argument type. Expecting a function pointer or a " + (this.name ? this.name + " " : "") + "function matching signature " + this.signature + "."
            );
          }
        }
      };
      xArg.FuncPtrAdapter.warnOnUse = false;
      xArg.FuncPtrAdapter.debugFuncInstall = false;
      xArg.FuncPtrAdapter.debugOut = console.debug.bind(console);
      xArg.FuncPtrAdapter.bindScopes = [
        "transient",
        "context",
        "singleton",
        "permanent"
      ];
      const __xArgAdapterCheck = (t) => xArg.get(t) || toss("Argument adapter not found:", t);
      const __xResultAdapterCheck = (t) => xResult.get(t) || toss("Result adapter not found:", t);
      cache.xWrap.convertArg = (t, ...args) => __xArgAdapterCheck(t)(...args);
      cache.xWrap.convertArgNoCheck = (t, ...args) => xArg.get(t)(...args);
      cache.xWrap.convertResult = (t, v2) => null === t ? v2 : t ? __xResultAdapterCheck(t)(v2) : void 0;
      cache.xWrap.convertResultNoCheck = (t, v2) => null === t ? v2 : t ? xResult.get(t)(v2) : void 0;
      target.xWrap = function callee3(fArg, resultType, ...argTypes) {
        if (3 === arguments.length && Array.isArray(arguments[2])) {
          argTypes = arguments[2];
        }
        if (target.isPtr(fArg)) {
          fArg = target.functionEntry(fArg) || toss("Function pointer not found in WASM function table.");
        }
        const fIsFunc = fArg instanceof Function;
        const xf = fIsFunc ? fArg : target.xGet(fArg);
        if (fIsFunc) fArg = xf.name || "unnamed function";
        if (argTypes.length !== xf.length) __argcMismatch(fArg, xf.length);
        if (0 === xf.length && (null === resultType || "null" === resultType)) {
          return xf;
        }
        __xResultAdapterCheck(resultType);
        for (const t of argTypes) {
          if (t instanceof AbstractArgAdapter)
            xArg.set(t, (...args) => t.convertArg(...args));
          else __xArgAdapterCheck(t);
        }
        const cxw = cache.xWrap;
        if (0 === xf.length) {
          return (...args) => args.length ? __argcMismatch(fArg, xf.length) : cxw.convertResult(resultType, xf.call(null));
        }
        return function(...args) {
          if (args.length !== xf.length) __argcMismatch(fArg, xf.length);
          const scope = target.scopedAllocPush();
          try {
            let i = 0;
            if (callee3.debug) {
              console.debug(
                "xWrap() preparing: resultType ",
                resultType,
                "xf",
                xf,
                "argTypes",
                argTypes,
                "args",
                args
              );
            }
            for (; i < args.length; ++i)
              args[i] = cxw.convertArgNoCheck(argTypes[i], args[i], args, i);
            if (callee3.debug) {
              console.debug(
                "xWrap() calling: resultType ",
                resultType,
                "xf",
                xf,
                "argTypes",
                argTypes,
                "args",
                args
              );
            }
            return cxw.convertResultNoCheck(resultType, xf.apply(null, args));
          } finally {
            target.scopedAllocPop(scope);
          }
        };
      };
      const __xAdapter = function(func, argc, typeName, adapter, modeName, xcvPart) {
        if ("string" === typeof typeName) {
          if (1 === argc) return xcvPart.get(typeName);
          else if (2 === argc) {
            if (!adapter) {
              xcvPart.delete(typeName);
              return func;
            } else if (!(adapter instanceof Function)) {
              toss(modeName, "requires a function argument.");
            }
            xcvPart.set(typeName, adapter);
            return func;
          }
        }
        toss("Invalid arguments to", modeName);
      };
      target.xWrap.resultAdapter = function f(typeName, adapter) {
        return __xAdapter(
          f,
          arguments.length,
          typeName,
          adapter,
          "resultAdapter()",
          xResult
        );
      };
      target.xWrap.argAdapter = function f(typeName, adapter) {
        return __xAdapter(
          f,
          arguments.length,
          typeName,
          adapter,
          "argAdapter()",
          xArg
        );
      };
      target.xWrap.FuncPtrAdapter = xArg.FuncPtrAdapter;
      target.xCallWrapped = function(fArg, resultType, argTypes, ...args) {
        if (Array.isArray(arguments[3])) args = arguments[3];
        return target.xWrap(fArg, resultType, argTypes || []).apply(null, args || []);
      };
      target.xWrap.testConvertArg = cache.xWrap.convertArg;
      target.xWrap.testConvertResult = cache.xWrap.convertResult;
      return target;
    };
    globalThis.WhWasmUtilInstaller.yawl = function(config) {
      const wfetch = () => fetch(config.uri, { credentials: "same-origin" });
      const wui = this;
      const finalThen = function(arg) {
        if (config.wasmUtilTarget) {
          const toss = (...args) => {
            throw new Error(args.join(" "));
          };
          const tgt = config.wasmUtilTarget;
          tgt.module = arg.module;
          tgt.instance = arg.instance;
          if (!tgt.instance.exports.memory) {
            tgt.memory = config?.imports?.env?.memory || toss("Missing 'memory' object!");
          }
          if (!tgt.alloc && arg.instance.exports.malloc) {
            const exports = arg.instance.exports;
            tgt.alloc = function(n) {
              return exports.malloc(n) || toss("Allocation of", n, "bytes failed.");
            };
            tgt.dealloc = function(m) {
              exports.free(m);
            };
          }
          wui(tgt);
        }
        arg.config = config;
        if (config.onload) config.onload(arg);
        return arg;
      };
      const loadWasm = WebAssembly.instantiateStreaming ? () => WebAssembly.instantiateStreaming(
        wfetch(),
        config.imports || {}
      ).then(finalThen) : () => wfetch().then((response) => response.arrayBuffer()).then(
        (bytes) => WebAssembly.instantiate(bytes, config.imports || {})
      ).then(finalThen);
      return loadWasm;
    }.bind(globalThis.WhWasmUtilInstaller);
    "use strict";
    globalThis.Jaccwabyt = function StructBinderFactory(config) {
      const toss = (...args) => {
        throw new Error(args.join(" "));
      };
      if (!(config.heap instanceof WebAssembly.Memory) && !(config.heap instanceof Function)) {
        toss("config.heap must be WebAssembly.Memory instance or a function.");
      }
      ["alloc", "dealloc"].forEach(function(k) {
        config[k] instanceof Function || toss("Config option '" + k + "' must be a function.");
      });
      const __heap = config.heap;
      const SBF = StructBinderFactory;
      const heap = __heap ? __heap : () => new Uint8Array(__heap.buffer), alloc = config.alloc, dealloc = config.dealloc, log = config.log || console.debug.bind(console), memberPrefix = config.memberPrefix || "", memberSuffix = config.memberSuffix || "", BigInt2 = globalThis["BigInt"], BigInt64Array2 = globalThis["BigInt64Array"], bigIntEnabled = config.bigIntEnabled ?? !!BigInt64Array2, ptrIR = config.pointerIR || config.ptrIR || "i32", ptrSize = config.ptrSize || ("i32" === ptrIR ? 4 : 8);
      if (ptrIR !== "i32" && ptrIR !== "i64")
        toss("Invalid pointer representation:", ptrIR);
      if (ptrSize !== 4 && ptrSize !== 8)
        toss("Invalid pointer size:", ptrSize);
      const __BigInt = bigIntEnabled && BigInt2 ? (v2) => BigInt2(v2 || 0) : (v2) => toss("BigInt support is disabled in this build.");
      const __asPtrType = "i32" == ptrIR ? Number : __BigInt;
      const __NullPtr = __asPtrType(0);
      const __ptrAdd = function(...args) {
        let rc = __NullPtr;
        for (let i = 0; i < args.length; ++i) {
          rc += __asPtrType(args[i]);
        }
        return rc;
      };
      if (!SBF.debugFlags) {
        SBF.__makeDebugFlags = function(deriveFrom = null) {
          if (deriveFrom && deriveFrom.__flags) deriveFrom = deriveFrom.__flags;
          const f = function f2(flags) {
            if (0 === arguments.length) {
              return f2.__flags;
            }
            if (flags < 0) {
              delete f2.__flags.getter;
              delete f2.__flags.setter;
              delete f2.__flags.alloc;
              delete f2.__flags.dealloc;
            } else {
              f2.__flags.getter = 0 !== (1 & flags);
              f2.__flags.setter = 0 !== (2 & flags);
              f2.__flags.alloc = 0 !== (4 & flags);
              f2.__flags.dealloc = 0 !== (8 & flags);
            }
            return f2._flags;
          };
          Object.defineProperty(f, "__flags", {
            iterable: false,
            writable: false,
            value: Object.create(deriveFrom)
          });
          if (!deriveFrom) f(0);
          return f;
        };
        SBF.debugFlags = SBF.__makeDebugFlags();
      }
      const isLittleEndian = function() {
        const buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        return new Int16Array(buffer)[0] === 256;
      }();
      const isFuncSig = (s) => "(" === s[1];
      const isPtrSig = (s) => "p" === s || "P" === s;
      const isAutoPtrSig = (s) => "P" === s;
      const sigLetter = (s) => isFuncSig(s) ? "p" : s[0];
      const sigIR = function(s) {
        switch (sigLetter(s)) {
          case "c":
          case "C":
            return "i8";
          case "i":
            return "i32";
          case "p":
          case "P":
          case "s":
            return ptrIR;
          case "j":
            return "i64";
          case "f":
            return "float";
          case "d":
            return "double";
        }
        toss("Unhandled signature IR:", s);
      };
      const affirmBigIntArray = BigInt64Array2 ? () => true : () => toss("BigInt64Array is not available.");
      const sigDVGetter = function(s) {
        switch (sigLetter(s)) {
          case "p":
          case "P":
          case "s": {
            switch (ptrSize) {
              case 4:
                return "getInt32";
              case 8:
                return affirmBigIntArray() && "getBigInt64";
            }
            break;
          }
          case "i":
            return "getInt32";
          case "c":
            return "getInt8";
          case "C":
            return "getUint8";
          case "j":
            return affirmBigIntArray() && "getBigInt64";
          case "f":
            return "getFloat32";
          case "d":
            return "getFloat64";
        }
        toss("Unhandled DataView getter for signature:", s);
      };
      const sigDVSetter = function(s) {
        switch (sigLetter(s)) {
          case "p":
          case "P":
          case "s": {
            switch (ptrSize) {
              case 4:
                return "setInt32";
              case 8:
                return affirmBigIntArray() && "setBigInt64";
            }
            break;
          }
          case "i":
            return "setInt32";
          case "c":
            return "setInt8";
          case "C":
            return "setUint8";
          case "j":
            return affirmBigIntArray() && "setBigInt64";
          case "f":
            return "setFloat32";
          case "d":
            return "setFloat64";
        }
        toss("Unhandled DataView setter for signature:", s);
      };
      const sigDVSetWrapper = function(s) {
        switch (sigLetter(s)) {
          case "i":
          case "f":
          case "c":
          case "C":
          case "d":
            return Number;
          case "j":
            return __BigInt;
          case "p":
          case "P":
          case "s":
            switch (ptrSize) {
              case 4:
                return Number;
              case 8:
                return __BigInt;
            }
            break;
        }
        toss("Unhandled DataView set wrapper for signature:", s);
      };
      const sPropName = (s, k) => s + "::" + k;
      const __propThrowOnSet = function(structName, propName) {
        return () => toss(sPropName(structName, propName), "is read-only.");
      };
      const __instancePointerMap = /* @__PURE__ */ new WeakMap();
      const xPtrPropName = "(pointer-is-external)";
      const __isPtr32 = (ptr) => "number" === typeof ptr && ptr === (ptr | 0) && ptr >= 0;
      const __isPtr64 = (ptr) => "bigint" === typeof ptr && ptr >= 0 || __isPtr32(ptr);
      const __isPtr = 4 === ptrSize ? __isPtr32 : __isPtr64;
      const __freeStruct = function(ctor, obj, m) {
        if (!m) m = __instancePointerMap.get(obj);
        if (m) {
          __instancePointerMap.delete(obj);
          if (Array.isArray(obj.ondispose)) {
            let x;
            while (x = obj.ondispose.shift()) {
              try {
                if (x instanceof Function) x.call(obj);
                else if (x instanceof StructType) x.dispose();
                else if (__isPtr(x)) dealloc(x);
              } catch (e) {
                console.warn(
                  "ondispose() for",
                  ctor.structName,
                  "@",
                  m,
                  "threw. NOT propagating it.",
                  e
                );
              }
            }
          } else if (obj.ondispose instanceof Function) {
            try {
              obj.ondispose();
            } catch (e) {
              console.warn(
                "ondispose() for",
                ctor.structName,
                "@",
                m,
                "threw. NOT propagating it.",
                e
              );
            }
          }
          delete obj.ondispose;
          if (ctor.debugFlags.__flags.dealloc) {
            log(
              "debug.dealloc:",
              obj[xPtrPropName] ? "EXTERNAL" : "",
              ctor.structName,
              "instance:",
              ctor.structInfo.sizeof,
              "bytes @" + m
            );
          }
          if (!obj[xPtrPropName]) dealloc(m);
        }
      };
      const rop = (v2) => {
        return {
          configurable: false,
          writable: false,
          iterable: false,
          value: v2
        };
      };
      const __allocStruct = function(ctor, obj, m) {
        let fill = !m;
        if (m) Object.defineProperty(obj, xPtrPropName, rop(m));
        else {
          m = alloc(ctor.structInfo.sizeof);
          if (!m) toss("Allocation of", ctor.structName, "structure failed.");
        }
        try {
          if (ctor.debugFlags.__flags.alloc) {
            log(
              "debug.alloc:",
              fill ? "" : "EXTERNAL",
              ctor.structName,
              "instance:",
              ctor.structInfo.sizeof,
              "bytes @" + m
            );
          }
          if (fill) {
            heap().fill(0, Number(m), Number(m) + ctor.structInfo.sizeof);
          }
          __instancePointerMap.set(obj, m);
        } catch (e) {
          __freeStruct(ctor, obj, m);
          throw e;
        }
      };
      const __memoryDump = function() {
        const p = this.pointer;
        return p ? new Uint8Array(
          heap().slice(Number(p), Number(p) + this.structInfo.sizeof)
        ) : null;
      };
      const __memberKey = (k) => memberPrefix + k + memberSuffix;
      const __memberKeyProp = rop(__memberKey);
      const __lookupMember = function(structInfo, memberName, tossIfNotFound = true) {
        let m = structInfo.members[memberName];
        if (!m && (memberPrefix || memberSuffix)) {
          for (const v2 of Object.values(structInfo.members)) {
            if (v2.key === memberName) {
              m = v2;
              break;
            }
          }
          if (!m && tossIfNotFound) {
            toss(
              sPropName(structInfo.name, memberName),
              "is not a mapped struct member."
            );
          }
        }
        return m;
      };
      const __memberSignature = function f(obj, memberName, emscriptenFormat = false) {
        if (!f._)
          f._ = (x) => x.replace(/[^vipPsjrdcC]/g, "").replace(/[pPscC]/g, "i");
        const m = __lookupMember(obj.structInfo, memberName, true);
        return emscriptenFormat ? f._(m.signature) : m.signature;
      };
      const __ptrPropDescriptor = {
        configurable: false,
        enumerable: false,
        get: function() {
          return __instancePointerMap.get(this);
        },
        set: () => toss("Cannot assign the 'pointer' property of a struct.")
      };
      const __structMemberKeys = rop(function() {
        const a = [];
        for (const k of Object.keys(this.structInfo.members)) {
          a.push(this.memberKey(k));
        }
        return a;
      });
      const __utf8Decoder = new TextDecoder("utf-8");
      const __utf8Encoder = new TextEncoder();
      const __SAB = "undefined" === typeof SharedArrayBuffer ? function() {
      } : SharedArrayBuffer;
      const __utf8Decode = function(arrayBuffer, begin, end) {
        if (8 === ptrSize) {
          begin = Number(begin);
          end = Number(end);
        }
        return __utf8Decoder.decode(
          arrayBuffer.buffer instanceof __SAB ? arrayBuffer.slice(begin, end) : arrayBuffer.subarray(begin, end)
        );
      };
      const __memberIsString = function(obj, memberName, tossIfNotFound = false) {
        const m = __lookupMember(obj.structInfo, memberName, tossIfNotFound);
        return m && 1 === m.signature.length && "s" === m.signature[0] ? m : false;
      };
      const __affirmCStringSignature = function(member) {
        if ("s" === member.signature) return;
        toss(
          "Invalid member type signature for C-string value:",
          JSON.stringify(member)
        );
      };
      const __memberToJsString = function f(obj, memberName) {
        const m = __lookupMember(obj.structInfo, memberName, true);
        __affirmCStringSignature(m);
        const addr = obj[m.key];
        if (!addr) return null;
        let pos = addr;
        const mem = heap();
        for (; mem[pos] !== 0; ++pos) {
        }
        return addr === pos ? "" : __utf8Decode(mem, addr, pos);
      };
      const __addOnDispose = function(obj, ...v2) {
        if (obj.ondispose) {
          if (!Array.isArray(obj.ondispose)) {
            obj.ondispose = [obj.ondispose];
          }
        } else {
          obj.ondispose = [];
        }
        obj.ondispose.push(...v2);
      };
      const __allocCString = function(str) {
        const u = __utf8Encoder.encode(str);
        const mem = alloc(u.length + 1);
        if (!mem) toss("Allocation error while duplicating string:", str);
        const h = heap();
        h.set(u, Number(mem));
        h[__ptrAdd(mem, u.length)] = 0;
        return mem;
      };
      const __setMemberCString = function(obj, memberName, str) {
        const m = __lookupMember(obj.structInfo, memberName, true);
        __affirmCStringSignature(m);
        const mem = __allocCString(str);
        obj[m.key] = mem;
        __addOnDispose(obj, mem);
        return obj;
      };
      const StructType = function ctor(structName, structInfo) {
        if (arguments[2] !== rop) {
          toss(
            "Do not call the StructType constructor",
            "from client-level code."
          );
        }
        Object.defineProperties(this, {
          structName: rop(structName),
          structInfo: rop(structInfo)
        });
      };
      StructType.prototype = Object.create(null, {
        dispose: rop(function() {
          __freeStruct(this.constructor, this);
        }),
        lookupMember: rop(function(memberName, tossIfNotFound = true) {
          return __lookupMember(this.structInfo, memberName, tossIfNotFound);
        }),
        memberToJsString: rop(function(memberName) {
          return __memberToJsString(this, memberName);
        }),
        memberIsString: rop(function(memberName, tossIfNotFound = true) {
          return __memberIsString(this, memberName, tossIfNotFound);
        }),
        memberKey: __memberKeyProp,
        memberKeys: __structMemberKeys,
        memberSignature: rop(function(memberName, emscriptenFormat = false) {
          return __memberSignature(this, memberName, emscriptenFormat);
        }),
        memoryDump: rop(__memoryDump),
        pointer: __ptrPropDescriptor,
        setMemberCString: rop(function(memberName, str) {
          return __setMemberCString(this, memberName, str);
        })
      });
      Object.assign(StructType.prototype, {
        addOnDispose: function(...v2) {
          __addOnDispose(this, ...v2);
          return this;
        }
      });
      Object.defineProperties(StructType, {
        allocCString: rop(__allocCString),
        isA: rop((v2) => v2 instanceof StructType),
        hasExternalPointer: rop(
          (v2) => v2 instanceof StructType && !!v2[xPtrPropName]
        ),
        memberKey: __memberKeyProp
      });
      const makeMemberWrapper = function f(ctor, name, descr) {
        if (!f._) {
          f._ = { getters: {}, setters: {}, sw: {} };
          const a = ["i", "c", "C", "p", "P", "s", "f", "d", "v()"];
          if (bigIntEnabled) a.push("j");
          a.forEach(function(v2) {
            f._.getters[v2] = sigDVGetter(v2);
            f._.setters[v2] = sigDVSetter(v2);
            f._.sw[v2] = sigDVSetWrapper(v2);
          });
          const rxSig1 = /^[ipPsjfdcC]$/, rxSig2 = /^[vipPsjfdcC]\\([ipPsjfdcC]*\\)$/;
          f.sigCheck = function(obj, name2, key2, sig) {
            if (Object.prototype.hasOwnProperty.call(obj, key2)) {
              toss(obj.structName, "already has a property named", key2 + ".");
            }
            rxSig1.test(sig) || rxSig2.test(sig) || toss(
              "Malformed signature for",
              sPropName(obj.structName, name2) + ":",
              sig
            );
          };
        }
        const key = ctor.memberKey(name);
        f.sigCheck(ctor.prototype, name, key, descr.signature);
        descr.key = key;
        descr.name = name;
        const sigGlyph = sigLetter(descr.signature);
        const xPropName = sPropName(ctor.prototype.structName, key);
        const dbg = ctor.prototype.debugFlags.__flags;
        const prop = /* @__PURE__ */ Object.create(null);
        prop.configurable = false;
        prop.enumerable = false;
        prop.get = function() {
          if (dbg.getter) {
            log(
              "debug.getter:",
              f._.getters[sigGlyph],
              "for",
              sigIR(sigGlyph),
              xPropName,
              "@",
              this.pointer,
              "+",
              descr.offset,
              "sz",
              descr.sizeof
            );
          }
          let rc = new DataView(
            heap().buffer,
            Number(this.pointer) + descr.offset,
            descr.sizeof
          )[f._.getters[sigGlyph]](0, isLittleEndian);
          if (dbg.getter) log("debug.getter:", xPropName, "result =", rc);
          return rc;
        };
        if (descr.readOnly) {
          prop.set = __propThrowOnSet(ctor.prototype.structName, key);
        } else {
          prop.set = function(v2) {
            if (dbg.setter) {
              log(
                "debug.setter:",
                f._.setters[sigGlyph],
                "for",
                sigIR(sigGlyph),
                xPropName,
                "@",
                this.pointer,
                "+",
                descr.offset,
                "sz",
                descr.sizeof,
                v2
              );
            }
            if (!this.pointer) {
              toss("Cannot set struct property on disposed instance.");
            }
            if (null === v2) v2 = __NullPtr;
            else
              while (!__isPtr(v2)) {
                if (isAutoPtrSig(descr.signature) && v2 instanceof StructType) {
                  v2 = v2.pointer || __NullPtr;
                  if (dbg.setter)
                    log("debug.setter:", xPropName, "resolved to", v2);
                  break;
                }
                toss("Invalid value for pointer-type", xPropName + ".");
              }
            new DataView(
              heap().buffer,
              Number(this.pointer) + descr.offset,
              descr.sizeof
            )[f._.setters[sigGlyph]](0, f._.sw[sigGlyph](v2), isLittleEndian);
          };
        }
        Object.defineProperty(ctor.prototype, key, prop);
      };
      const StructBinder = function StructBinder2(structName, structInfo) {
        if (1 === arguments.length) {
          structInfo = structName;
          structName = structInfo.name;
        } else if (!structInfo.name) {
          structInfo.name = structName;
        }
        if (!structName) toss("Struct name is required.");
        let lastMember = false;
        Object.keys(structInfo.members).forEach((k) => {
          const m = structInfo.members[k];
          if (!m.sizeof) toss(structName, "member", k, "is missing sizeof.");
          else if (m.sizeof === 1) {
            m.signature === "c" || m.signature === "C" || toss(
              "Unexpected sizeof==1 member",
              sPropName(structInfo.name, k),
              "with signature",
              m.signature
            );
          } else {
            if (0 !== m.sizeof % 4) {
              console.warn(
                "Invalid struct member description =",
                m,
                "from",
                structInfo
              );
              toss(
                structName,
                "member",
                k,
                "sizeof is not aligned. sizeof=" + m.sizeof
              );
            }
            if (0 !== m.offset % 4) {
              console.warn(
                "Invalid struct member description =",
                m,
                "from",
                structInfo
              );
              toss(
                structName,
                "member",
                k,
                "offset is not aligned. offset=" + m.offset
              );
            }
          }
          if (!lastMember || lastMember.offset < m.offset) lastMember = m;
        });
        if (!lastMember) toss("No member property descriptions found.");
        else if (structInfo.sizeof < lastMember.offset + lastMember.sizeof) {
          toss(
            "Invalid struct config:",
            structName,
            "max member offset (" + lastMember.offset + ") ",
            "extends past end of struct (sizeof=" + structInfo.sizeof + ")."
          );
        }
        const debugFlags = rop(SBF.__makeDebugFlags(StructBinder2.debugFlags));
        const zeroAsPtr = __asPtrType(0);
        const StructCtor = function StructCtor2(externalMemory) {
          externalMemory = __asPtrType(externalMemory);
          if (!(this instanceof StructCtor2)) {
            toss(
              "The",
              structName,
              "constructor may only be called via 'new'."
            );
          } else if (arguments.length) {
            if (Number.isNaN(externalMemory) || externalMemory <= zeroAsPtr) {
              toss(
                "Invalid pointer value",
                arguments[0],
                "for",
                structName,
                "constructor."
              );
            }
            __allocStruct(StructCtor2, this, externalMemory);
          } else {
            __allocStruct(StructCtor2, this);
          }
        };
        Object.defineProperties(StructCtor, {
          debugFlags,
          isA: rop((v2) => v2 instanceof StructCtor),
          memberKey: __memberKeyProp,
          memberKeys: __structMemberKeys,
          methodInfoForKey: rop(function(mKey) {
          }),
          structInfo: rop(structInfo),
          structName: rop(structName)
        });
        StructCtor.prototype = new StructType(structName, structInfo, rop);
        Object.defineProperties(StructCtor.prototype, {
          debugFlags,
          constructor: rop(StructCtor)
        });
        Object.keys(structInfo.members).forEach(
          (name) => makeMemberWrapper(StructCtor, name, structInfo.members[name])
        );
        return StructCtor;
      };
      StructBinder.StructType = StructType;
      StructBinder.config = config;
      StructBinder.allocCString = __allocCString;
      if (!StructBinder.debugFlags) {
        StructBinder.debugFlags = SBF.__makeDebugFlags(SBF.debugFlags);
      }
      return StructBinder;
    };
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      "use strict";
      const toss = (...args) => {
        throw new Error(args.join(" "));
      };
      const capi = sqlite32.capi, wasm = sqlite32.wasm, util = sqlite32.util;
      globalThis.WhWasmUtilInstaller(wasm);
      delete globalThis.WhWasmUtilInstaller;
      if (0) {
        const dealloc = wasm.exports[sqlite32.config.deallocExportName];
        const nFunc = wasm.functionTable().length;
        let i;
        for (i = 0; i < nFunc; ++i) {
          const e = wasm.functionEntry(i);
          if (dealloc === e) {
            capi.SQLITE_WASM_DEALLOC = i;
            break;
          }
        }
        if (dealloc !== wasm.functionEntry(capi.SQLITE_WASM_DEALLOC)) {
          toss(
            "Internal error: cannot find function pointer for SQLITE_WASM_DEALLOC."
          );
        }
      }
      const bindingSignatures = {
        core: [
          ["sqlite3_aggregate_context", "void*", "sqlite3_context*", "int"],
          ["sqlite3_bind_double", "int", "sqlite3_stmt*", "int", "f64"],
          ["sqlite3_bind_int", "int", "sqlite3_stmt*", "int", "int"],
          ["sqlite3_bind_null", void 0, "sqlite3_stmt*", "int"],
          ["sqlite3_bind_parameter_count", "int", "sqlite3_stmt*"],
          ["sqlite3_bind_parameter_index", "int", "sqlite3_stmt*", "string"],
          ["sqlite3_bind_parameter_name", "string", "sqlite3_stmt*", "int"],
          [
            "sqlite3_bind_pointer",
            "int",
            "sqlite3_stmt*",
            "int",
            "*",
            "string:static",
            "*"
          ],
          [
            "sqlite3_busy_handler",
            "int",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                signature: "i(pi)",
                contextKey: (argv, argIndex) => argv[0]
              }),
              "*"
            ]
          ],
          ["sqlite3_busy_timeout", "int", "sqlite3*", "int"],
          ["sqlite3_changes", "int", "sqlite3*"],
          ["sqlite3_clear_bindings", "int", "sqlite3_stmt*"],
          ["sqlite3_collation_needed", "int", "sqlite3*", "*", "*"],
          ["sqlite3_column_blob", "*", "sqlite3_stmt*", "int"],
          ["sqlite3_column_bytes", "int", "sqlite3_stmt*", "int"],
          ["sqlite3_column_count", "int", "sqlite3_stmt*"],
          ["sqlite3_column_decltype", "string", "sqlite3_stmt*", "int"],
          ["sqlite3_column_double", "f64", "sqlite3_stmt*", "int"],
          ["sqlite3_column_int", "int", "sqlite3_stmt*", "int"],
          ["sqlite3_column_name", "string", "sqlite3_stmt*", "int"],
          ["sqlite3_column_text", "string", "sqlite3_stmt*", "int"],
          ["sqlite3_column_type", "int", "sqlite3_stmt*", "int"],
          ["sqlite3_column_value", "sqlite3_value*", "sqlite3_stmt*", "int"],
          [
            "sqlite3_commit_hook",
            "void*",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "sqlite3_commit_hook",
                signature: "i(p)",
                contextKey: (argv) => argv[0]
              }),
              "*"
            ]
          ],
          ["sqlite3_compileoption_get", "string", "int"],
          ["sqlite3_compileoption_used", "int", "string"],
          ["sqlite3_complete", "int", "string:flexible"],
          ["sqlite3_context_db_handle", "sqlite3*", "sqlite3_context*"],
          ["sqlite3_data_count", "int", "sqlite3_stmt*"],
          ["sqlite3_db_filename", "string", "sqlite3*", "string"],
          ["sqlite3_db_handle", "sqlite3*", "sqlite3_stmt*"],
          ["sqlite3_db_name", "string", "sqlite3*", "int"],
          ["sqlite3_db_readonly", "int", "sqlite3*", "string"],
          ["sqlite3_db_status", "int", "sqlite3*", "int", "*", "*", "int"],
          ["sqlite3_errcode", "int", "sqlite3*"],
          ["sqlite3_errmsg", "string", "sqlite3*"],
          ["sqlite3_error_offset", "int", "sqlite3*"],
          ["sqlite3_errstr", "string", "int"],
          [
            "sqlite3_exec",
            "int",
            [
              "sqlite3*",
              "string:flexible",
              new wasm.xWrap.FuncPtrAdapter({
                signature: "i(pipp)",
                bindScope: "transient",
                callProxy: (callback) => {
                  let aNames;
                  return (pVoid, nCols, pColVals, pColNames) => {
                    try {
                      const aVals = wasm.cArgvToJs(nCols, pColVals);
                      if (!aNames) aNames = wasm.cArgvToJs(nCols, pColNames);
                      return callback(aVals, aNames) | 0;
                    } catch (e) {
                      return e.resultCode || capi.SQLITE_ERROR;
                    }
                  };
                }
              }),
              "*",
              "**"
            ]
          ],
          ["sqlite3_expanded_sql", "string", "sqlite3_stmt*"],
          ["sqlite3_extended_errcode", "int", "sqlite3*"],
          ["sqlite3_extended_result_codes", "int", "sqlite3*", "int"],
          ["sqlite3_file_control", "int", "sqlite3*", "string", "int", "*"],
          ["sqlite3_finalize", "int", "sqlite3_stmt*"],
          ["sqlite3_free", void 0, "*"],
          ["sqlite3_get_autocommit", "int", "sqlite3*"],
          ["sqlite3_get_auxdata", "*", "sqlite3_context*", "int"],
          ["sqlite3_initialize", void 0],
          ["sqlite3_interrupt", void 0, "sqlite3*"],
          ["sqlite3_is_interrupted", "int", "sqlite3*"],
          ["sqlite3_keyword_count", "int"],
          ["sqlite3_keyword_name", "int", ["int", "**", "*"]],
          ["sqlite3_keyword_check", "int", ["string", "int"]],
          ["sqlite3_libversion", "string"],
          ["sqlite3_libversion_number", "int"],
          ["sqlite3_limit", "int", ["sqlite3*", "int", "int"]],
          ["sqlite3_malloc", "*", "int"],
          ["sqlite3_open", "int", "string", "*"],
          ["sqlite3_open_v2", "int", "string", "*", "int", "string"],
          ["sqlite3_realloc", "*", "*", "int"],
          ["sqlite3_reset", "int", "sqlite3_stmt*"],
          [
            "sqlite3_result_blob",
            void 0,
            "sqlite3_context*",
            "*",
            "int",
            "*"
          ],
          ["sqlite3_result_double", void 0, "sqlite3_context*", "f64"],
          [
            "sqlite3_result_error",
            void 0,
            "sqlite3_context*",
            "string",
            "int"
          ],
          ["sqlite3_result_error_code", void 0, "sqlite3_context*", "int"],
          ["sqlite3_result_error_nomem", void 0, "sqlite3_context*"],
          ["sqlite3_result_error_toobig", void 0, "sqlite3_context*"],
          ["sqlite3_result_int", void 0, "sqlite3_context*", "int"],
          ["sqlite3_result_null", void 0, "sqlite3_context*"],
          [
            "sqlite3_result_pointer",
            void 0,
            "sqlite3_context*",
            "*",
            "string:static",
            "*"
          ],
          ["sqlite3_result_subtype", void 0, "sqlite3_value*", "int"],
          [
            "sqlite3_result_text",
            void 0,
            "sqlite3_context*",
            "string",
            "int",
            "*"
          ],
          ["sqlite3_result_zeroblob", void 0, "sqlite3_context*", "int"],
          [
            "sqlite3_rollback_hook",
            "void*",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "sqlite3_rollback_hook",
                signature: "v(p)",
                contextKey: (argv) => argv[0]
              }),
              "*"
            ]
          ],
          [
            "sqlite3_set_auxdata",
            void 0,
            [
              "sqlite3_context*",
              "int",
              "*",
              true ? "*" : new wasm.xWrap.FuncPtrAdapter({
                name: "xDestroyAuxData",
                signature: "v(p)",
                contextKey: (argv, argIndex) => argv[0]
              })
            ]
          ],
          ["sqlite3_set_errmsg", "int", "sqlite3*", "int", "string"],
          ["sqlite3_shutdown", void 0],
          ["sqlite3_sourceid", "string"],
          ["sqlite3_sql", "string", "sqlite3_stmt*"],
          ["sqlite3_status", "int", "int", "*", "*", "int"],
          ["sqlite3_step", "int", "sqlite3_stmt*"],
          ["sqlite3_stmt_busy", "int", "sqlite3_stmt*"],
          ["sqlite3_stmt_readonly", "int", "sqlite3_stmt*"],
          ["sqlite3_stmt_status", "int", "sqlite3_stmt*", "int", "int"],
          ["sqlite3_strglob", "int", "string", "string"],
          ["sqlite3_stricmp", "int", "string", "string"],
          ["sqlite3_strlike", "int", "string", "string", "int"],
          ["sqlite3_strnicmp", "int", "string", "string", "int"],
          [
            "sqlite3_table_column_metadata",
            "int",
            "sqlite3*",
            "string",
            "string",
            "string",
            "**",
            "**",
            "*",
            "*",
            "*"
          ],
          ["sqlite3_total_changes", "int", "sqlite3*"],
          [
            "sqlite3_trace_v2",
            "int",
            [
              "sqlite3*",
              "int",
              new wasm.xWrap.FuncPtrAdapter({
                name: "sqlite3_trace_v2::callback",
                signature: "i(ippp)",
                contextKey: (argv, argIndex) => argv[0]
              }),
              "*"
            ]
          ],
          ["sqlite3_txn_state", "int", ["sqlite3*", "string"]],
          ["sqlite3_uri_boolean", "int", "sqlite3_filename", "string", "int"],
          ["sqlite3_uri_key", "string", "sqlite3_filename", "int"],
          ["sqlite3_uri_parameter", "string", "sqlite3_filename", "string"],
          ["sqlite3_user_data", "void*", "sqlite3_context*"],
          ["sqlite3_value_blob", "*", "sqlite3_value*"],
          ["sqlite3_value_bytes", "int", "sqlite3_value*"],
          ["sqlite3_value_double", "f64", "sqlite3_value*"],
          ["sqlite3_value_dup", "sqlite3_value*", "sqlite3_value*"],
          ["sqlite3_value_free", void 0, "sqlite3_value*"],
          ["sqlite3_value_frombind", "int", "sqlite3_value*"],
          ["sqlite3_value_int", "int", "sqlite3_value*"],
          ["sqlite3_value_nochange", "int", "sqlite3_value*"],
          ["sqlite3_value_numeric_type", "int", "sqlite3_value*"],
          ["sqlite3_value_pointer", "*", "sqlite3_value*", "string:static"],
          ["sqlite3_value_subtype", "int", "sqlite3_value*"],
          ["sqlite3_value_text", "string", "sqlite3_value*"],
          ["sqlite3_value_type", "int", "sqlite3_value*"],
          ["sqlite3_vfs_find", "*", "string"],
          ["sqlite3_vfs_register", "int", "sqlite3_vfs*", "int"],
          ["sqlite3_vfs_unregister", "int", "sqlite3_vfs*"]
        ],
        int64: [
          ["sqlite3_bind_int64", "int", ["sqlite3_stmt*", "int", "i64"]],
          ["sqlite3_changes64", "i64", ["sqlite3*"]],
          ["sqlite3_column_int64", "i64", ["sqlite3_stmt*", "int"]],
          [
            "sqlite3_deserialize",
            "int",
            "sqlite3*",
            "string",
            "*",
            "i64",
            "i64",
            "int"
          ],
          ["sqlite3_last_insert_rowid", "i64", ["sqlite3*"]],
          ["sqlite3_malloc64", "*", "i64"],
          ["sqlite3_msize", "i64", "*"],
          ["sqlite3_overload_function", "int", ["sqlite3*", "string", "int"]],
          ["sqlite3_realloc64", "*", "*", "i64"],
          ["sqlite3_result_int64", void 0, "*", "i64"],
          ["sqlite3_result_zeroblob64", "int", "*", "i64"],
          ["sqlite3_serialize", "*", "sqlite3*", "string", "*", "int"],
          ["sqlite3_set_last_insert_rowid", void 0, ["sqlite3*", "i64"]],
          ["sqlite3_status64", "int", "int", "*", "*", "int"],
          ["sqlite3_db_status64", "int", "sqlite3*", "int", "*", "*", "int"],
          ["sqlite3_total_changes64", "i64", ["sqlite3*"]],
          [
            "sqlite3_update_hook",
            "*",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "sqlite3_update_hook::callback",
                signature: "v(pippj)",
                contextKey: (argv) => argv[0],
                callProxy: (callback) => {
                  return (p, op, z0, z1, rowid) => {
                    callback(
                      p,
                      op,
                      wasm.cstrToJs(z0),
                      wasm.cstrToJs(z1),
                      rowid
                    );
                  };
                }
              }),
              "*"
            ]
          ],
          ["sqlite3_uri_int64", "i64", ["sqlite3_filename", "string", "i64"]],
          ["sqlite3_value_int64", "i64", "sqlite3_value*"]
        ],
        wasmInternal: [
          ["sqlite3__wasm_db_reset", "int", "sqlite3*"],
          ["sqlite3__wasm_db_vfs", "sqlite3_vfs*", "sqlite3*", "string"],
          [
            "sqlite3__wasm_vfs_create_file",
            "int",
            "sqlite3_vfs*",
            "string",
            "*",
            "int"
          ],
          ["sqlite3__wasm_posix_create_file", "int", "string", "*", "int"],
          ["sqlite3__wasm_vfs_unlink", "int", "sqlite3_vfs*", "string"],
          ["sqlite3__wasm_qfmt_token", "string:dealloc", "string", "int"]
        ]
      };
      if (!!wasm.exports.sqlite3_progress_handler) {
        bindingSignatures.core.push([
          "sqlite3_progress_handler",
          void 0,
          [
            "sqlite3*",
            "int",
            new wasm.xWrap.FuncPtrAdapter({
              name: "xProgressHandler",
              signature: "i(p)",
              bindScope: "context",
              contextKey: (argv, argIndex) => argv[0]
            }),
            "*"
          ]
        ]);
      }
      if (!!wasm.exports.sqlite3_stmt_explain) {
        bindingSignatures.core.push(
          ["sqlite3_stmt_explain", "int", "sqlite3_stmt*", "int"],
          ["sqlite3_stmt_isexplain", "int", "sqlite3_stmt*"]
        );
      }
      if (!!wasm.exports.sqlite3_set_authorizer) {
        bindingSignatures.core.push([
          "sqlite3_set_authorizer",
          "int",
          [
            "sqlite3*",
            new wasm.xWrap.FuncPtrAdapter({
              name: "sqlite3_set_authorizer::xAuth",
              signature: "i(pissss)",
              contextKey: (argv, argIndex) => argv[0],
              callProxy: (callback) => {
                return (pV, iCode, s0, s1, s2, s3) => {
                  try {
                    s0 = s0 && wasm.cstrToJs(s0);
                    s1 = s1 && wasm.cstrToJs(s1);
                    s2 = s2 && wasm.cstrToJs(s2);
                    s3 = s3 && wasm.cstrToJs(s3);
                    return callback(pV, iCode, s0, s1, s2, s3) | 0;
                  } catch (e) {
                    return e.resultCode || capi.SQLITE_ERROR;
                  }
                };
              }
            }),
            "*"
          ]
        ]);
      }
      if (!!wasm.exports.sqlite3_column_origin_name) {
        bindingSignatures.core.push(
          ["sqlite3_column_database_name", "string", "sqlite3_stmt*", "int"],
          ["sqlite3_column_origin_name", "string", "sqlite3_stmt*", "int"],
          ["sqlite3_column_table_name", "string", "sqlite3_stmt*", "int"]
        );
      }
      if (false) {
        bindingSignatures.core.push([
          "sqlite3_normalized_sql",
          "string",
          "sqlite3_stmt*"
        ]);
      }
      if (wasm.bigIntEnabled && !!wasm.exports.sqlite3_declare_vtab) {
        bindingSignatures.int64.push(
          [
            "sqlite3_create_module",
            "int",
            ["sqlite3*", "string", "sqlite3_module*", "*"]
          ],
          [
            "sqlite3_create_module_v2",
            "int",
            ["sqlite3*", "string", "sqlite3_module*", "*", "*"]
          ],
          ["sqlite3_declare_vtab", "int", ["sqlite3*", "string:flexible"]],
          ["sqlite3_drop_modules", "int", ["sqlite3*", "**"]],
          ["sqlite3_vtab_collation", "string", "sqlite3_index_info*", "int"],
          ["sqlite3_vtab_distinct", "int", "sqlite3_index_info*"],
          ["sqlite3_vtab_in", "int", "sqlite3_index_info*", "int", "int"],
          ["sqlite3_vtab_in_first", "int", "sqlite3_value*", "**"],
          ["sqlite3_vtab_in_next", "int", "sqlite3_value*", "**"],
          ["sqlite3_vtab_nochange", "int", "sqlite3_context*"],
          ["sqlite3_vtab_on_conflict", "int", "sqlite3*"],
          ["sqlite3_vtab_rhs_value", "int", "sqlite3_index_info*", "int", "**"]
        );
      }
      if (wasm.bigIntEnabled && !!wasm.exports.sqlite3_preupdate_hook) {
        bindingSignatures.int64.push(
          ["sqlite3_preupdate_blobwrite", "int", "sqlite3*"],
          ["sqlite3_preupdate_count", "int", "sqlite3*"],
          ["sqlite3_preupdate_depth", "int", "sqlite3*"],
          [
            "sqlite3_preupdate_hook",
            "*",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "sqlite3_preupdate_hook",
                signature: "v(ppippjj)",
                contextKey: (argv) => argv[0],
                callProxy: (callback) => {
                  return (p, db, op, zDb, zTbl, iKey1, iKey2) => {
                    callback(
                      p,
                      db,
                      op,
                      wasm.cstrToJs(zDb),
                      wasm.cstrToJs(zTbl),
                      iKey1,
                      iKey2
                    );
                  };
                }
              }),
              "*"
            ]
          ],
          ["sqlite3_preupdate_new", "int", ["sqlite3*", "int", "**"]],
          ["sqlite3_preupdate_old", "int", ["sqlite3*", "int", "**"]]
        );
      }
      if (wasm.bigIntEnabled && !!wasm.exports.sqlite3changegroup_add && !!wasm.exports.sqlite3session_create && !!wasm.exports.sqlite3_preupdate_hook) {
        const __ipsProxy = {
          signature: "i(ps)",
          callProxy: (callback) => {
            return (p, s) => {
              try {
                return callback(p, wasm.cstrToJs(s)) | 0;
              } catch (e) {
                return e.resultCode || capi.SQLITE_ERROR;
              }
            };
          }
        };
        bindingSignatures.int64.push(
          [
            "sqlite3changegroup_add",
            "int",
            ["sqlite3_changegroup*", "int", "void*"]
          ],
          [
            "sqlite3changegroup_add_strm",
            "int",
            [
              "sqlite3_changegroup*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          ["sqlite3changegroup_delete", void 0, ["sqlite3_changegroup*"]],
          ["sqlite3changegroup_new", "int", ["**"]],
          [
            "sqlite3changegroup_output",
            "int",
            ["sqlite3_changegroup*", "int*", "**"]
          ],
          [
            "sqlite3changegroup_output_strm",
            "int",
            [
              "sqlite3_changegroup*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xOutput",
                signature: "i(ppi)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          [
            "sqlite3changeset_apply",
            "int",
            [
              "sqlite3*",
              "int",
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xFilter",
                bindScope: "transient",
                ...__ipsProxy
              }),
              new wasm.xWrap.FuncPtrAdapter({
                name: "xConflict",
                signature: "i(pip)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          [
            "sqlite3changeset_apply_strm",
            "int",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xFilter",
                bindScope: "transient",
                ...__ipsProxy
              }),
              new wasm.xWrap.FuncPtrAdapter({
                name: "xConflict",
                signature: "i(pip)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          [
            "sqlite3changeset_apply_v2",
            "int",
            [
              "sqlite3*",
              "int",
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xFilter",
                bindScope: "transient",
                ...__ipsProxy
              }),
              new wasm.xWrap.FuncPtrAdapter({
                name: "xConflict",
                signature: "i(pip)",
                bindScope: "transient"
              }),
              "void*",
              "**",
              "int*",
              "int"
            ]
          ],
          [
            "sqlite3changeset_apply_v2_strm",
            "int",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xFilter",
                bindScope: "transient",
                ...__ipsProxy
              }),
              new wasm.xWrap.FuncPtrAdapter({
                name: "xConflict",
                signature: "i(pip)",
                bindScope: "transient"
              }),
              "void*",
              "**",
              "int*",
              "int"
            ]
          ],
          [
            "sqlite3changeset_apply_v3",
            "int",
            [
              "sqlite3*",
              "int",
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xFilter",
                signature: "i(pp)",
                bindScope: "transient"
              }),
              new wasm.xWrap.FuncPtrAdapter({
                name: "xConflict",
                signature: "i(pip)",
                bindScope: "transient"
              }),
              "void*",
              "**",
              "int*",
              "int"
            ]
          ],
          [
            "sqlite3changeset_apply_v3_strm",
            "int",
            [
              "sqlite3*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xFilter",
                signature: "i(pp)",
                bindScope: "transient"
              }),
              new wasm.xWrap.FuncPtrAdapter({
                name: "xConflict",
                signature: "i(pip)",
                bindScope: "transient"
              }),
              "void*",
              "**",
              "int*",
              "int"
            ]
          ],
          [
            "sqlite3changeset_concat",
            "int",
            ["int", "void*", "int", "void*", "int*", "**"]
          ],
          [
            "sqlite3changeset_concat_strm",
            "int",
            [
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInputA",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInputB",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xOutput",
                signature: "i(ppi)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          [
            "sqlite3changeset_conflict",
            "int",
            ["sqlite3_changeset_iter*", "int", "**"]
          ],
          ["sqlite3changeset_finalize", "int", ["sqlite3_changeset_iter*"]],
          [
            "sqlite3changeset_fk_conflicts",
            "int",
            ["sqlite3_changeset_iter*", "int*"]
          ],
          ["sqlite3changeset_invert", "int", ["int", "void*", "int*", "**"]],
          [
            "sqlite3changeset_invert_strm",
            "int",
            [
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xOutput",
                signature: "i(ppi)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          [
            "sqlite3changeset_new",
            "int",
            ["sqlite3_changeset_iter*", "int", "**"]
          ],
          ["sqlite3changeset_next", "int", ["sqlite3_changeset_iter*"]],
          [
            "sqlite3changeset_old",
            "int",
            ["sqlite3_changeset_iter*", "int", "**"]
          ],
          [
            "sqlite3changeset_op",
            "int",
            ["sqlite3_changeset_iter*", "**", "int*", "int*", "int*"]
          ],
          [
            "sqlite3changeset_pk",
            "int",
            ["sqlite3_changeset_iter*", "**", "int*"]
          ],
          ["sqlite3changeset_start", "int", ["**", "int", "*"]],
          [
            "sqlite3changeset_start_strm",
            "int",
            [
              "**",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          ["sqlite3changeset_start_v2", "int", ["**", "int", "*", "int"]],
          [
            "sqlite3changeset_start_v2_strm",
            "int",
            [
              "**",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xInput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*",
              "int"
            ]
          ],
          ["sqlite3session_attach", "int", ["sqlite3_session*", "string"]],
          [
            "sqlite3session_changeset",
            "int",
            ["sqlite3_session*", "int*", "**"]
          ],
          ["sqlite3session_changeset_size", "i64", ["sqlite3_session*"]],
          [
            "sqlite3session_changeset_strm",
            "int",
            [
              "sqlite3_session*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xOutput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          ["sqlite3session_config", "int", ["int", "void*"]],
          ["sqlite3session_create", "int", ["sqlite3*", "string", "**"]],
          [
            "sqlite3session_diff",
            "int",
            ["sqlite3_session*", "string", "string", "**"]
          ],
          ["sqlite3session_enable", "int", ["sqlite3_session*", "int"]],
          ["sqlite3session_indirect", "int", ["sqlite3_session*", "int"]],
          ["sqlite3session_isempty", "int", ["sqlite3_session*"]],
          ["sqlite3session_memory_used", "i64", ["sqlite3_session*"]],
          [
            "sqlite3session_object_config",
            "int",
            ["sqlite3_session*", "int", "void*"]
          ],
          ["sqlite3session_patchset", "int", ["sqlite3_session*", "*", "**"]],
          [
            "sqlite3session_patchset_strm",
            "int",
            [
              "sqlite3_session*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xOutput",
                signature: "i(ppp)",
                bindScope: "transient"
              }),
              "void*"
            ]
          ],
          [
            "sqlite3session_table_filter",
            void 0,
            [
              "sqlite3_session*",
              new wasm.xWrap.FuncPtrAdapter({
                name: "xFilter",
                ...__ipsProxy,
                contextKey: (argv, argIndex) => argv[0]
              }),
              "*"
            ]
          ]
        );
      }
      sqlite32.StructBinder = globalThis.Jaccwabyt({
        heap: wasm.heap8u,
        alloc: wasm.alloc,
        dealloc: wasm.dealloc,
        bigIntEnabled: wasm.bigIntEnabled,
        pointerIR: wasm.ptr.ir,
        memberPrefix: "$"
      });
      delete globalThis.Jaccwabyt;
      {
        const __xString = wasm.xWrap.argAdapter("string");
        wasm.xWrap.argAdapter(
          "string:flexible",
          (v2) => __xString(util.flexibleString(v2))
        );
        wasm.xWrap.argAdapter(
          "string:static",
          function(v2) {
            if (wasm.isPtr(v2)) return v2;
            v2 = "" + v2;
            let rc = this[v2];
            return rc || (this[v2] = wasm.allocCString(v2));
          }.bind(/* @__PURE__ */ Object.create(null))
        );
        const __xArgPtr = wasm.xWrap.argAdapter("*");
        const nilType = function() {
        };
        wasm.xWrap.argAdapter("sqlite3_filename", __xArgPtr)(
          "sqlite3_context*",
          __xArgPtr
        )("sqlite3_value*", __xArgPtr)("void*", __xArgPtr)(
          "sqlite3_changegroup*",
          __xArgPtr
        )("sqlite3_changeset_iter*", __xArgPtr)("sqlite3_session*", __xArgPtr)(
          "sqlite3_stmt*",
          (v2) => __xArgPtr(
            v2 instanceof (sqlite32?.oo1?.Stmt || nilType) ? v2.pointer : v2
          )
        )(
          "sqlite3*",
          (v2) => __xArgPtr(v2 instanceof (sqlite32?.oo1?.DB || nilType) ? v2.pointer : v2)
        )("sqlite3_vfs*", (v2) => {
          if ("string" === typeof v2) {
            return capi.sqlite3_vfs_find(v2) || sqlite32.SQLite3Error.toss(
              capi.SQLITE_NOTFOUND,
              "Unknown sqlite3_vfs name:",
              v2
            );
          }
          return __xArgPtr(
            v2 instanceof (capi.sqlite3_vfs || nilType) ? v2.pointer : v2
          );
        });
        if (wasm.exports.sqlite3_declare_vtab) {
          wasm.xWrap.argAdapter(
            "sqlite3_index_info*",
            (v2) => __xArgPtr(
              v2 instanceof (capi.sqlite3_index_info || nilType) ? v2.pointer : v2
            )
          )(
            "sqlite3_module*",
            (v2) => __xArgPtr(
              v2 instanceof (capi.sqlite3_module || nilType) ? v2.pointer : v2
            )
          );
        }
        const __xRcPtr = wasm.xWrap.resultAdapter("*");
        wasm.xWrap.resultAdapter("sqlite3*", __xRcPtr)(
          "sqlite3_context*",
          __xRcPtr
        )("sqlite3_stmt*", __xRcPtr)("sqlite3_value*", __xRcPtr)(
          "sqlite3_vfs*",
          __xRcPtr
        )("void*", __xRcPtr);
        for (const e of bindingSignatures.core) {
          capi[e[0]] = wasm.xWrap.apply(null, e);
        }
        for (const e of bindingSignatures.wasmInternal) {
          util[e[0]] = wasm.xWrap.apply(null, e);
        }
        for (const e of bindingSignatures.int64) {
          capi[e[0]] = wasm.bigIntEnabled ? wasm.xWrap.apply(null, e) : () => toss(
            e[0] + "() is unavailable due to lack",
            "of BigInt support in this build."
          );
        }
        delete bindingSignatures.core;
        delete bindingSignatures.int64;
        delete bindingSignatures.wasmInternal;
        util.sqlite3__wasm_db_error = function(pDb2, resultCode, message) {
          if (!pDb2) return capi.SQLITE_MISUSE;
          if (resultCode instanceof sqlite32.WasmAllocError) {
            resultCode = capi.SQLITE_NOMEM;
            message = 0;
          } else if (resultCode instanceof Error) {
            message = message || "" + resultCode;
            resultCode = resultCode.resultCode || capi.SQLITE_ERROR;
          }
          return capi.sqlite3_set_errmsg(pDb2, resultCode, message) || resultCode;
        };
      }
      {
        const cJson = wasm.xCall("sqlite3__wasm_enum_json");
        if (!cJson) {
          toss(
            "Maintenance required: increase sqlite3__wasm_enum_json()'s",
            "static buffer size!"
          );
        }
        wasm.ctype = JSON.parse(wasm.cstrToJs(cJson));
        const defineGroups = [
          "access",
          "authorizer",
          "blobFinalizers",
          "changeset",
          "config",
          "dataTypes",
          "dbConfig",
          "dbStatus",
          "encodings",
          "fcntl",
          "flock",
          "ioCap",
          "limits",
          "openFlags",
          "prepareFlags",
          "resultCodes",
          "sqlite3Status",
          "stmtStatus",
          "syncFlags",
          "trace",
          "txnState",
          "udfFlags",
          "version"
        ];
        if (wasm.bigIntEnabled) {
          defineGroups.push("serialize", "session", "vtab");
        }
        for (const t of defineGroups) {
          for (const e of Object.entries(wasm.ctype[t])) {
            capi[e[0]] = e[1];
          }
        }
        if (!wasm.functionEntry(capi.SQLITE_WASM_DEALLOC)) {
          toss(
            "Internal error: cannot resolve exported function",
            "entry SQLITE_WASM_DEALLOC (==" + capi.SQLITE_WASM_DEALLOC + ")."
          );
        }
        const __rcMap = /* @__PURE__ */ Object.create(null);
        for (const t of ["resultCodes"]) {
          for (const e of Object.entries(wasm.ctype[t])) {
            __rcMap[e[1]] = e[0];
          }
        }
        capi.sqlite3_js_rc_str = (rc) => __rcMap[rc];
        const notThese = Object.assign(/* @__PURE__ */ Object.create(null), {
          WasmTestStruct: true,
          sqlite3_kvvfs_methods: !util.isUIThread(),
          sqlite3_index_info: !wasm.bigIntEnabled,
          sqlite3_index_constraint: !wasm.bigIntEnabled,
          sqlite3_index_orderby: !wasm.bigIntEnabled,
          sqlite3_index_constraint_usage: !wasm.bigIntEnabled
        });
        for (const s of wasm.ctype.structs) {
          if (!notThese[s.name]) {
            capi[s.name] = sqlite32.StructBinder(s);
          }
        }
        if (capi.sqlite3_index_info) {
          for (const k of [
            "sqlite3_index_constraint",
            "sqlite3_index_orderby",
            "sqlite3_index_constraint_usage"
          ]) {
            capi.sqlite3_index_info[k] = capi[k];
            delete capi[k];
          }
          capi.sqlite3_vtab_config = wasm.xWrap(
            "sqlite3__wasm_vtab_config",
            "int",
            ["sqlite3*", "int", "int"]
          );
        }
      }
      const __dbArgcMismatch = (pDb2, f, n) => {
        return util.sqlite3__wasm_db_error(
          pDb2,
          capi.SQLITE_MISUSE,
          f + "() requires " + n + " argument" + (1 === n ? "" : "s") + "."
        );
      };
      const __errEncoding = (pDb2) => {
        return util.sqlite3__wasm_db_error(
          pDb2,
          capi.SQLITE_FORMAT,
          "SQLITE_UTF8 is the only supported encoding."
        );
      };
      const __argPDb = (pDb2) => wasm.xWrap.argAdapter("sqlite3*")(pDb2);
      const __argStr = (str) => wasm.isPtr(str) ? wasm.cstrToJs(str) : str;
      const __dbCleanupMap = function(pDb2, mode) {
        pDb2 = __argPDb(pDb2);
        let m = this.dbMap.get(pDb2);
        if (!mode) {
          this.dbMap.delete(pDb2);
          return m;
        } else if (!m && mode > 0) {
          this.dbMap.set(pDb2, m = /* @__PURE__ */ Object.create(null));
        }
        return m;
      }.bind(
        Object.assign(/* @__PURE__ */ Object.create(null), {
          dbMap: /* @__PURE__ */ new Map()
        })
      );
      __dbCleanupMap.addCollation = function(pDb2, name) {
        const m = __dbCleanupMap(pDb2, 1);
        if (!m.collation) m.collation = /* @__PURE__ */ new Set();
        m.collation.add(__argStr(name).toLowerCase());
      };
      __dbCleanupMap._addUDF = function(pDb2, name, arity, map) {
        name = __argStr(name).toLowerCase();
        let u = map.get(name);
        if (!u) map.set(name, u = /* @__PURE__ */ new Set());
        u.add(arity < 0 ? -1 : arity);
      };
      __dbCleanupMap.addFunction = function(pDb2, name, arity) {
        const m = __dbCleanupMap(pDb2, 1);
        if (!m.udf) m.udf = /* @__PURE__ */ new Map();
        this._addUDF(pDb2, name, arity, m.udf);
      };
      if (wasm.exports.sqlite3_create_window_function) {
        __dbCleanupMap.addWindowFunc = function(pDb2, name, arity) {
          const m = __dbCleanupMap(pDb2, 1);
          if (!m.wudf) m.wudf = /* @__PURE__ */ new Map();
          this._addUDF(pDb2, name, arity, m.wudf);
        };
      }
      __dbCleanupMap.cleanup = function(pDb2) {
        pDb2 = __argPDb(pDb2);
        for (const obj of [
          ["sqlite3_busy_handler", 3],
          ["sqlite3_commit_hook", 3],
          ["sqlite3_preupdate_hook", 3],
          ["sqlite3_progress_handler", 4],
          ["sqlite3_rollback_hook", 3],
          ["sqlite3_set_authorizer", 3],
          ["sqlite3_trace_v2", 4],
          ["sqlite3_update_hook", 3]
        ]) {
          const [name, arity] = obj;
          const x = wasm.exports[name];
          if (!x) {
            continue;
          }
          const closeArgs = [pDb2];
          closeArgs.length = arity;
          try {
            capi[name](...closeArgs);
          } catch (e) {
            sqlite32.config.warn(
              "close-time call of",
              name + "(",
              closeArgs,
              ") threw:",
              e
            );
          }
        }
        const m = __dbCleanupMap(pDb2, 0);
        if (!m) return;
        if (m.collation) {
          for (const name of m.collation) {
            try {
              capi.sqlite3_create_collation_v2(
                pDb2,
                name,
                capi.SQLITE_UTF8,
                0,
                0,
                0
              );
            } catch (e) {
            }
          }
          delete m.collation;
        }
        let i;
        for (i = 0; i < 2; ++i) {
          const fmap = i ? m.wudf : m.udf;
          if (!fmap) continue;
          const func = i ? capi.sqlite3_create_window_function : capi.sqlite3_create_function_v2;
          for (const e of fmap) {
            const name = e[0], arities = e[1];
            const fargs = [pDb2, name, 0, capi.SQLITE_UTF8, 0, 0, 0, 0, 0];
            if (i) fargs.push(0);
            for (const arity of arities) {
              try {
                fargs[2] = arity;
                func.apply(null, fargs);
              } catch (e2) {
              }
            }
            arities.clear();
          }
          fmap.clear();
        }
        delete m.udf;
        delete m.wudf;
      };
      {
        const __sqlite3CloseV2 = wasm.xWrap(
          "sqlite3_close_v2",
          "int",
          "sqlite3*"
        );
        capi.sqlite3_close_v2 = function(pDb2) {
          if (1 !== arguments.length)
            return __dbArgcMismatch(pDb2, "sqlite3_close_v2", 1);
          if (pDb2) {
            try {
              __dbCleanupMap.cleanup(pDb2);
            } catch (e) {
            }
          }
          return __sqlite3CloseV2(pDb2);
        };
      }
      if (capi.sqlite3session_create) {
        const __sqlite3SessionDelete = wasm.xWrap(
          "sqlite3session_delete",
          void 0,
          ["sqlite3_session*"]
        );
        capi.sqlite3session_delete = function(pSession) {
          if (1 !== arguments.length) {
            return __dbArgcMismatch(pDb, "sqlite3session_delete", 1);
          } else if (pSession) {
            capi.sqlite3session_table_filter(pSession, 0, 0);
          }
          __sqlite3SessionDelete(pSession);
        };
      }
      {
        const contextKey = (argv, argIndex) => {
          return "argv[" + argIndex + "]:" + argv[0] + ":" + wasm.cstrToJs(argv[1]).toLowerCase();
        };
        const __sqlite3CreateCollationV2 = wasm.xWrap(
          "sqlite3_create_collation_v2",
          "int",
          [
            "sqlite3*",
            "string",
            "int",
            "*",
            new wasm.xWrap.FuncPtrAdapter({
              name: "xCompare",
              signature: "i(pipip)",
              contextKey
            }),
            new wasm.xWrap.FuncPtrAdapter({
              name: "xDestroy",
              signature: "v(p)",
              contextKey
            })
          ]
        );
        capi.sqlite3_create_collation_v2 = function(pDb2, zName, eTextRep, pArg, xCompare, xDestroy) {
          if (6 !== arguments.length)
            return __dbArgcMismatch(pDb2, "sqlite3_create_collation_v2", 6);
          else if (0 === (eTextRep & 15)) {
            eTextRep |= capi.SQLITE_UTF8;
          } else if (capi.SQLITE_UTF8 !== (eTextRep & 15)) {
            return __errEncoding(pDb2);
          }
          try {
            const rc = __sqlite3CreateCollationV2(
              pDb2,
              zName,
              eTextRep,
              pArg,
              xCompare,
              xDestroy
            );
            if (0 === rc && xCompare instanceof Function) {
              __dbCleanupMap.addCollation(pDb2, zName);
            }
            return rc;
          } catch (e) {
            return util.sqlite3__wasm_db_error(pDb2, e);
          }
        };
        capi.sqlite3_create_collation = (pDb2, zName, eTextRep, pArg, xCompare) => {
          return 5 === arguments.length ? capi.sqlite3_create_collation_v2(
            pDb2,
            zName,
            eTextRep,
            pArg,
            xCompare,
            0
          ) : __dbArgcMismatch(pDb2, "sqlite3_create_collation", 5);
        };
      }
      {
        const contextKey = function(argv, argIndex) {
          return argv[0] + ":" + (argv[2] < 0 ? -1 : argv[2]) + ":" + argIndex + ":" + wasm.cstrToJs(argv[1]).toLowerCase();
        };
        const __cfProxy = Object.assign(/* @__PURE__ */ Object.create(null), {
          xInverseAndStep: {
            signature: "v(pip)",
            contextKey,
            callProxy: (callback) => {
              return (pCtx, argc, pArgv) => {
                try {
                  callback(pCtx, ...capi.sqlite3_values_to_js(argc, pArgv));
                } catch (e) {
                  capi.sqlite3_result_error_js(pCtx, e);
                }
              };
            }
          },
          xFinalAndValue: {
            signature: "v(p)",
            contextKey,
            callProxy: (callback) => {
              return (pCtx) => {
                try {
                  capi.sqlite3_result_js(pCtx, callback(pCtx));
                } catch (e) {
                  capi.sqlite3_result_error_js(pCtx, e);
                }
              };
            }
          },
          xFunc: {
            signature: "v(pip)",
            contextKey,
            callProxy: (callback) => {
              return (pCtx, argc, pArgv) => {
                try {
                  capi.sqlite3_result_js(
                    pCtx,
                    callback(pCtx, ...capi.sqlite3_values_to_js(argc, pArgv))
                  );
                } catch (e) {
                  capi.sqlite3_result_error_js(pCtx, e);
                }
              };
            }
          },
          xDestroy: {
            signature: "v(p)",
            contextKey,
            callProxy: (callback) => {
              return (pVoid) => {
                try {
                  callback(pVoid);
                } catch (e) {
                  console.error("UDF xDestroy method threw:", e);
                }
              };
            }
          }
        });
        const __sqlite3CreateFunction = wasm.xWrap(
          "sqlite3_create_function_v2",
          "int",
          [
            "sqlite3*",
            "string",
            "int",
            "int",
            "*",
            new wasm.xWrap.FuncPtrAdapter({
              name: "xFunc",
              ...__cfProxy.xFunc
            }),
            new wasm.xWrap.FuncPtrAdapter({
              name: "xStep",
              ...__cfProxy.xInverseAndStep
            }),
            new wasm.xWrap.FuncPtrAdapter({
              name: "xFinal",
              ...__cfProxy.xFinalAndValue
            }),
            new wasm.xWrap.FuncPtrAdapter({
              name: "xDestroy",
              ...__cfProxy.xDestroy
            })
          ]
        );
        const __sqlite3CreateWindowFunction = wasm.exports.sqlite3_create_window_function ? wasm.xWrap("sqlite3_create_window_function", "int", [
          "sqlite3*",
          "string",
          "int",
          "int",
          "*",
          new wasm.xWrap.FuncPtrAdapter({
            name: "xStep",
            ...__cfProxy.xInverseAndStep
          }),
          new wasm.xWrap.FuncPtrAdapter({
            name: "xFinal",
            ...__cfProxy.xFinalAndValue
          }),
          new wasm.xWrap.FuncPtrAdapter({
            name: "xValue",
            ...__cfProxy.xFinalAndValue
          }),
          new wasm.xWrap.FuncPtrAdapter({
            name: "xInverse",
            ...__cfProxy.xInverseAndStep
          }),
          new wasm.xWrap.FuncPtrAdapter({
            name: "xDestroy",
            ...__cfProxy.xDestroy
          })
        ]) : void 0;
        capi.sqlite3_create_function_v2 = function f(pDb2, funcName, nArg, eTextRep, pApp, xFunc, xStep, xFinal, xDestroy) {
          if (f.length !== arguments.length) {
            return __dbArgcMismatch(
              pDb2,
              "sqlite3_create_function_v2",
              f.length
            );
          } else if (0 === (eTextRep & 15)) {
            eTextRep |= capi.SQLITE_UTF8;
          } else if (capi.SQLITE_UTF8 !== (eTextRep & 15)) {
            return __errEncoding(pDb2);
          }
          try {
            const rc = __sqlite3CreateFunction(
              pDb2,
              funcName,
              nArg,
              eTextRep,
              pApp,
              xFunc,
              xStep,
              xFinal,
              xDestroy
            );
            if (0 === rc && (xFunc instanceof Function || xStep instanceof Function || xFinal instanceof Function || xDestroy instanceof Function)) {
              __dbCleanupMap.addFunction(pDb2, funcName, nArg);
            }
            return rc;
          } catch (e) {
            console.error("sqlite3_create_function_v2() setup threw:", e);
            return util.sqlite3__wasm_db_error(
              pDb2,
              e,
              "Creation of UDF threw: " + e
            );
          }
        };
        capi.sqlite3_create_function = function f(pDb2, funcName, nArg, eTextRep, pApp, xFunc, xStep, xFinal) {
          return f.length === arguments.length ? capi.sqlite3_create_function_v2(
            pDb2,
            funcName,
            nArg,
            eTextRep,
            pApp,
            xFunc,
            xStep,
            xFinal,
            0
          ) : __dbArgcMismatch(pDb2, "sqlite3_create_function", f.length);
        };
        if (__sqlite3CreateWindowFunction) {
          capi.sqlite3_create_window_function = function f(pDb2, funcName, nArg, eTextRep, pApp, xStep, xFinal, xValue, xInverse, xDestroy) {
            if (f.length !== arguments.length) {
              return __dbArgcMismatch(
                pDb2,
                "sqlite3_create_window_function",
                f.length
              );
            } else if (0 === (eTextRep & 15)) {
              eTextRep |= capi.SQLITE_UTF8;
            } else if (capi.SQLITE_UTF8 !== (eTextRep & 15)) {
              return __errEncoding(pDb2);
            }
            try {
              const rc = __sqlite3CreateWindowFunction(
                pDb2,
                funcName,
                nArg,
                eTextRep,
                pApp,
                xStep,
                xFinal,
                xValue,
                xInverse,
                xDestroy
              );
              if (0 === rc && (xStep instanceof Function || xFinal instanceof Function || xValue instanceof Function || xInverse instanceof Function || xDestroy instanceof Function)) {
                __dbCleanupMap.addWindowFunc(pDb2, funcName, nArg);
              }
              return rc;
            } catch (e) {
              console.error("sqlite3_create_window_function() setup threw:", e);
              return util.sqlite3__wasm_db_error(
                pDb2,
                e,
                "Creation of UDF threw: " + e
              );
            }
          };
        } else {
          delete capi.sqlite3_create_window_function;
        }
        capi.sqlite3_create_function_v2.udfSetResult = capi.sqlite3_create_function.udfSetResult = capi.sqlite3_result_js;
        if (capi.sqlite3_create_window_function) {
          capi.sqlite3_create_window_function.udfSetResult = capi.sqlite3_result_js;
        }
        capi.sqlite3_create_function_v2.udfConvertArgs = capi.sqlite3_create_function.udfConvertArgs = capi.sqlite3_values_to_js;
        if (capi.sqlite3_create_window_function) {
          capi.sqlite3_create_window_function.udfConvertArgs = capi.sqlite3_values_to_js;
        }
        capi.sqlite3_create_function_v2.udfSetError = capi.sqlite3_create_function.udfSetError = capi.sqlite3_result_error_js;
        if (capi.sqlite3_create_window_function) {
          capi.sqlite3_create_window_function.udfSetError = capi.sqlite3_result_error_js;
        }
      }
      {
        const __flexiString = (v2, n) => {
          if ("string" === typeof v2) {
            n = -1;
          } else if (util.isSQLableTypedArray(v2)) {
            n = v2.byteLength;
            v2 = wasm.typedArrayToString(
              v2 instanceof ArrayBuffer ? new Uint8Array(v2) : v2
            );
          } else if (Array.isArray(v2)) {
            v2 = v2.join("");
            n = -1;
          }
          return [v2, n];
        };
        const __prepare = {
          basic: wasm.xWrap("sqlite3_prepare_v3", "int", [
            "sqlite3*",
            "string",
            "int",
            "int",
            "**",
            "**"
          ]),
          full: wasm.xWrap("sqlite3_prepare_v3", "int", [
            "sqlite3*",
            "*",
            "int",
            "int",
            "**",
            "**"
          ])
        };
        capi.sqlite3_prepare_v3 = function f(pDb2, sql, sqlLen, prepFlags, ppStmt, pzTail) {
          if (f.length !== arguments.length) {
            return __dbArgcMismatch(pDb2, "sqlite3_prepare_v3", f.length);
          }
          const [xSql, xSqlLen] = __flexiString(sql, Number(sqlLen));
          switch (typeof xSql) {
            case "string":
              return __prepare.basic(
                pDb2,
                xSql,
                xSqlLen,
                prepFlags,
                ppStmt,
                null
              );
            case typeof wasm.ptr.null:
              return __prepare.full(
                pDb2,
                wasm.ptr.coerce(xSql),
                xSqlLen,
                prepFlags,
                ppStmt,
                pzTail
              );
            default:
              return util.sqlite3__wasm_db_error(
                pDb2,
                capi.SQLITE_MISUSE,
                "Invalid SQL argument type for sqlite3_prepare_v2/v3(). typeof=" + typeof xSql
              );
          }
        };
        capi.sqlite3_prepare_v2 = function f(pDb2, sql, sqlLen, ppStmt, pzTail) {
          return f.length === arguments.length ? capi.sqlite3_prepare_v3(pDb2, sql, sqlLen, 0, ppStmt, pzTail) : __dbArgcMismatch(pDb2, "sqlite3_prepare_v2", f.length);
        };
      }
      {
        const __bindText = wasm.xWrap("sqlite3_bind_text", "int", [
          "sqlite3_stmt*",
          "int",
          "string",
          "int",
          "*"
        ]);
        const __bindBlob = wasm.xWrap("sqlite3_bind_blob", "int", [
          "sqlite3_stmt*",
          "int",
          "*",
          "int",
          "*"
        ]);
        capi.sqlite3_bind_text = function f(pStmt, iCol, text, nText, xDestroy) {
          if (f.length !== arguments.length) {
            return __dbArgcMismatch(
              capi.sqlite3_db_handle(pStmt),
              "sqlite3_bind_text",
              f.length
            );
          } else if (wasm.isPtr(text) || null === text) {
            return __bindText(pStmt, iCol, text, nText, xDestroy);
          } else if (text instanceof ArrayBuffer) {
            text = new Uint8Array(text);
          } else if (Array.isArray(pMem)) {
            text = pMem.join("");
          }
          let p, n;
          try {
            if (util.isSQLableTypedArray(text)) {
              p = wasm.allocFromTypedArray(text);
              n = text.byteLength;
            } else if ("string" === typeof text) {
              [p, n] = wasm.allocCString(text);
            } else {
              return util.sqlite3__wasm_db_error(
                capi.sqlite3_db_handle(pStmt),
                capi.SQLITE_MISUSE,
                "Invalid 3rd argument type for sqlite3_bind_text()."
              );
            }
            return __bindText(pStmt, iCol, p, n, capi.SQLITE_WASM_DEALLOC);
          } catch (e) {
            wasm.dealloc(p);
            return util.sqlite3__wasm_db_error(
              capi.sqlite3_db_handle(pStmt),
              e
            );
          }
        };
        capi.sqlite3_bind_blob = function f(pStmt, iCol, pMem2, nMem, xDestroy) {
          if (f.length !== arguments.length) {
            return __dbArgcMismatch(
              capi.sqlite3_db_handle(pStmt),
              "sqlite3_bind_blob",
              f.length
            );
          } else if (wasm.isPtr(pMem2) || null === pMem2) {
            return __bindBlob(pStmt, iCol, pMem2, nMem, xDestroy);
          } else if (pMem2 instanceof ArrayBuffer) {
            pMem2 = new Uint8Array(pMem2);
          } else if (Array.isArray(pMem2)) {
            pMem2 = pMem2.join("");
          }
          let p, n;
          try {
            if (util.isBindableTypedArray(pMem2)) {
              p = wasm.allocFromTypedArray(pMem2);
              n = nMem >= 0 ? nMem : pMem2.byteLength;
            } else if ("string" === typeof pMem2) {
              [p, n] = wasm.allocCString(pMem2);
            } else {
              return util.sqlite3__wasm_db_error(
                capi.sqlite3_db_handle(pStmt),
                capi.SQLITE_MISUSE,
                "Invalid 3rd argument type for sqlite3_bind_blob()."
              );
            }
            return __bindBlob(pStmt, iCol, p, n, capi.SQLITE_WASM_DEALLOC);
          } catch (e) {
            wasm.dealloc(p);
            return util.sqlite3__wasm_db_error(
              capi.sqlite3_db_handle(pStmt),
              e
            );
          }
        };
      }
      {
        capi.sqlite3_config = function(op, ...args) {
          if (arguments.length < 2) return capi.SQLITE_MISUSE;
          switch (op) {
            case capi.SQLITE_CONFIG_COVERING_INDEX_SCAN:
            case capi.SQLITE_CONFIG_MEMSTATUS:
            case capi.SQLITE_CONFIG_SMALL_MALLOC:
            case capi.SQLITE_CONFIG_SORTERREF_SIZE:
            case capi.SQLITE_CONFIG_STMTJRNL_SPILL:
            case capi.SQLITE_CONFIG_URI:
              return wasm.exports.sqlite3__wasm_config_i(op, args[0]);
            case capi.SQLITE_CONFIG_LOOKASIDE:
              return wasm.exports.sqlite3__wasm_config_ii(op, args[0], args[1]);
            case capi.SQLITE_CONFIG_MEMDB_MAXSIZE:
              return wasm.exports.sqlite3__wasm_config_j(op, args[0]);
            case capi.SQLITE_CONFIG_GETMALLOC:
            case capi.SQLITE_CONFIG_GETMUTEX:
            case capi.SQLITE_CONFIG_GETPCACHE2:
            case capi.SQLITE_CONFIG_GETPCACHE:
            case capi.SQLITE_CONFIG_HEAP:
            case capi.SQLITE_CONFIG_LOG:
            case capi.SQLITE_CONFIG_MALLOC:
            case capi.SQLITE_CONFIG_MMAP_SIZE:
            case capi.SQLITE_CONFIG_MULTITHREAD:
            case capi.SQLITE_CONFIG_MUTEX:
            case capi.SQLITE_CONFIG_PAGECACHE:
            case capi.SQLITE_CONFIG_PCACHE2:
            case capi.SQLITE_CONFIG_PCACHE:
            case capi.SQLITE_CONFIG_PCACHE_HDRSZ:
            case capi.SQLITE_CONFIG_PMASZ:
            case capi.SQLITE_CONFIG_SERIALIZED:
            case capi.SQLITE_CONFIG_SINGLETHREAD:
            case capi.SQLITE_CONFIG_SQLLOG:
            case capi.SQLITE_CONFIG_WIN32_HEAPSIZE:
            default:
              return capi.SQLITE_NOTFOUND;
          }
        };
      }
      {
        const __autoExtFptr = /* @__PURE__ */ new Set();
        capi.sqlite3_auto_extension = function(fPtr) {
          if (fPtr instanceof Function) {
            fPtr = wasm.installFunction("i(ppp)", fPtr);
          } else if (1 !== arguments.length || !wasm.isPtr(fPtr)) {
            return capi.SQLITE_MISUSE;
          }
          const rc = wasm.exports.sqlite3_auto_extension(fPtr);
          if (fPtr !== arguments[0]) {
            if (0 === rc) __autoExtFptr.add(fPtr);
            else wasm.uninstallFunction(fPtr);
          }
          return rc;
        };
        capi.sqlite3_cancel_auto_extension = function(fPtr) {
          if (!fPtr || 1 !== arguments.length || !wasm.isPtr(fPtr)) return 0;
          return wasm.exports.sqlite3_cancel_auto_extension(fPtr);
        };
        capi.sqlite3_reset_auto_extension = function() {
          wasm.exports.sqlite3_reset_auto_extension();
          for (const fp of __autoExtFptr) wasm.uninstallFunction(fp);
          __autoExtFptr.clear();
        };
      }
      const pKvvfs = capi.sqlite3_vfs_find("kvvfs");
      if (pKvvfs) {
        if (util.isUIThread()) {
          const kvvfsMethods = new capi.sqlite3_kvvfs_methods(
            wasm.exports.sqlite3__wasm_kvvfs_methods()
          );
          delete capi.sqlite3_kvvfs_methods;
          const kvvfsMakeKey = wasm.exports.sqlite3__wasm_kvvfsMakeKeyOnPstack, pstack = wasm.pstack;
          const kvvfsStorage = (zClass) => 115 === wasm.peek(zClass) ? sessionStorage : localStorage;
          const kvvfsImpls = {
            xRead: (zClass, zKey, zBuf, nBuf) => {
              const stack = pstack.pointer, astack = wasm.scopedAllocPush();
              try {
                const zXKey = kvvfsMakeKey(zClass, zKey);
                if (!zXKey) return -3;
                const jKey = wasm.cstrToJs(zXKey);
                const jV = kvvfsStorage(zClass).getItem(jKey);
                if (!jV) return -1;
                const nV = jV.length;
                if (nBuf <= 0) return nV;
                else if (1 === nBuf) {
                  wasm.poke(zBuf, 0);
                  return nV;
                }
                const zV = wasm.scopedAllocCString(jV);
                if (nBuf > nV + 1) nBuf = nV + 1;
                wasm.heap8u().copyWithin(
                  Number(zBuf),
                  Number(zV),
                  wasm.ptr.addn(zV, nBuf, -1)
                );
                wasm.poke(wasm.ptr.add(zBuf, nBuf, -1), 0);
                return nBuf - 1;
              } catch (e) {
                sqlite32.config.error("kvstorageRead()", e);
                return -2;
              } finally {
                pstack.restore(stack);
                wasm.scopedAllocPop(astack);
              }
            },
            xWrite: (zClass, zKey, zData) => {
              const stack = pstack.pointer;
              try {
                const zXKey = kvvfsMakeKey(zClass, zKey);
                if (!zXKey) return 1;
                const jKey = wasm.cstrToJs(zXKey);
                kvvfsStorage(zClass).setItem(jKey, wasm.cstrToJs(zData));
                return 0;
              } catch (e) {
                sqlite32.config.error("kvstorageWrite()", e);
                return capi.SQLITE_IOERR;
              } finally {
                pstack.restore(stack);
              }
            },
            xDelete: (zClass, zKey) => {
              const stack = pstack.pointer;
              try {
                const zXKey = kvvfsMakeKey(zClass, zKey);
                if (!zXKey) return 1;
                kvvfsStorage(zClass).removeItem(wasm.cstrToJs(zXKey));
                return 0;
              } catch (e) {
                sqlite32.config.error("kvstorageDelete()", e);
                return capi.SQLITE_IOERR;
              } finally {
                pstack.restore(stack);
              }
            }
          };
          for (const k of Object.keys(kvvfsImpls)) {
            kvvfsMethods[kvvfsMethods.memberKey(k)] = wasm.installFunction(
              kvvfsMethods.memberSignature(k),
              kvvfsImpls[k]
            );
          }
        } else {
          capi.sqlite3_vfs_unregister(pKvvfs);
        }
      }
      wasm.xWrap.FuncPtrAdapter.warnOnUse = true;
      const StructBinder = sqlite32.StructBinder;
      const installMethod = function callee3(tgt, name, func, applyArgcCheck = callee3.installMethodArgcCheck) {
        if (!(tgt instanceof StructBinder.StructType)) {
          toss("Usage error: target object is-not-a StructType.");
        } else if (!(func instanceof Function) && !wasm.isPtr(func)) {
          toss("Usage error: expecting a Function or WASM pointer to one.");
        }
        if (1 === arguments.length) {
          return (n, f) => callee3(tgt, n, f, applyArgcCheck);
        }
        if (!callee3.argcProxy) {
          callee3.argcProxy = function(tgt2, funcName, func2, sig) {
            return function(...args) {
              if (func2.length !== arguments.length) {
                toss(
                  "Argument mismatch for",
                  tgt2.structInfo.name + "::" + funcName + ": Native signature is:",
                  sig
                );
              }
              return func2.apply(this, args);
            };
          };
          callee3.removeFuncList = function() {
            if (this.ondispose.__removeFuncList) {
              this.ondispose.__removeFuncList.forEach((v2, ndx) => {
                if (wasm.isPtr(v2)) {
                  try {
                    wasm.uninstallFunction(v2);
                  } catch (e) {
                  }
                }
              });
              delete this.ondispose.__removeFuncList;
            }
          };
        }
        const sigN = tgt.memberSignature(name);
        if (sigN.length < 2) {
          toss(
            "Member",
            name,
            "does not have a function pointer signature:",
            sigN
          );
        }
        const memKey = tgt.memberKey(name);
        const fProxy = applyArgcCheck && !wasm.isPtr(func) ? callee3.argcProxy(tgt, memKey, func, sigN) : func;
        if (wasm.isPtr(fProxy)) {
          if (fProxy && !wasm.functionEntry(fProxy)) {
            toss("Pointer", fProxy, "is not a WASM function table entry.");
          }
          tgt[memKey] = fProxy;
        } else {
          const pFunc = wasm.installFunction(fProxy, tgt.memberSignature(name));
          tgt[memKey] = pFunc;
          if (!tgt.ondispose || !tgt.ondispose.__removeFuncList) {
            tgt.addOnDispose(
              "ondispose.__removeFuncList handler",
              callee3.removeFuncList
            );
            tgt.ondispose.__removeFuncList = [];
          }
          tgt.ondispose.__removeFuncList.push(memKey, pFunc);
        }
        return (n, f) => callee3(tgt, n, f, applyArgcCheck);
      };
      installMethod.installMethodArgcCheck = false;
      const installMethods = function(structInstance, methods, applyArgcCheck = installMethod.installMethodArgcCheck) {
        const seen = /* @__PURE__ */ new Map();
        for (const k of Object.keys(methods)) {
          const m = methods[k];
          const prior = seen.get(m);
          if (prior) {
            const mkey = structInstance.memberKey(k);
            structInstance[mkey] = structInstance[structInstance.memberKey(prior)];
          } else {
            installMethod(structInstance, k, m, applyArgcCheck);
            seen.set(m, k);
          }
        }
        return structInstance;
      };
      StructBinder.StructType.prototype.installMethod = function callee3(name, func, applyArgcCheck = installMethod.installMethodArgcCheck) {
        return arguments.length < 3 && name && "object" === typeof name ? installMethods(this, ...arguments) : installMethod(this, ...arguments);
      };
      StructBinder.StructType.prototype.installMethods = function(methods, applyArgcCheck = installMethod.installMethodArgcCheck) {
        return installMethods(this, methods, applyArgcCheck);
      };
    });
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      sqlite32.version = {
        libVersion: "3.51.1",
        libVersionNumber: 3051001,
        sourceId: "2025-11-28 17:28:25 281fc0e9afc38674b9b0991943b9e9d1e64c6cbdb133d35f6f5c87ff6af38a88",
        downloadVersion: 3510100,
        scm: {
          "sha3-256": "281fc0e9afc38674b9b0991943b9e9d1e64c6cbdb133d35f6f5c87ff6af38a88",
          branch: "branch-3.51",
          tags: "release version-3.51.1",
          datetime: "2025-11-28T17:28:25.933Z"
        }
      };
    });
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      const toss3 = (...args) => {
        throw new sqlite32.SQLite3Error(...args);
      };
      const capi = sqlite32.capi, wasm = sqlite32.wasm, util = sqlite32.util;
      const __ptrMap = /* @__PURE__ */ new WeakMap();
      const __doesNotOwnHandle = /* @__PURE__ */ new Set();
      const __stmtMap = /* @__PURE__ */ new WeakMap();
      const getOwnOption = (opts, p, dflt) => {
        const d = Object.getOwnPropertyDescriptor(opts, p);
        return d ? d.value : dflt;
      };
      const checkSqlite3Rc = function(dbPtr, sqliteResultCode) {
        if (sqliteResultCode) {
          if (dbPtr instanceof DB) dbPtr = dbPtr.pointer;
          toss3(
            sqliteResultCode,
            "sqlite3 result code",
            sqliteResultCode + ":",
            dbPtr ? capi.sqlite3_errmsg(dbPtr) : capi.sqlite3_errstr(sqliteResultCode)
          );
        }
        return arguments[0];
      };
      const __dbTraceToConsole = wasm.installFunction(
        "i(ippp)",
        function(t, c, p, x) {
          if (capi.SQLITE_TRACE_STMT === t) {
            console.log(
              "SQL TRACE #" + ++this.counter + " via sqlite3@" + c + ":",
              wasm.cstrToJs(x)
            );
          }
        }.bind({ counter: 0 })
      );
      const __vfsPostOpenCallback = /* @__PURE__ */ Object.create(null);
      const dbCtorHelper = function ctor(...args) {
        if (!ctor._name2vfs) {
          ctor._name2vfs = /* @__PURE__ */ Object.create(null);
          const isWorkerThread = "function" === typeof importScripts ? (n) => toss3(
            "The VFS for",
            n,
            "is only available in the main window thread."
          ) : false;
          ctor._name2vfs[":localStorage:"] = {
            vfs: "kvvfs",
            filename: isWorkerThread || (() => "local")
          };
          ctor._name2vfs[":sessionStorage:"] = {
            vfs: "kvvfs",
            filename: isWorkerThread || (() => "session")
          };
        }
        const opt = ctor.normalizeArgs(...args);
        let pDb2;
        if (pDb2 = opt["sqlite3*"]) {
          if (!opt["sqlite3*:takeOwnership"]) {
            __doesNotOwnHandle.add(this);
          }
          this.filename = capi.sqlite3_db_filename(pDb2, "main");
        } else {
          let fn = opt.filename, vfsName = opt.vfs, flagsStr = opt.flags;
          if ("string" !== typeof fn && !wasm.isPtr(fn) || "string" !== typeof flagsStr || vfsName && "string" !== typeof vfsName && !wasm.isPtr(vfsName)) {
            sqlite32.config.error("Invalid DB ctor args", opt, arguments);
            toss3(
              "Invalid arguments for DB constructor:",
              arguments,
              "opts:",
              opt
            );
          }
          let fnJs = wasm.isPtr(fn) ? wasm.cstrToJs(fn) : fn;
          const vfsCheck = ctor._name2vfs[fnJs];
          if (vfsCheck) {
            vfsName = vfsCheck.vfs;
            fn = fnJs = vfsCheck.filename(fnJs);
          }
          let oflags = 0;
          if (flagsStr.indexOf("c") >= 0) {
            oflags |= capi.SQLITE_OPEN_CREATE | capi.SQLITE_OPEN_READWRITE;
          }
          if (flagsStr.indexOf("w") >= 0) oflags |= capi.SQLITE_OPEN_READWRITE;
          if (0 === oflags) oflags |= capi.SQLITE_OPEN_READONLY;
          oflags |= capi.SQLITE_OPEN_EXRESCODE;
          const stack = wasm.pstack.pointer;
          try {
            const pPtr = wasm.pstack.allocPtr();
            let rc = capi.sqlite3_open_v2(
              fn,
              pPtr,
              oflags,
              vfsName || wasm.ptr.null
            );
            pDb2 = wasm.peekPtr(pPtr);
            checkSqlite3Rc(pDb2, rc);
            capi.sqlite3_extended_result_codes(pDb2, 1);
            if (flagsStr.indexOf("t") >= 0) {
              capi.sqlite3_trace_v2(
                pDb2,
                capi.SQLITE_TRACE_STMT,
                __dbTraceToConsole,
                pDb2
              );
            }
          } catch (e) {
            if (pDb2) capi.sqlite3_close_v2(pDb2);
            throw e;
          } finally {
            wasm.pstack.restore(stack);
          }
          this.filename = fnJs;
        }
        __ptrMap.set(this, pDb2);
        __stmtMap.set(this, /* @__PURE__ */ Object.create(null));
        if (!opt["sqlite3*"]) {
          try {
            const pVfs = capi.sqlite3_js_db_vfs(pDb2) || toss3("Internal error: cannot get VFS for new db handle.");
            const postInitSql = __vfsPostOpenCallback[pVfs];
            if (postInitSql) {
              if (postInitSql instanceof Function) {
                postInitSql(this, sqlite32);
              } else {
                checkSqlite3Rc(
                  pDb2,
                  capi.sqlite3_exec(pDb2, postInitSql, 0, 0, 0)
                );
              }
            }
          } catch (e) {
            this.close();
            throw e;
          }
        }
      };
      dbCtorHelper.setVfsPostOpenCallback = function(pVfs, callback) {
        if (!(callback instanceof Function)) {
          toss3(
            "dbCtorHelper.setVfsPostOpenCallback() should not be used with a non-function argument.",
            arguments
          );
        }
        __vfsPostOpenCallback[pVfs] = callback;
      };
      dbCtorHelper.normalizeArgs = function(filename = ":memory:", flags = "c", vfs = null) {
        const arg = {};
        if (1 === arguments.length && arguments[0] && "object" === typeof arguments[0]) {
          Object.assign(arg, arguments[0]);
          if (void 0 === arg.flags) arg.flags = "c";
          if (void 0 === arg.vfs) arg.vfs = null;
          if (void 0 === arg.filename) arg.filename = ":memory:";
        } else {
          arg.filename = filename;
          arg.flags = flags;
          arg.vfs = vfs;
        }
        return arg;
      };
      const DB = function(...args) {
        dbCtorHelper.apply(this, args);
      };
      DB.dbCtorHelper = dbCtorHelper;
      const BindTypes = {
        null: 1,
        number: 2,
        string: 3,
        boolean: 4,
        blob: 5
      };
      if (wasm.bigIntEnabled) {
        BindTypes.bigint = BindTypes.number;
      }
      const Stmt = function() {
        if (BindTypes !== arguments[2]) {
          toss3(
            capi.SQLITE_MISUSE,
            "Do not call the Stmt constructor directly. Use DB.prepare()."
          );
        }
        this.db = arguments[0];
        __ptrMap.set(this, arguments[1]);
        if (arguments.length > 3 && !arguments[3]) {
          __doesNotOwnHandle.add(this);
        }
      };
      const affirmDbOpen = function(db) {
        if (!db.pointer) toss3("DB has been closed.");
        return db;
      };
      const affirmColIndex = function(stmt, ndx) {
        if (ndx !== (ndx | 0) || ndx < 0 || ndx >= stmt.columnCount) {
          toss3("Column index", ndx, "is out of range.");
        }
        return stmt;
      };
      const parseExecArgs = function(db, args) {
        const out2 = /* @__PURE__ */ Object.create(null);
        out2.opt = /* @__PURE__ */ Object.create(null);
        switch (args.length) {
          case 1:
            if ("string" === typeof args[0] || util.isSQLableTypedArray(args[0])) {
              out2.sql = args[0];
            } else if (Array.isArray(args[0])) {
              out2.sql = args[0];
            } else if (args[0] && "object" === typeof args[0]) {
              out2.opt = args[0];
              out2.sql = out2.opt.sql;
            }
            break;
          case 2:
            out2.sql = args[0];
            out2.opt = args[1];
            break;
          default:
            toss3("Invalid argument count for exec().");
        }
        out2.sql = util.flexibleString(out2.sql);
        if ("string" !== typeof out2.sql) {
          toss3("Missing SQL argument or unsupported SQL value type.");
        }
        const opt = out2.opt;
        switch (opt.returnValue) {
          case "resultRows":
            if (!opt.resultRows) opt.resultRows = [];
            out2.returnVal = () => opt.resultRows;
            break;
          case "saveSql":
            if (!opt.saveSql) opt.saveSql = [];
            out2.returnVal = () => opt.saveSql;
            break;
          case void 0:
          case "this":
            out2.returnVal = () => db;
            break;
          default:
            toss3("Invalid returnValue value:", opt.returnValue);
        }
        if (!opt.callback && !opt.returnValue && void 0 !== opt.rowMode) {
          if (!opt.resultRows) opt.resultRows = [];
          out2.returnVal = () => opt.resultRows;
        }
        if (opt.callback || opt.resultRows) {
          switch (void 0 === opt.rowMode ? "array" : opt.rowMode) {
            case "object":
              out2.cbArg = (stmt, cache) => {
                if (!cache.columnNames)
                  cache.columnNames = stmt.getColumnNames([]);
                const row = stmt.get([]);
                const rv = /* @__PURE__ */ Object.create(null);
                for (const i in cache.columnNames)
                  rv[cache.columnNames[i]] = row[i];
                return rv;
              };
              break;
            case "array":
              out2.cbArg = (stmt) => stmt.get([]);
              break;
            case "stmt":
              if (Array.isArray(opt.resultRows)) {
                toss3(
                  "exec(): invalid rowMode for a resultRows array: must",
                  "be one of 'array', 'object',",
                  "a result column number, or column name reference."
                );
              }
              out2.cbArg = (stmt) => stmt;
              break;
            default:
              if (util.isInt32(opt.rowMode)) {
                out2.cbArg = (stmt) => stmt.get(opt.rowMode);
                break;
              } else if ("string" === typeof opt.rowMode && opt.rowMode.length > 1 && "$" === opt.rowMode[0]) {
                const $colName = opt.rowMode.substr(1);
                out2.cbArg = (stmt) => {
                  const rc = stmt.get(/* @__PURE__ */ Object.create(null))[$colName];
                  return void 0 === rc ? toss3(
                    capi.SQLITE_NOTFOUND,
                    "exec(): unknown result column:",
                    $colName
                  ) : rc;
                };
                break;
              }
              toss3("Invalid rowMode:", opt.rowMode);
          }
        }
        return out2;
      };
      const __selectFirstRow = (db, sql, bind, ...getArgs) => {
        const stmt = db.prepare(sql);
        try {
          const rc = stmt.bind(bind).step() ? stmt.get(...getArgs) : void 0;
          stmt.reset();
          return rc;
        } finally {
          stmt.finalize();
        }
      };
      const __selectAll = (db, sql, bind, rowMode) => db.exec({
        sql,
        bind,
        rowMode,
        returnValue: "resultRows"
      });
      DB.checkRc = (db, resultCode) => checkSqlite3Rc(db, resultCode);
      DB.prototype = {
        isOpen: function() {
          return !!this.pointer;
        },
        affirmOpen: function() {
          return affirmDbOpen(this);
        },
        close: function() {
          const pDb2 = this.pointer;
          if (pDb2) {
            if (this.onclose && this.onclose.before instanceof Function) {
              try {
                this.onclose.before(this);
              } catch (e) {
              }
            }
            Object.keys(__stmtMap.get(this)).forEach((k, s) => {
              if (s && s.pointer) {
                try {
                  s.finalize();
                } catch (e) {
                }
              }
            });
            __ptrMap.delete(this);
            __stmtMap.delete(this);
            if (!__doesNotOwnHandle.delete(this)) {
              capi.sqlite3_close_v2(pDb2);
            }
            if (this.onclose && this.onclose.after instanceof Function) {
              try {
                this.onclose.after(this);
              } catch (e) {
              }
            }
            delete this.filename;
          }
        },
        changes: function(total = false, sixtyFour = false) {
          const p = affirmDbOpen(this).pointer;
          if (total) {
            return sixtyFour ? capi.sqlite3_total_changes64(p) : capi.sqlite3_total_changes(p);
          } else {
            return sixtyFour ? capi.sqlite3_changes64(p) : capi.sqlite3_changes(p);
          }
        },
        dbFilename: function(dbName = "main") {
          return capi.sqlite3_db_filename(affirmDbOpen(this).pointer, dbName);
        },
        dbName: function(dbNumber = 0) {
          return capi.sqlite3_db_name(affirmDbOpen(this).pointer, dbNumber);
        },
        dbVfsName: function(dbName = 0) {
          let rc;
          const pVfs = capi.sqlite3_js_db_vfs(
            affirmDbOpen(this).pointer,
            dbName
          );
          if (pVfs) {
            const v2 = new capi.sqlite3_vfs(pVfs);
            try {
              rc = wasm.cstrToJs(v2.$zName);
            } finally {
              v2.dispose();
            }
          }
          return rc;
        },
        prepare: function(sql) {
          affirmDbOpen(this);
          const stack = wasm.pstack.pointer;
          let ppStmt, pStmt;
          try {
            ppStmt = wasm.pstack.alloc(8);
            DB.checkRc(
              this,
              capi.sqlite3_prepare_v2(this.pointer, sql, -1, ppStmt, null)
            );
            pStmt = wasm.peekPtr(ppStmt);
          } finally {
            wasm.pstack.restore(stack);
          }
          if (!pStmt) toss3("Cannot prepare empty SQL.");
          const stmt = new Stmt(this, pStmt, BindTypes);
          __stmtMap.get(this)[pStmt] = stmt;
          return stmt;
        },
        exec: function() {
          affirmDbOpen(this);
          const arg = parseExecArgs(this, arguments);
          if (!arg.sql) {
            return toss3("exec() requires an SQL string.");
          }
          const opt = arg.opt;
          const callback = opt.callback;
          const resultRows = Array.isArray(opt.resultRows) ? opt.resultRows : void 0;
          let stmt;
          let bind = opt.bind;
          let evalFirstResult = !!(arg.cbArg || opt.columnNames || resultRows);
          const stack = wasm.scopedAllocPush();
          const saveSql = Array.isArray(opt.saveSql) ? opt.saveSql : void 0;
          try {
            const isTA = util.isSQLableTypedArray(arg.sql);
            let sqlByteLen = isTA ? arg.sql.byteLength : wasm.jstrlen(arg.sql);
            const ppStmt = wasm.scopedAlloc(
              2 * wasm.ptr.size + (sqlByteLen + 1)
            );
            const pzTail = wasm.ptr.add(ppStmt, wasm.ptr.size);
            let pSql = wasm.ptr.add(pzTail, wasm.ptr.size);
            const pSqlEnd = wasm.ptr.add(pSql, sqlByteLen);
            if (isTA) wasm.heap8().set(arg.sql, pSql);
            else wasm.jstrcpy(arg.sql, wasm.heap8(), pSql, sqlByteLen, false);
            wasm.poke(wasm.ptr.add(pSql, sqlByteLen), 0);
            while (pSql && wasm.peek(pSql, "i8")) {
              wasm.pokePtr([ppStmt, pzTail], 0);
              DB.checkRc(
                this,
                capi.sqlite3_prepare_v3(
                  this.pointer,
                  pSql,
                  sqlByteLen,
                  0,
                  ppStmt,
                  pzTail
                )
              );
              const pStmt = wasm.peekPtr(ppStmt);
              pSql = wasm.peekPtr(pzTail);
              sqlByteLen = Number(wasm.ptr.add(pSqlEnd, -pSql));
              if (!pStmt) continue;
              if (saveSql) saveSql.push(capi.sqlite3_sql(pStmt).trim());
              stmt = new Stmt(this, pStmt, BindTypes);
              if (bind && stmt.parameterCount) {
                stmt.bind(bind);
                bind = null;
              }
              if (evalFirstResult && stmt.columnCount) {
                let gotColNames = Array.isArray(opt.columnNames) ? 0 : 1;
                evalFirstResult = false;
                if (arg.cbArg || resultRows) {
                  const cbArgCache = /* @__PURE__ */ Object.create(null);
                  for (; stmt.step(); __execLock.delete(stmt)) {
                    if (0 === gotColNames++) {
                      stmt.getColumnNames(
                        cbArgCache.columnNames = opt.columnNames || []
                      );
                    }
                    __execLock.add(stmt);
                    const row = arg.cbArg(stmt, cbArgCache);
                    if (resultRows) resultRows.push(row);
                    if (callback && false === callback.call(opt, row, stmt)) {
                      break;
                    }
                  }
                  __execLock.delete(stmt);
                }
                if (0 === gotColNames) {
                  stmt.getColumnNames(opt.columnNames);
                }
              } else {
                stmt.step();
              }
              stmt.reset().finalize();
              stmt = null;
            }
          } finally {
            wasm.scopedAllocPop(stack);
            if (stmt) {
              __execLock.delete(stmt);
              stmt.finalize();
            }
          }
          return arg.returnVal();
        },
        createFunction: function f(name, xFunc, opt) {
          const isFunc = (f2) => f2 instanceof Function;
          switch (arguments.length) {
            case 1:
              opt = name;
              name = opt.name;
              xFunc = opt.xFunc || 0;
              break;
            case 2:
              if (!isFunc(xFunc)) {
                opt = xFunc;
                xFunc = opt.xFunc || 0;
              }
              break;
            case 3:
              break;
            default:
              break;
          }
          if (!opt) opt = {};
          if ("string" !== typeof name) {
            toss3("Invalid arguments: missing function name.");
          }
          let xStep = opt.xStep || 0;
          let xFinal = opt.xFinal || 0;
          const xValue = opt.xValue || 0;
          const xInverse = opt.xInverse || 0;
          let isWindow = void 0;
          if (isFunc(xFunc)) {
            isWindow = false;
            if (isFunc(xStep) || isFunc(xFinal)) {
              toss3("Ambiguous arguments: scalar or aggregate?");
            }
            xStep = xFinal = null;
          } else if (isFunc(xStep)) {
            if (!isFunc(xFinal)) {
              toss3("Missing xFinal() callback for aggregate or window UDF.");
            }
            xFunc = null;
          } else if (isFunc(xFinal)) {
            toss3("Missing xStep() callback for aggregate or window UDF.");
          } else {
            toss3("Missing function-type properties.");
          }
          if (false === isWindow) {
            if (isFunc(xValue) || isFunc(xInverse)) {
              toss3(
                "xValue and xInverse are not permitted for non-window UDFs."
              );
            }
          } else if (isFunc(xValue)) {
            if (!isFunc(xInverse)) {
              toss3("xInverse must be provided if xValue is.");
            }
            isWindow = true;
          } else if (isFunc(xInverse)) {
            toss3("xValue must be provided if xInverse is.");
          }
          const pApp = opt.pApp;
          if (void 0 !== pApp && null !== pApp && !wasm.isPtr(pApp)) {
            toss3(
              "Invalid value for pApp property. Must be a legal WASM pointer value."
            );
          }
          const xDestroy = opt.xDestroy || 0;
          if (xDestroy && !isFunc(xDestroy)) {
            toss3("xDestroy property must be a function.");
          }
          let fFlags = 0;
          if (getOwnOption(opt, "deterministic"))
            fFlags |= capi.SQLITE_DETERMINISTIC;
          if (getOwnOption(opt, "directOnly")) fFlags |= capi.SQLITE_DIRECTONLY;
          if (getOwnOption(opt, "innocuous")) fFlags |= capi.SQLITE_INNOCUOUS;
          name = name.toLowerCase();
          const xArity = xFunc || xStep;
          const arity = getOwnOption(opt, "arity");
          const arityArg = "number" === typeof arity ? arity : xArity.length ? xArity.length - 1 : 0;
          let rc;
          if (isWindow) {
            rc = capi.sqlite3_create_window_function(
              this.pointer,
              name,
              arityArg,
              capi.SQLITE_UTF8 | fFlags,
              pApp || 0,
              xStep,
              xFinal,
              xValue,
              xInverse,
              xDestroy
            );
          } else {
            rc = capi.sqlite3_create_function_v2(
              this.pointer,
              name,
              arityArg,
              capi.SQLITE_UTF8 | fFlags,
              pApp || 0,
              xFunc,
              xStep,
              xFinal,
              xDestroy
            );
          }
          DB.checkRc(this, rc);
          return this;
        },
        selectValue: function(sql, bind, asType) {
          return __selectFirstRow(this, sql, bind, 0, asType);
        },
        selectValues: function(sql, bind, asType) {
          const stmt = this.prepare(sql), rc = [];
          try {
            stmt.bind(bind);
            while (stmt.step()) rc.push(stmt.get(0, asType));
            stmt.reset();
          } finally {
            stmt.finalize();
          }
          return rc;
        },
        selectArray: function(sql, bind) {
          return __selectFirstRow(this, sql, bind, []);
        },
        selectObject: function(sql, bind) {
          return __selectFirstRow(this, sql, bind, {});
        },
        selectArrays: function(sql, bind) {
          return __selectAll(this, sql, bind, "array");
        },
        selectObjects: function(sql, bind) {
          return __selectAll(this, sql, bind, "object");
        },
        openStatementCount: function() {
          return this.pointer ? Object.keys(__stmtMap.get(this)).length : 0;
        },
        transaction: function(callback) {
          let opener = "BEGIN";
          if (arguments.length > 1) {
            if (/[^a-zA-Z]/.test(arguments[0])) {
              toss3(
                capi.SQLITE_MISUSE,
                "Invalid argument for BEGIN qualifier."
              );
            }
            opener += " " + arguments[0];
            callback = arguments[1];
          }
          affirmDbOpen(this).exec(opener);
          try {
            const rc = callback(this);
            this.exec("COMMIT");
            return rc;
          } catch (e) {
            this.exec("ROLLBACK");
            throw e;
          }
        },
        savepoint: function(callback) {
          affirmDbOpen(this).exec("SAVEPOINT oo1");
          try {
            const rc = callback(this);
            this.exec("RELEASE oo1");
            return rc;
          } catch (e) {
            this.exec("ROLLBACK to SAVEPOINT oo1; RELEASE SAVEPOINT oo1");
            throw e;
          }
        },
        checkRc: function(resultCode) {
          return checkSqlite3Rc(this, resultCode);
        }
      };
      DB.wrapHandle = function(pDb2, takeOwnership = false) {
        if (!pDb2 || !wasm.isPtr(pDb2)) {
          throw new sqlite32.SQLite3Error(
            capi.SQLITE_MISUSE,
            "Argument must be a WASM sqlite3 pointer"
          );
        }
        return new DB({
          "sqlite3*": pDb2,
          "sqlite3*:takeOwnership": !!takeOwnership
        });
      };
      const affirmStmtOpen = function(stmt) {
        if (!stmt.pointer) toss3("Stmt has been closed.");
        return stmt;
      };
      const isSupportedBindType = function(v2) {
        let t = BindTypes[null === v2 || void 0 === v2 ? "null" : typeof v2];
        switch (t) {
          case BindTypes.boolean:
          case BindTypes.null:
          case BindTypes.number:
          case BindTypes.string:
            return t;
          case BindTypes.bigint:
            return wasm.bigIntEnabled ? t : void 0;
          default:
            return util.isBindableTypedArray(v2) ? BindTypes.blob : void 0;
        }
      };
      const affirmSupportedBindType = function(v2) {
        return isSupportedBindType(v2) || toss3("Unsupported bind() argument type:", typeof v2);
      };
      const affirmParamIndex = function(stmt, key) {
        const n = "number" === typeof key ? key : capi.sqlite3_bind_parameter_index(stmt.pointer, key);
        if (0 === n || !util.isInt32(n))
          toss3("Invalid bind() parameter name: " + key);
        else if (n < 1 || n > stmt.parameterCount)
          toss3("Bind index", key, "is out of range.");
        return n;
      };
      const __execLock = /* @__PURE__ */ new Set();
      const __stmtMayGet = /* @__PURE__ */ new Set();
      const affirmNotLockedByExec = function(stmt, currentOpName) {
        if (__execLock.has(stmt)) {
          toss3(
            "Operation is illegal when statement is locked:",
            currentOpName
          );
        }
        return stmt;
      };
      const bindOne = function f(stmt, ndx, bindType, val) {
        affirmNotLockedByExec(affirmStmtOpen(stmt), "bind()");
        if (!f._) {
          f._tooBigInt = (v2) => toss3(
            "BigInt value is too big to store without precision loss:",
            v2
          );
          f._ = {
            string: function(stmt2, ndx2, val2, asBlob) {
              const [pStr, n] = wasm.allocCString(val2, true);
              const f2 = asBlob ? capi.sqlite3_bind_blob : capi.sqlite3_bind_text;
              return f2(stmt2.pointer, ndx2, pStr, n, capi.SQLITE_WASM_DEALLOC);
            }
          };
        }
        affirmSupportedBindType(val);
        ndx = affirmParamIndex(stmt, ndx);
        let rc = 0;
        switch (null === val || void 0 === val ? BindTypes.null : bindType) {
          case BindTypes.null:
            rc = capi.sqlite3_bind_null(stmt.pointer, ndx);
            break;
          case BindTypes.string:
            rc = f._.string(stmt, ndx, val, false);
            break;
          case BindTypes.number: {
            let m;
            if (util.isInt32(val)) m = capi.sqlite3_bind_int;
            else if ("bigint" === typeof val) {
              if (!util.bigIntFits64(val)) {
                f._tooBigInt(val);
              } else if (wasm.bigIntEnabled) {
                m = capi.sqlite3_bind_int64;
              } else if (util.bigIntFitsDouble(val)) {
                val = Number(val);
                m = capi.sqlite3_bind_double;
              } else {
                f._tooBigInt(val);
              }
            } else {
              val = Number(val);
              if (wasm.bigIntEnabled && Number.isInteger(val)) {
                m = capi.sqlite3_bind_int64;
              } else {
                m = capi.sqlite3_bind_double;
              }
            }
            rc = m(stmt.pointer, ndx, val);
            break;
          }
          case BindTypes.boolean:
            rc = capi.sqlite3_bind_int(stmt.pointer, ndx, val ? 1 : 0);
            break;
          case BindTypes.blob: {
            if ("string" === typeof val) {
              rc = f._.string(stmt, ndx, val, true);
              break;
            } else if (val instanceof ArrayBuffer) {
              val = new Uint8Array(val);
            } else if (!util.isBindableTypedArray(val)) {
              toss3(
                "Binding a value as a blob requires",
                "that it be a string, Uint8Array, Int8Array, or ArrayBuffer."
              );
            }
            const pBlob = wasm.alloc(val.byteLength || 1);
            wasm.heap8().set(val.byteLength ? val : [0], Number(pBlob));
            rc = capi.sqlite3_bind_blob(
              stmt.pointer,
              ndx,
              pBlob,
              val.byteLength,
              capi.SQLITE_WASM_DEALLOC
            );
            break;
          }
          default:
            sqlite32.config.warn("Unsupported bind() argument type:", val);
            toss3("Unsupported bind() argument type: " + typeof val);
        }
        if (rc) DB.checkRc(stmt.db.pointer, rc);
        return stmt;
      };
      Stmt.prototype = {
        finalize: function() {
          const ptr = this.pointer;
          if (ptr) {
            affirmNotLockedByExec(this, "finalize()");
            const rc = __doesNotOwnHandle.delete(this) ? 0 : capi.sqlite3_finalize(ptr);
            delete __stmtMap.get(this.db)[ptr];
            __ptrMap.delete(this);
            __execLock.delete(this);
            __stmtMayGet.delete(this);
            delete this.parameterCount;
            delete this.db;
            return rc;
          }
        },
        clearBindings: function() {
          affirmNotLockedByExec(affirmStmtOpen(this), "clearBindings()");
          capi.sqlite3_clear_bindings(this.pointer);
          __stmtMayGet.delete(this);
          return this;
        },
        reset: function(alsoClearBinds) {
          affirmNotLockedByExec(this, "reset()");
          if (alsoClearBinds) this.clearBindings();
          const rc = capi.sqlite3_reset(affirmStmtOpen(this).pointer);
          __stmtMayGet.delete(this);
          checkSqlite3Rc(this.db, rc);
          return this;
        },
        bind: function() {
          affirmStmtOpen(this);
          let ndx, arg;
          switch (arguments.length) {
            case 1:
              ndx = 1;
              arg = arguments[0];
              break;
            case 2:
              ndx = arguments[0];
              arg = arguments[1];
              break;
            default:
              toss3("Invalid bind() arguments.");
          }
          if (void 0 === arg) {
            return this;
          } else if (!this.parameterCount) {
            toss3("This statement has no bindable parameters.");
          }
          __stmtMayGet.delete(this);
          if (null === arg) {
            return bindOne(this, ndx, BindTypes.null, arg);
          } else if (Array.isArray(arg)) {
            if (1 !== arguments.length) {
              toss3(
                "When binding an array, an index argument is not permitted."
              );
            }
            arg.forEach(
              (v2, i) => bindOne(this, i + 1, affirmSupportedBindType(v2), v2)
            );
            return this;
          } else if (arg instanceof ArrayBuffer) {
            arg = new Uint8Array(arg);
          }
          if ("object" === typeof arg && !util.isBindableTypedArray(arg)) {
            if (1 !== arguments.length) {
              toss3(
                "When binding an object, an index argument is not permitted."
              );
            }
            Object.keys(arg).forEach(
              (k) => bindOne(this, k, affirmSupportedBindType(arg[k]), arg[k])
            );
            return this;
          } else {
            return bindOne(this, ndx, affirmSupportedBindType(arg), arg);
          }
          toss3("Should not reach this point.");
        },
        bindAsBlob: function(ndx, arg) {
          affirmStmtOpen(this);
          if (1 === arguments.length) {
            arg = ndx;
            ndx = 1;
          }
          const t = affirmSupportedBindType(arg);
          if (BindTypes.string !== t && BindTypes.blob !== t && BindTypes.null !== t) {
            toss3("Invalid value type for bindAsBlob()");
          }
          return bindOne(this, ndx, BindTypes.blob, arg);
        },
        step: function() {
          affirmNotLockedByExec(this, "step()");
          const rc = capi.sqlite3_step(affirmStmtOpen(this).pointer);
          switch (rc) {
            case capi.SQLITE_DONE:
              __stmtMayGet.delete(this);
              return false;
            case capi.SQLITE_ROW:
              __stmtMayGet.add(this);
              return true;
            default:
              __stmtMayGet.delete(this);
              sqlite32.config.warn(
                "sqlite3_step() rc=",
                rc,
                capi.sqlite3_js_rc_str(rc),
                "SQL =",
                capi.sqlite3_sql(this.pointer)
              );
              DB.checkRc(this.db.pointer, rc);
          }
        },
        stepReset: function() {
          this.step();
          return this.reset();
        },
        stepFinalize: function() {
          try {
            const rc = this.step();
            this.reset();
            return rc;
          } finally {
            try {
              this.finalize();
            } catch (e) {
            }
          }
        },
        get: function(ndx, asType) {
          if (!__stmtMayGet.has(affirmStmtOpen(this))) {
            toss3("Stmt.step() has not (recently) returned true.");
          }
          if (Array.isArray(ndx)) {
            let i = 0;
            const n = this.columnCount;
            while (i < n) {
              ndx[i] = this.get(i++);
            }
            return ndx;
          } else if (ndx && "object" === typeof ndx) {
            let i = 0;
            const n = this.columnCount;
            while (i < n) {
              ndx[capi.sqlite3_column_name(this.pointer, i)] = this.get(i++);
            }
            return ndx;
          }
          affirmColIndex(this, ndx);
          switch (void 0 === asType ? capi.sqlite3_column_type(this.pointer, ndx) : asType) {
            case capi.SQLITE_NULL:
              return null;
            case capi.SQLITE_INTEGER: {
              if (wasm.bigIntEnabled) {
                const rc = capi.sqlite3_column_int64(this.pointer, ndx);
                if (rc >= Number.MIN_SAFE_INTEGER && rc <= Number.MAX_SAFE_INTEGER) {
                  return Number(rc).valueOf();
                }
                return rc;
              } else {
                const rc = capi.sqlite3_column_double(this.pointer, ndx);
                if (rc > Number.MAX_SAFE_INTEGER || rc < Number.MIN_SAFE_INTEGER) {
                  toss3("Integer is out of range for JS integer range: " + rc);
                }
                return util.isInt32(rc) ? rc | 0 : rc;
              }
            }
            case capi.SQLITE_FLOAT:
              return capi.sqlite3_column_double(this.pointer, ndx);
            case capi.SQLITE_TEXT:
              return capi.sqlite3_column_text(this.pointer, ndx);
            case capi.SQLITE_BLOB: {
              const n = capi.sqlite3_column_bytes(this.pointer, ndx), ptr = capi.sqlite3_column_blob(this.pointer, ndx), rc = new Uint8Array(n);
              if (n) {
                rc.set(wasm.heap8u().slice(Number(ptr), Number(ptr) + n), 0);
                if (this.db._blobXfer instanceof Array) {
                  this.db._blobXfer.push(rc.buffer);
                }
              }
              return rc;
            }
            default:
              toss3(
                "Don't know how to translate",
                "type of result column #" + ndx + "."
              );
          }
          toss3("Not reached.");
        },
        getInt: function(ndx) {
          return this.get(ndx, capi.SQLITE_INTEGER);
        },
        getFloat: function(ndx) {
          return this.get(ndx, capi.SQLITE_FLOAT);
        },
        getString: function(ndx) {
          return this.get(ndx, capi.SQLITE_TEXT);
        },
        getBlob: function(ndx) {
          return this.get(ndx, capi.SQLITE_BLOB);
        },
        getJSON: function(ndx) {
          const s = this.get(ndx, capi.SQLITE_STRING);
          return null === s ? s : JSON.parse(s);
        },
        getColumnName: function(ndx) {
          return capi.sqlite3_column_name(
            affirmColIndex(affirmStmtOpen(this), ndx).pointer,
            ndx
          );
        },
        getColumnNames: function(tgt = []) {
          affirmColIndex(affirmStmtOpen(this), 0);
          const n = this.columnCount;
          for (let i = 0; i < n; ++i) {
            tgt.push(capi.sqlite3_column_name(this.pointer, i));
          }
          return tgt;
        },
        getParamIndex: function(name) {
          return affirmStmtOpen(this).parameterCount ? capi.sqlite3_bind_parameter_index(this.pointer, name) : void 0;
        },
        getParamName: function(ndx) {
          return affirmStmtOpen(this).parameterCount ? capi.sqlite3_bind_parameter_name(this.pointer, ndx) : void 0;
        },
        isBusy: function() {
          return 0 !== capi.sqlite3_stmt_busy(affirmStmtOpen(this));
        },
        isReadOnly: function() {
          return 0 !== capi.sqlite3_stmt_readonly(affirmStmtOpen(this));
        }
      };
      {
        const prop = {
          enumerable: true,
          get: function() {
            return __ptrMap.get(this);
          },
          set: () => toss3("The pointer property is read-only.")
        };
        Object.defineProperty(Stmt.prototype, "pointer", prop);
        Object.defineProperty(DB.prototype, "pointer", prop);
      }
      Object.defineProperty(Stmt.prototype, "columnCount", {
        enumerable: false,
        get: function() {
          return capi.sqlite3_column_count(this.pointer);
        },
        set: () => toss3("The columnCount property is read-only.")
      });
      Object.defineProperty(Stmt.prototype, "parameterCount", {
        enumerable: false,
        get: function() {
          return capi.sqlite3_bind_parameter_count(this.pointer);
        },
        set: () => toss3("The parameterCount property is read-only.")
      });
      Stmt.wrapHandle = function(oo1db, pStmt, takeOwnership = false) {
        let ctor = Stmt;
        if (!(oo1db instanceof DB) || !oo1db.pointer) {
          throw new sqlite32.SQLite3Error(
            sqlite32.SQLITE_MISUSE,
            "First argument must be an opened sqlite3.oo1.DB instance"
          );
        }
        if (!pStmt || !wasm.isPtr(pStmt)) {
          throw new sqlite32.SQLite3Error(
            sqlite32.SQLITE_MISUSE,
            "Second argument must be a WASM sqlite3_stmt pointer"
          );
        }
        return new Stmt(oo1db, pStmt, BindTypes, !!takeOwnership);
      };
      sqlite32.oo1 = {
        DB,
        Stmt
      };
      if (util.isUIThread()) {
        sqlite32.oo1.JsStorageDb = function(storageName = "session") {
          const opt = dbCtorHelper.normalizeArgs(...arguments);
          storageName = opt.filename;
          if ("session" !== storageName && "local" !== storageName) {
            toss3("JsStorageDb db name must be one of 'session' or 'local'.");
          }
          opt.vfs = "kvvfs";
          dbCtorHelper.call(this, opt);
        };
        const jdb = sqlite32.oo1.JsStorageDb;
        jdb.prototype = Object.create(DB.prototype);
        jdb.clearStorage = capi.sqlite3_js_kvvfs_clear;
        jdb.prototype.clearStorage = function() {
          return jdb.clearStorage(affirmDbOpen(this).filename);
        };
        jdb.storageSize = capi.sqlite3_js_kvvfs_size;
        jdb.prototype.storageSize = function() {
          return jdb.storageSize(affirmDbOpen(this).filename);
        };
      }
    });
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      const util = sqlite32.util;
      sqlite32.initWorker1API = function() {
        "use strict";
        const toss = (...args) => {
          throw new Error(args.join(" "));
        };
        if (!(globalThis.WorkerGlobalScope instanceof Function)) {
          toss("initWorker1API() must be run from a Worker thread.");
        }
        const sqlite33 = this.sqlite3 || toss("Missing this.sqlite3 object.");
        const DB = sqlite33.oo1.DB;
        const getDbId = function(db) {
          let id = wState.idMap.get(db);
          if (id) return id;
          id = "db#" + ++wState.idSeq + ":" + Math.floor(Math.random() * 1e8) + ":" + Math.floor(Math.random() * 1e8);
          wState.idMap.set(db, id);
          return id;
        };
        const wState = {
          dbList: [],
          idSeq: 0,
          idMap: /* @__PURE__ */ new WeakMap(),
          xfer: [],
          open: function(opt) {
            const db = new DB(opt);
            this.dbs[getDbId(db)] = db;
            if (this.dbList.indexOf(db) < 0) this.dbList.push(db);
            return db;
          },
          close: function(db, alsoUnlink) {
            if (db) {
              delete this.dbs[getDbId(db)];
              const filename = db.filename;
              const pVfs = util.sqlite3__wasm_db_vfs(db.pointer, 0);
              db.close();
              const ddNdx = this.dbList.indexOf(db);
              if (ddNdx >= 0) this.dbList.splice(ddNdx, 1);
              if (alsoUnlink && filename && pVfs) {
                util.sqlite3__wasm_vfs_unlink(pVfs, filename);
              }
            }
          },
          post: function(msg, xferList) {
            if (xferList && xferList.length) {
              globalThis.postMessage(msg, Array.from(xferList));
              xferList.length = 0;
            } else {
              globalThis.postMessage(msg);
            }
          },
          dbs: /* @__PURE__ */ Object.create(null),
          getDb: function(id, require2 = true) {
            return this.dbs[id] || (require2 ? toss("Unknown (or closed) DB ID:", id) : void 0);
          }
        };
        const affirmDbOpen = function(db = wState.dbList[0]) {
          return db && db.pointer ? db : toss("DB is not opened.");
        };
        const getMsgDb = function(msgData, affirmExists = true) {
          const db = wState.getDb(msgData.dbId, false) || wState.dbList[0];
          return affirmExists ? affirmDbOpen(db) : db;
        };
        const getDefaultDbId = function() {
          return wState.dbList[0] && getDbId(wState.dbList[0]);
        };
        const isSpecialDbFilename = (n) => {
          return "" === n || ":" === n[0];
        };
        const wMsgHandler = {
          open: function(ev) {
            const oargs = /* @__PURE__ */ Object.create(null), args = ev.args || /* @__PURE__ */ Object.create(null);
            if (args.simulateError) {
              toss("Throwing because of simulateError flag.");
            }
            const rc = /* @__PURE__ */ Object.create(null);
            oargs.vfs = args.vfs;
            oargs.filename = args.filename || "";
            const db = wState.open(oargs);
            rc.filename = db.filename;
            rc.persistent = !!sqlite33.capi.sqlite3_js_db_uses_vfs(
              db.pointer,
              "opfs"
            );
            rc.dbId = getDbId(db);
            rc.vfs = db.dbVfsName();
            return rc;
          },
          close: function(ev) {
            const db = getMsgDb(ev, false);
            const response = {
              filename: db && db.filename
            };
            if (db) {
              const doUnlink = ev.args && "object" === typeof ev.args ? !!ev.args.unlink : false;
              wState.close(db, doUnlink);
            }
            return response;
          },
          exec: function(ev) {
            const rc = "string" === typeof ev.args ? { sql: ev.args } : ev.args || /* @__PURE__ */ Object.create(null);
            if ("stmt" === rc.rowMode) {
              toss(
                "Invalid rowMode for 'exec': stmt mode",
                "does not work in the Worker API."
              );
            } else if (!rc.sql) {
              toss("'exec' requires input SQL.");
            }
            const db = getMsgDb(ev);
            if (rc.callback || Array.isArray(rc.resultRows)) {
              db._blobXfer = wState.xfer;
            }
            const theCallback = rc.callback;
            let rowNumber = 0;
            const hadColNames = !!rc.columnNames;
            if ("string" === typeof theCallback) {
              if (!hadColNames) rc.columnNames = [];
              rc.callback = function(row, stmt) {
                wState.post(
                  {
                    type: theCallback,
                    columnNames: rc.columnNames,
                    rowNumber: ++rowNumber,
                    row
                  },
                  wState.xfer
                );
              };
            }
            try {
              const changeCount = !!rc.countChanges ? db.changes(true, 64 === rc.countChanges) : void 0;
              db.exec(rc);
              if (void 0 !== changeCount) {
                rc.changeCount = db.changes(true, 64 === rc.countChanges) - changeCount;
              }
              const lastInsertRowId = !!rc.lastInsertRowId ? sqlite33.capi.sqlite3_last_insert_rowid(db) : void 0;
              if (void 0 !== lastInsertRowId) {
                rc.lastInsertRowId = lastInsertRowId;
              }
              if (rc.callback instanceof Function) {
                rc.callback = theCallback;
                wState.post({
                  type: theCallback,
                  columnNames: rc.columnNames,
                  rowNumber: null,
                  row: void 0
                });
              }
            } finally {
              delete db._blobXfer;
              if (rc.callback) rc.callback = theCallback;
            }
            return rc;
          },
          "config-get": function() {
            const rc = /* @__PURE__ */ Object.create(null), src = sqlite33.config;
            ["bigIntEnabled"].forEach(function(k) {
              if (Object.getOwnPropertyDescriptor(src, k)) rc[k] = src[k];
            });
            rc.version = sqlite33.version;
            rc.vfsList = sqlite33.capi.sqlite3_js_vfs_list();
            return rc;
          },
          export: function(ev) {
            const db = getMsgDb(ev);
            const response = {
              byteArray: sqlite33.capi.sqlite3_js_db_export(db.pointer),
              filename: db.filename,
              mimetype: "application/x-sqlite3"
            };
            wState.xfer.push(response.byteArray.buffer);
            return response;
          },
          toss: function(ev) {
            toss("Testing worker exception");
          }
        };
        globalThis.onmessage = async function(ev) {
          ev = ev.data;
          let result, dbId = ev.dbId, evType = ev.type;
          const arrivalTime = performance.now();
          try {
            if (wMsgHandler.hasOwnProperty(evType) && wMsgHandler[evType] instanceof Function) {
              result = await wMsgHandler[evType](ev);
            } else {
              toss("Unknown db worker message type:", ev.type);
            }
          } catch (err2) {
            evType = "error";
            result = {
              operation: ev.type,
              message: err2.message,
              errorClass: err2.name,
              input: ev
            };
            if (err2.stack) {
              result.stack = "string" === typeof err2.stack ? err2.stack.split(/\\n\\s*/) : err2.stack;
            }
            if (0)
              sqlite33.config.warn(
                "Worker is propagating an exception to main thread.",
                "Reporting it _here_ for the stack trace:",
                err2,
                result
              );
          }
          if (!dbId) {
            dbId = result.dbId || getDefaultDbId();
          }
          wState.post(
            {
              type: evType,
              dbId,
              messageId: ev.messageId,
              workerReceivedTime: arrivalTime,
              workerRespondTime: performance.now(),
              departureTime: ev.departureTime,
              result
            },
            wState.xfer
          );
        };
        globalThis.postMessage({
          type: "sqlite3-api",
          result: "worker1-ready"
        });
      }.bind({ sqlite3: sqlite32 });
    });
    "use strict";
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      const wasm = sqlite32.wasm, capi = sqlite32.capi, toss = sqlite32.util.toss3;
      const vfs = /* @__PURE__ */ Object.create(null);
      sqlite32.vfs = vfs;
      capi.sqlite3_vfs.prototype.registerVfs = function(asDefault = false) {
        if (!(this instanceof sqlite32.capi.sqlite3_vfs)) {
          toss("Expecting a sqlite3_vfs-type argument.");
        }
        const rc = capi.sqlite3_vfs_register(this, asDefault ? 1 : 0);
        if (rc) {
          toss("sqlite3_vfs_register(", this, ") failed with rc", rc);
        }
        if (this.pointer !== capi.sqlite3_vfs_find(this.$zName)) {
          toss(
            "BUG: sqlite3_vfs_find(vfs.$zName) failed for just-installed VFS",
            this
          );
        }
        return this;
      };
      vfs.installVfs = function(opt) {
        let count = 0;
        const propList = ["io", "vfs"];
        for (const key of propList) {
          const o = opt[key];
          if (o) {
            ++count;
            o.struct.installMethods(o.methods, !!o.applyArgcCheck);
            if ("vfs" === key) {
              if (!o.struct.$zName && "string" === typeof o.name) {
                o.struct.addOnDispose(
                  o.struct.$zName = wasm.allocCString(o.name)
                );
              }
              o.struct.registerVfs(!!o.asDefault);
            }
          }
        }
        if (!count)
          toss(
            "Misuse: installVfs() options object requires at least",
            "one of:",
            propList
          );
        return this;
      };
    });
    "use strict";
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      if (!sqlite32.wasm.exports.sqlite3_declare_vtab) {
        return;
      }
      const wasm = sqlite32.wasm, capi = sqlite32.capi, toss = sqlite32.util.toss3;
      const vtab = /* @__PURE__ */ Object.create(null);
      sqlite32.vtab = vtab;
      const sii = capi.sqlite3_index_info;
      sii.prototype.nthConstraint = function(n, asPtr = false) {
        if (n < 0 || n >= this.$nConstraint) return false;
        const ptr = wasm.ptr.add(
          this.$aConstraint,
          sii.sqlite3_index_constraint.structInfo.sizeof * n
        );
        return asPtr ? ptr : new sii.sqlite3_index_constraint(ptr);
      };
      sii.prototype.nthConstraintUsage = function(n, asPtr = false) {
        if (n < 0 || n >= this.$nConstraint) return false;
        const ptr = wasm.ptr.add(
          this.$aConstraintUsage,
          sii.sqlite3_index_constraint_usage.structInfo.sizeof * n
        );
        return asPtr ? ptr : new sii.sqlite3_index_constraint_usage(ptr);
      };
      sii.prototype.nthOrderBy = function(n, asPtr = false) {
        if (n < 0 || n >= this.$nOrderBy) return false;
        const ptr = wasm.ptr.add(
          this.$aOrderBy,
          sii.sqlite3_index_orderby.structInfo.sizeof * n
        );
        return asPtr ? ptr : new sii.sqlite3_index_orderby(ptr);
      };
      const __xWrapFactory = function(methodName, StructType) {
        return function(ptr, removeMapping = false) {
          if (0 === arguments.length) ptr = new StructType();
          if (ptr instanceof StructType) {
            this.set(ptr.pointer, ptr);
            return ptr;
          } else if (!wasm.isPtr(ptr)) {
            sqlite32.SQLite3Error.toss("Invalid argument to", methodName + "()");
          }
          let rc = this.get(ptr);
          if (removeMapping) this.delete(ptr);
          return rc;
        }.bind(/* @__PURE__ */ new Map());
      };
      const StructPtrMapper = function(name, StructType) {
        const __xWrap = __xWrapFactory(name, StructType);
        return Object.assign(/* @__PURE__ */ Object.create(null), {
          StructType,
          create: (ppOut) => {
            const rc = __xWrap();
            wasm.pokePtr(ppOut, rc.pointer);
            return rc;
          },
          get: (pCObj) => __xWrap(pCObj),
          unget: (pCObj) => __xWrap(pCObj, true),
          dispose: (pCObj) => {
            const o = __xWrap(pCObj, true);
            if (o) o.dispose();
          }
        });
      };
      vtab.xVtab = StructPtrMapper("xVtab", capi.sqlite3_vtab);
      vtab.xCursor = StructPtrMapper("xCursor", capi.sqlite3_vtab_cursor);
      vtab.xIndexInfo = (pIdxInfo) => new capi.sqlite3_index_info(pIdxInfo);
      vtab.xError = function f(methodName, err2, defaultRc) {
        if (f.errorReporter instanceof Function) {
          try {
            f.errorReporter(
              "sqlite3_module::" + methodName + "(): " + err2.message
            );
          } catch (e) {
          }
        }
        let rc;
        if (err2 instanceof sqlite32.WasmAllocError) rc = capi.SQLITE_NOMEM;
        else if (arguments.length > 2) rc = defaultRc;
        else if (err2 instanceof sqlite32.SQLite3Error) rc = err2.resultCode;
        return rc || capi.SQLITE_ERROR;
      };
      vtab.xError.errorReporter = 1 ? sqlite32.config.error.bind(sqlite32.config) : false;
      vtab.xRowid = (ppRowid64, value) => wasm.poke(ppRowid64, value, "i64");
      vtab.setupModule = function(opt) {
        let createdMod = false;
        const mod = this instanceof capi.sqlite3_module ? this : opt.struct || (createdMod = new capi.sqlite3_module());
        try {
          const methods = opt.methods || toss("Missing 'methods' object.");
          for (const e of Object.entries({
            xConnect: "xCreate",
            xDisconnect: "xDestroy"
          })) {
            const k = e[0], v2 = e[1];
            if (true === methods[k]) methods[k] = methods[v2];
            else if (true === methods[v2]) methods[v2] = methods[k];
          }
          if (opt.catchExceptions) {
            const fwrap = function(methodName, func) {
              if (["xConnect", "xCreate"].indexOf(methodName) >= 0) {
                return function(pDb2, pAux, argc, argv, ppVtab, pzErr) {
                  try {
                    return func(...arguments) || 0;
                  } catch (e) {
                    if (!(e instanceof sqlite32.WasmAllocError)) {
                      wasm.dealloc(wasm.peekPtr(pzErr));
                      wasm.pokePtr(pzErr, wasm.allocCString(e.message));
                    }
                    return vtab.xError(methodName, e);
                  }
                };
              } else {
                return function(...args) {
                  try {
                    return func(...args) || 0;
                  } catch (e) {
                    return vtab.xError(methodName, e);
                  }
                };
              }
            };
            const mnames = [
              "xCreate",
              "xConnect",
              "xBestIndex",
              "xDisconnect",
              "xDestroy",
              "xOpen",
              "xClose",
              "xFilter",
              "xNext",
              "xEof",
              "xColumn",
              "xRowid",
              "xUpdate",
              "xBegin",
              "xSync",
              "xCommit",
              "xRollback",
              "xFindFunction",
              "xRename",
              "xSavepoint",
              "xRelease",
              "xRollbackTo",
              "xShadowName"
            ];
            const remethods = /* @__PURE__ */ Object.create(null);
            for (const k of mnames) {
              const m = methods[k];
              if (!(m instanceof Function)) continue;
              else if ("xConnect" === k && methods.xCreate === m) {
                remethods[k] = methods.xCreate;
              } else if ("xCreate" === k && methods.xConnect === m) {
                remethods[k] = methods.xConnect;
              } else {
                remethods[k] = fwrap(k, m);
              }
            }
            mod.installMethods(remethods, false);
          } else {
            mod.installMethods(methods, !!opt.applyArgcCheck);
          }
          if (0 === mod.$iVersion) {
            let v2;
            if ("number" === typeof opt.iVersion) v2 = opt.iVersion;
            else if (mod.$xIntegrity) v2 = 4;
            else if (mod.$xShadowName) v2 = 3;
            else if (mod.$xSavePoint || mod.$xRelease || mod.$xRollbackTo)
              v2 = 2;
            else v2 = 1;
            mod.$iVersion = v2;
          }
        } catch (e) {
          if (createdMod) createdMod.dispose();
          throw e;
        }
        return mod;
      };
      capi.sqlite3_module.prototype.setupModule = function(opt) {
        return vtab.setupModule.call(this, opt);
      };
    });
    "use strict";
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      const installOpfsVfs = function callee3(options) {
        if (!globalThis.SharedArrayBuffer || !globalThis.Atomics) {
          return Promise.reject(
            new Error(
              "Cannot install OPFS: Missing SharedArrayBuffer and/or Atomics. The server must emit the COOP/COEP response headers to enable those. See https://sqlite.org/wasm/doc/trunk/persistence.md#coop-coep"
            )
          );
        } else if ("undefined" === typeof WorkerGlobalScope) {
          return Promise.reject(
            new Error(
              "The OPFS sqlite3_vfs cannot run in the main thread because it requires Atomics.wait()."
            )
          );
        } else if (!globalThis.FileSystemHandle || !globalThis.FileSystemDirectoryHandle || !globalThis.FileSystemFileHandle || !globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle || !navigator?.storage?.getDirectory) {
          return Promise.reject(new Error("Missing required OPFS APIs."));
        }
        if (!options || "object" !== typeof options) {
          options = /* @__PURE__ */ Object.create(null);
        }
        const urlParams = new URL(globalThis.location.href).searchParams;
        if (urlParams.has("opfs-disable")) {
          return Promise.resolve(sqlite32);
        }
        if (void 0 === options.verbose) {
          options.verbose = urlParams.has("opfs-verbose") ? +urlParams.get("opfs-verbose") || 2 : 1;
        }
        if (void 0 === options.sanityChecks) {
          options.sanityChecks = urlParams.has("opfs-sanity-check");
        }
        if (void 0 === options.proxyUri) {
          options.proxyUri = callee3.defaultProxyUri;
        }
        if ("function" === typeof options.proxyUri) {
          options.proxyUri = options.proxyUri();
        }
        const thePromise = new Promise(function(promiseResolve_, promiseReject_) {
          const loggers = [
            sqlite32.config.error,
            sqlite32.config.warn,
            sqlite32.config.log
          ];
          const logImpl = (level, ...args) => {
            if (options.verbose > level)
              loggers[level]("OPFS syncer:", ...args);
          };
          const log = (...args) => logImpl(2, ...args);
          const warn = (...args) => logImpl(1, ...args);
          const error = (...args) => logImpl(0, ...args);
          const toss = sqlite32.util.toss;
          const capi = sqlite32.capi;
          const util = sqlite32.util;
          const wasm = sqlite32.wasm;
          const sqlite3_vfs = capi.sqlite3_vfs;
          const sqlite3_file = capi.sqlite3_file;
          const sqlite3_io_methods = capi.sqlite3_io_methods;
          const opfsUtil = /* @__PURE__ */ Object.create(null);
          const thisThreadHasOPFS = () => {
            return globalThis.FileSystemHandle && globalThis.FileSystemDirectoryHandle && globalThis.FileSystemFileHandle && globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle && navigator?.storage?.getDirectory;
          };
          opfsUtil.metrics = {
            dump: function() {
              let k, n = 0, t = 0, w = 0;
              for (k in state.opIds) {
                const m = metrics[k];
                n += m.count;
                t += m.time;
                w += m.wait;
                m.avgTime = m.count && m.time ? m.time / m.count : 0;
                m.avgWait = m.count && m.wait ? m.wait / m.count : 0;
              }
              sqlite32.config.log(
                globalThis.location.href,
                "metrics for",
                globalThis.location.href,
                ":",
                metrics,
                "\\nTotal of",
                n,
                "op(s) for",
                t,
                "ms (incl. " + w + " ms of waiting on the async side)"
              );
              sqlite32.config.log("Serialization metrics:", metrics.s11n);
              W.postMessage({ type: "opfs-async-metrics" });
            },
            reset: function() {
              let k;
              const r = (m) => m.count = m.time = m.wait = 0;
              for (k in state.opIds) {
                r(metrics[k] = /* @__PURE__ */ Object.create(null));
              }
              let s = metrics.s11n = /* @__PURE__ */ Object.create(null);
              s = s.serialize = /* @__PURE__ */ Object.create(null);
              s.count = s.time = 0;
              s = metrics.s11n.deserialize = /* @__PURE__ */ Object.create(null);
              s.count = s.time = 0;
            }
          };
          const opfsIoMethods = new sqlite3_io_methods();
          const opfsVfs = new sqlite3_vfs().addOnDispose(
            () => opfsIoMethods.dispose()
          );
          let promiseWasRejected = void 0;
          const promiseReject = (err2) => {
            promiseWasRejected = true;
            opfsVfs.dispose();
            return promiseReject_(err2);
          };
          const promiseResolve = () => {
            promiseWasRejected = false;
            return promiseResolve_(sqlite32);
          };
          const W = new Worker(new URL(options.proxyUri, import.meta.url));
          setTimeout(() => {
            if (void 0 === promiseWasRejected) {
              promiseReject(
                new Error("Timeout while waiting for OPFS async proxy worker.")
              );
            }
          }, 4e3);
          W._originalOnError = W.onerror;
          W.onerror = function(err2) {
            error("Error initializing OPFS asyncer:", err2);
            promiseReject(
              new Error(
                "Loading OPFS async Worker failed for unknown reasons."
              )
            );
          };
          const pDVfs = capi.sqlite3_vfs_find(null);
          const dVfs = pDVfs ? new sqlite3_vfs(pDVfs) : null;
          opfsIoMethods.$iVersion = 1;
          opfsVfs.$iVersion = 2;
          opfsVfs.$szOsFile = capi.sqlite3_file.structInfo.sizeof;
          opfsVfs.$mxPathname = 1024;
          opfsVfs.$zName = wasm.allocCString("opfs");
          opfsVfs.$xDlOpen = opfsVfs.$xDlError = opfsVfs.$xDlSym = opfsVfs.$xDlClose = null;
          opfsVfs.addOnDispose(
            "$zName",
            opfsVfs.$zName,
            "cleanup default VFS wrapper",
            () => dVfs ? dVfs.dispose() : null
          );
          const state = /* @__PURE__ */ Object.create(null);
          state.verbose = options.verbose;
          state.littleEndian = (() => {
            const buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true);
            return new Int16Array(buffer)[0] === 256;
          })();
          state.asyncIdleWaitTime = 150;
          state.asyncS11nExceptions = 1;
          state.fileBufferSize = 1024 * 64;
          state.sabS11nOffset = state.fileBufferSize;
          state.sabS11nSize = opfsVfs.$mxPathname * 2;
          state.sabIO = new SharedArrayBuffer(
            state.fileBufferSize + state.sabS11nSize
          );
          state.opIds = /* @__PURE__ */ Object.create(null);
          const metrics = /* @__PURE__ */ Object.create(null);
          {
            let i = 0;
            state.opIds.whichOp = i++;
            state.opIds.rc = i++;
            state.opIds.xAccess = i++;
            state.opIds.xClose = i++;
            state.opIds.xDelete = i++;
            state.opIds.xDeleteNoWait = i++;
            state.opIds.xFileSize = i++;
            state.opIds.xLock = i++;
            state.opIds.xOpen = i++;
            state.opIds.xRead = i++;
            state.opIds.xSleep = i++;
            state.opIds.xSync = i++;
            state.opIds.xTruncate = i++;
            state.opIds.xUnlock = i++;
            state.opIds.xWrite = i++;
            state.opIds.mkdir = i++;
            state.opIds["opfs-async-metrics"] = i++;
            state.opIds["opfs-async-shutdown"] = i++;
            state.opIds.retry = i++;
            state.sabOP = new SharedArrayBuffer(i * 4);
            opfsUtil.metrics.reset();
          }
          state.sq3Codes = /* @__PURE__ */ Object.create(null);
          [
            "SQLITE_ACCESS_EXISTS",
            "SQLITE_ACCESS_READWRITE",
            "SQLITE_BUSY",
            "SQLITE_CANTOPEN",
            "SQLITE_ERROR",
            "SQLITE_IOERR",
            "SQLITE_IOERR_ACCESS",
            "SQLITE_IOERR_CLOSE",
            "SQLITE_IOERR_DELETE",
            "SQLITE_IOERR_FSYNC",
            "SQLITE_IOERR_LOCK",
            "SQLITE_IOERR_READ",
            "SQLITE_IOERR_SHORT_READ",
            "SQLITE_IOERR_TRUNCATE",
            "SQLITE_IOERR_UNLOCK",
            "SQLITE_IOERR_WRITE",
            "SQLITE_LOCK_EXCLUSIVE",
            "SQLITE_LOCK_NONE",
            "SQLITE_LOCK_PENDING",
            "SQLITE_LOCK_RESERVED",
            "SQLITE_LOCK_SHARED",
            "SQLITE_LOCKED",
            "SQLITE_MISUSE",
            "SQLITE_NOTFOUND",
            "SQLITE_OPEN_CREATE",
            "SQLITE_OPEN_DELETEONCLOSE",
            "SQLITE_OPEN_MAIN_DB",
            "SQLITE_OPEN_READONLY"
          ].forEach((k) => {
            if (void 0 === (state.sq3Codes[k] = capi[k])) {
              toss("Maintenance required: not found:", k);
            }
          });
          state.opfsFlags = Object.assign(/* @__PURE__ */ Object.create(null), {
            OPFS_UNLOCK_ASAP: 1,
            OPFS_UNLINK_BEFORE_OPEN: 2,
            defaultUnlockAsap: false
          });
          const opRun = (op, ...args) => {
            const opNdx = state.opIds[op] || toss("Invalid op ID:", op);
            state.s11n.serialize(...args);
            Atomics.store(state.sabOPView, state.opIds.rc, -1);
            Atomics.store(state.sabOPView, state.opIds.whichOp, opNdx);
            Atomics.notify(state.sabOPView, state.opIds.whichOp);
            const t = performance.now();
            while ("not-equal" !== Atomics.wait(state.sabOPView, state.opIds.rc, -1)) {
            }
            const rc = Atomics.load(state.sabOPView, state.opIds.rc);
            metrics[op].wait += performance.now() - t;
            if (rc && state.asyncS11nExceptions) {
              const err2 = state.s11n.deserialize();
              if (err2) error(op + "() async error:", ...err2);
            }
            return rc;
          };
          opfsUtil.debug = {
            asyncShutdown: () => {
              warn(
                "Shutting down OPFS async listener. The OPFS VFS will no longer work."
              );
              opRun("opfs-async-shutdown");
            },
            asyncRestart: () => {
              warn(
                "Attempting to restart OPFS VFS async listener. Might work, might not."
              );
              W.postMessage({ type: "opfs-async-restart" });
            }
          };
          const initS11n = () => {
            if (state.s11n) return state.s11n;
            const textDecoder = new TextDecoder(), textEncoder = new TextEncoder("utf-8"), viewU8 = new Uint8Array(
              state.sabIO,
              state.sabS11nOffset,
              state.sabS11nSize
            ), viewDV = new DataView(
              state.sabIO,
              state.sabS11nOffset,
              state.sabS11nSize
            );
            state.s11n = /* @__PURE__ */ Object.create(null);
            const TypeIds = /* @__PURE__ */ Object.create(null);
            TypeIds.number = {
              id: 1,
              size: 8,
              getter: "getFloat64",
              setter: "setFloat64"
            };
            TypeIds.bigint = {
              id: 2,
              size: 8,
              getter: "getBigInt64",
              setter: "setBigInt64"
            };
            TypeIds.boolean = {
              id: 3,
              size: 4,
              getter: "getInt32",
              setter: "setInt32"
            };
            TypeIds.string = { id: 4 };
            const getTypeId = (v2) => TypeIds[typeof v2] || toss(
              "Maintenance required: this value type cannot be serialized.",
              v2
            );
            const getTypeIdById = (tid) => {
              switch (tid) {
                case TypeIds.number.id:
                  return TypeIds.number;
                case TypeIds.bigint.id:
                  return TypeIds.bigint;
                case TypeIds.boolean.id:
                  return TypeIds.boolean;
                case TypeIds.string.id:
                  return TypeIds.string;
                default:
                  toss("Invalid type ID:", tid);
              }
            };
            state.s11n.deserialize = function(clear = false) {
              ++metrics.s11n.deserialize.count;
              const t = performance.now();
              const argc = viewU8[0];
              const rc = argc ? [] : null;
              if (argc) {
                const typeIds = [];
                let offset = 1, i, n, v2;
                for (i = 0; i < argc; ++i, ++offset) {
                  typeIds.push(getTypeIdById(viewU8[offset]));
                }
                for (i = 0; i < argc; ++i) {
                  const t2 = typeIds[i];
                  if (t2.getter) {
                    v2 = viewDV[t2.getter](offset, state.littleEndian);
                    offset += t2.size;
                  } else {
                    n = viewDV.getInt32(offset, state.littleEndian);
                    offset += 4;
                    v2 = textDecoder.decode(viewU8.slice(offset, offset + n));
                    offset += n;
                  }
                  rc.push(v2);
                }
              }
              if (clear) viewU8[0] = 0;
              metrics.s11n.deserialize.time += performance.now() - t;
              return rc;
            };
            state.s11n.serialize = function(...args) {
              const t = performance.now();
              ++metrics.s11n.serialize.count;
              if (args.length) {
                const typeIds = [];
                let i = 0, offset = 1;
                viewU8[0] = args.length & 255;
                for (; i < args.length; ++i, ++offset) {
                  typeIds.push(getTypeId(args[i]));
                  viewU8[offset] = typeIds[i].id;
                }
                for (i = 0; i < args.length; ++i) {
                  const t2 = typeIds[i];
                  if (t2.setter) {
                    viewDV[t2.setter](offset, args[i], state.littleEndian);
                    offset += t2.size;
                  } else {
                    const s = textEncoder.encode(args[i]);
                    viewDV.setInt32(offset, s.byteLength, state.littleEndian);
                    offset += 4;
                    viewU8.set(s, offset);
                    offset += s.byteLength;
                  }
                }
              } else {
                viewU8[0] = 0;
              }
              metrics.s11n.serialize.time += performance.now() - t;
            };
            return state.s11n;
          };
          const randomFilename = function f(len = 16) {
            if (!f._chars) {
              f._chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012346789";
              f._n = f._chars.length;
            }
            const a = [];
            let i = 0;
            for (; i < len; ++i) {
              const ndx = Math.random() * (f._n * 64) % f._n | 0;
              a[i] = f._chars[ndx];
            }
            return a.join("");
          };
          const __openFiles = /* @__PURE__ */ Object.create(null);
          const opTimer = /* @__PURE__ */ Object.create(null);
          opTimer.op = void 0;
          opTimer.start = void 0;
          const mTimeStart = (op) => {
            opTimer.start = performance.now();
            opTimer.op = op;
            ++metrics[op].count;
          };
          const mTimeEnd = () => metrics[opTimer.op].time += performance.now() - opTimer.start;
          const ioSyncWrappers = {
            xCheckReservedLock: function(pFile, pOut) {
              wasm.poke(pOut, 0, "i32");
              return 0;
            },
            xClose: function(pFile) {
              mTimeStart("xClose");
              let rc = 0;
              const f = __openFiles[pFile];
              if (f) {
                delete __openFiles[pFile];
                rc = opRun("xClose", pFile);
                if (f.sq3File) f.sq3File.dispose();
              }
              mTimeEnd();
              return rc;
            },
            xDeviceCharacteristics: function(pFile) {
              return capi.SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN;
            },
            xFileControl: function(pFile, opId, pArg) {
              return capi.SQLITE_NOTFOUND;
            },
            xFileSize: function(pFile, pSz64) {
              mTimeStart("xFileSize");
              let rc = opRun("xFileSize", pFile);
              if (0 == rc) {
                try {
                  const sz = state.s11n.deserialize()[0];
                  wasm.poke(pSz64, sz, "i64");
                } catch (e) {
                  error("Unexpected error reading xFileSize() result:", e);
                  rc = state.sq3Codes.SQLITE_IOERR;
                }
              }
              mTimeEnd();
              return rc;
            },
            xLock: function(pFile, lockType) {
              mTimeStart("xLock");
              const f = __openFiles[pFile];
              let rc = 0;
              if (!f.lockType) {
                rc = opRun("xLock", pFile, lockType);
                if (0 === rc) f.lockType = lockType;
              } else {
                f.lockType = lockType;
              }
              mTimeEnd();
              return rc;
            },
            xRead: function(pFile, pDest, n, offset64) {
              mTimeStart("xRead");
              const f = __openFiles[pFile];
              let rc;
              try {
                rc = opRun("xRead", pFile, n, Number(offset64));
                if (0 === rc || capi.SQLITE_IOERR_SHORT_READ === rc) {
                  wasm.heap8u().set(f.sabView.subarray(0, n), Number(pDest));
                }
              } catch (e) {
                error("xRead(", arguments, ") failed:", e, f);
                rc = capi.SQLITE_IOERR_READ;
              }
              mTimeEnd();
              return rc;
            },
            xSync: function(pFile, flags) {
              mTimeStart("xSync");
              ++metrics.xSync.count;
              const rc = opRun("xSync", pFile, flags);
              mTimeEnd();
              return rc;
            },
            xTruncate: function(pFile, sz64) {
              mTimeStart("xTruncate");
              const rc = opRun("xTruncate", pFile, Number(sz64));
              mTimeEnd();
              return rc;
            },
            xUnlock: function(pFile, lockType) {
              mTimeStart("xUnlock");
              const f = __openFiles[pFile];
              let rc = 0;
              if (capi.SQLITE_LOCK_NONE === lockType && f.lockType) {
                rc = opRun("xUnlock", pFile, lockType);
              }
              if (0 === rc) f.lockType = lockType;
              mTimeEnd();
              return rc;
            },
            xWrite: function(pFile, pSrc, n, offset64) {
              mTimeStart("xWrite");
              const f = __openFiles[pFile];
              let rc;
              try {
                f.sabView.set(
                  wasm.heap8u().subarray(Number(pSrc), Number(pSrc) + n)
                );
                rc = opRun("xWrite", pFile, n, Number(offset64));
              } catch (e) {
                error("xWrite(", arguments, ") failed:", e, f);
                rc = capi.SQLITE_IOERR_WRITE;
              }
              mTimeEnd();
              return rc;
            }
          };
          const vfsSyncWrappers = {
            xAccess: function(pVfs, zName, flags, pOut) {
              mTimeStart("xAccess");
              const rc = opRun("xAccess", wasm.cstrToJs(zName));
              wasm.poke(pOut, rc ? 0 : 1, "i32");
              mTimeEnd();
              return 0;
            },
            xCurrentTime: function(pVfs, pOut) {
              wasm.poke(
                pOut,
                24405875e-1 + (/* @__PURE__ */ new Date()).getTime() / 864e5,
                "double"
              );
              return 0;
            },
            xCurrentTimeInt64: function(pVfs, pOut) {
              wasm.poke(
                pOut,
                24405875e-1 * 864e5 + (/* @__PURE__ */ new Date()).getTime(),
                "i64"
              );
              return 0;
            },
            xDelete: function(pVfs, zName, doSyncDir) {
              mTimeStart("xDelete");
              const rc = opRun(
                "xDelete",
                wasm.cstrToJs(zName),
                doSyncDir,
                false
              );
              mTimeEnd();
              return rc;
            },
            xFullPathname: function(pVfs, zName, nOut, pOut) {
              const i = wasm.cstrncpy(pOut, zName, nOut);
              return i < nOut ? 0 : capi.SQLITE_CANTOPEN;
            },
            xGetLastError: function(pVfs, nOut, pOut) {
              warn("OPFS xGetLastError() has nothing sensible to return.");
              return 0;
            },
            xOpen: function f(pVfs, zName, pFile, flags, pOutFlags) {
              mTimeStart("xOpen");
              let opfsFlags = 0;
              if (0 === zName) {
                zName = randomFilename();
              } else if (wasm.isPtr(zName)) {
                if (capi.sqlite3_uri_boolean(zName, "opfs-unlock-asap", 0)) {
                  opfsFlags |= state.opfsFlags.OPFS_UNLOCK_ASAP;
                }
                if (capi.sqlite3_uri_boolean(zName, "delete-before-open", 0)) {
                  opfsFlags |= state.opfsFlags.OPFS_UNLINK_BEFORE_OPEN;
                }
                zName = wasm.cstrToJs(zName);
              }
              const fh = /* @__PURE__ */ Object.create(null);
              fh.fid = pFile;
              fh.filename = zName;
              fh.sab = new SharedArrayBuffer(state.fileBufferSize);
              fh.flags = flags;
              fh.readOnly = !(sqlite32.SQLITE_OPEN_CREATE & flags) && !!(flags & capi.SQLITE_OPEN_READONLY);
              const rc = opRun("xOpen", pFile, zName, flags, opfsFlags);
              if (!rc) {
                if (fh.readOnly) {
                  wasm.poke(pOutFlags, capi.SQLITE_OPEN_READONLY, "i32");
                }
                __openFiles[pFile] = fh;
                fh.sabView = state.sabFileBufView;
                fh.sq3File = new sqlite3_file(pFile);
                fh.sq3File.$pMethods = opfsIoMethods.pointer;
                fh.lockType = capi.SQLITE_LOCK_NONE;
              }
              mTimeEnd();
              return rc;
            }
          };
          if (dVfs) {
            opfsVfs.$xRandomness = dVfs.$xRandomness;
            opfsVfs.$xSleep = dVfs.$xSleep;
          }
          if (!opfsVfs.$xRandomness) {
            vfsSyncWrappers.xRandomness = function(pVfs, nOut, pOut) {
              const heap = wasm.heap8u();
              let i = 0;
              const npOut = Number(pOut);
              for (; i < nOut; ++i)
                heap[npOut + i] = Math.random() * 255e3 & 255;
              return i;
            };
          }
          if (!opfsVfs.$xSleep) {
            vfsSyncWrappers.xSleep = function(pVfs, ms) {
              Atomics.wait(state.sabOPView, state.opIds.xSleep, 0, ms);
              return 0;
            };
          }
          opfsUtil.getResolvedPath = function(filename, splitIt) {
            const p = new URL(filename, "file://irrelevant").pathname;
            return splitIt ? p.split("/").filter((v2) => !!v2) : p;
          };
          opfsUtil.getDirForFilename = async function f(absFilename, createDirs = false) {
            const path = opfsUtil.getResolvedPath(absFilename, true);
            const filename = path.pop();
            let dh = opfsUtil.rootDirectory;
            for (const dirName of path) {
              if (dirName) {
                dh = await dh.getDirectoryHandle(dirName, {
                  create: !!createDirs
                });
              }
            }
            return [dh, filename];
          };
          opfsUtil.mkdir = async function(absDirName) {
            try {
              await opfsUtil.getDirForFilename(absDirName + "/filepart", true);
              return true;
            } catch (e) {
              return false;
            }
          };
          opfsUtil.entryExists = async function(fsEntryName) {
            try {
              const [dh, fn] = await opfsUtil.getDirForFilename(fsEntryName);
              await dh.getFileHandle(fn);
              return true;
            } catch (e) {
              return false;
            }
          };
          opfsUtil.randomFilename = randomFilename;
          opfsUtil.treeList = async function() {
            const doDir = async function callee4(dirHandle, tgt) {
              tgt.name = dirHandle.name;
              tgt.dirs = [];
              tgt.files = [];
              for await (const handle of dirHandle.values()) {
                if ("directory" === handle.kind) {
                  const subDir = /* @__PURE__ */ Object.create(null);
                  tgt.dirs.push(subDir);
                  await callee4(handle, subDir);
                } else {
                  tgt.files.push(handle.name);
                }
              }
            };
            const root = /* @__PURE__ */ Object.create(null);
            await doDir(opfsUtil.rootDirectory, root);
            return root;
          };
          opfsUtil.rmfr = async function() {
            const dir = opfsUtil.rootDirectory, opt = { recurse: true };
            for await (const handle of dir.values()) {
              dir.removeEntry(handle.name, opt);
            }
          };
          opfsUtil.unlink = async function(fsEntryName, recursive = false, throwOnError = false) {
            try {
              const [hDir, filenamePart] = await opfsUtil.getDirForFilename(
                fsEntryName,
                false
              );
              await hDir.removeEntry(filenamePart, { recursive });
              return true;
            } catch (e) {
              if (throwOnError) {
                throw new Error(
                  "unlink(",
                  arguments[0],
                  ") failed: " + e.message,
                  {
                    cause: e
                  }
                );
              }
              return false;
            }
          };
          opfsUtil.traverse = async function(opt) {
            const defaultOpt = {
              recursive: true,
              directory: opfsUtil.rootDirectory
            };
            if ("function" === typeof opt) {
              opt = { callback: opt };
            }
            opt = Object.assign(defaultOpt, opt || {});
            const doDir = async function callee4(dirHandle, depth) {
              for await (const handle of dirHandle.values()) {
                if (false === opt.callback(handle, dirHandle, depth))
                  return false;
                else if (opt.recursive && "directory" === handle.kind) {
                  if (false === await callee4(handle, depth + 1)) break;
                }
              }
            };
            doDir(opt.directory, 0);
          };
          const importDbChunked = async function(filename, callback) {
            const [hDir, fnamePart] = await opfsUtil.getDirForFilename(
              filename,
              true
            );
            const hFile = await hDir.getFileHandle(fnamePart, { create: true });
            let sah = await hFile.createSyncAccessHandle();
            let nWrote = 0, chunk, checkedHeader = false, err2 = false;
            try {
              sah.truncate(0);
              while (void 0 !== (chunk = await callback())) {
                if (chunk instanceof ArrayBuffer) chunk = new Uint8Array(chunk);
                if (!checkedHeader && 0 === nWrote && chunk.byteLength >= 15) {
                  util.affirmDbHeader(chunk);
                  checkedHeader = true;
                }
                sah.write(chunk, { at: nWrote });
                nWrote += chunk.byteLength;
              }
              if (nWrote < 512 || 0 !== nWrote % 512) {
                toss(
                  "Input size",
                  nWrote,
                  "is not correct for an SQLite database."
                );
              }
              if (!checkedHeader) {
                const header = new Uint8Array(20);
                sah.read(header, { at: 0 });
                util.affirmDbHeader(header);
              }
              sah.write(new Uint8Array([1, 1]), { at: 18 });
              return nWrote;
            } catch (e) {
              await sah.close();
              sah = void 0;
              await hDir.removeEntry(fnamePart).catch(() => {
              });
              throw e;
            } finally {
              if (sah) await sah.close();
            }
          };
          opfsUtil.importDb = async function(filename, bytes) {
            if (bytes instanceof Function) {
              return importDbChunked(filename, bytes);
            }
            if (bytes instanceof ArrayBuffer) bytes = new Uint8Array(bytes);
            util.affirmIsDb(bytes);
            const n = bytes.byteLength;
            const [hDir, fnamePart] = await opfsUtil.getDirForFilename(
              filename,
              true
            );
            let sah, err2, nWrote = 0;
            try {
              const hFile = await hDir.getFileHandle(fnamePart, {
                create: true
              });
              sah = await hFile.createSyncAccessHandle();
              sah.truncate(0);
              nWrote = sah.write(bytes, { at: 0 });
              if (nWrote != n) {
                toss(
                  "Expected to write " + n + " bytes but wrote " + nWrote + "."
                );
              }
              sah.write(new Uint8Array([1, 1]), { at: 18 });
              return nWrote;
            } catch (e) {
              if (sah) {
                await sah.close();
                sah = void 0;
              }
              await hDir.removeEntry(fnamePart).catch(() => {
              });
              throw e;
            } finally {
              if (sah) await sah.close();
            }
          };
          if (sqlite32.oo1) {
            const OpfsDb = function(...args) {
              const opt = sqlite32.oo1.DB.dbCtorHelper.normalizeArgs(...args);
              opt.vfs = opfsVfs.$zName;
              sqlite32.oo1.DB.dbCtorHelper.call(this, opt);
            };
            OpfsDb.prototype = Object.create(sqlite32.oo1.DB.prototype);
            sqlite32.oo1.OpfsDb = OpfsDb;
            OpfsDb.importDb = opfsUtil.importDb;
            sqlite32.oo1.DB.dbCtorHelper.setVfsPostOpenCallback(
              opfsVfs.pointer,
              function(oo1Db, sqlite33) {
                sqlite33.capi.sqlite3_busy_timeout(oo1Db, 1e4);
              }
            );
          }
          const sanityCheck = function() {
            const scope = wasm.scopedAllocPush();
            const sq3File = new sqlite3_file();
            try {
              const fid = sq3File.pointer;
              const openFlags = capi.SQLITE_OPEN_CREATE | capi.SQLITE_OPEN_READWRITE | capi.SQLITE_OPEN_MAIN_DB;
              const pOut = wasm.scopedAlloc(8);
              const dbFile = "/sanity/check/file" + randomFilename(8);
              const zDbFile = wasm.scopedAllocCString(dbFile);
              let rc;
              state.s11n.serialize("This is \\xE4 string.");
              rc = state.s11n.deserialize();
              log("deserialize() says:", rc);
              if ("This is \\xE4 string." !== rc[0]) toss("String d13n error.");
              vfsSyncWrappers.xAccess(opfsVfs.pointer, zDbFile, 0, pOut);
              rc = wasm.peek(pOut, "i32");
              log("xAccess(", dbFile, ") exists ?=", rc);
              rc = vfsSyncWrappers.xOpen(
                opfsVfs.pointer,
                zDbFile,
                fid,
                openFlags,
                pOut
              );
              log(
                "open rc =",
                rc,
                "state.sabOPView[xOpen] =",
                state.sabOPView[state.opIds.xOpen]
              );
              if (0 !== rc) {
                error("open failed with code", rc);
                return;
              }
              vfsSyncWrappers.xAccess(opfsVfs.pointer, zDbFile, 0, pOut);
              rc = wasm.peek(pOut, "i32");
              if (!rc) toss("xAccess() failed to detect file.");
              rc = ioSyncWrappers.xSync(sq3File.pointer, 0);
              if (rc) toss("sync failed w/ rc", rc);
              rc = ioSyncWrappers.xTruncate(sq3File.pointer, 1024);
              if (rc) toss("truncate failed w/ rc", rc);
              wasm.poke(pOut, 0, "i64");
              rc = ioSyncWrappers.xFileSize(sq3File.pointer, pOut);
              if (rc) toss("xFileSize failed w/ rc", rc);
              log("xFileSize says:", wasm.peek(pOut, "i64"));
              rc = ioSyncWrappers.xWrite(sq3File.pointer, zDbFile, 10, 1);
              if (rc) toss("xWrite() failed!");
              const readBuf = wasm.scopedAlloc(16);
              rc = ioSyncWrappers.xRead(sq3File.pointer, readBuf, 6, 2);
              wasm.poke(readBuf + 6, 0);
              let jRead = wasm.cstrToJs(readBuf);
              log("xRead() got:", jRead);
              if ("sanity" !== jRead) toss("Unexpected xRead() value.");
              if (vfsSyncWrappers.xSleep) {
                log("xSleep()ing before close()ing...");
                vfsSyncWrappers.xSleep(opfsVfs.pointer, 2e3);
                log("waking up from xSleep()");
              }
              rc = ioSyncWrappers.xClose(fid);
              log("xClose rc =", rc, "sabOPView =", state.sabOPView);
              log("Deleting file:", dbFile);
              vfsSyncWrappers.xDelete(opfsVfs.pointer, zDbFile, 4660);
              vfsSyncWrappers.xAccess(opfsVfs.pointer, zDbFile, 0, pOut);
              rc = wasm.peek(pOut, "i32");
              if (rc)
                toss("Expecting 0 from xAccess(", dbFile, ") after xDelete().");
              warn("End of OPFS sanity checks.");
            } finally {
              sq3File.dispose();
              wasm.scopedAllocPop(scope);
            }
          };
          W.onmessage = function({ data }) {
            switch (data.type) {
              case "opfs-unavailable":
                promiseReject(new Error(data.payload.join(" ")));
                break;
              case "opfs-async-loaded":
                W.postMessage({ type: "opfs-async-init", args: state });
                break;
              case "opfs-async-inited": {
                if (true === promiseWasRejected) {
                  break;
                }
                try {
                  sqlite32.vfs.installVfs({
                    io: { struct: opfsIoMethods, methods: ioSyncWrappers },
                    vfs: { struct: opfsVfs, methods: vfsSyncWrappers }
                  });
                  state.sabOPView = new Int32Array(state.sabOP);
                  state.sabFileBufView = new Uint8Array(
                    state.sabIO,
                    0,
                    state.fileBufferSize
                  );
                  state.sabS11nView = new Uint8Array(
                    state.sabIO,
                    state.sabS11nOffset,
                    state.sabS11nSize
                  );
                  initS11n();
                  if (options.sanityChecks) {
                    warn(
                      "Running sanity checks because of opfs-sanity-check URL arg..."
                    );
                    sanityCheck();
                  }
                  if (thisThreadHasOPFS()) {
                    navigator.storage.getDirectory().then((d) => {
                      W.onerror = W._originalOnError;
                      delete W._originalOnError;
                      sqlite32.opfs = opfsUtil;
                      opfsUtil.rootDirectory = d;
                      log("End of OPFS sqlite3_vfs setup.", opfsVfs);
                      promiseResolve();
                    }).catch(promiseReject);
                  } else {
                    promiseResolve();
                  }
                } catch (e) {
                  error(e);
                  promiseReject(e);
                }
                break;
              }
              default: {
                const errMsg = "Unexpected message from the OPFS async worker: " + JSON.stringify(data);
                error(errMsg);
                promiseReject(new Error(errMsg));
                break;
              }
            }
          };
        });
        return thePromise;
      };
      installOpfsVfs.defaultProxyUri = "sqlite3-opfs-async-proxy.js";
      globalThis.sqlite3ApiBootstrap.initializersAsync.push(async (sqlite33) => {
        try {
          let proxyJs = installOpfsVfs.defaultProxyUri;
          if (sqlite33.scriptInfo.sqlite3Dir) {
            installOpfsVfs.defaultProxyUri = sqlite33.scriptInfo.sqlite3Dir + proxyJs;
          }
          return installOpfsVfs().catch((e) => {
            sqlite33.config.warn(
              "Ignoring inability to install OPFS sqlite3_vfs:",
              e.message
            );
          });
        } catch (e) {
          sqlite33.config.error("installOpfsVfs() exception:", e);
          return Promise.reject(e);
        }
      });
    });
    globalThis.sqlite3ApiBootstrap.initializers.push(function(sqlite32) {
      "use strict";
      const toss = sqlite32.util.toss;
      const toss3 = sqlite32.util.toss3;
      const initPromises = /* @__PURE__ */ Object.create(null);
      const capi = sqlite32.capi;
      const util = sqlite32.util;
      const wasm = sqlite32.wasm;
      const SECTOR_SIZE = 4096;
      const HEADER_MAX_PATH_SIZE = 512;
      const HEADER_FLAGS_SIZE = 4;
      const HEADER_DIGEST_SIZE = 8;
      const HEADER_CORPUS_SIZE = HEADER_MAX_PATH_SIZE + HEADER_FLAGS_SIZE;
      const HEADER_OFFSET_FLAGS = HEADER_MAX_PATH_SIZE;
      const HEADER_OFFSET_DIGEST = HEADER_CORPUS_SIZE;
      const HEADER_OFFSET_DATA = SECTOR_SIZE;
      const PERSISTENT_FILE_TYPES = capi.SQLITE_OPEN_MAIN_DB | capi.SQLITE_OPEN_MAIN_JOURNAL | capi.SQLITE_OPEN_SUPER_JOURNAL | capi.SQLITE_OPEN_WAL;
      const FLAG_COMPUTE_DIGEST_V2 = capi.SQLITE_OPEN_MEMORY;
      const OPAQUE_DIR_NAME = ".opaque";
      const getRandomName = () => Math.random().toString(36).slice(2);
      const textDecoder = new TextDecoder();
      const textEncoder = new TextEncoder();
      const optionDefaults = Object.assign(/* @__PURE__ */ Object.create(null), {
        name: "opfs-sahpool",
        directory: void 0,
        initialCapacity: 6,
        clearOnInit: false,
        verbosity: 2,
        forceReinitIfPreviouslyFailed: false
      });
      const loggers = [
        sqlite32.config.error,
        sqlite32.config.warn,
        sqlite32.config.log
      ];
      const log = sqlite32.config.log;
      const warn = sqlite32.config.warn;
      const error = sqlite32.config.error;
      const __mapVfsToPool = /* @__PURE__ */ new Map();
      const getPoolForVfs = (pVfs) => __mapVfsToPool.get(pVfs);
      const setPoolForVfs = (pVfs, pool) => {
        if (pool) __mapVfsToPool.set(pVfs, pool);
        else __mapVfsToPool.delete(pVfs);
      };
      const __mapSqlite3File = /* @__PURE__ */ new Map();
      const getPoolForPFile = (pFile) => __mapSqlite3File.get(pFile);
      const setPoolForPFile = (pFile, pool) => {
        if (pool) __mapSqlite3File.set(pFile, pool);
        else __mapSqlite3File.delete(pFile);
      };
      const ioMethods = {
        xCheckReservedLock: function(pFile, pOut) {
          const pool = getPoolForPFile(pFile);
          pool.log("xCheckReservedLock");
          pool.storeErr();
          wasm.poke32(pOut, 1);
          return 0;
        },
        xClose: function(pFile) {
          const pool = getPoolForPFile(pFile);
          pool.storeErr();
          const file = pool.getOFileForS3File(pFile);
          if (file) {
            try {
              pool.log(\`xClose \${file.path}\`);
              pool.mapS3FileToOFile(pFile, false);
              file.sah.flush();
              if (file.flags & capi.SQLITE_OPEN_DELETEONCLOSE) {
                pool.deletePath(file.path);
              }
            } catch (e) {
              return pool.storeErr(e, capi.SQLITE_IOERR);
            }
          }
          return 0;
        },
        xDeviceCharacteristics: function(pFile) {
          return capi.SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN;
        },
        xFileControl: function(pFile, opId, pArg) {
          return capi.SQLITE_NOTFOUND;
        },
        xFileSize: function(pFile, pSz64) {
          const pool = getPoolForPFile(pFile);
          pool.log(\`xFileSize\`);
          const file = pool.getOFileForS3File(pFile);
          const size = file.sah.getSize() - HEADER_OFFSET_DATA;
          wasm.poke64(pSz64, BigInt(size));
          return 0;
        },
        xLock: function(pFile, lockType) {
          const pool = getPoolForPFile(pFile);
          pool.log(\`xLock \${lockType}\`);
          pool.storeErr();
          const file = pool.getOFileForS3File(pFile);
          file.lockType = lockType;
          return 0;
        },
        xRead: function(pFile, pDest, n, offset64) {
          const pool = getPoolForPFile(pFile);
          pool.storeErr();
          const file = pool.getOFileForS3File(pFile);
          pool.log(\`xRead \${file.path} \${n} @ \${offset64}\`);
          try {
            const nRead = file.sah.read(
              wasm.heap8u().subarray(Number(pDest), Number(pDest) + n),
              { at: HEADER_OFFSET_DATA + Number(offset64) }
            );
            if (nRead < n) {
              wasm.heap8u().fill(0, Number(pDest) + nRead, Number(pDest) + n);
              return capi.SQLITE_IOERR_SHORT_READ;
            }
            return 0;
          } catch (e) {
            return pool.storeErr(e, capi.SQLITE_IOERR);
          }
        },
        xSectorSize: function(pFile) {
          return SECTOR_SIZE;
        },
        xSync: function(pFile, flags) {
          const pool = getPoolForPFile(pFile);
          pool.log(\`xSync \${flags}\`);
          pool.storeErr();
          const file = pool.getOFileForS3File(pFile);
          try {
            file.sah.flush();
            return 0;
          } catch (e) {
            return pool.storeErr(e, capi.SQLITE_IOERR);
          }
        },
        xTruncate: function(pFile, sz64) {
          const pool = getPoolForPFile(pFile);
          pool.log(\`xTruncate \${sz64}\`);
          pool.storeErr();
          const file = pool.getOFileForS3File(pFile);
          try {
            file.sah.truncate(HEADER_OFFSET_DATA + Number(sz64));
            return 0;
          } catch (e) {
            return pool.storeErr(e, capi.SQLITE_IOERR);
          }
        },
        xUnlock: function(pFile, lockType) {
          const pool = getPoolForPFile(pFile);
          pool.log("xUnlock");
          const file = pool.getOFileForS3File(pFile);
          file.lockType = lockType;
          return 0;
        },
        xWrite: function(pFile, pSrc, n, offset64) {
          const pool = getPoolForPFile(pFile);
          pool.storeErr();
          const file = pool.getOFileForS3File(pFile);
          pool.log(\`xWrite \${file.path} \${n} \${offset64}\`);
          try {
            const nBytes = file.sah.write(
              wasm.heap8u().subarray(Number(pSrc), Number(pSrc) + n),
              { at: HEADER_OFFSET_DATA + Number(offset64) }
            );
            return n === nBytes ? 0 : toss("Unknown write() failure.");
          } catch (e) {
            return pool.storeErr(e, capi.SQLITE_IOERR);
          }
        }
      };
      const opfsIoMethods = new capi.sqlite3_io_methods();
      opfsIoMethods.$iVersion = 1;
      sqlite32.vfs.installVfs({
        io: { struct: opfsIoMethods, methods: ioMethods }
      });
      const vfsMethods = {
        xAccess: function(pVfs, zName, flags, pOut) {
          const pool = getPoolForVfs(pVfs);
          pool.storeErr();
          try {
            const name = pool.getPath(zName);
            wasm.poke32(pOut, pool.hasFilename(name) ? 1 : 0);
          } catch (e) {
            wasm.poke32(pOut, 0);
          }
          return 0;
        },
        xCurrentTime: function(pVfs, pOut) {
          wasm.poke(
            pOut,
            24405875e-1 + (/* @__PURE__ */ new Date()).getTime() / 864e5,
            "double"
          );
          return 0;
        },
        xCurrentTimeInt64: function(pVfs, pOut) {
          wasm.poke(pOut, 24405875e-1 * 864e5 + (/* @__PURE__ */ new Date()).getTime(), "i64");
          return 0;
        },
        xDelete: function(pVfs, zName, doSyncDir) {
          const pool = getPoolForVfs(pVfs);
          pool.log(\`xDelete \${wasm.cstrToJs(zName)}\`);
          pool.storeErr();
          try {
            pool.deletePath(pool.getPath(zName));
            return 0;
          } catch (e) {
            pool.storeErr(e);
            return capi.SQLITE_IOERR_DELETE;
          }
        },
        xFullPathname: function(pVfs, zName, nOut, pOut) {
          const i = wasm.cstrncpy(pOut, zName, nOut);
          return i < nOut ? 0 : capi.SQLITE_CANTOPEN;
        },
        xGetLastError: function(pVfs, nOut, pOut) {
          const pool = getPoolForVfs(pVfs);
          const e = pool.popErr();
          pool.log(\`xGetLastError \${nOut} e =\`, e);
          if (e) {
            const scope = wasm.scopedAllocPush();
            try {
              const [cMsg, n] = wasm.scopedAllocCString(e.message, true);
              wasm.cstrncpy(pOut, cMsg, nOut);
              if (n > nOut) wasm.poke8(pOut + nOut - 1, 0);
            } catch (e2) {
              return capi.SQLITE_NOMEM;
            } finally {
              wasm.scopedAllocPop(scope);
            }
          }
          return e ? e.sqlite3Rc || capi.SQLITE_IOERR : 0;
        },
        xOpen: function f(pVfs, zName, pFile, flags, pOutFlags) {
          const pool = getPoolForVfs(pVfs);
          try {
            flags &= ~FLAG_COMPUTE_DIGEST_V2;
            pool.log(\`xOpen \${wasm.cstrToJs(zName)} \${flags}\`);
            const path = zName && wasm.peek8(zName) ? pool.getPath(zName) : getRandomName();
            let sah = pool.getSAHForPath(path);
            if (!sah && flags & capi.SQLITE_OPEN_CREATE) {
              if (pool.getFileCount() < pool.getCapacity()) {
                sah = pool.nextAvailableSAH();
                pool.setAssociatedPath(sah, path, flags);
              } else {
                toss("SAH pool is full. Cannot create file", path);
              }
            }
            if (!sah) {
              toss("file not found:", path);
            }
            const file = { path, flags, sah };
            pool.mapS3FileToOFile(pFile, file);
            file.lockType = capi.SQLITE_LOCK_NONE;
            const sq3File = new capi.sqlite3_file(pFile);
            sq3File.$pMethods = opfsIoMethods.pointer;
            sq3File.dispose();
            wasm.poke32(pOutFlags, flags);
            return 0;
          } catch (e) {
            pool.storeErr(e);
            return capi.SQLITE_CANTOPEN;
          }
        }
      };
      const createOpfsVfs = function(vfsName) {
        if (sqlite32.capi.sqlite3_vfs_find(vfsName)) {
          toss3("VFS name is already registered:", vfsName);
        }
        const opfsVfs = new capi.sqlite3_vfs();
        const pDVfs = capi.sqlite3_vfs_find(null);
        const dVfs = pDVfs ? new capi.sqlite3_vfs(pDVfs) : null;
        opfsVfs.$iVersion = 2;
        opfsVfs.$szOsFile = capi.sqlite3_file.structInfo.sizeof;
        opfsVfs.$mxPathname = HEADER_MAX_PATH_SIZE;
        opfsVfs.addOnDispose(
          opfsVfs.$zName = wasm.allocCString(vfsName),
          () => setPoolForVfs(opfsVfs.pointer, 0)
        );
        if (dVfs) {
          opfsVfs.$xRandomness = dVfs.$xRandomness;
          opfsVfs.$xSleep = dVfs.$xSleep;
          dVfs.dispose();
        }
        if (!opfsVfs.$xRandomness && !vfsMethods.xRandomness) {
          vfsMethods.xRandomness = function(pVfs, nOut, pOut) {
            const heap = wasm.heap8u();
            let i = 0;
            const npOut = Number(pOut);
            for (; i < nOut; ++i)
              heap[npOut + i] = Math.random() * 255e3 & 255;
            return i;
          };
        }
        if (!opfsVfs.$xSleep && !vfsMethods.xSleep) {
          vfsMethods.xSleep = (pVfs, ms) => 0;
        }
        sqlite32.vfs.installVfs({
          vfs: { struct: opfsVfs, methods: vfsMethods }
        });
        return opfsVfs;
      };
      class OpfsSAHPool {
        vfsDir;
        #dhVfsRoot;
        #dhOpaque;
        #dhVfsParent;
        #mapSAHToName = /* @__PURE__ */ new Map();
        #mapFilenameToSAH = /* @__PURE__ */ new Map();
        #availableSAH = /* @__PURE__ */ new Set();
        #mapS3FileToOFile_ = /* @__PURE__ */ new Map();
        #apBody = new Uint8Array(HEADER_CORPUS_SIZE);
        #dvBody;
        #cVfs;
        #verbosity;
        constructor(options = /* @__PURE__ */ Object.create(null)) {
          this.#verbosity = options.verbosity ?? optionDefaults.verbosity;
          this.vfsName = options.name || optionDefaults.name;
          this.#cVfs = createOpfsVfs(this.vfsName);
          setPoolForVfs(this.#cVfs.pointer, this);
          this.vfsDir = options.directory || "." + this.vfsName;
          this.#dvBody = new DataView(
            this.#apBody.buffer,
            this.#apBody.byteOffset
          );
          this.isReady = this.reset(
            !!(options.clearOnInit ?? optionDefaults.clearOnInit)
          ).then(() => {
            if (this.$error) throw this.$error;
            return this.getCapacity() ? Promise.resolve(void 0) : this.addCapacity(
              options.initialCapacity || optionDefaults.initialCapacity
            );
          });
        }
        #logImpl(level, ...args) {
          if (this.#verbosity > level)
            loggers[level](this.vfsName + ":", ...args);
        }
        log(...args) {
          this.#logImpl(2, ...args);
        }
        warn(...args) {
          this.#logImpl(1, ...args);
        }
        error(...args) {
          this.#logImpl(0, ...args);
        }
        getVfs() {
          return this.#cVfs;
        }
        getCapacity() {
          return this.#mapSAHToName.size;
        }
        getFileCount() {
          return this.#mapFilenameToSAH.size;
        }
        getFileNames() {
          const rc = [];
          for (const n of this.#mapFilenameToSAH.keys()) rc.push(n);
          return rc;
        }
        async addCapacity(n) {
          for (let i = 0; i < n; ++i) {
            const name = getRandomName();
            const h = await this.#dhOpaque.getFileHandle(name, {
              create: true
            });
            const ah = await h.createSyncAccessHandle();
            this.#mapSAHToName.set(ah, name);
            this.setAssociatedPath(ah, "", 0);
          }
          return this.getCapacity();
        }
        async reduceCapacity(n) {
          let nRm = 0;
          for (const ah of Array.from(this.#availableSAH)) {
            if (nRm === n || this.getFileCount() === this.getCapacity()) {
              break;
            }
            const name = this.#mapSAHToName.get(ah);
            ah.close();
            await this.#dhOpaque.removeEntry(name);
            this.#mapSAHToName.delete(ah);
            this.#availableSAH.delete(ah);
            ++nRm;
          }
          return nRm;
        }
        releaseAccessHandles() {
          for (const ah of this.#mapSAHToName.keys()) ah.close();
          this.#mapSAHToName.clear();
          this.#mapFilenameToSAH.clear();
          this.#availableSAH.clear();
        }
        async acquireAccessHandles(clearFiles = false) {
          const files = [];
          for await (const [name, h] of this.#dhOpaque) {
            if ("file" === h.kind) {
              files.push([name, h]);
            }
          }
          return Promise.all(
            files.map(async ([name, h]) => {
              try {
                const ah = await h.createSyncAccessHandle();
                this.#mapSAHToName.set(ah, name);
                if (clearFiles) {
                  ah.truncate(HEADER_OFFSET_DATA);
                  this.setAssociatedPath(ah, "", 0);
                } else {
                  const path = this.getAssociatedPath(ah);
                  if (path) {
                    this.#mapFilenameToSAH.set(path, ah);
                  } else {
                    this.#availableSAH.add(ah);
                  }
                }
              } catch (e) {
                this.storeErr(e);
                this.releaseAccessHandles();
                throw e;
              }
            })
          );
        }
        getAssociatedPath(sah) {
          sah.read(this.#apBody, { at: 0 });
          const flags = this.#dvBody.getUint32(HEADER_OFFSET_FLAGS);
          if (this.#apBody[0] && (flags & capi.SQLITE_OPEN_DELETEONCLOSE || (flags & PERSISTENT_FILE_TYPES) === 0)) {
            warn(
              \`Removing file with unexpected flags \${flags.toString(16)}\`,
              this.#apBody
            );
            this.setAssociatedPath(sah, "", 0);
            return "";
          }
          const fileDigest = new Uint32Array(HEADER_DIGEST_SIZE / 4);
          sah.read(fileDigest, { at: HEADER_OFFSET_DIGEST });
          const compDigest = this.computeDigest(this.#apBody, flags);
          if (fileDigest.every((v2, i) => v2 === compDigest[i])) {
            const pathBytes = this.#apBody.findIndex((v2) => 0 === v2);
            if (0 === pathBytes) {
              sah.truncate(HEADER_OFFSET_DATA);
            }
            return pathBytes ? textDecoder.decode(this.#apBody.subarray(0, pathBytes)) : "";
          } else {
            warn("Disassociating file with bad digest.");
            this.setAssociatedPath(sah, "", 0);
            return "";
          }
        }
        setAssociatedPath(sah, path, flags) {
          const enc = textEncoder.encodeInto(path, this.#apBody);
          if (HEADER_MAX_PATH_SIZE <= enc.written + 1) {
            toss("Path too long:", path);
          }
          if (path && flags) {
            flags |= FLAG_COMPUTE_DIGEST_V2;
          }
          this.#apBody.fill(0, enc.written, HEADER_MAX_PATH_SIZE);
          this.#dvBody.setUint32(HEADER_OFFSET_FLAGS, flags);
          const digest = this.computeDigest(this.#apBody, flags);
          sah.write(this.#apBody, { at: 0 });
          sah.write(digest, { at: HEADER_OFFSET_DIGEST });
          sah.flush();
          if (path) {
            this.#mapFilenameToSAH.set(path, sah);
            this.#availableSAH.delete(sah);
          } else {
            sah.truncate(HEADER_OFFSET_DATA);
            this.#availableSAH.add(sah);
          }
        }
        computeDigest(byteArray, fileFlags) {
          if (fileFlags & FLAG_COMPUTE_DIGEST_V2) {
            let h1 = 3735928559;
            let h2 = 1103547991;
            for (const v2 of byteArray) {
              h1 = Math.imul(h1 ^ v2, 2654435761);
              h2 = Math.imul(h2 ^ v2, 104729);
            }
            return new Uint32Array([h1 >>> 0, h2 >>> 0]);
          } else {
            return new Uint32Array([0, 0]);
          }
        }
        async reset(clearFiles) {
          await this.isReady;
          let h = await navigator.storage.getDirectory();
          let prev, prevName;
          for (const d of this.vfsDir.split("/")) {
            if (d) {
              prev = h;
              h = await h.getDirectoryHandle(d, { create: true });
            }
          }
          this.#dhVfsRoot = h;
          this.#dhVfsParent = prev;
          this.#dhOpaque = await this.#dhVfsRoot.getDirectoryHandle(
            OPAQUE_DIR_NAME,
            { create: true }
          );
          this.releaseAccessHandles();
          return this.acquireAccessHandles(clearFiles);
        }
        getPath(arg) {
          if (wasm.isPtr(arg)) arg = wasm.cstrToJs(arg);
          return (arg instanceof URL ? arg : new URL(arg, "file://localhost/")).pathname;
        }
        deletePath(path) {
          const sah = this.#mapFilenameToSAH.get(path);
          if (sah) {
            this.#mapFilenameToSAH.delete(path);
            this.setAssociatedPath(sah, "", 0);
          }
          return !!sah;
        }
        storeErr(e, code) {
          if (e) {
            e.sqlite3Rc = code || capi.SQLITE_IOERR;
            this.error(e);
          }
          this.$error = e;
          return code;
        }
        popErr() {
          const rc = this.$error;
          this.$error = void 0;
          return rc;
        }
        nextAvailableSAH() {
          const [rc] = this.#availableSAH.keys();
          return rc;
        }
        getOFileForS3File(pFile) {
          return this.#mapS3FileToOFile_.get(pFile);
        }
        mapS3FileToOFile(pFile, file) {
          if (file) {
            this.#mapS3FileToOFile_.set(pFile, file);
            setPoolForPFile(pFile, this);
          } else {
            this.#mapS3FileToOFile_.delete(pFile);
            setPoolForPFile(pFile, false);
          }
        }
        hasFilename(name) {
          return this.#mapFilenameToSAH.has(name);
        }
        getSAHForPath(path) {
          return this.#mapFilenameToSAH.get(path);
        }
        async removeVfs() {
          if (!this.#cVfs.pointer || !this.#dhOpaque) return false;
          capi.sqlite3_vfs_unregister(this.#cVfs.pointer);
          this.#cVfs.dispose();
          delete initPromises[this.vfsName];
          try {
            this.releaseAccessHandles();
            await this.#dhVfsRoot.removeEntry(OPAQUE_DIR_NAME, {
              recursive: true
            });
            this.#dhOpaque = void 0;
            await this.#dhVfsParent.removeEntry(this.#dhVfsRoot.name, {
              recursive: true
            });
            this.#dhVfsRoot = this.#dhVfsParent = void 0;
          } catch (e) {
            sqlite32.config.error(
              this.vfsName,
              "removeVfs() failed with no recovery strategy:",
              e
            );
          }
          return true;
        }
        pauseVfs() {
          if (this.#mapS3FileToOFile_.size > 0) {
            sqlite32.SQLite3Error.toss(
              capi.SQLITE_MISUSE,
              "Cannot pause VFS",
              this.vfsName,
              "because it has opened files."
            );
          }
          if (this.#mapSAHToName.size > 0) {
            capi.sqlite3_vfs_unregister(this.vfsName);
            this.releaseAccessHandles();
          }
          return this;
        }
        isPaused() {
          return 0 === this.#mapSAHToName.size;
        }
        async unpauseVfs() {
          if (0 === this.#mapSAHToName.size) {
            return this.acquireAccessHandles(false).then(
              () => capi.sqlite3_vfs_register(this.#cVfs, 0),
              this
            );
          }
          return this;
        }
        exportFile(name) {
          const sah = this.#mapFilenameToSAH.get(name) || toss("File not found:", name);
          const n = sah.getSize() - HEADER_OFFSET_DATA;
          const b = new Uint8Array(n > 0 ? n : 0);
          if (n > 0) {
            const nRead = sah.read(b, { at: HEADER_OFFSET_DATA });
            if (nRead != n) {
              toss("Expected to read " + n + " bytes but read " + nRead + ".");
            }
          }
          return b;
        }
        async importDbChunked(name, callback) {
          const sah = this.#mapFilenameToSAH.get(name) || this.nextAvailableSAH() || toss("No available handles to import to.");
          sah.truncate(0);
          let nWrote = 0, chunk, checkedHeader = false, err2 = false;
          try {
            while (void 0 !== (chunk = await callback())) {
              if (chunk instanceof ArrayBuffer) chunk = new Uint8Array(chunk);
              if (!checkedHeader && 0 === nWrote && chunk.byteLength >= 15) {
                util.affirmDbHeader(chunk);
                checkedHeader = true;
              }
              sah.write(chunk, { at: HEADER_OFFSET_DATA + nWrote });
              nWrote += chunk.byteLength;
            }
            if (nWrote < 512 || 0 !== nWrote % 512) {
              toss(
                "Input size",
                nWrote,
                "is not correct for an SQLite database."
              );
            }
            if (!checkedHeader) {
              const header = new Uint8Array(20);
              sah.read(header, { at: 0 });
              util.affirmDbHeader(header);
            }
            sah.write(new Uint8Array([1, 1]), {
              at: HEADER_OFFSET_DATA + 18
            });
          } catch (e) {
            this.setAssociatedPath(sah, "", 0);
            throw e;
          }
          this.setAssociatedPath(sah, name, capi.SQLITE_OPEN_MAIN_DB);
          return nWrote;
        }
        importDb(name, bytes) {
          if (bytes instanceof ArrayBuffer) bytes = new Uint8Array(bytes);
          else if (bytes instanceof Function)
            return this.importDbChunked(name, bytes);
          const sah = this.#mapFilenameToSAH.get(name) || this.nextAvailableSAH() || toss("No available handles to import to.");
          const n = bytes.byteLength;
          if (n < 512 || n % 512 != 0) {
            toss("Byte array size is invalid for an SQLite db.");
          }
          const header = "SQLite format 3";
          for (let i = 0; i < header.length; ++i) {
            if (header.charCodeAt(i) !== bytes[i]) {
              toss("Input does not contain an SQLite database header.");
            }
          }
          const nWrote = sah.write(bytes, { at: HEADER_OFFSET_DATA });
          if (nWrote != n) {
            this.setAssociatedPath(sah, "", 0);
            toss("Expected to write " + n + " bytes but wrote " + nWrote + ".");
          } else {
            sah.write(new Uint8Array([1, 1]), { at: HEADER_OFFSET_DATA + 18 });
            this.setAssociatedPath(sah, name, capi.SQLITE_OPEN_MAIN_DB);
          }
          return nWrote;
        }
      }
      class OpfsSAHPoolUtil {
        #p;
        constructor(sahPool) {
          this.#p = sahPool;
          this.vfsName = sahPool.vfsName;
        }
        async addCapacity(n) {
          return this.#p.addCapacity(n);
        }
        async reduceCapacity(n) {
          return this.#p.reduceCapacity(n);
        }
        getCapacity() {
          return this.#p.getCapacity(this.#p);
        }
        getFileCount() {
          return this.#p.getFileCount();
        }
        getFileNames() {
          return this.#p.getFileNames();
        }
        async reserveMinimumCapacity(min) {
          const c = this.#p.getCapacity();
          return c < min ? this.#p.addCapacity(min - c) : c;
        }
        exportFile(name) {
          return this.#p.exportFile(name);
        }
        importDb(name, bytes) {
          return this.#p.importDb(name, bytes);
        }
        async wipeFiles() {
          return this.#p.reset(true);
        }
        unlink(filename) {
          return this.#p.deletePath(filename);
        }
        async removeVfs() {
          return this.#p.removeVfs();
        }
        pauseVfs() {
          this.#p.pauseVfs();
          return this;
        }
        async unpauseVfs() {
          return this.#p.unpauseVfs().then(() => this);
        }
        isPaused() {
          return this.#p.isPaused();
        }
      }
      const apiVersionCheck = async () => {
        const dh = await navigator.storage.getDirectory();
        const fn = ".opfs-sahpool-sync-check-" + getRandomName();
        const fh = await dh.getFileHandle(fn, { create: true });
        const ah = await fh.createSyncAccessHandle();
        const close = ah.close();
        await close;
        await dh.removeEntry(fn);
        if (close?.then) {
          toss(
            "The local OPFS API is too old for opfs-sahpool:",
            "it has an async FileSystemSyncAccessHandle.close() method."
          );
        }
        return true;
      };
      sqlite32.installOpfsSAHPoolVfs = async function(options = /* @__PURE__ */ Object.create(null)) {
        options = Object.assign(
          /* @__PURE__ */ Object.create(null),
          optionDefaults,
          options || {}
        );
        const vfsName = options.name;
        if (options.$testThrowPhase1) {
          throw options.$testThrowPhase1;
        }
        if (initPromises[vfsName]) {
          try {
            const p = await initPromises[vfsName];
            return p;
          } catch (e) {
            if (options.forceReinitIfPreviouslyFailed) {
              delete initPromises[vfsName];
            } else {
              throw e;
            }
          }
        }
        if (!globalThis.FileSystemHandle || !globalThis.FileSystemDirectoryHandle || !globalThis.FileSystemFileHandle || !globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle || !navigator?.storage?.getDirectory) {
          return initPromises[vfsName] = Promise.reject(
            new Error("Missing required OPFS APIs.")
          );
        }
        return initPromises[vfsName] = apiVersionCheck().then(async function() {
          if (options.$testThrowPhase2) {
            throw options.$testThrowPhase2;
          }
          const thePool = new OpfsSAHPool(options);
          return thePool.isReady.then(async () => {
            const poolUtil = new OpfsSAHPoolUtil(thePool);
            if (sqlite32.oo1) {
              const oo1 = sqlite32.oo1;
              const theVfs = thePool.getVfs();
              const OpfsSAHPoolDb = function(...args) {
                const opt = oo1.DB.dbCtorHelper.normalizeArgs(...args);
                opt.vfs = theVfs.$zName;
                oo1.DB.dbCtorHelper.call(this, opt);
              };
              OpfsSAHPoolDb.prototype = Object.create(oo1.DB.prototype);
              poolUtil.OpfsSAHPoolDb = OpfsSAHPoolDb;
            }
            thePool.log("VFS initialized.");
            return poolUtil;
          }).catch(async (e) => {
            await thePool.removeVfs().catch(() => {
            });
            throw e;
          });
        }).catch((err2) => {
          return initPromises[vfsName] = Promise.reject(err2);
        });
      };
    });
    "use strict";
    if ("undefined" === typeof EmscriptenModule) {
      console.warn(
        "This is not running in the context of Module.runSQLite3PostLoadInit()"
      );
      throw new Error(
        "sqlite3-api-cleanup.js expects to be running in the context of its Emscripten module loader."
      );
    }
    try {
      const bootstrapConfig = Object.assign(
        /* @__PURE__ */ Object.create(null),
        globalThis.sqlite3ApiBootstrap.defaultConfig,
        globalThis.sqlite3ApiConfig || {},
        {
          memory: "undefined" !== typeof wasmMemory ? wasmMemory : EmscriptenModule["wasmMemory"],
          exports: "undefined" !== typeof wasmExports ? wasmExports : Object.prototype.hasOwnProperty.call(
            EmscriptenModule,
            "wasmExports"
          ) ? EmscriptenModule["wasmExports"] : EmscriptenModule["asm"]
        }
      );
      bootstrapConfig.wasmPtrIR = "number" === typeof bootstrapConfig.exports.sqlite3_libversion() ? "i32" : "i64";
      const sIMS = sqlite3InitScriptInfo;
      sIMS.debugModule("Bootstrapping lib config", sIMS);
      const p = globalThis.sqlite3ApiBootstrap(bootstrapConfig);
      delete globalThis.sqlite3ApiBootstrap;
      return p;
    } catch (e) {
      console.error("sqlite3ApiBootstrap() error:", e);
      throw e;
    }
    throw new Error("Maintenance required: this line should never be reached");
  };
  if (runtimeInitialized) {
    moduleRtn = Module;
  } else {
    moduleRtn = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
  }
  return moduleRtn;
}
var toExportForESM = function() {
  const originalInit = sqlite3InitModule;
  if (!originalInit) {
    throw new Error(
      "Expecting globalThis.sqlite3InitModule to be defined by the Emscripten build."
    );
  }
  const sIMS = globalThis.sqlite3InitModuleState = Object.assign(
    /* @__PURE__ */ Object.create(null),
    {
      moduleScript: globalThis?.document?.currentScript,
      isWorker: "undefined" !== typeof WorkerGlobalScope,
      location: globalThis.location,
      urlParams: globalThis?.location?.href ? new URL(globalThis.location.href).searchParams : new URLSearchParams(),
      wasmFilename: "sqlite3.wasm"
    }
  );
  sIMS.debugModule = sIMS.urlParams.has("sqlite3.debugModule") ? (...args) => console.warn("sqlite3.debugModule:", ...args) : () => {
  };
  if (sIMS.urlParams.has("sqlite3.dir")) {
    sIMS.sqlite3Dir = sIMS.urlParams.get("sqlite3.dir") + "/";
  } else if (sIMS.moduleScript) {
    const li = sIMS.moduleScript.src.split("/");
    li.pop();
    sIMS.sqlite3Dir = li.join("/") + "/";
  }
  const sIM = globalThis.sqlite3InitModule = function ff(...args) {
    return originalInit(...args).then((EmscriptenModule) => {
      sIMS.debugModule("sqlite3InitModule() sIMS =", sIMS);
      sIMS.debugModule(
        "sqlite3InitModule() EmscriptenModule =",
        EmscriptenModule
      );
      const s = EmscriptenModule.runSQLite3PostLoadInit(
        sIMS,
        EmscriptenModule,
        !!ff.__isUnderTest
      );
      sIMS.debugModule("sqlite3InitModule() sqlite3 =", s);
      return s;
    }).catch((e) => {
      console.error("Exception loading sqlite3 module:", e);
      throw e;
    });
  };
  sIM.ready = originalInit.ready;
  if (sIMS.moduleScript) {
    let src = sIMS.moduleScript.src.split("/");
    src.pop();
    sIMS.scriptDir = src.join("/") + "/";
  }
  sIMS.debugModule("extern-post-js.c-pp.js sqlite3InitModuleState =", sIMS);
  return sIM;
}();
sqlite3InitModule = toExportForESM;
var sqlite3_default = sqlite3InitModule;

// node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-worker1-promiser.mjs
globalThis.sqlite3Worker1Promiser = function callee(config = callee.defaultConfig) {
  if (1 === arguments.length && "function" === typeof arguments[0]) {
    const f = config;
    config = Object.assign(/* @__PURE__ */ Object.create(null), callee.defaultConfig);
    config.onready = f;
  } else {
    config = Object.assign(/* @__PURE__ */ Object.create(null), callee.defaultConfig, config);
  }
  const handlerMap = /* @__PURE__ */ Object.create(null);
  const noop = function() {
  };
  const err = config.onerror || noop;
  const debug = config.debug || noop;
  const idTypeMap = config.generateMessageId ? void 0 : /* @__PURE__ */ Object.create(null);
  const genMsgId = config.generateMessageId || function(msg) {
    return msg.type + "#" + (idTypeMap[msg.type] = (idTypeMap[msg.type] || 0) + 1);
  };
  const toss = (...args) => {
    throw new Error(args.join(" "));
  };
  if (!config.worker) config.worker = callee.defaultConfig.worker;
  if ("function" === typeof config.worker) config.worker = config.worker();
  let dbId;
  let promiserFunc;
  config.worker.onmessage = function(ev) {
    ev = ev.data;
    debug("worker1.onmessage", ev);
    let msgHandler = handlerMap[ev.messageId];
    if (!msgHandler) {
      if (ev && "sqlite3-api" === ev.type && "worker1-ready" === ev.result) {
        if (config.onready) config.onready(promiserFunc);
        return;
      }
      msgHandler = handlerMap[ev.type];
      if (msgHandler && msgHandler.onrow) {
        msgHandler.onrow(ev);
        return;
      }
      if (config.onunhandled) config.onunhandled(arguments[0]);
      else err("sqlite3Worker1Promiser() unhandled worker message:", ev);
      return;
    }
    delete handlerMap[ev.messageId];
    switch (ev.type) {
      case "error":
        msgHandler.reject(ev);
        return;
      case "open":
        if (!dbId) dbId = ev.dbId;
        break;
      case "close":
        if (ev.dbId === dbId) dbId = void 0;
        break;
      default:
        break;
    }
    try {
      msgHandler.resolve(ev);
    } catch (e) {
      msgHandler.reject(e);
    }
  };
  return promiserFunc = function() {
    let msg;
    if (1 === arguments.length) {
      msg = arguments[0];
    } else if (2 === arguments.length) {
      msg = /* @__PURE__ */ Object.create(null);
      msg.type = arguments[0];
      msg.args = arguments[1];
      msg.dbId = msg.args.dbId;
    } else {
      toss("Invalid arguments for sqlite3Worker1Promiser()-created factory.");
    }
    if (!msg.dbId && msg.type !== "open") msg.dbId = dbId;
    msg.messageId = genMsgId(msg);
    msg.departureTime = performance.now();
    const proxy = /* @__PURE__ */ Object.create(null);
    proxy.message = msg;
    let rowCallbackId;
    if ("exec" === msg.type && msg.args) {
      if ("function" === typeof msg.args.callback) {
        rowCallbackId = msg.messageId + ":row";
        proxy.onrow = msg.args.callback;
        msg.args.callback = rowCallbackId;
        handlerMap[rowCallbackId] = proxy;
      } else if ("string" === typeof msg.args.callback) {
        toss(
          "exec callback may not be a string when using the Promise interface."
        );
      }
    }
    let p = new Promise(function(resolve, reject) {
      proxy.resolve = resolve;
      proxy.reject = reject;
      handlerMap[msg.messageId] = proxy;
      debug(
        "Posting",
        msg.type,
        "message to Worker dbId=" + (dbId || "default") + ":",
        msg
      );
      config.worker.postMessage(msg);
    });
    if (rowCallbackId) p = p.finally(() => delete handlerMap[rowCallbackId]);
    return p;
  };
};
globalThis.sqlite3Worker1Promiser.defaultConfig = {
  worker: function() {
    return new Worker(new URL("sqlite3-worker1.js", import.meta.url));
  },
  onerror: (...args) => console.error("worker1 promiser error", ...args)
};
globalThis.sqlite3Worker1Promiser.v2 = function callee2(config = callee2.defaultConfig) {
  let oldFunc;
  if ("function" == typeof config) {
    oldFunc = config;
    config = {};
  } else if ("function" === typeof config?.onready) {
    oldFunc = config.onready;
    delete config.onready;
  }
  const promiseProxy = /* @__PURE__ */ Object.create(null);
  config = Object.assign(config || /* @__PURE__ */ Object.create(null), {
    onready: async function(func) {
      try {
        if (oldFunc) await oldFunc(func);
        promiseProxy.resolve(func);
      } catch (e) {
        promiseProxy.reject(e);
      }
    }
  });
  const p = new Promise(function(resolve, reject) {
    promiseProxy.resolve = resolve;
    promiseProxy.reject = reject;
  });
  try {
    this.original(config);
  } catch (e) {
    promiseProxy.reject(e);
  }
  return p;
}.bind({
  original: sqlite3Worker1Promiser
});
globalThis.sqlite3Worker1Promiser.v2.defaultConfig = globalThis.sqlite3Worker1Promiser.defaultConfig;
var sqlite3_worker1_promiser_default = sqlite3Worker1Promiser.v2;

// node_modules/@sqlite.org/sqlite-wasm/index.mjs
var sqlite3Worker1Promiser2 = globalThis.sqlite3Worker1Promiser;
var sqlite_wasm_default = sqlite3_default;

// worker/index.ts
var OPFS_VFS = "opfs";
var sqlite3 = null;
var databases = /* @__PURE__ */ new Map();
var lastProcessedSql = /* @__PURE__ */ new Map();
var lastAffectedRows = /* @__PURE__ */ new Map();
async function initSqlite() {
  console.log("[Worker] Initializing SQLite WASM module...");
  const module = await sqlite_wasm_default({
    print: console.log,
    printErr: console.error
  });
  sqlite3 = module;
  console.log("[Worker] SQLite WASM module initialized successfully");
  console.log("[Worker] OPFS directory:", sqlite3?.capi.sqlite3_wasmfs_opfs_dir?.() || "opfs");
}
function createDb(dbName) {
  console.log(\`[Worker] Creating database: \${dbName}\`);
  if (!sqlite3) {
    throw new Error("SQLite not initialized");
  }
  if (databases.has(dbName)) {
    throw new Error(\`Database \${dbName} already exists\`);
  }
  const db = new sqlite3.oo1.OpfsDb(\`\${OPFS_VFS}/\${dbName}.db\`);
  databases.set(dbName, db);
  initializeSchema(db);
  console.log(\`[Worker] Database \${dbName} created successfully\`);
  return db;
}
function exportDatabase(db) {
  const statements = [];
  const tablesResult = execute(db, "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%' AND name NOT LIKE 'sqlite_%'");
  for (const table of tablesResult.rows) {
    const tableName = table.name;
    const createSql = table.sql;
    if (createSql) {
      statements.push(createSql + ";");
    }
    const rowsResult = execute(db, \`SELECT * FROM \${tableName}\`);
    for (const row of rowsResult.rows) {
      const rowObj = row;
      const columns = Object.keys(rowObj);
      const values = columns.map((col) => {
        const v2 = rowObj[col];
        if (v2 === null) return "NULL";
        if (typeof v2 === "string") return \`'\${String(v2).replace(/'/g, "''")}'\`;
        return String(v2);
      });
      statements.push(\`INSERT INTO \${tableName} (\${columns.join(", ")}) VALUES (\${values.join(", ")});\`);
    }
  }
  const sql = statements.join("\\n");
  return new TextEncoder().encode(sql);
}
function importDatabase(db, data) {
  if (data.length === 0) {
    throw new Error("Byte array size 0 is invalid for an SQLite3 db.");
  }
  const sql = new TextDecoder().decode(data);
  const statements = sql.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
  for (const stmt of statements) {
    try {
      if (stmt.toUpperCase().startsWith("CREATE TABLE")) {
        const match = stmt.match(/CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?["\`]?(\\w+)["\`]?/i);
        if (match) {
          const tableName = match[1];
          const exists = execute(db, \`SELECT name FROM sqlite_master WHERE type='table' AND name='\${tableName}'\`);
          if (exists.rows.length > 0) {
            continue;
          }
        }
        db.exec(stmt + ";");
      } else if (stmt.toUpperCase().startsWith("INSERT")) {
        const modified = stmt.replace(/^INSERT\\s+INTO/i, "INSERT OR REPLACE INTO");
        db.exec(modified + ";");
      } else {
        db.exec(stmt + ";");
      }
    } catch (e) {
      console.warn("Import statement failed:", stmt, e);
    }
  }
}
function initializeSchema(db) {
  db.exec(\`
    CREATE TABLE IF NOT EXISTS _syncable_metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  \`);
}
function execute(db, sql, params) {
  const stmt = db.prepare(sql);
  if (params) {
    stmt.bind(params);
  }
  const rows = [];
  const columns = [];
  while (stmt.step()) {
    const numColumns = stmt.columnCount;
    const row = {};
    for (let i = 0; i < numColumns; i++) {
      const columnName = stmt.getColumnName(i);
      row[columnName] = stmt.get(i);
    }
    rows.push(row);
    if (columns.length === 0) {
      for (let i = 0; i < numColumns; i++) {
        columns.push(stmt.getColumnName(i));
      }
    }
  }
  stmt.finalize();
  return { rows, columns };
}
function injectColumns(sql) {
  const createTableMatch = sql.match(/CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?["\`]?(\\w+)["\`]?\\s*\\(([^)]+)\\)/i);
  if (!createTableMatch) {
    return { sql, hasUserColumns: false };
  }
  const fullMatch = createTableMatch[0];
  const tableName = createTableMatch[1];
  const columnsStr = createTableMatch[2].trim();
  const columns = columnsStr.split(",").map((c) => c.trim());
  let hasId = false;
  let hasUpdatedAt = false;
  let hasDeleted = false;
  for (const c of columns) {
    const lowerC = c.toLowerCase();
    if (/^\\s*["\`]?id["\`]?\\s+/.test(c) || lowerC.includes("primary key")) {
      hasId = true;
    }
    if (lowerC.includes("updated_at")) {
      hasUpdatedAt = true;
    }
    if (lowerC.includes("deleted")) {
      hasDeleted = true;
    }
  }
  const hasUserColumns = hasId || hasUpdatedAt || hasDeleted;
  if (hasUserColumns) {
    return { sql, hasUserColumns: true };
  }
  const cleanColumns = columns.map((c) => c.replace(/\\s+/g, " ").trim()).join(", ");
  const systemColumns = "id TEXT PRIMARY KEY, updated_at INTEGER NOT NULL, deleted INTEGER NOT NULL DEFAULT 0";
  const isIfNotExists = /CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS/i.test(sql);
  const ifNotExistsStr = isIfNotExists ? "IF NOT EXISTS " : "";
  const newSql = \`CREATE TABLE \${ifNotExistsStr}\${tableName} (\${cleanColumns}, \${systemColumns})\`;
  return { sql: newSql, hasUserColumns: false };
}
function rewriteInsert(sql, tableName) {
  const insertMatch = sql.match(/INSERT\\s+INTO\\s+["\`]?(\\w+)["\`]?\\s*\\(([^)]+)\\)\\s*VALUES\\s*\\(([^)]+)\\)/i);
  if (!insertMatch) {
    return { sql, params: [], rowId: "" };
  }
  const originalColumns = insertMatch[2].split(",").map((c) => c.trim());
  const values = insertMatch[3].split(",").map((c) => c.trim());
  const userColumns = [];
  const userValues = [];
  for (let i = 0; i < originalColumns.length; i++) {
    const col = originalColumns[i];
    if (!col.toLowerCase().includes("id") && !col.toLowerCase().includes("updated_at") && !col.toLowerCase().includes("deleted")) {
      userColumns.push(col);
      userValues.push(values[i]);
    }
  }
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  const newColumns = [...userColumns, "id", "updated_at", "deleted"].join(", ");
  const newValues = [...userValues, \`'\${uuid}'\`, String(timestamp), "0"].join(", ");
  const newSql = \`INSERT INTO \${tableName} (\${newColumns}) VALUES (\${newValues})\`;
  return { sql: newSql, params: [], rowId: uuid };
}
function rewriteUpdate(sql, tableName) {
  const updateMatch = sql.match(/UPDATE\\s+["\`]?(\\w+)["\`]?\\s+SET\\s+([^W]+)(?:\\s+WHERE\\s+(.+))?/i);
  if (!updateMatch) {
    return { sql, params: [] };
  }
  const setClause = updateMatch[2].trim();
  const whereClause = updateMatch[3] ? \` WHERE \${updateMatch[3]}\` : "";
  const timestamp = Date.now();
  const setParts = setClause.split(",").map((part) => part.trim());
  const filteredParts = [];
  for (const part of setParts) {
    const col = part.split("=")[0].trim().toLowerCase();
    if (!col.includes("id") && !col.includes("updated_at") && !col.includes("deleted")) {
      filteredParts.push(part);
    }
  }
  const newSetClause = [...filteredParts, \`updated_at = \${timestamp}\`].join(", ");
  const newSql = \`UPDATE \${tableName} SET \${newSetClause}\${whereClause}\`;
  return { sql: newSql, params: [] };
}
function rewriteDelete(sql, tableName) {
  const deleteMatch = sql.match(/DELETE\\s+FROM\\s+["\`]?(\\w+)["\`]?\\s*(?:WHERE\\s+(.+))?/i);
  if (!deleteMatch) {
    return { sql, params: [] };
  }
  const timestamp = Date.now();
  const whereClause = deleteMatch[2] ? \`WHERE \${deleteMatch[2]}\` : "";
  const newSql = \`UPDATE \${tableName} SET deleted = 1, updated_at = \${timestamp} \${whereClause}\`;
  return { sql: newSql, params: [] };
}
function rewriteQuery(sql) {
  if (sql.trim().toUpperCase().startsWith("DELETE")) {
    return sql;
  }
  if (!/\\bFROM\\b/i.test(sql)) {
    return sql;
  }
  const hasWhere = /\\bWHERE\\b/i.test(sql);
  if (hasWhere) {
    return sql.replace(/\\bWHERE\\b/i, "WHERE deleted = 0 AND");
  } else {
    const insertPoint = sql.search(/\\b(ORDER\\s+BY|GROUP\\s+BY|LIMIT|HAVING|$)/i);
    if (insertPoint > 0) {
      return sql.slice(0, insertPoint) + " WHERE deleted = 0 " + sql.slice(insertPoint);
    }
    return sql + " WHERE deleted = 0";
  }
}
function processSql(sql) {
  const upperSql = sql.toUpperCase().trim();
  if (upperSql.startsWith("INSERT")) {
    const insertMatch = sql.match(/INSERT\\s+INTO\\s+["\`]?(\\w+)["\`]?/i);
    if (insertMatch) {
      const result = rewriteInsert(sql, insertMatch[1]);
      return {
        sql: result.sql,
        params: result.params,
        table: insertMatch[1],
        rowId: result.rowId,
        isMutation: true
      };
    }
  }
  if (upperSql.startsWith("UPDATE")) {
    const updateMatch = sql.match(/UPDATE\\s+["\`]?(\\w+)["\`]?/i);
    if (updateMatch) {
      const result = rewriteUpdate(sql, updateMatch[1]);
      return {
        sql: result.sql,
        params: result.params,
        table: updateMatch[1],
        isMutation: true
      };
    }
  }
  if (upperSql.startsWith("DELETE")) {
    const deleteMatch = sql.match(/DELETE\\s+FROM\\s+["\`]?(\\w+)["\`]?/i);
    if (deleteMatch) {
      const result = rewriteDelete(sql, deleteMatch[1]);
      return {
        sql: result.sql,
        params: result.params,
        table: deleteMatch[1],
        isMutation: true
      };
    }
  }
  return { sql: rewriteQuery(sql), params: [], isMutation: false };
}
async function mergeDatabasesAsync(localDb, remoteData, sqlite3Module) {
  const tempDb = new sqlite3Module.oo1.DB(":memory:");
  try {
    const remoteDb = new sqlite3Module.oo1.DB(":memory:");
    const sql = new TextDecoder().decode(remoteData);
    remoteDb.exec(sql);
    const localTables = execute(localDb, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%'").rows.map((r) => r.name);
    const remoteTables = execute(remoteDb, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%'").rows.map((r) => r.name);
    const allTables = /* @__PURE__ */ new Set([...localTables, ...remoteTables]);
    for (const tableName of allTables) {
      await mergeTable(localDb, remoteDb, tableName);
    }
    remoteDb.close();
  } finally {
    tempDb.close();
  }
}
async function mergeTable(localDb, remoteDb, tableName) {
  const localRowsResult = execute(localDb, \`SELECT * FROM \${tableName}\`);
  const remoteRowsResult = execute(remoteDb, \`SELECT * FROM \${tableName}\`);
  const rowsById = /* @__PURE__ */ new Map();
  for (const row of localRowsResult.rows) {
    const id = row.id;
    if (id) {
      rowsById.set(id, { source: "local", row });
    }
  }
  for (const row of remoteRowsResult.rows) {
    const id = row.id;
    if (!id) continue;
    const existing = rowsById.get(id);
    const remoteTimestamp = row.updated_at || 0;
    if (!existing) {
      rowsById.set(id, { source: "remote", row });
    } else {
      const localTimestamp = existing.row.updated_at || 0;
      if (remoteTimestamp > localTimestamp) {
        rowsById.set(id, { source: "remote", row });
      }
    }
  }
  const columns = localRowsResult.columns.filter(
    (c) => c !== "id" && c !== "updated_at" && c !== "deleted"
  );
  for (const [id, entry] of rowsById) {
    const row = entry.row;
    const isDeleted = row.deleted === 1 || row.deleted === true;
    if (isDeleted) {
      continue;
    }
    const timestamp = row.updated_at || Date.now();
    const existingRowResult = execute(localDb, \`SELECT id FROM \${tableName} WHERE id = ?\`, [id]);
    const userColumns = columns;
    const userValues = userColumns.map((c) => {
      const v2 = row[c];
      if (typeof v2 === "string") return \`'\${String(v2).replace(/'/g, "''")}'\`;
      if (v2 === null) return "NULL";
      return String(v2);
    });
    if (existingRowResult.rows.length > 0) {
      const updateColumns = userColumns.map((c) => \`\${c} = '\${String(row[c] || "").replace(/'/g, "''")}'\`).join(", ");
      localDb.exec(\`UPDATE \${tableName} SET \${updateColumns}, updated_at = \${timestamp} WHERE id = '\${id}'\`);
    } else {
      const allColumns = ["id", ...userColumns, "updated_at", "deleted"];
      const allValues = [\`'\${id}'\`, ...userValues, String(timestamp), "0"];
      localDb.exec(\`INSERT INTO \${tableName} (\${allColumns.join(", ")}) VALUES (\${allValues.join(", ")})\`);
    }
  }
}
async function handleRequest(request) {
  const { id, type, dbName, args } = request;
  try {
    let result;
    switch (type) {
      case "init": {
        await initSqlite();
        result = { opfsDir: sqlite3?.capi.sqlite3_wasmfs_opfs_dir?.() || "opfs" };
        break;
      }
      case "createDb": {
        createDb(dbName);
        result = { success: true };
        break;
      }
      case "deleteDb": {
        const db = databases.get(dbName);
        if (db) {
          db.close();
          databases.delete(dbName);
        }
        result = { success: true };
        break;
      }
      case "exec": {
        const db = databases.get(dbName);
        if (!db) throw new Error(\`Database \${dbName} not found\`);
        const sql = args[0];
        const params = args[1];
        const injectResult = injectColumns(sql);
        if (!injectResult.hasUserColumns && injectResult.sql !== sql) {
          db.exec(injectResult.sql);
          lastProcessedSql.set(dbName, injectResult.sql);
          lastAffectedRows.set(dbName, []);
          result = { rows: [], columns: [], affectedRows: [] };
        } else {
          const processed = processSql(sql);
          lastProcessedSql.set(dbName, processed.sql);
          if (processed.isMutation && processed.table) {
            let affectedIds = [];
            if (processed.rowId) {
              affectedIds = [processed.rowId];
            } else {
              const whereMatch = sql.match(/WHERE\\s+(.+)$/i);
              if (whereMatch) {
                const selectSql = \`SELECT id FROM \${processed.table} WHERE \${whereMatch[1]}\`;
                try {
                  const idsResult = execute(db, selectSql);
                  affectedIds = idsResult.rows.map((r) => r.id).filter(Boolean);
                } catch (e) {
                }
              }
            }
            const execResult = execute(db, processed.sql, params);
            const affectedRows = affectedIds.map((id2) => ({ id: id2, table: processed.table }));
            lastAffectedRows.set(dbName, affectedRows);
            result = { ...execResult, affectedRows };
          } else {
            lastAffectedRows.set(dbName, []);
            result = execute(db, processed.sql, params);
          }
        }
        break;
      }
      case "export": {
        const db = databases.get(dbName);
        if (!db) throw new Error(\`Database \${dbName} not found\`);
        result = Array.from(exportDatabase(db));
        break;
      }
      case "import": {
        const db = databases.get(dbName);
        if (!db) throw new Error(\`Database \${dbName} not found\`);
        const data = new Uint8Array(args[0]);
        await importDatabase(db, data);
        result = { success: true };
        break;
      }
      case "close": {
        const db = databases.get(dbName);
        if (db) {
          db.close();
          databases.delete(dbName);
        }
        result = { success: true };
        break;
      }
      case "getTables": {
        const db = databases.get(dbName);
        if (!db) throw new Error(\`Database \${dbName} not found\`);
        const resultSet = execute(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%'");
        result = { tables: resultSet.rows };
        break;
      }
      case "getTableData": {
        const db = databases.get(dbName);
        if (!db) throw new Error(\`Database \${dbName} not found\`);
        const tableName = args[0];
        const resultSet = execute(db, \`SELECT * FROM \${tableName} WHERE deleted = 0\`);
        result = { rows: resultSet.rows, columns: resultSet.columns };
        break;
      }
      case "merge": {
        const db = databases.get(dbName);
        if (!db) throw new Error(\`Database \${dbName} not found\`);
        const remoteData = new Uint8Array(args[0]);
        await mergeDatabasesAsync(db, remoteData, sqlite3);
        result = { success: true };
        break;
      }
      case "execRaw": {
        const db = databases.get(dbName);
        if (!db) throw new Error(\`Database \${dbName} not found\`);
        let sql = args[0];
        if (sql.toUpperCase().trim().startsWith("INSERT INTO")) {
          sql = sql.replace(/^INSERT\\s+INTO/i, "INSERT OR REPLACE INTO");
        }
        db.exec(sql);
        result = { success: true };
        break;
      }
      case "getLastProcessedSql": {
        result = lastProcessedSql.get(dbName) || "";
        break;
      }
      default:
        throw new Error(\`Unknown request type: \${type}\`);
    }
    return { id, type, success: true, result };
  } catch (error) {
    return { id, type, success: false, error: String(error) };
  }
}
self.onmessage = async (event) => {
  const request = event.data;
  const response = await handleRequest(request);
  self.postMessage(response);
};
self.onerror = (error) => {
  console.error("Worker error:", error);
};
`;
  }
});

// node_modules/peerjs-js-binarypack/dist/binarypack.mjs
function $e8379818650e2442$var$concatArrayBuffers(bufs) {
  let size = 0;
  for (const buf of bufs) size += buf.byteLength;
  const result = new Uint8Array(size);
  let offset = 0;
  for (const buf of bufs) {
    const view = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    result.set(view, offset);
    offset += buf.byteLength;
  }
  return result;
}
function $0cfd7828ad59115f$export$417857010dc9287f(data) {
  const unpacker = new $0cfd7828ad59115f$var$Unpacker(data);
  return unpacker.unpack();
}
function $0cfd7828ad59115f$export$2a703dbb0cb35339(data) {
  const packer = new $0cfd7828ad59115f$export$b9ec4b114aa40074();
  const res = packer.pack(data);
  if (res instanceof Promise) return res.then(() => packer.getBuffer());
  return packer.getBuffer();
}
var $e8379818650e2442$export$93654d4f2d6cd524, $0cfd7828ad59115f$var$Unpacker, $0cfd7828ad59115f$export$b9ec4b114aa40074;
var init_binarypack = __esm({
  "node_modules/peerjs-js-binarypack/dist/binarypack.mjs"() {
    $e8379818650e2442$export$93654d4f2d6cd524 = class {
      constructor() {
        this.encoder = new TextEncoder();
        this._pieces = [];
        this._parts = [];
      }
      append_buffer(data) {
        this.flush();
        this._parts.push(data);
      }
      append(data) {
        this._pieces.push(data);
      }
      flush() {
        if (this._pieces.length > 0) {
          const buf = new Uint8Array(this._pieces);
          this._parts.push(buf);
          this._pieces = [];
        }
      }
      toArrayBuffer() {
        const buffer = [];
        for (const part of this._parts) buffer.push(part);
        return $e8379818650e2442$var$concatArrayBuffers(buffer).buffer;
      }
    };
    $0cfd7828ad59115f$var$Unpacker = class {
      constructor(data) {
        this.index = 0;
        this.dataBuffer = data;
        this.dataView = new Uint8Array(this.dataBuffer);
        this.length = this.dataBuffer.byteLength;
      }
      unpack() {
        const type = this.unpack_uint8();
        if (type < 128) return type;
        else if ((type ^ 224) < 32) return (type ^ 224) - 32;
        let size;
        if ((size = type ^ 160) <= 15) return this.unpack_raw(size);
        else if ((size = type ^ 176) <= 15) return this.unpack_string(size);
        else if ((size = type ^ 144) <= 15) return this.unpack_array(size);
        else if ((size = type ^ 128) <= 15) return this.unpack_map(size);
        switch (type) {
          case 192:
            return null;
          case 193:
            return void 0;
          case 194:
            return false;
          case 195:
            return true;
          case 202:
            return this.unpack_float();
          case 203:
            return this.unpack_double();
          case 204:
            return this.unpack_uint8();
          case 205:
            return this.unpack_uint16();
          case 206:
            return this.unpack_uint32();
          case 207:
            return this.unpack_uint64();
          case 208:
            return this.unpack_int8();
          case 209:
            return this.unpack_int16();
          case 210:
            return this.unpack_int32();
          case 211:
            return this.unpack_int64();
          case 212:
            return void 0;
          case 213:
            return void 0;
          case 214:
            return void 0;
          case 215:
            return void 0;
          case 216:
            size = this.unpack_uint16();
            return this.unpack_string(size);
          case 217:
            size = this.unpack_uint32();
            return this.unpack_string(size);
          case 218:
            size = this.unpack_uint16();
            return this.unpack_raw(size);
          case 219:
            size = this.unpack_uint32();
            return this.unpack_raw(size);
          case 220:
            size = this.unpack_uint16();
            return this.unpack_array(size);
          case 221:
            size = this.unpack_uint32();
            return this.unpack_array(size);
          case 222:
            size = this.unpack_uint16();
            return this.unpack_map(size);
          case 223:
            size = this.unpack_uint32();
            return this.unpack_map(size);
        }
      }
      unpack_uint8() {
        const byte = this.dataView[this.index] & 255;
        this.index++;
        return byte;
      }
      unpack_uint16() {
        const bytes = this.read(2);
        const uint16 = (bytes[0] & 255) * 256 + (bytes[1] & 255);
        this.index += 2;
        return uint16;
      }
      unpack_uint32() {
        const bytes = this.read(4);
        const uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
        this.index += 4;
        return uint32;
      }
      unpack_uint64() {
        const bytes = this.read(8);
        const uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
        this.index += 8;
        return uint64;
      }
      unpack_int8() {
        const uint8 = this.unpack_uint8();
        return uint8 < 128 ? uint8 : uint8 - 256;
      }
      unpack_int16() {
        const uint16 = this.unpack_uint16();
        return uint16 < 32768 ? uint16 : uint16 - 65536;
      }
      unpack_int32() {
        const uint32 = this.unpack_uint32();
        return uint32 < 2 ** 31 ? uint32 : uint32 - 2 ** 32;
      }
      unpack_int64() {
        const uint64 = this.unpack_uint64();
        return uint64 < 2 ** 63 ? uint64 : uint64 - 2 ** 64;
      }
      unpack_raw(size) {
        if (this.length < this.index + size) throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${size} ${this.length}`);
        const buf = this.dataBuffer.slice(this.index, this.index + size);
        this.index += size;
        return buf;
      }
      unpack_string(size) {
        const bytes = this.read(size);
        let i = 0;
        let str = "";
        let c;
        let code;
        while (i < size) {
          c = bytes[i];
          if (c < 160) {
            code = c;
            i++;
          } else if ((c ^ 192) < 32) {
            code = (c & 31) << 6 | bytes[i + 1] & 63;
            i += 2;
          } else if ((c ^ 224) < 16) {
            code = (c & 15) << 12 | (bytes[i + 1] & 63) << 6 | bytes[i + 2] & 63;
            i += 3;
          } else {
            code = (c & 7) << 18 | (bytes[i + 1] & 63) << 12 | (bytes[i + 2] & 63) << 6 | bytes[i + 3] & 63;
            i += 4;
          }
          str += String.fromCodePoint(code);
        }
        this.index += size;
        return str;
      }
      unpack_array(size) {
        const objects = new Array(size);
        for (let i = 0; i < size; i++) objects[i] = this.unpack();
        return objects;
      }
      unpack_map(size) {
        const map = {};
        for (let i = 0; i < size; i++) {
          const key = this.unpack();
          map[key] = this.unpack();
        }
        return map;
      }
      unpack_float() {
        const uint32 = this.unpack_uint32();
        const sign = uint32 >> 31;
        const exp = (uint32 >> 23 & 255) - 127;
        const fraction = uint32 & 8388607 | 8388608;
        return (sign === 0 ? 1 : -1) * fraction * 2 ** (exp - 23);
      }
      unpack_double() {
        const h32 = this.unpack_uint32();
        const l32 = this.unpack_uint32();
        const sign = h32 >> 31;
        const exp = (h32 >> 20 & 2047) - 1023;
        const hfrac = h32 & 1048575 | 1048576;
        const frac = hfrac * 2 ** (exp - 20) + l32 * 2 ** (exp - 52);
        return (sign === 0 ? 1 : -1) * frac;
      }
      read(length) {
        const j = this.index;
        if (j + length <= this.length) return this.dataView.subarray(j, j + length);
        else throw new Error("BinaryPackFailure: read index out of range");
      }
    };
    $0cfd7828ad59115f$export$b9ec4b114aa40074 = class {
      getBuffer() {
        return this._bufferBuilder.toArrayBuffer();
      }
      pack(value) {
        if (typeof value === "string") this.pack_string(value);
        else if (typeof value === "number") {
          if (Math.floor(value) === value) this.pack_integer(value);
          else this.pack_double(value);
        } else if (typeof value === "boolean") {
          if (value === true) this._bufferBuilder.append(195);
          else if (value === false) this._bufferBuilder.append(194);
        } else if (value === void 0) this._bufferBuilder.append(192);
        else if (typeof value === "object") {
          if (value === null) this._bufferBuilder.append(192);
          else {
            const constructor = value.constructor;
            if (value instanceof Array) {
              const res = this.pack_array(value);
              if (res instanceof Promise) return res.then(() => this._bufferBuilder.flush());
            } else if (value instanceof ArrayBuffer) this.pack_bin(new Uint8Array(value));
            else if ("BYTES_PER_ELEMENT" in value) {
              const v = value;
              this.pack_bin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
            } else if (value instanceof Date) this.pack_string(value.toString());
            else if (value instanceof Blob) return value.arrayBuffer().then((buffer) => {
              this.pack_bin(new Uint8Array(buffer));
              this._bufferBuilder.flush();
            });
            else if (constructor == Object || constructor.toString().startsWith("class")) {
              const res = this.pack_object(value);
              if (res instanceof Promise) return res.then(() => this._bufferBuilder.flush());
            } else throw new Error(`Type "${constructor.toString()}" not yet supported`);
          }
        } else throw new Error(`Type "${typeof value}" not yet supported`);
        this._bufferBuilder.flush();
      }
      pack_bin(blob) {
        const length = blob.length;
        if (length <= 15) this.pack_uint8(160 + length);
        else if (length <= 65535) {
          this._bufferBuilder.append(218);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this._bufferBuilder.append(219);
          this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(blob);
      }
      pack_string(str) {
        const encoded = this._textEncoder.encode(str);
        const length = encoded.length;
        if (length <= 15) this.pack_uint8(176 + length);
        else if (length <= 65535) {
          this._bufferBuilder.append(216);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this._bufferBuilder.append(217);
          this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(encoded);
      }
      pack_array(ary) {
        const length = ary.length;
        if (length <= 15) this.pack_uint8(144 + length);
        else if (length <= 65535) {
          this._bufferBuilder.append(220);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this._bufferBuilder.append(221);
          this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index) => {
          if (index < length) {
            const res = this.pack(ary[index]);
            if (res instanceof Promise) return res.then(() => packNext(index + 1));
            return packNext(index + 1);
          }
        };
        return packNext(0);
      }
      pack_integer(num) {
        if (num >= -32 && num <= 127) this._bufferBuilder.append(num & 255);
        else if (num >= 0 && num <= 255) {
          this._bufferBuilder.append(204);
          this.pack_uint8(num);
        } else if (num >= -128 && num <= 127) {
          this._bufferBuilder.append(208);
          this.pack_int8(num);
        } else if (num >= 0 && num <= 65535) {
          this._bufferBuilder.append(205);
          this.pack_uint16(num);
        } else if (num >= -32768 && num <= 32767) {
          this._bufferBuilder.append(209);
          this.pack_int16(num);
        } else if (num >= 0 && num <= 4294967295) {
          this._bufferBuilder.append(206);
          this.pack_uint32(num);
        } else if (num >= -2147483648 && num <= 2147483647) {
          this._bufferBuilder.append(210);
          this.pack_int32(num);
        } else if (num >= -9223372036854776e3 && num <= 9223372036854776e3) {
          this._bufferBuilder.append(211);
          this.pack_int64(num);
        } else if (num >= 0 && num <= 18446744073709552e3) {
          this._bufferBuilder.append(207);
          this.pack_uint64(num);
        } else throw new Error("Invalid integer");
      }
      pack_double(num) {
        let sign = 0;
        if (num < 0) {
          sign = 1;
          num = -num;
        }
        const exp = Math.floor(Math.log(num) / Math.LN2);
        const frac0 = num / 2 ** exp - 1;
        const frac1 = Math.floor(frac0 * 2 ** 52);
        const b32 = 2 ** 32;
        const h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 1048575;
        const l32 = frac1 % b32;
        this._bufferBuilder.append(203);
        this.pack_int32(h32);
        this.pack_int32(l32);
      }
      pack_object(obj) {
        const keys = Object.keys(obj);
        const length = keys.length;
        if (length <= 15) this.pack_uint8(128 + length);
        else if (length <= 65535) {
          this._bufferBuilder.append(222);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this._bufferBuilder.append(223);
          this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index) => {
          if (index < keys.length) {
            const prop = keys[index];
            if (obj.hasOwnProperty(prop)) {
              this.pack(prop);
              const res = this.pack(obj[prop]);
              if (res instanceof Promise) return res.then(() => packNext(index + 1));
            }
            return packNext(index + 1);
          }
        };
        return packNext(0);
      }
      pack_uint8(num) {
        this._bufferBuilder.append(num);
      }
      pack_uint16(num) {
        this._bufferBuilder.append(num >> 8);
        this._bufferBuilder.append(num & 255);
      }
      pack_uint32(num) {
        const n = num & 4294967295;
        this._bufferBuilder.append((n & 4278190080) >>> 24);
        this._bufferBuilder.append((n & 16711680) >>> 16);
        this._bufferBuilder.append((n & 65280) >>> 8);
        this._bufferBuilder.append(n & 255);
      }
      pack_uint64(num) {
        const high = num / 2 ** 32;
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 4278190080) >>> 24);
        this._bufferBuilder.append((high & 16711680) >>> 16);
        this._bufferBuilder.append((high & 65280) >>> 8);
        this._bufferBuilder.append(high & 255);
        this._bufferBuilder.append((low & 4278190080) >>> 24);
        this._bufferBuilder.append((low & 16711680) >>> 16);
        this._bufferBuilder.append((low & 65280) >>> 8);
        this._bufferBuilder.append(low & 255);
      }
      pack_int8(num) {
        this._bufferBuilder.append(num & 255);
      }
      pack_int16(num) {
        this._bufferBuilder.append((num & 65280) >> 8);
        this._bufferBuilder.append(num & 255);
      }
      pack_int32(num) {
        this._bufferBuilder.append(num >>> 24 & 255);
        this._bufferBuilder.append((num & 16711680) >>> 16);
        this._bufferBuilder.append((num & 65280) >>> 8);
        this._bufferBuilder.append(num & 255);
      }
      pack_int64(num) {
        const high = Math.floor(num / 2 ** 32);
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 4278190080) >>> 24);
        this._bufferBuilder.append((high & 16711680) >>> 16);
        this._bufferBuilder.append((high & 65280) >>> 8);
        this._bufferBuilder.append(high & 255);
        this._bufferBuilder.append((low & 4278190080) >>> 24);
        this._bufferBuilder.append((low & 16711680) >>> 16);
        this._bufferBuilder.append((low & 65280) >>> 8);
        this._bufferBuilder.append(low & 255);
      }
      constructor() {
        this._bufferBuilder = new (0, $e8379818650e2442$export$93654d4f2d6cd524)();
        this._textEncoder = new TextEncoder();
      }
    };
  }
});

// node_modules/webrtc-adapter/src/js/utils.js
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseFloat(match[pos], 10);
}
function wrapPeerConnectionEvent(window2, eventNameToWrap, wrapper) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  const proto = window2.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e) => {
      const modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };
    this._eventMap = this._eventMap || {};
    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = /* @__PURE__ */ new Map();
    }
    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
    return nativeAddEventListener.apply(this, [
      nativeEventName,
      wrappedCallback
    ]);
  };
  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
    this._eventMap[eventNameToWrap].delete(cb);
    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }
    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }
    return nativeRemoveEventListener.apply(this, [
      nativeEventName,
      unwrappedCb
    ]);
  };
  Object.defineProperty(proto, "on" + eventNameToWrap, {
    get() {
      return this["_on" + eventNameToWrap];
    },
    set(cb) {
      if (this["_on" + eventNameToWrap]) {
        this.removeEventListener(
          eventNameToWrap,
          this["_on" + eventNameToWrap]
        );
        delete this["_on" + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(
          eventNameToWrap,
          this["_on" + eventNameToWrap] = cb
        );
      }
    },
    enumerable: true,
    configurable: true
  });
}
function disableLog(bool) {
  if (typeof bool !== "boolean") {
    return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
  }
  logDisabled_ = bool;
  return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
}
function disableWarnings(bool) {
  if (typeof bool !== "boolean") {
    return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
  }
  deprecationWarnings_ = !bool;
  return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
}
function log() {
  if (typeof window === "object") {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== "undefined" && typeof console.log === "function") {
      console.log.apply(console, arguments);
    }
  }
}
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
}
function detectBrowser(window2) {
  const result = { browser: null, version: null };
  if (typeof window2 === "undefined" || !window2.navigator || !window2.navigator.userAgent) {
    result.browser = "Not a browser.";
    return result;
  }
  const { navigator: navigator2 } = window2;
  if (navigator2.userAgentData && navigator2.userAgentData.brands) {
    const chromium = navigator2.userAgentData.brands.find((brand) => {
      return brand.brand === "Chromium";
    });
    if (chromium) {
      return { browser: "chrome", version: parseInt(chromium.version, 10) };
    }
  }
  if (navigator2.mozGetUserMedia) {
    result.browser = "firefox";
    result.version = parseInt(extractVersion(
      navigator2.userAgent,
      /Firefox\/(\d+)\./,
      1
    ));
  } else if (navigator2.webkitGetUserMedia || window2.isSecureContext === false && window2.webkitRTCPeerConnection) {
    result.browser = "chrome";
    result.version = parseInt(extractVersion(
      navigator2.userAgent,
      /Chrom(e|ium)\/(\d+)\./,
      2
    ));
  } else if (window2.RTCPeerConnection && navigator2.userAgent.match(/AppleWebKit\/(\d+)\./)) {
    result.browser = "safari";
    result.version = parseInt(extractVersion(
      navigator2.userAgent,
      /AppleWebKit\/(\d+)\./,
      1
    ));
    result.supportsUnifiedPlan = window2.RTCRtpTransceiver && "currentDirection" in window2.RTCRtpTransceiver.prototype;
    result._safariVersion = extractVersion(
      navigator2.userAgent,
      /Version\/(\d+(\.?\d+))/,
      1
    );
  } else {
    result.browser = "Not a supported browser.";
    return result;
  }
  return result;
}
function isObject(val) {
  return Object.prototype.toString.call(val) === "[object Object]";
}
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }
  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === void 0 || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, { [key]: value });
  }, {});
}
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach((name) => {
    if (name.endsWith("Id")) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith("Ids")) {
      base[name].forEach((id) => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
  const filteredResult = /* @__PURE__ */ new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach((value) => {
    if (value.type === "track" && value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach((trackStat) => {
    result.forEach((stats) => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}
var logDisabled_, deprecationWarnings_;
var init_utils = __esm({
  "node_modules/webrtc-adapter/src/js/utils.js"() {
    "use strict";
    logDisabled_ = true;
    deprecationWarnings_ = true;
  }
});

// node_modules/webrtc-adapter/src/js/chrome/getusermedia.js
function shimGetUserMedia(window2, browserDetails) {
  const navigator2 = window2 && window2.navigator;
  if (!navigator2.mediaDevices) {
    return;
  }
  const constraintsToChrome_ = function(c) {
    if (typeof c !== "object" || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach((key) => {
      if (key === "require" || key === "advanced" || key === "mediaSource") {
        return;
      }
      const r = typeof c[key] === "object" ? c[key] : { ideal: c[key] };
      if (r.exact !== void 0 && typeof r.exact === "number") {
        r.min = r.max = r.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name === "deviceId" ? "sourceId" : name;
      };
      if (r.ideal !== void 0) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r.ideal === "number") {
          oc[oldname_("min", key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_("max", key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_("", key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== void 0 && typeof r.exact !== "number") {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_("", key)] = r.exact;
      } else {
        ["min", "max"].forEach((mix) => {
          if (r[mix] !== void 0) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };
  const shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === "object") {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, "autoGainControl", "googAutoGainControl");
      remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === "object") {
      let face = constraints.video.facingMode;
      face = face && (typeof face === "object" ? face : { ideal: face });
      const getSupportedFacingModeLies = browserDetails.version < 66;
      if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator2.mediaDevices.getSupportedConstraints && navigator2.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === "environment" || face.ideal === "environment") {
          matches = ["back", "rear"];
        } else if (face.exact === "user" || face.ideal === "user") {
          matches = ["front"];
        }
        if (matches) {
          return navigator2.mediaDevices.enumerateDevices().then((devices) => {
            devices = devices.filter((d) => d.kind === "videoinput");
            let dev = devices.find((d) => matches.some((match) => d.label.toLowerCase().includes(match)));
            if (!dev && devices.length && matches.includes("back")) {
              dev = devices[devices.length - 1];
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging("chrome: " + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging("chrome: " + JSON.stringify(constraints));
    return func(constraints);
  };
  const shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: "NotAllowedError",
        PermissionDismissedError: "NotAllowedError",
        InvalidStateError: "NotAllowedError",
        DevicesNotFoundError: "NotFoundError",
        ConstraintNotSatisfiedError: "OverconstrainedError",
        TrackStartError: "NotReadableError",
        MediaDeviceFailedDueToShutdown: "NotAllowedError",
        MediaDeviceKillSwitchOn: "NotAllowedError",
        TabCaptureError: "AbortError",
        ScreenCaptureError: "AbortError",
        DeviceCaptureError: "AbortError"
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString() {
        return this.name + (this.message && ": ") + this.message;
      }
    };
  };
  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, (c) => {
      navigator2.webkitGetUserMedia(c, onSuccess, (e) => {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };
  navigator2.getUserMedia = getUserMedia_.bind(navigator2);
  if (navigator2.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
    navigator2.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, (c) => origGetUserMedia(c).then((stream) => {
        if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          throw new DOMException("", "NotFoundError");
        }
        return stream;
      }, (e) => Promise.reject(shimError_(e))));
    };
  }
}
var logging;
var init_getusermedia = __esm({
  "node_modules/webrtc-adapter/src/js/chrome/getusermedia.js"() {
    "use strict";
    init_utils();
    logging = log;
  }
});

// node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
var chrome_shim_exports = {};
__export(chrome_shim_exports, {
  fixNegotiationNeeded: () => fixNegotiationNeeded,
  shimAddTrackRemoveTrack: () => shimAddTrackRemoveTrack,
  shimAddTrackRemoveTrackWithNative: () => shimAddTrackRemoveTrackWithNative,
  shimGetSendersWithDtmf: () => shimGetSendersWithDtmf,
  shimGetUserMedia: () => shimGetUserMedia,
  shimMediaStream: () => shimMediaStream,
  shimOnTrack: () => shimOnTrack,
  shimPeerConnection: () => shimPeerConnection,
  shimSenderReceiverGetStats: () => shimSenderReceiverGetStats
});
function shimMediaStream(window2) {
  window2.MediaStream = window2.MediaStream || window2.webkitMediaStream;
}
function shimOnTrack(window2) {
  if (typeof window2 === "object" && window2.RTCPeerConnection && !("ontrack" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "ontrack", {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener("track", this._ontrack);
        }
        this.addEventListener("track", this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      if (!this._ontrackpoly) {
        this._ontrackpoly = (e) => {
          e.stream.addEventListener("addtrack", (te) => {
            let receiver;
            if (window2.RTCPeerConnection.prototype.getReceivers) {
              receiver = this.getReceivers().find((r) => r.track && r.track.id === te.track.id);
            } else {
              receiver = { track: te.track };
            }
            const event = new Event("track");
            event.track = te.track;
            event.receiver = receiver;
            event.transceiver = { receiver };
            event.streams = [e.stream];
            this.dispatchEvent(event);
          });
          e.stream.getTracks().forEach((track) => {
            let receiver;
            if (window2.RTCPeerConnection.prototype.getReceivers) {
              receiver = this.getReceivers().find((r) => r.track && r.track.id === track.id);
            } else {
              receiver = { track };
            }
            const event = new Event("track");
            event.track = track;
            event.receiver = receiver;
            event.transceiver = { receiver };
            event.streams = [e.stream];
            this.dispatchEvent(event);
          });
        };
        this.addEventListener("addstream", this._ontrackpoly);
      }
      return origSetRemoteDescription.apply(this, arguments);
    };
  } else {
    wrapPeerConnectionEvent(window2, "track", (e) => {
      if (!e.transceiver) {
        Object.defineProperty(
          e,
          "transceiver",
          { value: { receiver: e.receiver } }
        );
      }
      return e;
    });
  }
}
function shimGetSendersWithDtmf(window2) {
  if (typeof window2 === "object" && window2.RTCPeerConnection && !("getSenders" in window2.RTCPeerConnection.prototype) && "createDTMFSender" in window2.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === void 0) {
            if (track.kind === "audio") {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };
    if (!window2.RTCPeerConnection.prototype.getSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice();
      };
      const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
      window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        let sender = origAddTrack.apply(this, arguments);
        if (!sender) {
          sender = shimSenderWithDtmf(this, track);
          this._senders.push(sender);
        }
        return sender;
      };
      const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
      window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        origRemoveTrack.apply(this, arguments);
        const idx = this._senders.indexOf(sender);
        if (idx !== -1) {
          this._senders.splice(idx, 1);
        }
      };
    }
    const origAddStream = window2.RTCPeerConnection.prototype.addStream;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach((track) => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };
    const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._senders = this._senders || [];
      origRemoveStream.apply(this, [stream]);
      stream.getTracks().forEach((track) => {
        const sender = this._senders.find((s) => s.track === track);
        if (sender) {
          this._senders.splice(this._senders.indexOf(sender), 1);
        }
      });
    };
  } else if (typeof window2 === "object" && window2.RTCPeerConnection && "getSenders" in window2.RTCPeerConnection.prototype && "createDTMFSender" in window2.RTCPeerConnection.prototype && window2.RTCRtpSender && !("dtmf" in window2.RTCRtpSender.prototype)) {
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach((sender) => sender._pc = this);
      return senders;
    };
    Object.defineProperty(window2.RTCRtpSender.prototype, "dtmf", {
      get() {
        if (this._dtmf === void 0) {
          if (this.track.kind === "audio") {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}
function shimSenderReceiverGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender && window2.RTCRtpReceiver)) {
    return;
  }
  if (!("getStats" in window2.RTCRtpSender.prototype)) {
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender) => sender._pc = this);
        return senders;
      };
    }
    const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window2.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then((result) => (
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        filterStats(result, sender.track, true)
      ));
    };
  }
  if (!("getStats" in window2.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        const receivers = origGetReceivers.apply(this, []);
        receivers.forEach((receiver) => receiver._pc = this);
        return receivers;
      };
    }
    wrapPeerConnectionEvent(window2, "track", (e) => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window2.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then((result) => filterStats(result, receiver.track, false));
    };
  }
  if (!("getStats" in window2.RTCRtpSender.prototype && "getStats" in window2.RTCRtpReceiver.prototype)) {
    return;
  }
  const origGetStats = window2.RTCPeerConnection.prototype.getStats;
  window2.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 && arguments[0] instanceof window2.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach((s) => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach((r) => {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }
        return r.track === track;
      });
      if (err || sender && receiver) {
        return Promise.reject(new DOMException(
          "There are more than one sender or receiver for the track.",
          "InvalidAccessError"
        ));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException(
        "There is no sender or receiver for the track.",
        "InvalidAccessError"
      ));
    }
    return origGetStats.apply(this, arguments);
  };
}
function shimAddTrackRemoveTrackWithNative(window2) {
  window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    return Object.keys(this._shimmedLocalStreams).map((streamId) => this._shimmedLocalStreams[streamId][0]);
  };
  const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
  window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (!stream) {
      return origAddTrack.apply(this, arguments);
    }
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    const sender = origAddTrack.apply(this, arguments);
    if (!this._shimmedLocalStreams[stream.id]) {
      this._shimmedLocalStreams[stream.id] = [stream, sender];
    } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
      this._shimmedLocalStreams[stream.id].push(sender);
    }
    return sender;
  };
  const origAddStream = window2.RTCPeerConnection.prototype.addStream;
  window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    stream.getTracks().forEach((track) => {
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders().filter((newSender) => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };
  const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    delete this._shimmedLocalStreams[stream.id];
    return origRemoveStream.apply(this, arguments);
  };
  const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
  window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    if (sender) {
      Object.keys(this._shimmedLocalStreams).forEach((streamId) => {
        const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
        if (idx !== -1) {
          this._shimmedLocalStreams[streamId].splice(idx, 1);
        }
        if (this._shimmedLocalStreams[streamId].length === 1) {
          delete this._shimmedLocalStreams[streamId];
        }
      });
    }
    return origRemoveTrack.apply(this, arguments);
  };
}
function shimAddTrackRemoveTrack(window2, browserDetails) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (window2.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window2);
  }
  const origGetLocalStreams = window2.RTCPeerConnection.prototype.getLocalStreams;
  window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    const nativeStreams = origGetLocalStreams.apply(this);
    this._reverseStreams = this._reverseStreams || {};
    return nativeStreams.map((stream) => this._reverseStreams[stream.id]);
  };
  const origAddStream = window2.RTCPeerConnection.prototype.addStream;
  window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    stream.getTracks().forEach((track) => {
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
      }
    });
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window2.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };
  const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
    delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
    delete this._streams[stream.id];
  };
  window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (this.signalingState === "closed") {
      throw new DOMException(
        "The RTCPeerConnection's signalingState is 'closed'.",
        "InvalidStateError"
      );
    }
    const streams = [].slice.call(arguments, 1);
    if (streams.length !== 1 || !streams[0].getTracks().find((t) => t === track)) {
      throw new DOMException(
        "The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.",
        "NotSupportedError"
      );
    }
    const alreadyExists = this.getSenders().find((s) => s.track === track);
    if (alreadyExists) {
      throw new DOMException(
        "Track already exists.",
        "InvalidAccessError"
      );
    }
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    const oldStream = this._streams[stream.id];
    if (oldStream) {
      oldStream.addTrack(track);
      Promise.resolve().then(() => {
        this.dispatchEvent(new Event("negotiationneeded"));
      });
    } else {
      const newStream = new window2.MediaStream([track]);
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      this.addStream(newStream);
    }
    return this.getSenders().find((s) => s.track === track);
  };
  function replaceInternalStreamId(pc, description) {
    let sdp2 = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach((internalId) => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp2 = sdp2.replace(
        new RegExp(internalStream.id, "g"),
        externalStream.id
      );
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp2
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp2 = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach((internalId) => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp2 = sdp2.replace(
        new RegExp(externalStream.id, "g"),
        internalStream.id
      );
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp2
    });
  }
  ["createOffer", "createAnswer"].forEach(function(method) {
    const nativeMethod = window2.RTCPeerConnection.prototype[method];
    const methodObj = { [method]() {
      const args = arguments;
      const isLegacyCall = arguments.length && typeof arguments[0] === "function";
      if (isLegacyCall) {
        return nativeMethod.apply(this, [
          (description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          },
          (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          },
          arguments[2]
        ]);
      }
      return nativeMethod.apply(this, arguments).then((description) => replaceInternalStreamId(this, description));
    } };
    window2.RTCPeerConnection.prototype[method] = methodObj[method];
  });
  const origSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
  window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    if (!arguments.length || !arguments[0].type) {
      return origSetLocalDescription.apply(this, arguments);
    }
    arguments[0] = replaceExternalStreamId(this, arguments[0]);
    return origSetLocalDescription.apply(this, arguments);
  };
  const origLocalDescription = Object.getOwnPropertyDescriptor(
    window2.RTCPeerConnection.prototype,
    "localDescription"
  );
  Object.defineProperty(
    window2.RTCPeerConnection.prototype,
    "localDescription",
    {
      get() {
        const description = origLocalDescription.get.apply(this);
        if (description.type === "") {
          return description;
        }
        return replaceInternalStreamId(this, description);
      }
    }
  );
  window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    if (this.signalingState === "closed") {
      throw new DOMException(
        "The RTCPeerConnection's signalingState is 'closed'.",
        "InvalidStateError"
      );
    }
    if (!sender._pc) {
      throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
    }
    const isLocal = sender._pc === this;
    if (!isLocal) {
      throw new DOMException(
        "Sender was not created by this connection.",
        "InvalidAccessError"
      );
    }
    this._streams = this._streams || {};
    let stream;
    Object.keys(this._streams).forEach((streamid) => {
      const hasTrack = this._streams[streamid].getTracks().find((track) => sender.track === track);
      if (hasTrack) {
        stream = this._streams[streamid];
      }
    });
    if (stream) {
      if (stream.getTracks().length === 1) {
        this.removeStream(this._reverseStreams[stream.id]);
      } else {
        stream.removeTrack(sender.track);
      }
      this.dispatchEvent(new Event("negotiationneeded"));
    }
  };
}
function shimPeerConnection(window2, browserDetails) {
  if (!window2.RTCPeerConnection && window2.webkitRTCPeerConnection) {
    window2.RTCPeerConnection = window2.webkitRTCPeerConnection;
  }
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (browserDetails.version < 53) {
    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = { [method]() {
        arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      } };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  }
}
function fixNegotiationNeeded(window2, browserDetails) {
  wrapPeerConnectionEvent(window2, "negotiationneeded", (e) => {
    const pc = e.target;
    if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === "plan-b") {
      if (pc.signalingState !== "stable") {
        return;
      }
    }
    return e;
  });
}
var init_chrome_shim = __esm({
  "node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js"() {
    "use strict";
    init_utils();
    init_getusermedia();
  }
});

// node_modules/webrtc-adapter/src/js/firefox/getusermedia.js
function shimGetUserMedia2(window2, browserDetails) {
  const navigator2 = window2 && window2.navigator;
  const MediaStreamTrack = window2 && window2.MediaStreamTrack;
  navigator2.getUserMedia = function(constraints, onSuccess, onError) {
    deprecated(
      "navigator.getUserMedia",
      "navigator.mediaDevices.getUserMedia"
    );
    navigator2.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
  if (!(browserDetails.version > 55 && "autoGainControl" in navigator2.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };
    const nativeGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
    navigator2.mediaDevices.getUserMedia = function(c) {
      if (typeof c === "object" && typeof c.audio === "object") {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, "autoGainControl", "mozAutoGainControl");
        remap(c.audio, "noiseSuppression", "mozNoiseSuppression");
      }
      return nativeGetUserMedia(c);
    };
    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, "mozAutoGainControl", "autoGainControl");
        remap(obj, "mozNoiseSuppression", "noiseSuppression");
        return obj;
      };
    }
    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      const nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === "audio" && typeof c === "object") {
          c = JSON.parse(JSON.stringify(c));
          remap(c, "autoGainControl", "mozAutoGainControl");
          remap(c, "noiseSuppression", "mozNoiseSuppression");
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}
var init_getusermedia2 = __esm({
  "node_modules/webrtc-adapter/src/js/firefox/getusermedia.js"() {
    "use strict";
    init_utils();
  }
});

// node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js
function shimGetDisplayMedia(window2, preferredMediaSource) {
  if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
    return;
  }
  if (!window2.navigator.mediaDevices) {
    return;
  }
  window2.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
    if (!(constraints && constraints.video)) {
      const err = new DOMException("getDisplayMedia without video constraints is undefined");
      err.name = "NotFoundError";
      err.code = 8;
      return Promise.reject(err);
    }
    if (constraints.video === true) {
      constraints.video = { mediaSource: preferredMediaSource };
    } else {
      constraints.video.mediaSource = preferredMediaSource;
    }
    return window2.navigator.mediaDevices.getUserMedia(constraints);
  };
}
var init_getdisplaymedia = __esm({
  "node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js"() {
    "use strict";
  }
});

// node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
var firefox_shim_exports = {};
__export(firefox_shim_exports, {
  shimAddTransceiver: () => shimAddTransceiver,
  shimCreateAnswer: () => shimCreateAnswer,
  shimCreateOffer: () => shimCreateOffer,
  shimGetDisplayMedia: () => shimGetDisplayMedia,
  shimGetParameters: () => shimGetParameters,
  shimGetUserMedia: () => shimGetUserMedia2,
  shimOnTrack: () => shimOnTrack2,
  shimPeerConnection: () => shimPeerConnection2,
  shimRTCDataChannel: () => shimRTCDataChannel,
  shimReceiverGetStats: () => shimReceiverGetStats,
  shimRemoveStream: () => shimRemoveStream,
  shimSenderGetStats: () => shimSenderGetStats
});
function shimOnTrack2(window2) {
  if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
    Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return { receiver: this.receiver };
      }
    });
  }
}
function shimPeerConnection2(window2, browserDetails) {
  if (typeof window2 !== "object" || !(window2.RTCPeerConnection || window2.mozRTCPeerConnection)) {
    return;
  }
  if (!window2.RTCPeerConnection && window2.mozRTCPeerConnection) {
    window2.RTCPeerConnection = window2.mozRTCPeerConnection;
  }
  if (browserDetails.version < 53) {
    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = { [method]() {
        arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      } };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  }
  const modernStatsTypes = {
    inboundrtp: "inbound-rtp",
    outboundrtp: "outbound-rtp",
    candidatepair: "candidate-pair",
    localcandidate: "local-candidate",
    remotecandidate: "remote-candidate"
  };
  const nativeGetStats = window2.RTCPeerConnection.prototype.getStats;
  window2.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null]).then((stats) => {
      if (browserDetails.version < 53 && !onSucc) {
        try {
          stats.forEach((stat) => {
            stat.type = modernStatsTypes[stat.type] || stat.type;
          });
        } catch (e) {
          if (e.name !== "TypeError") {
            throw e;
          }
          stats.forEach((stat, i) => {
            stats.set(i, Object.assign({}, stat, {
              type: modernStatsTypes[stat.type] || stat.type
            }));
          });
        }
      }
      return stats;
    }).then(onSucc, onErr);
  };
}
function shimSenderGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
    return;
  }
  if (window2.RTCRtpSender && "getStats" in window2.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach((sender) => sender._pc = this);
      return senders;
    };
  }
  const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window2.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
  };
}
function shimReceiverGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
    return;
  }
  if (window2.RTCRtpSender && "getStats" in window2.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach((receiver) => receiver._pc = this);
      return receivers;
    };
  }
  wrapPeerConnectionEvent(window2, "track", (e) => {
    e.receiver._pc = e.srcElement;
    return e;
  });
  window2.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}
function shimRemoveStream(window2) {
  if (!window2.RTCPeerConnection || "removeStream" in window2.RTCPeerConnection.prototype) {
    return;
  }
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    deprecated("removeStream", "removeTrack");
    this.getSenders().forEach((sender) => {
      if (sender.track && stream.getTracks().includes(sender.track)) {
        this.removeTrack(sender);
      }
    });
  };
}
function shimRTCDataChannel(window2) {
  if (window2.DataChannel && !window2.RTCDataChannel) {
    window2.RTCDataChannel = window2.DataChannel;
  }
}
function shimAddTransceiver(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window2.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window2.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
      this.setParametersPromises = [];
      let sendEncodings = arguments[1] && arguments[1].sendEncodings;
      if (sendEncodings === void 0) {
        sendEncodings = [];
      }
      sendEncodings = [...sendEncodings];
      const shouldPerformCheck = sendEncodings.length > 0;
      if (shouldPerformCheck) {
        sendEncodings.forEach((encodingParam) => {
          if ("rid" in encodingParam) {
            const ridRegex = /^[a-z0-9]{0,16}$/i;
            if (!ridRegex.test(encodingParam.rid)) {
              throw new TypeError("Invalid RID value provided.");
            }
          }
          if ("scaleResolutionDownBy" in encodingParam) {
            if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1)) {
              throw new RangeError("scale_resolution_down_by must be >= 1.0");
            }
          }
          if ("maxFramerate" in encodingParam) {
            if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
              throw new RangeError("max_framerate must be >= 0.0");
            }
          }
        });
      }
      const transceiver = origAddTransceiver.apply(this, arguments);
      if (shouldPerformCheck) {
        const { sender } = transceiver;
        const params = sender.getParameters();
        if (!("encodings" in params) || // Avoid being fooled by patched getParameters() below.
        params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
          params.encodings = sendEncodings;
          sender.sendEncodings = sendEncodings;
          this.setParametersPromises.push(
            sender.setParameters(params).then(() => {
              delete sender.sendEncodings;
            }).catch(() => {
              delete sender.sendEncodings;
            })
          );
        }
      }
      return transceiver;
    };
  }
}
function shimGetParameters(window2) {
  if (!(typeof window2 === "object" && window2.RTCRtpSender)) {
    return;
  }
  const origGetParameters = window2.RTCRtpSender.prototype.getParameters;
  if (origGetParameters) {
    window2.RTCRtpSender.prototype.getParameters = function getParameters() {
      const params = origGetParameters.apply(this, arguments);
      if (!("encodings" in params)) {
        params.encodings = [].concat(this.sendEncodings || [{}]);
      }
      return params;
    };
  }
}
function shimCreateOffer(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
  window2.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(() => {
        return origCreateOffer.apply(this, arguments);
      }).finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateOffer.apply(this, arguments);
  };
}
function shimCreateAnswer(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window2.RTCPeerConnection.prototype.createAnswer;
  window2.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(() => {
        return origCreateAnswer.apply(this, arguments);
      }).finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}
var init_firefox_shim = __esm({
  "node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js"() {
    "use strict";
    init_utils();
    init_getusermedia2();
    init_getdisplaymedia();
  }
});

// node_modules/webrtc-adapter/src/js/safari/safari_shim.js
var safari_shim_exports = {};
__export(safari_shim_exports, {
  shimAudioContext: () => shimAudioContext,
  shimCallbacksAPI: () => shimCallbacksAPI,
  shimConstraints: () => shimConstraints,
  shimCreateOfferLegacy: () => shimCreateOfferLegacy,
  shimGetUserMedia: () => shimGetUserMedia3,
  shimLocalStreamsAPI: () => shimLocalStreamsAPI,
  shimRTCIceServerUrls: () => shimRTCIceServerUrls,
  shimRemoteStreamsAPI: () => shimRemoteStreamsAPI,
  shimTrackEventTransceiver: () => shimTrackEventTransceiver
});
function shimLocalStreamsAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  if (!("getLocalStreams" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      return this._localStreams;
    };
  }
  if (!("addStream" in window2.RTCPeerConnection.prototype)) {
    const _addTrack = window2.RTCPeerConnection.prototype.addTrack;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      stream.getAudioTracks().forEach((track) => _addTrack.call(
        this,
        track,
        stream
      ));
      stream.getVideoTracks().forEach((track) => _addTrack.call(
        this,
        track,
        stream
      ));
    };
    window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
      if (streams) {
        streams.forEach((stream) => {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
        });
      }
      return _addTrack.apply(this, arguments);
    };
  }
  if (!("removeStream" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      const index = this._localStreams.indexOf(stream);
      if (index === -1) {
        return;
      }
      this._localStreams.splice(index, 1);
      const tracks = stream.getTracks();
      this.getSenders().forEach((sender) => {
        if (tracks.includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
  }
}
function shimRemoteStreamsAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  if (!("getRemoteStreams" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
      return this._remoteStreams ? this._remoteStreams : [];
    };
  }
  if (!("onaddstream" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "onaddstream", {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener("addstream", this._onaddstream);
          this.removeEventListener("track", this._onaddstreampoly);
        }
        this.addEventListener("addstream", this._onaddstream = f);
        this.addEventListener("track", this._onaddstreampoly = (e) => {
          e.streams.forEach((stream) => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event("addstream");
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      const pc = this;
      if (!this._onaddstreampoly) {
        this.addEventListener("track", this._onaddstreampoly = function(e) {
          e.streams.forEach((stream) => {
            if (!pc._remoteStreams) {
              pc._remoteStreams = [];
            }
            if (pc._remoteStreams.indexOf(stream) >= 0) {
              return;
            }
            pc._remoteStreams.push(stream);
            const event = new Event("addstream");
            event.stream = stream;
            pc.dispatchEvent(event);
          });
        });
      }
      return origSetRemoteDescription.apply(pc, arguments);
    };
  }
}
function shimCallbacksAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  const prototype = window2.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;
  prototype.createOffer = function createOffer(successCallback, failureCallback) {
    const options = arguments.length >= 2 ? arguments[2] : arguments[0];
    const promise = origCreateOffer.apply(this, [options]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
    const options = arguments.length >= 2 ? arguments[2] : arguments[0];
    const promise = origCreateAnswer.apply(this, [options]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;
  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;
  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}
function shimGetUserMedia3(window2) {
  const navigator2 = window2 && window2.navigator;
  if (navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
    const mediaDevices = navigator2.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator2.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }
  if (!navigator2.getUserMedia && navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
    navigator2.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator2.mediaDevices.getUserMedia(constraints).then(cb, errcb);
    }.bind(navigator2);
  }
}
function shimConstraints(constraints) {
  if (constraints && constraints.video !== void 0) {
    return Object.assign(
      {},
      constraints,
      { video: compactObject(constraints.video) }
    );
  }
  return constraints;
}
function shimRTCIceServerUrls(window2) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  const OrigPeerConnection = window2.RTCPeerConnection;
  window2.RTCPeerConnection = function RTCPeerConnection2(pcConfig, pcConstraints) {
    if (pcConfig && pcConfig.iceServers) {
      const newIceServers = [];
      for (let i = 0; i < pcConfig.iceServers.length; i++) {
        let server = pcConfig.iceServers[i];
        if (server.urls === void 0 && server.url) {
          deprecated("RTCIceServer.url", "RTCIceServer.urls");
          server = JSON.parse(JSON.stringify(server));
          server.urls = server.url;
          delete server.url;
          newIceServers.push(server);
        } else {
          newIceServers.push(pcConfig.iceServers[i]);
        }
      }
      pcConfig.iceServers = newIceServers;
    }
    return new OrigPeerConnection(pcConfig, pcConstraints);
  };
  window2.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  if ("generateCertificate" in OrigPeerConnection) {
    Object.defineProperty(window2.RTCPeerConnection, "generateCertificate", {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}
function shimTrackEventTransceiver(window2) {
  if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
    Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return { receiver: this.receiver };
      }
    });
  }
}
function shimCreateOfferLegacy(window2) {
  const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
  window2.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
    if (offerOptions) {
      if (typeof offerOptions.offerToReceiveAudio !== "undefined") {
        offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
      }
      const audioTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "audio");
      if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
        if (audioTransceiver.direction === "sendrecv") {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection("sendonly");
          } else {
            audioTransceiver.direction = "sendonly";
          }
        } else if (audioTransceiver.direction === "recvonly") {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection("inactive");
          } else {
            audioTransceiver.direction = "inactive";
          }
        }
      } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
        this.addTransceiver("audio", { direction: "recvonly" });
      }
      if (typeof offerOptions.offerToReceiveVideo !== "undefined") {
        offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
      }
      const videoTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "video");
      if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
        if (videoTransceiver.direction === "sendrecv") {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection("sendonly");
          } else {
            videoTransceiver.direction = "sendonly";
          }
        } else if (videoTransceiver.direction === "recvonly") {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection("inactive");
          } else {
            videoTransceiver.direction = "inactive";
          }
        }
      } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
        this.addTransceiver("video", { direction: "recvonly" });
      }
    }
    return origCreateOffer.apply(this, arguments);
  };
}
function shimAudioContext(window2) {
  if (typeof window2 !== "object" || window2.AudioContext) {
    return;
  }
  window2.AudioContext = window2.webkitAudioContext;
}
var init_safari_shim = __esm({
  "node_modules/webrtc-adapter/src/js/safari/safari_shim.js"() {
    "use strict";
    init_utils();
  }
});

// node_modules/sdp/sdp.js
var require_sdp = __commonJS({
  "node_modules/sdp/sdp.js"(exports, module) {
    "use strict";
    var SDPUtils2 = {};
    SDPUtils2.generateIdentifier = function() {
      return Math.random().toString(36).substring(2, 12);
    };
    SDPUtils2.localCName = SDPUtils2.generateIdentifier();
    SDPUtils2.splitLines = function(blob) {
      return blob.trim().split("\n").map((line) => line.trim());
    };
    SDPUtils2.splitSections = function(blob) {
      const parts = blob.split("\nm=");
      return parts.map((part, index) => (index > 0 ? "m=" + part : part).trim() + "\r\n");
    };
    SDPUtils2.getDescription = function(blob) {
      const sections = SDPUtils2.splitSections(blob);
      return sections && sections[0];
    };
    SDPUtils2.getMediaSections = function(blob) {
      const sections = SDPUtils2.splitSections(blob);
      sections.shift();
      return sections;
    };
    SDPUtils2.matchPrefix = function(blob, prefix) {
      return SDPUtils2.splitLines(blob).filter((line) => line.indexOf(prefix) === 0);
    };
    SDPUtils2.parseCandidate = function(line) {
      let parts;
      if (line.indexOf("a=candidate:") === 0) {
        parts = line.substring(12).split(" ");
      } else {
        parts = line.substring(10).split(" ");
      }
      const candidate = {
        foundation: parts[0],
        component: { 1: "rtp", 2: "rtcp" }[parts[1]] || parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4],
        // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };
      for (let i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case "raddr":
            candidate.relatedAddress = parts[i + 1];
            break;
          case "rport":
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case "tcptype":
            candidate.tcpType = parts[i + 1];
            break;
          case "ufrag":
            candidate.ufrag = parts[i + 1];
            candidate.usernameFragment = parts[i + 1];
            break;
          default:
            if (candidate[parts[i]] === void 0) {
              candidate[parts[i]] = parts[i + 1];
            }
            break;
        }
      }
      return candidate;
    };
    SDPUtils2.writeCandidate = function(candidate) {
      const sdp2 = [];
      sdp2.push(candidate.foundation);
      const component = candidate.component;
      if (component === "rtp") {
        sdp2.push(1);
      } else if (component === "rtcp") {
        sdp2.push(2);
      } else {
        sdp2.push(component);
      }
      sdp2.push(candidate.protocol.toUpperCase());
      sdp2.push(candidate.priority);
      sdp2.push(candidate.address || candidate.ip);
      sdp2.push(candidate.port);
      const type = candidate.type;
      sdp2.push("typ");
      sdp2.push(type);
      if (type !== "host" && candidate.relatedAddress && candidate.relatedPort) {
        sdp2.push("raddr");
        sdp2.push(candidate.relatedAddress);
        sdp2.push("rport");
        sdp2.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
        sdp2.push("tcptype");
        sdp2.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp2.push("ufrag");
        sdp2.push(candidate.usernameFragment || candidate.ufrag);
      }
      return "candidate:" + sdp2.join(" ");
    };
    SDPUtils2.parseIceOptions = function(line) {
      return line.substring(14).split(" ");
    };
    SDPUtils2.parseRtpMap = function(line) {
      let parts = line.substring(9).split(" ");
      const parsed = {
        payloadType: parseInt(parts.shift(), 10)
        // was: id
      };
      parts = parts[0].split("/");
      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10);
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      parsed.numChannels = parsed.channels;
      return parsed;
    };
    SDPUtils2.writeRtpMap = function(codec) {
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      const channels = codec.channels || codec.numChannels || 1;
      return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
    };
    SDPUtils2.parseExtmap = function(line) {
      const parts = line.substring(9).split(" ");
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
        uri: parts[1],
        attributes: parts.slice(2).join(" ")
      };
    };
    SDPUtils2.writeExtmap = function(headerExtension) {
      return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + (headerExtension.attributes ? " " + headerExtension.attributes : "") + "\r\n";
    };
    SDPUtils2.parseFmtp = function(line) {
      const parsed = {};
      let kv;
      const parts = line.substring(line.indexOf(" ") + 1).split(";");
      for (let j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split("=");
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };
    SDPUtils2.writeFmtp = function(codec) {
      let line = "";
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        const params = [];
        Object.keys(codec.parameters).forEach((param) => {
          if (codec.parameters[param] !== void 0) {
            params.push(param + "=" + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
      }
      return line;
    };
    SDPUtils2.parseRtcpFb = function(line) {
      const parts = line.substring(line.indexOf(" ") + 1).split(" ");
      return {
        type: parts.shift(),
        parameter: parts.join(" ")
      };
    };
    SDPUtils2.writeRtcpFb = function(codec) {
      let lines = "";
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        codec.rtcpFeedback.forEach((fb) => {
          lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
        });
      }
      return lines;
    };
    SDPUtils2.parseSsrcMedia = function(line) {
      const sp = line.indexOf(" ");
      const parts = {
        ssrc: parseInt(line.substring(7, sp), 10)
      };
      const colon = line.indexOf(":", sp);
      if (colon > -1) {
        parts.attribute = line.substring(sp + 1, colon);
        parts.value = line.substring(colon + 1);
      } else {
        parts.attribute = line.substring(sp + 1);
      }
      return parts;
    };
    SDPUtils2.parseSsrcGroup = function(line) {
      const parts = line.substring(13).split(" ");
      return {
        semantics: parts.shift(),
        ssrcs: parts.map((ssrc) => parseInt(ssrc, 10))
      };
    };
    SDPUtils2.getMid = function(mediaSection) {
      const mid = SDPUtils2.matchPrefix(mediaSection, "a=mid:")[0];
      if (mid) {
        return mid.substring(6);
      }
    };
    SDPUtils2.parseFingerprint = function(line) {
      const parts = line.substring(14).split(" ");
      return {
        algorithm: parts[0].toLowerCase(),
        // algorithm is case-sensitive in Edge.
        value: parts[1].toUpperCase()
        // the definition is upper-case in RFC 4572.
      };
    };
    SDPUtils2.getDtlsParameters = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=fingerprint:"
      );
      return {
        role: "auto",
        fingerprints: lines.map(SDPUtils2.parseFingerprint)
      };
    };
    SDPUtils2.writeDtlsParameters = function(params, setupType) {
      let sdp2 = "a=setup:" + setupType + "\r\n";
      params.fingerprints.forEach((fp) => {
        sdp2 += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
      });
      return sdp2;
    };
    SDPUtils2.parseCryptoLine = function(line) {
      const parts = line.substring(9).split(" ");
      return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
      };
    };
    SDPUtils2.writeCryptoLine = function(parameters) {
      return "a=crypto:" + parameters.tag + " " + parameters.cryptoSuite + " " + (typeof parameters.keyParams === "object" ? SDPUtils2.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? " " + parameters.sessionParams.join(" ") : "") + "\r\n";
    };
    SDPUtils2.parseCryptoKeyParams = function(keyParams) {
      if (keyParams.indexOf("inline:") !== 0) {
        return null;
      }
      const parts = keyParams.substring(7).split("|");
      return {
        keyMethod: "inline",
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(":")[0] : void 0,
        mkiLength: parts[2] ? parts[2].split(":")[1] : void 0
      };
    };
    SDPUtils2.writeCryptoKeyParams = function(keyParams) {
      return keyParams.keyMethod + ":" + keyParams.keySalt + (keyParams.lifeTime ? "|" + keyParams.lifeTime : "") + (keyParams.mkiValue && keyParams.mkiLength ? "|" + keyParams.mkiValue + ":" + keyParams.mkiLength : "");
    };
    SDPUtils2.getCryptoParameters = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=crypto:"
      );
      return lines.map(SDPUtils2.parseCryptoLine);
    };
    SDPUtils2.getIceParameters = function(mediaSection, sessionpart) {
      const ufrag = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=ice-ufrag:"
      )[0];
      const pwd = SDPUtils2.matchPrefix(
        mediaSection + sessionpart,
        "a=ice-pwd:"
      )[0];
      if (!(ufrag && pwd)) {
        return null;
      }
      return {
        usernameFragment: ufrag.substring(12),
        password: pwd.substring(10)
      };
    };
    SDPUtils2.writeIceParameters = function(params) {
      let sdp2 = "a=ice-ufrag:" + params.usernameFragment + "\r\na=ice-pwd:" + params.password + "\r\n";
      if (params.iceLite) {
        sdp2 += "a=ice-lite\r\n";
      }
      return sdp2;
    };
    SDPUtils2.parseRtpParameters = function(mediaSection) {
      const description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      const lines = SDPUtils2.splitLines(mediaSection);
      const mline = lines[0].split(" ");
      description.profile = mline[2];
      for (let i = 3; i < mline.length; i++) {
        const pt = mline[i];
        const rtpmapline = SDPUtils2.matchPrefix(
          mediaSection,
          "a=rtpmap:" + pt + " "
        )[0];
        if (rtpmapline) {
          const codec = SDPUtils2.parseRtpMap(rtpmapline);
          const fmtps = SDPUtils2.matchPrefix(
            mediaSection,
            "a=fmtp:" + pt + " "
          );
          codec.parameters = fmtps.length ? SDPUtils2.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils2.matchPrefix(
            mediaSection,
            "a=rtcp-fb:" + pt + " "
          ).map(SDPUtils2.parseRtcpFb);
          description.codecs.push(codec);
          switch (codec.name.toUpperCase()) {
            case "RED":
            case "ULPFEC":
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
            default:
              break;
          }
        }
      }
      SDPUtils2.matchPrefix(mediaSection, "a=extmap:").forEach((line) => {
        description.headerExtensions.push(SDPUtils2.parseExtmap(line));
      });
      const wildcardRtcpFb = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-fb:* ").map(SDPUtils2.parseRtcpFb);
      description.codecs.forEach((codec) => {
        wildcardRtcpFb.forEach((fb) => {
          const duplicate = codec.rtcpFeedback.find((existingFeedback) => {
            return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
          });
          if (!duplicate) {
            codec.rtcpFeedback.push(fb);
          }
        });
      });
      return description;
    };
    SDPUtils2.writeRtpDescription = function(kind, caps) {
      let sdp2 = "";
      sdp2 += "m=" + kind + " ";
      sdp2 += caps.codecs.length > 0 ? "9" : "0";
      sdp2 += " " + (caps.profile || "UDP/TLS/RTP/SAVPF") + " ";
      sdp2 += caps.codecs.map((codec) => {
        if (codec.preferredPayloadType !== void 0) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(" ") + "\r\n";
      sdp2 += "c=IN IP4 0.0.0.0\r\n";
      sdp2 += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
      caps.codecs.forEach((codec) => {
        sdp2 += SDPUtils2.writeRtpMap(codec);
        sdp2 += SDPUtils2.writeFmtp(codec);
        sdp2 += SDPUtils2.writeRtcpFb(codec);
      });
      let maxptime = 0;
      caps.codecs.forEach((codec) => {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp2 += "a=maxptime:" + maxptime + "\r\n";
      }
      if (caps.headerExtensions) {
        caps.headerExtensions.forEach((extension) => {
          sdp2 += SDPUtils2.writeExtmap(extension);
        });
      }
      return sdp2;
    };
    SDPUtils2.parseRtpEncodingParameters = function(mediaSection) {
      const encodingParameters = [];
      const description = SDPUtils2.parseRtpParameters(mediaSection);
      const hasRed = description.fecMechanisms.indexOf("RED") !== -1;
      const hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
      const ssrcs = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((parts) => parts.attribute === "cname");
      const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      let secondarySsrc;
      const flows = SDPUtils2.matchPrefix(mediaSection, "a=ssrc-group:FID").map((line) => {
        const parts = line.substring(17).split(" ");
        return parts.map((part) => parseInt(part, 10));
      });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }
      description.codecs.forEach((codec) => {
        if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
          let encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = { ssrc: secondarySsrc };
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? "red+ulpfec" : "red"
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }
      let bandwidth = SDPUtils2.matchPrefix(mediaSection, "b=");
      if (bandwidth.length) {
        if (bandwidth[0].indexOf("b=TIAS:") === 0) {
          bandwidth = parseInt(bandwidth[0].substring(7), 10);
        } else if (bandwidth[0].indexOf("b=AS:") === 0) {
          bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1e3 * 0.95 - 50 * 40 * 8;
        } else {
          bandwidth = void 0;
        }
        encodingParameters.forEach((params) => {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };
    SDPUtils2.parseRtcpParameters = function(mediaSection) {
      const rtcpParameters = {};
      const remoteSsrc = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((obj) => obj.attribute === "cname")[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }
      const rsize = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-rsize");
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;
      const mux = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-mux");
      rtcpParameters.mux = mux.length > 0;
      return rtcpParameters;
    };
    SDPUtils2.writeRtcpParameters = function(rtcpParameters) {
      let sdp2 = "";
      if (rtcpParameters.reducedSize) {
        sdp2 += "a=rtcp-rsize\r\n";
      }
      if (rtcpParameters.mux) {
        sdp2 += "a=rtcp-mux\r\n";
      }
      if (rtcpParameters.ssrc !== void 0 && rtcpParameters.cname) {
        sdp2 += "a=ssrc:" + rtcpParameters.ssrc + " cname:" + rtcpParameters.cname + "\r\n";
      }
      return sdp2;
    };
    SDPUtils2.parseMsid = function(mediaSection) {
      let parts;
      const spec = SDPUtils2.matchPrefix(mediaSection, "a=msid:");
      if (spec.length === 1) {
        parts = spec[0].substring(7).split(" ");
        return { stream: parts[0], track: parts[1] };
      }
      const planB = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((msidParts) => msidParts.attribute === "msid");
      if (planB.length > 0) {
        parts = planB[0].value.split(" ");
        return { stream: parts[0], track: parts[1] };
      }
    };
    SDPUtils2.parseSctpDescription = function(mediaSection) {
      const mline = SDPUtils2.parseMLine(mediaSection);
      const maxSizeLine = SDPUtils2.matchPrefix(mediaSection, "a=max-message-size:");
      let maxMessageSize;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      const sctpPort = SDPUtils2.matchPrefix(mediaSection, "a=sctp-port:");
      if (sctpPort.length > 0) {
        return {
          port: parseInt(sctpPort[0].substring(12), 10),
          protocol: mline.fmt,
          maxMessageSize
        };
      }
      const sctpMapLines = SDPUtils2.matchPrefix(mediaSection, "a=sctpmap:");
      if (sctpMapLines.length > 0) {
        const parts = sctpMapLines[0].substring(10).split(" ");
        return {
          port: parseInt(parts[0], 10),
          protocol: parts[1],
          maxMessageSize
        };
      }
    };
    SDPUtils2.writeSctpDescription = function(media, sctp) {
      let output = [];
      if (media.protocol !== "DTLS/SCTP") {
        output = [
          "m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n",
          "c=IN IP4 0.0.0.0\r\n",
          "a=sctp-port:" + sctp.port + "\r\n"
        ];
      } else {
        output = [
          "m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n",
          "c=IN IP4 0.0.0.0\r\n",
          "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"
        ];
      }
      if (sctp.maxMessageSize !== void 0) {
        output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
      }
      return output.join("");
    };
    SDPUtils2.generateSessionId = function() {
      return Math.random().toString().substr(2, 22);
    };
    SDPUtils2.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
      let sessionId;
      const version = sessVer !== void 0 ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils2.generateSessionId();
      }
      const user = sessUser || "thisisadapterortc";
      return "v=0\r\no=" + user + " " + sessionId + " " + version + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
    };
    SDPUtils2.getDirection = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.splitLines(mediaSection);
      for (let i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case "a=sendrecv":
          case "a=sendonly":
          case "a=recvonly":
          case "a=inactive":
            return lines[i].substring(2);
          default:
        }
      }
      if (sessionpart) {
        return SDPUtils2.getDirection(sessionpart);
      }
      return "sendrecv";
    };
    SDPUtils2.getKind = function(mediaSection) {
      const lines = SDPUtils2.splitLines(mediaSection);
      const mline = lines[0].split(" ");
      return mline[0].substring(2);
    };
    SDPUtils2.isRejected = function(mediaSection) {
      return mediaSection.split(" ", 2)[1] === "0";
    };
    SDPUtils2.parseMLine = function(mediaSection) {
      const lines = SDPUtils2.splitLines(mediaSection);
      const parts = lines[0].substring(2).split(" ");
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(" ")
      };
    };
    SDPUtils2.parseOLine = function(mediaSection) {
      const line = SDPUtils2.matchPrefix(mediaSection, "o=")[0];
      const parts = line.substring(2).split(" ");
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };
    SDPUtils2.isValidSDP = function(blob) {
      if (typeof blob !== "string" || blob.length === 0) {
        return false;
      }
      const lines = SDPUtils2.splitLines(blob);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== "=") {
          return false;
        }
      }
      return true;
    };
    if (typeof module === "object") {
      module.exports = SDPUtils2;
    }
  }
});

// node_modules/webrtc-adapter/src/js/common_shim.js
var common_shim_exports = {};
__export(common_shim_exports, {
  removeExtmapAllowMixed: () => removeExtmapAllowMixed,
  shimAddIceCandidateNullOrEmpty: () => shimAddIceCandidateNullOrEmpty,
  shimConnectionState: () => shimConnectionState,
  shimMaxMessageSize: () => shimMaxMessageSize,
  shimParameterlessSetLocalDescription: () => shimParameterlessSetLocalDescription,
  shimRTCIceCandidate: () => shimRTCIceCandidate,
  shimRTCIceCandidateRelayProtocol: () => shimRTCIceCandidateRelayProtocol,
  shimSendThrowTypeError: () => shimSendThrowTypeError
});
function shimRTCIceCandidate(window2) {
  if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "foundation" in window2.RTCIceCandidate.prototype) {
    return;
  }
  const NativeRTCIceCandidate = window2.RTCIceCandidate;
  window2.RTCIceCandidate = function RTCIceCandidate(args) {
    if (typeof args === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substring(2);
    }
    if (args.candidate && args.candidate.length) {
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = import_sdp.default.parseCandidate(args.candidate);
      for (const key in parsedCandidate) {
        if (!(key in nativeCandidate)) {
          Object.defineProperty(
            nativeCandidate,
            key,
            { value: parsedCandidate[key] }
          );
        }
      }
      nativeCandidate.toJSON = function toJSON() {
        return {
          candidate: nativeCandidate.candidate,
          sdpMid: nativeCandidate.sdpMid,
          sdpMLineIndex: nativeCandidate.sdpMLineIndex,
          usernameFragment: nativeCandidate.usernameFragment
        };
      };
      return nativeCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window2.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
  wrapPeerConnectionEvent(window2, "icecandidate", (e) => {
    if (e.candidate) {
      Object.defineProperty(e, "candidate", {
        value: new window2.RTCIceCandidate(e.candidate),
        writable: "false"
      });
    }
    return e;
  });
}
function shimRTCIceCandidateRelayProtocol(window2) {
  if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "relayProtocol" in window2.RTCIceCandidate.prototype) {
    return;
  }
  wrapPeerConnectionEvent(window2, "icecandidate", (e) => {
    if (e.candidate) {
      const parsedCandidate = import_sdp.default.parseCandidate(e.candidate.candidate);
      if (parsedCandidate.type === "relay") {
        e.candidate.relayProtocol = {
          0: "tls",
          1: "tcp",
          2: "udp"
        }[parsedCandidate.priority >> 24];
      }
    }
    return e;
  });
}
function shimMaxMessageSize(window2, browserDetails) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (!("sctp" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "sctp", {
      get() {
        return typeof this._sctp === "undefined" ? null : this._sctp;
      }
    });
  }
  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = import_sdp.default.splitSections(description.sdp);
    sections.shift();
    return sections.some((mediaSection) => {
      const mLine = import_sdp.default.parseMLine(mediaSection);
      return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
    });
  };
  const getRemoteFirefoxVersion = function(description) {
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version = parseInt(match[1], 10);
    return version !== version ? -1 : version;
  };
  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    let canSendMaxMessageSize = 65536;
    if (browserDetails.browser === "firefox") {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          canSendMaxMessageSize = 16384;
        } else {
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
      } else {
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };
  const getMaxMessageSize = function(description, remoteIsFirefox) {
    let maxMessageSize = 65536;
    if (browserDetails.browser === "firefox" && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }
    const match = import_sdp.default.matchPrefix(
      description.sdp,
      "a=max-message-size:"
    );
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substring(19), 10);
    } else if (browserDetails.browser === "firefox" && remoteIsFirefox !== -1) {
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };
  const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
  window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
    this._sctp = null;
    if (browserDetails.browser === "chrome" && browserDetails.version >= 76) {
      const { sdpSemantics } = this.getConfiguration();
      if (sdpSemantics === "plan-b") {
        Object.defineProperty(this, "sctp", {
          get() {
            return typeof this._sctp === "undefined" ? null : this._sctp;
          },
          enumerable: true,
          configurable: true
        });
      }
    }
    if (sctpInDescription(arguments[0])) {
      const isFirefox = getRemoteFirefoxVersion(arguments[0]);
      const canSendMMS = getCanSendMaxMessageSize(isFirefox);
      const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
      let maxMessageSize;
      if (canSendMMS === 0 && remoteMMS === 0) {
        maxMessageSize = Number.POSITIVE_INFINITY;
      } else if (canSendMMS === 0 || remoteMMS === 0) {
        maxMessageSize = Math.max(canSendMMS, remoteMMS);
      } else {
        maxMessageSize = Math.min(canSendMMS, remoteMMS);
      }
      const sctp = {};
      Object.defineProperty(sctp, "maxMessageSize", {
        get() {
          return maxMessageSize;
        }
      });
      this._sctp = sctp;
    }
    return origSetRemoteDescription.apply(this, arguments);
  };
}
function shimSendThrowTypeError(window2) {
  if (!(window2.RTCPeerConnection && "createDataChannel" in window2.RTCPeerConnection.prototype)) {
    return;
  }
  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel = window2.RTCPeerConnection.prototype.createDataChannel;
  window2.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
    const dataChannel = origCreateDataChannel.apply(this, arguments);
    wrapDcSend(dataChannel, this);
    return dataChannel;
  };
  wrapPeerConnectionEvent(window2, "datachannel", (e) => {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}
function shimConnectionState(window2) {
  if (!window2.RTCPeerConnection || "connectionState" in window2.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window2.RTCPeerConnection.prototype;
  Object.defineProperty(proto, "connectionState", {
    get() {
      return {
        completed: "connected",
        checking: "connecting"
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, "onconnectionstatechange", {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener(
          "connectionstatechange",
          this._onconnectionstatechange
        );
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener(
          "connectionstatechange",
          this._onconnectionstatechange = cb
        );
      }
    },
    enumerable: true,
    configurable: true
  });
  ["setLocalDescription", "setRemoteDescription"].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = (e) => {
          const pc = e.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event("connectionstatechange", e);
            pc.dispatchEvent(newEvent);
          }
          return e;
        };
        this.addEventListener(
          "iceconnectionstatechange",
          this._connectionstatechangepoly
        );
      }
      return origMethod.apply(this, arguments);
    };
  });
}
function removeExtmapAllowMixed(window2, browserDetails) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (browserDetails.browser === "chrome" && browserDetails.version >= 71) {
    return;
  }
  if (browserDetails.browser === "safari" && browserDetails._safariVersion >= 13.1) {
    return;
  }
  const nativeSRD = window2.RTCPeerConnection.prototype.setRemoteDescription;
  window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
      const sdp2 = desc.sdp.split("\n").filter((line) => {
        return line.trim() !== "a=extmap-allow-mixed";
      }).join("\n");
      if (window2.RTCSessionDescription && desc instanceof window2.RTCSessionDescription) {
        arguments[0] = new window2.RTCSessionDescription({
          type: desc.type,
          sdp: sdp2
        });
      } else {
        desc.sdp = sdp2;
      }
    }
    return nativeSRD.apply(this, arguments);
  };
}
function shimAddIceCandidateNullOrEmpty(window2, browserDetails) {
  if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeAddIceCandidate = window2.RTCPeerConnection.prototype.addIceCandidate;
  if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
    return;
  }
  window2.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
    if (!arguments[0]) {
      if (arguments[1]) {
        arguments[1].apply(null);
      }
      return Promise.resolve();
    }
    if ((browserDetails.browser === "chrome" && browserDetails.version < 78 || browserDetails.browser === "firefox" && browserDetails.version < 68 || browserDetails.browser === "safari") && arguments[0] && arguments[0].candidate === "") {
      return Promise.resolve();
    }
    return nativeAddIceCandidate.apply(this, arguments);
  };
}
function shimParameterlessSetLocalDescription(window2, browserDetails) {
  if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
  if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
    return;
  }
  window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    let desc = arguments[0] || {};
    if (typeof desc !== "object" || desc.type && desc.sdp) {
      return nativeSetLocalDescription.apply(this, arguments);
    }
    desc = { type: desc.type, sdp: desc.sdp };
    if (!desc.type) {
      switch (this.signalingState) {
        case "stable":
        case "have-local-offer":
        case "have-remote-pranswer":
          desc.type = "offer";
          break;
        default:
          desc.type = "answer";
          break;
      }
    }
    if (desc.sdp || desc.type !== "offer" && desc.type !== "answer") {
      return nativeSetLocalDescription.apply(this, [desc]);
    }
    const func = desc.type === "offer" ? this.createOffer : this.createAnswer;
    return func.apply(this).then((d) => nativeSetLocalDescription.apply(this, [d]));
  };
}
var import_sdp;
var init_common_shim = __esm({
  "node_modules/webrtc-adapter/src/js/common_shim.js"() {
    "use strict";
    import_sdp = __toESM(require_sdp());
    init_utils();
  }
});

// node_modules/webrtc-adapter/src/js/adapter_factory.js
function adapterFactory({ window: window2 } = {}, options = {
  shimChrome: true,
  shimFirefox: true,
  shimSafari: true
}) {
  const logging2 = log;
  const browserDetails = detectBrowser(window2);
  const adapter2 = {
    browserDetails,
    commonShim: common_shim_exports,
    extractVersion,
    disableLog,
    disableWarnings,
    // Expose sdp as a convenience. For production apps include directly.
    sdp
  };
  switch (browserDetails.browser) {
    case "chrome":
      if (!chrome_shim_exports || !shimPeerConnection || !options.shimChrome) {
        logging2("Chrome shim is not included in this adapter release.");
        return adapter2;
      }
      if (browserDetails.version === null) {
        logging2("Chrome shim can not determine version, not shimming.");
        return adapter2;
      }
      logging2("adapter.js shimming chrome.");
      adapter2.browserShim = chrome_shim_exports;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails);
      shimParameterlessSetLocalDescription(window2, browserDetails);
      shimGetUserMedia(window2, browserDetails);
      shimMediaStream(window2, browserDetails);
      shimPeerConnection(window2, browserDetails);
      shimOnTrack(window2, browserDetails);
      shimAddTrackRemoveTrack(window2, browserDetails);
      shimGetSendersWithDtmf(window2, browserDetails);
      shimSenderReceiverGetStats(window2, browserDetails);
      fixNegotiationNeeded(window2, browserDetails);
      shimRTCIceCandidate(window2, browserDetails);
      shimRTCIceCandidateRelayProtocol(window2, browserDetails);
      shimConnectionState(window2, browserDetails);
      shimMaxMessageSize(window2, browserDetails);
      shimSendThrowTypeError(window2, browserDetails);
      removeExtmapAllowMixed(window2, browserDetails);
      break;
    case "firefox":
      if (!firefox_shim_exports || !shimPeerConnection2 || !options.shimFirefox) {
        logging2("Firefox shim is not included in this adapter release.");
        return adapter2;
      }
      logging2("adapter.js shimming firefox.");
      adapter2.browserShim = firefox_shim_exports;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails);
      shimParameterlessSetLocalDescription(window2, browserDetails);
      shimGetUserMedia2(window2, browserDetails);
      shimPeerConnection2(window2, browserDetails);
      shimOnTrack2(window2, browserDetails);
      shimRemoveStream(window2, browserDetails);
      shimSenderGetStats(window2, browserDetails);
      shimReceiverGetStats(window2, browserDetails);
      shimRTCDataChannel(window2, browserDetails);
      shimAddTransceiver(window2, browserDetails);
      shimGetParameters(window2, browserDetails);
      shimCreateOffer(window2, browserDetails);
      shimCreateAnswer(window2, browserDetails);
      shimRTCIceCandidate(window2, browserDetails);
      shimConnectionState(window2, browserDetails);
      shimMaxMessageSize(window2, browserDetails);
      shimSendThrowTypeError(window2, browserDetails);
      break;
    case "safari":
      if (!safari_shim_exports || !options.shimSafari) {
        logging2("Safari shim is not included in this adapter release.");
        return adapter2;
      }
      logging2("adapter.js shimming safari.");
      adapter2.browserShim = safari_shim_exports;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails);
      shimParameterlessSetLocalDescription(window2, browserDetails);
      shimRTCIceServerUrls(window2, browserDetails);
      shimCreateOfferLegacy(window2, browserDetails);
      shimCallbacksAPI(window2, browserDetails);
      shimLocalStreamsAPI(window2, browserDetails);
      shimRemoteStreamsAPI(window2, browserDetails);
      shimTrackEventTransceiver(window2, browserDetails);
      shimGetUserMedia3(window2, browserDetails);
      shimAudioContext(window2, browserDetails);
      shimRTCIceCandidate(window2, browserDetails);
      shimRTCIceCandidateRelayProtocol(window2, browserDetails);
      shimMaxMessageSize(window2, browserDetails);
      shimSendThrowTypeError(window2, browserDetails);
      removeExtmapAllowMixed(window2, browserDetails);
      break;
    default:
      logging2("Unsupported browser!");
      break;
  }
  return adapter2;
}
var sdp;
var init_adapter_factory = __esm({
  "node_modules/webrtc-adapter/src/js/adapter_factory.js"() {
    init_utils();
    init_chrome_shim();
    init_firefox_shim();
    init_safari_shim();
    init_common_shim();
    sdp = __toESM(require_sdp());
  }
});

// node_modules/webrtc-adapter/src/js/adapter_core.js
var adapter, adapter_core_default;
var init_adapter_core = __esm({
  "node_modules/webrtc-adapter/src/js/adapter_core.js"() {
    "use strict";
    init_adapter_factory();
    adapter = adapterFactory({ window: typeof window === "undefined" ? void 0 : window });
    adapter_core_default = adapter;
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs
function setUint64(view, offset, value) {
  var high = value / 4294967296;
  var low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
  var high = Math.floor(value / 4294967296);
  var low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
  var high = view.getInt32(offset);
  var low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
function getUint64(view, offset) {
  var high = view.getUint32(offset);
  var low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
var UINT32_MAX;
var init_int = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs"() {
    UINT32_MAX = 4294967295;
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/utils/utf8.mjs
function utf8Count(str) {
  var strLength = str.length;
  var byteLength = 0;
  var pos = 0;
  while (pos < strLength) {
    var value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      byteLength++;
      continue;
    } else if ((value & 4294965248) === 0) {
      byteLength += 2;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          var extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        byteLength += 3;
      } else {
        byteLength += 4;
      }
    }
  }
  return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
  var strLength = str.length;
  var offset = outputOffset;
  var pos = 0;
  while (pos < strLength) {
    var value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      output[offset++] = value;
      continue;
    } else if ((value & 4294965248) === 0) {
      output[offset++] = value >> 6 & 31 | 192;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          var extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        output[offset++] = value >> 12 & 15 | 224;
        output[offset++] = value >> 6 & 63 | 128;
      } else {
        output[offset++] = value >> 18 & 7 | 240;
        output[offset++] = value >> 12 & 63 | 128;
        output[offset++] = value >> 6 & 63 | 128;
      }
    }
    output[offset++] = value & 63 | 128;
  }
}
function utf8EncodeTEencode(str, output, outputOffset) {
  output.set(sharedTextEncoder.encode(str), outputOffset);
}
function utf8EncodeTEencodeInto(str, output, outputOffset) {
  sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8DecodeJs(bytes, inputOffset, byteLength) {
  var offset = inputOffset;
  var end = offset + byteLength;
  var units = [];
  var result = "";
  while (offset < end) {
    var byte1 = bytes[offset++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      var byte2 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      var byte2 = bytes[offset++] & 63;
      var byte3 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      var byte2 = bytes[offset++] & 63;
      var byte3 = bytes[offset++] & 63;
      var byte4 = bytes[offset++] & 63;
      var unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode.apply(String, units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += String.fromCharCode.apply(String, units);
  }
  return result;
}
function utf8DecodeTD(bytes, inputOffset, byteLength) {
  var stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}
var _a, _b, _c, TEXT_ENCODING_AVAILABLE, sharedTextEncoder, TEXT_ENCODER_THRESHOLD, utf8EncodeTE, CHUNK_SIZE, sharedTextDecoder, TEXT_DECODER_THRESHOLD;
var init_utf8 = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/utils/utf8.mjs"() {
    init_int();
    TEXT_ENCODING_AVAILABLE = (typeof process === "undefined" || ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a["TEXT_ENCODING"]) !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
    sharedTextEncoder = TEXT_ENCODING_AVAILABLE ? new TextEncoder() : void 0;
    TEXT_ENCODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? UINT32_MAX : typeof process !== "undefined" && ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b["TEXT_ENCODING"]) !== "force" ? 200 : 0;
    utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
    CHUNK_SIZE = 4096;
    sharedTextDecoder = TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
    TEXT_DECODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? UINT32_MAX : typeof process !== "undefined" && ((_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c["TEXT_DECODER"]) !== "force" ? 200 : 0;
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/ExtData.mjs
var ExtData;
var init_ExtData = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/ExtData.mjs"() {
    ExtData = /** @class */
    /* @__PURE__ */ function() {
      function ExtData2(type, data) {
        this.type = type;
        this.data = data;
      }
      return ExtData2;
    }();
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/DecodeError.mjs
var __extends, DecodeError;
var init_DecodeError = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/DecodeError.mjs"() {
    __extends = /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    DecodeError = /** @class */
    function(_super) {
      __extends(DecodeError2, _super);
      function DecodeError2(message) {
        var _this = _super.call(this, message) || this;
        var proto = Object.create(DecodeError2.prototype);
        Object.setPrototypeOf(_this, proto);
        Object.defineProperty(_this, "name", {
          configurable: true,
          enumerable: false,
          value: DecodeError2.name
        });
        return _this;
      }
      return DecodeError2;
    }(Error);
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/timestamp.mjs
function encodeTimeSpecToTimestamp(_a2) {
  var sec = _a2.sec, nsec = _a2.nsec;
  if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
    if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
      var rv = new Uint8Array(4);
      var view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
    } else {
      var secHigh = sec / 4294967296;
      var secLow = sec & 4294967295;
      var rv = new Uint8Array(8);
      var view = new DataView(rv.buffer);
      view.setUint32(0, nsec << 2 | secHigh & 3);
      view.setUint32(4, secLow);
      return rv;
    }
  } else {
    var rv = new Uint8Array(12);
    var view = new DataView(rv.buffer);
    view.setUint32(0, nsec);
    setInt64(view, 4, sec);
    return rv;
  }
}
function encodeDateToTimeSpec(date) {
  var msec = date.getTime();
  var sec = Math.floor(msec / 1e3);
  var nsec = (msec - sec * 1e3) * 1e6;
  var nsecInSec = Math.floor(nsec / 1e9);
  return {
    sec: sec + nsecInSec,
    nsec: nsec - nsecInSec * 1e9
  };
}
function encodeTimestampExtension(object) {
  if (object instanceof Date) {
    var timeSpec = encodeDateToTimeSpec(object);
    return encodeTimeSpecToTimestamp(timeSpec);
  } else {
    return null;
  }
}
function decodeTimestampToTimeSpec(data) {
  var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  switch (data.byteLength) {
    case 4: {
      var sec = view.getUint32(0);
      var nsec = 0;
      return { sec, nsec };
    }
    case 8: {
      var nsec30AndSecHigh2 = view.getUint32(0);
      var secLow32 = view.getUint32(4);
      var sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
      var nsec = nsec30AndSecHigh2 >>> 2;
      return { sec, nsec };
    }
    case 12: {
      var sec = getInt64(view, 4);
      var nsec = view.getUint32(0);
      return { sec, nsec };
    }
    default:
      throw new DecodeError("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(data.length));
  }
}
function decodeTimestampExtension(data) {
  var timeSpec = decodeTimestampToTimeSpec(data);
  return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var EXT_TIMESTAMP, TIMESTAMP32_MAX_SEC, TIMESTAMP64_MAX_SEC, timestampExtension;
var init_timestamp = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/timestamp.mjs"() {
    init_DecodeError();
    init_int();
    EXT_TIMESTAMP = -1;
    TIMESTAMP32_MAX_SEC = 4294967296 - 1;
    TIMESTAMP64_MAX_SEC = 17179869184 - 1;
    timestampExtension = {
      type: EXT_TIMESTAMP,
      encode: encodeTimestampExtension,
      decode: decodeTimestampExtension
    };
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/ExtensionCodec.mjs
var ExtensionCodec;
var init_ExtensionCodec = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/ExtensionCodec.mjs"() {
    init_ExtData();
    init_timestamp();
    ExtensionCodec = /** @class */
    function() {
      function ExtensionCodec2() {
        this.builtInEncoders = [];
        this.builtInDecoders = [];
        this.encoders = [];
        this.decoders = [];
        this.register(timestampExtension);
      }
      ExtensionCodec2.prototype.register = function(_a2) {
        var type = _a2.type, encode = _a2.encode, decode = _a2.decode;
        if (type >= 0) {
          this.encoders[type] = encode;
          this.decoders[type] = decode;
        } else {
          var index = 1 + type;
          this.builtInEncoders[index] = encode;
          this.builtInDecoders[index] = decode;
        }
      };
      ExtensionCodec2.prototype.tryToEncode = function(object, context) {
        for (var i = 0; i < this.builtInEncoders.length; i++) {
          var encodeExt = this.builtInEncoders[i];
          if (encodeExt != null) {
            var data = encodeExt(object, context);
            if (data != null) {
              var type = -1 - i;
              return new ExtData(type, data);
            }
          }
        }
        for (var i = 0; i < this.encoders.length; i++) {
          var encodeExt = this.encoders[i];
          if (encodeExt != null) {
            var data = encodeExt(object, context);
            if (data != null) {
              var type = i;
              return new ExtData(type, data);
            }
          }
        }
        if (object instanceof ExtData) {
          return object;
        }
        return null;
      };
      ExtensionCodec2.prototype.decode = function(data, type, context) {
        var decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
        if (decodeExt) {
          return decodeExt(data, type, context);
        } else {
          return new ExtData(type, data);
        }
      };
      ExtensionCodec2.defaultCodec = new ExtensionCodec2();
      return ExtensionCodec2;
    }();
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/utils/typedArrays.mjs
function ensureUint8Array(buffer) {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer)) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else if (buffer instanceof ArrayBuffer) {
    return new Uint8Array(buffer);
  } else {
    return Uint8Array.from(buffer);
  }
}
function createDataView(buffer) {
  if (buffer instanceof ArrayBuffer) {
    return new DataView(buffer);
  }
  var bufferView = ensureUint8Array(buffer);
  return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}
var init_typedArrays = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/utils/typedArrays.mjs"() {
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/Encoder.mjs
var DEFAULT_MAX_DEPTH, DEFAULT_INITIAL_BUFFER_SIZE, Encoder;
var init_Encoder = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/Encoder.mjs"() {
    init_utf8();
    init_ExtensionCodec();
    init_int();
    init_typedArrays();
    DEFAULT_MAX_DEPTH = 100;
    DEFAULT_INITIAL_BUFFER_SIZE = 2048;
    Encoder = /** @class */
    function() {
      function Encoder2(extensionCodec, context, maxDepth, initialBufferSize, sortKeys, forceFloat32, ignoreUndefined, forceIntegerToFloat) {
        if (extensionCodec === void 0) {
          extensionCodec = ExtensionCodec.defaultCodec;
        }
        if (context === void 0) {
          context = void 0;
        }
        if (maxDepth === void 0) {
          maxDepth = DEFAULT_MAX_DEPTH;
        }
        if (initialBufferSize === void 0) {
          initialBufferSize = DEFAULT_INITIAL_BUFFER_SIZE;
        }
        if (sortKeys === void 0) {
          sortKeys = false;
        }
        if (forceFloat32 === void 0) {
          forceFloat32 = false;
        }
        if (ignoreUndefined === void 0) {
          ignoreUndefined = false;
        }
        if (forceIntegerToFloat === void 0) {
          forceIntegerToFloat = false;
        }
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxDepth = maxDepth;
        this.initialBufferSize = initialBufferSize;
        this.sortKeys = sortKeys;
        this.forceFloat32 = forceFloat32;
        this.ignoreUndefined = ignoreUndefined;
        this.forceIntegerToFloat = forceIntegerToFloat;
        this.pos = 0;
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
        this.bytes = new Uint8Array(this.view.buffer);
      }
      Encoder2.prototype.reinitializeState = function() {
        this.pos = 0;
      };
      Encoder2.prototype.encodeSharedRef = function(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.subarray(0, this.pos);
      };
      Encoder2.prototype.encode = function(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.slice(0, this.pos);
      };
      Encoder2.prototype.doEncode = function(object, depth) {
        if (depth > this.maxDepth) {
          throw new Error("Too deep objects in depth ".concat(depth));
        }
        if (object == null) {
          this.encodeNil();
        } else if (typeof object === "boolean") {
          this.encodeBoolean(object);
        } else if (typeof object === "number") {
          this.encodeNumber(object);
        } else if (typeof object === "string") {
          this.encodeString(object);
        } else {
          this.encodeObject(object, depth);
        }
      };
      Encoder2.prototype.ensureBufferSizeToWrite = function(sizeToWrite) {
        var requiredSize = this.pos + sizeToWrite;
        if (this.view.byteLength < requiredSize) {
          this.resizeBuffer(requiredSize * 2);
        }
      };
      Encoder2.prototype.resizeBuffer = function(newSize) {
        var newBuffer = new ArrayBuffer(newSize);
        var newBytes = new Uint8Array(newBuffer);
        var newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
      };
      Encoder2.prototype.encodeNil = function() {
        this.writeU8(192);
      };
      Encoder2.prototype.encodeBoolean = function(object) {
        if (object === false) {
          this.writeU8(194);
        } else {
          this.writeU8(195);
        }
      };
      Encoder2.prototype.encodeNumber = function(object) {
        if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
          if (object >= 0) {
            if (object < 128) {
              this.writeU8(object);
            } else if (object < 256) {
              this.writeU8(204);
              this.writeU8(object);
            } else if (object < 65536) {
              this.writeU8(205);
              this.writeU16(object);
            } else if (object < 4294967296) {
              this.writeU8(206);
              this.writeU32(object);
            } else {
              this.writeU8(207);
              this.writeU64(object);
            }
          } else {
            if (object >= -32) {
              this.writeU8(224 | object + 32);
            } else if (object >= -128) {
              this.writeU8(208);
              this.writeI8(object);
            } else if (object >= -32768) {
              this.writeU8(209);
              this.writeI16(object);
            } else if (object >= -2147483648) {
              this.writeU8(210);
              this.writeI32(object);
            } else {
              this.writeU8(211);
              this.writeI64(object);
            }
          }
        } else {
          if (this.forceFloat32) {
            this.writeU8(202);
            this.writeF32(object);
          } else {
            this.writeU8(203);
            this.writeF64(object);
          }
        }
      };
      Encoder2.prototype.writeStringHeader = function(byteLength) {
        if (byteLength < 32) {
          this.writeU8(160 + byteLength);
        } else if (byteLength < 256) {
          this.writeU8(217);
          this.writeU8(byteLength);
        } else if (byteLength < 65536) {
          this.writeU8(218);
          this.writeU16(byteLength);
        } else if (byteLength < 4294967296) {
          this.writeU8(219);
          this.writeU32(byteLength);
        } else {
          throw new Error("Too long string: ".concat(byteLength, " bytes in UTF-8"));
        }
      };
      Encoder2.prototype.encodeString = function(object) {
        var maxHeaderSize = 1 + 4;
        var strLength = object.length;
        if (strLength > TEXT_ENCODER_THRESHOLD) {
          var byteLength = utf8Count(object);
          this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
          this.writeStringHeader(byteLength);
          utf8EncodeTE(object, this.bytes, this.pos);
          this.pos += byteLength;
        } else {
          var byteLength = utf8Count(object);
          this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
          this.writeStringHeader(byteLength);
          utf8EncodeJs(object, this.bytes, this.pos);
          this.pos += byteLength;
        }
      };
      Encoder2.prototype.encodeObject = function(object, depth) {
        var ext = this.extensionCodec.tryToEncode(object, this.context);
        if (ext != null) {
          this.encodeExtension(ext);
        } else if (Array.isArray(object)) {
          this.encodeArray(object, depth);
        } else if (ArrayBuffer.isView(object)) {
          this.encodeBinary(object);
        } else if (typeof object === "object") {
          this.encodeMap(object, depth);
        } else {
          throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(object)));
        }
      };
      Encoder2.prototype.encodeBinary = function(object) {
        var size = object.byteLength;
        if (size < 256) {
          this.writeU8(196);
          this.writeU8(size);
        } else if (size < 65536) {
          this.writeU8(197);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(198);
          this.writeU32(size);
        } else {
          throw new Error("Too large binary: ".concat(size));
        }
        var bytes = ensureUint8Array(object);
        this.writeU8a(bytes);
      };
      Encoder2.prototype.encodeArray = function(object, depth) {
        var size = object.length;
        if (size < 16) {
          this.writeU8(144 + size);
        } else if (size < 65536) {
          this.writeU8(220);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(221);
          this.writeU32(size);
        } else {
          throw new Error("Too large array: ".concat(size));
        }
        for (var _i = 0, object_1 = object; _i < object_1.length; _i++) {
          var item = object_1[_i];
          this.doEncode(item, depth + 1);
        }
      };
      Encoder2.prototype.countWithoutUndefined = function(object, keys) {
        var count = 0;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
          var key = keys_1[_i];
          if (object[key] !== void 0) {
            count++;
          }
        }
        return count;
      };
      Encoder2.prototype.encodeMap = function(object, depth) {
        var keys = Object.keys(object);
        if (this.sortKeys) {
          keys.sort();
        }
        var size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
        if (size < 16) {
          this.writeU8(128 + size);
        } else if (size < 65536) {
          this.writeU8(222);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(223);
          this.writeU32(size);
        } else {
          throw new Error("Too large map object: ".concat(size));
        }
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
          var key = keys_2[_i];
          var value = object[key];
          if (!(this.ignoreUndefined && value === void 0)) {
            this.encodeString(key);
            this.doEncode(value, depth + 1);
          }
        }
      };
      Encoder2.prototype.encodeExtension = function(ext) {
        var size = ext.data.length;
        if (size === 1) {
          this.writeU8(212);
        } else if (size === 2) {
          this.writeU8(213);
        } else if (size === 4) {
          this.writeU8(214);
        } else if (size === 8) {
          this.writeU8(215);
        } else if (size === 16) {
          this.writeU8(216);
        } else if (size < 256) {
          this.writeU8(199);
          this.writeU8(size);
        } else if (size < 65536) {
          this.writeU8(200);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(201);
          this.writeU32(size);
        } else {
          throw new Error("Too large extension object: ".concat(size));
        }
        this.writeI8(ext.type);
        this.writeU8a(ext.data);
      };
      Encoder2.prototype.writeU8 = function(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
      };
      Encoder2.prototype.writeU8a = function(values) {
        var size = values.length;
        this.ensureBufferSizeToWrite(size);
        this.bytes.set(values, this.pos);
        this.pos += size;
      };
      Encoder2.prototype.writeI8 = function(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
      };
      Encoder2.prototype.writeU16 = function(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
      };
      Encoder2.prototype.writeI16 = function(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
      };
      Encoder2.prototype.writeU32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
      };
      Encoder2.prototype.writeI32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
      };
      Encoder2.prototype.writeF32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
      };
      Encoder2.prototype.writeF64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
      };
      Encoder2.prototype.writeU64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        setUint64(this.view, this.pos, value);
        this.pos += 8;
      };
      Encoder2.prototype.writeI64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        setInt64(this.view, this.pos, value);
        this.pos += 8;
      };
      return Encoder2;
    }();
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/utils/prettyByte.mjs
function prettyByte(byte) {
  return "".concat(byte < 0 ? "-" : "", "0x").concat(Math.abs(byte).toString(16).padStart(2, "0"));
}
var init_prettyByte = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/utils/prettyByte.mjs"() {
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH, DEFAULT_MAX_LENGTH_PER_KEY, CachedKeyDecoder;
var init_CachedKeyDecoder = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/CachedKeyDecoder.mjs"() {
    init_utf8();
    DEFAULT_MAX_KEY_LENGTH = 16;
    DEFAULT_MAX_LENGTH_PER_KEY = 16;
    CachedKeyDecoder = /** @class */
    function() {
      function CachedKeyDecoder2(maxKeyLength, maxLengthPerKey) {
        if (maxKeyLength === void 0) {
          maxKeyLength = DEFAULT_MAX_KEY_LENGTH;
        }
        if (maxLengthPerKey === void 0) {
          maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY;
        }
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        this.hit = 0;
        this.miss = 0;
        this.caches = [];
        for (var i = 0; i < this.maxKeyLength; i++) {
          this.caches.push([]);
        }
      }
      CachedKeyDecoder2.prototype.canBeCached = function(byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
      };
      CachedKeyDecoder2.prototype.find = function(bytes, inputOffset, byteLength) {
        var records = this.caches[byteLength - 1];
        FIND_CHUNK: for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
          var record = records_1[_i];
          var recordBytes = record.bytes;
          for (var j = 0; j < byteLength; j++) {
            if (recordBytes[j] !== bytes[inputOffset + j]) {
              continue FIND_CHUNK;
            }
          }
          return record.str;
        }
        return null;
      };
      CachedKeyDecoder2.prototype.store = function(bytes, value) {
        var records = this.caches[bytes.length - 1];
        var record = { bytes, str: value };
        if (records.length >= this.maxLengthPerKey) {
          records[Math.random() * records.length | 0] = record;
        } else {
          records.push(record);
        }
      };
      CachedKeyDecoder2.prototype.decode = function(bytes, inputOffset, byteLength) {
        var cachedValue = this.find(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
          this.hit++;
          return cachedValue;
        }
        this.miss++;
        var str = utf8DecodeJs(bytes, inputOffset, byteLength);
        var slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, str);
        return str;
      };
      return CachedKeyDecoder2;
    }();
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/Decoder.mjs
var __awaiter, __generator, __asyncValues, __await, __asyncGenerator, isValidMapKeyType, HEAD_BYTE_REQUIRED, EMPTY_VIEW, EMPTY_BYTES, DataViewIndexOutOfBoundsError, MORE_DATA, sharedCachedKeyDecoder, Decoder;
var init_Decoder = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/Decoder.mjs"() {
    init_prettyByte();
    init_ExtensionCodec();
    init_int();
    init_utf8();
    init_typedArrays();
    init_CachedKeyDecoder();
    init_DecodeError();
    __awaiter = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    __generator = function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    __asyncValues = function(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
      }, i);
      function verb(n) {
        i[n] = o[n] && function(v) {
          return new Promise(function(resolve, reject) {
            v = o[n](v), settle(resolve, reject, v.done, v.value);
          });
        };
      }
      function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v2) {
          resolve({ value: v2, done: d });
        }, reject);
      }
    };
    __await = function(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
    };
    __asyncGenerator = function(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
      }, i;
      function verb(n) {
        if (g[n]) i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
      }
      function resume(n, v) {
        try {
          step(g[n](v));
        } catch (e) {
          settle(q[0][3], e);
        }
      }
      function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
      }
      function fulfill(value) {
        resume("next", value);
      }
      function reject(value) {
        resume("throw", value);
      }
      function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
      }
    };
    isValidMapKeyType = function(key) {
      var keyType = typeof key;
      return keyType === "string" || keyType === "number";
    };
    HEAD_BYTE_REQUIRED = -1;
    EMPTY_VIEW = new DataView(new ArrayBuffer(0));
    EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
    DataViewIndexOutOfBoundsError = function() {
      try {
        EMPTY_VIEW.getInt8(0);
      } catch (e) {
        return e.constructor;
      }
      throw new Error("never reached");
    }();
    MORE_DATA = new DataViewIndexOutOfBoundsError("Insufficient data");
    sharedCachedKeyDecoder = new CachedKeyDecoder();
    Decoder = /** @class */
    function() {
      function Decoder2(extensionCodec, context, maxStrLength, maxBinLength, maxArrayLength, maxMapLength, maxExtLength, keyDecoder) {
        if (extensionCodec === void 0) {
          extensionCodec = ExtensionCodec.defaultCodec;
        }
        if (context === void 0) {
          context = void 0;
        }
        if (maxStrLength === void 0) {
          maxStrLength = UINT32_MAX;
        }
        if (maxBinLength === void 0) {
          maxBinLength = UINT32_MAX;
        }
        if (maxArrayLength === void 0) {
          maxArrayLength = UINT32_MAX;
        }
        if (maxMapLength === void 0) {
          maxMapLength = UINT32_MAX;
        }
        if (maxExtLength === void 0) {
          maxExtLength = UINT32_MAX;
        }
        if (keyDecoder === void 0) {
          keyDecoder = sharedCachedKeyDecoder;
        }
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxStrLength = maxStrLength;
        this.maxBinLength = maxBinLength;
        this.maxArrayLength = maxArrayLength;
        this.maxMapLength = maxMapLength;
        this.maxExtLength = maxExtLength;
        this.keyDecoder = keyDecoder;
        this.totalPos = 0;
        this.pos = 0;
        this.view = EMPTY_VIEW;
        this.bytes = EMPTY_BYTES;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack = [];
      }
      Decoder2.prototype.reinitializeState = function() {
        this.totalPos = 0;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack.length = 0;
      };
      Decoder2.prototype.setBuffer = function(buffer) {
        this.bytes = ensureUint8Array(buffer);
        this.view = createDataView(this.bytes);
        this.pos = 0;
      };
      Decoder2.prototype.appendBuffer = function(buffer) {
        if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
          this.setBuffer(buffer);
        } else {
          var remainingData = this.bytes.subarray(this.pos);
          var newData = ensureUint8Array(buffer);
          var newBuffer = new Uint8Array(remainingData.length + newData.length);
          newBuffer.set(remainingData);
          newBuffer.set(newData, remainingData.length);
          this.setBuffer(newBuffer);
        }
      };
      Decoder2.prototype.hasRemaining = function(size) {
        return this.view.byteLength - this.pos >= size;
      };
      Decoder2.prototype.createExtraByteError = function(posToShow) {
        var _a2 = this, view = _a2.view, pos = _a2.pos;
        return new RangeError("Extra ".concat(view.byteLength - pos, " of ").concat(view.byteLength, " byte(s) found at buffer[").concat(posToShow, "]"));
      };
      Decoder2.prototype.decode = function(buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        var object = this.doDecodeSync();
        if (this.hasRemaining(1)) {
          throw this.createExtraByteError(this.pos);
        }
        return object;
      };
      Decoder2.prototype.decodeMulti = function(buffer) {
        return __generator(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              this.reinitializeState();
              this.setBuffer(buffer);
              _a2.label = 1;
            case 1:
              if (!this.hasRemaining(1)) return [3, 3];
              return [4, this.doDecodeSync()];
            case 2:
              _a2.sent();
              return [3, 1];
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      };
      Decoder2.prototype.decodeAsync = function(stream) {
        var stream_1, stream_1_1;
        var e_1, _a2;
        return __awaiter(this, void 0, void 0, function() {
          var decoded, object, buffer, e_1_1, _b2, headByte, pos, totalPos;
          return __generator(this, function(_c2) {
            switch (_c2.label) {
              case 0:
                decoded = false;
                _c2.label = 1;
              case 1:
                _c2.trys.push([1, 6, 7, 12]);
                stream_1 = __asyncValues(stream);
                _c2.label = 2;
              case 2:
                return [4, stream_1.next()];
              case 3:
                if (!(stream_1_1 = _c2.sent(), !stream_1_1.done)) return [3, 5];
                buffer = stream_1_1.value;
                if (decoded) {
                  throw this.createExtraByteError(this.totalPos);
                }
                this.appendBuffer(buffer);
                try {
                  object = this.doDecodeSync();
                  decoded = true;
                } catch (e) {
                  if (!(e instanceof DataViewIndexOutOfBoundsError)) {
                    throw e;
                  }
                }
                this.totalPos += this.pos;
                _c2.label = 4;
              case 4:
                return [3, 2];
              case 5:
                return [3, 12];
              case 6:
                e_1_1 = _c2.sent();
                e_1 = { error: e_1_1 };
                return [3, 12];
              case 7:
                _c2.trys.push([7, , 10, 11]);
                if (!(stream_1_1 && !stream_1_1.done && (_a2 = stream_1.return))) return [3, 9];
                return [4, _a2.call(stream_1)];
              case 8:
                _c2.sent();
                _c2.label = 9;
              case 9:
                return [3, 11];
              case 10:
                if (e_1) throw e_1.error;
                return [
                  7
                  /*endfinally*/
                ];
              case 11:
                return [
                  7
                  /*endfinally*/
                ];
              case 12:
                if (decoded) {
                  if (this.hasRemaining(1)) {
                    throw this.createExtraByteError(this.totalPos);
                  }
                  return [2, object];
                }
                _b2 = this, headByte = _b2.headByte, pos = _b2.pos, totalPos = _b2.totalPos;
                throw new RangeError("Insufficient data in parsing ".concat(prettyByte(headByte), " at ").concat(totalPos, " (").concat(pos, " in the current buffer)"));
            }
          });
        });
      };
      Decoder2.prototype.decodeArrayStream = function(stream) {
        return this.decodeMultiAsync(stream, true);
      };
      Decoder2.prototype.decodeStream = function(stream) {
        return this.decodeMultiAsync(stream, false);
      };
      Decoder2.prototype.decodeMultiAsync = function(stream, isArray) {
        return __asyncGenerator(this, arguments, function decodeMultiAsync_1() {
          var isArrayHeaderRequired, arrayItemsLeft, stream_2, stream_2_1, buffer, e_2, e_3_1;
          var e_3, _a2;
          return __generator(this, function(_b2) {
            switch (_b2.label) {
              case 0:
                isArrayHeaderRequired = isArray;
                arrayItemsLeft = -1;
                _b2.label = 1;
              case 1:
                _b2.trys.push([1, 13, 14, 19]);
                stream_2 = __asyncValues(stream);
                _b2.label = 2;
              case 2:
                return [4, __await(stream_2.next())];
              case 3:
                if (!(stream_2_1 = _b2.sent(), !stream_2_1.done)) return [3, 12];
                buffer = stream_2_1.value;
                if (isArray && arrayItemsLeft === 0) {
                  throw this.createExtraByteError(this.totalPos);
                }
                this.appendBuffer(buffer);
                if (isArrayHeaderRequired) {
                  arrayItemsLeft = this.readArraySize();
                  isArrayHeaderRequired = false;
                  this.complete();
                }
                _b2.label = 4;
              case 4:
                _b2.trys.push([4, 9, , 10]);
                _b2.label = 5;
              case 5:
                if (false) return [3, 8];
                return [4, __await(this.doDecodeSync())];
              case 6:
                return [4, _b2.sent()];
              case 7:
                _b2.sent();
                if (--arrayItemsLeft === 0) {
                  return [3, 8];
                }
                return [3, 5];
              case 8:
                return [3, 10];
              case 9:
                e_2 = _b2.sent();
                if (!(e_2 instanceof DataViewIndexOutOfBoundsError)) {
                  throw e_2;
                }
                return [3, 10];
              case 10:
                this.totalPos += this.pos;
                _b2.label = 11;
              case 11:
                return [3, 2];
              case 12:
                return [3, 19];
              case 13:
                e_3_1 = _b2.sent();
                e_3 = { error: e_3_1 };
                return [3, 19];
              case 14:
                _b2.trys.push([14, , 17, 18]);
                if (!(stream_2_1 && !stream_2_1.done && (_a2 = stream_2.return))) return [3, 16];
                return [4, __await(_a2.call(stream_2))];
              case 15:
                _b2.sent();
                _b2.label = 16;
              case 16:
                return [3, 18];
              case 17:
                if (e_3) throw e_3.error;
                return [
                  7
                  /*endfinally*/
                ];
              case 18:
                return [
                  7
                  /*endfinally*/
                ];
              case 19:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      Decoder2.prototype.doDecodeSync = function() {
        DECODE: while (true) {
          var headByte = this.readHeadByte();
          var object = void 0;
          if (headByte >= 224) {
            object = headByte - 256;
          } else if (headByte < 192) {
            if (headByte < 128) {
              object = headByte;
            } else if (headByte < 144) {
              var size = headByte - 128;
              if (size !== 0) {
                this.pushMapState(size);
                this.complete();
                continue DECODE;
              } else {
                object = {};
              }
            } else if (headByte < 160) {
              var size = headByte - 144;
              if (size !== 0) {
                this.pushArrayState(size);
                this.complete();
                continue DECODE;
              } else {
                object = [];
              }
            } else {
              var byteLength = headByte - 160;
              object = this.decodeUtf8String(byteLength, 0);
            }
          } else if (headByte === 192) {
            object = null;
          } else if (headByte === 194) {
            object = false;
          } else if (headByte === 195) {
            object = true;
          } else if (headByte === 202) {
            object = this.readF32();
          } else if (headByte === 203) {
            object = this.readF64();
          } else if (headByte === 204) {
            object = this.readU8();
          } else if (headByte === 205) {
            object = this.readU16();
          } else if (headByte === 206) {
            object = this.readU32();
          } else if (headByte === 207) {
            object = this.readU64();
          } else if (headByte === 208) {
            object = this.readI8();
          } else if (headByte === 209) {
            object = this.readI16();
          } else if (headByte === 210) {
            object = this.readI32();
          } else if (headByte === 211) {
            object = this.readI64();
          } else if (headByte === 217) {
            var byteLength = this.lookU8();
            object = this.decodeUtf8String(byteLength, 1);
          } else if (headByte === 218) {
            var byteLength = this.lookU16();
            object = this.decodeUtf8String(byteLength, 2);
          } else if (headByte === 219) {
            var byteLength = this.lookU32();
            object = this.decodeUtf8String(byteLength, 4);
          } else if (headByte === 220) {
            var size = this.readU16();
            if (size !== 0) {
              this.pushArrayState(size);
              this.complete();
              continue DECODE;
            } else {
              object = [];
            }
          } else if (headByte === 221) {
            var size = this.readU32();
            if (size !== 0) {
              this.pushArrayState(size);
              this.complete();
              continue DECODE;
            } else {
              object = [];
            }
          } else if (headByte === 222) {
            var size = this.readU16();
            if (size !== 0) {
              this.pushMapState(size);
              this.complete();
              continue DECODE;
            } else {
              object = {};
            }
          } else if (headByte === 223) {
            var size = this.readU32();
            if (size !== 0) {
              this.pushMapState(size);
              this.complete();
              continue DECODE;
            } else {
              object = {};
            }
          } else if (headByte === 196) {
            var size = this.lookU8();
            object = this.decodeBinary(size, 1);
          } else if (headByte === 197) {
            var size = this.lookU16();
            object = this.decodeBinary(size, 2);
          } else if (headByte === 198) {
            var size = this.lookU32();
            object = this.decodeBinary(size, 4);
          } else if (headByte === 212) {
            object = this.decodeExtension(1, 0);
          } else if (headByte === 213) {
            object = this.decodeExtension(2, 0);
          } else if (headByte === 214) {
            object = this.decodeExtension(4, 0);
          } else if (headByte === 215) {
            object = this.decodeExtension(8, 0);
          } else if (headByte === 216) {
            object = this.decodeExtension(16, 0);
          } else if (headByte === 199) {
            var size = this.lookU8();
            object = this.decodeExtension(size, 1);
          } else if (headByte === 200) {
            var size = this.lookU16();
            object = this.decodeExtension(size, 2);
          } else if (headByte === 201) {
            var size = this.lookU32();
            object = this.decodeExtension(size, 4);
          } else {
            throw new DecodeError("Unrecognized type byte: ".concat(prettyByte(headByte)));
          }
          this.complete();
          var stack = this.stack;
          while (stack.length > 0) {
            var state = stack[stack.length - 1];
            if (state.type === 0) {
              state.array[state.position] = object;
              state.position++;
              if (state.position === state.size) {
                stack.pop();
                object = state.array;
              } else {
                continue DECODE;
              }
            } else if (state.type === 1) {
              if (!isValidMapKeyType(object)) {
                throw new DecodeError("The type of key must be string or number but " + typeof object);
              }
              if (object === "__proto__") {
                throw new DecodeError("The key __proto__ is not allowed");
              }
              state.key = object;
              state.type = 2;
              continue DECODE;
            } else {
              state.map[state.key] = object;
              state.readCount++;
              if (state.readCount === state.size) {
                stack.pop();
                object = state.map;
              } else {
                state.key = null;
                state.type = 1;
                continue DECODE;
              }
            }
          }
          return object;
        }
      };
      Decoder2.prototype.readHeadByte = function() {
        if (this.headByte === HEAD_BYTE_REQUIRED) {
          this.headByte = this.readU8();
        }
        return this.headByte;
      };
      Decoder2.prototype.complete = function() {
        this.headByte = HEAD_BYTE_REQUIRED;
      };
      Decoder2.prototype.readArraySize = function() {
        var headByte = this.readHeadByte();
        switch (headByte) {
          case 220:
            return this.readU16();
          case 221:
            return this.readU32();
          default: {
            if (headByte < 160) {
              return headByte - 144;
            } else {
              throw new DecodeError("Unrecognized array type byte: ".concat(prettyByte(headByte)));
            }
          }
        }
      };
      Decoder2.prototype.pushMapState = function(size) {
        if (size > this.maxMapLength) {
          throw new DecodeError("Max length exceeded: map length (".concat(size, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
        }
        this.stack.push({
          type: 1,
          size,
          key: null,
          readCount: 0,
          map: {}
        });
      };
      Decoder2.prototype.pushArrayState = function(size) {
        if (size > this.maxArrayLength) {
          throw new DecodeError("Max length exceeded: array length (".concat(size, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
        }
        this.stack.push({
          type: 0,
          size,
          array: new Array(size),
          position: 0
        });
      };
      Decoder2.prototype.decodeUtf8String = function(byteLength, headerOffset) {
        var _a2;
        if (byteLength > this.maxStrLength) {
          throw new DecodeError("Max length exceeded: UTF-8 byte length (".concat(byteLength, ") > maxStrLength (").concat(this.maxStrLength, ")"));
        }
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
          throw MORE_DATA;
        }
        var offset = this.pos + headerOffset;
        var object;
        if (this.stateIsMapKey() && ((_a2 = this.keyDecoder) === null || _a2 === void 0 ? void 0 : _a2.canBeCached(byteLength))) {
          object = this.keyDecoder.decode(this.bytes, offset, byteLength);
        } else if (byteLength > TEXT_DECODER_THRESHOLD) {
          object = utf8DecodeTD(this.bytes, offset, byteLength);
        } else {
          object = utf8DecodeJs(this.bytes, offset, byteLength);
        }
        this.pos += headerOffset + byteLength;
        return object;
      };
      Decoder2.prototype.stateIsMapKey = function() {
        if (this.stack.length > 0) {
          var state = this.stack[this.stack.length - 1];
          return state.type === 1;
        }
        return false;
      };
      Decoder2.prototype.decodeBinary = function(byteLength, headOffset) {
        if (byteLength > this.maxBinLength) {
          throw new DecodeError("Max length exceeded: bin length (".concat(byteLength, ") > maxBinLength (").concat(this.maxBinLength, ")"));
        }
        if (!this.hasRemaining(byteLength + headOffset)) {
          throw MORE_DATA;
        }
        var offset = this.pos + headOffset;
        var object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
      };
      Decoder2.prototype.decodeExtension = function(size, headOffset) {
        if (size > this.maxExtLength) {
          throw new DecodeError("Max length exceeded: ext length (".concat(size, ") > maxExtLength (").concat(this.maxExtLength, ")"));
        }
        var extType = this.view.getInt8(this.pos + headOffset);
        var data = this.decodeBinary(
          size,
          headOffset + 1
          /* extType */
        );
        return this.extensionCodec.decode(data, extType, this.context);
      };
      Decoder2.prototype.lookU8 = function() {
        return this.view.getUint8(this.pos);
      };
      Decoder2.prototype.lookU16 = function() {
        return this.view.getUint16(this.pos);
      };
      Decoder2.prototype.lookU32 = function() {
        return this.view.getUint32(this.pos);
      };
      Decoder2.prototype.readU8 = function() {
        var value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
      };
      Decoder2.prototype.readI8 = function() {
        var value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
      };
      Decoder2.prototype.readU16 = function() {
        var value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
      };
      Decoder2.prototype.readI16 = function() {
        var value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
      };
      Decoder2.prototype.readU32 = function() {
        var value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
      };
      Decoder2.prototype.readI32 = function() {
        var value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
      };
      Decoder2.prototype.readU64 = function() {
        var value = getUint64(this.view, this.pos);
        this.pos += 8;
        return value;
      };
      Decoder2.prototype.readI64 = function() {
        var value = getInt64(this.view, this.pos);
        this.pos += 8;
        return value;
      };
      Decoder2.prototype.readF32 = function() {
        var value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
      };
      Decoder2.prototype.readF64 = function() {
        var value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
      };
      return Decoder2;
    }();
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/decode.mjs
var defaultDecodeOptions;
var init_decode = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/decode.mjs"() {
    defaultDecodeOptions = {};
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/utils/stream.mjs
function isAsyncIterable(object) {
  return object[Symbol.asyncIterator] != null;
}
function assertNonNull(value) {
  if (value == null) {
    throw new Error("Assertion Failure: value must not be null nor undefined");
  }
}
function asyncIterableFromStream(stream) {
  return __asyncGenerator2(this, arguments, function asyncIterableFromStream_1() {
    var reader, _a2, done, value;
    return __generator2(this, function(_b2) {
      switch (_b2.label) {
        case 0:
          reader = stream.getReader();
          _b2.label = 1;
        case 1:
          _b2.trys.push([1, , 9, 10]);
          _b2.label = 2;
        case 2:
          if (false) return [3, 8];
          return [4, __await2(reader.read())];
        case 3:
          _a2 = _b2.sent(), done = _a2.done, value = _a2.value;
          if (!done) return [3, 5];
          return [4, __await2(void 0)];
        case 4:
          return [2, _b2.sent()];
        case 5:
          assertNonNull(value);
          return [4, __await2(value)];
        case 6:
          return [4, _b2.sent()];
        case 7:
          _b2.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [
            7
            /*endfinally*/
          ];
        case 10:
          return [
            2
            /*return*/
          ];
      }
    });
  });
}
function ensureAsyncIterable(streamLike) {
  if (isAsyncIterable(streamLike)) {
    return streamLike;
  } else {
    return asyncIterableFromStream(streamLike);
  }
}
var __generator2, __await2, __asyncGenerator2;
var init_stream = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/utils/stream.mjs"() {
    __generator2 = function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    __await2 = function(v) {
      return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
    };
    __asyncGenerator2 = function(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
      }, i;
      function verb(n) {
        if (g[n]) i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
      }
      function resume(n, v) {
        try {
          step(g[n](v));
        } catch (e) {
          settle(q[0][3], e);
        }
      }
      function step(r) {
        r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
      }
      function fulfill(value) {
        resume("next", value);
      }
      function reject(value) {
        resume("throw", value);
      }
      function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
      }
    };
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/decodeAsync.mjs
function decodeMultiStream(streamLike, options) {
  if (options === void 0) {
    options = defaultDecodeOptions;
  }
  var stream = ensureAsyncIterable(streamLike);
  var decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
  return decoder.decodeStream(stream);
}
var init_decodeAsync = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/decodeAsync.mjs"() {
    init_Decoder();
    init_stream();
    init_decode();
  }
});

// node_modules/@msgpack/msgpack/dist.es5+esm/index.mjs
var init_dist = __esm({
  "node_modules/@msgpack/msgpack/dist.es5+esm/index.mjs"() {
    init_decodeAsync();
    init_Encoder();
  }
});

// node_modules/peerjs/dist/bundler.mjs
var bundler_exports = {};
__export(bundler_exports, {
  BaseConnectionErrorType: () => $78455e22dea96b8c$export$7974935686149686,
  BufferedConnection: () => $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b,
  ConnectionType: () => $78455e22dea96b8c$export$3157d57b4135e3bc,
  DataConnectionErrorType: () => $78455e22dea96b8c$export$49ae800c114df41d,
  MsgPack: () => $6e39230ab36396ad$export$80f5de1a66c4d624,
  MsgPackPeer: () => $1e0aff16be2c328e$export$d72c7bf8eef50853,
  Peer: () => $416260bce337df90$export$ecd1fc136c422448,
  PeerError: () => $23779d1881157a18$export$98871882f492de82,
  PeerErrorType: () => $78455e22dea96b8c$export$9547aaa2e39030ff,
  SerializationType: () => $78455e22dea96b8c$export$89f507cf986a947,
  ServerMessageType: () => $78455e22dea96b8c$export$adb4a1754da6f10d,
  SocketEventType: () => $78455e22dea96b8c$export$3b5c4a4b6354f023,
  StreamConnection: () => $20dbe68149d7aad9$export$72aa44612e2200cd,
  default: () => $dd0187d7f28e386f$export$2e2bcd8739ae039,
  util: () => $4f4134156c446392$export$7debb50ef11d5e0b
});
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, { get: v, set: s, enumerable: true, configurable: true });
}
function $fcbcc7538a6776d5$export$52c89ebcdc4f53f2(bufs) {
  let size = 0;
  for (const buf of bufs) size += buf.byteLength;
  const result = new Uint8Array(size);
  let offset = 0;
  for (const buf of bufs) {
    result.set(buf, offset);
    offset += buf.byteLength;
  }
  return result;
}
function $c4dcfd1d1ea86647$var$Events() {
}
function $c4dcfd1d1ea86647$var$EE(fn, context, once2) {
  this.fn = fn;
  this.context = context;
  this.once = once2 || false;
}
function $c4dcfd1d1ea86647$var$addListener(emitter, event, fn, context, once2) {
  if (typeof fn !== "function") throw new TypeError("The listener must be a function");
  var listener = new $c4dcfd1d1ea86647$var$EE(fn, context || emitter, once2), evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [
    emitter._events[evt],
    listener
  ];
  return emitter;
}
function $c4dcfd1d1ea86647$var$clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new $c4dcfd1d1ea86647$var$Events();
  else delete emitter._events[evt];
}
function $c4dcfd1d1ea86647$var$EventEmitter() {
  this._events = new $c4dcfd1d1ea86647$var$Events();
  this._eventsCount = 0;
}
var $fcbcc7538a6776d5$export$f1c5f4c9cb95390b, $fb63e766cfafaab9$var$webRTCAdapter, $fb63e766cfafaab9$export$25be9502477c137d, $9a84a32bf0bf36bb$export$f35f128fd59ea256, $0e5fd1585784c252$export$4e61f672936bec77, $4f4134156c446392$var$DEFAULT_CONFIG, $4f4134156c446392$export$f8f26dd395d7e1bd, $4f4134156c446392$export$7debb50ef11d5e0b, $257947e92926277a$var$LOG_PREFIX, $257947e92926277a$var$Logger, $257947e92926277a$export$2e2bcd8739ae039, $c4dcfd1d1ea86647$exports, $c4dcfd1d1ea86647$var$has, $c4dcfd1d1ea86647$var$prefix, $78455e22dea96b8c$exports, $78455e22dea96b8c$export$3157d57b4135e3bc, $78455e22dea96b8c$export$9547aaa2e39030ff, $78455e22dea96b8c$export$7974935686149686, $78455e22dea96b8c$export$49ae800c114df41d, $78455e22dea96b8c$export$89f507cf986a947, $78455e22dea96b8c$export$3b5c4a4b6354f023, $78455e22dea96b8c$export$adb4a1754da6f10d, $520832d44ba058c8$export$83d89fbfd8236492, $8f5bfa60836d261d$export$4798917dbf149b79, $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a, $23779d1881157a18$export$6a678e589c8a4542, $23779d1881157a18$export$98871882f492de82, $5045192fc6d387ba$export$23a2a68283c24d80, $5c1d08c7c57da9a3$export$4a84e95a2324ac29, $abf266641927cd89$export$2c4e825dc9120f87, $6366c4ca161bc297$export$d365f7ad9d7df9c9, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b, $9fcfddb3ae148f88$export$f0a5a64d5bb37108, $bbaee3f15f714663$export$6f88fe47d32c9c94, $817f931e3f9096cf$export$48880ac635f47186, $416260bce337df90$export$ecd1fc136c422448, $20dbe68149d7aad9$export$72aa44612e2200cd, $6e39230ab36396ad$export$80f5de1a66c4d624, $1e0aff16be2c328e$export$d72c7bf8eef50853, $dd0187d7f28e386f$export$2e2bcd8739ae039;
var init_bundler = __esm({
  "node_modules/peerjs/dist/bundler.mjs"() {
    init_binarypack();
    init_adapter_core();
    init_dist();
    $fcbcc7538a6776d5$export$f1c5f4c9cb95390b = class {
      constructor() {
        this.chunkedMTU = 16300;
        this._dataCount = 1;
        this.chunk = (blob) => {
          const chunks = [];
          const size = blob.byteLength;
          const total = Math.ceil(size / this.chunkedMTU);
          let index = 0;
          let start = 0;
          while (start < size) {
            const end = Math.min(size, start + this.chunkedMTU);
            const b = blob.slice(start, end);
            const chunk = {
              __peerData: this._dataCount,
              n: index,
              data: b,
              total
            };
            chunks.push(chunk);
            start = end;
            index++;
          }
          this._dataCount++;
          return chunks;
        };
      }
    };
    $fb63e766cfafaab9$var$webRTCAdapter = //@ts-ignore
    (0, adapter_core_default).default || (0, adapter_core_default);
    $fb63e766cfafaab9$export$25be9502477c137d = new class {
      isWebRTCSupported() {
        return typeof RTCPeerConnection !== "undefined";
      }
      isBrowserSupported() {
        const browser = this.getBrowser();
        const version = this.getVersion();
        const validBrowser = this.supportedBrowsers.includes(browser);
        if (!validBrowser) return false;
        if (browser === "chrome") return version >= this.minChromeVersion;
        if (browser === "firefox") return version >= this.minFirefoxVersion;
        if (browser === "safari") return !this.isIOS && version >= this.minSafariVersion;
        return false;
      }
      getBrowser() {
        return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.browser;
      }
      getVersion() {
        return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
      }
      isUnifiedPlanSupported() {
        const browser = this.getBrowser();
        const version = $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
        if (browser === "chrome" && version < this.minChromeVersion) return false;
        if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
        if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return false;
        let tempPc;
        let supported = false;
        try {
          tempPc = new RTCPeerConnection();
          tempPc.addTransceiver("audio");
          supported = true;
        } catch (e) {
        } finally {
          if (tempPc) tempPc.close();
        }
        return supported;
      }
      toString() {
        return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
      }
      constructor() {
        this.isIOS = typeof navigator !== "undefined" ? [
          "iPad",
          "iPhone",
          "iPod"
        ].includes(navigator.platform) : false;
        this.supportedBrowsers = [
          "firefox",
          "chrome",
          "safari"
        ];
        this.minFirefoxVersion = 59;
        this.minChromeVersion = 72;
        this.minSafariVersion = 605;
      }
    }();
    $9a84a32bf0bf36bb$export$f35f128fd59ea256 = (id) => {
      return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
    };
    $0e5fd1585784c252$export$4e61f672936bec77 = () => Math.random().toString(36).slice(2);
    $4f4134156c446392$var$DEFAULT_CONFIG = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        },
        {
          urls: [
            "turn:eu-0.turn.peerjs.com:3478",
            "turn:us-0.turn.peerjs.com:3478"
          ],
          username: "peerjs",
          credential: "peerjsp"
        }
      ],
      sdpSemantics: "unified-plan"
    };
    $4f4134156c446392$export$f8f26dd395d7e1bd = class extends (0, $fcbcc7538a6776d5$export$f1c5f4c9cb95390b) {
      noop() {
      }
      blobToArrayBuffer(blob, cb) {
        const fr = new FileReader();
        fr.onload = function(evt) {
          if (evt.target) cb(evt.target.result);
        };
        fr.readAsArrayBuffer(blob);
        return fr;
      }
      binaryStringToArrayBuffer(binary) {
        const byteArray = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) byteArray[i] = binary.charCodeAt(i) & 255;
        return byteArray.buffer;
      }
      isSecure() {
        return location.protocol === "https:";
      }
      constructor(...args) {
        super(...args), this.CLOUD_HOST = "0.peerjs.com", this.CLOUD_PORT = 443, // Browsers that need chunking:
        this.chunkedBrowsers = {
          Chrome: 1,
          chrome: 1
        }, // Returns browser-agnostic default config
        this.defaultConfig = $4f4134156c446392$var$DEFAULT_CONFIG, this.browser = (0, $fb63e766cfafaab9$export$25be9502477c137d).getBrowser(), this.browserVersion = (0, $fb63e766cfafaab9$export$25be9502477c137d).getVersion(), this.pack = $0cfd7828ad59115f$export$2a703dbb0cb35339, this.unpack = $0cfd7828ad59115f$export$417857010dc9287f, /**
        * A hash of WebRTC features mapped to booleans that correspond to whether the feature is supported by the current browser.
        *
        * :::caution
        * Only the properties documented here are guaranteed to be present on `util.supports`
        * :::
        */
        this.supports = function() {
          const supported = {
            browser: (0, $fb63e766cfafaab9$export$25be9502477c137d).isBrowserSupported(),
            webRTC: (0, $fb63e766cfafaab9$export$25be9502477c137d).isWebRTCSupported(),
            audioVideo: false,
            data: false,
            binaryBlob: false,
            reliable: false
          };
          if (!supported.webRTC) return supported;
          let pc;
          try {
            pc = new RTCPeerConnection($4f4134156c446392$var$DEFAULT_CONFIG);
            supported.audioVideo = true;
            let dc;
            try {
              dc = pc.createDataChannel("_PEERJSTEST", {
                ordered: true
              });
              supported.data = true;
              supported.reliable = !!dc.ordered;
              try {
                dc.binaryType = "blob";
                supported.binaryBlob = !(0, $fb63e766cfafaab9$export$25be9502477c137d).isIOS;
              } catch (e) {
              }
            } catch (e) {
            } finally {
              if (dc) dc.close();
            }
          } catch (e) {
          } finally {
            if (pc) pc.close();
          }
          return supported;
        }(), // Ensure alphanumeric ids
        this.validateId = (0, $9a84a32bf0bf36bb$export$f35f128fd59ea256), this.randomToken = (0, $0e5fd1585784c252$export$4e61f672936bec77);
      }
    };
    $4f4134156c446392$export$7debb50ef11d5e0b = new $4f4134156c446392$export$f8f26dd395d7e1bd();
    $257947e92926277a$var$LOG_PREFIX = "PeerJS: ";
    $257947e92926277a$var$Logger = class {
      get logLevel() {
        return this._logLevel;
      }
      set logLevel(logLevel) {
        this._logLevel = logLevel;
      }
      log(...args) {
        if (this._logLevel >= 3) this._print(3, ...args);
      }
      warn(...args) {
        if (this._logLevel >= 2) this._print(2, ...args);
      }
      error(...args) {
        if (this._logLevel >= 1) this._print(1, ...args);
      }
      setLogFunction(fn) {
        this._print = fn;
      }
      _print(logLevel, ...rest) {
        const copy = [
          $257947e92926277a$var$LOG_PREFIX,
          ...rest
        ];
        for (const i in copy) if (copy[i] instanceof Error) copy[i] = "(" + copy[i].name + ") " + copy[i].message;
        if (logLevel >= 3) console.log(...copy);
        else if (logLevel >= 2) console.warn("WARNING", ...copy);
        else if (logLevel >= 1) console.error("ERROR", ...copy);
      }
      constructor() {
        this._logLevel = 0;
      }
    };
    $257947e92926277a$export$2e2bcd8739ae039 = new $257947e92926277a$var$Logger();
    $c4dcfd1d1ea86647$exports = {};
    $c4dcfd1d1ea86647$var$has = Object.prototype.hasOwnProperty;
    $c4dcfd1d1ea86647$var$prefix = "~";
    if (Object.create) {
      $c4dcfd1d1ea86647$var$Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new $c4dcfd1d1ea86647$var$Events().__proto__) $c4dcfd1d1ea86647$var$prefix = false;
    }
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) if ($c4dcfd1d1ea86647$var$has.call(events, name)) names.push($c4dcfd1d1ea86647$var$prefix ? name.slice(1) : name);
      if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
      return names;
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.listeners = function listeners(event) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [
        handlers.fn
      ];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
      return ee;
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, listeners2 = this._events[evt];
      if (!listeners2) return 0;
      if (listeners2.fn) return 1;
      return listeners2.length;
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners2 = this._events[evt], len = arguments.length, args, i;
      if (listeners2.fn) {
        if (listeners2.once) this.removeListener(event, listeners2.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners2.fn.call(listeners2.context), true;
          case 2:
            return listeners2.fn.call(listeners2.context, a1), true;
          case 3:
            return listeners2.fn.call(listeners2.context, a1, a2), true;
          case 4:
            return listeners2.fn.call(listeners2.context, a1, a2, a3), true;
          case 5:
            return listeners2.fn.call(listeners2.context, a1, a2, a3, a4), true;
          case 6:
            return listeners2.fn.call(listeners2.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
        listeners2.fn.apply(listeners2.context, args);
      } else {
        var length = listeners2.length, j;
        for (i = 0; i < length; i++) {
          if (listeners2[i].once) this.removeListener(event, listeners2[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners2[i].fn.call(listeners2[i].context);
              break;
            case 2:
              listeners2[i].fn.call(listeners2[i].context, a1);
              break;
            case 3:
              listeners2[i].fn.call(listeners2[i].context, a1, a2);
              break;
            case 4:
              listeners2[i].fn.call(listeners2[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
              listeners2[i].fn.apply(listeners2[i].context, args);
          }
        }
      }
      return true;
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.on = function on(event, fn, context) {
      return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, false);
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.once = function once(event, fn, context) {
      return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, true);
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once2) {
      var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        $c4dcfd1d1ea86647$var$clearEvent(this, evt);
        return this;
      }
      var listeners2 = this._events[evt];
      if (listeners2.fn) {
        if (listeners2.fn === fn && (!once2 || listeners2.once) && (!context || listeners2.context === context)) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
      } else {
        for (var i = 0, events = [], length = listeners2.length; i < length; i++) if (listeners2[i].fn !== fn || once2 && !listeners2[i].once || context && listeners2[i].context !== context) events.push(listeners2[i]);
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else $c4dcfd1d1ea86647$var$clearEvent(this, evt);
      }
      return this;
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
        if (this._events[evt]) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
      } else {
        this._events = new $c4dcfd1d1ea86647$var$Events();
        this._eventsCount = 0;
      }
      return this;
    };
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.off = $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener;
    $c4dcfd1d1ea86647$var$EventEmitter.prototype.addListener = $c4dcfd1d1ea86647$var$EventEmitter.prototype.on;
    $c4dcfd1d1ea86647$var$EventEmitter.prefixed = $c4dcfd1d1ea86647$var$prefix;
    $c4dcfd1d1ea86647$var$EventEmitter.EventEmitter = $c4dcfd1d1ea86647$var$EventEmitter;
    $c4dcfd1d1ea86647$exports = $c4dcfd1d1ea86647$var$EventEmitter;
    $78455e22dea96b8c$exports = {};
    $parcel$export($78455e22dea96b8c$exports, "ConnectionType", () => $78455e22dea96b8c$export$3157d57b4135e3bc);
    $parcel$export($78455e22dea96b8c$exports, "PeerErrorType", () => $78455e22dea96b8c$export$9547aaa2e39030ff);
    $parcel$export($78455e22dea96b8c$exports, "BaseConnectionErrorType", () => $78455e22dea96b8c$export$7974935686149686);
    $parcel$export($78455e22dea96b8c$exports, "DataConnectionErrorType", () => $78455e22dea96b8c$export$49ae800c114df41d);
    $parcel$export($78455e22dea96b8c$exports, "SerializationType", () => $78455e22dea96b8c$export$89f507cf986a947);
    $parcel$export($78455e22dea96b8c$exports, "SocketEventType", () => $78455e22dea96b8c$export$3b5c4a4b6354f023);
    $parcel$export($78455e22dea96b8c$exports, "ServerMessageType", () => $78455e22dea96b8c$export$adb4a1754da6f10d);
    $78455e22dea96b8c$export$3157d57b4135e3bc = /* @__PURE__ */ function(ConnectionType) {
      ConnectionType["Data"] = "data";
      ConnectionType["Media"] = "media";
      return ConnectionType;
    }({});
    $78455e22dea96b8c$export$9547aaa2e39030ff = /* @__PURE__ */ function(PeerErrorType) {
      PeerErrorType["BrowserIncompatible"] = "browser-incompatible";
      PeerErrorType["Disconnected"] = "disconnected";
      PeerErrorType["InvalidID"] = "invalid-id";
      PeerErrorType["InvalidKey"] = "invalid-key";
      PeerErrorType["Network"] = "network";
      PeerErrorType["PeerUnavailable"] = "peer-unavailable";
      PeerErrorType["SslUnavailable"] = "ssl-unavailable";
      PeerErrorType["ServerError"] = "server-error";
      PeerErrorType["SocketError"] = "socket-error";
      PeerErrorType["SocketClosed"] = "socket-closed";
      PeerErrorType["UnavailableID"] = "unavailable-id";
      PeerErrorType["WebRTC"] = "webrtc";
      return PeerErrorType;
    }({});
    $78455e22dea96b8c$export$7974935686149686 = /* @__PURE__ */ function(BaseConnectionErrorType) {
      BaseConnectionErrorType["NegotiationFailed"] = "negotiation-failed";
      BaseConnectionErrorType["ConnectionClosed"] = "connection-closed";
      return BaseConnectionErrorType;
    }({});
    $78455e22dea96b8c$export$49ae800c114df41d = /* @__PURE__ */ function(DataConnectionErrorType) {
      DataConnectionErrorType["NotOpenYet"] = "not-open-yet";
      DataConnectionErrorType["MessageToBig"] = "message-too-big";
      return DataConnectionErrorType;
    }({});
    $78455e22dea96b8c$export$89f507cf986a947 = /* @__PURE__ */ function(SerializationType) {
      SerializationType["Binary"] = "binary";
      SerializationType["BinaryUTF8"] = "binary-utf8";
      SerializationType["JSON"] = "json";
      SerializationType["None"] = "raw";
      return SerializationType;
    }({});
    $78455e22dea96b8c$export$3b5c4a4b6354f023 = /* @__PURE__ */ function(SocketEventType) {
      SocketEventType["Message"] = "message";
      SocketEventType["Disconnected"] = "disconnected";
      SocketEventType["Error"] = "error";
      SocketEventType["Close"] = "close";
      return SocketEventType;
    }({});
    $78455e22dea96b8c$export$adb4a1754da6f10d = /* @__PURE__ */ function(ServerMessageType) {
      ServerMessageType["Heartbeat"] = "HEARTBEAT";
      ServerMessageType["Candidate"] = "CANDIDATE";
      ServerMessageType["Offer"] = "OFFER";
      ServerMessageType["Answer"] = "ANSWER";
      ServerMessageType["Open"] = "OPEN";
      ServerMessageType["Error"] = "ERROR";
      ServerMessageType["IdTaken"] = "ID-TAKEN";
      ServerMessageType["InvalidKey"] = "INVALID-KEY";
      ServerMessageType["Leave"] = "LEAVE";
      ServerMessageType["Expire"] = "EXPIRE";
      return ServerMessageType;
    }({});
    $520832d44ba058c8$export$83d89fbfd8236492 = "1.5.5";
    $8f5bfa60836d261d$export$4798917dbf149b79 = class extends (0, $c4dcfd1d1ea86647$exports.EventEmitter) {
      constructor(secure, host, port, path, key, pingInterval = 5e3) {
        super(), this.pingInterval = pingInterval, this._disconnected = true, this._messagesQueue = [];
        const wsProtocol = secure ? "wss://" : "ws://";
        this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
      }
      start(id, token) {
        this._id = id;
        const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;
        if (!!this._socket || !this._disconnected) return;
        this._socket = new WebSocket(wsUrl + "&version=" + (0, $520832d44ba058c8$export$83d89fbfd8236492));
        this._disconnected = false;
        this._socket.onmessage = (event) => {
          let data;
          try {
            data = JSON.parse(event.data);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Server message received:", data);
          } catch (e) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Invalid server message", event.data);
            return;
          }
          this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Message, data);
        };
        this._socket.onclose = (event) => {
          if (this._disconnected) return;
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Socket closed.", event);
          this._cleanup();
          this._disconnected = true;
          this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected);
        };
        this._socket.onopen = () => {
          if (this._disconnected) return;
          this._sendQueuedMessages();
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Socket open");
          this._scheduleHeartbeat();
        };
      }
      _scheduleHeartbeat() {
        this._wsPingTimer = setTimeout(() => {
          this._sendHeartbeat();
        }, this.pingInterval);
      }
      _sendHeartbeat() {
        if (!this._wsOpen()) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Cannot send heartbeat, because socket closed`);
          return;
        }
        const message = JSON.stringify({
          type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Heartbeat
        });
        this._socket.send(message);
        this._scheduleHeartbeat();
      }
      /** Is the websocket currently open? */
      _wsOpen() {
        return !!this._socket && this._socket.readyState === 1;
      }
      /** Send queued messages. */
      _sendQueuedMessages() {
        const copiedQueue = [
          ...this._messagesQueue
        ];
        this._messagesQueue = [];
        for (const message of copiedQueue) this.send(message);
      }
      /** Exposed send for DC & Peer. */
      send(data) {
        if (this._disconnected) return;
        if (!this._id) {
          this._messagesQueue.push(data);
          return;
        }
        if (!data.type) {
          this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Error, "Invalid message");
          return;
        }
        if (!this._wsOpen()) return;
        const message = JSON.stringify(data);
        this._socket.send(message);
      }
      close() {
        if (this._disconnected) return;
        this._cleanup();
        this._disconnected = true;
      }
      _cleanup() {
        if (this._socket) {
          this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
          this._socket.close();
          this._socket = void 0;
        }
        clearTimeout(this._wsPingTimer);
      }
    };
    $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a = class {
      constructor(connection) {
        this.connection = connection;
      }
      /** Returns a PeerConnection object set up correctly (for data, media). */
      startConnection(options) {
        const peerConnection = this._startPeerConnection();
        this.connection.peerConnection = peerConnection;
        if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media && options._stream) this._addTracksToConnection(options._stream, peerConnection);
        if (options.originator) {
          const dataConnection = this.connection;
          const config = {
            ordered: !!options.reliable
          };
          const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
          dataConnection._initializeDataChannel(dataChannel);
          this._makeOffer();
        } else this.handleSDP("OFFER", options.sdp);
      }
      /** Start a PC. */
      _startPeerConnection() {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Creating RTCPeerConnection.");
        const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
        this._setupListeners(peerConnection);
        return peerConnection;
      }
      /** Set up various WebRTC listeners. */
      _setupListeners(peerConnection) {
        const peerId = this.connection.peer;
        const connectionId = this.connection.connectionId;
        const connectionType = this.connection.type;
        const provider = this.connection.provider;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for ICE candidates.");
        peerConnection.onicecandidate = (evt) => {
          if (!evt.candidate || !evt.candidate.candidate) return;
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Received ICE candidates for ${peerId}:`, evt.candidate);
          provider.socket.send({
            type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate,
            payload: {
              candidate: evt.candidate,
              type: connectionType,
              connectionId
            },
            dst: peerId
          });
        };
        peerConnection.oniceconnectionstatechange = () => {
          switch (peerConnection.iceConnectionState) {
            case "failed":
              (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is failed, closing connections to " + peerId);
              this.connection.emitError((0, $78455e22dea96b8c$export$7974935686149686).NegotiationFailed, "Negotiation of connection to " + peerId + " failed.");
              this.connection.close();
              break;
            case "closed":
              (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is closed, closing connections to " + peerId);
              this.connection.emitError((0, $78455e22dea96b8c$export$7974935686149686).ConnectionClosed, "Connection to " + peerId + " closed.");
              this.connection.close();
              break;
            case "disconnected":
              (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState changed to disconnected on the connection with " + peerId);
              break;
            case "completed":
              peerConnection.onicecandidate = () => {
              };
              break;
          }
          this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
        };
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for data channel");
        peerConnection.ondatachannel = (evt) => {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Received data channel");
          const dataChannel = evt.channel;
          const connection = provider.getConnection(peerId, connectionId);
          connection._initializeDataChannel(dataChannel);
        };
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for remote stream");
        peerConnection.ontrack = (evt) => {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Received remote stream");
          const stream = evt.streams[0];
          const connection = provider.getConnection(peerId, connectionId);
          if (connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
            const mediaConnection = connection;
            this._addStreamToMediaConnection(stream, mediaConnection);
          }
        };
      }
      cleanup() {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Cleaning up PeerConnection to " + this.connection.peer);
        const peerConnection = this.connection.peerConnection;
        if (!peerConnection) return;
        this.connection.peerConnection = null;
        peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = () => {
        };
        const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
        let dataChannelNotClosed = false;
        const dataChannel = this.connection.dataChannel;
        if (dataChannel) dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
        if (peerConnectionNotClosed || dataChannelNotClosed) peerConnection.close();
      }
      async _makeOffer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
          const offer = await peerConnection.createOffer(this.connection.options.constraints);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created offer.");
          if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
          try {
            await peerConnection.setLocalDescription(offer);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Set localDescription:", offer, `for:${this.connection.peer}`);
            let payload = {
              sdp: offer,
              type: this.connection.type,
              connectionId: this.connection.connectionId,
              metadata: this.connection.metadata
            };
            if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
              const dataConnection = this.connection;
              payload = {
                ...payload,
                label: dataConnection.label,
                reliable: dataConnection.reliable,
                serialization: dataConnection.serialization
              };
            }
            provider.socket.send({
              type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer,
              payload,
              dst: this.connection.peer
            });
          } catch (err) {
            if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
              provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
              (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
            }
          }
        } catch (err_1) {
          provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to createOffer, ", err_1);
        }
      }
      async _makeAnswer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
          const answer = await peerConnection.createAnswer();
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created answer.");
          if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
          try {
            await peerConnection.setLocalDescription(answer);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
            provider.socket.send({
              type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer,
              payload: {
                sdp: answer,
                type: this.connection.type,
                connectionId: this.connection.connectionId
              },
              dst: this.connection.peer
            });
          } catch (err) {
            provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
          }
        } catch (err_1) {
          provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to create answer, ", err_1);
        }
      }
      /** Handle an SDP. */
      async handleSDP(type, sdp2) {
        sdp2 = new RTCSessionDescription(sdp2);
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Setting remote description", sdp2);
        const self = this;
        try {
          await peerConnection.setRemoteDescription(sdp2);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set remoteDescription:${type} for:${this.connection.peer}`);
          if (type === "OFFER") await self._makeAnswer();
        } catch (err) {
          provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setRemoteDescription, ", err);
        }
      }
      /** Handle a candidate. */
      async handleCandidate(ice) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`handleCandidate:`, ice);
        try {
          await this.connection.peerConnection.addIceCandidate(ice);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Added ICE candidate for:${this.connection.peer}`);
        } catch (err) {
          this.connection.provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
          (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to handleCandidate, ", err);
        }
      }
      _addTracksToConnection(stream, peerConnection) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add tracks from stream ${stream.id} to peer connection`);
        if (!peerConnection.addTrack) return (0, $257947e92926277a$export$2e2bcd8739ae039).error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      }
      _addStreamToMediaConnection(stream, mediaConnection) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add stream ${stream.id} to media connection ${mediaConnection.connectionId}`);
        mediaConnection.addStream(stream);
      }
    };
    $23779d1881157a18$export$6a678e589c8a4542 = class extends (0, $c4dcfd1d1ea86647$exports.EventEmitter) {
      /**
      * Emits a typed error message.
      *
      * @internal
      */
      emitError(type, err) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error:", err);
        this.emit("error", new $23779d1881157a18$export$98871882f492de82(`${type}`, err));
      }
    };
    $23779d1881157a18$export$98871882f492de82 = class extends Error {
      /**
      * @internal
      */
      constructor(type, err) {
        if (typeof err === "string") super(err);
        else {
          super();
          Object.assign(this, err);
        }
        this.type = type;
      }
    };
    $5045192fc6d387ba$export$23a2a68283c24d80 = class extends (0, $23779d1881157a18$export$6a678e589c8a4542) {
      /**
      * Whether the media connection is active (e.g. your call has been answered).
      * You can check this if you want to set a maximum wait time for a one-sided call.
      */
      get open() {
        return this._open;
      }
      constructor(peer, provider, options) {
        super(), this.peer = peer, this.provider = provider, this.options = options, this._open = false;
        this.metadata = options.metadata;
      }
    };
    $5c1d08c7c57da9a3$export$4a84e95a2324ac29 = class _$5c1d08c7c57da9a3$export$4a84e95a2324ac29 extends (0, $5045192fc6d387ba$export$23a2a68283c24d80) {
      static #_ = this.ID_PREFIX = "mc_";
      /**
      * For media connections, this is always 'media'.
      */
      get type() {
        return (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media;
      }
      get localStream() {
        return this._localStream;
      }
      get remoteStream() {
        return this._remoteStream;
      }
      constructor(peerId, provider, options) {
        super(peerId, provider, options);
        this._localStream = this.options._stream;
        this.connectionId = this.options.connectionId || _$5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX + (0, $4f4134156c446392$export$7debb50ef11d5e0b).randomToken();
        this._negotiator = new (0, $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
        if (this._localStream) this._negotiator.startConnection({
          _stream: this._localStream,
          originator: true
        });
      }
      /** Called by the Negotiator when the DataChannel is ready. */
      _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = () => {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
          this.emit("willCloseOnRemote");
        };
        this.dataChannel.onclose = () => {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
          this.close();
        };
      }
      addStream(remoteStream) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Receiving stream", remoteStream);
        this._remoteStream = remoteStream;
        super.emit("stream", remoteStream);
      }
      /**
      * @internal
      */
      handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        switch (message.type) {
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
            this._negotiator.handleSDP(type, payload.sdp);
            this._open = true;
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
            this._negotiator.handleCandidate(payload.candidate);
            break;
          default:
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Unrecognized message type:${type} from peer:${this.peer}`);
            break;
        }
      }
      /**
           * When receiving a {@apilink PeerEvents | `call`} event on a peer, you can call
           * `answer` on the media connection provided by the callback to accept the call
           * and optionally send your own media stream.
      
           *
           * @param stream A WebRTC media stream.
           * @param options
           * @returns
           */
      answer(stream, options = {}) {
        if (this._localStream) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
          return;
        }
        this._localStream = stream;
        if (options && options.sdpTransform) this.options.sdpTransform = options.sdpTransform;
        this._negotiator.startConnection({
          ...this.options._payload,
          _stream: stream
        });
        const messages = this.provider._getMessages(this.connectionId);
        for (const message of messages) this.handleMessage(message);
        this._open = true;
      }
      /**
      * Exposed functionality for users.
      */
      /**
      * Closes the media connection.
      */
      close() {
        if (this._negotiator) {
          this._negotiator.cleanup();
          this._negotiator = null;
        }
        this._localStream = null;
        this._remoteStream = null;
        if (this.provider) {
          this.provider._removeConnection(this);
          this.provider = null;
        }
        if (this.options && this.options._stream) this.options._stream = null;
        if (!this.open) return;
        this._open = false;
        super.emit("close");
      }
    };
    $abf266641927cd89$export$2c4e825dc9120f87 = class {
      constructor(_options) {
        this._options = _options;
      }
      _buildRequest(method) {
        const protocol = this._options.secure ? "https" : "http";
        const { host, port, path, key } = this._options;
        const url = new URL(`${protocol}://${host}:${port}${path}${key}/${method}`);
        url.searchParams.set("ts", `${Date.now()}${Math.random()}`);
        url.searchParams.set("version", (0, $520832d44ba058c8$export$83d89fbfd8236492));
        return fetch(url.href, {
          referrerPolicy: this._options.referrerPolicy
        });
      }
      /** Get a unique ID from the server via XHR and initialize with it. */
      async retrieveId() {
        try {
          const response = await this._buildRequest("id");
          if (response.status !== 200) throw new Error(`Error. Status:${response.status}`);
          return response.text();
        } catch (error) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving ID", error);
          let pathError = "";
          if (this._options.path === "/" && this._options.host !== (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
          throw new Error("Could not get an ID from the server." + pathError);
        }
      }
      /** @deprecated */
      async listAllPeers() {
        try {
          const response = await this._buildRequest("peers");
          if (response.status !== 200) {
            if (response.status === 401) {
              let helpfulError = "";
              if (this._options.host === (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
              else helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
              throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
            }
            throw new Error(`Error. Status:${response.status}`);
          }
          return response.json();
        } catch (error) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving list peers", error);
          throw new Error("Could not get list peers from the server." + error);
        }
      }
    };
    $6366c4ca161bc297$export$d365f7ad9d7df9c9 = class _$6366c4ca161bc297$export$d365f7ad9d7df9c9 extends (0, $5045192fc6d387ba$export$23a2a68283c24d80) {
      static #_ = this.ID_PREFIX = "dc_";
      static #_2 = this.MAX_BUFFERED_AMOUNT = 8388608;
      get type() {
        return (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data;
      }
      constructor(peerId, provider, options) {
        super(peerId, provider, options);
        this.connectionId = this.options.connectionId || _$6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX + (0, $0e5fd1585784c252$export$4e61f672936bec77)();
        this.label = this.options.label || this.connectionId;
        this.reliable = !!this.options.reliable;
        this._negotiator = new (0, $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
        this._negotiator.startConnection(this.options._payload || {
          originator: true,
          reliable: this.reliable
        });
      }
      /** Called by the Negotiator when the DataChannel is ready. */
      _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = () => {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
          this._open = true;
          this.emit("open");
        };
        this.dataChannel.onmessage = (e) => {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc onmessage:`, e.data);
        };
        this.dataChannel.onclose = () => {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
          this.close();
        };
      }
      /**
      * Exposed functionality for users.
      */
      /** Allows user to close connection. */
      close(options) {
        if (options?.flush) {
          this.send({
            __peerData: {
              type: "close"
            }
          });
          return;
        }
        if (this._negotiator) {
          this._negotiator.cleanup();
          this._negotiator = null;
        }
        if (this.provider) {
          this.provider._removeConnection(this);
          this.provider = null;
        }
        if (this.dataChannel) {
          this.dataChannel.onopen = null;
          this.dataChannel.onmessage = null;
          this.dataChannel.onclose = null;
          this.dataChannel = null;
        }
        if (!this.open) return;
        this._open = false;
        super.emit("close");
      }
      /** Allows user to send data. */
      send(data, chunked = false) {
        if (!this.open) {
          this.emitError((0, $78455e22dea96b8c$export$49ae800c114df41d).NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
          return;
        }
        return this._send(data, chunked);
      }
      async handleMessage(message) {
        const payload = message.payload;
        switch (message.type) {
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
            await this._negotiator.handleSDP(message.type, payload.sdp);
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
            await this._negotiator.handleCandidate(payload.candidate);
            break;
          default:
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn("Unrecognized message type:", message.type, "from peer:", this.peer);
            break;
        }
      }
    };
    $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b = class extends (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9) {
      get bufferSize() {
        return this._bufferSize;
      }
      _initializeDataChannel(dc) {
        super._initializeDataChannel(dc);
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.addEventListener("message", (e) => this._handleDataMessage(e));
      }
      _bufferedSend(msg) {
        if (this._buffering || !this._trySend(msg)) {
          this._buffer.push(msg);
          this._bufferSize = this._buffer.length;
        }
      }
      // Returns true if the send succeeds.
      _trySend(msg) {
        if (!this.open) return false;
        if (this.dataChannel.bufferedAmount > (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT) {
          this._buffering = true;
          setTimeout(() => {
            this._buffering = false;
            this._tryBuffer();
          }, 50);
          return false;
        }
        try {
          this.dataChannel.send(msg);
        } catch (e) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).error(`DC#:${this.connectionId} Error when sending:`, e);
          this._buffering = true;
          this.close();
          return false;
        }
        return true;
      }
      // Try to send the first message in the buffer.
      _tryBuffer() {
        if (!this.open) return;
        if (this._buffer.length === 0) return;
        const msg = this._buffer[0];
        if (this._trySend(msg)) {
          this._buffer.shift();
          this._bufferSize = this._buffer.length;
          this._tryBuffer();
        }
      }
      close(options) {
        if (options?.flush) {
          this.send({
            __peerData: {
              type: "close"
            }
          });
          return;
        }
        this._buffer = [];
        this._bufferSize = 0;
        super.close();
      }
      constructor(...args) {
        super(...args), this._buffer = [], this._bufferSize = 0, this._buffering = false;
      }
    };
    $9fcfddb3ae148f88$export$f0a5a64d5bb37108 = class extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
      close(options) {
        super.close(options);
        this._chunkedData = {};
      }
      constructor(peerId, provider, options) {
        super(peerId, provider, options), this.chunker = new (0, $fcbcc7538a6776d5$export$f1c5f4c9cb95390b)(), this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).Binary, this._chunkedData = {};
      }
      // Handles a DataChannel message.
      _handleDataMessage({ data }) {
        const deserializedData = (0, $0cfd7828ad59115f$export$417857010dc9287f)(data);
        const peerData = deserializedData["__peerData"];
        if (peerData) {
          if (peerData.type === "close") {
            this.close();
            return;
          }
          this._handleChunk(deserializedData);
          return;
        }
        this.emit("data", deserializedData);
      }
      _handleChunk(data) {
        const id = data.__peerData;
        const chunkInfo = this._chunkedData[id] || {
          data: [],
          count: 0,
          total: data.total
        };
        chunkInfo.data[data.n] = new Uint8Array(data.data);
        chunkInfo.count++;
        this._chunkedData[id] = chunkInfo;
        if (chunkInfo.total === chunkInfo.count) {
          delete this._chunkedData[id];
          const data2 = (0, $fcbcc7538a6776d5$export$52c89ebcdc4f53f2)(chunkInfo.data);
          this._handleDataMessage({
            data: data2
          });
        }
      }
      _send(data, chunked) {
        const blob = (0, $0cfd7828ad59115f$export$2a703dbb0cb35339)(data);
        if (blob instanceof Promise) return this._send_blob(blob);
        if (!chunked && blob.byteLength > this.chunker.chunkedMTU) {
          this._sendChunks(blob);
          return;
        }
        this._bufferedSend(blob);
      }
      async _send_blob(blobPromise) {
        const blob = await blobPromise;
        if (blob.byteLength > this.chunker.chunkedMTU) {
          this._sendChunks(blob);
          return;
        }
        this._bufferedSend(blob);
      }
      _sendChunks(blob) {
        const blobs = this.chunker.chunk(blob);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} Try to send ${blobs.length} chunks...`);
        for (const blob2 of blobs) this.send(blob2, true);
      }
    };
    $bbaee3f15f714663$export$6f88fe47d32c9c94 = class extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
      _handleDataMessage({ data }) {
        super.emit("data", data);
      }
      _send(data, _chunked) {
        this._bufferedSend(data);
      }
      constructor(...args) {
        super(...args), this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).None;
      }
    };
    $817f931e3f9096cf$export$48880ac635f47186 = class extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
      // Handles a DataChannel message.
      _handleDataMessage({ data }) {
        const deserializedData = this.parse(this.decoder.decode(data));
        const peerData = deserializedData["__peerData"];
        if (peerData && peerData.type === "close") {
          this.close();
          return;
        }
        this.emit("data", deserializedData);
      }
      _send(data, _chunked) {
        const encodedData = this.encoder.encode(this.stringify(data));
        if (encodedData.byteLength >= (0, $4f4134156c446392$export$7debb50ef11d5e0b).chunkedMTU) {
          this.emitError((0, $78455e22dea96b8c$export$49ae800c114df41d).MessageToBig, "Message too big for JSON channel");
          return;
        }
        this._bufferedSend(encodedData);
      }
      constructor(...args) {
        super(...args), this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).JSON, this.encoder = new TextEncoder(), this.decoder = new TextDecoder(), this.stringify = JSON.stringify, this.parse = JSON.parse;
      }
    };
    $416260bce337df90$export$ecd1fc136c422448 = class _$416260bce337df90$export$ecd1fc136c422448 extends (0, $23779d1881157a18$export$6a678e589c8a4542) {
      static #_ = this.DEFAULT_KEY = "peerjs";
      /**
      * The brokering ID of this peer
      *
      * If no ID was specified in {@apilink Peer | the constructor},
      * this will be `undefined` until the {@apilink PeerEvents | `open`} event is emitted.
      */
      get id() {
        return this._id;
      }
      get options() {
        return this._options;
      }
      get open() {
        return this._open;
      }
      /**
      * @internal
      */
      get socket() {
        return this._socket;
      }
      /**
      * A hash of all connections associated with this peer, keyed by the remote peer's ID.
      * @deprecated
      * Return type will change from Object to Map<string,[]>
      */
      get connections() {
        const plainConnections = /* @__PURE__ */ Object.create(null);
        for (const [k, v] of this._connections) plainConnections[k] = v;
        return plainConnections;
      }
      /**
      * true if this peer and all of its connections can no longer be used.
      */
      get destroyed() {
        return this._destroyed;
      }
      /**
      * false if there is an active connection to the PeerServer.
      */
      get disconnected() {
        return this._disconnected;
      }
      constructor(id, options) {
        super(), this._serializers = {
          raw: (0, $bbaee3f15f714663$export$6f88fe47d32c9c94),
          json: (0, $817f931e3f9096cf$export$48880ac635f47186),
          binary: (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108),
          "binary-utf8": (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108),
          default: (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108)
        }, this._id = null, this._lastServerId = null, // States.
        this._destroyed = false, this._disconnected = false, this._open = false, this._connections = /* @__PURE__ */ new Map(), this._lostMessages = /* @__PURE__ */ new Map();
        let userId;
        if (id && id.constructor == Object) options = id;
        else if (id) userId = id.toString();
        options = {
          debug: 0,
          host: (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST,
          port: (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_PORT,
          path: "/",
          key: _$416260bce337df90$export$ecd1fc136c422448.DEFAULT_KEY,
          token: (0, $4f4134156c446392$export$7debb50ef11d5e0b).randomToken(),
          config: (0, $4f4134156c446392$export$7debb50ef11d5e0b).defaultConfig,
          referrerPolicy: "strict-origin-when-cross-origin",
          serializers: {},
          ...options
        };
        this._options = options;
        this._serializers = {
          ...this._serializers,
          ...this.options.serializers
        };
        if (this._options.host === "/") this._options.host = window.location.hostname;
        if (this._options.path) {
          if (this._options.path[0] !== "/") this._options.path = "/" + this._options.path;
          if (this._options.path[this._options.path.length - 1] !== "/") this._options.path += "/";
        }
        if (this._options.secure === void 0 && this._options.host !== (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = (0, $4f4134156c446392$export$7debb50ef11d5e0b).isSecure();
        else if (this._options.host == (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = true;
        if (this._options.logFunction) (0, $257947e92926277a$export$2e2bcd8739ae039).setLogFunction(this._options.logFunction);
        (0, $257947e92926277a$export$2e2bcd8739ae039).logLevel = this._options.debug || 0;
        this._api = new (0, $abf266641927cd89$export$2c4e825dc9120f87)(options);
        this._socket = this._createServerConnection();
        if (!(0, $4f4134156c446392$export$7debb50ef11d5e0b).supports.audioVideo && !(0, $4f4134156c446392$export$7debb50ef11d5e0b).supports.data) {
          this._delayedAbort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).BrowserIncompatible, "The current browser does not support WebRTC");
          return;
        }
        if (!!userId && !(0, $4f4134156c446392$export$7debb50ef11d5e0b).validateId(userId)) {
          this._delayedAbort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).InvalidID, `ID "${userId}" is invalid`);
          return;
        }
        if (userId) this._initialize(userId);
        else this._api.retrieveId().then((id2) => this._initialize(id2)).catch((error) => this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
      }
      _createServerConnection() {
        const socket = new (0, $8f5bfa60836d261d$export$4798917dbf149b79)(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Message, (data) => {
          this._handleMessage(data);
        });
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Error, (error) => {
          this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).SocketError, error);
        });
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected, () => {
          if (this.disconnected) return;
          this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Network, "Lost connection to server.");
          this.disconnect();
        });
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Close, () => {
          if (this.disconnected) return;
          this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).SocketClosed, "Underlying socket is already closed.");
        });
        return socket;
      }
      /** Initialize a connection with the server. */
      _initialize(id) {
        this._id = id;
        this.socket.start(id, this._options.token);
      }
      /** Handles messages from the server. */
      _handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        const peerId = message.src;
        switch (type) {
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Open:
            this._lastServerId = this.id;
            this._open = true;
            this.emit("open", this.id);
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Error:
            this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, payload.msg);
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).IdTaken:
            this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).UnavailableID, `ID "${this.id}" is taken`);
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).InvalidKey:
            this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).InvalidKey, `API KEY "${this._options.key}" is invalid`);
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Leave:
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Received leave message from ${peerId}`);
            this._cleanupPeer(peerId);
            this._connections.delete(peerId);
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Expire:
            this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).PeerUnavailable, `Could not connect to peer ${peerId}`);
            break;
          case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer: {
            const connectionId = payload.connectionId;
            let connection = this.getConnection(peerId, connectionId);
            if (connection) {
              connection.close();
              (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Offer received for existing Connection ID:${connectionId}`);
            }
            if (payload.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
              const mediaConnection = new (0, $5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peerId, this, {
                connectionId,
                _payload: payload,
                metadata: payload.metadata
              });
              connection = mediaConnection;
              this._addConnection(peerId, connection);
              this.emit("call", mediaConnection);
            } else if (payload.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
              const dataConnection = new this._serializers[payload.serialization](peerId, this, {
                connectionId,
                _payload: payload,
                metadata: payload.metadata,
                label: payload.label,
                serialization: payload.serialization,
                reliable: payload.reliable
              });
              connection = dataConnection;
              this._addConnection(peerId, connection);
              this.emit("connection", dataConnection);
            } else {
              (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Received malformed connection type:${payload.type}`);
              return;
            }
            const messages = this._getMessages(connectionId);
            for (const message2 of messages) connection.handleMessage(message2);
            break;
          }
          default: {
            if (!payload) {
              (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`You received a malformed message from ${peerId} of type ${type}`);
              return;
            }
            const connectionId = payload.connectionId;
            const connection = this.getConnection(peerId, connectionId);
            if (connection && connection.peerConnection)
              connection.handleMessage(message);
            else if (connectionId)
              this._storeMessage(connectionId, message);
            else (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You received an unrecognized message:", message);
            break;
          }
        }
      }
      /** Stores messages without a set up connection, to be claimed later. */
      _storeMessage(connectionId, message) {
        if (!this._lostMessages.has(connectionId)) this._lostMessages.set(connectionId, []);
        this._lostMessages.get(connectionId).push(message);
      }
      /**
      * Retrieve messages from lost message store
      * @internal
      */
      //TODO Change it to private
      _getMessages(connectionId) {
        const messages = this._lostMessages.get(connectionId);
        if (messages) {
          this._lostMessages.delete(connectionId);
          return messages;
        }
        return [];
      }
      /**
      * Connects to the remote peer specified by id and returns a data connection.
      * @param peer The brokering ID of the remote peer (their {@apilink Peer.id}).
      * @param options for specifying details about Peer Connection
      */
      connect(peer, options = {}) {
        options = {
          serialization: "default",
          ...options
        };
        if (this.disconnected) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
          this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
          return;
        }
        const dataConnection = new this._serializers[options.serialization](peer, this, options);
        this._addConnection(peer, dataConnection);
        return dataConnection;
      }
      /**
      * Calls the remote peer specified by id and returns a media connection.
      * @param peer The brokering ID of the remote peer (their peer.id).
      * @param stream The caller's media stream
      * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
      */
      call(peer, stream, options = {}) {
        if (this.disconnected) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
          this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
          return;
        }
        if (!stream) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
          return;
        }
        const mediaConnection = new (0, $5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peer, this, {
          ...options,
          _stream: stream
        });
        this._addConnection(peer, mediaConnection);
        return mediaConnection;
      }
      /** Add a data/media connection to this peer. */
      _addConnection(peerId, connection) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);
        if (!this._connections.has(peerId)) this._connections.set(peerId, []);
        this._connections.get(peerId).push(connection);
      }
      //TODO should be private
      _removeConnection(connection) {
        const connections = this._connections.get(connection.peer);
        if (connections) {
          const index = connections.indexOf(connection);
          if (index !== -1) connections.splice(index, 1);
        }
        this._lostMessages.delete(connection.connectionId);
      }
      /** Retrieve a data/media connection for this peer. */
      getConnection(peerId, connectionId) {
        const connections = this._connections.get(peerId);
        if (!connections) return null;
        for (const connection of connections) {
          if (connection.connectionId === connectionId) return connection;
        }
        return null;
      }
      _delayedAbort(type, message) {
        setTimeout(() => {
          this._abort(type, message);
        }, 0);
      }
      /**
      * Emits an error message and destroys the Peer.
      * The Peer is not destroyed if it's in a disconnected state, in which case
      * it retains its disconnected state and its existing connections.
      */
      _abort(type, message) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("Aborting!");
        this.emitError(type, message);
        if (!this._lastServerId) this.destroy();
        else this.disconnect();
      }
      /**
      * Destroys the Peer: closes all active connections as well as the connection
      * to the server.
      *
      * :::caution
      * This cannot be undone; the respective peer object will no longer be able
      * to create or receive any connections, its ID will be forfeited on the server,
      * and all of its data and media connections will be closed.
      * :::
      */
      destroy() {
        if (this.destroyed) return;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Destroy peer with ID:${this.id}`);
        this.disconnect();
        this._cleanup();
        this._destroyed = true;
        this.emit("close");
      }
      /** Disconnects every connection on this peer. */
      _cleanup() {
        for (const peerId of this._connections.keys()) {
          this._cleanupPeer(peerId);
          this._connections.delete(peerId);
        }
        this.socket.removeAllListeners();
      }
      /** Closes all connections to this peer. */
      _cleanupPeer(peerId) {
        const connections = this._connections.get(peerId);
        if (!connections) return;
        for (const connection of connections) connection.close();
      }
      /**
      * Disconnects the Peer's connection to the PeerServer. Does not close any
      *  active connections.
      * Warning: The peer can no longer create or accept connections after being
      *  disconnected. It also cannot reconnect to the server.
      */
      disconnect() {
        if (this.disconnected) return;
        const currentId = this.id;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Disconnect peer with ID:${currentId}`);
        this._disconnected = true;
        this._open = false;
        this.socket.close();
        this._lastServerId = currentId;
        this._id = null;
        this.emit("disconnected", currentId);
      }
      /** Attempts to reconnect with the same ID.
      *
      * Only {@apilink Peer.disconnect | disconnected peers} can be reconnected.
      * Destroyed peers cannot be reconnected.
      * If the connection fails (as an example, if the peer's old ID is now taken),
      * the peer's existing connections will not close, but any associated errors events will fire.
      */
      reconnect() {
        if (this.disconnected && !this.destroyed) {
          (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Attempting reconnection to server with ID ${this._lastServerId}`);
          this._disconnected = false;
          this._initialize(this._lastServerId);
        } else if (this.destroyed) throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
        else if (!this.disconnected && !this.open)
          (0, $257947e92926277a$export$2e2bcd8739ae039).error("In a hurry? We're still trying to make the initial connection!");
        else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
      }
      /**
      * Get a list of available peer IDs. If you're running your own server, you'll
      * want to set allow_discovery: true in the PeerServer options. If you're using
      * the cloud server, email team@peerjs.com to get the functionality enabled for
      * your key.
      */
      listAllPeers(cb = (_) => {
      }) {
        this._api.listAllPeers().then((peers) => cb(peers)).catch((error) => this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
      }
    };
    $20dbe68149d7aad9$export$72aa44612e2200cd = class extends (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9) {
      constructor(peerId, provider, options) {
        super(peerId, provider, {
          ...options,
          reliable: true
        }), this._CHUNK_SIZE = 32768, this._splitStream = new TransformStream({
          transform: (chunk, controller) => {
            for (let split = 0; split < chunk.length; split += this._CHUNK_SIZE) controller.enqueue(chunk.subarray(split, split + this._CHUNK_SIZE));
          }
        }), this._rawSendStream = new WritableStream({
          write: async (chunk, controller) => {
            const openEvent = new Promise((resolve) => this.dataChannel.addEventListener("bufferedamountlow", resolve, {
              once: true
            }));
            await (this.dataChannel.bufferedAmount <= (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT - chunk.byteLength || openEvent);
            try {
              this.dataChannel.send(chunk);
            } catch (e) {
              (0, $257947e92926277a$export$2e2bcd8739ae039).error(`DC#:${this.connectionId} Error when sending:`, e);
              controller.error(e);
              this.close();
            }
          }
        }), this.writer = this._splitStream.writable.getWriter(), this._rawReadStream = new ReadableStream({
          start: (controller) => {
            this.once("open", () => {
              this.dataChannel.addEventListener("message", (e) => {
                controller.enqueue(e.data);
              });
            });
          }
        });
        this._splitStream.readable.pipeTo(this._rawSendStream);
      }
      _initializeDataChannel(dc) {
        super._initializeDataChannel(dc);
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.bufferedAmountLowThreshold = (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT / 2;
      }
    };
    $6e39230ab36396ad$export$80f5de1a66c4d624 = class extends (0, $20dbe68149d7aad9$export$72aa44612e2200cd) {
      constructor(peerId, provider, options) {
        super(peerId, provider, options), this.serialization = "MsgPack", this._encoder = new (0, Encoder)();
        (async () => {
          for await (const msg of (0, decodeMultiStream)(this._rawReadStream)) {
            if (msg.__peerData?.type === "close") {
              this.close();
              return;
            }
            this.emit("data", msg);
          }
        })();
      }
      _send(data) {
        return this.writer.write(this._encoder.encode(data));
      }
    };
    $1e0aff16be2c328e$export$d72c7bf8eef50853 = class extends (0, $416260bce337df90$export$ecd1fc136c422448) {
      constructor(...args) {
        super(...args), this._serializers = {
          MsgPack: $6e39230ab36396ad$export$80f5de1a66c4d624,
          default: (0, $6e39230ab36396ad$export$80f5de1a66c4d624)
        };
      }
    };
    $dd0187d7f28e386f$export$2e2bcd8739ae039 = (0, $416260bce337df90$export$ecd1fc136c422448);
  }
});

// src/index.ts
var SyncableDatabase = class _SyncableDatabase {
  dbName;
  mode;
  peerServerConfig;
  discoveryInterval;
  worker = null;
  peer = null;
  peerId = null;
  peers = /* @__PURE__ */ new Map();
  pendingRequests = /* @__PURE__ */ new Map();
  nextRequestId = 0;
  isInitialized = false;
  // Auto-sync properties
  discoveryTimer = null;
  operationQueue = [];
  appliedOperations = /* @__PURE__ */ new Set();
  // Event callbacks
  onPeerConnectedCallbacks = [];
  onPeerDisconnectedCallbacks = [];
  onSyncReceivedCallbacks = [];
  constructor(dbName, mode, peerServerConfig, discoveryInterval) {
    this.dbName = dbName;
    this.mode = mode;
    this.peerServerConfig = peerServerConfig;
    this.discoveryInterval = discoveryInterval ?? 5e3;
  }
  static async create(dbName, config) {
    const db = new _SyncableDatabase(dbName, config.mode, config.peerServer, config.discoveryInterval);
    await db.init();
    return db;
  }
  async init() {
    console.log(`[SyncableDatabase] Starting initialization for database: ${this.dbName}`);
    if (typeof window === "undefined" && typeof Worker === "undefined") {
      throw new Error("SyncableDatabase requires a browser environment");
    }
    const baseUrl = new URL("./", import.meta.url).href;
    console.log(`[SyncableDatabase] Base URL for assets: ${baseUrl}`);
    const { workerCode: workerCode2 } = await Promise.resolve().then(() => (init_worker_string(), worker_string_exports));
    const modifiedWorkerCode = workerCode2.replace(
      /import\.meta\.url/g,
      JSON.stringify(baseUrl + "worker.js")
    );
    const workerBlob = new Blob([modifiedWorkerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(workerBlob);
    console.log(`[SyncableDatabase] Worker blob URL created`);
    this.worker = new Worker(workerUrl, { type: "module" });
    this.worker.onmessage = (event) => {
      const { id, success, result, error } = event.data;
      const pending = this.pendingRequests.get(id);
      if (pending) {
        if (success) {
          pending.resolve(result);
        } else {
          pending.reject(new Error(error));
        }
        this.pendingRequests.delete(id);
      }
    };
    this.worker.onerror = (error) => {
      console.error("Worker error:", error);
    };
    console.log(`[SyncableDatabase] Sending init request to worker...`);
    await this.sendRequest("init", this.dbName, []);
    console.log(`[SyncableDatabase] SQLite WASM initialized successfully`);
    console.log(`[SyncableDatabase] Creating database: ${this.dbName}`);
    await this.sendRequest("createDb", this.dbName, []);
    console.log(`[SyncableDatabase] Database created successfully`);
    this.isInitialized = true;
    console.log(`[SyncableDatabase] Initialization complete for database: ${this.dbName}`);
    if (this.mode === "syncing") {
      console.log(`[SyncableDatabase] Initializing peer connection...`);
      await this.initPeer();
      this.startDiscovery();
    }
  }
  async initPeer() {
    const { Peer } = await Promise.resolve().then(() => (init_bundler(), bundler_exports));
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const peerIdWithPrefix = `${this.dbName}-${uniqueId}`;
    const peerOptions = {
      // Use Google STUN servers as fallback ICE servers
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" }
        ]
      }
    };
    if (this.peerServerConfig) {
      if (this.peerServerConfig.host) peerOptions.host = this.peerServerConfig.host;
      if (this.peerServerConfig.port) peerOptions.port = this.peerServerConfig.port;
      if (this.peerServerConfig.path) peerOptions.path = this.peerServerConfig.path;
      if (this.peerServerConfig.secure !== void 0) peerOptions.secure = this.peerServerConfig.secure;
    }
    await new Promise((resolve, reject) => {
      const peer = new Peer(peerIdWithPrefix, peerOptions);
      peer.on("open", (id) => {
        this.peerId = id;
        this.peer = peer;
        resolve();
      });
      peer.on("connection", (conn) => {
        this.handleIncomingConnection(conn);
      });
      peer.on("error", (err) => {
        console.error("Peer error:", err);
        reject(err);
      });
    });
  }
  startDiscovery() {
    this.discoveryTimer = setInterval(() => {
      this.discoverPeers().catch((err) => {
        console.error("Discovery error:", err);
      });
    }, this.discoveryInterval);
    this.discoverPeers().catch((err) => {
      console.error("Initial discovery error:", err);
    });
  }
  async discoverPeers() {
    if (this.mode !== "syncing" || !this.peerServerConfig) {
      return;
    }
    try {
      const protocol = this.peerServerConfig.secure ? "https" : "http";
      const host = this.peerServerConfig.host || "localhost";
      const port = this.peerServerConfig.port || 9e3;
      const path = this.peerServerConfig.path || "/";
      const url = `${protocol}://${host}:${port}${path}peerjs/peers`;
      const response = await fetch(url);
      if (!response.ok) {
        return;
      }
      const allPeers = await response.json();
      const dbPrefix = `${this.dbName}-`;
      const sameDatabasePeers = allPeers.filter(
        (id) => id.startsWith(dbPrefix) && id !== this.peerId
      );
      for (const remotePeerId of sameDatabasePeers) {
        if (!this.peers.has(remotePeerId)) {
          try {
            await this.connectToPeer(remotePeerId);
          } catch (err) {
            console.error(`Failed to connect to discovered peer ${remotePeerId}:`, err);
          }
        }
      }
    } catch (err) {
    }
  }
  handleIncomingConnection(conn) {
    const peerId = conn.peer;
    conn.on("open", () => {
      const peerConn = new PeerConnection(peerId, conn, this);
      this.peers.set(peerId, peerConn);
      this.emitPeerConnected(peerId);
    });
    conn.on("close", () => {
      this.peers.delete(peerId);
      this.emitPeerDisconnected(peerId);
    });
    conn.on("error", (err) => {
      console.error("Connection error:", err);
      this.peers.delete(peerId);
      this.emitPeerDisconnected(peerId);
    });
  }
  sendRequest(type, dbName, args, extra) {
    const id = this.nextRequestId++;
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker?.postMessage({ id, type, dbName, args, ...extra });
    });
  }
  async exec(sql, params) {
    if (!this.isInitialized) {
      throw new Error("Database not initialized");
    }
    const result = await this.sendRequest("exec", this.dbName, [sql, params]);
    if (this.mode === "syncing" && result.affectedRows && result.affectedRows.length > 0) {
      const processedSql = await this.sendRequest("getLastProcessedSql", this.dbName, []);
      for (const affected of result.affectedRows) {
        const operation = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          sql: processedSql,
          table: affected.table,
          rowId: affected.id
        };
        this.broadcastOperation(operation);
      }
    }
    return result;
  }
  broadcastOperation(operation) {
    this.appliedOperations.add(operation.id);
    if (this.peers.size === 0) {
      this.operationQueue.push(operation);
      return;
    }
    for (const peerConn of this.peers.values()) {
      peerConn.sendOperation(operation);
    }
  }
  async applyRemoteOperation(operation) {
    if (this.appliedOperations.has(operation.id)) {
      return;
    }
    this.appliedOperations.add(operation.id);
    await this.sendRequest("execRaw", this.dbName, [operation.sql]);
    this.emitSyncReceived(operation);
  }
  async export() {
    if (!this.isInitialized) {
      throw new Error("Database not initialized");
    }
    const data = await this.sendRequest("export", this.dbName, []);
    return new Uint8Array(data);
  }
  async import(data) {
    if (!this.isInitialized) {
      throw new Error("Database not initialized");
    }
    await this.sendRequest("import", this.dbName, [Array.from(data)]);
  }
  async connectToPeer(peerId) {
    if (this.mode !== "syncing") {
      throw new Error("Cannot connect to peers in local mode");
    }
    if (!this.peer) {
      throw new Error("Peer not initialized");
    }
    if (peerId === this.peerId) {
      return;
    }
    if (this.peers.has(peerId)) {
      return;
    }
    const conn = this.peer.connect(peerId);
    await new Promise((resolve, reject) => {
      conn.on("open", () => {
        const peerConn = new PeerConnection(peerId, conn, this);
        this.peers.set(peerId, peerConn);
        this.emitPeerConnected(peerId);
        resolve();
      });
      conn.on("error", reject);
      setTimeout(() => reject(new Error("Connection timeout")), 1e4);
    });
  }
  async disconnectFromPeer(peerId) {
    const peerConnection = this.peers.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      this.peers.delete(peerId);
      this.emitPeerDisconnected(peerId);
    }
  }
  async exportToPeer(peerId) {
    const peerConnection = this.peers.get(peerId);
    if (!peerConnection) {
      throw new Error(`Peer ${peerId} not connected`);
    }
    await peerConnection.requestExport();
  }
  async importFromPeer(peerId) {
    const peerConnection = this.peers.get(peerId);
    if (!peerConnection) {
      throw new Error(`Peer ${peerId} not connected`);
    }
    await peerConnection.requestImport();
  }
  async exportToAllPeers() {
    const promises = Array.from(this.peers.keys()).map(
      (peerId) => this.exportToPeer(peerId).catch(
        (err) => console.error(`Failed to export to ${peerId}:`, err)
      )
    );
    await Promise.all(promises);
  }
  async importFromAllPeers() {
    const promises = Array.from(this.peers.keys()).map(
      (peerId) => this.importFromPeer(peerId).catch(
        (err) => console.error(`Failed to import from ${peerId}:`, err)
      )
    );
    await Promise.all(promises);
  }
  async merge(remoteData) {
    if (!this.isInitialized) {
      throw new Error("Database not initialized");
    }
    await this.sendRequest("merge", this.dbName, [Array.from(remoteData)]);
  }
  getPeerId() {
    return this.peerId;
  }
  getConnectedPeers() {
    return Array.from(this.peers.values()).map((p) => ({
      id: p.getPeerId(),
      status: p.isConnected() ? "connected" : "disconnected"
    }));
  }
  isConnected() {
    return this.peers.size > 0;
  }
  // Offline queue management
  getQueuedOperations() {
    return [...this.operationQueue];
  }
  async pushQueuedOperations() {
    if (this.peers.size === 0) {
      throw new Error("No peers connected");
    }
    for (const operation of this.operationQueue) {
      for (const peerConn of this.peers.values()) {
        peerConn.sendOperation(operation);
      }
    }
    this.operationQueue = [];
  }
  clearQueue() {
    this.operationQueue = [];
  }
  // Event registration
  onPeerConnected(callback) {
    this.onPeerConnectedCallbacks.push(callback);
  }
  onPeerDisconnected(callback) {
    this.onPeerDisconnectedCallbacks.push(callback);
  }
  onSyncReceived(callback) {
    this.onSyncReceivedCallbacks.push(callback);
  }
  // Event emitters
  emitPeerConnected(peerId) {
    for (const cb of this.onPeerConnectedCallbacks) {
      try {
        cb(peerId);
      } catch (e) {
        console.error("Callback error:", e);
      }
    }
  }
  emitPeerDisconnected(peerId) {
    for (const cb of this.onPeerDisconnectedCallbacks) {
      try {
        cb(peerId);
      } catch (e) {
        console.error("Callback error:", e);
      }
    }
  }
  emitSyncReceived(operation) {
    for (const cb of this.onSyncReceivedCallbacks) {
      try {
        cb(operation);
      } catch (e) {
        console.error("Callback error:", e);
      }
    }
  }
  async close() {
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = null;
    }
    for (const peerConn of this.peers.values()) {
      peerConn.close();
    }
    this.peers.clear();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    await this.sendRequest("close", this.dbName, []);
    this.worker?.terminate();
    this.worker = null;
    this.isInitialized = false;
  }
};
var PeerConnection = class {
  peerId;
  connection;
  db;
  pendingExport = null;
  pendingImport = null;
  constructor(peerId, connection, db) {
    this.peerId = peerId;
    this.connection = connection;
    this.db = db;
    this.connection.on("data", async (data) => {
      const msg = data;
      if (msg.type === "sync-operation" && msg.operation) {
        await this.db.applyRemoteOperation(msg.operation);
      } else if (msg.type === "exportData" && msg.data) {
        const dataArray = new Uint8Array(msg.data);
        await this.db.import(dataArray);
        this.pendingExport?.resolve();
        this.pendingExport = null;
      } else if (msg.type === "exportRequest") {
        const exportData = await this.db.export();
        this.connection.send({ type: "exportData", data: Array.from(exportData) });
      } else if (msg.type === "importData" && msg.data) {
        await this.db.import(new Uint8Array(msg.data));
      }
    });
    this.connection.on("close", () => {
      this.pendingExport?.reject(new Error("Connection closed"));
      this.pendingImport?.reject(new Error("Connection closed"));
    });
    this.connection.on("error", (err) => {
      this.pendingExport?.reject(err);
      this.pendingImport?.reject(err);
    });
  }
  sendOperation(operation) {
    if (this.connection.open) {
      this.connection.send({ type: "sync-operation", operation });
    }
  }
  async requestExport() {
    if (!this.connection.open) {
      throw new Error(`Peer ${this.peerId} not connected`);
    }
    this.connection.send({ type: "exportRequest" });
    return new Promise((resolve, reject) => {
      this.pendingExport = { resolve, reject };
      setTimeout(() => {
        if (this.pendingExport) {
          this.pendingExport.reject(new Error("Export request timed out"));
          this.pendingExport = null;
        }
      }, 3e4);
    });
  }
  async requestImport() {
    if (!this.connection.open) {
      throw new Error(`Peer ${this.peerId} not connected`);
    }
    const exportData = await this.db.export();
    this.connection.send({ type: "importData", data: Array.from(exportData) });
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
  isConnected() {
    return this.connection.open;
  }
  getPeerId() {
    return this.peerId;
  }
  close() {
    this.connection.close();
  }
};
async function createDatabase(dbName, config) {
  return SyncableDatabase.create(dbName, config);
}
function syncableSqliteVitePlugin() {
  return {
    name: "syncable-sqlite-wasm-fix",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";
        if (url.includes("/worker.js") || url.endsWith(".js")) {
          const headers = res.getHeaders?.() || {};
          if (!headers["content-type"]) {
            res.setHeader("Content-Type", "application/javascript");
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";
        if (url.includes("/worker.js") || url.endsWith(".js")) {
          const headers = res.getHeaders?.() || {};
          if (!headers["content-type"]) {
            res.setHeader("Content-Type", "application/javascript");
          }
        }
        next();
      });
    }
  };
}
export {
  SyncableDatabase,
  createDatabase,
  syncableSqliteVitePlugin
};
