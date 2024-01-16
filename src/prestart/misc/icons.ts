const small_icons = new ig.Font("media/font/el-tweaks-icons-small.png", 14, ig.MultiFont.ICON_START);
const small_index = sc.fontsystem.smallFont.iconSets.length;

sc.fontsystem.smallFont.pushIconSet(small_icons);
sc.fontsystem.smallFont.pushIconSet(
    new ig.Font("media/font/el-tweaks-item-icons-small.png", 14, ig.MultiFont.ICON_START)
)

let i = 0;
sc.fontsystem.smallFont.setMapping({
    "timesGreen": [small_index, i++],
    "trade-icon-small": [small_index, i++],
    "item-small": [small_index, i++],
    "item-small-normal": [small_index, i++],
    "item-small-rare": [small_index, i++],
    "item-small-legend": [small_index, i++],
    "item-small-unique": [small_index, i++],
    "item-small-backer": [small_index, i++],
    "item-small-scale": [small_index, i++],
    "credit": [small_index, i++],
})

let mapping: Record<string, [number, number]> = {};

i = 0;
for(const rarity of ["", "-normal", "-rare", "-legend", "-unique", "-backer", "-scale"]) {
    for(const type of ["item-default", "item-helm", "item-sword", "item-belt", "item-shoe", "item-items", "item-key", "item-trade", "item-toggle"]) {
        mapping[type+rarity] = [small_index+1, i++];
    }
}

sc.fontsystem.smallFont.setMapping(mapping)