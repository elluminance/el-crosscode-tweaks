sc.Control.inject({
    moveDir(b, d, f){
        // honestly... i'm surprised it was this simple.
        return this.parent(b, d, f) * (ig.input.state("walk") ? 0.5 : 1) 
    },

    autoThrown() {
        return (!this.autoControl && ig.input.state("autoThrow")) || this.parent();
    }
});

