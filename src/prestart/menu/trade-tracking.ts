function getTradeCost(trade: sc.TradeModel.TradeOption) {
    if(trade.cost !== undefined) {
        return trade.cost;
    } else {
        let cost = 0;
        for(let item of trade.get) {
            cost += (sc.inventory.getItem(item.id)!.cost || 0) * (item.amount || 1); 
        }
        return cost * (trade.scale ?? 1);
    }
}

//#region GUI
el.TradeTrackerGui = sc.RightHudBoxGui.extend({
    init() {
        this.parent(ig.lang.get("sc.gui.trade-tracker.title"));
        sc.Model.addObserver(sc.model, this);
    },

    _isVisible: function() {
        return !sc.model.isCutscene() && !sc.model.isHUDBlocked() && !sc.model.isForceCombat()
    },

    setTrade(trade, option) {
        this.clearContent();

        let trader = sc.trade.traders[trade || ""];
        if(trade && trader) {
            this.hasTrade = true;
            let gui = new ig.GuiElementBase;
            //let foundTrader = sc.trade.getFoundTrader(trade);
            //let name = sc.trade.getTraderName(trade);
            //let area = sc.map.getAreaName(trader.area);
            
            let y = 0;
            let textGui = new sc.TextGui("", {
                font: sc.fontsystem.smallFont
            })
            
            gui.addChildGui(textGui);
            let tradeOption = trader.options[option!];
            y += textGui.hook.size.y + 2;
            textGui.setPos(6, 0);
            let itemID = tradeOption.get[0].id;
            textGui.setText(`\\i[trade-icon-small]${sc.inventory.getItemNameWithIcon(itemID)}` + (tradeOption.get[0].amount != 1 ? `\\i[times]${tradeOption.get[0].amount}` : ""));
            //textGui.setText()

            for(let item of tradeOption.require) {
                let entry = new el.TradeTrackerGui.ItemEntry(item.id, item.amount);
                entry.setPos(4, y);
                y += entry.hook.size.y + 1;
                gui.addChildGui(entry);
            }
            let entry = new el.TradeTrackerGui.CreditEntry(getTradeCost(tradeOption));
            entry.setPos(4, y);
            y += entry.hook.size.y + 1;
            gui.addChildGui(entry);
            //gui.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);
            gui.setSize(162, y);
            this.pushContent(gui, true);
            gui.hook.pos.x = 0;
            this.contentEntries[0].setSize(gui.hook.size.x, gui.hook.size.y+8)
            if(this._isVisible()) this.show();
            else this.hide(true);
        } else {
            this.hasTrade = false;
            this.hide();
        }
    },
    
    modelChanged(model, message, data) {
        if (model === sc.model) {
            if ((message == sc.GAME_MODEL_MSG.SUB_STATE_CHANGED
                || message == sc.GAME_MODEL_MSG.STATE_CHANGED)
                && !sc.model.isTeleport() && !sc.model.isLoading())
            {
                if(sc.model.isReset()) {
                    this.setTrade(null);
                    this.hide();
                } else {
                    if(!this._isVisible() || sc.model.isMenu()) {
                        this.hide();
                    } else if (this.hasTrade) {
                        this.show(false, 0.2);
                    }
                }
            }
        }
    },
})

el.TradeTrackerGui.ItemEntry = ig.BoxGui.extend({
    gfx: new ig.Image("media/gui/basic.png"),
    ninepatch: new ig.NinePatch("media/gui/el/el-tweaks-gui.png", {
        width: 8,
        height: 0,
        left: 4,
        top: 12,
        right: 4,
        bottom: 0,
        offsets: {
            "default": {
                x: 144,
                y: 56
            }
        }
    }),

    init(itemID, needed) {
        this.parent(154, 12);

        this.item = itemID;
        this.name = sc.inventory.getItemNameWithIcon(itemID);
        this.needed = needed;

        this.nameGui = new sc.TextGui("", {
            font: sc.fontsystem.smallFont
        });
        this.nameGui.setPos(6, -1);
        this.addChildGui(this.nameGui);
        
        this.numberGui = new sc.NumberGui(99, {
            size: sc.NUMBER_SIZE.SMALL
        });
        this.numberGui.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.numberGui.setPos(22, 2);
        this.addChildGui(this.numberGui);
        this.maxNumberGui = new sc.NumberGui(99, {
            size: sc.NUMBER_SIZE.SMALL
        });
        this.maxNumberGui.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.maxNumberGui.setPos(4, 2);
        this.maxNumberGui.setNumber(needed);
        this.addChildGui(this.maxNumberGui)

        sc.Model.addObserver(sc.model.player, this);

        this.updateCount();
    },

    updateCount() {
        let count = sc.model.player.getItemAmountWithEquip(this.item);
        let done = count >= this.needed;
        let name = done ? "\\i[quest-mini-ok]" : "\\i[quest-mini-no]";
        name += this.name;
        this.nameGui.setText(name);
        
        this.numberGui.setNumber(count);
    },


    updateDrawables(renderer) {
        this.parent(renderer);
        renderer.addGfx(this.gfx, this.hook.size.x - 21, 2, 73, 56, 4, 8)
    },

    modelChanged(model, message, data) {
        if(model === sc.model.player) {
            switch(message) {
                case sc.PLAYER_MSG.ITEM_OBTAINED:
                case sc.PLAYER_MSG.ITEM_REMOVED:
                    this.updateCount()
                    break;
            }
        }
    },
})

