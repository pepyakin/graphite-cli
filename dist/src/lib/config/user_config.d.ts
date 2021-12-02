declare type UserConfigT = {
    branchPrefix?: string;
    authToken?: string;
    tips?: boolean;
};
declare class UserConfig {
    _data: UserConfigT;
    constructor(data: UserConfigT);
    setAuthToken(authToken: string): void;
    getAuthToken(): string | undefined;
    setBranchPrefix(branchPrefix: string): void;
    getBranchPrefix(): string | undefined;
    tipsEnabled(): boolean;
    toggleTips(enabled: boolean): void;
    private save;
    path(): string;
}
declare const userConfigSingleton: UserConfig;
export default userConfigSingleton;
