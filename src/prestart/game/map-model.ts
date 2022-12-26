sc.MapModel.inject({
    /*
     * hello fellow modders! looking to add custom chests of your own to track?
     * look no further than here! :)
     * to have your new chests be tracked, it depends on if your new chests are in
     * pre-existing (i.e. base game) areas, or if they're in new area 
     * 
     * if they're in a new, custom area, you don't have to do anything special! 
     * just mark your areas as tracked, and it will just work on its own! :)
     * 
     * if they're in a pre-existing area - a few important notes to make!
     *  - do *NOT* touch the area's file to add yours to the chest count.
     *  - the chest you place into a map should be marked as noTrack.
     *
     * to have the chest be tracked, it's quite simple.
     * it's literally as simple as:
     * 
     * sc.map.registerChests("area-name", "maps.areaName/mapName.chest_{number}", "maps.areaName/mapName.chest_{number}", ...)
     * (feel free to have as many chest variables as you want! no, they do not have to be in an array!)
     * 
     * for example:
     * sc.map.registerChests("rhombus-sqr", "maps.rhombusSqr/centerS.chest_888", "maps.rhombusSqr/centerNe.chest_5")
     */
    extraChests: {},

    // returns how many modded chests have been collected
    getExtraFoundChests(area) {
        if(!this.extraChests[area]) return 0;
        let count = 0;

        for(let key of this.extraChests[area]) count += ig.vars.get(key) ? 1 : 0;

        return count;
    },
    
    // returns the total modded chests for an area
    getExtraAreaChests(area) {
        return this.extraChests[area]?.length ?? 0
    },

    // returns the total amount of modded chests that have been found
    getTotalExtraFoundChests() {
        let count = 0;
        for(let area of Object.keys(this.extraChests)) count += this.getExtraFoundChests(area);

        return count;
    },

    // returns the total number of modded chests overall
    getTotalExtraChests(){
        let count = 0;
        for(let areaChests of Object.values(this.extraChests)) count += areaChests.length;
        return count;
    },

    registerChests(areaName, ...chestVar) {
        if(!this.extraChests[areaName]) this.extraChests[areaName] = [];

        this.extraChests[areaName].push(...chestVar);
    },

    getTotalChestsFound(asPercent) {
        let count = this.parent(false),
            total = this.getTotalChests();
        
        // add in all extra chests.
        count += this.getTotalExtraFoundChests()
        
        return asPercent ? (count / total) : count
    },

    getTotalChests() {
        return this.parent() + this.getTotalExtraChests()
    }
})

sc.MapWorldMap.inject({
    _setAreaName(a) {
        this.parent(a)
        let area = a.area,
            chestCount = sc.stats.getMap("chests", a.key) ?? 0,
            totalChests = sc.map.getChestCount(a.key) ?? 0,
            chestString = ""

        totalChests += sc.map.getExtraAreaChests(a.key)

        if (totalChests != 0) {
            chestString = chestCount >= totalChests ? ` \\c[3][${chestCount}/${totalChests}]\\c[0]` : ` [${chestCount}/${totalChests}]`
        }
        this.areaName.setText(ig.LangLabel.getText(area.name) + chestString);
    }
})

sc.STATS_BUILD[sc.STATS_CATEGORY.EXPLORATION].chestAres.getSettings = area => {
    return !sc.map.getVisitedArea(area) || !sc.map.areas[area].track || !sc.map.areas[area].chests ? null : {
        highlight: true,
        displayName: sc.map.getAreaName(area, false, true),
        map: "chests",
        stat: area,
        max: () => (sc.map.areas[area].chests + sc.map.getExtraAreaChests(area))
    }
}

sc.MapChestDisplay.inject({
    update() {
        this.parent()
        this.max.setNumber(this._oldMax + sc.map.getExtraAreaChests(sc.map.currentArea.path))
        this.current.setNumber(this._oldCount)
    }
})

