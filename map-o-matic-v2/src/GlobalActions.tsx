import { Checkbox, Group, Stack } from "@mantine/core"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { ChangeEvent } from "react"
import { produce } from "immer"

function GlobalActions() {

    const { project, updateProject } = useMapOMaticContext()

    const totalMaps = project.maps.length
    const mapBorderCount = project.maps.filter(x => x.render.showMapBorder === true).length
    const mapGridCount = project.maps.filter(x => x.render.showMapGrid === true).length
    const mapCollisionCount = project.maps.filter(x => x.render.showCollision === true).length

    function toggleGrids(event: ChangeEvent<HTMLInputElement>): void {
        updateProject(produce(project, draft => {
            draft.maps.forEach(x => x.render.showMapGrid = event.target.checked)
        }))
    }

    function toggleBorders(event: ChangeEvent<HTMLInputElement>): void {
        updateProject(produce(project, draft => {
            draft.maps.forEach(x => x.render.showMapBorder = event.target.checked)
        }))
    }

    function toggleCollisions(event: ChangeEvent<HTMLInputElement>): void {
        updateProject(produce(project, draft => {
            draft.maps.forEach(x => x.render.showCollision = event.target.checked)
        }))
    }

    return (<>
        <div>
            <Stack gap={"xs"}>
                <Checkbox
                    onChange={toggleGrids}
                    checked={mapGridCount === totalMaps}
                    indeterminate={mapGridCount > 0 && mapGridCount < totalMaps}
                    label="Show Grids"
                />
                <Checkbox
                    onChange={toggleBorders}
                    checked={mapBorderCount === totalMaps}
                    indeterminate={mapBorderCount > 0 && mapBorderCount < totalMaps}
                    label="Show Borders"
                />
                <Checkbox
                    onChange={toggleCollisions}
                    checked={mapCollisionCount === totalMaps}
                    indeterminate={mapCollisionCount > 0 && mapCollisionCount < totalMaps}
                    label="Show Collisions"
                />
            </Stack>
        </div>
    </>)
}

export default GlobalActions