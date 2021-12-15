sc.NEW_GAME_OPTIONS["no-equipment"] = {
    cost: 100,
    set: "combat-modifier"
}

sc.StartMenu.inject({
    showMenu() {
        if(sc.newgame.get("no-equipment")) {
            this.buttons.social.setText("???", true);
            this.buttons.equipment.setActive(false);
        } else {
            this.buttons.skills.setText(ig.lang.get("sc.gui.menu.menu-titles.equipment"), true);
            this.buttons.skills.setActive(true)
        }

        this.parent()
    }
})