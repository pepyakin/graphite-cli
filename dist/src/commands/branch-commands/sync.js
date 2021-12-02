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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.description = exports.canoncial = exports.command = exports.aliases = void 0;
const chalk_1 = __importDefault(require("chalk"));
const print_stack_1 = require("../../actions/print_stack");
const config_1 = require("../../lib/config");
const preconditions_1 = require("../../lib/preconditions");
const pr_info_1 = require("../../lib/sync/pr_info");
const telemetry_1 = require("../../lib/telemetry");
const utils_1 = require("../../lib/utils");
const args = {
    reset: {
        describe: `Removes current GitHub PR information linked to the current branch`,
        demandOption: false,
        type: "boolean",
    },
};
exports.aliases = [];
exports.command = "sync";
exports.canoncial = "branch sync";
exports.description = "Fetch GitHub PR information for the current branch.";
exports.builder = args;
const handler = (argv) => __awaiter(void 0, void 0, void 0, function* () {
    return telemetry_1.profile(argv, exports.canoncial, () => __awaiter(void 0, void 0, void 0, function* () {
        const branch = preconditions_1.currentBranchPrecondition();
        if (argv.reset) {
            branch.clearPRInfo();
            return;
        }
        yield pr_info_1.syncPRInfoForBranches([branch]);
        const prInfo = branch.getPRInfo();
        if (prInfo === undefined) {
            utils_1.logError(`Could not find associated PR. Please double-check that a PR exists on GitHub in repo ${chalk_1.default.bold(config_1.repoConfig.getRepoName())} for the branch ${chalk_1.default.bold(branch.name)}.`);
            return;
        }
        console.log(print_stack_1.getBranchTitle(branch, {
            currentBranch: null,
            offTrunk: false,
            visited: [],
        }));
        const prTitle = prInfo.title;
        if (prTitle !== undefined) {
            console.log(prTitle);
        }
        const prURL = prInfo.url;
        if (prURL !== undefined) {
            console.log(prURL);
        }
    }));
});
exports.handler = handler;
//# sourceMappingURL=sync.js.map