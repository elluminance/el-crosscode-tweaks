// this would be a TypeScript file but i honestly just *cannot* put up with TS's nonsense sometimes 
function itemTypeToIndex(item: sc.Inventory.Item) {
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

declare namespace ig {
    namespace GuiTextInputField {
        interface InputFieldType {}
    }
    interface GuiTextInputField extends ig.FocusGui {
        
    }
    interface GuiTextInputFieldConstructor extends ImpactClass<GuiTextInputField> {
        new (width: number, height: number, inputField_type?: GuiTextInputField.InputFieldType): ig.GuiTextInputField
    }
    var GuiTextInputField: GuiTextInputFieldConstructor
}

//@ts-expect-error
sc.SORT_TYPE.ITEM_ID = 22135;



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
    submitSound: sc.BUTTON_SOUND.submit, 
    rarityButtons: [],
    itemTypeButtons: [],
    rarityState: Array(7).fill(true),
    itemTypeState: Array(8).fill(true),
    filterGui: null,
    filterButtongroup: null,
    filterRarityText: null,
    filterTypeText: null,
    inputField: null,
    sortType: sc.SORT_TYPE.ITEM_ID,
    sortMenu: null,
    sortButton: null,
    sortOrderCheckbox: null,
    reversedSort: false,
    _bgRev: null,
    groupByType: true,

    init() {
        this.parent(
            ig.lang.get("sc.gui.menu.elItemSpawner.title"),
            null, 
            [ig.lang.get("sc.gui.menu.elItemSpawner.close")],
            this.onDialogCallback.bind(this)
        );

        this.hook.size.y -= 20;
        this.submitSound = sc.BUTTON_SOUND.submit;
        this.msgBox.centerBox.hook.localAlpha = 1;
        this.list = new sc.MultiColumnItemListBox(1, 168, sc.LIST_COLUMNS.TWO, 1);
        this.list.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
        this.list.setSize(340, 210);
        this.list.setPos(0, 32);
        this._bgRev = this.list.buttonGroup();
        this._bgRev.addPressCallback((button: any) => {
            if(button.data && button.data.id >= 0) {
                sc.model.player.addItem(button.data.id, 1, true);
                button.amount.setNumber(sc.model.player.getItemAmount(button.data.id))
            }
        })
        this._bgRev.addSelectionCallback((a: any) => {
            if (a.data) {
                sc.menu.setInfoText(a.data.description ? a.data.description : a.data);
                if (a.data.id) {
                    sc.inventory.isBuffID(a.data.id) ? sc.menu.setBuffText(sc.inventory.getBuffString(a.data.id), false, a.data.id) : sc.menu.setBuffText("", false)
                }
            }
        })
        this.buttonInteract.addParallelGroup(this._bgRev)
        this.content.addChildGui(this.list);
        
        this.filterGui = new ig.GuiElementBase;
        this.filterGui.setPos(10, 30)
        this.filterGui.setSize(134, 300)

        

        const lineWidth = 112;
        let yOffset = 0;
        let line;
        //#region Filtering
        this.filterButtongroup = new sc.ButtonGroup;

        if(ig.GuiTextInputField) {
            this.searchActive = true;
            
            this.searchText = new sc.TextGui(ig.lang.get("sc.gui.menu.elItemSpawner.search"), {
                font: sc.fontsystem.tinyFont
            })
            this.searchText.setPos(0, yOffset);
            this.filterGui.addChildGui(this.searchText)
            yOffset += this.searchText.hook.size.y;

            line = new sc.LineGui(lineWidth);
            line.setPos(0, yOffset)
            this.filterGui.addChildGui(line);
            yOffset += 3;

            this.inputField = new ig.GuiTextInputField(lineWidth, 20);
            this.inputField.onCharacterInput = () => {
                this._createList();
            }
            
            this.inputField.setPos(0, yOffset);
            yOffset += this.inputField.hook.size.y + 6;
            this.filterGui.addChildGui(this.inputField)
            this.filterButtongroup.addFocusGui(this.inputField);
        }
        
        //#region rarity
        this.filterRarityText = new sc.TextGui(ig.lang.get("sc.gui.menu.elItemSpawner.filterRarity"),{
            font: sc.fontsystem.tinyFont
        })
        this.filterRarityText.setPos(0, yOffset)
        yOffset += this.filterRarityText.hook.size.y;
        this.filterGui.addChildGui(this.filterRarityText)
        line = new sc.LineGui(lineWidth);
        line.setPos(0, yOffset)
        this.filterGui.addChildGui(line);
        yOffset += 2;
        let xOffset = 0,
            button;
        for(let i: number = 0; i <= 7; i++) {
            if(i == 7 && !sc.inventory.items.some(({rarity}) => ![0,1,2,3,4,5,6].includes(rarity))) {
                this.rarityState.other = false;
                break;
            };
            this.rarityState.other = true;
            button = new sc.ELItemSpawner.FilterButton.Rarity(i);
            //@ts-ignore
            if(i == 7) i = "other";
            button.setPos(xOffset, yOffset);
            xOffset += button.hook.size.x;
            button.data = {
                desc: ig.lang.get(`sc.gui.menu.elItemSpawner.desc.rarity.${i}`)
            }
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
        //#endregion rarity

        //#region item type
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
            button = new sc.ELItemSpawner.FilterButton.ItemType(i);
            button.setPos(xOffset, yOffset);
            xOffset += button.hook.size.x - 1;
            button.onButtonPress = () => {
                this.toggleItemTypeState(i);
                this._createList()
                this.submitSound.play();
            }
            button.data = {
                desc: ig.lang.get(`sc.gui.menu.elItemSpawner.desc.itemType.${i}`)
            }
            this.itemTypeButtons.push(button);
            this.filterGui.addChildGui(button);
            this.filterButtongroup.addFocusGui(button);
        }
        //#endregion item type
        //#endregion Filtering

        //#region Sorting
        yOffset += 20;
        this.sortMenu = new sc.SortMenu(this.sortCallback.bind(this));
        this.sortMenu.addButton("item-id", sc.SORT_TYPE.ITEM_ID, 0);
        this.sortMenu.addButton("auto", sc.SORT_TYPE.ORDER, 1);
        this.sortMenu.addButton("name", sc.SORT_TYPE.NAME, 2);
        this.sortMenu.addButton("amount", sc.SORT_TYPE.AMOUNT, 3);
        this.sortMenu.addButton("rarity", sc.SORT_TYPE.RARITY, 4);
        
        this.sortMenu.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP)
        this.sortMenu.hook.zIndex = 10e6;

        this.sortButton = new sc.ButtonGui(`${ig.lang.get("sc.gui.menu.item.sort-title")}: \\c[3]${ig.lang.get("sc.gui.menu.sort.item-id")}\\c[0]`, this.sortMenu.hook.size.x)
        this.sortButton.onButtonPress = () => {
            if(!this.sortMenu.active) {
                this.showSortMenu()
            }
            else {
                this.hideSortMenu()
            }
        }
        this.sortButton.keepMouseFocus = true;
        this.sortButton.setPos(0, yOffset)
        this.sortButton.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP)
        this.filterGui.addChildGui(this.sortButton)
        this.filterButtongroup.addFocusGui(this.sortButton);

        this.sortOrderCheckbox = new sc.ELItemSpawner.SortDirectionButton(false, 30);
        this.sortOrderCheckbox.setPos(0, (this.sortButton.hook.size.y - this.sortOrderCheckbox.hook.size.y) / 2 + yOffset);
        this.sortOrderCheckbox.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP)
        this.sortOrderCheckbox.data = {
            desc: ig.lang.get("sc.gui.menu.elItemSpawner.desc.sortOrder")
        }
        this.sortOrderCheckbox.onButtonPress = () => {
            //@ts-expect-error
            this.reversedSort ^= true;
            this._createList();
        }

        yOffset += this.sortButton.hook.size.y + 4;
        //#endregion Sorting


        this.groupByTypeText = new sc.TextGui(ig.lang.get("sc.gui.menu.elItemSpawner.groupByType"));
        this.groupByTypeText.setPos(0, yOffset);
        this.filterGui.addChildGui(this.groupByTypeText);
        
        this.groupByTypeButton = new sc.CheckboxGui(true);
        this.groupByTypeButton.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.groupByTypeButton.setPos(4, yOffset);
        this.groupByTypeButton.data = {
            desc: ig.lang.get("sc.gui.menu.elItemSpawner.desc.groupByType")
        }
        this.groupByTypeButton.onButtonPress = () => {
            //@ts-expect-error
            this.groupByType ^= true;
            this._createList();
        }
        this.filterGui.addChildGui(this.groupByTypeButton);
        this.filterButtongroup.addFocusGui(this.groupByTypeButton);
        
        yOffset += this.groupByTypeButton.hook.size.y + 4;

        this.filterButtongroup.addSelectionCallback((button: any) => {
            if(button.data && button.data.desc) {
                sc.menu.setInfoText(button.data.desc);
                sc.menu.setBuffText("", false)
            }
        })


        this.filterButtongroup.addFocusGui(this.sortOrderCheckbox);
        this.filterGui.addChildGui(this.sortOrderCheckbox);

        this.buttonInteract.addParallelGroup(this.filterButtongroup);
        this.buttonInteract.addParallelGroup(this.sortMenu.buttongroup)
        this.filterGui.addChildGui(this.sortMenu)
        this.content.addChildGui(this.filterGui)
        this.content.setSize(ig.system.width - 64, ig.system.height - 64);
        this.msgBox.setPos(0, -12);
        this.msgBox.resize();
    },

    onDialogCallback() {},
    
    show() {
        //@ts-ignore
        this.parent()
        this.hook.zIndex = 15e4;
        this.doStateTransition("DEFAULT");
        this._createList();
    },
    
    hide() {
        //@ts-ignore
        this.parent()
        this.doStateTransition("HIDDEN");
    },

    showSortMenu() {
        sc.menu.pushBackCallback(this.hideSortMenu.bind(this));
        this.sortMenu.setPos(this.sortButton.hook.pos.x, this.sortButton.hook.pos.y + this.sortButton.hook.size.y);
        this.sortMenu.active = true;
        this.sortMenu.doStateTransition("DEFAULT");
        this.buttonInteract.pushButtonGroup(this.sortMenu.buttongroup)
    },

    hideSortMenu() {
        sc.menu.popBackCallback();
        this.sortMenu.active = false;
        this.sortMenu.doStateTransition("HIDDEN");
        this.buttonInteract.removeButtonGroup(this.sortMenu.buttongroup)
    },
    
    sortCallback(button) {
        let data = (button as any).data as {
            name: string;
            sortType: sc.SORT_TYPE;
        }  
        if(data) {
            this.sortButton.setText(`${ig.lang.get("sc.gui.menu.item.sort-title")}: \\c[3]${data.name}\\c[0]`, true);
            this.sortType = data.sortType;
            this._createList();
            this.hideSortMenu();
        }
    },

    update() {
        this.buttonInteract.isActive() && this.buttongroup.isActive() && (sc.control.menuScrollUp() ? this.list.list.scrollY(-20) : sc.control.menuScrollDown() && this.list.list.scrollY(20))
    },

    _createList() {
        this._bgRev.clear();
        this.list.clear(false);

        let itemList = [];
        for(let i = 0; i < sc.inventory.items.length; i++) {
            let item = sc.inventory.items[i];
            let rarity = ([0,1,2,3,4,5,6].includes(item.rarity)) ? item.rarity as number : 'other' 
            if(!this.rarityState[rarity as any as number]) continue;
            if(!this.itemTypeState[itemTypeToIndex(item)]) continue;
            if(this.searchActive && !ig.LangLabel.getText(item.name).toLowerCase().includes(this.inputField.getValueAsString().toLowerCase())) continue;
            itemList.push(i);
        }
        
        this.sortType != sc.SORT_TYPE.ITEM_ID && sc.model.player.sortItemList(itemList, this.sortType)

        this.reversedSort && itemList.reverse();

        this.groupByType && itemList.sort((a, b) => itemTypeToIndex(sc.inventory.items[a]) - itemTypeToIndex(sc.inventory.items[b]))

        itemList.forEach(value => {
            let item = sc.inventory.getItem(value)!,
                itemName = `\\i[${item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default"}]${ig.LangLabel.getText(item.name)}`,
                itemDesc = ig.LangLabel.getText(item.description),
                itemLevel = item.type == sc.ITEMS_TYPES.EQUIP ? item.level || 1 : 0,
                itemButton = new sc.ItemBoxButton(itemName, 142, 26, sc.model.player.getItemAmountWithEquip(value), value, itemDesc, void 0, void 0, void 0, void 0, itemLevel);
            this.list.addButton(itemButton);
        })
        
    },

    toggleRarityState(rarity) {
        //@ts-expect-error
        this.rarityState[rarity] ^= true;
    },

    toggleItemTypeState(type) {
        //@ts-expect-error
        this.itemTypeState[type] ^= true;
    }
})

