import { ActionIcon, Card, Image, SimpleGrid } from "@mantine/core";
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { useState } from "react";
import "./images.css"
import { ImageFile } from "./ccsr/types";
import { IconExchange, IconTrash } from "@tabler/icons-react";
import { produce } from "immer";


type CCSRImage = {
    file: ImageFile
    references: ImageReference[]
}

type ImageReference = {
    map: string
}

function Images() {
    const { project, updateProject } = useMapOMaticContext();
    const [filterBlocks, setFilterBlocks] = useState(true)

    const selectedObject = project.maps
        .flatMap(x => x.data?.objects ?? [])
        .find(o => o.random_id === project.state.selectedObject)

    const images: CCSRImage[] = project.images
        .filter(img => {
            const name = img.filename.toLowerCase()
            return filterBlocks &&
                ((name.includes("block") || name.includes("tile")) && !name.includes("face"))
        }).map(img => {
            return {
                file: img,
                references: []
            }
        })

    function removeImage(file: ImageFile): void {
        updateProject({
            ...project,
            images: images.filter(x => x.file.filename !== file.filename).map(x => x.file)
        }, true)
    }

    function setObjectImage(img: ImageFile): void {
        if (!selectedObject) return;
        updateProject(produce(project, draft => {
            const obj = draft.maps.flatMap(x => x.data?.objects ?? []).find(obj => obj.random_id === selectedObject.random_id)
            if (obj) {
                obj.member = img.filename
            }
        }))
    }

    return (
        <>
            <div>Images: {images.length}</div>
            <SimpleGrid cols={6}>
                {images.map(img => {

                    return (
                        <div key={img.file.filename}>
                            <Card shadow="sm" padding={"sm"}>
                                <Image src={URL.createObjectURL(img.file.data)} alt={img.file.filename} width={50} />
                                <div>{img.file.filename}</div>
                            </Card>
                            <ActionIcon color={"red"} onClick={() => removeImage(img.file)} variant="filled" >
                                <IconTrash />
                            </ActionIcon>
                            {selectedObject ?
                                <ActionIcon onClick={() => setObjectImage(img.file)} variant="filled" >
                                    <IconExchange />
                                </ActionIcon>
                                : null}
                        </div>
                    )
                })}
            </SimpleGrid>
        </>
    )
}

export default Images