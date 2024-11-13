import { Tooltip, ActionIcon, Modal, Switch, Group, Stack, Textarea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconBraces, IconBrackets, IconJson } from "@tabler/icons-react"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { useState } from "react"
import { produce } from "immer"
import { MapFile } from "./ccsr/types"
import { mapDataToLingo } from "./ccsr/game/toLingo"
import { lingoValueToString } from "./ccsr/parser/print"

export type MapDataExporterProps = {
    map: MapFile
}

function MapDataExporter({ map }: MapDataExporterProps) {

    const [opened, { open, close }] = useDisclosure()
    const { project, updateState } = useMapOMaticContext()
    const [asJSON, setAsJSON] = useState(project.state.exportAsJSON)
    const [asPretty, setAsPretty] = useState(project.state.exportPretty)

    const lingoValue = mapDataToLingo(map.data)
    const lingoString = lingoValueToString(lingoValue, asPretty, asJSON)

    function setExportPretty(value: boolean) {
        updateState(produce(project.state, draft => {
            draft.exportPretty = value
        }))
        setAsPretty(value)
    }

    function setExportType(value: boolean) {
        updateState(produce(project.state, draft => {
            draft.exportAsJSON = value
        }))
        setAsJSON(value)
    }

    return (
        <>
            <Tooltip label="View Map Data">
                <ActionIcon
                    color={"indigo"}
                    onClick={open}>
                    {asJSON ? <IconBraces /> : <IconBrackets />}
                </ActionIcon>
            </Tooltip>
            <Modal opened={opened} onClose={close} title="View Map Data">
                <Stack>
                    <Group>
                        <Switch
                            label="View as JSON"
                            checked={asJSON}
                            onChange={e => setExportType(e.currentTarget.checked)}
                        />
                        <Switch
                            label="Pretty Formatting"
                            checked={asPretty}
                            onChange={e => setExportPretty(e.currentTarget.checked)}
                        />
                    </Group>
                    <Textarea
                        readOnly
                        autosize
                        minRows={5}
                        maxRows={15}
                        value={lingoString}
                    />
                </Stack>
            </Modal>
        </>
    )
}


export default MapDataExporter