sc.StatsModel.inject({
    getMap(b, a) {
        let value = this.parent(b, a);
        if (b === "chests") {
            value += sc.map.getExtraFoundChests(a)
        }
        return value;
    }
})