import type { Mod, PluginClass } from "../node_modules/ultimate-crosscode-typedefs/modloader/mod";

const verRegex = /^v?(\d)\.(\d)\.(\d)(?:-(\d))?$/

export default class implements PluginClass {
    constructor(public mod: Mod) {};

    preload() {
        //@ts-ignore
        window.el ??= {};
    }

    prestart() {
        //@ts-expect-error
        sc.OPTION_TYPES.OPEN_MENU = Math.max(...Object.values(sc.OPTION_TYPES)) + 1;
        //@ts-expect-error
        sc.MENU_SUBMENU.EL_MUSIC_SELECTOR = Math.max(...Object.values(sc.MENU_SUBMENU as unknown as Record<string, number>)) + 1;


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