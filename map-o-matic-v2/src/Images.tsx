import { ActionIcon, Card, Image, SimpleGrid } from "@mantine/core";
import { useMapOMaticContext } from "./context/MapOMaticContext"
import { useState } from "react";
import "./images.css"
import { ImageFile } from "./ccsr/types";
import { IconTrash } from "@tabler/icons-react";


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
                            <ActionIcon onClick={() => removeImage(img.file)} variant="filled" >
                                <IconTrash />
                            </ActionIcon>
                        </div>
                    )
                })}
            </SimpleGrid>
        </>
    )
}

export default Images