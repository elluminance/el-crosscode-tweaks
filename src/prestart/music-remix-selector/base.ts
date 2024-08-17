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
        //verify there is a remix associated and if there is, make sure it actually is valid
        if (this.selectedRemixes[bgm] && (this.selectedRemixes[bgm] in this.remixes[bgm])) {
            return this.selectedRemixes[bgm];
        } else {
            //otherwise, it's clearly invalid. we'll just delete it then.
            if(this.selectedRemixes[bgm]) {
                delete this.selectedRemixes[bgm];
                this.saveToStorage();
            }
            return bgm;
        }
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