const small_icons = new ig.Font("media/font/el-tweaks-icons-small.png", 14, ig.MultiFont.ICON_START);
const small_index = sc.fontsystem.smallFont.iconSets.length;

sc.fontsystem.smallFont.pushIconSet(small_icons);

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
})