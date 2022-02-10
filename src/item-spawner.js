function itemTypeToIndex(item) {
    switch(item.type) {
        case sc.ITEMS_TYPES.CONS:
            return 0;
        case sc.ITEMS_TYPES.EQUIP:
            switch(item.equipType) {
                case sc.ITEMS_EQUIP_TYPES.HEAD:
                    return 1;
                case sc.ITEMS_EQUIP_TYPES.ARM:
                    return 2;
                case sc.ITEMS_EQUIP_TYPES.TORSO:
                    return 3;
                case sc.ITEMS_EQUIP_TYPES.FEET:
                    return 4;
            }
        case sc.ITEMS_TYPES.TRADE:
            return 5;
        case sc.ITEMS_TYPES.KEY:
            return 6;
        case sc.ITEMS_TYPES.TOGGLE:
            return 7;
    }
}

sc.ELItemSpawner = sc.ModalButtonInteract.extend({
    transitions: {
        DEFAULT: {
            state: {
                alpha: 1
            },
            time: 0.2,
            timeFunction: KEY_SPLINES.EASE_OUT
        },
        HIDDEN: {
            state: {
                alpha: 0,
            },
            time: 0.4,
            timeFunction: KEY_SPLINES.EASE_IN
        }
    },
    ninepatch: new ig.NinePatch("media/gui/menu.png", {
        width: 16,
        height: 9,
        left: 4,
        top: 4,
        right: 4,
        bottom: 4,
        offsets: {
            "default": {
                x: 512,
                y: 457
            }
        }
    }),
    list: null,
    itemBox: null,
    submitSound: null,
    _curElement: null,
    submitSound: sc.BUTTON_SOUND.submit, 
    rarityButtons: [],
    itemTypeButtons: [],
    rarityState: [true, true, true, true, true, true, true],
    itemTypeState: [true, true, true, true, true, true, true, true],
    filterGui: null,
    filterButtongroup: null,
    filterRarityText: null,
    filterTypeText: null,

    init() {
        this.parent(
            ig.lang.get("sc.gui.menu.elItemSpawner.title"),
            null, 
            [ig.lang.get("sc.gui.menu.elItemSpawner.close")],
            this.onDialogCallback.bind(this)
        );
        this.submitSound = sc.BUTTON_SOUND.submit;
        this.msgBox.centerBox.hook.localAlpha = 1;
        this.list = new sc.MultiColumnItemListBox(1, 168, sc.LIST_COLUMNS.TWO, 1);
        this.list.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
        this.list.setSize(340, 210);
        this.list.setPos(0, 32);
        this._bgRev = this.list.buttonGroup();
        this._bgRev.addPressCallback((button) => {
            if(button.data?.id >= 0) {
                sc.model.player.addItem(button.data.id, 1, true);
                button.amount.setNumber(sc.model.player.getItemAmount(button.data.id))
            }
        })
        this.buttonInteract.addParallelGroup(this._bgRev)
        this.content.addChildGui(this.list);
        
        this.filterGui = new ig.GuiElementBase;
        this.filterGui.setPos(10, 30)

        const lineWidth = 112;
        let yOffset = 0;

        this.filterRarityText = new sc.TextGui(ig.lang.get("sc.gui.menu.elItemSpawner.filterRarity"),{
            font: sc.fontsystem.tinyFont
        })
        this.filterRarityText.setPos(0, yOffset)
        yOffset += this.filterRarityText.hook.size.y;
        this.filterGui.addChildGui(this.filterRarityText)
        let line = new sc.LineGui(lineWidth);
        line.setPos(0, 8)
        this.filterGui.addChildGui(line);
        yOffset += 2;
        this.filterButtongroup = new sc.ButtonGroup;
        let xOffset = 0,
            button;
        for(let i = 0; i <= 6; i++) {
            button = new sc.ELItemSpawnerFilterButtonRarity(i);
            button.setPos(xOffset, yOffset);
            xOffset += button.hook.size.x;
            button.onButtonPress = () => {
                this.toggleRarityState(i);
                this._createList()
                this.submitSound.play();
            }
            this.rarityButtons.push(button);
            this.filterGui.addChildGui(button);
            this.filterButtongroup.addFocusGui(button);
        }
        yOffset += 20;
        this.filterTypeText = new sc.TextGui(ig.lang.get("sc.gui.menu.elItemSpawner.filterItemType"),{
            font: sc.fontsystem.tinyFont
        })
        this.filterTypeText.setPos(0, yOffset)
        yOffset += this.filterTypeText.hook.size.y;
        this.filterGui.addChildGui(this.filterTypeText)
        line = new sc.LineGui(lineWidth);
        line.setPos(0, yOffset)
        this.filterGui.addChildGui(line);
        yOffset += 2;

        xOffset = 0;
        // accounts for the fact the button is actually 13 pixels "taller" than it appears
        yOffset += 13;
        for(let i = 0; i <= 7; i++) {
            button = new sc.ELItemSpawnerFilterButtonItemType(i);
            button.setPos(xOffset, yOffset);
            xOffset += button.hook.size.x - 1;
            button.onButtonPress = () => {
                this.toggleItemTypeState(i);
                this._createList()
                this.submitSound.play();
            }
            this.itemTypeButtons.push(button);
            this.filterGui.addChildGui(button);
            this.filterButtongroup.addFocusGui(button);
        }
        yOffset += 14;
        this.buttonInteract.addParallelGroup(this.filterButtongroup);
        
        this.content.addChildGui(this.filterGui)
        this.content.setSize(ig.system.width - 64, ig.system.height - 64);
        this.msgBox.setPos(0, -12);
        this.msgBox.resize();
    },

    onDialogCallback() {},
    
    show() {
        this.parent()
        this.hook.zIndex = 15e4;
        this.doStateTransition("DEFAULT");
        this._createList();
    },
    
    hide() {
        this.parent()
        this.doStateTransition("HIDDEN");
    },

    update() {
        this.buttonInteract.isActive() && this.buttongroup.isActive() && (sc.control.menuScrollUp() ? this.list.list.scrollY(-20) : sc.control.menuScrollDown() && this.list.list.scrollY(20))
    },

    _createList() {
        this._bgRev.clear();
        this.list.clear(false);

        let itemList = [];
        sc.inventory.items.forEach((item, index) => {
            if(!this.rarityState[item.rarity]) return;
            if(!this.itemTypeState[itemTypeToIndex(item)]) return;
            let itemName = `\\i[${item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default"}]${ig.LangLabel.getText(item.name)}`,
                itemDesc = ig.LangLabel.getText(item.description),
                itemLevel = item.type == sc.ITEMS_TYPES.EQUIP ? item.level || 1 : 0,
                itemButton = new sc.ItemBoxButton(itemName, 142, 26, sc.model.player.getItemAmount(index), index, itemDesc, void 0, void 0, void 0, void 0, itemLevel);
            this.list.addButton(itemButton);
        })
    },

    toggleRarityState(rarity) {
        this.rarityButtons[rarity].toggled = this.rarityState[rarity] = !this.rarityState[rarity];
    },

    toggleItemTypeState(type) {
        this.itemTypeButtons[type].toggled = this.itemTypeState[type] = !this.itemTypeState[type];
    }
})

