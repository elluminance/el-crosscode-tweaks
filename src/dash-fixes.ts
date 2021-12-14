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
        iframes = iframes / 60 * this.factor;
        iframes *= sc.options.get("assist-timing-window") as number
        
        target.isPlayer || (iframes = iframes + 0.2);
        target.invincibleTimer = iframes;
        return true
    }
})

ig.ENTITY.Player.inject({
    onPerfectDash(){
        if(!this.dashPerfect && sc.options.get("el-dash-effect")){
            sc.combat.showPerfectDashEffect(this)
            this.dashPerfect = true;
        }
        this.parent()
    }
})

sc.Combat.inject({
    showPerfectDashEffect(a){
        if(!sc.newgame.get("witch-time")){
            var b = ig.getRoundedFaceDir(a.face.x, a.face.y, 8, Vec2.create());
            this.effects.guard.spawnOnTarget("perfectDash2", a, {
                align: "CENTER",
                angle: Vec2.clockangle(b)
            }).setIgnoreSlowdown();
        } else this.parent(a)
    }
})