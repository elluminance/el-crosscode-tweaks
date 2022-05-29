sc.modUtils = {
    currencies: {},

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

    /**
     * Handles all parts in registering a new submenu, for example, shops.
     * 
     * @param {string} menuName: the name of the submenu entry, accessible by sc.MENU_SUBMENU.{menuName}
     * @param {sc.BaseMenu} menuClass: the class of the actual menu, such as sc.ShopMenu
     * @param {string} langName: the name lang entry in assets/data/lang/sc/gui.[lang].json > labels > menu > menu-titles
     * @param {string} altName: alternative lang entry, in case that is necessary (vanilla example: save/load uses the same menu, and "load" is used as the alt name.)
     */
    registerMenu(menuName, menuClass, langName, altName = undefined) {
        if (menuName in sc.MENU_SUBMENU) {
            console.warn(`Warning: Submenu with id ${menuName} already taken!`);
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
    },
    
    /**
     * Registers a custom currency for the purposes of use in shops.
     * 
     * @param {string} name the currency's internal name, used in the langLabel and default var path
     * @param {string} imgPath the path to the image file holding the 12x12 currency icon
     * @param {number} srcX the X position of the currency's icon
     * @param {number} srcY the Y position of the currency's icon
     * @param {string} [varPathOverride] an optional parameter to override the default var path of "currency.name"
     */
    registerCurrency(name, imgPath, srcX, srcY, varPathOverride) {
        if(name in this.currencies) {
            console.warn(`Warning: currency with name ${name} already in use`);
            return false;
        }
        let varPath = varPathOverride || `currency.${name}`;
        this.currencies[name] = {
            name,
            varPath,
            image: {
                gfx: new ig.Image(imgPath),
                srcX, srcY
            },

            get() {
                return ig.vars.get(this.varPath) || 0;
            },
            set(value) {
                ig.vars.set(this.varPath, value);
            },
            add(value) {
                ig.vars.add(this.varPath, value);
                sc.stats.addMap("player", `currency-${this.name}`, value);
            },
            sub(value) {
                ig.vars.sub(this.varPath, value);
            }
        }
        return true;
    },
}
