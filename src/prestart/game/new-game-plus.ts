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

