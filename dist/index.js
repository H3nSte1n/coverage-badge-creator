/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Controller = void 0;
const CoverageWorker_1 = __nccwpck_require__(883);
const ReadmeWorker_1 = __nccwpck_require__(891);
const Globals_1 = __nccwpck_require__(923);
class Controller {
    static run() {
        const BadgeStatsObj = CoverageWorker_1.Coverage.init().validate();
        ReadmeWorker_1.Readme.prepareData(BadgeStatsObj, Globals_1.Globals.BADGES).insertCov();
    }
}
exports.Controller = Controller;


/***/ }),

/***/ 923:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Globals = void 0;
const path_1 = __importDefault(__nccwpck_require__(928));
const ArgvOptionsEnum_1 = __nccwpck_require__(487);
class Globals {
    constructor() {
        if (!Globals.instance) {
            Globals.instance = new Globals();
        }
        return Globals.instance;
    }
    static init(config) {
        const covPath = config?.coverage_file_path || this.DEFAULT_COV_PATH;
        this.DEFAULT_COV_PATH = path_1.default.isAbsolute(covPath) ? covPath : path_1.default.resolve(process.cwd(), covPath);
        const readmePath = config?.readmeFilePath || this.BASE_README_PATH;
        this.BASE_README_PATH = path_1.default.isAbsolute(readmePath) ? readmePath : path_1.default.resolve(process.cwd(), readmePath);
        this.BADGES = config?.badges || this.BADGES;
        this.FORMAT = config?.format ?? this.FORMAT;
    }
    static loadArgv() {
        return new Promise((resolve) => {
            Object.keys(ArgvOptionsEnum_1.ArgvOptionsEnum).forEach((argvOptionKey) => {
                const argvOptionIndex = process.argv.indexOf(ArgvOptionsEnum_1.ArgvOptionsEnum[argvOptionKey]);
                if (argvOptionIndex !== -1) {
                    const globalKey = argvOptionKey;
                    Globals[globalKey] = process.argv[argvOptionIndex + 1];
                }
            });
            resolve();
        });
    }
}
exports.Globals = Globals;
Globals.CONFIG_PATH = './.badge-config';
Globals.DEFAULT_COV_PATH = './coverage/coverage-summary.json';
Globals.COVERAGE_CATEGORIES = ['statements', 'branches', 'functions', 'lines'];
Globals.BADGE_BASE_URL = '![](https://img.shields.io/badge/';
Globals.BADGE_BASE_URL_PATTERN = '\\!\\[]\\(https:\\/\\/img\\.shields\\.io\\/badge\\/[^)]*prefix=&PATTERN&\\)';
Globals.BASE_README_PATH = './README.md';
Globals.BADGES = {};
Globals.FORMAT = undefined;


/***/ }),

/***/ 744:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const child_process_1 = __nccwpck_require__(317);
const fs_1 = __importDefault(__nccwpck_require__(896));
const path_1 = __importDefault(__nccwpck_require__(928));
const Globals_1 = __nccwpck_require__(923);
const SetupValidation_1 = __nccwpck_require__(230);
const Controller_1 = __nccwpck_require__(3);
const FormatEnum_1 = __nccwpck_require__(202);
function getInput(name) {
    return (process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] ?? '').trim();
}
function setOutput(name, value) {
    const outputFile = process.env['GITHUB_OUTPUT'];
    if (outputFile)
        fs_1.default.appendFileSync(outputFile, `${name}=${value}\n`);
}
function logInfo(msg) {
    process.stdout.write(msg + '\n');
}
function setFailed(msg) {
    process.exitCode = 1;
    process.stderr.write(msg + '\n');
}
const FORMAT_MAP = {
    istanbul: FormatEnum_1.FormatEnum.ISTANBUL,
    jest: FormatEnum_1.FormatEnum.ISTANBUL,
    lcov: FormatEnum_1.FormatEnum.LCOV,
    cobertura: FormatEnum_1.FormatEnum.COBERTURA,
    'coverage-py': FormatEnum_1.FormatEnum.COVERAGE_PY,
};
async function run() {
    try {
        const configPath = getInput('config-path');
        const coverageFilePath = getInput('coverage-file-path');
        const readmeFilePath = getInput('readme-file-path');
        const formatInput = getInput('format');
        const commit = getInput('commit') === 'true';
        const commitMessage = getInput('commit-message');
        const format = FORMAT_MAP[formatInput] ?? FormatEnum_1.FormatEnum.ISTANBUL;
        if (configPath) {
            Globals_1.Globals.CONFIG_PATH = path_1.default.resolve(process.cwd(), configPath);
        }
        await SetupValidation_1.SetupValidation.loadConfig();
        const overrides = { format };
        if (coverageFilePath)
            overrides.coverage_file_path = coverageFilePath;
        if (readmeFilePath)
            overrides.readmeFilePath = readmeFilePath;
        Globals_1.Globals.init(overrides);
        await SetupValidation_1.SetupValidation.scan();
        Controller_1.Controller.run();
        setOutput('updated', 'true');
        logInfo('\n\nBadges successfully created');
        if (commit) {
            const readmePath = Globals_1.Globals.BASE_README_PATH;
            (0, child_process_1.execFileSync)('git', ['config', '--local', 'user.name', 'github-actions[bot]']);
            (0, child_process_1.execFileSync)('git', ['config', '--local', 'user.email', 'github-actions[bot]@users.noreply.github.com']);
            (0, child_process_1.execFileSync)('git', ['add', readmePath]);
            try {
                (0, child_process_1.execFileSync)('git', ['diff', '--cached', '--quiet']);
            }
            catch {
                (0, child_process_1.execFileSync)('git', ['commit', '-m', commitMessage]);
                (0, child_process_1.execFileSync)('git', ['push']);
                logInfo('README committed and pushed');
            }
        }
    }
    catch (error) {
        setFailed(`Coverage Badge Creator failed: ${error}`);
    }
}
run();


