import { useMapOMaticContext } from "./context/MapOMaticContext"
import { ActionIcon, Button, Card, Code, ComboboxItem, Group, HoverCard, Image, Indicator, NumberInput, Popover, Select, Slider, Stack, Switch, Text, TextInput, Tooltip } from "@mantine/core";
import { MapFile, UUID } from "./ccsr/types";
import { IconArrowDown, IconArrowMergeAltRight, IconArrowUp, IconCodeDots, IconCopyPlus, IconGhost, IconMapPlus, IconMessage, IconPencil, IconPlus, IconTextCaption, IconTool, IconTrash, IconTrashX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { MapOMaticPage } from "./App";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { newMapFile, newMapObject } from "./ccsr/helpers";
import { MapObjectType } from "./ccsr/game/types";
import GlobalActions from "./GlobalActions";
import { modals } from "@mantine/modals";
import MapDataExporter from "./MapData";

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


    function removeObj(random_id: string): void {
        const updatedObjects = map.data.objects.filter(x => x.random_id !== random_id);
        updateMap({
            ...map,
            data: {
                ...map.data,
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
        updateMap(produce(map, draft => {
            draft.data.objects.forEach(obj => {
                obj.render.alpha = 1
                obj.render.outline = false
            })
        }))
    }

    function highlightObject(random_id: UUID): void {
        const nextMap = produce(map, (draft) => {
            const objects = draft.data.objects ?? []
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

    function moveObj(index: number, up: boolean): void {
        const newIndex = index + (up ? -1 : 1)
        updateMap(produce(map, draft => {
            const objs = draft.data.objects ?? []
            const orig = objs[newIndex]
            objs[newIndex] = objs[index]
            objs[index] = orig
        }))
    }

    function cloneObj(random_id: UUID, index: number): void {

        updateMap(produce(map, draft => {
            const obj = map.data.objects.find(x => x.random_id === random_id)
            if (obj) {
                draft.data.objects.splice(index, 0, {
                    ...obj,
                    random_id: crypto.randomUUID()
                })
            }
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

    const [moveIndex, setMoveIndex] = useState<string | number>(0)

    function moveObjIndex(obj_id: UUID): void {
        const obj = map.data.objects.find(x => x.random_id === obj_id)
        if (obj) {
            updateMap(produce(map, draft => {
                const objs = draft.data.objects.filter(x => x.random_id !== obj_id) ?? []
                objs?.splice(Number(moveIndex), 0, obj)
                if (draft.data.objects) {
                    draft.data.objects = objs
                }
            }))
        }
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
                    <Tooltip label="Add New Object">
                        <ActionIcon
                            color={"green"}
                            disabled={!map}
                            onClick={addObj}>
                            <IconPlus />
                        </ActionIcon>
                    </Tooltip>
                    {map.data.objects.map((obj, index) => {
                        const messageCount = obj.data.message.length
                        const condsCount = obj.data.item.COND.length
                        const invisCount = Object.values(obj.data.item.visi).filter(x => x !== "").length
                        const name = obj.data.item.name

                        function iconShade(value: number): "lightgray" | "black" {
                            return value === 0 ? "lightgray" : "black"
                        }

                        function getImage(member: string): string {
                            if (member.toLowerCase().endsWith(".x"))
                                member = member.replace(".x", "")
                            const img = project.images.find(x => x.filename.toLowerCase() === member.toLowerCase())
                            if (img)
                                return URL.createObjectURL(img.data)
                            return ""
                        }

                        return (
                            <div key={obj.random_id}
                                onMouseEnter={() => highlightObject(obj.random_id)}
                                onMouseLeave={() => resetHighlights()}
                            >
                                <Group>
                                    <div>{index}</div>
                                    <div>
                                        <ActionIcon
                                            color={"yellow"}
                                            title="Move Object Up"
                                            disabled={index === 0}
                                            onClick={() => moveObj(index, true)}>
                                            <IconArrowUp />
                                        </ActionIcon>
                                        <ActionIcon
                                            color={"yellow"}
                                            title="Move Object Down"
                                            disabled={index == (map.data.objects.length ?? 0) - 1}
                                            onClick={() => moveObj(index, false)}>
                                            <IconArrowDown />
                                        </ActionIcon>
                                        <Popover position="bottom" withArrow shadow="md">
                                            <Popover.Target>
                                                <ActionIcon color={"yellow"} title="Move Object to Index">
                                                    <IconArrowMergeAltRight />
                                                </ActionIcon>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <NumberInput
                                                    label="Move To Index"
                                                    min={0}
                                                    max={(map.data.objects.length ?? 1) - 1}
                                                    onChange={setMoveIndex}
                                                    clampBehavior={"strict"} />
                                                <Button onClick={() => moveObjIndex(obj.random_id)}>Move to {moveIndex}</Button>
                                            </Popover.Dropdown>
                                        </Popover>
                                    </div>
                                    <div>
                                        <ActionIcon
                                            color={"green"}
                                            onClick={() => selectObject(obj.random_id)}>
                                            <IconPencil />
                                        </ActionIcon>
                                        <ActionIcon
                                            color={"grape"}
                                            onClick={() => cloneObj(obj.random_id, index)}>
                                            <IconCopyPlus />
                                        </ActionIcon>
                                    </div>
                                    <div>
                                        <Image mah={32} maw={32} src={getImage(obj.member)} alt={obj.member} />
                                    </div>
                                    <Group gap={5}>
                                        <HoverCard shadow={"xl"} disabled={!invisCount}>
                                            <HoverCard.Target>
                                                <Indicator size={16} inline disabled={!invisCount} color={"blue"} label={invisCount}>
                                                    <IconGhost color={iconShade(invisCount)} title="Invisibility" />
                                                </Indicator>
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                {Object.entries(obj.data.item.visi).filter(([_, o]) => o).map(([key, val]) => (
                                                    <div key={key}>{key}: <Code>{val}</Code></div>
                                                ))}
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                        <HoverCard shadow={"xl"} disabled={!condsCount}>
                                            <HoverCard.Target>
                                                <Indicator size={16} inline disabled={!condsCount} color={"blue"} label={condsCount}>
                                                    <IconCodeDots color={iconShade(condsCount)} title="Conditions" />
                                                </Indicator>
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                {obj.data.item.COND
                                                    .map(cond => {
                                                        const entries = Object.entries(cond)
                                                        return (
                                                            <Card withBorder>
                                                                <div>
                                                                    {entries.map(([key, value]) => {
                                                                        return (
                                                                            <div key={key}>
                                                                                {key}: <Code>{value}</Code>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </Card>
                                                        );
                                                    })
                                                }
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                        <HoverCard shadow={"xl"} disabled={!messageCount}>
                                            <HoverCard.Target>
                                                <Indicator size={16} inline disabled={!messageCount} color={"blue"} label={messageCount}>
                                                    <IconMessage color={iconShade(messageCount)} title="Messages" />
                                                </Indicator>
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                <Stack gap={"xs"}>
                                                    {obj.data.message.map(x => {
                                                        return (
                                                            <div>
                                                                {x.plrAct ? (<Code>Act: {x.plrAct}</Code>) : null}
                                                                {x.plrObj ? (<Code>Obj: {x.plrObj}</Code>) : null}
                                                                <Text size={"sm"}>
                                                                    {x.text.length > 50 ? x.text.slice(0, 50) + "..." : x.text}
                                                                </Text>
                                                            </div>
                                                        )
                                                    })}
                                                </Stack>
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                        <HoverCard shadow={"xl"} disabled={!name}>
                                            <HoverCard.Target>
                                                <Indicator size={16} inline disabled={!name} color={"blue"} label={1}>
                                                    <IconTextCaption color={iconShade(name.length)} title={name ? name : "Name"} />
                                                </Indicator>
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                <div><Code>{obj.data.item.type}</Code></div>
                                                <Code>{obj.data.item.name}</Code>
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                    </Group>
                                    <ActionIcon
                                        color={"red"}
                                        onClick={() => removeObj(obj.random_id)}>
                                        <IconTrash />
                                    </ActionIcon>
                                </Group>
                            </div>
                        );
                    })}
                </Card>
            </div>
        </>
    )
}

export default MapSelector