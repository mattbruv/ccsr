import { ActionIcon, Card, ComboboxData, Group, Select, Stack, Textarea, TextInput, Tooltip } from "@mantine/core";
import { MapObject, MapObjectCond, MapObjectMessage, MapObjectMoveCond, MapObjectType } from "./ccsr/game/types"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { produce } from "immer";
import { IconCodePlus, IconMailPlus, IconTrash } from "@tabler/icons-react";

const mapObjectTypes = Object.entries(MapObjectType)
const mapObjectTypeOptions: string[] = mapObjectTypes.map(([_, value]) => value);

function ObjectEditor() {

    const { project, updateMap } = useMapOMaticContext()

    const selectedObject = project.maps
        .flatMap(x => x.data?.objects ?? [])
        .find(o => o.random_id === project.state.selectedObject)

    const CONDS = (selectedObject?.data.item.COND ?? [])
        .filter(x => x !== null)

    const MESSAGES = (selectedObject?.data.message ?? [])

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

    function updateCond(cond: MapObjectCond, index: number) {
        if (!selectedObject) return;
        updateObject(produce(selectedObject, draft => {
            draft.data.item.COND[index] = cond
        }))
    }

    function removeCond(index: number) {
        if (!selectedObject) return;
        updateObject(produce(selectedObject, draft => {
            draft.data.item.COND.splice(index, 1)
        }))
    }

    function addCond() {
        if (!selectedObject) return;
        updateObject(produce(selectedObject, draft => {
            draft.data.item.COND.push({
                giveAct: "",
                giveObj: "",
                hasAct: "",
                hasObj: "",
            })
        }))
    }

    function updateMessage(message: MapObjectMessage, index: number) {
        if (!selectedObject) return;
        updateObject(produce(selectedObject, draft => {
            draft.data.message[index] = message
        }))
    }

    function removeMessage(index: number) {
        if (!selectedObject) return;
        updateObject(produce(selectedObject, draft => {
            draft.data.message.splice(index, 1)
        }))
    }

    function addMessage() {
        if (!selectedObject) return;
        updateObject(produce(selectedObject, draft => {
            draft.data.message.push({
                plrAct: "",
                plrObj: "",
                text: ""
            })
        }))
    }

    const condLabels: Record<MapObjectMoveCond, string> = {
        [MapObjectMoveCond.None]: "None",
        [MapObjectMoveCond.Auto]: "Auto",
        [MapObjectMoveCond.Push]: "Push",
        [MapObjectMoveCond.Pull]: "Pull (unimplemented)",
        [MapObjectMoveCond.MoveX]: "MoveX (unimplemented)",
        [MapObjectMoveCond.MoveY]: "MoveY (unimplemented)"
    }

    const condSelections: ComboboxData = Object.entries(condLabels).map(([value, label]) => ({
        value,
        label,
        disabled: parseInt(value) >= MapObjectMoveCond.Pull
    }))

    return (
        <>
            <Stack gap={"xs"}>
                <Card padding="lg" radius="md" withBorder>
                    <Stack gap={"xs"}>
                        <Group>
                            <Select data={mapObjectTypeOptions} label="Collision Type" placeholder="Type" value={selectedObject?.data.item.type}
                                onChange={(val) => {
                                    const newType = mapObjectTypes.find(x => x[1] === val)?.[1]
                                    console.log(newType)
                                    if (selectedObject && newType) updateObject(produce(selectedObject, draft => {
                                        draft.data.item.type = newType
                                    }))
                                }}
                            />
                            <Tooltip label="This field always seems to be left blank">
                                <TextInput
                                    label="Name"
                                    disabled={true}
                                    value={selectedObject?.data.item.name}
                                />
                            </Tooltip>
                        </Group>
                        <Group>
                            <TextInput
                                label="X Offset (Tile)"
                                placeholder="X"
                                value={selectedObject?.location.x}
                                onChange={(e) => {
                                    const newX = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newX)) updateObject(produce(selectedObject, draft => {
                                        draft.location.x = newX
                                    }))
                                }}
                            />
                            <TextInput
                                label="Y Offset (Tile)"
                                placeholder="Y"
                                value={selectedObject?.location.y}
                                onChange={(e) => {
                                    const newY = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newY)) updateObject(produce(selectedObject, draft => {
                                        draft.location.y = newY
                                    }))
                                }}
                            />
                        </Group>
                        <Group>
                            <TextInput
                                label="Width (Pixels)"
                                value={selectedObject?.width}
                                onChange={(e) => {
                                    const newWidth = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newWidth)) updateObject(produce(selectedObject, draft => {
                                        draft.width = newWidth
                                    }))
                                }}
                            />
                            <TextInput
                                label="Height (Pixels)"
                                value={selectedObject?.height}
                                onChange={(e) => {
                                    const newHeight = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newHeight)) updateObject(produce(selectedObject, draft => {
                                        draft.height = newHeight
                                    }))
                                }}
                            />
                        </Group>
                        <Group>
                            <TextInput
                                label="Width Shift (Pixels)"
                                value={selectedObject?.WSHIFT}
                                onChange={(e) => {
                                    const newWShift = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newWShift)) updateObject(produce(selectedObject, draft => {
                                        draft.WSHIFT = newWShift
                                    }))
                                }}
                            />
                            <TextInput
                                label="Height Shift (Pixels)"
                                value={selectedObject?.HSHIFT}
                                onChange={(e) => {
                                    const newHShift = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newHShift)) updateObject(produce(selectedObject, draft => {
                                        draft.HSHIFT = newHShift
                                    }))
                                }}
                            />
                        </Group>
                    </Stack>
                </Card>
                <Card padding="lg" radius="md" withBorder>
                    <Group>
                        <TextInput
                            label="Visible Object"
                            value={selectedObject?.data.item.visi.visiObj}
                            onChange={(e) => {
                                if (selectedObject) updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.visiObj = e.target.value
                                }))
                            }}
                        />
                        <TextInput
                            label="Visible Act"
                            value={selectedObject?.data.item.visi.visiAct}
                            onChange={(e) => {
                                if (selectedObject) updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.visiAct = e.target.value
                                }))
                            }}
                        />
                    </Group>
                    <Group>
                        <TextInput
                            label="Invisible Object"
                            value={selectedObject?.data.item.visi.inviObj}
                            onChange={(e) => {
                                if (selectedObject) updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.inviObj = e.target.value
                                }))
                            }}
                        />
                        <TextInput
                            label="Invisible Act"
                            value={selectedObject?.data.item.visi.inviAct}
                            onChange={(e) => {
                                if (selectedObject) updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.inviAct = e.target.value
                                }))
                            }}
                        />
                    </Group>
                </Card>
                <Card padding="lg" radius="md" withBorder>
                    <Group>
                        <ActionIcon title="Add new Condition" color={"green"} onClick={addCond}>
                            <IconCodePlus></IconCodePlus>
                        </ActionIcon>
                    </Group>
                    {CONDS.map((cond, index) => {
                        return (
                            <Card withBorder>
                                <Group>
                                    <TextInput
                                        label="Has Object"
                                        value={cond.hasObj}
                                        onChange={(e) => { updateCond({ ...cond, hasObj: e.target.value }, index) }}
                                    />
                                    <TextInput
                                        label="Has Act"
                                        value={cond.hasAct}
                                        onChange={(e) => { updateCond({ ...cond, hasAct: e.target.value }, index) }}
                                    />
                                </Group>
                                <Group>
                                    <TextInput
                                        label="Give Object"
                                        value={cond.giveObj}
                                        onChange={(e) => { updateCond({ ...cond, giveObj: e.target.value }, index) }}
                                    />
                                    <TextInput
                                        label="Give Act"
                                        value={cond.giveAct}
                                        onChange={(e) => { updateCond({ ...cond, giveAct: e.target.value }, index) }}
                                    />
                                </Group>
                                <ActionIcon color={"red"} onClick={() => removeCond(index)}>
                                    <IconTrash></IconTrash>
                                </ActionIcon>
                            </Card>
                        )
                    })}
                </Card>
                <Card padding="lg" radius="md" withBorder>
                    <Group>
                        <ActionIcon title="Add new Message" color={"green"} onClick={addMessage}>
                            <IconMailPlus></IconMailPlus>
                        </ActionIcon>
                    </Group>
                    {MESSAGES.map((message, index) => {
                        return (
                            <Card withBorder>
                                <Group>
                                    <TextInput
                                        label="Object Trigger"
                                        value={message.plrObj}
                                        onChange={(e) => { updateMessage({ ...message, plrObj: e.target.value }, index) }}
                                    />
                                    <TextInput
                                        label="Act Trigger"
                                        value={message.plrAct}
                                        onChange={(e) => { updateMessage({ ...message, plrAct: e.target.value }, index) }}
                                    />
                                </Group>
                                <Textarea
                                    label="Message Text"
                                    value={message.text}
                                    minRows={40}
                                    onChange={(e) => { updateMessage({ ...message, text: e.target.value }, index) }}
                                />
                                <ActionIcon color={"red"} onClick={() => removeMessage(index)}>
                                    <IconTrash></IconTrash>
                                </ActionIcon>
                            </Card>
                        )
                    })}
                </Card>
                <Card padding="lg" radius="md" withBorder>
                    <Stack gap={"xs"}>
                        <Group>
                            <TextInput
                                label="Left"
                                value={selectedObject?.data.move.L}
                                onChange={(e) => {
                                    const newLeft = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newLeft)) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.L = newLeft
                                    }))
                                }}
                            />
                            <TextInput
                                label="Right"
                                value={selectedObject?.data.move.R}
                                onChange={(e) => {
                                    const newRight = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newRight)) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.R = newRight
                                    }))
                                }}
                            />
                            <TextInput
                                label="Up"
                                value={selectedObject?.data.move.U}
                                onChange={(e) => {
                                    const newUp = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newUp)) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.U = newUp
                                    }))
                                }}
                            />
                            <TextInput
                                label="Down"
                                value={selectedObject?.data.move.d}
                                onChange={(e) => {
                                    const newDown = parseInt(e.target.value)
                                    if (selectedObject && !isNaN(newDown)) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.d = newDown
                                    }))
                                }}
                            />
                        </Group>
                        <Group>
                            {/* array indexing is probably 1 based */}
                            {/* gConMove = [#none, #AUTO, #push, #pull, #movex, #movey] */}
                            <Select
                                label="Move Type"
                                data={condSelections}
                                value={selectedObject?.data.move.COND.toString()}
                                onChange={(value) => {
                                    if (value === null) return;
                                    const newCond = parseInt(value)
                                    if (selectedObject) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.COND = newCond
                                    }))
                                }}
                            />
                            <Tooltip label="This feature was not implemented in the game engine">
                                <TextInput
                                    label="Time A"
                                    disabled
                                    value={selectedObject?.data.move.TIMEA}
                                    onChange={(e) => {
                                        const newTime = parseInt(e.target.value)
                                        if (selectedObject && !isNaN(newTime)) updateObject(produce(selectedObject, draft => {
                                            draft.data.move.COND = newTime
                                        }))
                                    }}
                                />
                            </Tooltip>
                            <Tooltip label="This feature was not implemented in the game engine">
                                <TextInput
                                    label="Time B"
                                    disabled
                                    value={selectedObject?.data.move.TIMEB}
                                    onChange={(e) => {
                                        const newTime = parseInt(e.target.value)
                                        if (selectedObject && !isNaN(newTime)) updateObject(produce(selectedObject, draft => {
                                            draft.data.move.COND = newTime
                                        }))
                                    }}
                                />
                            </Tooltip>
                        </Group>
                    </Stack>
                </Card>
            </Stack>
        </>
    )
}

export default ObjectEditor