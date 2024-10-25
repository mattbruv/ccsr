import { Input } from "@mantine/core";
import { MapObject } from "./ccsr/game/types"
import { useMapOMaticContext } from "./context/MapOMaticContext"

function ObjectEditor() {

    const { project, updateMap } = useMapOMaticContext()

    const selectedObject = project.maps
        .flatMap(x => x.data?.objects ?? [])
        .find(o => o.random_id === project.state.selectedObject)

    function updateObject(object: MapObject): void {
        const map = project.maps.find(x => x.data?.objects.some(o => o.random_id === object.random_id))
        if (!map?.data?.objects) return;

        updateMap({
            ...map,
            data: {
                ...map.data,
                objects: map.data.objects.map(obj => obj.random_id === object.random_id ? object : obj)
            }
        })
    }

    function test(input: string) {
        if (!selectedObject?.location) return;

        const value = parseInt(input)

        if (!isNaN(value)) {
            updateObject({
                ...selectedObject,
                location: {
                    ...selectedObject.location,
                    x: value
                }
            })
        }
    }

    return (
        <>
            <div>Object Editor</div>
            <Input
                placeholder="X"
                value={selectedObject?.location.x}
                onChange={(e) => test(e.currentTarget.value)}
            />
        </>
    )
}

export default ObjectEditor