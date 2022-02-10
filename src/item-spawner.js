console.log("peepee poopoo")

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
                console.log("Hi!")
                sc.model.player.addItem(button.data.id, 1, true);
                button.amount.setNumber(sc.model.player.getItemAmount(button.data.id))
            }
        })
        this.buttonInteract.addParallelGroup(this._bgRev)
        this.content.addChildGui(this.list);
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
        sc.inventory.items.forEach((item, index) => {
            let itemName = `\\i[${item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default"}]${ig.LangLabel.getText(item.name)}`,
                itemDesc = ig.LangLabel.getText(item.description),
                itemLevel = item.type == sc.ITEMS_TYPES.EQUIP ? item.level || 1 : 0,
                itemButton = new sc.ItemBoxButton(itemName, 142, 26, sc.model.player.getItemAmount(index), index, itemDesc, void 0, void 0, void 0, void 0, itemLevel);
            this.list.addButton(itemButton);
        })
    },
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