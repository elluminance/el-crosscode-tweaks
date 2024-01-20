el.getTradeCost = function(trade: sc.TradeModel.TradeOption) {
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

sc.TradeModel.inject({
    traderKey: "",
    favoriteTraders: [],
    favoriteTraderIndex: -1,

    el_tradersFound: {},

    toggleFavoriteTrader(key, option) {
        if(this.isTraderFavorite(key, option)) {
            let index = this.favoriteTraders.findIndex(([x_key, x_val]) => x_key == key && x_val == option);

            this.favoriteTraders.splice(index, 1);
            if(index <= this.favoriteTraderIndex) sc.quests.cycleFavQuest(-1);
            sc.Model.notifyObserver(this, sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_REMOVED, index);
            return false;
        } else {
            this.favoriteTraders.push([key, option]);
            this.favoriteTraders.sort(([x_key, x_val], [y_key, y_val]) => x_key == y_key ? x_val - y_val : 0);

            let favTrader = this.favoriteTraders[this.favoriteTraderIndex];
            if(favTrader && favTrader[0] == key && favTrader[1] >= option) {
                this.favoriteTraderIndex++;
            }

            sc.Model.notifyObserver(this, sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_ADDED);
            return true;
        }
    },

    cycleFavTrader(count) {
        if(this.favoriteTraders.length == 0) return false;

        this.favoriteTraderIndex += count;

        let showingTrade = true;
        if(count >= 0) {
            if(this.favoriteTraderIndex >= this.favoriteTraders.length) {
                this.favoriteTraderIndex = -1;
                showingTrade = false;
            }
        } else if(this.favoriteTraderIndex <= -2) {
            this.favoriteTraderIndex = this.favoriteTraders.length - 1;
            showingTrade = true;
        } else if (this.favoriteTraderIndex === -1) {
            showingTrade = false;
        }

        sc.Model.notifyObserver(this, sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_CHANGED);
        return showingTrade;
    },

    exitTrade() {
        this.parent();
        this.traderKey = "";
    },

    unlockTrader(trader, characterName) {
        this.parent(trader, characterName);

        if(this.traders[trader].noTrack) {
            this.el_tradersFound[trader] = {
                characterName: characterName || "",
                map: sc.map.getCurrentMapName(),
                area: sc.map.getCurrentPlayerAreaName(),
                time: (new Date).getTime()
            };
        }
    },

    unlockParents(trader, characterName, originalTrader) {
        let val = this.parent(trader, characterName, originalTrader);

        for(let entry of this.favoriteTraders) {
            if(entry[0] == originalTrader) {
                entry[0] = trader;
                sc.Model.notifyObserver(this, sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_CHANGED);
            }
        }

        return val;
    },

    isTraderFavorite(key, option) {
        return this.favoriteTraders.find(([x_key, x_val]) => x_key === key && x_val === option) !== undefined;
    },
    isActiveTraderFavorite() {
        return this.isTraderFavorite(this.traderKey, this.tradeIndex);
    },

    onStorageSave(savefile) {
        this.parent!(savefile);
        let obj: any = {
            favoriteTraders: ig.copy(this.favoriteTraders),
            showingFavTrader: sc.quests.showingFavTrader,
            favTraderIndex: this.favoriteTraderIndex,
            tradersFound: {},
        };
        for(let [trader, data] of Object.entries(this.el_tradersFound)) {
            obj.tradersFound[trader] = {
                characterName: data.characterName,
                map: data.map?.getSaveData?.() ?? "???",
                area: data.area?.getSaveData?.() ?? "???",
                time: data.time || 0,
            }
        }
        savefile.vars.storage.el_favTrader = obj;
    },
    onStoragePreLoad(savefile) {
        this.parent!(savefile);
        let obj = savefile.vars.storage.el_favTrader;
        if(obj) {
            this.favoriteTraders = ig.copy(obj.favoriteTraders);
            sc.quests.showingFavTrader = obj.showingFavTrader;
            this.favoriteTraderIndex = obj.favTraderIndex;
            
            if((!sc.quests.showingFavTrader) || (!this.favoriteTraderIndex && this.favoriteTraderIndex !== 0)) {
                sc.quests.showingFavTrader = false;
                this.favoriteTraderIndex = -1
            }
            this.el_tradersFound = {};

            if(obj.tradersFound) {
                for(let [trader, data] of Object.entries<any>(obj.tradersFound)) {
                    this.el_tradersFound[trader] = {
                        characterName : data.characterName,
                        map: new ig.LangLabel(data.map || "???"),
                        area: new ig.LangLabel(data.map || "???"),
                        time: data.time || 0
                    }
                }
            }
        } else {
            this.favoriteTraders = [];
            sc.quests.showingFavTrader = false;
            this.favoriteTraderIndex = -1;
        }
    },

    onStoragePostLoad(savefile) {
        this.parent && this.parent(savefile);
        sc.Model.notifyObserver(this, sc.TRADE_MODEL_EVENT.FAVORITE_TRADER_CHANGED);
    },

    getFavoriteTrade() {
        return this.favoriteTraders[this.favoriteTraderIndex] || [];
    }
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
            if(sc.trade.favoriteTraders.length !== 0) {
                this.showingFavTrader = sc.trade.cycleFavTrader(count);
            }
        } else this.parent(count, skip);
    },
})

sc.TradeInfo.inject({
    startTradeMenu() {
        sc.trade.traderKey = this.key;
        this.parent();
    },
})

//@ts-expect-error
let value = Math.max(...Object.values(sc.TRADE_MODEL_EVENT));
Object.assign(sc.TRADE_MODEL_EVENT, {
    "FAVORITE_TRADER_ADDED": ++value,
    "FAVORITE_TRADER_REMOVED": ++value,
    "FAVORITE_TRADER_CHANGED": ++value,
})
