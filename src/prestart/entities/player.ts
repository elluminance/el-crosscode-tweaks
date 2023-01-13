sc.PlayerModel.inject({
    setElementMode(element, forceChange, noEffect){
        let value = this.parent(element, forceChange, noEffect);

        // fixes element aura not properly updating
        ig.game.playerEntity?.updateSkinAura();

        return value;
    },

    useItem(a) {
        if(this.items[a] && sc.arena.active){
            sc.arena.itemCache[a] ? (sc.arena.itemCache[a] += 1) : (sc.arena.itemCache[a] = 1)
        }
        return this.parent(a)
    },
})

ig.ENTITY.Player.inject({
    onPerfectDash(){
        if(!this.dashPerfect && !sc.newgame.get("witch-time") && sc.options.get("el-dash-effect")){
            sc.combat.showPerfectDashEffect(this)
            this.dashPerfect = true;
        }
        this.parent()
    },

    handleStateStart(playerState, inputState) {
        if (playerState.startState === 3 && !this.model.getAction(sc.PLAYER_ACTION.ATTACK)) this.attackCounter = 3
        this.parent(playerState, inputState)
    },
    
    onPreDamageModification(a, b, c, d, e, shieldResult) {
        if (shieldResult === sc.SHIELD_RESULT.PERFECT && sc.newgame.get("guard-perfectionist")) {
            this.perfectGuardCooldown = 0;
            for (let index = this.shieldsConnections.length; index--;) this.shieldsConnections[index].resetPerfectGuardTime()
        }
        return this.parent(a, b, c, d, e, shieldResult)
    }
})