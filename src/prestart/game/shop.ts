sc.MenuModel.inject({
    customCurrency: null,

    exitMenu() {
        this.parent();
        this.customCurrency = undefined;
    }
})

ig.EVENT_STEP.OPEN_SHOP.inject({
    start() {
        sc.menu.customCurrency = sc.modUtils.currencies[ig.database.get("shops")[this.shop].currency!];
        this.parent()
    }
})

sc.ShopConfirmEntry.inject({
    updateDrawables(b) {
        if (sc.menu.customCurrency) {
            let { gfx, srcX, srcY } = sc.menu.customCurrency.image
            b.addGfx(this.gfx, 132, 6, 560, 416, 8, 8);
            b.addGfx(this.gfx, 164, 7, 568, 416, 8, 8);

            b.addGfx(gfx, 232, 4, srcX, srcY, 12, 12);
        } else this.parent(b)
    }
})

sc.ShopCartEntry.inject({
    updateDrawables(b) {
        if (sc.menu.customCurrency && !this.hideSymbol) {
            let { gfx, srcX, srcY } = sc.menu.customCurrency.image
            b.addGfx(gfx, this.hook.size.x - 15, -2, srcX, srcY, 12, 12)
        }
        else this.parent(b)
    }
})

sc.ShopMenu.inject({
    buyItems() {
        if (sc.menu.customCurrency) {
            sc.menu.customCurrency.sub(sc.menu.getTotalCost())

            let value = 0;
            for(let element of sc.menu.shopCart) {
                value += element.amount;
                sc.model.player.addItem(element.id, element.amount, true)
            }
            sc.stats.addMap("items", "buy", value)
            return false
        } else return this.parent()
    },

    sellItems() {
        if (sc.menu.customCurrency) {
            sc.menu.customCurrency.add(sc.menu.getTotalCost());
            let c = false, value = 0;
            for(let element of sc.menu.shopCart) {
                value += element.amount
                sc.model.player.removeItem(element.id, element.amount);
                sc.model.player.getItemAmount(element.id) <= 0 && !c && (c = true)
            }
            sc.stats.addMap("items", "sell", value);

            return c
        } else return this.parent()
    },
})

sc.ShopCart.inject({
    init() {
        this.parent();
        let currency = sc.menu.customCurrency;
        if (currency) {
            this.credits.text.setText(`${ig.lang.get(`sc.gui.shop.${currency.name}`)}:`)
        }
    },
    resetNumbers(b) {
        let currency = sc.menu.customCurrency;
        if (currency) {
            let a = currency.get();
            this.credits.setNumber(a, b);
            this.value.setNumber(0, b);
            this.rest.setNumber(a, b);
            a < 0 ? this.rest.number.setColor(sc.GUI_NUMBER_COLOR.RED) : this.rest.number.setColor(sc.GUI_NUMBER_COLOR.WHITE);
            this.checkout.setActive(false)
        } else this.parent(b)
    },

    updateValue(b) {
        let currency = sc.menu.customCurrency;
        if (currency) {
            var a = (b as unknown as number) || 0;
            if (b === undefined) {
                for (let cart = sc.menu.shopCart, d = cart.length; d--;) a = a + cart[d].price * cart[d].amount;
                this.value.setNumber(-a)
            }
            let value = 0;
            if (sc.menu.shopSellMode) {
                value = currency.get() + a;
                this.value.number.setColor(sc.GUI_NUMBER_COLOR.GREEN);
                this.value.setNumber(a)
            } else {
                value = currency.get() - a;
                this.value.number.setColor(sc.GUI_NUMBER_COLOR.RED);
                this.value.setNumber(-a)
            }
            this.rest.setNumber(value);
            this.value.number.showPlus = sc.menu.shopSellMode && !!a;
            if (value < 0) {
                this.rest.number.setColor(sc.GUI_NUMBER_COLOR.RED);
                this.checkout.setActive(false)
            } else {
                sc.menu.shopCart.length === 0 ? this.checkout.setActive(false) : this.enabled && this.checkout.setActive(true);
                this.rest.number.setColor(sc.GUI_NUMBER_COLOR.WHITE)
            }
        } else this.parent(b)
    }
})

