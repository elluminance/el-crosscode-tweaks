// assist for perfect guard
sc.CombatantShieldConnection.inject({
    init(a, b, e){
        this.parent(a, b, e);

        this.perfectGuardTime *= sc.options.get("assist-timing-window")
        if(sc.newgame.get("guard-perfectionist")) {
            this.perfectGuardTime *= 3
        }
    }
})

sc.COMBAT_SHIELDS.PLAYER.inject({
    isActive(playerEntity, hitForce, attackInfo, f, isPerfect){
        if(sc.newgame.get("guard-perfectionist") && !(isPerfect || this.noShieldDamage)) {
            playerEntity.guard.damage = 2;
        }
        return this.parent(playerEntity, hitForce, attackInfo, f, isPerfect)
    }
})