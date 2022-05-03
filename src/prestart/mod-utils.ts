sc.modUtils = {
    onVarAccess(_a, b) {
        if(b[0] === "mod") {
            switch(b[2]) {
                case "active":
                    return versions.hasOwnProperty(b[1])
                // i'm not sure how helpful this would be on its own, though i have an idea.
                case "version":
                    return versions[b[1]]
                case "name":
                    let mod = activeMods.find(mod => mod.name == b[1]);
                    return mod && (mod.displayName || mod.name)
            }
        }
    },

    /*
     * Handles all parts in registering a new submenu, for example, shops.
     * 
     * menuName: the name of the submenu entry, accessible by sc.MENU_SUBMENU.{menuName}
     * menuClass: the class of the actual menu, such as sc.ShopMenu
     * langName: the name lang entry in assets/data/lang/sc/gui.[lang].json > labels > menu > menu-titles
     * altName: alternative lang entry, in case that is necessary (vanilla example: save/load uses the same menu, and "load" is used as the alt name.)
    */
    registerMenu(menuName, menuClass, langName, altName = undefined) {
        if (menuName in sc.MENU_SUBMENU) {
            ig.warn(`Warning: Submenu with id ${menuName} already taken!`);
            return false;
        }

        let value = Math.max(...Object.values(sc.MENU_SUBMENU as any as Record<string, number>));
        (sc.MENU_SUBMENU as any as Record<string,number>)[menuName] = value + 1;

        let submenu: sc.SubMenuInfo = sc.SUB_MENU_INFO[(value + 1) as any as sc.MENU_SUBMENU] = {
            Clazz: menuClass,
            name: langName
        }

        if(altName) submenu.alt = altName;

        return true;
    }
}
