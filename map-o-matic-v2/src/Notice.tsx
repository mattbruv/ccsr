import { Modal, Button, Stack, Anchor, List, ListItem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCoffee } from "@tabler/icons-react";
import { useEffect } from "react";

const NOTICE_KEY = "viewed-notice"

type NoticeProps = {
    opened: boolean,
    open: () => void
    close: () => void
}


function Notice({ opened, open, close }: NoticeProps) {

    const key = localStorage.getItem(NOTICE_KEY)

    useEffect(() => {
        if (!key) {
            open()
        }
    }, [])

    function acceptAndClose() {

        if (!key) {
            modals.open({
                title: "First Time Tip",
                children: (
                    <>
                        <div>
                            You don't have to start a project from scratch.
                            Click on "Load Project" and you can choose from one of the original episodes!
                        </div>
                    </>
                )
            })
        }

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
                        This map editor is not yet at a point where I would consider it <i>fully</i> finished.
                    </div>
                    <div>
                        Please feel free to <Anchor href={"https://github.com/mattbruv/ccsr/issues/new"} target={"_blank"}>open an issue on GitHub</Anchor> to request:
                        <List>
                            <ListItem>New or Missing Features</ListItem>
                            <ListItem>UI/UX Improvements</ListItem>
                            <ListItem>Bug Reports</ListItem>
                        </List>
                    </div>
                    <div>
                        If you found this tool to be useful or interesting,
                        or you enjoy my work and want to say thanks, feel free
                        to <Anchor href={"https://ko-fi.com/mp3259"} target={"_blank"}>
                            buy me a coffee <IconCoffee size={16} />
                        </Anchor>
                    </div>
                    <Button onClick={acceptAndClose} color={"green"}><div>I Understand</div></Button>
                </Stack>
            </Modal>
        </>
    );

}


export default Notice