el.TradeTrackerGui = sc.RightHudBoxGui.extend({
    gfx: new ig.Image("media/gui/el/el-tweaks-gui.png"),
    credits: null,

    init() {
        this.parent(ig.lang.get("sc.gui.trade-tracker.title"));
        sc.Model.addObserver(sc.model, this);
        sc.Model.addObserver(sc.options, this);
        sc.Model.addObserver(sc.trade, this);
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
            let entry = new el.TradeTrackerGui.CreditEntry(el.getTradeCost(tradeOption));
            entry.setPos(4, y);
            y += entry.hook.size.y + 1;
            gui.addChildGui(entry);
            this.credits = entry;

            let foundTrader = sc.trade.getFoundTrader(trade);
            if(!foundTrader) {
                foundTrader = sc.trade.el_tradersFound[trade];
            }
            let areaName = new sc.TextGui(`${sc.trade.getTraderAreaName(trade, true)} - ${foundTrader?.map || "???"}`, {
                font: sc.fontsystem.tinyFont,
            })

            let img = new ig.ImageGui(this.gfx, 160, 56, 5, 10);
            img.setPos(5, y+1);
            areaName.setPos(5+8, y+2);
            
            gui.addChildGui(img);
            gui.addChildGui(areaName);
            y += areaName.hook.size.y;

            gui.setSize(162, y);
            this.pushContent(gui, true);
            gui.hook.pos.x = 0;
            this.contentEntries[0].setSize(gui.hook.size.x, gui.hook.size.y+8)
            if(this._isVisible()) this.show();
            else this.hide(true);
        } else {
            this.hasTrade = false;
            this.credits = null;
            this.hide();
        }
    },
    
    modelChanged(model, message, data) {
        let trade = sc.trade.getFavoriteTrade();
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
        } else if (model === sc.trade) {
            switch(message) {
                case sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_CHANGED:
                case sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_REMOVED:
                    if(trade) {
                        this.setTrade(trade[0], trade[1]);
                    } else {
                        this.setTrade(null);
                    }
                    break;

            }
        } else if (model === sc.options) {
            if(message === sc.OPTIONS_EVENT.OPTION_CHANGED && sc.quests.showingFavTrader) {
                if(trade) {
                    this.setTrade(trade[0], trade[1]);
                } else {
                    this.setTrade(null);
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

    onAttach() {
        sc.Model.addObserver(sc.model.player, this);
    },

    onDetach() {
        sc.Model.removeObserver(sc.model.player, this);
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
        } else if (model === sc.trade) {
            switch(message) {
                case sc.TRADE_MODEL_EVENT.TRADED:
                    this.updateCount()
                    break;
            }
        }
    },

    onAttach() {
        sc.Model.addObserver(sc.model.player, this);
        sc.Model.addObserver(sc.trade, this);
    },

    onDetach() {
        sc.Model.removeObserver(sc.model.player, this);
        sc.Model.removeObserver(sc.trade, this);
    },
})

sc.CrossCode.inject({
    init() {
        this.parent();
        sc.gui.tradeTrackerGui = new el.TradeTrackerGui;
        sc.gui.rightHudPanel.addHudBoxBefore(sc.gui.tradeTrackerGui, sc.gui.moneyHud);
    },
})
