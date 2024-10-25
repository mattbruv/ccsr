import { useMapOMaticContext } from "./context/MapOMaticContext"
import { ActionIcon, ComboboxItem, Select } from "@mantine/core";
import { UUID } from "./ccsr/types";
import { IconSelect, IconTrash } from "@tabler/icons-react";

function MapEditor() {
    const { project, updateMap, updateState } = useMapOMaticContext();
    const mapSelections: ComboboxItem[] = project.maps.map(map => ({
        label: map.filename,
        value: map.random_id
    }))

    const selectedMap = project.maps.find(x => x.random_id === project.state.selectedMap)

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
    }

    return (
        <>
            <div>
                Map editor
                <Select
                    label="Map File"
                    placeholder="Pick a Map to edit"
                    data={mapSelections}
                    onChange={(_, option) => updateState({
                        ...project.state,
                        selectedMap: option.value as UUID
                    })}
                />
                {selectedMap?.filename}
                {selectedMap?.data?.objects.map((obj) => (
                    <div key={obj.random_id}>
                        {obj.member}
                        <ActionIcon
                            color={"red"}
                            onClick={() => removeObj(obj.random_id)}>
                            <IconTrash />
                        </ActionIcon>
                        <ActionIcon
                            color={"yellow"}
                            onClick={() => selectObject(obj.random_id)}>
                            <IconSelect />
                        </ActionIcon>
                    </div>
                ))}

            </div>
        </>
    )
}

export default MapEditor