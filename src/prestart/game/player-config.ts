sc.PlayerConfig.inject({
    onload(data){
        this.parent(data);
        //needed for cmd.reloadPlayerConfigs()
        if(this.name === sc.model?.player.config.name) {
            sc.model.player.setConfig(this);
        }
    }
})