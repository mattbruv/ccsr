import { Modal, Button, Stack, Anchor, List, ListItem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

const NOTICE_KEY = "viewed-notice"

function Notice() {
    const [opened, { open, close }] = useDisclosure(false);

    const key = localStorage.getItem(NOTICE_KEY)

    useEffect(() => {
        if (!key) {
            open()
        }
    }, [])

    function acceptAndClose() {
        localStorage.setItem(NOTICE_KEY, "true")
        close()
    }

    return (
        <>
            <Modal withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false} opened={opened} onClose={acceptAndClose}>
                <Stack>
                    <div>
                        Thank you for trying out Map-o-Matic v2!
                    </div>
                    <div>
                        This map editor is not yet at a point where I consider it finished.
                    </div>
                    <div>
                        Please feel free to <Anchor href={"https://github.com/mattbruv/ccsr/issues/new"} target={"_blank"}>open an issue on GitHub</Anchor> to request:
                        <List>
                            <ListItem>New or Missing Features</ListItem>
                            <ListItem>UI/UX Improvements</ListItem>
                            <ListItem>Bug Reports</ListItem>
                        </List>
                    </div>
                    <Button onClick={acceptAndClose} color={"green"}><div>I Understand</div></Button>
                </Stack>
            </Modal>
        </>
    );

}


export default Notice