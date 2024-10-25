import { Accordion, Card, Group, Stack, Text, Title } from "@mantine/core"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { MapObjectType } from "./ccsr/game/types"

function WorldEditor() {

    const { project } = useMapOMaticContext()

    const maps = project.maps.map(map => {
        return (
            <Accordion.Item key={map.filename} value={map.filename}>
                <Accordion.Control>{map.filename}</Accordion.Control>
                <Accordion.Panel>
                    <Stack>
                        <Group grow>
                            <Card shadow="sm" padding={"lg"} radius={"md"} withBorder>
                                <Title order={5}>Objects</Title>
                                <Text mt={"sm"}>
                                    {map.data?.objects.length}
                                </Text>
                            </Card>
                            <Card shadow="sm" padding={"lg"} radius={"md"} withBorder>
                                <Title order={5}>Characters</Title>
                                <Text mt={"sm"}>
                                    {map.data?.objects.filter(x => x.data.item.type === MapObjectType.CHAR).length}
                                </Text>
                            </Card>
                            <Card shadow="sm" padding={"lg"} radius={"md"} withBorder>
                                <Title order={5}>Objects</Title>
                                <Text mt={"sm"}>Hi</Text>
                            </Card>
                        </Group>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        )
    })

    return (<>
        <div>
            <Accordion>
                {maps}
            </Accordion>
            {project.maps.length}
        </div>
    </>)
}

export default WorldEditor