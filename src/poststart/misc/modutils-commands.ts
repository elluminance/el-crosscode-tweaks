/*
 * command module - intended for mod devs, not the user.
 * these commands are more intended for to simplify things when using the console.
 * they can vary from just "shortcuts", to possibly other things.
 * i discourage using them in code, though i guess nothing's stopping you...
*/
window.cmd = {
    addItem: (id: sc.ItemID, amount: number = 1, hideMsg: boolean) => {
        if(sc.inventory.getItem(id)){
            sc.model.player.addItem(id, amount, hideMsg)
        } else {
            console.warn(`Item ${id} does not exist!`)
        }
    },
    addCredits: (amount: number) => sc.model.player.addCredit(amount),

    teleport(mapName: string, marker?: string, destination?: ig.TeleportPosition.Settings){
        //@ts-ignore
        destination ??= {};
        if(marker) destination!.marker = ""
        ig.game.teleport(mapName, destination as ig.TeleportPosition);
    },
    
    /*
     * will reload all player configs to reflect any changes
     * for example, if you're tweaking an art, you don't need to reload the game
     * every time you make one little change.
     */
    reloadPlayerConfigs(reloadEffects = true) {
        for(let member of Object.values(sc.party.models)) {
            member.config.debugReload = true;
            member.config.reload();
        }

        if(reloadEffects) this.reloadEffectSheets();
    },
    reloadEffectSheets() {
        for(let sheet of Object.values(ig.EffectSheet.cache)) {
            //sometimes has errors so i'll just... ignore them. :)
            try {
                sheet.reload()
            } catch {};
        }
    },
    reloadEnemyType(enemyName: string, reloadEffects: boolean = true) {
        let enemyType = sc.EnemyType.cache[enemyName];
        if(enemyType) {
            enemyType.debugReload = true;
            enemyType.reload();
        }

        if(reloadEffects) this.reloadEffectSheets();
    },

    spawnEnemy(enemyName: string, levelOverride?: number, settings?: sc.EnemyInfo.Settings, pos?: Vec3) {
        //@ts-expect-error
        settings ??= {};
        
        settings!.type = enemyName;

        if(levelOverride != undefined || levelOverride != null)
            settings!.level = levelOverride;
        
        let enemyInfo = new sc.EnemyInfo(settings!);
        
        pos ??= {...ig.game.playerEntity.coll.pos}

        enemyInfo.enemyType.load(() => {
            pos!.x -=  enemyInfo.enemyType.size.x / 2;
            pos!.y -=  enemyInfo.enemyType.size.y / 2;
    
            ig.game.spawnEntity(
                ig.ENTITY.Enemy, 
                pos!.x, pos!.y, pos!.z, 
                {enemyInfo: enemyInfo.getSettings()},
                true
            )
        })
    },

    reloadMap() {
        let teleportPos = new ig.TeleportPosition();
        let {pos, level, baseZPos, size} = ig.game.playerEntity.coll;
        let {face} = ig.game.playerEntity;
        teleportPos.setFromData(null, pos, face, level, baseZPos, size);
        ig.game.teleport(ig.game.mapName, teleportPos)
    },

    reloadAreas() {
        for(let area of Object.values(sc.AreaLoadable.cache)) {
            area.debugReload = true;
            area.reload();
        }
    },

    resetMapVars(includeTmp: boolean = false, reloadMap: boolean = false) {
        ig.vars.storage.map = ig.vars.storage.maps[ig.vars.currentLevelName] = {};
        if(includeTmp) ig.vars.storage.tmp = {};
        ig.game.varsChangedDeferred();
        if(reloadMap) this.reloadMap();
    },

    resetTmpVars() {
        ig.vars.storage.tmp = {};
        ig.game.varsChangedDeferred();
    },

    changePlayerConfig(name: string) {
        if(sc.PARTY_OPTIONS.includes(name)) {
            sc.model.player.setConfig(sc.party.models[name].config)
        }
    }
}