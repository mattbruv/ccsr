import { useMapOMaticContext } from "./context/MapOMaticContext"
import { ActionIcon, Button, Card, Code, ComboboxItem, Group, HoverCard, Image, Indicator, NumberInput, Popover, Select, Slider, Stack, Switch, Text } from "@mantine/core";
import { UUID } from "./ccsr/types";
import { IconArrowDown, IconArrowMergeAltRight, IconArrowUp, IconCodeDots, IconCopyPlus, IconGhost, IconMessage, IconPencil, IconPlus, IconTextCaption, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { MapOMaticPage } from "./App";
import { produce } from "immer";
import { useState } from "react";
import { newMapObject } from "./ccsr/helpers";
import { MapObjectType } from "./ccsr/game/types";

function MapEditor() {
    const { project, updateMap, updateState, centerOnMap } = useMapOMaticContext();
    const navigate = useNavigate()

    const selectedMap = project.maps.find(x => x.random_id === project.state.selectedMap)

    const [showGrid, setShowGrid] = useState(selectedMap?.render.showMapGrid)
    const [showCollision, setShowCollision] = useState(selectedMap?.render.showCollision)
    const [collisionAlpha, setCollisionAlpha] = useState(selectedMap?.render.collisionAlpha ?? 75 * 100);

    function updateCollisionAlpha(newValue: number) {
        if (!selectedMap) return;
        const alpha = newValue / 100
        updateMap(produce(selectedMap, draft => {
            draft.render.collisionAlpha = alpha
        }))
        setCollisionAlpha(newValue)
    }

    function toggleGrid(val: boolean) {
        if (!selectedMap) return;
        setShowGrid(val)
        updateMap(produce(selectedMap, draft => {
            draft.render.showMapGrid = val
        }))
    }

    function toggleCollision(val: boolean) {
        if (!selectedMap) return;
        setShowCollision(val)
        updateMap(produce(selectedMap, draft => {
            draft.render.showCollision = val
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

    function moveObj(random_id: UUID, index: number, up: boolean): void {
        if (!selectedMap) return;
        const newIndex = index + (up ? -1 : 1)
        updateMap(produce(selectedMap, draft => {
            const objs = draft.data?.objects ?? []
            const orig = objs[newIndex]
            objs[newIndex] = objs[index]
            objs[index] = orig
        }))
    }

    function cloneObj(random_id: UUID, index: number): void {
        if (!selectedMap) return;

        updateMap(produce(selectedMap, draft => {
            const obj = selectedMap.data?.objects.find(x => x.random_id === random_id)
            if (obj) {
                draft.data?.objects.splice(index, 0, {
                    ...obj,
                    random_id: crypto.randomUUID()
                })
            }
        }))
    }

    function addObj(): void {
        if (!selectedMap) return;
        updateMap(produce(selectedMap, draft => {
            draft.data?.objects.push(newMapObject())
        }))
    }

    const [moveIndex, setMoveIndex] = useState<string | number>(0)

    function moveObjIndex(obj_id: UUID): void {
        if (!selectedMap) return;
        const obj = selectedMap.data?.objects.find(x => x.random_id === obj_id)
        if (obj) {
            updateMap(produce(selectedMap, draft => {
                const objs = draft.data?.objects.filter(x => x.random_id !== obj_id) ?? []
                objs?.splice(Number(moveIndex), 0, obj)
                if (draft.data?.objects) {
                    draft.data.objects = objs
                }
            }))
        }
    }

    // Attempts to automatically fix collision by moving
    // all floor objects to the bottom
    function fixCollision(): void {
        if (!selectedMap) return;
        if (!confirm("Attempt to automatically fix collision?")) return;
        const waters = selectedMap.data?.objects.filter(x => x.data.item.type === MapObjectType.WATER) ?? []
        const floors = selectedMap.data?.objects.filter(x => x.data.item.type === MapObjectType.FLOR) ?? []
        const nonFloors = selectedMap.data?.objects.filter(
            x => x.data.item.type !== MapObjectType.FLOR &&
                x.data.item.type !== MapObjectType.WATER
        ) ?? []
        updateMap(produce(selectedMap, draft => {
            if (draft.data) {
                draft.data.objects = [...waters, ...floors, ...nonFloors]
            }
        }))
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
                <Switch
                    label="Show Collision"
                    checked={showCollision}
                    onChange={e => toggleCollision(e.currentTarget.checked)}
                />
                <Slider value={collisionAlpha} onChange={updateCollisionAlpha} />
                <div>
                    <Button size={"xs"} onClick={fixCollision}>Auto-Fix Collision</Button>
                </div>
                {selectedMap?.filename}
                <ActionIcon
                    color={"green"}
                    onClick={addObj}>
                    <IconPlus />
                </ActionIcon>
                {selectedMap?.data?.objects.map((obj, index) => {

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
                                        onClick={() => moveObj(obj.random_id, index, true)}>
                                        <IconArrowUp />
                                    </ActionIcon>
                                    <ActionIcon
                                        color={"yellow"}
                                        title="Move Object Down"
                                        disabled={index == (selectedMap.data?.objects.length ?? 0) - 1}
                                        onClick={() => moveObj(obj.random_id, index, false)}>
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
                                                max={(selectedMap.data?.objects.length ?? 1) - 1}
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
                                                <div>{key}: <Code>{val}</Code></div>
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
                                                .filter(x => x !== null)
                                                .map(cond => {
                                                    const entries = Object.entries(cond)
                                                    return (
                                                        <Card withBorder>
                                                            <div>
                                                                {entries.map(([key, value]) => {
                                                                    return (
                                                                        <div>
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
            </div >
        </>
    )
}

export default MapEditor