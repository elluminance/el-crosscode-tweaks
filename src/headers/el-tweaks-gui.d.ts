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
        interface TradeTrackerGui extends sc.RightHudBoxGui {
            setTrade(this: this, trade: string | null, option?: number): void;
        }
        let TradeTrackerGui: TradeTrackerGui.Constructor;
    }
}