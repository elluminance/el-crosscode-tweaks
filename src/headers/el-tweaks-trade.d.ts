export {};

declare global {
    namespace el {
        namespace TradeTrackerGui {
            interface Constructor extends ImpactClass<TradeTrackerGui> {
                new (): TradeTrackerGui;

                ItemEntry: ItemEntry.Constructor;
                CreditEntry: CreditEntry.Constructor;
            }

            namespace ItemEntry {
                interface Constructor extends ImpactClass<ItemEntry> {
                    new (itemID: sc.ItemID, needed: number): ItemEntry;
                }
            }
            interface ItemEntry extends ig.BoxGui, sc.Model.Observer {
                item: sc.ItemID;
                needed: number;
                name: string;

                nameGui: sc.TextGui;
                numberGui: sc.NumberGui;
                maxNumberGui: sc.NumberGui;

                updateCount(this: this): void;
            }
            
            namespace CreditEntry {
                interface Constructor extends ImpactClass<CreditEntry> {
                    new (cust: number): CreditEntry;
                }
            }
            interface CreditEntry extends ig.BoxGui, sc.Model.Observer {
                needed: number;
                
                nameGui: sc.TextGui;
                numberGui: sc.NumberGui;
                maxNumberGui: sc.NumberGui;
                maxOffset: number; 

                updateCount(this: this): void;
            }
        }
        interface TradeTrackerGui extends sc.RightHudBoxGui, sc.Model.Observer {
            hasTrade: boolean;
            
            setTrade(this: this, trade: string | null, option?: number): void;
            _isVisible(this: this): boolean;
        }
        let TradeTrackerGui: TradeTrackerGui.Constructor;

        interface TradeFavDisplay extends ig.GuiElementBase {
            gfx: ig.Image;
            isFavorite: boolean;
        }
        interface TradeFavDisplayConstructor extends ImpactClass<TradeFavDisplay> {
            new (): TradeFavDisplay;
        }
        var TradeFavDisplay: TradeFavDisplayConstructor;

        interface TradeFavDisplay extends{}
    }

    namespace sc {
        interface Gui {
            tradeTrackerGui: el.TradeTrackerGui;
        }

        namespace TradeModel {
            interface FavoriteTrader {
                key: string;
                option: number;
            }
        }

        interface TradeModel {
            traderKey: string;
            favoriteTraders: TradeModel.FavoriteTrader[];

            toggleFavoriteTrader(this: this, key: string, option: number): boolean;
            isActiveTraderFavorite(this: this): boolean;
            getFavoriteTraderIndex(this: this, key: string, option: number): number;
        }
        
        enum TRADE_MODEL_EVENT {
            FAVORITE_TRADER_ADDED,
            FAVORITE_TRADER_REMOVED,
            FAVORITE_TRADER_SELECTED,
        }

        interface TradeMenu {
            favButton: sc.ButtonGui;

            _onFavButtonCheck(this: this): boolean;
            onFavButtonPressed(this: this): void;
        }

        interface TradeItemBox {
            isFavorite: boolean;
            favGfx: ig.Image;
            favImg: ig.ImageGui;
            favDisplay: el.TradeFavDisplay;
            
            updateFavorites(this: this, isFavorite: boolean): void;
        }
    }
}