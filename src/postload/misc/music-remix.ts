el.MusicRemixController = ig.Class.extend({
    remixes: {},
    selectedRemixes: {
    },

    init() {
        this.loadFromStorage();
    },

    registerRemix(originalTrack, trackReplacement, data) {
        this.remixes[originalTrack] ??= {};

        this.remixes[originalTrack][trackReplacement] = {
            replacement: trackReplacement,

            name: data?.name ?? { en_US: trackReplacement },
            desc: data?.desc ?? { en_US: " " },
        }
    },

    getRemix(bgm) {
        //verify there is a remix associated and if there is, make sure it actually is valid
        if (this.selectedRemixes[bgm] && (this.selectedRemixes[bgm] in this.remixes[bgm])) {
            return this.selectedRemixes[bgm];
        } else {
            //otherwise, it's clearly invalid. we'll just delete it then.
            if (this.selectedRemixes[bgm]) {
                delete this.selectedRemixes[bgm];
                this.saveToStorage();
            }
            return bgm;
        }
    },

    setRemix(bgm, newBgm) {
        if (newBgm) {
            this.selectedRemixes[bgm] = newBgm;
        } else {
            delete this.selectedRemixes[bgm];
        }

        //kinda hacky, but it works.
        //any already set ones will be loaded in poststart.
        if(bgm === "title") {
            ig.Bgm.preloadStartTrack(newBgm || bgm);
        }
        el.musicRemix.saveToStorage();
    },

    saveToStorage() {
        localStorage.setItem("el-music-remix-selected", JSON.stringify(this.selectedRemixes));
    },
    loadFromStorage() {
        try {
            this.selectedRemixes = JSON.parse(localStorage.getItem("el-music-remix-selected") || "{}");
            if (typeof this.selectedRemixes !== "object") {
                this.selectedRemixes = {};
            }
        } catch {
            this.selectedRemixes = {};
        }
    },
});
el.musicRemix = new el.MusicRemixController;

let trackOrder = [
    "title",
    "oldHideout1",
    "oldHideoutBattle",
    "intro",
    "tutorial",
    "tutorial-battle",
    "cargoship-exterior",
    "exposition",
    "challenge",
    "designer",
    "bossbattle1",
    "crosscounter",
    "escape",
    "rhombusSquare",
    "rhombusDungeon",
    "challenge2",
    "emilie",
    "apolloTheme",
    "rookieHarbor",
    "autumnsRise",
    "fieldBattle",
    "casual",
    "lea",
    "bergenTrail",
    "bergenVillage",
    "briefing",
    "firstScholars",
    "coldDungeon",
    "ponder",
    "heatArea",
    "heatVillage",
    "sorrow",
    "heatDungeon",
    "dreamsequence",
    "autumnsFall",
    "raidTheme",
    "designerBoss1",
    "waiting",
    "aridField",
    "aridBattle",
    "shizukaConfrontation",
    "sadness",
    "infiltration",
    "evoDungeon1",
    "evoDungeon2",
    "evoEscape",
    "snailBattle1",
    "snailBattle2",
    "sergeyExposition",
    "jungle",
    "basinKeep",
    "waveDungeon",
    "shockDungeon",
    "treeDungeon",
    "forestField",
    "rhombusSquare2",
    "oldHideout2",
    "shizuka",
    "trueIntentions",
    "lastDungeon",
    "finalBoss",
    "credits",
    "arena",
    "bossRush",
    "glitchArea",
    "s-rank",
    "beach",
    "finalDungeon",
    "godBoss"
]
let count = 0;
for(let entry of trackOrder) {
    ig.BGM_TRACK_LIST[entry].order = count;
    count++;
}