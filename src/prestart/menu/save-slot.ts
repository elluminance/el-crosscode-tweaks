sc.SaveSlotLocation.inject({
    setLocation(save) {
        if(typeof save.area == "object" && !(save.area.langUid)) {
            save.area.langUid = -1;
        }
        if(save.specialMap && typeof save.specialMap == "object" && !(save.specialMap.langUid)) {
            save.specialMap.langUid = -1;
        }

        this.parent(save)
    }
})