sc.ELItemSpawner.FilterButton = ig.FocusGui.extend({
    img: null,
    toggled: true,
    animTimer: 0,
    toggleTimer: 0,
    index: 0,

    animTimeForToggle: 0.07,

    init(index) {
        this.parent();
        this.hook.size.x = this.hook.size.y = 14;
        this.index = index;
    },
    
    focusGained() {
        //@ts-ignore
        this.parent();
        if(this.animTimer <= 0) this.animTimer = 0.035;
    },

    focusLost() {
        //@ts-ignore
        this.parent();
        if(this.animTimer <= 0) this.animTimer = 0.035;
    },

    invokeButtonPress() {
        //@ts-ignore
        this.parent();
        this.toggled = !this.toggled;
        if(this.toggleTimer <= 0) this.toggleTimer = this.animTimeForToggle;
    },

    update() {
        this.animTimer -= ig.system.tick;
        this.toggleTimer -= ig.system.tick;
    },

    canPlayFocusSounds() {
        return false
    },

    updateDrawables(a) {
        if(!this.img) return;

        if(this.animTimer >= 0) {
            a.addGfx(this.img, 0, 0, 42, 14, 14, 14);
        }else if(this.focus) {
            a.addGfx(this.img, 0, 0, 28, 14, 14, 14);
        }

        if(this.toggleTimer >= 0) {
            a.addGfx(this.img, 0, 0, 14, 14, 14, 14);
        }else if(this.toggled) {
            a.addGfx(this.img, 0, 0, 0, 14, 14, 14);
        }
    }
})

