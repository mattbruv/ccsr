import { useMapOMaticContext } from "./context/MapOMaticContext"
import { ActionIcon, ComboboxItem, Select, Switch } from "@mantine/core";
import { UUID } from "./ccsr/types";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { MapOMaticPage } from "./App";
import { produce } from "immer";
import { useEffect, useState } from "react";

function MapEditor() {
    const { project, updateMap, updateState, centerOnMap } = useMapOMaticContext();
    const navigate = useNavigate()

    const selectedMap = project.maps.find(x => x.random_id === project.state.selectedMap)

    const [showGrid, setShowGrid] = useState(selectedMap?.render.showMapGrid)

    function toggleGrid(val: boolean) {
        if (!selectedMap) return;
        setShowGrid(val)
        updateMap(produce(selectedMap, draft => {
            draft.render.showMapGrid = val
        }))
    }

    const mapSelections: ComboboxItem[] = project.maps.map(map => ({
        label: map.filename,
        value: map.random_id
    }))

    function removeObj(random_id: string): void {
        if (!selectedMap?.data?.objects) return;
        const updatedObjects = selectedMap.data.objects.filter(x => x.random_id !== random_id);
        updateMap({
            ...selectedMap,
            data: {
                ...selectedMap.data,
                objects: updatedObjects
            }
        });
    }

    function selectObject(random_id: UUID): void {
        updateState({
            ...project.state,
            selectedObject: random_id
        })
        navigate(MapOMaticPage.ObjectEditor)
    }

    function resetHighlights(): void {
        if (!selectedMap) return;
        updateMap(produce(selectedMap, draft => {
            draft.data?.objects.forEach(obj => {
                obj.render.alpha = 1
                obj.render.outline = false
            })
        }))
    }

    function highlightObject(random_id: UUID): void {
        if (!selectedMap) return;
        const nextMap = produce(selectedMap, (draft) => {
            const objects = draft.data?.objects ?? []
            const obj = objects.find(x => x.random_id === random_id)
            const notObj = objects.filter(x => x.random_id !== random_id)
            if (obj) {
                obj.render.alpha = 1
                obj.render.outline = true
            }
            notObj.forEach(x => {
                x.render.alpha = 0.5
                x.render.outline = false

            })
        })

        updateMap(nextMap)
    }

    return (
        <>
            <div>
                Map editor
                <Select
                    label="Map File"
                    placeholder="Pick a Map to edit"
                    data={mapSelections}
                    onChange={(_, option) => {
                        centerOnMap(option.value as UUID)
                        return updateState({
                            ...project.state,
                            selectedMap: option.value as UUID
                        });
                    }}
                />
                <Switch
                    label="Show Grid"
                    checked={showGrid}
                    onChange={e => toggleGrid(e.currentTarget.checked)}
                />
                {selectedMap?.filename}
                {selectedMap?.data?.objects.map((obj) => (
                    <div key={obj.random_id}
                        onMouseEnter={() => highlightObject(obj.random_id)}
                        onMouseLeave={() => resetHighlights()}
                    >
                        {obj.member}
                        <ActionIcon
                            color={"red"}
                            onClick={() => removeObj(obj.random_id)}>
                            <IconTrash />
                        </ActionIcon>
                        <ActionIcon
                            color={"green"}
                            onClick={() => selectObject(obj.random_id)}>
                            <IconPencil />
                        </ActionIcon>
                    </div>
                ))}
            </div>
        </>
    )
}

export default MapEditor