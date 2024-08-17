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

            name: data?.name ?? {en_US: trackReplacement},
            desc: data?.desc ?? {en_US: " "},
        }
    },

    getRemix(bgm) {
        return this.selectedRemixes[bgm] || bgm;
    },

    setRemix(bgm, newBgm) {
        if(newBgm) {
            this.selectedRemixes[bgm] = newBgm;
        } else {
            delete this.selectedRemixes[bgm];
        }

        el.musicRemix.saveToStorage();
    },

    saveToStorage() {
        localStorage.setItem("el-music-remix-selected", JSON.stringify(this.selectedRemixes));
    },
    loadFromStorage() {
        try {
            this.selectedRemixes = JSON.parse(localStorage.getItem("el-music-remix-selected") || "{}");
            if(typeof this.selectedRemixes !== "object") {
                this.selectedRemixes = {};
            }
        } catch {
            this.selectedRemixes = {};
        }
    },
});
el.musicRemix = new el.MusicRemixController;

ig.Bgm.inject({
    loadTrack(name) {
        return this.parent(el.musicRemix.getRemix(name));
    }
})