sc.ELItemSpawner.FilterButton.Rarity = sc.ELItemSpawner.FilterButton.extend({
    img: new ig.Image("media/gui/el/item-rarity-toggle.png"),

    updateDrawables(a) {
        a.addGfx(this.img, 0, 0, this.index * 14, 0, 14, 14);
        this.parent(a);
    },
})

sc.ELItemSpawner.FilterButton.ItemType = sc.ELItemSpawner.FilterButton.extend({
    img: new ig.Image("media/gui/el/item-type-toggle.png"),
    animTimeForToggle: 0.05,

    updateDrawables(a) {
        // type icon
        a.addGfx(this.img, 0, -13, this.index * 14, 0, 14, 14);
        // checkbox border
        a.addGfx(this.img, 0, 0, 56, 14, 14, 14);

        this.parent(a)
    }
})

sc.ELItemSpawner.SortDirectionButton = sc.CheckboxGui.extend({
    altGfx: new ig.Image("media/gui/el/sort-direction.png"),

    init(initialState, d, c) {
        this.parent(initialState, d, c);
        this.hookGui.setImage(this.altGfx, initialState ? 20 : 0, 0, 20, 20)
    },

    setPressed(a) {
        //@ts-ignore
        this.parent(a);
        this.hookGui.offsetX = a ? 20 : 0;
        this.hookGui.offsetY = 0;
    }
})

sc.ItemMenu.inject({
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
            let gui = new sc.ELItemSpawner;
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
        if (sc.options.get("el-item-spawn-cheat")) sc.menu.addHotkey(() => this.hotkeySpawnItems);
        this.parent(a);
    }
})