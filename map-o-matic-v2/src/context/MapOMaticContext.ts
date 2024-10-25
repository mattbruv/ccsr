import { createContext, useContext } from "react";
import { MapFile, Project, ProjectState } from "../ccsr/types";
import { CCSRRenderer } from "../ccsr/renderer";
import { MapObject } from "../ccsr/game/types";

export const MapOMaticContext = createContext<MapOMatic | undefined>(undefined);

export type MapOMatic = {
    project: Project
    renderer: CCSRRenderer
    updateProject: (newProject: Project, reloadImages?: boolean) => void,
    updateMap: (newMap: MapFile) => void,
    updateState: (newState: ProjectState) => void,
}

export function newProject(): Project {
    const project: Project = {
        metadata: {
            name: "New Project",
            author: "Anonymous",
        },
        maps: [],
        images: [],
        state: {
            selectedMap: null,
            selectedObject: null
        }
    }
    return project
}

export function useMapOMaticContext(): MapOMatic {
    const mapOMatic = useContext(MapOMaticContext)
    if (mapOMatic === undefined) {
        throw new Error("MapOMaticContext not provided in useMapOMaticContext")
    }
    return mapOMatic
}


