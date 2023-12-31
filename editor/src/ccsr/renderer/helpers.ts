import * as PIXI from "pixi.js"
import { GameMapRenderData, GameObject, GameObjectRenderData } from "./types"

export function newGameObjectRenderData(gameObject: GameObject, texture: PIXI.Texture): GameObjectRenderData {
    const data: GameObjectRenderData = {
        hash: JSON.stringify(gameObject.data),
        sprite: new PIXI.TilingSprite(texture),
    }
    return data
}

export function newGameMapRenderData(name: string): GameMapRenderData {
    const data: GameMapRenderData = {
        border: new PIXI.Graphics(),
        container: new PIXI.Container(),
        grid: new PIXI.Graphics(),
    }
    data.container.cacheAsBitmap = true;
    return data
}
