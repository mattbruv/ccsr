import { Button, ComboboxItem, FileInput, Group, Input, Modal, Select, Stack } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { IconDownload, IconPlus, IconUpload } from "@tabler/icons-react";
import { newProject, useMapOMaticContext } from "./context/MapOMaticContext";
import { loadCustomZip, loadZipFromServer, saveProjectToZip } from "./ccsr/zip";

export const EPISODE_DATA = [
    {
        title: "Episode 1: Pool Problems",
        filename: "1.zip",
    },
    {
        title: "Episode 2: Tennis Menace",
        filename: "2.zip",
    },
    {
        title: "Episode 3: Vivian vs. the Volcano",
        filename: "3.zip",
    },
    {
        title: "Episode 4: Disco Dilemma",
        filename: "4.zip",
    },
    {
        title: "Scooby Doo and the Hollywood Horror: Part 1",
        filename: "scooby-1.zip",
    },
    {
        title: "Scooby Doo and the Hollywood Horror: Part 2",
        filename: "scooby-2.zip",
    },
];

const example_files = EPISODE_DATA.map(x => ({
    label: x.title,
    value: x.filename
}))

function ProjectPage() {

    const [opened, { open, close }] = useDisclosure(false);
    const { project, updateProject } = useMapOMaticContext()

    function saveProject() {
        saveProjectToZip(project);
    }

    function loadExistingZip(selected: ComboboxItem) {
        if (!selected.value) return;

        loadZipFromServer(selected.value).then((project) => {
            project.metadata.author = "Funny Garbage"
            project.metadata.name = selected.label
            updateProject(project, true)
            close()
        })
    }

    function loadUserZip(file: File | null) {
        if (!file) return;
        loadCustomZip(file).then((project) => {
            updateProject(project, true)
            close()
        })
    }

    function clickNewProject(): void {
        const result = confirm("Are you sure you want to erase all data and start new?")
        if (result) {
            updateProject(newProject(), true)
        }
    }

    return (<>
        <div>
            <Stack>
                <Group gap={10}>
                    <Button color={"gray"} onClick={open} rightSection={<IconUpload />}>Load Project</Button>
                    <Button color={"green"} onClick={saveProject} rightSection={<IconDownload />}>Save Project</Button>
                    <Button onClick={clickNewProject} rightSection={<IconPlus />}>New Project</Button>
                </Group>
                <div>
                    <Input.Wrapper label="Project Name">
                        <Input
                            value={project.metadata.name}
                            onChange={(e) => updateProject({ ...project, metadata: { ...project.metadata, name: e.target.value } })}
                        />
                    </Input.Wrapper>
                    <Input.Wrapper label="Author">
                        <Input
                            value={project.metadata.author}
                            onChange={(e) => updateProject({ ...project, metadata: { ...project.metadata, author: e.target.value } })}
                        />
                    </Input.Wrapper>
                </div>
            </Stack>



            <Modal size={"xl"} opened={opened} onClose={close} title="Load Project">
                <Group grow justify="center">
                    <div>
                        <Select
                            label="Choose from an Existing Project"
                            placeholder="Select a project"
                            data={example_files}
                            onChange={(_, value) => loadExistingZip(value)}
                        />
                    </div>
                    <div>
                        <FileInput
                            label="Or Upload .ZIP File"
                            multiple={false}
                            accept=".zip"
                            placeholder="Select ZIP Project File"
                            onChange={loadUserZip}
                        />
                    </div>
                </Group>
            </Modal>
        </div >
    </>)
}

export default ProjectPage