/***/ }),

/***/ 487:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArgvOptionsEnum = void 0;
var ArgvOptionsEnum;
(function (ArgvOptionsEnum) {
    ArgvOptionsEnum["CONFIG_PATH"] = "--config";
})(ArgvOptionsEnum || (exports.ArgvOptionsEnum = ArgvOptionsEnum = {}));


/***/ }),

/***/ 517:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColorsEnum = void 0;
var ColorsEnum;
(function (ColorsEnum) {
    ColorsEnum["VERY_LOW"] = "733B27";
    ColorsEnum["LOW"] = "F2C572";
    ColorsEnum["SOME"] = "F2E96B";
    ColorsEnum["MUCH"] = "5A7302";
    ColorsEnum["GOOD"] = "83A603";
})(ColorsEnum || (exports.ColorsEnum = ColorsEnum = {}));


/***/ }),

/***/ 202:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormatEnum = void 0;
var FormatEnum;
(function (FormatEnum) {
    FormatEnum["ISTANBUL"] = "istanbul";
    FormatEnum["LCOV"] = "lcov";
    FormatEnum["COBERTURA"] = "cobertura";
    FormatEnum["COVERAGE_PY"] = "coverage-py";
})(FormatEnum || (exports.FormatEnum = FormatEnum = {}));


/***/ }),

/***/ 402:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoberturaParser = void 0;
class CoberturaParser {
    parse(fileContent) {
        const rootElement = fileContent.match(/<coverage[^>]+>/);
        const rootTag = rootElement ? rootElement[0] : '';
        const lineRateMatch = rootTag.match(/line-rate="([0-9.]+)"/);
        const branchRateMatch = rootTag.match(/branch-rate="([0-9.]+)"/);
        const linesPct = lineRateMatch ? parseFloat(lineRateMatch[1]) * 100 : 0;
        const branchPct = branchRateMatch ? parseFloat(branchRateMatch[1]) * 100 : 0;
        return {
            total: {
                lines: { pct: linesPct },
                statements: { pct: linesPct },
                branches: { pct: branchPct },
                functions: { pct: linesPct },
            },
        };
    }
}
exports.CoberturaParser = CoberturaParser;


/***/ }),

/***/ 422:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoveragePyJsonParser = void 0;
class CoveragePyJsonParser {
    parse(fileContent) {
        const data = JSON.parse(fileContent);
        const totals = data.totals;
        const linesPct = totals.percent_covered ?? 0;
        let branchPct = linesPct;
        if (totals.num_branches !== undefined && totals.num_branches > 0) {
            branchPct = ((totals.covered_branches ?? 0) / totals.num_branches) * 100;
        }
        return {
            total: {
                lines: { pct: linesPct },
                statements: { pct: linesPct },
                branches: { pct: branchPct },
                functions: { pct: linesPct },
            },
        };
    }
}
exports.CoveragePyJsonParser = CoveragePyJsonParser;


/***/ }),

/***/ 845:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IstanbulJsonParser = void 0;
const FileUtils_1 = __nccwpck_require__(938);
class IstanbulJsonParser {
    parse(fileContent) {
        return FileUtils_1.FileUtils.parseFile(fileContent);
    }
}
exports.IstanbulJsonParser = IstanbulJsonParser;


/***/ }),

