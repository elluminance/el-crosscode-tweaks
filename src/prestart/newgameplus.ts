sc.NEW_GAME_OPTIONS["guard-perfectionist"] = {
    cost: 2000,
    set: "combat-modifier"
}

sc.NEW_GAME_OPTIONS["no-equipment"] = {
    cost: 100,
    set: "combat-modifier"
}

sc.StartMenu.inject({
    showMenu() {
        if(sc.newgame.get("no-equipment")) {
            this.buttons.equipment.setText("???", true);
            this.buttons.equipment.setActive(false);
        } else {
            this.buttons.equipment.setText(ig.lang.get("sc.gui.menu.menu-titles.equipment"), true);
            this.buttons.equipment.setActive(true)
        }
        this.parent()
    }
})

ig.ENTITY.Player.inject({
    onPreDamageModification(a, b, c, d, e, shieldResult) {
        if (shieldResult == sc.SHIELD_RESULT.PERFECT && sc.newgame.get("guard-perfectionist")) {
            this.perfectGuardCooldown = 0;
            for (let index = this.shieldsConnections.length; index--;) this.shieldsConnections[index].resetPerfectGuardTime()
        }
        return this.parent(a, b, c, d, e, shieldResult)
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