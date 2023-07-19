import type { Mod, LegacyPluginClass } from "../node_modules/ultimate-crosscode-typedefs/modloader/mod";

const verRegex = /^v?(\d)\.(\d)\.(\d)(?:-(\d))?$/

export default class implements LegacyPluginClass {
    constructor(public mod: Mod) {};

    preload() {
        //@ts-ignore
        window.el ??= {};
    }

    prestart() {
        el.isCCVersionAtLeast = verString => {
            let match = verString.match(verRegex);
            if(!match) return false;
            let major = +match[1];
            let minor = +match[2];
            let patch = +match[3];
            let hotfix = +match[4] || 0;
            
            if(major < sc.version.major) {
                return true;
            } else if (major == sc.version.major) {
                if (minor < sc.version.minor) {
                    return true;
                } else if (minor == sc.version.minor) {
                    if(patch < sc.version.patch)
                        return true;
                    else if (patch == sc.version.patch) {
                        return hotfix <= sc.version.hotfix;
                    }
                }
            }

            return false;
        }

        import("./prestart/prestart.js");
    }

    poststart() {
        import("./poststart/poststart.js");
    }
}