el.TradeTrackerGui.CreditEntry = ig.BoxGui.extend({
    gfx: new ig.Image("media/gui/basic.png"),
    ninepatch: new ig.NinePatch("media/gui/el/el-tweaks-gui.png", {
        width: 8,
        height: 0,
        left: 4,
        top: 12,
        right: 4,
        bottom: 0,
        offsets: {
            "default": {
                x: 144,
                y: 56
            }
        }
    }),

    init(cost) {
        this.parent(154, 12);

        this.needed = cost;
        this.nameGui = new sc.TextGui("", {
            font: sc.fontsystem.smallFont
        });
        this.nameGui.setPos(6, -1);
        this.addChildGui(this.nameGui);

        this.maxNumberGui = new sc.NumberGui(cost, {
            size: sc.NUMBER_SIZE.SMALL
        });
        this.maxNumberGui.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.maxNumberGui.setPos(4, 2);
        this.maxNumberGui.setNumber(cost);
        this.maxOffset = this.maxNumberGui.hook.size.x + 4;
        
        this.numberGui = new sc.NumberGui(9999999, {
            size: sc.NUMBER_SIZE.SMALL
        });
        this.numberGui.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.numberGui.setPos(8 + this.maxOffset, 2);
        this.addChildGui(this.numberGui);
        this.addChildGui(this.maxNumberGui)

        sc.Model.addObserver(sc.model.player, this);

        this.updateCount();
    },

    updateCount() {
        let count = sc.model.player.credit;
        let done = count >= this.needed;
        let name = done ? "\\i[quest-mini-ok]" : "\\i[quest-mini-no]";
        name += `\\i[credit]${ig.lang.get("sc.gui.trade-tracker.credits")}`;
        this.nameGui.setText(name);
        
        this.numberGui.setNumber(count);
    },

    updateDrawables(renderer) {
        this.parent(renderer);
        renderer.addGfx(this.gfx, this.hook.size.x - 5 - this.maxOffset, 2, 73, 56, 4, 8)
    },

    modelChanged(model, message, data) {
        if(model === sc.model.player) {
            switch(message) {
                case sc.PLAYER_MSG.CREDIT_CHANGE:
                    this.updateCount()
                    break;
            }
        }
    },
})
//#endregion

sc.CrossCode.inject({
    init() {
        this.parent();
        sc.gui.tradeTrackerGui = new el.TradeTrackerGui;
        sc.gui.rightHudPanel.addHudBoxBefore(sc.gui.tradeTrackerGui, sc.gui.moneyHud);
    },
})

sc.TradeInfo.inject({
    startTradeMenu() {
        sc.trade.traderKey = this.key;
        this.parent();
    },
})

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
    },

    _onFavButtonCheck() {
        return sc.control.menuHotkeyHelp3()
    },
    
    onFavButtonPressed() {
        // console.log(`setting fav trade to ${sc.trade.traderKey}/${sc.trade.tradeIndex}`)

        sc.trade.toggleFavoriteTrader(sc.trade.traderKey, sc.trade.tradeIndex)
        //sc.gui.tradeTrackerGui.setTrade(sc.trade.traderKey, sc.trade.tradeIndex)
    },
})

//TODO: look into sc.trade.resetTrader() maybe?
//also sc.trade.unlockParents() - handle upgraded trades seamlessly.

