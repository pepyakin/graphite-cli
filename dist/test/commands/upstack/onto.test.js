"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const scenes_1 = require("../../scenes");
const utils_1 = require("../../utils");
for (const scene of scenes_1.allScenes) {
    describe(`(${scene}): upstack onto`, function () {
        utils_1.configureTest(this, scene);
        it("Can fix a leaf stack onto main", () => {
            scene.repo.createChange("2", "a");
            scene.repo.execCliCommand("branch create 'a' -m '2' -s");
            scene.repo.createChange("3", "b");
            scene.repo.execCliCommand("branch create 'b' -m '3' -s");
            scene.repo.execCliCommand("upstack onto main -s");
            scene.repo.expectCommits("3, 1");
            chai_1.expect(() => scene.repo.execCliCommand("validate -s")).not.to.throw;
        });
        it("Can gracefully catch a merge conflict on first rebase", () => {
            scene.repo.createChange("2", "a");
            scene.repo.execCliCommand("branch create 'a' -m '2' -s");
            scene.repo.checkoutBranch("main");
            scene.repo.createChangeAndCommit("3", "a");
            scene.repo.checkoutBranch("a");
            chai_1.expect(() => {
                scene.repo.execCliCommand("upstack onto main -s");
            }).to.not.throw();
        });
        it("Can recover a branch that has no git and meta parents", () => {
            // Create our dangling branch
            scene.repo.createAndCheckoutBranch("a");
            scene.repo.createChangeAndCommit("a1", "a1");
            scene.repo.createChangeAndCommit("a2", "a2");
            scene.repo.createChangeAndCommit("a3", "a3");
            // Move main forward
            scene.repo.checkoutBranch("main");
            scene.repo.createChangeAndCommit("b", "b");
            // branch a is dangling now, but we should still be able to "upstack onto" main
            scene.repo.checkoutBranch("a");
            chai_1.expect(() => {
                scene.repo.execCliCommand("upstack onto main");
            }).to.not.throw();
            scene.repo.expectCommits("a3, a2, a1, b, 1");
            scene.repo.checkoutBranch("a");
            // Prove that we have meta now.
            scene.repo.execCliCommand("branch prev");
            chai_1.expect(scene.repo.currentBranchName()).to.eq("main");
        });
    });
}
//# sourceMappingURL=onto.test.js.map