/***/ 425:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LcovParser = void 0;
class LcovParser {
    parse(fileContent) {
        let lf = 0, lh = 0, brf = 0, brh = 0, fnf = 0, fnh = 0;
        for (const line of fileContent.split('\n')) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1)
                continue;
            const key = line.substring(0, colonIndex).trim();
            const val = parseInt(line.substring(colonIndex + 1), 10);
            if (isNaN(val))
                continue;
            if (key === 'LF')
                lf += val;
            else if (key === 'LH')
                lh += val;
            else if (key === 'BRF')
                brf += val;
            else if (key === 'BRH')
                brh += val;
            else if (key === 'FNF')
                fnf += val;
            else if (key === 'FNH')
                fnh += val;
        }
        const linesPct = lf > 0 ? (lh / lf) * 100 : 0;
        const branchPct = brf > 0 ? (brh / brf) * 100 : 0;
        const fnPct = fnf > 0 ? (fnh / fnf) * 100 : 0;
        return {
            total: {
                lines: { pct: linesPct },
                statements: { pct: linesPct },
                branches: { pct: branchPct },
                functions: { pct: fnPct },
            },
        };
    }
}
exports.LcovParser = LcovParser;


/***/ }),

/***/ 247:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParserFactory = void 0;
const IstanbulJsonParser_1 = __nccwpck_require__(845);
const LcovParser_1 = __nccwpck_require__(425);
const CoberturaParser_1 = __nccwpck_require__(402);
const CoveragePyJsonParser_1 = __nccwpck_require__(422);
const FormatEnum_1 = __nccwpck_require__(202);
class ParserFactory {
    static getParser(format) {
        switch (format) {
            case FormatEnum_1.FormatEnum.LCOV:
                return new LcovParser_1.LcovParser();
            case FormatEnum_1.FormatEnum.COBERTURA:
                return new CoberturaParser_1.CoberturaParser();
            case FormatEnum_1.FormatEnum.COVERAGE_PY:
                return new CoveragePyJsonParser_1.CoveragePyJsonParser();
            default:
                return new IstanbulJsonParser_1.IstanbulJsonParser();
        }
    }
}
exports.ParserFactory = ParserFactory;


/***/ }),

/***/ 938:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileUtils = void 0;
const fs_1 = __importDefault(__nccwpck_require__(896));
class FileUtils {
    static checkFileExist(filePath) {
        if (!fs_1.default.existsSync(filePath))
            return false;
        return true;
    }
    static readFile(filePath) {
        const file = fs_1.default.readFileSync(filePath, 'utf8');
        return file;
    }
    static parseFile(fileBody) {
        const file = JSON.parse(fileBody);
        return file;
    }
    static writeFile(path, content) {
        fs_1.default.writeFileSync(path, content, 'utf8');
    }
}
exports.FileUtils = FileUtils;


/***/ }),

/***/ 267:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringUtils = void 0;
class StringUtils {
    static replaceString(pattern, replacement, area) {
        return area.replace(pattern, replacement);
    }
}
exports.StringUtils = StringUtils;


/***/ }),

/***/ 144:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColorValidation = void 0;
const ColorsEnum_1 = __nccwpck_require__(517);
class ColorValidation {
    static validate(num) {
        switch (true) {
            case num < 15:
                return ColorsEnum_1.ColorsEnum.VERY_LOW;
            case num < 45:
                return ColorsEnum_1.ColorsEnum.LOW;
            case num < 65:
                return ColorsEnum_1.ColorsEnum.SOME;
            case num < 80:
                return ColorsEnum_1.ColorsEnum.MUCH;
            case num < 101:
                return ColorsEnum_1.ColorsEnum.GOOD;
            default:
                return 'grey';
        }
    }
}
exports.ColorValidation = ColorValidation;


/***/ }),

/***/ 230:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetupValidation = void 0;
const FileUtils_1 = __nccwpck_require__(938);
const Globals_1 = __nccwpck_require__(923);
class SetupValidation {
    static scan() {
        console.info('\nStep 2 -> Setup check process started');
        return Promise.all([
            this.checkFileExists(Globals_1.Globals.DEFAULT_COV_PATH, '❌ No Coverage file found', '✅ Coverage file exist'),
            this.checkFileExists(Globals_1.Globals.BASE_README_PATH, '❌ No README file found', '✅ README file exist'),
        ])
            .then((messages) => {
            console.info(messages.join('\n'));
        })
            .catch((errors) => {
            console.error(errors);
        });
    }
    static async loadConfig() {
        console.info('\nStep 1 -> Loading Configurations process started');
        await Globals_1.Globals.loadArgv();
        const configExist = SetupValidation.checkIfConfigFileExists();
        if (!configExist)
            return;
        return this.parseConfig();
    }
    static parseConfig() {
        const fileBody = FileUtils_1.FileUtils.readFile(Globals_1.Globals.CONFIG_PATH);
        let config = null;
        return new Promise((resolve, reject) => {
            try {
                config = FileUtils_1.FileUtils.parseFile(fileBody);
                Globals_1.Globals.init(config);
            }
            catch {
                console.error(`❌ Parsing configuration file failed. Configuration is incorrect.`);
                reject();
            }
            resolve();
            console.info('✅ Configuration loaded');
        });
    }
    static checkIfConfigFileExists() {
        const fileExist = FileUtils_1.FileUtils.checkFileExist(Globals_1.Globals.CONFIG_PATH);
        if (!fileExist) {
            console.error(`❌ No Config file found\nSkip...`);
        }
        else {
            console.info(`✅ Config file exist`);
        }
        return !!fileExist;
    }
    static checkFileExists(path, rejectMessage, resolveMessage) {
        return new Promise((resolve, reject) => {
            const fileExist = FileUtils_1.FileUtils.checkFileExist(path);
            if (!fileExist)
                reject(rejectMessage);
            resolve(resolveMessage);
        });
    }
}
exports.SetupValidation = SetupValidation;


