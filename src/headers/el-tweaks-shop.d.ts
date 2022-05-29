export {};

declare global {
    namespace ig {
        namespace Database {
            interface ShopData {
                currency?: string;
                sellPages?: ShopSellPage[];
            }

            interface ShopSellPage extends ShopPage {
                itemType?: "CONS" | "ARM" | "HEAD" | "TORSO" | "FEET" | "TRADE"
                sellFactor?: number;
            }

            interface ShopItem {
                maxOwn?: number;
            }
        }
    }

    namespace sc {
        namespace ModUtils {
            interface CurrencyEntry {
                name: string;
                varPath: string;
                image: {
                    gfx: ig.Image;
                    srcX: number;
                    srcY: number;
                },

                get(): number;
                set(value: number): void;
                add(value: number): void;
                sub(value: number): void;
            }
        }

        interface ModUtils {
            currencies: Record<string, ModUtils.CurrencyEntry>;

            registerCurrency(name: string, imgPath: string, srcX: number, srcY: number, varPathOverride?: string): boolean;
        }

        interface MenuModel {
            customCurrency?: ModUtils.CurrencyEntry;
            sellFactor?: number;
        }

        namespace ShopItemButton {
            interface Data extends sc.ListBoxButton.Data {
                maxOwn: number;
            }
        }
    
        interface ShopItemButton {
            data: sc.ShopItemButton.Data;
            maxOwn: number;
        }
    }
    
    
}