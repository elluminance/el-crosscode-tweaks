//@ts-check

el.MusicRemixSelectorMenu = sc.ListInfoMenu.extend({
    transitions: {
        DEFAULT: {
            state: {},
            time: 0.2,
            timeFunction: KEY_SPLINES.EASE_OUT
        },
        HIDDEN: {
            state: {
                alpha: 0,
                scaleX: 0
            },
            time: 0.2,
            timeFunction: KEY_SPLINES.EASE_IN
        }
    },
    
    init() {
        this.parent(new el.MusicRemixList, null, true);
        
        this.list.hook.pos.x = 17;

        this.doStateTransition("DEFAULT");
        this.onAddHotkeys = () => {};
    },
    showMenu() {
        this.parent();
        this.doStateTransition("DEFAULT");
        this.list.show();
        this.list.doStateTransition("DEFAULT");
        sc.menu.pushBackCallback(() => {    
            sc.menu.popBackCallback();
            sc.menu.popMenu();
        })
    },
    
    hideMenu() {
        this.parent();
        // sc.menu.buttonInteract.removeButtonGroup(this.buttongroup);
        this.doStateTransition("HIDDEN")
        this.list.doStateTransition("HIDDEN");
    },

})

const BUTTON_WIDTH = 174;
let counter = {
    value: 0,
}
const NUM_COLUMNS = 3;

el.MusicRemixList = ig.GuiElementBase.extend({
    sets: {},
    transitions: {
        DEFAULT: {
            state: {},
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR
        },
        HIDDEN: {
            state: {
                alpha: 0,
                offsetX: -184
            },
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR
        }
    },

    init() {
        this.parent();
        this.setSize(368 + 168, 263);
        this.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);

        this.list = new sc.MultiColumnItemListBox(1, 182, sc.LIST_COLUMNS.ONE, 1);
        this.list.setPos(0, -5);
        this.list.setSize(368 + 168, 251 + 14);
        this.addChildGui(this.list);

        this.buttongroup = this.list.buttonGroup();
        this.buttongroup.setMouseFocusLostCallback(() => {
            sc.menu.setInfoText("", true);
            sc.menu.setBuffText("", true);
        });
        this.buttongroup.addSelectionCallback(button => {
            if(button instanceof el.MusicRemixButton) {
                sc.menu.setInfoText(button.data.description);
            }
        })

        this.buttongroup.addPressCallback(this.onButtonPress.bind(this));

        this.list.setSelectState("HIDDEN", true);
        this.list.setQuantityState("HIDDEN", true);

        this.createListEntries();
    },
    show() {
        this.list.doStateTransition("DEFAULT");
        this.list.activate();
    },
    createListEntries() {
        this.buttongroup.clear();
        this.list.clear(true);
        this.sets = {};

        this.list.list.columns = 1;
        let yOffset = 0;
        for(let baseSong of Object.keys(el.musicRemix.remixes)) {
            counter.value = 0;
            let set = new el.MusicRemixSet(baseSong, this.list, yOffset);
            //@ts-ignore
            this.list.addButton(set, true);
            yOffset += Math.ceil(counter.value / NUM_COLUMNS)
            this.sets[baseSong] = set;
        }
        this.list.list.columns = NUM_COLUMNS;
        this.buttongroup.fillEmptySpace();
    },
    
    onButtonPress(button) {
        if(button instanceof el.MusicRemixButton) {
            let songKey = el.musicRemix.getRemix(button.baseSong) === button.songKey ? null : button.songKey
            el.musicRemix.setRemix(button.baseSong, songKey);

            this.sets[button.baseSong].updateToggleStates(button);
        }
    },

})

el.MusicRemixSet = ig.GuiElementBase.extend({
    baseSong: null,
    buttons: [],

    init(baseSong, list, yButtonOffset) {
        this.parent();
        this.baseSong = baseSong;

        this.setSize(363 + 168, 9);
        this.background = new ig.ColorGui("#444444", 168*3, 9);
        this.background.hook.localAlpha = 0.2;
        this.background.setPos(-2, -1);
        
        
        this.header = new sc.TextGui(
            ig.lang.get(`sc.gui.menu.el-music-selector.bgm.${baseSong}`),
            {font: sc.fontsystem.tinyFont}
        );
        this.header.setPos(1, 0);
        
        this.addChildGui(this.header);
        this.line = new ig.ColorGui("#545454", this.hook.size.x + 2, 1);
        this.line.setPos(-1, 9);
        this.addChildGui(this.line);

        let x = 0, y = 0, count = 0;
        let buttongroup = list.buttonGroup();
        for(let track of Object.keys(el.musicRemix.remixes[baseSong])) {
            let button = new el.MusicRemixButton(baseSong, track);
            button.setPos(1 + x*(BUTTON_WIDTH+3), y*20+11);
            this.addChildGui(button);
            this.buttons.push(button);
            buttongroup.addFocusGui(button, x, y + yButtonOffset);

            x++;
            if(x >= NUM_COLUMNS) {
                x = 0;
                y++;
            }
            counter.value++;
            count++;
        }
        this.hook.size.y = Math.ceil(count / NUM_COLUMNS) * 20 + 15;
        //this.background.setSize(this.hook.size.x + 4, this.hook.size.y + 1);
    },

    updateToggleStates(baseButton) {
        if (baseButton) {
            let anim = new sc.ItemMenuToggleAnimation(() => {
                baseButton.updateToggleState();
            }, true);
            baseButton.addChildGui(anim);
        }
        for(let button of this.buttons) {
            if(button === baseButton) continue;
            button.updateToggleState();
        }
    },
})

el.MusicRemixButton = sc.ListBoxButton.extend({
    init(baseSong, songKey) {
        let remix = el.musicRemix.remixes[baseSong][songKey];
        this.songName = ig.LangLabel.getText(remix.name);

        this.parent(
            this.songName,
            BUTTON_WIDTH,
            0,
            undefined,
            ig.LangLabel.getText(remix.desc),
            true
        );
        this.baseSong = baseSong;
        this.songKey = songKey;

        this.updateToggleState();
    },

    updateToggleState() {
        let radioButton = this.songKey == el.musicRemix.selectedRemixes[this.baseSong] ? "\\i[toggle-item-on-radio]" : "\\i[toggle-item-off-radio]";
        this.button.textChild.setText(radioButton + this.songName);
    }
})

sc.SUB_MENU_INFO[sc.MENU_SUBMENU.EL_MUSIC_SELECTOR] = {
    Clazz: el.MusicRemixSelectorMenu,
    name: "el-music-selector"
}
