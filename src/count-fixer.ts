sc.Arena.inject({
    trackedCups: [
        "rookie-cup",
        "seeker-cup",
        "boss-cup",
        "faction-cup-1",
        "faction-cup-2",
        "rookie-team-cup",
        "faction-team-cup-1",
    ],
    
    getTotalArenaCompletion(){
        var a: number, b: number;
        a = b = 0;
        this.trackedCups.forEach(cupName => {a += this.getCupCompletion(cupName); b++;})
        return a / b;
    },

    getTotalDefaultTrophies: function(a, c) {
        var d = 0, e = 0;
        this.trackedCups.forEach((f: string) => {
            var g = this.getCupTrophy(f);
            if (this.isCupUnlocked(f))
                if (a == 0) {
                    d += g;
                    e += 5
                } else {
                    g >= a && d++;
                    e++
                }
        })
        return c ? e : d
    },

    getTotalDefaultCups(sorted){
        let cups: {[key: string]: {order: number}} = {};
        this.trackedCups.forEach(key => {
            /* 
             * if the cup is not loaded, skip it.
             * prevents bug where it would show stats for
             * cups like "~ancient-cup" in red.
            */
            if(this.cups[key].name) {
                let order = sc.arena.cups[key].order || 1e7;
                if(this.isCupCustom(key)) order += 1e7;
                cups[key] = {order}
            }
        })
        if(sorted){
            let sortedCups: {[key: string]: {order: number}} = {}
            Object.keys(cups)
            .sort((a, b) => (cups[a].order - cups[b].order))
            .forEach(key => {
                if(this.isCupUnlocked(key) && cups[key]) sortedCups[key] = cups[key];
            })
            
            return sortedCups;
        }
        return cups
    }
})

sc.MapModel.inject({
    /* hello fellow modders! looking to add custom chests of your own to track?
     * look no further than here! :)
     * to have your new chests be tracked, it depends on if your new chests are in
     * pre-existing (i.e. base game) areas, or if they're in new area 
     */
    extraChests: {},

    // returns how many modded chests have been collected
    getExtraFoundChests(area) {
        if(!this.extraChests[area]) return 0;
        let count = 0;

        this.extraChests[area].forEach(key => void(count += ig.vars.get(key) ? 1 : 0))

        return count;
    },
    
    // returns the total modded chests for an area
    getExtraAreaChests(area) {
        return this.extraChests[area]?.length ?? 0
    },

    // returns the total amount of modded chests that have been found
    getTotalExtraFoundChests() {
        let count = 0;
        Object.keys(this.extraChests).forEach(area => {count += this.getExtraFoundChests(area)})
        return count;
    },

    // returns the total number of modded chests overall
    getTotalExtraChests(){
        let count = 0;
        Object.values(this.extraChests).forEach(areaChests => void(count += areaChests.length))
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