sc.ShopListMenu.inject({
    createBuyList(refocus, fromMouse, skipSounds, sortType) {
        let shop = ig.copy(ig.database.get("shops"))[sc.menu.shopID!];
        if (sc.menu.shopSellMode && shop.sellPages) {
            refocus = refocus || false;
            fromMouse = fromMouse || false;
            skipSounds = skipSounds || false;
            this._prevSortType = sortType = sortType || sc.SORT_TYPE.ORDER;
            this.buttongroup.clear();
            this.list.clear(refocus);
            let currentPage = shop.sellPages[sc.menu.shopPage];
            sc.menu.sellFactor = currentPage.sellFactor ?? 2;
            if (currentPage.itemType) {
                let itemIDs: sc.ItemID[];
                if (currentPage.itemType in ["ARM", "TORSO", "HEAD", "FEET"]) {
                    itemIDs = sc.model.player.getEquipSubList(currentPage.itemType as sc.ITEMS_EQUIP_TYPES, false, sortType)
                } else {
                    itemIDs = sc.model.player.getItemSubList(currentPage.itemType as keyof typeof sc.ITEMS_TYPES, sortType)
                }
                this.scrapSellList(itemIDs);
            } else {
                this.scrapBuyList(currentPage.content)
            }
            if (refocus) {
                fromMouse ? this.buttongroup.setCurrentFocus(0, 0) : this.buttongroup.focusCurrentButton(0, 0, false, skipSounds);
                this.list.list.scrollToY(0, true)
            }
            this.getRepeaterValue()
        } else this.parent(refocus, fromMouse, skipSounds, sortType)
    },

    scrapBuyList(b) {
        let currency = sc.menu.customCurrency,
            maxVal: number,
            itemID: sc.ItemID,
            itemAmount: number,
            item: sc.Inventory.Item,
            itemEquipLevel: number,
            moneyLeft = (currency ? currency.get() : sc.model.player.credit) - sc.menu.getTotalCost(),
            itemCost: number,
            itemQuantity: number,
            itemName: string,
            itemDesc: string,
            button: sc.ShopItemButton;

        for (var c = 0, k = 0; k < b.length; k++) {
            if (!b[k].condition || (new ig.VarCondition(b[k].condition)).evaluate()) {
                itemID = b[k].item;
                item = sc.inventory.getItem(itemID)!;
                itemAmount = sc.model.player.getItemAmountWithEquip(itemID);
                itemEquipLevel = 0;
                item.type === sc.ITEMS_TYPES.EQUIP && (itemEquipLevel = item.level || 1);

                itemCost = Math.floor(b[k].price || (item.cost / (sc.menu.shopSellMode ? 2 : 1)));
                itemQuantity = sc.menu.getItemQuantity(itemID, itemCost);
                itemName = "\\i[" + (item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default") + "]" + ig.LangLabel.getText(item.name);
                itemDesc = ig.LangLabel.getText(item.description);
                button = new sc.ShopItemButton(itemName, itemID, itemDesc, itemAmount, itemCost, itemEquipLevel);
                itemQuantity >= 0 && button.setCountNumber(itemQuantity, true);
                let maxOwn = b[k].maxOwn ?? ig.database.get("shops")[sc.menu.shopID!].maxOwn;
                if (!sc.menu.shopSellMode && (maxOwn !== undefined)) {
                    c = sc.stats.getMap("items", itemID as string)
                    maxVal = (button.data as any).maxOwn = b[k].maxOwn!;
                } else maxVal = 99;
                (moneyLeft < itemCost && !sc.menu.getItemQuantity(itemID, itemCost) || c >= Math.min(maxVal, maxOwn ?? 99)) && button.setActive(false);
                this.list.addButton(button)
            }
        }
    },

    updateListEntries(b) {
        let currency = sc.menu.customCurrency;
        if (currency) {
            let player = sc.model.player,
                coins = currency.get() - sc.menu.getTotalCost();
            for (let c = this.list.getChildren(),
                e = c.length, maxOwn = ig.database.get("shops")[sc.menu.shopID!].maxOwn || 99;
                e--;
            ) {
                //@ts-ignore
                var g = c[e].gui;
                if (!sc.menu.shopSellMode) {
                    var h = sc.menu.getItemQuantity(g.data.id, g.price);
                    ((player.getItemAmountWithEquip(g.data.id)) >= (g.data.maxOwn || maxOwn))
                        ? g.setActive(false)
                        : !h && g.price > coins
                            ? g.setActive(false)
                            : g.setActive(true)
                }
                if (b) {
                    g.setCountNumber(0, true);
                }
                g.owned.setNumber(sc.menu.shopSellMode ? player.getItemAmount(g.data.id) : player.getItemAmountWithEquip(g.data.id))
            }
        } else this.parent(b)
    },

    changeCount(changeValue) {
        let a = this.getActiveElement();
        if (a && a.active && a.data && a.data.id) {
            let c = a.data.id,
                e = a.price,
                itemsInCart = sc.menu.getItemQuantity(c, e),
                buyableItems = sc.ShopHelper.getMaxBuyable(c, itemsInCart, e, (a.data as any).maxOwn || ig.database.get("shops")[sc.menu.shopID!].maxOwn || 99);
            if (!(itemsInCart === 0 && changeValue === -1) && !(itemsInCart === buyableItems && changeValue === 1)) {
                changeValue = Math.min(changeValue, buyableItems) as -1 | 1
                this.playSound(changeValue, true);
                sc.menu.updateCart(c, itemsInCart + changeValue, e);
                a.setCountNumber(itemsInCart + changeValue, itemsInCart === 0);
                this.updateListEntries()

            }
        }
    }
})

