declare namespace _default {
    let input: string;
    let output: ({
        dir: string;
        format: string;
        sourcemap: boolean;
        preserveModules: boolean;
        preserveModulesRoot: string;
        exports?: undefined;
    } | {
        dir: string;
        format: string;
        sourcemap: boolean;
        preserveModules: boolean;
        preserveModulesRoot: string;
        exports: string;
    })[];
    let plugins: (boolean | import("rollup").Plugin<any>)[];
    let external: string[];
}
export default _default;
//# sourceMappingURL=rollup.config.d.mts.map