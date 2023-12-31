import * as PIXI from "pixi.js"
import { GameMapRenderData, GameObject, GameObjectRenderData } from "./types"

const MAP_WIDTH_PIXELS = 32 * 13;
const MAP_HEIGHT_PIXELS = 32 * 10;


export function newGameObjectRenderData(gameObject: GameObject, texture: PIXI.Texture): GameObjectRenderData {
    const data: GameObjectRenderData = {
        hash: JSON.stringify(gameObject.data),
        sprite: new PIXI.TilingSprite(texture),
    }
    return data
}

export function newGameMapRenderData(name: string): GameMapRenderData {
    const data: GameMapRenderData = {
        mask: new PIXI.Graphics(),
        border: new PIXI.Graphics(),
        mapContainer: new PIXI.Container(),
        objectContainer: new PIXI.Container(),
        grid: new PIXI.Graphics(),
    }
    data.mapContainer.cacheAsBitmap = true;

    // Draw mask object
    data.mask.beginFill(0xffffff)
    data.mask.drawRect(0, 0, MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS)
    data.mask.endFill()

    // Draw the border graphic
    data.border.lineStyle(2, 0xff00ff, 1);
    data.border.drawRect(0, 0, MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS)

    // Add the container for our game objects
    data.mapContainer.addChild(data.objectContainer)
    data.mapContainer.addChild(data.border)

    // The mask must be a child in the subtree of its parent to work
    data.mapContainer.addChild(data.mask)


    return data
}

export function getTextureName(texture: string): string {
    let name = texture.toLowerCase()
    if (name.startsWith("tile"))
        name = name.replace(".x", "")
    return name
}

export function getMapLocation(name: string): { x: number, y: number } {
    if (name.length == 4) {
        const X = parseInt(name.slice(0, 2))
        const Y = parseInt(name.slice(2, 4))
        const x = X * MAP_WIDTH_PIXELS
        const y = Y * MAP_HEIGHT_PIXELS
        return { x, y }
    }
    return { x: 0, y: 0 }
}