/***/ }),

/***/ 574:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Badge = void 0;
const Globals_1 = __nccwpck_require__(923);
class Badge {
    static create(options, stats, prefix) {
        const label = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        let badgeURL = this.badgeBaseURL + `${label}-${Math.round(stats.coverage)}${encodeURI('%')}-${stats.color}.svg?`;
        for (const option of Object.keys(options)) {
            badgeURL = badgeURL.concat(`${option}=${options[option]}&`);
        }
        return badgeURL.concat(`prefix=$${prefix}$)`);
    }
}
exports.Badge = Badge;
Badge.badgeBaseURL = Globals_1.Globals.BADGE_BASE_URL;


/***/ }),

/***/ 883:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Coverage = void 0;
const ColorValidation_1 = __nccwpck_require__(144);
const FileUtils_1 = __nccwpck_require__(938);
const Globals_1 = __nccwpck_require__(923);
const ParserFactory_1 = __nccwpck_require__(247);
class Coverage {
    static init() {
        this.fileBody = FileUtils_1.FileUtils.readFile(Globals_1.Globals.DEFAULT_COV_PATH);
        const parser = ParserFactory_1.ParserFactory.getParser(Globals_1.Globals.FORMAT);
        this.CoverageJSON = parser.parse(this.fileBody);
        this.medianCov = 0;
        return this;
    }
    static validate() {
        const coveragesCategories = {};
        Globals_1.Globals.COVERAGE_CATEGORIES.forEach((key) => {
            coveragesCategories[key] = this.getCoverageStats(this.CoverageJSON.total[key]);
            this.medianCov += this.CoverageJSON.total[key].pct;
        });
        coveragesCategories['coverage'] = this.getCoverageStats({
            pct: this.medianCov / Globals_1.Globals.COVERAGE_CATEGORIES.length,
        });
        return coveragesCategories;
    }
    static getCoverageStats(covColumn) {
        return {
            coverage: covColumn.pct,
            color: ColorValidation_1.ColorValidation.validate(covColumn.pct),
        };
    }
}
exports.Coverage = Coverage;


/***/ }),

/***/ 891:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Readme = void 0;
const BadgeWorker_1 = __nccwpck_require__(574);
const Globals_1 = __nccwpck_require__(923);
const FileUtils_1 = __nccwpck_require__(938);
const StringUtils_1 = __nccwpck_require__(267);
class Readme {
    static prepareData(BadgeStatsObj, urlConfig) {
        this.replacementAttributes = [];
        if (!BadgeStatsObj)
            return this;
        for (const BadgeStatsColumnKey of Object.keys(BadgeStatsObj)) {
            this.replacementAttributes.push({
                pattern: `\\$${BadgeStatsColumnKey}\\$`,
                url: BadgeWorker_1.Badge.create(urlConfig[BadgeStatsColumnKey] || {}, BadgeStatsObj[BadgeStatsColumnKey], BadgeStatsColumnKey),
            });
        }
        return this;
    }
    static insertCov() {
        const filePath = Globals_1.Globals.BASE_README_PATH;
        let file = FileUtils_1.FileUtils.readFile(filePath);
        this.replacementAttributes.forEach((util) => {
            const baseUrlPattern = StringUtils_1.StringUtils.replaceString('&PATTERN&', util.pattern, Globals_1.Globals.BADGE_BASE_URL_PATTERN);
            const urlPattern = new RegExp(`(${baseUrlPattern})|(${util.pattern})`, 'gi');
            file = StringUtils_1.StringUtils.replaceString(urlPattern, util.url, file);
        });
        FileUtils_1.FileUtils.writeFile(filePath, file);
    }
}
exports.Readme = Readme;


/***/ }),

/***/ 317:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(744);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;