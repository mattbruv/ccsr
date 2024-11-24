import { useMapOMaticContext } from "./context/MapOMaticContext"
import { ActionIcon, Card, Code, ComboboxItem, Group, NumberInput, Select, Slider, Stack, Switch, Tabs, Text, TextInput, Tooltip } from "@mantine/core";
import { MapFile, UUID } from "./ccsr/types";
import { IconApple, IconMapPlus, IconPhone, IconPlus, IconTool, IconTrashX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { newMapFile, newMapObject } from "./ccsr/helpers";
import { MapObjectType } from "./ccsr/game/types";
import GlobalActions from "./GlobalActions";
import { modals } from "@mantine/modals";
import MapDataExporter from "./MapData";
import { MapObjectListItem } from "./MapObjectListItem";

type MapEditorProps = {
    map: MapFile
}

function MapSelector() {
    const { project, updateState, centerOnMap, updateProject } = useMapOMaticContext();
    const selectedMap = project.maps.find(x => x.random_id === project.state.selectedMap)

    function addMap(): void {
        const map = newMapFile()
        map.filename = "0000"
        updateProject(produce(project, draft => {
            draft.maps.push(map)
        }))
    }

    function copyMap(mapToCopy?: MapFile): void {
        if (!mapToCopy) return;

        const newMap = produce(mapToCopy, draft => {
            draft.filename += " COPY"
            // Update the random IDs that are used.
            draft.random_id = crypto.randomUUID()
            draft.data.objects.forEach(x => x.random_id = crypto.randomUUID())
        })

        updateProject(produce(project, draft => {
            draft.state.selectedMap = newMap.random_id
            draft.maps.push(newMap)
        }))
    }

    const mapSelections: ComboboxItem[] = project.maps.map(map => ({
        label: map.filename,
        value: map.random_id
    }))

    const mapSelectValue = mapSelections.find(x => x.value === selectedMap?.random_id)?.value

    return (
        <Stack gap={"xs"}>
            <Card withBorder>
                <Group>
                    <Stack>
                        <Tooltip label="Create New Map">
                            <ActionIcon
                                color={"green"}
                                onClick={addMap}>
                                <IconMapPlus />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Copy Map">
                            <ActionIcon
                                disabled={!selectedMap}
                                color={"grape"}
                                onClick={() => copyMap(selectedMap)}>
                                <IconMapPlus />
                            </ActionIcon>
                        </Tooltip>
                    </Stack>
                    <Select
                        label={"Maps (" + project.maps.length + ")"}
                        placeholder="Pick a Map to edit"
                        value={mapSelectValue}
                        data={mapSelections}
                        onChange={(_, option) => {
                            centerOnMap(option.value as UUID)
                            return updateState({
                                ...project.state,
                                selectedMap: option.value as UUID,
                                selectedObject: null
                            });
                        }}
                    />
                    <GlobalActions />
                </Group>
            </Card>
            {selectedMap ? <MapEditor map={selectedMap} /> : null}
        </Stack>
    )
}

function MapEditor({ map }: MapEditorProps) {
    const { project, updateMap, updateState, updateProject } = useMapOMaticContext();
    const navigate = useNavigate()

    const [showGrid, setShowGrid] = useState(map.render.showMapGrid)
    const [showMap, setShowMap] = useState(map.render.showMap)
    const [showCollision, setShowCollision] = useState(map.render.showCollision)
    const [collisionAlpha, setCollisionAlpha] = useState(map.render.collisionAlpha * 100);

    useEffect(() => {
        setShowGrid(map.render.showMapGrid);
        setShowMap(map.render.showMap);
        setShowCollision(map.render.showCollision);
        setCollisionAlpha(map.render.collisionAlpha * 100);
    }, [map]);


    function updateCollisionAlpha(newValue: number) {
        const alpha = newValue / 100
        updateMap(produce(map, draft => {
            draft.render.collisionAlpha = alpha
        }))
        setCollisionAlpha(newValue)
    }

    function toggleMap(val: boolean) {
        setShowMap(val)
        updateMap(produce(map, draft => {
            draft.render.showMap = val
        }))
    }

    function toggleGrid(val: boolean) {
        setShowGrid(val)
        updateMap(produce(map, draft => {
            draft.render.showMapGrid = val
        }))
    }

    function toggleCollision(val: boolean) {
        setShowCollision(val)
        updateMap(produce(map, draft => {
            draft.render.showCollision = val
        }))
    }

    function moveObj(index: number, up: boolean): void {
        const newIndex = index + (up ? -1 : 1)
        updateMap(produce(map, draft => {
            const objs = draft.data.objects ?? []
            const orig = objs[newIndex]
            objs[newIndex] = objs[index]
            objs[index] = orig
        }))
    }


    function addObj(): void {
        updateMap(produce(map, draft => {
            const obj = newMapObject()
            obj.member = "tile.undefined.x"
            obj.width = 32
            obj.height = 32
            obj.location.x = 0
            obj.location.y = 0
            draft.data.objects.push(obj)
        }))
    }

    // Attempts to automatically fix collision by moving
    // all floor objects to the bottom
    function fixCollision(): void {
        const fixFunction = () => {
            const waters = map.data.objects.filter(x => x.data.item.type === MapObjectType.WATER) ?? []
            const floors = map.data.objects.filter(x => x.data.item.type === MapObjectType.FLOR) ?? []
            const nonFloors = map.data.objects.filter(
                x => x.data.item.type !== MapObjectType.FLOR &&
                    x.data.item.type !== MapObjectType.WATER
            ) ?? []
            updateMap(produce(map, draft => {
                if (draft.data) {
                    draft.data.objects = [...waters, ...floors, ...nonFloors]
                }
            }))
        }

        modals.openConfirmModal({
            title: "Auto-Fix Collision?",
            children: (
                <Text>
                    This tool attempts to fix collision issues automatically
                    by moving all <Code>#FLOR</Code> objects under <Code>#WALL</Code> objects.
                </Text>
            ),
            labels: { cancel: "Cancel", confirm: "Confirm" },
            onConfirm: fixFunction
        })
    }

    function deleteMap(map: MapFile) {
        modals.openConfirmModal({
            title: "Confirm Map Deletion",
            children: (
                <>
                    <div>
                        Are you sure you want to delete map <Code>{map.filename}</Code>?
                    </div>
                    <div>
                        {map.data.objects.length.toString() ?? "0"} Objects will be deleted.
                    </div>
                </>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            onConfirm: () => {
                updateProject(produce(project, draft => {
                    draft.state.selectedMap = null
                    draft.maps = draft.maps.filter(x => x.random_id !== map.random_id)
                }))
            }
        })
    }


    function updateMapName(name: string): void {
        const updatedMap = produce(map, draft => {
            draft.filename = name
        })
        // sort maps by their name, we don't need to rerender
        updateProject(produce(project, draft => {
            draft.maps = draft.maps
                .map(x => x.random_id === updatedMap.random_id ? updatedMap : x)
                .sort((a, b) => a.filename.localeCompare(b.filename))
        }), false, true)
    }

    function updateMapRoomId(id: string): void {
        updateMap(produce(map, draft => {
            draft.data.metadata.roomid = id
        }), false)
    }

    function updateMapRoomStatus(status: number): void {
        updateMap(produce(map, draft => {
            draft.data.metadata.roomStatus = status
        }), false)
    }

    return (
        <>
            <div>
                <Card withBorder>
                    <Group grow>
                        <Switch
                            label="Show Map"
                            checked={showMap}
                            onChange={e => toggleMap(e.currentTarget.checked)}
                        />
                        <Switch
                            label="Show Grid"
                            checked={showGrid}
                            onChange={e => toggleGrid(e.currentTarget.checked)}
                        />
                        <Switch
                            label="Show Collision"
                            checked={showCollision}
                            onChange={e => toggleCollision(e.currentTarget.checked)}
                        />
                        <Slider label={"Collision Opacity: " + collisionAlpha} disabled={!showCollision} value={collisionAlpha} onChange={updateCollisionAlpha} />
                    </Group>
                    <Group>
                        <TextInput
                            label="Map Name"
                            value={map.filename}
                            onChange={(e) => updateMapName(e.target.value)}
                        />
                        <TextInput
                            label="Room ID"
                            value={map.data.metadata.roomid}
                            onChange={(e) => updateMapRoomId(e.target.value)}
                        />
                        <NumberInput
                            label="Room Status"
                            value={map.data.metadata.roomStatus}
                            onChange={(e) => updateMapRoomStatus(Number(e))}
                        />
                        <Group>
                            <Tooltip label="Auto-Fix Collision">
                                <ActionIcon
                                    color={"orange"}
                                    onClick={fixCollision}>
                                    <IconTool />
                                </ActionIcon>
                            </Tooltip>
                            <MapDataExporter map={map} />
                            <Tooltip label="Delete Map">
                                <ActionIcon
                                    color={"red"}
                                    onClick={() => deleteMap(map)}>
                                    <IconTrashX />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </Card>
                <Card withBorder shadow={'xs'}>
                    <Tabs defaultValue={"objects"}>
                        <Tabs.List>
                            <Tabs.Tab value="objects" leftSection={<IconApple />}>
                                Objects ({map.data.objects.length})
                            </Tabs.Tab>
                            <Tabs.Tab value="trash" leftSection={<IconTrashX />}>
                                Trash
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="objects">
                            <div>
                                <Tooltip label="Add New Object">
                                    <ActionIcon
                                        color={"green"}
                                        disabled={!map}
                                        onClick={addObj}>
                                        <IconPlus />
                                    </ActionIcon>
                                </Tooltip>
                                {map.data.objects.map((obj, index) => (
                                    <MapObjectListItem key={obj.random_id} map={map} obj={obj} index={index} />
                                ))}
                            </div>
                        </Tabs.Panel>
                        <Tabs.Panel value="trash">
                            <div>Hi mom</div>
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </div>
        </>
    )
}

export default MapSelector