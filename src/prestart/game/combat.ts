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