function itemTypeToLangLabel(type: "CONS" | "ARM" | "HEAD" | "TORSO" | "FEET" | "TRADE") {
    switch(type) {
        case "CONS": return "cons";
        case "HEAD": return "equip-head";
        case "ARM": return "equip-arm";
        case "TORSO": return "equip-torso";
        case "FEET": return "equip-feet";
        case "TRADE": return "trade"
    }
}

sc.ShopPageCounter.inject({
    show() {
        let sellPages = ig.database.get("shops")[sc.menu.shopID!].sellPages;
        this.parent();

        if(sc.menu.shopSellMode && sellPages) {
            let currentPage = sellPages[sc.menu.shopPage];
            if(currentPage.itemType) {
                this.pageText.setText(ig.lang.get(`sc.gui.shop.sellPages.${itemTypeToLangLabel(currentPage.itemType)}`))
            } else {
                this.pageText.setText(ig.LangLabel.getText(currentPage.title));
            }

            if(sellPages.length <= 1) {
                this.cycleLeft.setActive(false);
                this.cycleRight.setActive(false);
                this.cycleLeft.setText("\\i[arrow-left-off]");
                this.cycleRight.setText("\\i[arrow-right-off]")
            } else {
                this.cycleLeft.setActive(true);
                this.cycleRight.setActive(true);
                this.cycleLeft.setText("\\i[arrow-left]");
                this.cycleRight.setText("\\i[arrow-right]")
            }
        }
    },

    cycleSellPages(dir) {
        let sellPages = ig.database.get("shops")[sc.menu.shopID!].sellPages;
        if(sellPages) {
            let newIndex = sc.menu.shopPage + dir;

            if(dir < 0 && newIndex < 0) newIndex = sellPages.length - 1;
            else if (dir > 0 && newIndex >= sellPages.length) newIndex = 0;
            sc.menu.setShopPage(newIndex);
            if(sellPages[sc.menu.shopPage].itemType) {
                this.pageText.setText(ig.lang.get(`sc.gui.shop.sellPages.${itemTypeToLangLabel(sellPages[sc.menu.shopPage].itemType!)}`))
            } else {
                this.pageText.setText(ig.LangLabel.getText(sellPages[sc.menu.shopPage].title));
            }
        } else this.parent(dir)
    }
})

sc.ShopQuantitySelect.inject({
    show(a, b, c) {
        this.parent(a, b, c);

        if (!this.active) return;
        let price = this._button.price,
            quantity = sc.menu.getItemQuantity(this._button.data.id, price),
            currency = sc.menu.customCurrency;

        let d = price * quantity,
            e = (this._button.data as any).maxOwn || ig.database.get("shops")[sc.menu.shopID!].maxOwn || 99;
        if (currency && !sc.menu.shopSellMode) {
            var k = currency.get();
            this._max = Math.min(e || 99, (e || 99) - sc.model.player.getItemAmount(a.data.id));
            this._max = Math.min(this._max, Math.floor(Math.max(0, k - sc.menu.getTotalCost() + d) / price))
        }
    }
})

let getMaxBuyableOriginal = sc.ShopHelper.getMaxBuyable;

sc.ShopHelper.getMaxBuyable = function (itemID, a, d, c) {
    let currency = sc.menu.customCurrency;
    if (currency && !sc.menu.shopSellMode) {
        a = a * d;
        let coins = currency.get(),
            b = Math.min(c || 99, (c || 99) - sc.model.player.getItemAmount(itemID));
        return Math.min(b, Math.floor(Math.max(0, coins - sc.menu.getTotalCost() + a) / d))
        //@ts-expect-error
    } else return getMaxBuyableOriginal(itemID, a, d, c)
}

sc.ShopItemButton.inject({
    maxOwn: 99,
    init(itemName, itemID, itemDescription, itemAmount, cost, itemEquipLevel) {
        if (sc.menu.shopSellMode && sc.menu.sellFactor) {
            //undoes the 1/2 multiplier 
            cost *= 2;
            cost = Math.max((cost / sc.menu.sellFactor).floor(), 0)
        }
        this.parent(itemName, itemID, itemDescription, itemAmount, cost, itemEquipLevel)
    }
})