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
exports.handler = exports.builder = exports.description = exports.command = void 0;
const child_process_1 = require("child_process");
const tmp_1 = __importDefault(require("tmp"));
const git_repo_1 = __importDefault(require("../../test/utils/git_repo"));
const telemetry_1 = require("../lib/telemetry");
exports.command = "demo";
exports.description = false;
const args = {};
exports.builder = args;
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    return telemetry_1.profiledHandler(exports.command, () => __awaiter(void 0, void 0, void 0, function* () {
        const tmpDir = tmp_1.default.dirSync();
        console.log(tmpDir.name);
        const repo = new git_repo_1.default(tmpDir.name);
        repo.createChangeAndCommit("First commit");
        repo.createChangeAndCommit("Second commit");
        repo.createChange("[Product] Add review queue filter api");
        execCliCommand("branch create 'tr--review_queue_api' -m '[Product] Add review queue filter api'", { fromDir: tmpDir.name });
        repo.createChange("[Product] Add review queue filter server");
        execCliCommand("branch create 'tr--review_queue_server' -m '[Product] Add review queue filter server'", { fromDir: tmpDir.name });
        repo.createChange("[Product] Add review queue filter frontend");
        execCliCommand("branch create 'tr--review_queue_frontend' -m '[Product] Add review queue filter frontend'", { fromDir: tmpDir.name });
        repo.checkoutBranch("main");
        repo.createChange("[Bug Fix] Fix crashes on reload");
        execCliCommand("branch create 'tr--fix_crash_on_reload' -m '[Bug Fix] Fix crashes on reload'", { fromDir: tmpDir.name });
        repo.checkoutBranch("main");
        repo.createChange("[Bug Fix] Account for empty state");
        execCliCommand("branch create 'tr--account_for_empty_state' -m '[Bug Fix] Account for empty state'", { fromDir: tmpDir.name });
        repo.checkoutBranch("main");
    }));
});
exports.handler = handler;
function execCliCommand(command, opts) {
    child_process_1.execSync(`gp ${command}`, {
        stdio: "inherit",
        cwd: opts.fromDir,
    });
}
//# sourceMappingURL=demo.js.map