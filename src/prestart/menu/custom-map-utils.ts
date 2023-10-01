sc.AreaLoadable.inject({
    onload(data: sc.AreaLoadable.Data) {
        const min: Vec2 = Vec2.createC(0, 0)
        const os: Vec2 = Vec2.createC(data.width, data.height)
        const max: Vec2 = Vec2.create(os)

        /* cc-shaduungeon crashes without the filtering :) */
        const floors: sc.AreaLoadable.Floor[] = data.floors.filter(f => f.tiles.length > 0 && f.tiles[0].length > 0)
        for (let floor of floors) {
            for (const map of floor.maps) {
                if (map.customMap) {
                    const c: sc.AreaLoadable.CustomMap = map.customMap
                    min.x = Math.min(min.x, c.offX)
                    min.y = Math.min(min.y, c.offY)
                    max.x = Math.max(max.x, c.offX + c.mapData[0].length)
                    max.y = Math.max(max.y, c.offY + c.mapData.length)
                }
            }
        }
        
        if (! (Vec2.isZero(min) && Vec2.equal(max, os))) { /* check if resizing is needed */
            const newSize: Vec2 = Vec2.create(max)
            Vec2.sub(newSize, min) /* min has to be negative here */

            /* change area size */
            data.width = Math.max(data.width, newSize.x)
            data.height = Math.max(data.height, newSize.y)

            const minE: Vec2 = Vec2.create(min)
            Vec2.mulC(minE, 8)

            /* resize all floors */
            for (let floor of floors) {
                const arr: number[][] = new Array(newSize.y)
                for(let y = 0; y < newSize.y; y++) { /* create an empty array */
                    arr[y] = new Array(newSize.x).fill(0)
                }

                /* paste original with offset */
                for (let y = -min.y; y < os.y + -min.y; y++) {
                    for (let x = -min.x; x < os.x + -min.x; x++) {
                        arr[y][x] = floor.tiles[y + min.y][x + min.x]
                    }
                }
                floor.tiles = arr
                /* offset other stuff */
                for (const map of floor.maps) {
                    if (map.customMap) {
                        map.customMap.offX -= min.x
                        map.customMap.offY -= min.y
                    }
                }
                for (const conn of floor.connections) { conn.tx -= min.x; conn.ty -= min.y; }
                for (const icon of floor.icons) { icon.x -= minE.x; icon.y -= minE.y; }
                for (const landmark of floor.landmarks) { landmark.x -= minE.x; landmark.y -= minE.y; }
            }
        }

        for (let floor of floors) {
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
