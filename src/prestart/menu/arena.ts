function shouldAskAboutAscended(button: sc.ArenaRoundEntryButton) {
    let mods = sc.arena.getCupCoreAttrib(button.key!, "mods");

    return sc.options.get("el-arena-force-scaling")
        && !mods?.includes("WEAPON_ADJUST")
        && Object.values(sc.model.player.equip).find(x => sc.inventory.isScalable(x)) != undefined;
}

sc.ArenaRoundList.inject({
    onListEntryPressed(button) {
        this.parent(button);
        if(shouldAskAboutAscended(button)) {
            let guiBase = ig.gui.guiHooks.last().gui as sc.ModalButtonInteract;
    
            let msgBox = guiBase.content;
    
            let forceScaleOptionGui = new ig.GuiElementBase;
            
            let textGui = new sc.TextGui(ig.lang.get("sc.gui.arena.menu.forceAscendedScale"));
            let checkbox = new sc.CheckboxGui(sc.arena.forceScaling);
    
            textGui.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_CENTER);
    
            forceScaleOptionGui.addChildGui(checkbox);
            forceScaleOptionGui.addChildGui(textGui);
    
            forceScaleOptionGui.setSize(
                textGui.hook.size.x + checkbox.hook.size.x + 4,
                checkbox.hook.size.y
            )
    
            forceScaleOptionGui.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_BOTTOM);
            forceScaleOptionGui.setPos(0, guiBase.buttons[0].hook.size.y + 4)
    
            msgBox.addChildGui(forceScaleOptionGui);
    
            msgBox.hook.size.x = Math.max(msgBox.hook.size.x, forceScaleOptionGui.hook.size.x)
            msgBox.hook.size.y += forceScaleOptionGui.hook.size.y + 8;
    
            let pressCallback = guiBase.buttongroup.pressCallbacks[0];
    
            guiBase.buttongroup.pressCallbacks[0] = function(button) {
                if(button != checkbox) {
                    pressCallback(button);
                } else {
                    sc.arena.forceScaling = button.pressed;
                }
            };


            guiBase.buttongroup.addFocusGui(checkbox, 0, 1);
            guiBase.buttongroup.addFocusGui(checkbox, 1, 1);
            
            guiBase.msgBox.resize();
        }
    }
})