sc.TradeModel.inject({
    traderKey: "",
    favoriteTraders: {},
    favoriteTraderKeys: [],
    favoriteTraderIndex: -1,
    favoriteTraderOptionIndex: -1,

    toggleFavoriteTrader(key, option) {
        if(this.isTraderFavorite(key, option)) {
            this.favoriteTraders[key].erase(option);
            if(this.favoriteTraders[key].length == 0) {
                delete this.favoriteTraders[key];
                this.favoriteTraderKeys.erase(key);
            }
            sc.Model.notifyObserver(this, sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_ADDED);
            return false;
        } else {
            if(!(key in this.favoriteTraders)) {
                this.favoriteTraders[key] = [];
                this.favoriteTraderKeys.push(key);
            }
            this.favoriteTraders[key].push(option);
            this.favoriteTraders[key].sort((a,b) => a-b);
            sc.Model.notifyObserver(this, sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_REMOVED);
            return true;
        }
    },


    //TODO: Handle trades being added/removed while being tracked.
    cycleFavTrader(count) {
        if(this.favoriteTraderKeys.length == 0) return false;

        let traderIndex = this.favoriteTraderIndex;
        let optionIndex = this.favoriteTraderOptionIndex;
        let favTraders = this.favoriteTraders;
        let favKeys = this.favoriteTraderKeys;

        let showingTrade = false;
        if(traderIndex == -1) {
            showingTrade = true;

            if(count >= 0) {
                traderIndex = 0;
                optionIndex = 0;
            } else if(count < 0) {
                traderIndex = favKeys.length - 1;
                optionIndex = favTraders[favKeys[traderIndex]].length - 1;
            }
        } else {
            optionIndex += count;
            let key = favKeys[traderIndex];
            if(favTraders[key].length <= optionIndex) {
                traderIndex++;
                optionIndex = 0;
            } else if (optionIndex < 0) {
                traderIndex--;
                optionIndex = favTraders[key]?.length - 1;
            }
            showingTrade = !(traderIndex == -1 || traderIndex >= favKeys.length);

            if(!showingTrade) {
                traderIndex = -1;
                optionIndex = -1;
            }
        } 

        this.favoriteTraderIndex = traderIndex;
        this.favoriteTraderOptionIndex = optionIndex;

        let trader = favKeys[traderIndex];
        sc.gui.tradeTrackerGui.setTrade(trader, favTraders[trader]?.[optionIndex]);

        return showingTrade;
    },

    exitTrade() {
        this.parent();
        this.traderKey = "";
    },

    isTraderFavorite(key, option) {
        return this.favoriteTraders[key]?.includes(option) || false;
    },
    isActiveTraderFavorite() {
        return this.isTraderFavorite(this.traderKey, this.tradeIndex);
    },

    onStorageSave(savefile) {
        this.parent!(savefile);
        savefile.vars.storage.favoriteTraders = ig.copy(this.favoriteTraders);
    },
    onStoragePreLoad(savefile) {
        this.parent!(savefile);
        
        if(savefile.vars.storage.favoriteTraders) {
            this.favoriteTraders = ig.copy(savefile.vars.storage.favoriteTraders);
        } else {
            this.favoriteTraders = {};
        }

        this.favoriteTraderKeys = Object.keys(this.favoriteTraders);
    },
})

//@ts-expect-error
let value = Math.max(...Object.values(sc.TRADE_MODEL_EVENT));
Object.assign(sc.TRADE_MODEL_EVENT, {
    "FAVORITE_TRADER_ADDED": ++value,
    "FAVORITE_TRADER_REMOVED": ++value,
    "FAVORITE_TRADER_SELECTED": ++value,
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

sc.QuestModel.inject({
    cycleFavQuest(count, skip) {
        if (this.showingFavTrader) {
            this.showingFavTrader = sc.trade.cycleFavTrader(count);
            if(!this.showingFavTrader && count < 0) {
                this.parent(count, skip)
            }
        //if there are no marked quests
        //or you're going beyond the "end"
        //or you're going before the "beginning"
        } else if(this.markedQuests.length === 0
        || (count > 0 && this.focusQuest >= this.markedQuests.length - 1)
        || (count < 0 && this.focusQuest === -1)
        ) {
            if(!(count < 0 && this.focusQuest === -1)) this.parent(count, skip)
            if(sc.trade.favoriteTraderKeys.length !== 0) {
                this.showingFavTrader = sc.trade.cycleFavTrader(count);

                
            }
        } else this.parent(count, skip);
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
