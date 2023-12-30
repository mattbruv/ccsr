import { MapObject, RecursivePartial } from "./types"



export type GameObject = {
    /** A unique ID for this game object */
    id: number
    /** The map that this object belongs to */
    mapName: string
    /** PIXI related rendering settings for this object */
    renderSettings: RenderSettings
    /** The Lingo Data */
    data: RecursivePartial<MapObject>
}

export type RenderSettings = {
    visible: boolean
    highlightBorder: boolean
}