import { Group, ActionIcon, Popover, NumberInput, Button, HoverCard, Indicator, Code, Card, Stack, Image, Text } from "@mantine/core"
import { IconArrowUp, IconArrowDown, IconArrowMergeAltRight, IconPencil, IconCopyPlus, IconGhost, IconCodeDots, IconMessage, IconTextCaption, IconTrash } from "@tabler/icons-react"
import { MapObject, MapObjectType } from "./ccsr/game/types"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { produce } from "immer"
import { MapFile, UUID } from "./ccsr/types"
import { MapOMaticPage } from "./App"
import { useNavigate } from "react-router-dom";
import { useState } from "react"

type MapObjectListItemProps = {
    map: MapFile,
    obj: MapObject,
    index: number
    // selectedMap: MapFile | undefined
}

export function MapObjectListItem({ map, obj, index }: MapObjectListItemProps): JSX.Element {

    const { project, updateMap, updateState } = useMapOMaticContext();
    const navigate = useNavigate()

    function resetHighlights(): void {
        updateMap(produce(map, draft => {
            draft.data.objects.forEach(obj => {
                obj.render.alpha = 1
                obj.render.outline = false
            })
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

    function selectObject(random_id: UUID): void {
        updateState({
            ...project.state,
            selectedObject: random_id
        })
        navigate(MapOMaticPage.ObjectEditor)
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


    return (
        <Card padding={"xs"} withBorder key={obj.random_id}
            onMouseEnter={() => highlightObject(obj.random_id)}
            onMouseLeave={() => resetHighlights()}
            style={{
                // backgroundColor: getBackgroundColor(obj)
            }}
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
                <MapObjectPreview key={obj.random_id} obj={obj} />
                <ActionIcon
                    color={"red"}
                    onClick={() => removeObj(obj.random_id)}>
                    <IconTrash />
                </ActionIcon>
            </Group>
        </Card>
    );
}

type MapObjectPreviewProps = {
    obj: MapObject
}

export function MapObjectPreview({ obj }: MapObjectPreviewProps) {
    const { project } = useMapOMaticContext();
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
        <Group key={obj.random_id} gap={5}>
            <div>
                <Image mah={32} maw={32} src={getImage(obj.member)} alt={obj.member} />
            </div>
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
                                <Card key={obj.random_id} withBorder>
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
                                <div key={obj.random_id}>
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
    )
}