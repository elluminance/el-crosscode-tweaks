sc.AreaLoadable.inject({
    onload(data) {
        for (let floor of data.floors) {
            let mapIdLookup: Record<string, number> = {};
            for (let i = 0; i < floor.maps.length; i++) {
                let map = floor.maps[i];
                if (map.customMap) {
                    let customMap = map.customMap;
                    let mapData = customMap.mapData;
                    if(mapData) {
                        for (let y = 0; y < mapData.length; y++) {
                            let row = mapData[y];
                            let mapIndexY = customMap.offY + y;

                            for (let x = 0; x < row.length; x++) {
                                if (row[x] == 1) {
                                    floor.tiles[mapIndexY][customMap.offX + x] = i + 1;
                                }
                            }
                        }
                    }

                    if(customMap.customName) mapIdLookup[customMap.customName] = i;
                }
            }

            if(Object.keys(mapIdLookup).length > 0) {
                for(let connection of floor.connections) {
                    if(typeof connection.map1 == "string" && connection.map1 in mapIdLookup) {
                        connection.map1 = mapIdLookup[connection.map1];
                    }
                    if(typeof connection.map2 == "string" && connection.map2 in mapIdLookup) {
                        connection.map2 = mapIdLookup[connection.map2];
                    }
                }

                for(let landmark of floor.landmarks) {
                    if(typeof landmark.map == "string" && landmark.map in mapIdLookup) {
                        landmark.map = mapIdLookup[landmark.map];
                    }
                }

                for(let icon of floor.icons) {
                    if(typeof icon.map == "string" && icon.map in mapIdLookup) {
                        icon.map = mapIdLookup[icon.map];
                    }
                }
            }
        }
        this.parent(data);
    }
})
