ig.ENTITY.Player.inject({
    handleStateStart(playerState, inputState) {
        if (playerState.startState == 3 && !this.model.getAction(sc.PLAYER_ACTION.ATTACK)) this.attackCounter = 3
        this.parent(playerState, inputState)
    }
})
