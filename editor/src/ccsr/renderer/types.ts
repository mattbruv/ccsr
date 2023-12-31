import * as PIXI from "pixi.js"
import { MapObject, RecursivePartial } from "../game/types"

export type GameObjectRenderData = {
    id: number
    hash: string
    sprite: PIXI.TilingSprite
    renderSettings: GameObjectRenderSettings
}

export type GameMapRenderData = {
    container: PIXI.Container
    grid: PIXI.Graphics
    border: PIXI.Graphics
    renderSettings: MapRenderSettings
}


export type MapRenderSettings = {
    mapName: string
    renderBorder: boolean
    renderOutOfBounds: boolean
    renderGrid: boolean
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

export type GameObjectRenderSettings = {
    visible: boolean
    highlightBorder: boolean
}