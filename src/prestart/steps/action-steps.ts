ig.ACTION_STEP.SET_PLAYER_INVINCIBLE.inject({
    run(target) {
        var iframes: number = (3 + target.params.getStat("focus") / 250);
        // eh, who knows. maybe some people like having useless modifiers. :leaCheese:
        if(sc.options.get("el-flash-step-fix")){
            iframes *= (1 + target.params.getModifier("DASH_INVINC"))
        }else{
            iframes += target.params.getModifier("DASH_INVINC")
        }
        target.stunEscapeDash && (iframes = iframes + 12);
        iframes = (iframes / 60) * this.factor;
        iframes *= sc.options.get("assist-timing-window") as number
        
        target.isPlayer || (iframes = iframes + 0.2);
        target.invincibleTimer = iframes;
        return true
    }
})

ig.ACTION_STEP.EL_ELEMENT_IF = ig.ActionStepBase.extend({
    branches: {},
    init() { },
    getBranchNames() {
        return ["neutral", "heat", "cold", "shock", "wave"]
    },
    getNext(entity) {
        switch (sc.combat.getElementMode(entity)) {
            case sc.ELEMENT.NEUTRAL:
                return this.branches.neutral
            case sc.ELEMENT.HEAT:
                return this.branches.heat
            case sc.ELEMENT.COLD:
                return this.branches.cold
            case sc.ELEMENT.SHOCK:
                return this.branches.shock
            case sc.ELEMENT.WAVE:
                return this.branches.wave
        }
    }
})

ig.ACTION_STEP.GOTO_LABEL_WHILE = ig.ActionStepBase.extend({
    name: "",
    condition: null,

    init(settings) {
        this.name = settings.name;
        this.condition = new ig.VarCondition(settings.condition);
    },

    getJumpLabelName() {
        return this.condition.evaluate() ? this.name : null;
    }
})

ig.ACTION_STEP.SET_TEMP_TARGET.inject({
    init(settings) {
        this.parent(settings);
        //@ts-expect-error
        if (settings.kind == "LAST_HIT") {
            this.kind = function (combatant) {
                return combatant.combo.hitCombatants.last();
            }
        }
    }
})

ig.ACTION_STEP.EL_SET_TARGET = ig.ActionStepBase.extend({
    init: function (a) {
        this.name = a.name
    },
    start: function (target) {
        target.setTarget(ig.game.getEntityByName(this.name) || null)
    }
})

ig.ACTION_STEP.SET_ATTRIB_CURRENT_POS = ig.ActionStepBase.extend({
    init(settings) {
        this.attrib = settings.attrib
    },

    start(entity) {
        entity && entity.setAttribute(this.attrib, entity.getAlignedPos(ig.ENTITY_ALIGN.BOTTOM))
    }
})

ig.ACTION_STEP.SET_CLOSE_TEMP_TARGET.inject({
    init(settings) {
        this.parent(settings);

        if(settings.searchType == "CUSTOM" && settings.customSearchType) {
            this.searchType = settings.customSearchType;
        }
    }
})