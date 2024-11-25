import { createContext, useContext } from "react";
import { MapFile, Project, ProjectState, UUID } from "../ccsr/types";

export const MapOMaticContext = createContext<MapOMatic | undefined>(undefined);

export type MapOMatic = {
    project: Project
    rerenderProject: () => void,
    updateProject: (newProject: Project, reloadImages?: boolean, rerender?: boolean) => void,
    updateMap: (newMap: MapFile, rerender?: boolean) => void,
    centerOnMap: (map_id: UUID) => void,
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
            selectedObject: null,
            exportAsJSON: false,
            exportPretty: false
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


