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

el.TradeTrackerGui = sc.RightHudBoxGui.extend({
    init() {
        this.parent(ig.lang.get("sc.gui.trade-tracker.title"));
    },

    setTrade(trade, option) {
        this.clearContent();

        let trader = sc.trade.traders[trade || ""];
        if(trade && trader) {
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
            textGui.setText(`\\i[trade-icon-small]\\i[item-small${sc.inventory.getRaritySuffix(sc.inventory.getItem(itemID)!.rarity)}]${sc.inventory.getItemName(itemID)}` + (tradeOption.get[0].amount != 1 ? `\\i[times]${tradeOption.get[0].amount}` : ""));
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
            gui.setSize(158, y);
            this.pushContent(gui, true);
            gui.hook.pos.x = 0;
            this.contentEntries[0].setSize(gui.hook.size.x, gui.hook.size.y+8)
            this.show();
        } else {
            this.hide();
        }
    },
})

el.TradeTrackerGui.ItemEntry = ig.BoxGui.extend({
    gfx: new ig.Image("media/gui/basic.png"),
    ninepatch: new ig.NinePatch("media/gui/menu.png", {
        width: 2,
        height: 0,
        left: 4,
        top: 13,
        right: 4,
        bottom: 0,
        offsets: {
            "default": {
                x: 488,
                y: 0
            }
        }
    }),

    init(itemID, needed) {
        this.parent(150, 13);

        this.item = itemID;
        this.name = sc.inventory.getItemName(itemID);
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
    ninepatch: new ig.NinePatch("media/gui/menu.png", {
        width: 2,
        height: 0,
        left: 4,
        top: 13,
        right: 4,
        bottom: 0,
        offsets: {
            "default": {
                x: 488,
                y: 0
            }
        }
    }),

    init(cost) {
        this.parent(150, 13);

        this.needed = cost;
        this.nameGui = new sc.TextGui("", {
            font: sc.fontsystem.smallFont
        });
        this.nameGui.setPos(6, -1);
        this.addChildGui(this.nameGui);

        this.maxNumberGui = new sc.NumberGui(9999999, {
            size: sc.NUMBER_SIZE.SMALL
        });
        this.maxNumberGui.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.maxNumberGui.setPos(4, 2);
        this.maxNumberGui.setNumber(cost);
        this.maxOffset = this.maxNumberGui.hook.size.x;
        
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

sc.CrossCode.inject({
    init() {
        this.parent();
        sc.gui.rightHudPanel.addHudBoxBefore(new el.TradeTrackerGui, sc.gui.moneyHud);
        //@ts-ignore
        window.elTradeGui = sc.gui.rightHudPanel.boxes.find(x => x instanceof el.TradeTrackerGui);
    },
})