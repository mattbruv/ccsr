import { ActionIcon, Button, Card, Group, HoverCard, Image, Modal, SimpleGrid, Stack, TextInput, Tooltip } from "@mantine/core";
import { useMapOMaticContext } from "./context/MapOMaticContext"
import "./images.css"
import { ImageFile, UUID } from "./ccsr/types";
import { IconClipboardCopy, IconCopy, IconEdit, IconExchange, IconTrash } from "@tabler/icons-react";
import { produce } from "immer";
import { useDisclosure } from "@mantine/hooks";
import ImageUploader from "./ImageUploader";
import { removeWhiteFromBlob } from "./ccsr/zip";
import { ChangeEvent, useState } from "react";


function Images() {
    const { project, updateProject, rerenderProject } = useMapOMaticContext();
    const [modalOpened, { open, close }] = useDisclosure(false);
    const [replaceId, setReplaceId] = useState<UUID | undefined>()

    const replaceImage = project.images.find(x => x.randomId === replaceId)

    const selectedObject = project.maps
        .flatMap(x => x.data?.objects ?? [])
        .find(o => o.random_id === project.state.selectedObject)

    function removeImage(file: ImageFile): void {
        updateProject({
            ...project,
            images: project.images.filter(x => x.filename !== file.filename)
        }, true)
    }

    async function addImage(file: File): Promise<void> {
        const newImg = await removeWhiteFromBlob(file)

        // If Replace ID state is set, find that image and update it
        if (replaceId) {
            updateProject(produce(project, draft => {
                draft.images = draft.images.map(img => img.randomId !== replaceId ? img : {
                    ...img,
                    data: newImg,
                    originalData: file
                })
            }), true, true)

            closeModal()
            return;
        }

        const image: ImageFile = {
            data: newImg,
            path: "map.visuals/",
            filename: file.name,
            originalData: file,
            randomId: crypto.randomUUID()
        }

        updateProject(produce(project, draft => {
            draft.images.push(image)
        }), true, true)

        closeModal()
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

    function openModal(replaceImageId?: UUID) {
        setReplaceId(replaceImageId)
        open()
    }

    function closeModal() {
        rerenderProject()
        close()
    }

    async function copyImgToClipboard(img: ImageFile): Promise<void> {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [img.data.type]: img.data
                })
            ])
        } catch (e) {
            alert(e)
        }
    }

    const IMAGES = [...project.images].sort((a, b) => a.filename.localeCompare(b.filename))

    function updateName(event: ChangeEvent<HTMLInputElement>): void {
        const name = event.target.value;
        updateProject(produce(project, draft => {
            const img = draft.images.find(x => x.randomId === replaceId)
            if (img) img.filename = name
        }), false, false)
    }

    function updatePath(event: ChangeEvent<HTMLInputElement>): void {
        const path = event.target.value;
        updateProject(produce(project, draft => {
            const img = draft.images.find(x => x.randomId === replaceId)
            if (img) img.path = path
        }), false, false)
    }

    return (
        <>
            <Modal opened={modalOpened} onClose={closeModal} title={(replaceId ? "Update" : "Add") + " Image"}>
                <Stack>
                    {replaceImage ? (
                        <div>
                            <TextInput
                                onChange={updateName}
                                value={replaceImage.filename}
                                label="Name"
                            />
                            <TextInput
                                onChange={updatePath}
                                value={replaceImage.path}
                                label="Path"
                            />
                        </div>
                    ) : null}
                    <Card withBorder>
                        <ImageUploader onImageUpload={addImage} />
                    </Card>
                </Stack>
            </Modal>
            <Button onClick={() => openModal()}>Add New Image</Button>
            <SimpleGrid cols={6} spacing={"xs"}>
                {IMAGES.map(img => {
                    return (
                        <div key={img.randomId}>
                            <HoverCard>
                                <HoverCard.Target>
                                    <Card withBorder padding={"sm"}>
                                        <div style={{ height: "50px", width: "50px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                            <Image src={URL.createObjectURL(img.data)} alt={img.filename} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                                        </div>
                                        <div>{img.filename}</div>
                                    </Card>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Group gap={"xs"}>
                                        <Tooltip position={"bottom"} label="Update Image">
                                            <ActionIcon color={"yellow"} onClick={() => openModal(img.randomId)} variant="filled" >
                                                <IconEdit />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip position={"bottom"} label="Copy Image to Clipboard">
                                            <ActionIcon color={"green"} onClick={() => copyImgToClipboard(img)} variant="filled" >
                                                <IconClipboardCopy />
                                            </ActionIcon>
                                        </Tooltip>
                                        {selectedObject ?
                                            <Tooltip label="Use As Selected Object Image">
                                                <ActionIcon onClick={() => setObjectImage(img)} variant="filled" >
                                                    <IconExchange />
                                                </ActionIcon>
                                            </Tooltip>
                                            : null}
                                        <Tooltip position={"bottom"} label="Delete Image">
                                            <ActionIcon color={"red"} onClick={() => removeImage(img)} variant="filled" >
                                                <IconTrash />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </div>
                    )
                })}
            </SimpleGrid>
        </>
    )
}

export default Images