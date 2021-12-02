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
const chai_1 = require("chai");
const branch_1 = __importDefault(require("../../../../src/wrapper-classes/branch"));
const scenes_1 = require("../../../lib/scenes");
const utils_1 = require("../../../lib/utils");
for (const scene of scenes_1.allScenes) {
    describe(`(${scene}): branch create`, function () {
        utils_1.configureTest(this, scene);
        it("Can run branch create", () => {
            scene.repo.execCliCommand(`branch create "a" -q`);
            chai_1.expect(scene.repo.currentBranchName()).to.equal("a");
            scene.repo.createChangeAndCommit("2", "2");
            scene.repo.execCliCommand("branch prev --no-interactive");
            chai_1.expect(scene.repo.currentBranchName()).to.equal("main");
        });
        it("Can rollback changes on a failed commit hook", () => {
            // Aggressive AF commit hook from your angry coworker
            scene.repo.createPrecommitHook("exit 1");
            scene.repo.createChange("2");
            chai_1.expect(() => {
                scene.repo.execCliCommand(`branch create "a" -m "a" -q`);
            }).to.throw(Error);
            chai_1.expect(scene.repo.currentBranchName()).to.equal("main");
        });
        it("Can create a branch without providing a name", () => {
            scene.repo.createChange("2");
            scene.repo.execCliCommand(`branch create -m "feat(test): info" -q`);
            chai_1.expect(scene.repo.currentBranchName().includes("feat_test_info")).to.be
                .true;
        });
        it("Can create a branch with add all option", () => {
            scene.repo.createChange("23", "test", true);
            chai_1.expect(scene.repo.unstagedChanges()).to.be.true;
            scene.repo.execCliCommand(`branch create test-branch -m "add all" -a -q`);
            chai_1.expect(scene.repo.unstagedChanges()).to.be.false;
        });
        it("Cant create a branch off an ignored branch", () => {
            scene.repo.createAndCheckoutBranch("a");
            scene.repo.execCliCommand("repo init --trunk main --ignore-branches a");
            chai_1.expect(() => scene.repo.execCliCommand(`branch create test -q`)).to.throw(Error);
        });
        it("Create a branch clears any old, stale metadata", () => __awaiter(this, void 0, void 0, function* () {
            scene.repo.createChange("2");
            scene.repo.execCliCommand("branch create a -m 'a'");
            const branch = yield branch_1.default.branchWithName("a");
            branch.setPRInfo({
                number: 1,
                base: "main",
            });
            chai_1.expect((yield branch_1.default.branchWithName("a")).getPRInfo() !== undefined).to.be
                .true;
            scene.repo.checkoutBranch("main");
            scene.repo.deleteBranch("a");
            scene.repo.createChange("2");
            scene.repo.execCliCommand("branch create a -m 'a'");
            // Upon recreating the branch, the old PR info should be gone.
            chai_1.expect((yield branch_1.default.branchWithName("a")).getPRInfo() === undefined).to.be
                .true;
        }));
    });
}
//# sourceMappingURL=branch_create.test.js.map