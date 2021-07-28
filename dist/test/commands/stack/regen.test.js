"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs_extra_1 = __importDefault(require("fs-extra"));
const tmp_1 = __importDefault(require("tmp"));
const branch_1 = __importDefault(require("../../../src/wrapper-classes/branch"));
const exec_cli_command_1 = require("../../utils/exec_cli_command");
const git_repo_1 = __importDefault(require("../../utils/git_repo"));
describe("stack regen", function () {
    let tmpDir;
    let repo;
    const oldDir = __dirname;
    this.beforeEach(() => {
        tmpDir = tmp_1.default.dirSync();
        process.chdir(tmpDir.name);
        repo = new git_repo_1.default(tmpDir.name);
        repo.createChangeAndCommit("1");
    });
    afterEach(() => {
        process.chdir(oldDir);
        fs_extra_1.default.emptyDirSync(tmpDir.name);
        tmpDir.removeCallback();
    });
    this.timeout(5000);
    it("Can fix a stack", () => {
        repo.createChange("2");
        exec_cli_command_1.execCliCommand(`branch create "a" -s`, { fromDir: tmpDir.name });
        repo.createChangeAndCommit("3");
        repo.createAndCheckoutBranch("b");
        repo.createChangeAndCommit("4");
        const branch = new branch_1.default("b");
        chai_1.expect(branch.stackByTracingMetaParents().join(",")).not.to.equal(branch.stackByTracingGitParents().join(","));
        repo.checkoutBranch("main");
        exec_cli_command_1.execCliCommand("stack regen -s", { fromDir: tmpDir.name });
        repo.checkoutBranch("b");
        chai_1.expect(branch.stackByTracingMetaParents().join(",")).to.equal(branch.stackByTracingGitParents().join(","));
    });
});
//# sourceMappingURL=regen.test.js.map