const small_icons = new ig.Font("media/font/el-tweaks-icons-small.png", 14, ig.MultiFont.ICON_START);
const small_index = sc.fontsystem.smallFont.iconSets.length;

sc.fontsystem.smallFont.pushIconSet(small_icons);

let i = 0;
sc.fontsystem.smallFont.setMapping({
    "timesGreen": [small_index, i++]
})