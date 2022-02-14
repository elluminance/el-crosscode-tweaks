function getDigits(value: number): number {
    return Math.floor(Math.log10(Math.abs(value))) + 1;
}

sc.ParamHudGui.inject({
    init() {
        this.parent();
        this.hp._number.setMaxNumber(99999999);
        this.atk._number.setMaxNumber(9999999);
        this.def._number.setMaxNumber(9999999);
        this.foc._number.setMaxNumber(9999999);

        sc.Model.addObserver(sc.model.player.params, this);
        this.updateParamHud()
    },

    updateParamHud() {
        let xOffset = this.hp.hook.pos.x;
        let digits = 0;
        digits = getDigits(sc.model.player.params.getStat("hp")) - 4;
        this.hp.hook.size.x = 62 + 8 * digits.limit(0, 4);
        xOffset += this.hp.hook.size.x - 14;
        
        this.atk.hook.pos.x = xOffset;
        digits = getDigits(sc.model.player.params.getStat("attack")) - 3;
        this.atk.hook.size.x = 54 + 8 * digits.limit(0, 4);
        xOffset += this.atk.hook.size.x - 14;
        
        this.def.hook.pos.x = xOffset;
        digits = getDigits(sc.model.player.params.getStat("defense")) - 3;
        this.def.hook.size.x = 54 + 8 * digits.limit(0, 4);
        xOffset += this.def.hook.size.x - 14;
        
        this.foc.hook.pos.x = xOffset;
        digits = getDigits(sc.model.player.params.getStat("focus")) - 3;
        this.foc.hook.size.x = 54 + 8 * digits.limit(0, 4);
        xOffset += this.foc.hook.size.x - 14;
    },

    modelChanged(model, message) {
        if(model == sc.model.player.params && message == sc.COMBAT_PARAM_MSG.STATS_CHANGED) {
            this.updateParamHud()
        }
    }
})