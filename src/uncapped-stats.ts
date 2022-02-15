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

sc.HpHudGui.inject({
    uncappedHpBar: new ig.Image("media/gui/el/hp-bar.png"),

    init(b) {
        this.parent(b);
        this.hpNumber.setMaxNumber(99999);
        this.hpNumber.setPos(7, 1)
    },
    updateDrawables(b) {
        b.addGfx(this.uncappedHpBar, 0, 0, 0, 0, this.hook.size.x, this.hook.size.y)
    }
})

sc.EquipStatusContainer.inject({
    init() {
        this.parent();
        this.baseParams.hp.currentValueGui.setMaxNumber(99999);
        this.baseParams.atk.currentValueGui.setMaxNumber(9999);
        this.baseParams.def.currentValueGui.setMaxNumber(9999);
        this.baseParams.foc.currentValueGui.setMaxNumber(9999);

        Object.values(this.baseParams).forEach(param => {
            param.currentValueGui.hook.pos.x -= 4
            param.percentCurrentGui && (param.percentCurrentGui.hook.pos.x -= 4);
            param.arrowGui.hook.pos.x -= 2;
        })
    }
})

sc.StatusViewMainParameters.inject({
    init() {
        this.parent();
        this.baseParams.hp.changeValueGui.setMaxNumber(99999)
        this.baseParams.atk.changeValueGui.setMaxNumber(9999)
        this.baseParams.def.changeValueGui.setMaxNumber(9999)
        this.baseParams.foc.changeValueGui.setMaxNumber(9999)
    }
})

let x = 0;

sc.StatusParamBar.inject({
    init(name, description, size, lineID, iconID, usePercent,  skillHidden, noPercent, longNumber) {
        this.parent(name, description, size, lineID, iconID, usePercent,  skillHidden, noPercent, longNumber);

        let value = longNumber ? 9999 : 99999;
        let offset = this.usePercent ? 16 : (longNumber ? 8 : 4);

        this.base.setMaxNumber(value);
        this.base.hook.pos.x -= offset;
        this.equip.setMaxNumber(value);
        this.equip.hook.pos.x -= offset;
        this.skills.setMaxNumber(value);
        this.skills.hook.pos.x -= offset;

        this.equipAdd.hook.pos.x += longNumber || this.usePercent ? 0 : 4;
        this.skillAdd.hook.pos.x += longNumber || this.usePercent ? 0 : 4;
    }
})

sc.TradeToggleStats.inject({
    _createContent() {
        this.parent();
        
        this.baseParams.hp.currentValueGui.setMaxNumber(99999);
        this.baseParams.atk.currentValueGui.setMaxNumber(9999);
        this.baseParams.def.currentValueGui.setMaxNumber(9999);
        this.baseParams.foc.currentValueGui.setMaxNumber(9999);

        Object.values(this.baseParams).forEach(param => {
            param.currentValueGui.hook.pos.x += 4
            param.percentCurrentGui && (param.percentCurrentGui.hook.pos.x -= 4);
            param.arrowGui.hook.pos.x -= 2;
        })
    }
})

sc.ItemStatusDefaultBar.inject({
    init(text, type, buff, width, barHeight, position) {
        this.parent(text, type, buff, width, barHeight, position);

        if(this.type == sc.MENU_BAR_TYPE.HP) {
            this.maxNumber.setMaxNumber(99999)
            this.maxNumber.hook.pos.x -= 4;
            this.currentNumber.setMaxNumber(99999)
        }
    }
})