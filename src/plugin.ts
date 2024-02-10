import type { Mod, PluginClass } from "../node_modules/ultimate-crosscode-typedefs/modloader/mod";

const verRegex = /^v?(\d)\.(\d)\.(\d)(?:-(\d))?$/

export default class implements PluginClass {
    constructor(public mod: Mod) {};

    preload() {
        //@ts-ignore
        window.el ??= {};
    }

    prestart() {

        el.isCCVersionAtLeast = verString => {
            let ccver = `${sc.version.major}.${sc.version.minor}.${sc.version.patch}-${sc.version.hotfix}`;
            
            return window.semver.gte(verString, ccver);
        }

        import("./prestart/prestart.js");
    }

    poststart() {
        import("./poststart/poststart.js");
    }
}