"use strict";
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
exports.__esModule = true;
var jet_logger_1 = require("jet-logger");
var childProcess = require("child_process");
var logger = new jet_logger_1["default"]();
function exec(cmd, loc) {
    return new Promise(function (res, rej) {
        return childProcess.exec(cmd, { cwd: loc }, function (err, stdout, stderr) {
            if (!!stdout) {
                // logger.info(stdout);
            }
            if (!!stderr) {
                logger.warn(stderr);
            }
            return (!!err ? rej(err) : res(stdout));
        });
    });
}
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var projectRoot, dirRes, dirs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                projectRoot = process.argv[2] || '..';
                return [4 /*yield*/, exec('ls -d */', projectRoot)];
            case 1:
                dirRes = _a.sent();
                dirs = dirRes.trim().split('\n');
                dirs.forEach(function (dir) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c, origin_1, e_1;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 5, , 6]);
                                _b = (_a = logger).info;
                                _c = 'pwd: ';
                                return [4 /*yield*/, exec('pwd', projectRoot + "/" + dir)];
                            case 1: return [4 /*yield*/, _b.apply(_a, [_c + (_d.sent())])];
                            case 2:
                                _d.sent();
                                return [4 /*yield*/, exec("git remote get-url origin", projectRoot + "/" + dir)];
                            case 3:
                                origin_1 = _d.sent();
                                logger.info('origin ' + origin_1);
                                if (!origin_1.includes('***REMOVED***:***REMOVED***')) {
                                    logger.warn("can't migrate repo " + dir);
                                    return [2 /*return*/];
                                }
                                origin_1 = origin_1.replace('***REMOVED***:***REMOVED***', 'github.com:***REMOVED***');
                                return [4 /*yield*/, exec("git remote set-url origin " + origin_1, projectRoot + "/" + dir)];
                            case 4:
                                _d.sent();
                                return [3 /*break*/, 6];
                            case 5:
                                e_1 = _d.sent();
                                if (e_1.toString().includes('not a git repository')) {
                                    return [2 /*return*/];
                                }
                                throw e_1;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
main();
