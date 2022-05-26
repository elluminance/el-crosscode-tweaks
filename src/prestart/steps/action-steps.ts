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