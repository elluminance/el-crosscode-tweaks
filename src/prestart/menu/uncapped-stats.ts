if(!versions["cc-uncapped-stats"]) {

function getDigits(value: number): number {
    return Math.floor(Math.log10(Math.abs(value))) + 1;
}

sc.ParamHudGui.inject({
    targetSizes: {
        hp: 62,
        atk: 54,
        def: 54,
        foc: 54,

        skip: true
    },
    updateTimer: 0.1,

    init() {
        this.parent();

        sc.Model.addObserver(sc.model.player.params, this);
        sc.Model.addObserver(sc.options, this);
        this.updateParamHud()
    },

    updateParamHud(skip) {
        const additional_digits = sc.options.get("el-uncapped-stats-enable") ? sc.options.get("el-uncapped-stats-extra-digits") || 1 : 0;
        const digit_factor = 10 ** additional_digits;
        
        this.hp._number.setMaxNumber(10000 * digit_factor - 1);
        this.atk._number.setMaxNumber(1000 * digit_factor - 1);
        this.def._number.setMaxNumber(1000 * digit_factor - 1);
        this.foc._number.setMaxNumber(1000 * digit_factor - 1);

        let digits = 0;
        digits = getDigits(sc.model.player.params.getStat("hp")) - 4;
        this.targetSizes.hp = 62 + 8 * digits.limit(0, additional_digits);
        
        digits = getDigits(sc.model.player.params.getStat("attack")) - 3;
        this.targetSizes.atk = 54 + 8 * digits.limit(0, additional_digits);
        
        digits = getDigits(sc.model.player.params.getStat("defense")) - 3;
        this.targetSizes.def = 54 + 8 * digits.limit(0, additional_digits);
        
        digits = getDigits(sc.model.player.params.getStat("focus")) - 3;
        this.targetSizes.foc = 54 + 8 * digits.limit(0, additional_digits);

        if(skip) {
            this.hp.hook.size.x = this.targetSizes.hp;
            this.atk.hook.size.x = this.targetSizes.atk;
            this.def.hook.size.x = this.targetSizes.def;
            this.foc.hook.size.x = this.targetSizes.foc;

            this.hp._setNumber(true);
            this.atk._setNumber(true);
            this.def._setNumber(true);
            this.foc._setNumber(true);
        }
    },

    update() {
        this.parent();
        this.updateTimer -= ig.system.tick;
        if(this.updateTimer <= 0) {
            this.updateTimer = 0.01;

            let xOffset = this.hp.hook.pos.x;
            if(this.hp.hook.size.x !== this.targetSizes.hp) {
                this.hp.hook.size.x = this.hp.hook.size.x + ((2).limit(0, Math.abs(this.hp.hook.size.x - this.targetSizes.hp)) * (this.hp.hook.size.x < this.targetSizes.hp ? 1 : -1))
            }
            xOffset += this.hp.hook.size.x - 14;

            this.atk.hook.pos.x = xOffset;
            if(this.atk.hook.size.x !== this.targetSizes.atk) {
                this.atk.hook.size.x = this.atk.hook.size.x + ((2).limit(0, Math.abs(this.atk.hook.size.x - this.targetSizes.atk)) * (this.atk.hook.size.x < this.targetSizes.atk ? 1 : -1))
            }
            xOffset += this.atk.hook.size.x - 14;

            this.def.hook.pos.x = xOffset;
            if(this.def.hook.size.x !== this.targetSizes.def) {
                this.def.hook.size.x = this.def.hook.size.x + ((2).limit(0, Math.abs(this.def.hook.size.x - this.targetSizes.def)) * (this.def.hook.size.x < this.targetSizes.def ? 1 : -1))
            }
            xOffset += this.def.hook.size.x - 14;

            this.foc.hook.pos.x = xOffset;
            if(this.foc.hook.size.x !== this.targetSizes.foc) {
                this.foc.hook.size.x = this.foc.hook.size.x + ((2).limit(0, Math.abs(this.foc.hook.size.x - this.targetSizes.foc)) * (this.foc.hook.size.x < this.targetSizes.foc ? 1 : -1))
            }
            xOffset += this.foc.hook.size.x - 14;
        }
    },

    modelChanged(model, message) {
        if(model === sc.model.player.params && message === sc.COMBAT_PARAM_MSG.STATS_CHANGED) {
            this.updateParamHud()
        } else if(model === sc.options && message === sc.OPTIONS_EVENT.OPTION_CHANGED) {
            this.updateParamHud(true);
        }
    }
})

sc.HpHudGui.inject({
    uncappedHpBar: new ig.Image("media/gui/el/el-tweaks-gui.png"),

    init(b) {
        this.parent(b);
        if(sc.options.get("el-uncapped-stats-enable")) {
            this.hpNumber.setMaxNumber(99999);
        }
        this.hpNumber.setPos(7, 1)
    },
    updateDrawables(b) {
        b.addGfx(this.uncappedHpBar, 0, 0, 40, 56, this.hook.size.x, this.hook.size.y)
    }
})

sc.EquipStatusContainer.inject({
    init() {
        this.parent();
        if(sc.options.get("el-uncapped-stats-enable")) {
            this.baseParams.hp.currentValueGui.setMaxNumber(99999);
            this.baseParams.hp.currentValueGui.hook.pos.x -= 4;
            this.baseParams.hp.arrowGui.hook.pos.x -= 2;
            
            this.baseParams.atk.currentValueGui.setMaxNumber(99999);
            this.baseParams.atk.currentValueGui.hook.pos.x -= 4;
            this.baseParams.atk.arrowGui.hook.pos.x -= 2;
    
            this.baseParams.def.currentValueGui.setMaxNumber(99999);
            this.baseParams.def.currentValueGui.hook.pos.x -= 4;
            this.baseParams.def.arrowGui.hook.pos.x -= 2;
    
            this.baseParams.foc.currentValueGui.setMaxNumber(99999);
            this.baseParams.foc.currentValueGui.hook.pos.x -= 4;
            this.baseParams.foc.arrowGui.hook.pos.x -= 2;
        }
    }
})

sc.StatusViewMainParameters.inject({
    init() {
        this.parent();
        if(sc.options.get("el-uncapped-stats-enable")) {
            this.baseParams.hp.changeValueGui.setMaxNumber(99999);
            this.baseParams.atk.changeValueGui.setMaxNumber(9999);
            this.baseParams.def.changeValueGui.setMaxNumber(9999);
            this.baseParams.foc.changeValueGui.setMaxNumber(9999);
        }
    }
})

sc.StatusParamBar.inject({
    init(name, description, size, lineID, iconID, usePercent,  skillHidden, noPercent, longNumber) {
        this.parent(name, description, size, lineID, iconID, usePercent,  skillHidden, noPercent, longNumber);

        if(sc.options.get("el-uncapped-stats-enable")) {
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
    }
})

sc.TradeToggleStats.inject({
    _createContent() {
        this.parent();
        if(sc.options.get("el-uncapped-stats-enable")) {
            this.baseParams.hp.currentValueGui.setMaxNumber(99999);
            this.baseParams.hp.currentValueGui.hook.pos.x += 4
            this.baseParams.hp.arrowGui.hook.pos.x -= 2;
            
            this.baseParams.atk.currentValueGui.setMaxNumber(9999);
            this.baseParams.atk.currentValueGui.hook.pos.x += 4
            this.baseParams.atk.arrowGui.hook.pos.x -= 2;
    
            this.baseParams.def.currentValueGui.setMaxNumber(9999);
            this.baseParams.def.currentValueGui.hook.pos.x += 4
            this.baseParams.def.arrowGui.hook.pos.x -= 2;
    
            this.baseParams.foc.currentValueGui.setMaxNumber(9999);
            this.baseParams.foc.currentValueGui.hook.pos.x += 4
            this.baseParams.foc.arrowGui.hook.pos.x -= 2;
        }
    }
})

sc.ItemStatusDefaultBar.inject({
    init(text, type, buff, width, barHeight, position) {
        this.parent(text, type, buff, width, barHeight, position);

        if(this.type === sc.MENU_BAR_TYPE.HP && sc.options.get("el-uncapped-stats-enable")) {
            this.maxNumber.setMaxNumber(99999)
            this.maxNumber.hook.pos.x -= 4;
            this.currentNumber.setMaxNumber(99999)
        }
    }
})
} else {
    console.error("EL's Tweaks provides all functionality of Uncapped Stats. Please uninstall Uncapped Stats.")
}