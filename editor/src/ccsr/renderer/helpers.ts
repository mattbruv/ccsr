import * as PIXI from "pixi.js"
import { GameMapRenderData, GameObject, GameObjectRenderData } from "./types"

export function newGameObjectRenderData(gameObject: GameObject, texture: PIXI.Texture): GameObjectRenderData {
    const data: GameObjectRenderData = {
        hash: JSON.stringify(gameObject.data),
        id: gameObject.id,
        sprite: new PIXI.TilingSprite(texture),
        renderSettings: gameObject.renderSettings
    }
    return data
}

export function newGameMapRenderData(name: string): GameMapRenderData {
    const data: GameMapRenderData = {
        border: new PIXI.Graphics(),
        container: new PIXI.Container(),
        grid: new PIXI.Graphics(),
        renderSettings: {
            mapName: name,
            renderBorder: true,
            renderGrid: true,
            renderOutOfBounds: false,
        }
    }
    data.container.cacheAsBitmap = true;
    return data
}
