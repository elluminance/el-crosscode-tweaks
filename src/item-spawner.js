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
    rarityState: [true, true, true, true, true, true, true],
    filterGui: null,
    filterButtongroup: null,
    filterText: null,

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
        this.filterGui.setPos(14, 70)
        this.filterText = new sc.TextGui(ig.lang.get("sc.gui.menu.elItemSpawner.filterRarity"),{
            font: sc.fontsystem.tinyFont
        })
        this.filterText.setPos(0, 0)
        this.filterGui.addChildGui(this.filterText)
        let line = new sc.LineGui(98);
        line.setPos(0, 8)
        this.filterGui.addChildGui(line);

        this.filterButtongroup = new sc.ButtonGroup;
        let rarityOffset = 0,
            rarityButton;
        for(let i = 0; i <= 6; i++) {
            rarityButton = new sc.ELItemSpawnerFilterButtonRarity(i);
            rarityButton.setPos(rarityOffset, 10);
            rarityOffset += rarityButton.hook.size.y;
            rarityButton.onButtonPress = () => {
                this.toggleRarityState(i);
                this._createList()
                this.submitSound.play();
            }
            this.rarityButtons.push(rarityButton);
            this.filterGui.addChildGui(rarityButton);
            this.filterButtongroup.addFocusGui(rarityButton);
        }
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

        sc.inventory.items.forEach((item, index) => {
            if(!this.rarityState[item.rarity]) return;
            let itemName = `\\i[${item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default"}]${ig.LangLabel.getText(item.name)}`,
                itemDesc = ig.LangLabel.getText(item.description),
                itemLevel = item.type == sc.ITEMS_TYPES.EQUIP ? item.level || 1 : 0,
                itemButton = new sc.ItemBoxButton(itemName, 142, 26, sc.model.player.getItemAmount(index), index, itemDesc, void 0, void 0, void 0, void 0, itemLevel);
            this.list.addButton(itemButton);
        })
    },

    toggleRarityState(rarity) {
        this.rarityButtons[rarity].toggled = this.rarityState[rarity] = !this.rarityState[rarity];
    }
})

sc.ELItemSpawnerFilterButtonRarity = ig.FocusGui.extend({
    img: new ig.Image("media/gui/el/item-rarity-toggle.png"),
    toggled: true,
    rarity: 0,

    init(rarityIndex) {
        this.parent();
        this.rarity = rarityIndex.limit(0, 6);
        this.hook.size.x = this.hook.size.y = 14;
    },

    updateDrawables(a) {
        a.addGfx(this.img, 0, 0, this.rarity * 14, this.toggled ? 14 : 0, 14, 14)
    },

    canPlayFocusSounds() {
        return false
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