import * as PIXI from "pixi.js"
import { MapObject, RecursivePartial } from "../game/types"

/**
 * Information used by the renderer for a game object.
 * Should only include PIXI related sprites
 * and a hash to know when it needs to re-render itself
 */
export type GameObjectRenderData = {
    hash: string
    sprite: PIXI.TilingSprite
}

/**
 * Information used by the renderer for a game map. 
 * Should only include PIXI related sprites
 */
export type GameMapRenderData = {
    mapContainer: PIXI.Container
    objectContainer: PIXI.Container
    mask: PIXI.Graphics
    grid: PIXI.Graphics
    border: PIXI.Graphics
}


export type GameMapRenderSettings = {
    mapName: string
    renderBorder: boolean
    renderOutOfBounds: boolean
    renderGrid: boolean
}

export type GameObjectRenderSettings = {
    visible: boolean
    highlightBorder: boolean
}

export type GameMap = {
    name: string
    renderSettings: GameMapRenderSettings
}

export type GameObject = {
    /** A unique ID for this game object */
    id: number
    /** The map that this object belongs to */
    mapName: string
    /** PIXI related rendering settings for this object */
    renderSettings: GameObjectRenderSettings
    /** The Lingo Data */
    data: RecursivePartial<MapObject>
}
