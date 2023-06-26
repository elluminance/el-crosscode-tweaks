sc.CUSTOM_TROPHY_SHEETS = {};

sc.TrophyIconGraphic.inject({
    init(icon, stars, points, trophyUnlocked){
        this.parent(icon, stars, points, trophyUnlocked);
        if(trophyUnlocked && sc.TROPHY_ICONS[icon].index === -1){
            let sheet: ig.Image;
            if(!(sc.TROPHY_ICONS[icon].sheet && (sheet = sc.CUSTOM_TROPHY_SHEETS[sc.TROPHY_ICONS[icon].sheet!]))) return
            if(sc.TROPHY_ICONS[icon].customIndex === undefined || sc.TROPHY_ICONS[icon].customIndex === null) return;
            let customIndex = sc.TROPHY_ICONS[icon].customIndex!;
            this.removeChildGui(this.icon);
            const imgSize = Math.floor(sheet.width / 42);

            this.icon = new ig.ImageGui(sheet, customIndex! % imgSize * 42, ~~(customIndex / imgSize) * 42, 42, 42);
            this.addChildGui(this.icon);
            this.removeChildGui(this.ribbon);
            this.addChildGui(this.ribbon);
        }
    }
});