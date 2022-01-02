sc.Arena.inject({
    trackedCups: [
        "rookie-cup",
        "seeker-cup",
        "boss-cup",
        "faction-cup-1",
        "faction-cup-2",
        "rookie-team-cup",
        "faction-team-cup-1",
    ],
    
    getTotalArenaCompletion(){
        var a: number, b: number;
        a = b = 0;
        this.trackedCups.forEach(cupName => {a += this.getCupCompletion(cupName); b++;})
        return a / b;
    },

    getTotalDefaultTrophies: function(a, c) {
        var d = 0, e = 0;
        this.trackedCups.forEach((f: string) => {
            var g = this.getCupTrophy(f);
            if (this.isCupUnlocked(f))
                if (a == 0) {
                    d += g;
                    e += 5
                } else {
                    g >= a && d++;
                    e++
                }
        })
        return c ? e : d
    },

    getTotalDefaultCups(sorted){
        let cups: {[key: string]: {order: number}} = {};
        this.trackedCups.forEach(key => {
            /* 
             * if the cup is not loaded, skip it.
             * prevents bug where it would show stats for
             * cups like "~ancient-cup" in red.
            */
            if(this.cups[key].name) {
                let order = sc.arena.cups[key].order || 1e7;
                if(this.isCupCustom(key)) order += 1e7;
                cups[key] = {order}
            }
        })
        if(sorted){
            let sortedCups: {[key: string]: {order: number}} = {}
            Object.keys(cups)
            .sort((a, b) => (cups[a].order - cups[b].order))
            .forEach(key => {
                if(this.isCupUnlocked(key) && cups[key]) sortedCups[key] = cups[key];
            })
            
            return sortedCups;
        }
        return cups
    }
})