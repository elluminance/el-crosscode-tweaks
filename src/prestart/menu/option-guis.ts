//@ts-ignore
sc.OPTION_GUIS[sc.OPTION_TYPES.OPEN_MENU] = 
ig.GuiElementBase.extend<sc.OPTION_GUIS_DEFS.OPEN_MENU_CONSTRUCTOR>({
    init(base, size, rowGroup) {
        this.parent();
        this.base = base;
        this.option = base.option as unknown as sc.OptionDefinition.OPEN_MENU;

        this.button = new sc.ButtonGui(
            ig.lang.get("sc.gui.menu.options-open-menu-button"), size
        );
        this.button.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_CENTER);
        this.button.data = {
            row: base.row,
            description: base.optionDes
        }
        this.addChildGui(this.button);
        rowGroup.addFocusGui(this.button, 0, base.row);
    },
    onPressed: function(button) {
        if(button == this.button) {
            sc.menu.pushMenu(this.option.menu);
        }
    },
});