
sc.TradeMenu.inject({
    init(trade) {
        this.parent(trade);

        this.favButton = new sc.ButtonGui("\\i[help3]" + ig.lang.get("sc.gui.menu.quests.fav"), undefined, true, sc.BUTTON_TYPE.SMALL);
        this.favButton.setPos(this.money.hook.pos.x + this.money.hook.size.x + 4, 0);
        this.favButton.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.favButton.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.EASE
            },
            HIDDEN: {
                state: {
                    offsetY: -sc.BUTTON_TYPE.SMALL.height
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };
        this.favButton.doStateTransition("HIDDEN", true);
        this.addChildGui(this.favButton);

        this.favButton.onButtonPress = this.onFavButtonPressed.bind(this);
    },


    enterTrade() {
        this.parent();
        this.favButton.doStateTransition("DEFAULT");

        sc.trade.buttonInteract.addGlobalButton(this.favButton, this._onFavButtonCheck.bind(this));
    },

    _onHelpButtonPressed() {
        this.parent();
        this.favButton.doStateTransition("HIDDEN");
    },
    
    _exitMenu() {
        this.parent();
        this.favButton.doStateTransition("HIDDEN");
        sc.menu.buttonInteract.removeGlobalButton(this.favButton);
    },

    _createHelpGui() {
        this.parent();
        let origCallback = this.helpGui.backCallback!;
        this.helpGui.backCallback = () => {
            origCallback();
            this.favButton.doStateTransition("DEFAULT", false, false, null, 0.2);
        }
    },

    _onFavButtonCheck() {
        return sc.control.menuHotkeyHelp3()
    },
    
    onFavButtonPressed() {
        sc.trade.toggleFavoriteTrader(sc.trade.traderKey, sc.trade.tradeIndex)
    },

})

sc.TraderMenu.inject({
    init() {
        this.parent();
        this.favButton = new sc.ButtonGui("\\i[help2]" + ig.lang.get("sc.gui.menu.quests.fav"), undefined, true, sc.BUTTON_TYPE.SMALL);
        this.favButton.onButtonPress = this.onFavButtonPressed.bind(this);
        this.favButton.keepMouseFocus = true;
        this.favButton.submitSound = undefined;
        this.favButton.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.EASE
            },
            HIDDEN: {
                state: {
                    offsetY: -this.favButton.hook.size.y
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };
    },
    
    onAddHotkeys(b) {
        sc.menu.buttonInteract.addGlobalButton(this.favButton, this._onFavButtonCheck.bind(this));
        this.parent(b);
    },

    
    exitMenu() {
        sc.menu.buttonInteract.removeGlobalButton(this.favButton);
        this.parent();
    },
    
    commitHotKeysToTopBar(b) {
        sc.menu.addHotkey(() => this.favButton);
        this.parent(b);
    },

    _onFavButtonCheck() {
        return sc.control.menuHotkeyHelp2();
    },

    enterDetails() {
        this.parent();
        this.currentFocusedTrader = {...sc.menu.synopInfo as sc.TraderMenu.SynopInfo};
        this.currentFocusedTrader.button = this.list.lastFocusedListEntry;
    },
    
    setTradeInfo() {
        this.parent();
        this.currentFocusedTrader = {...sc.menu.synopInfo as sc.TraderMenu.SynopInfo};
        this.currentFocusedTrader.button = this.list.lastFocusedListEntry;
    },

    onFavButtonPressed() {
        let tradeFocus: sc.TraderMenu.SynopInfo;
        
        if(sc.menu.tradeToggle) {
            tradeFocus = this.currentFocusedTrader;
        } else {
            tradeFocus = sc.menu.synopInfo as sc.TraderMenu.SynopInfo;
        }

        if(tradeFocus && tradeFocus.offer !== undefined && tradeFocus.trader) {
            let favResult = sc.trade.toggleFavoriteTrader(tradeFocus.trader, tradeFocus.offer);
            if(tradeFocus.button) {
                tradeFocus.button.favDisplay.isFavorite = favResult;
            }
            sc.BUTTON_SOUND.submit.play();
        } else {
            sc.BUTTON_SOUND.denied.play();
        }
    }
})

sc.TradersListBox.inject({
    onListEntrySelected(button) {
        if(button instanceof sc.TradeEntryButton) {
            this.lastFocusedListEntry = button;
        } else {
            this.lastFocusedListEntry = null;
        }
        this.parent(button);
        //@ts-ignore
        if(sc.menu.synopInfo) sc.menu.synopInfo.button = button;
    },
})

sc.TradeDialogMenu.inject({
    _createContent(...args) {
        this.parent(...args);        
        this.getItems.updateFavorites(sc.trade.isActiveTraderFavorite());
    },

    modelChanged(model, message, data) {
        this.parent(model, message, data);
        if(model === sc.trade) {
            switch(message) {
                case sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_ADDED:
                case sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_REMOVED:
                    this.getItems.updateFavorites(sc.trade.isActiveTraderFavorite());
                    break;
                case sc.TRADE_MODEL_EVENT.OFFER_CHANGED:
                    this.getItems.updateFavorites(sc.trade.isActiveTraderFavorite());
                    break;
            }
        }
    },
})



sc.TradeItemBox.inject({
    isFavorite: false,
    favGfx: new ig.Image("media/gui/el/el-tweaks-gui.png"),
    favImg: null,
    
    setContent(items, buttongroup, startIndex, isTrade) {
        let val = this.parent(items, buttongroup, startIndex, isTrade);
        if(!this.favDisplay) {
            this.favDisplay = new el.TradeFavDisplay;
        }
        this.addChildGui(this.favDisplay);
        return val;
    },

    updateFavorites(isFavorite) {
        this.favDisplay.isFavorite = isFavorite;
    }
})

el.TradeFavDisplay = ig.GuiElementBase.extend({
    isFavorite: false,
    gfx: new ig.Image("media/gui/el/el-tweaks-gui.png"),

    updateDrawables(renderer) {
        if(this.isFavorite) {
            renderer.addGfx(this.gfx, 0, 1, 112, 32, 96, 24);
        }
    },
})

sc.TradeEntryButton.inject({
    init(text, trader, offer, id, desciption, amount, required, level) {
        this.parent(text, trader, offer, id, desciption, amount, required, level);
        this.favDisplay = new el.TradeFavDisplay;
        this.favDisplay.setPos(-1,-2);
        this.addChildGui(this.favDisplay);
        if(sc.trade.isTraderFavorite(trader, offer)) {
            this.favDisplay.isFavorite = true;
        }
    },
})
let favStarGfx = new ig.Image("media/gui/el/el-tweaks-gui.png")
sc.TradeIconGui.inject({
    init(trader) {
        this._trader = trader;
        this.parent(trader);
    },
    _createContent() {
        this.parent();

        let trader = this._trader;
        let i = 0;
        for(const entry of this.entries) {
            entry.index = i;
            let callback = entry.gui.textBlock.drawCallback;
            entry.gui.setDrawCallback(function(this: typeof entry.gui, width: number, height: number) {
                if(sc.trade.isTraderFavorite(trader, entry.index)) {
                    favStarGfx.draw(0, 1, 112, 56, 14, 14);
                }
                callback?.(width, height);
            }.bind(entry.gui));
            i++;
        }
    },
})
