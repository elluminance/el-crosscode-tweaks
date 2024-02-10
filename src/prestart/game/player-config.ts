sc.PlayerConfig.inject({
    onload(data){
        this.parent(data);
        //needed for cmd.reloadPlayerConfigs()
        if(this.name === sc.model?.player.config.name) {
            sc.model.player.setConfig(this);
        }

        // this is so there's no issues with not having the proper head
        // if extendable-severed-heads is not installed. 
        if(this.name == "Sergey" && window.semver.satisfies(window.versions["extendable-severed-heads"], ">=1.1.0")) {
            //@ts-expect-error
            this.headIdx = "sergey-av";
        }
    }
})