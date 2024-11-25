import { ActionIcon, Card, ComboboxData, Group, NumberInput, Select, Stack, Text, Textarea, TextInput, Tooltip, useCombobox } from "@mantine/core";
import { MapObject, MapObjectCond, MapObjectMessage, MapObjectMoveCond, MapObjectType } from "./ccsr/game/types"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { produce } from "immer";
import { IconCodePlus, IconMailPlus, IconTrash } from "@tabler/icons-react";

const mapObjectTypes = Object.entries(MapObjectType)
const mapObjectTypeOptions: string[] = mapObjectTypes.map(([_, value]) => value);

function ObjectEditorPage() {
    const { project } = useMapOMaticContext()

    const selectedObject = project.maps
        .flatMap(x => x.data?.objects ?? [])
        .find(o => o.random_id === project.state.selectedObject)

    return (
        (selectedObject ? <ObjectEditor selectedObject={selectedObject} /> : <div>
            <Text>Edit an object in the Map Editor to use this page</Text>
        </div>)
    )

}

function ObjectEditor({ selectedObject }: { selectedObject: MapObject }) {

    const { project, updateMap } = useMapOMaticContext()

    const CONDS = selectedObject.data.item.COND
    const MESSAGES = selectedObject.data.message

    function updateObject(object: MapObject): void {
        const map = project.maps.find(x => x.data?.objects.some(o => o.random_id === object.random_id))
        if (!map) return;
        updateMap({
            ...map,
            data: {
                ...map.data,
                objects: map.data.objects.map(obj => obj.random_id === object.random_id ? object : obj)
            }
        })
    }

    function updateCond(cond: MapObjectCond, index: number) {
        updateObject(produce(selectedObject, draft => {
            draft.data.item.COND[index] = cond
        }))
    }

    function removeCond(index: number) {
        updateObject(produce(selectedObject, draft => {
            draft.data.item.COND.splice(index, 1)
        }))
    }

    function addCond() {
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
        updateObject(produce(selectedObject, draft => {
            draft.data.message[index] = message
        }))
    }

    function removeMessage(index: number) {
        updateObject(produce(selectedObject, draft => {
            draft.data.message.splice(index, 1)
        }))
    }

    function addMessage() {
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
                            <Select data={mapObjectTypeOptions} label="Collision Type" placeholder="Type" value={selectedObject.data.item.type}
                                onChange={(val) => {
                                    const newType = mapObjectTypes.find(x => x[1] === val)?.[1]
                                    console.log(newType)
                                    if (newType) updateObject(produce(selectedObject, draft => {
                                        draft.data.item.type = newType
                                    }))
                                }}
                            />
                            <TextInput
                                label="Member Texture"
                                value={selectedObject.member}
                                onChange={(e) => {
                                    const newMember = e.target.value
                                    updateObject(produce(selectedObject, draft => {
                                        draft.member = newMember
                                    }))
                                }}
                            />
                            <TextInput
                                label="Name"
                                value={selectedObject.data.item.name}
                                onChange={(e) => {
                                    const newMember = e.target.value
                                    updateObject(produce(selectedObject, draft => {
                                        draft.data.item.name = newMember
                                    }))
                                }}
                            />
                        </Group>
                        <Group>
                            <NumberInput
                                label="X Offset (Tile)"
                                placeholder="X"
                                value={selectedObject.location.x}
                                onChange={(e) => {
                                    const newX = Number(e)
                                    if (!isNaN(newX)) updateObject(produce(selectedObject, draft => {
                                        draft.location.x = newX
                                    }))
                                }}
                            />
                            <NumberInput
                                label="Y Offset (Tile)"
                                placeholder="Y"
                                value={selectedObject.location.y}
                                onChange={(e) => {
                                    const newY = Number(e)
                                    if (!isNaN(newY)) updateObject(produce(selectedObject, draft => {
                                        draft.location.y = newY
                                    }))
                                }}
                            />
                        </Group>
                        <Group>
                            <NumberInput
                                label="Width (Pixels)"
                                value={selectedObject.width}
                                step={32}
                                onChange={(e) => {
                                    const newWidth = Number(e)
                                    if (!isNaN(newWidth)) updateObject(produce(selectedObject, draft => {
                                        draft.width = newWidth
                                    }))
                                }}
                            />
                            <NumberInput
                                label="Height (Pixels)"
                                value={selectedObject.height}
                                step={32}
                                onChange={(e) => {
                                    const newHeight = Number(e)
                                    if (!isNaN(newHeight)) updateObject(produce(selectedObject, draft => {
                                        draft.height = newHeight
                                    }))
                                }}
                            />
                        </Group>
                        <Group>
                            <TextInput
                                label="Width Shift (Pixels)"
                                value={selectedObject.WSHIFT}
                                onChange={(e) => {
                                    const newWShift = parseInt(e.target.value)
                                    if (!isNaN(newWShift)) updateObject(produce(selectedObject, draft => {
                                        draft.WSHIFT = newWShift
                                    }))
                                }}
                            />
                            <TextInput
                                label="Height Shift (Pixels)"
                                value={selectedObject.HSHIFT}
                                onChange={(e) => {
                                    const newHShift = parseInt(e.target.value)
                                    if (!isNaN(newHShift)) updateObject(produce(selectedObject, draft => {
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
                            value={selectedObject.data.item.visi.visiObj}
                            onChange={(e) => {
                                updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.visiObj = e.target.value
                                }))
                            }}
                        />
                        <TextInput
                            label="Visible Act"
                            value={selectedObject.data.item.visi.visiAct}
                            onChange={(e) => {
                                updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.visiAct = e.target.value
                                }))
                            }}
                        />
                    </Group>
                    <Group>
                        <TextInput
                            label="Invisible Object"
                            value={selectedObject.data.item.visi.inviObj}
                            onChange={(e) => {
                                updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.inviObj = e.target.value
                                }))
                            }}
                        />
                        <TextInput
                            label="Invisible Act"
                            value={selectedObject.data.item.visi.inviAct}
                            onChange={(e) => {
                                updateObject(produce(selectedObject, draft => {
                                    draft.data.item.visi.inviAct = e.target.value
                                }))
                            }}
                        />
                    </Group>
                </Card>
                <Card padding="lg" radius="md" withBorder>
                    <Group>
                        <Tooltip label="Add New Condition">
                            <ActionIcon title="Add new Condition" color={"green"} onClick={addCond}>
                                <IconCodePlus></IconCodePlus>
                            </ActionIcon>
                        </Tooltip>
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
                        <Tooltip label="Add New Message">
                            <ActionIcon title="Add New Message" color={"green"} onClick={addMessage}>
                                <IconMailPlus></IconMailPlus>
                            </ActionIcon>
                        </Tooltip>
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
                            <NumberInput
                                label="Left"
                                min={0}
                                value={selectedObject.data.move.L}
                                onChange={(e) => {
                                    const newLeft = Number(e)
                                    if (!isNaN(newLeft)) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.L = newLeft
                                    }))
                                }}
                            />
                            <NumberInput
                                label="Right"
                                min={0}
                                value={selectedObject.data.move.R}
                                onChange={(e) => {
                                    const newRight = Number(e)
                                    if (!isNaN(newRight)) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.R = newRight
                                    }))
                                }}
                            />
                            <NumberInput
                                label="Up"
                                min={0}
                                value={selectedObject.data.move.U}
                                onChange={(e) => {
                                    const newUp = Number(e)
                                    if (!isNaN(newUp)) updateObject(produce(selectedObject, draft => {
                                        draft.data.move.U = newUp
                                    }))
                                }}
                            />
                            <NumberInput
                                label="Down"
                                min={0}
                                value={selectedObject.data.move.d}
                                onChange={(e) => {
                                    const newDown = Number(e)
                                    if (!isNaN(newDown)) updateObject(produce(selectedObject, draft => {
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
                                value={selectedObject.data.move.COND.toString()}
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
                                    value={selectedObject.data.move.TIMEA}
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
                                    value={selectedObject.data.move.TIMEB}
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

export default ObjectEditorPage