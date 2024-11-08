import { Accordion, Card, Checkbox, Group, Stack, Text, Title } from "@mantine/core"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { MapObjectType } from "./ccsr/game/types"
import { ChangeEvent, useState } from "react"
import { produce } from "immer"

function WorldEditor() {

    const { project, updateProject } = useMapOMaticContext()

    const totalMaps = project.maps.length
    const mapBorderCount = project.maps.filter(x => x.render.showMapBorder === true).length
    const mapGridCount = project.maps.filter(x => x.render.showMapGrid === true).length
    const mapCollisionCount = project.maps.filter(x => x.render.showCollision === true).length

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

    function toggleGrids(event: ChangeEvent<HTMLInputElement>): void {
        updateProject(produce(project, draft => {
            draft.maps.forEach(x => x.render.showMapGrid = event.target.checked)
        }))
    }

    function toggleBorders(event: ChangeEvent<HTMLInputElement>): void {
        updateProject(produce(project, draft => {
            draft.maps.forEach(x => x.render.showMapBorder = event.target.checked)
        }))
    }

    function toggleCollisions(event: ChangeEvent<HTMLInputElement>): void {
        updateProject(produce(project, draft => {
            draft.maps.forEach(x => x.render.showCollision = event.target.checked)
        }))
    }

    return (<>
        <div>
            {totalMaps}-
            {mapGridCount}-
            {mapBorderCount}
            <Stack gap={"sm"}>
                <Checkbox
                    onChange={toggleGrids}
                    checked={mapGridCount === totalMaps}
                    indeterminate={mapGridCount > 0 && mapGridCount < totalMaps}
                    label="Show Grids"
                />
                <Checkbox
                    onChange={toggleBorders}
                    checked={mapBorderCount === totalMaps}
                    indeterminate={mapBorderCount > 0 && mapBorderCount < totalMaps}
                    label="Show Borders"
                />
                <Checkbox
                    onChange={toggleCollisions}
                    checked={mapCollisionCount === totalMaps}
                    indeterminate={mapCollisionCount > 0 && mapCollisionCount < totalMaps}
                    label="Show Collision"
                />
            </Stack>
            <Accordion>
                {maps}
            </Accordion>
            {project.maps.length}
        </div>
    </>)
}

export default WorldEditor