sc.ELItemSpawnerFilterButton = ig.FocusGui.extend({
    toggled: true,
    init() {
        this.parent();
        this.hook.size.x = this.hook.size.y = 14;
    },

    canPlayFocusSounds() {
        return false
    }
})

sc.ELItemSpawnerFilterButtonRarity = sc.ELItemSpawnerFilterButton.extend({
    img: new ig.Image("media/gui/el/item-rarity-toggle.png"),
    rarity: 0,

    init(rarityIndex) {
        this.parent();
        this.rarity = rarityIndex.limit(0, 6);
    },

    updateDrawables(a) {
        a.addGfx(this.img, 0, 0, this.rarity * 14, this.toggled ? 14 : 0, 14, 14)
    },
})

sc.ELItemSpawnerFilterButtonItemType = sc.ELItemSpawnerFilterButton.extend({
    img: new ig.Image("media/gui/el/item-type-toggle.png"),
    index: 0,

    init(itemType) {
        this.parent();
        this.index = itemType;
    },

    updateDrawables(a) {
        a.addGfx(this.img, 0, -13, this.index * 14, 0, 14, 14)
        a.addGfx(this.img, 0, 0, this.toggled ? 14 : 0, 14, 14, 14)
    }
})

sc.ItemMenu.inject({
    itemSpawnMenu: null,
    hotkeySpawnItems: null,
    init() {
        this.parent();

        this.hotkeySpawnItems = new sc.ButtonGui(ig.lang.get("sc.gui.menu.elItemSpawner.inventoryButton"), void 0, true, sc.BUTTON_TYPE.SMALL);
        this.hotkeySpawnItems.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.EASE
            },
            HIDDEN: {
                state: {
                    offsetY: -this.hotkeySpawnItems.hook.size.y
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };
        this.hotkeySpawnItems.onButtonPress = () => {
            let gui = new sc.ELItemSpawner();
            gui.hook.zIndex = 15e4;
            gui.hook.pauseGui = true;
            gui.show();
            ig.gui.addGuiElement(gui);
        }
    },
    showMenu() {
        sc.menu.buttonInteract.addGlobalButton(this.hotkeySpawnItems, () => false);
        this.parent();
    },
    exitMenu() {
        sc.menu.buttonInteract.removeGlobalButton(this.hotkeySpawnItems);
        this.parent();
    },
    commitHotKeysToTopBar(a) {
        sc.menu.addHotkey(() => this.hotkeySpawnItems);
        this.parent(a);
    }
})