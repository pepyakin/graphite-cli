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
exports.ontoAction = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const validate_1 = require("../actions/validate");
const print_stacks_1 = __importDefault(require("../commands/original-commands/print-stacks"));
const log_1 = require("../lib/log");
const utils_1 = require("../lib/utils");
const branch_1 = __importDefault(require("../wrapper-classes/branch"));
const fix_1 = require("./fix");
function ontoAction(onto, silent) {
    return __awaiter(this, void 0, void 0, function* () {
        if (utils_1.uncommittedChanges()) {
            utils_1.logErrorAndExit("Cannot restack with uncommitted changes");
        }
        // Print state before
        log_1.log(`Before restack:`, { silent });
        !silent && (yield new print_stacks_1.default().executeUnprofiled({ silent }));
        const originalBranch = branch_1.default.getCurrentBranch();
        if (originalBranch === null) {
            utils_1.logErrorAndExit(`Not currently on a branch; no target to restack.`);
        }
        yield restackOnto(originalBranch, onto, silent);
        utils_1.checkoutBranch(originalBranch.name);
        // Print state after
        log_1.log(`After restack:`, { silent });
        !silent && (yield new print_stacks_1.default().executeUnprofiled({ silent }));
    });
}
exports.ontoAction = ontoAction;
function restackOnto(currentBranch, onto, silent) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check that the current branch has a parent to prevent moving main
        checkBranchCanBeMoved(currentBranch, onto, silent);
        yield validateStack(silent);
        const parent = getParentForRebaseOnto(currentBranch, silent);
        // Save the old ref from before rebasing so that children can find their bases.
        currentBranch.setMetaPrevRef(currentBranch.getCurrentRef());
        child_process_1.execSync(`git rebase --onto ${onto} $(git merge-base ${currentBranch.name} ${parent.name}) ${currentBranch.name}`, { stdio: "ignore" });
        // set current branch's parent only if the rebase succeeds.
        currentBranch.setParentBranchName(onto);
        // Now perform a restack starting from the onto branch:
        for (const child of yield currentBranch.getChildrenFromMeta()) {
            yield fix_1.restackBranch(child, silent);
        }
    });
}
function validateStack(silent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield validate_1.validate("UPSTACK", silent);
        }
        catch (_a) {
            log_1.log(chalk_1.default.red(`Cannot "restack --onto", git derived stack must match meta defined stack. Consider running "restack" or "fix" first.`), { silent });
            process.exit(1);
        }
    });
}
function checkBranchCanBeMoved(branch, onto, silent) {
    if (utils_1.trunkBranches && branch.name in utils_1.trunkBranches) {
        log_1.log(chalk_1.default.red(`Cannot restack (${branch.name}) onto ${onto}, (${branch.name}) is listed in (${utils_1.CURRENT_REPO_CONFIG_PATH}) as a trunk branch.`), { silent });
        process.exit(1);
    }
}
function getParentForRebaseOnto(branch, silent) {
    const parent = branch.getParentFromMeta();
    if (!parent) {
        log_1.log(chalk_1.default.red(`Cannot "restack --onto", (${branch.name}) has no parent as defined by the meta.`), { silent });
        process.exit(1);
    }
    return parent;
}
//# sourceMappingURL=onto.js.map