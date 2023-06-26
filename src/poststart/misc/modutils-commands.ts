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

    teleport: (mapName: string, destination?: ig.TeleportPosition) => ig.game.teleport(mapName, destination),
    
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

    resetMapVars(includeTmp: boolean = false) {
        ig.vars.storage.map = {};
        if(includeTmp) ig.vars.storage.tmp = {};
        ig.game.varsChangedDeferred();
    },

    resetTmpVars() {
        ig.vars.storage.tmp = {};
        ig.game.varsChangedDeferred();
    }
}