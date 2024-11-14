import { ActionIcon, Anchor, AppShell, Burger, Button, Flex, Group, Modal, NavLink, NumberInput, ScrollArea, Stack, Switch, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconApple, IconCamera, IconGraph, IconImageInPicture, IconMap, IconSchema, IconSettings, IconWorld } from '@tabler/icons-react';
import { Link, Route, Routes } from 'react-router-dom';
import MapEditor from './MapEditor';
import ObjectEditor from './ObjectEditor';
import { useState } from 'react';
import { Project } from './ccsr/types';
import ProjectPage from './Project';
import { MapOMatic, MapOMaticContext, newProject } from './context/MapOMaticContext';
import CCSRRenderer from './ccsr/renderer';
import RendererPage from './Renderer';
import Images from './Images';
import Notice from './Notice';
import EventGraph from './EventGraph';

export enum MapOMaticPage {
  Project = "/project",
  MapEditor = "/map",
  ObjectEditor = "/object",
  Images = "/images",
  EventGraph = "/event-graph"
}

function App() {

  const [navOpened, { toggle: toggleNav }] = useDisclosure(true);
  const [project, setProject] = useState<Project>(newProject())

  const mapOMatic: MapOMatic = {
    project,
    rerenderProject: () => {
      CCSRRenderer.renderProject(project, true)
    },
    updateProject: (newProject, reloadImages: boolean | undefined = false, rerender: boolean = true) => {
      setProject(newProject)
      if (rerender) {
        CCSRRenderer.renderProject(newProject, reloadImages)
      }
    },
    updateMap: (newMap, rerender = true) => {
      const newProject: Project = {
        ...project,
        maps: project.maps.map((map) =>
          map.random_id === newMap.random_id ? newMap : map
        ),
      }
      setProject(newProject);
      if (rerender) {
        CCSRRenderer.renderMap(newMap)
      }
    },
    updateState: (newState) => {
      setProject({
        ...project,
        state: newState
      })
    },
    centerOnMap: (map_id) => {
      CCSRRenderer.centerOnMap(map_id)
    }
  }

  // DEBUG: TODO: REMOVE EVENTUALLY
  // CANNOT be used with React Strict Mode, as it runs effects twice
  // which causes the shit to load twice, what a stupid waste of many hours of my life
  // to figure that out
  /*
  useEffect(() => {
    loadZipFromServer("1.zip").then((project) => {
      project.metadata.author = "Funny Garbage"
      project.metadata.name = "TEMPORARY 1"
      mapOMatic.updateProject(project, true)
    })
  }, [])
  */

  const [screenshotModalOpened, { open, close }] = useDisclosure(false);
  const [screenshotScale, setScreenshotScale] = useState<string | number>(1)
  const [screenshotAll, setScreenshotAll] = useState(true)

  function takeScreenshot(): void {
    const scale = CCSRRenderer.viewport.scale
    const size = parseInt(screenshotScale.toString())
    CCSRRenderer.viewport.scale.set(size)
    CCSRRenderer.app.renderer.extract.image(CCSRRenderer.viewport).then((image) => {
      CCSRRenderer.viewport.scale.set(scale.x, scale.y)
      const link = document.createElement("a");
      link.href = image.src.replace("image/png", "image/octet-stream");
      link.download = "my_image.png";
      link.click();
    });


  }

  const [noticeOpened, noticeCallbacks] = useDisclosure(false);

  return (
    <>
      <MapOMaticContext.Provider value={mapOMatic}>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 200,
            breakpoint: "sm",
            collapsed: { desktop: !navOpened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md">
              <Burger opened={navOpened} onClick={toggleNav} visibleFrom="sm" size="sm" />
              <ActionIcon onClick={open} color={"gray"}>
                <IconCamera />
              </ActionIcon>
              <Modal opened={screenshotModalOpened} onClose={close} title="Save Screenshot">
                <Stack>
                  <NumberInput
                    label="Screenshot Scale"
                    min={1}
                    max={10}
                    value={screenshotScale}
                    onChange={setScreenshotScale}
                    description="The scale of the resulting screenshot"
                  />
                  <Switch
                    label="Screenshot Entire World"
                    checked={screenshotAll}
                    onChange={(x) => setScreenshotAll(x.target.checked)}
                  />
                  <Button onClick={() => takeScreenshot()}>Take Screenshot</Button>
                </Stack>
              </Modal>
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <AppShell.Section grow my="md" component={ScrollArea}>
              <NavLink
                label="Project"
                component={Link}
                to={MapOMaticPage.Project}
                leftSection={<IconSettings size="1rem" />}
              />
              <NavLink
                component={Link}
                to={MapOMaticPage.MapEditor}
                label="Map Editor"
                leftSection={<IconMap size="1rem" />}
              />
              <NavLink
                component={Link}
                to={MapOMaticPage.ObjectEditor}
                label="Object Editor"
                leftSection={<IconApple size="1rem" />}
              />
              <NavLink
                component={Link}
                to={MapOMaticPage.Images}
                label={"Images (" + project.images.length + ")"}
                leftSection={<IconImageInPicture size="1rem" />}
              />
              <NavLink
                component={Link}
                to={MapOMaticPage.EventGraph}
                label={"Event Graph"}
                leftSection={<IconSchema size="1rem" />}
              />
            </AppShell.Section>
            <AppShell.Section>
              <div onClick={noticeCallbacks.open}>
                <Anchor>
                  <Text size="xs">
                    Map-O-Matic v2
                  </Text>
                </Anchor>
              </div>
            </AppShell.Section>
          </AppShell.Navbar>
          <AppShell.Main>
            <Notice close={noticeCallbacks.close} open={noticeCallbacks.open} opened={noticeOpened} />
            <Flex style={{ height: '85vh' }}> {/* Full height container */}
              <ScrollArea style={{ width: '50%', height: '100%' }}> {/* Left pane */}
                <Routes>
                  <Route path='/' element={<ProjectPage />} />
                  <Route path='/project' element={<ProjectPage />} />
                  <Route path='/map' element={<MapEditor />} />
                  <Route path='/object' element={<ObjectEditor />} />
                  <Route path='/images' element={<Images />} />
                  <Route path='/event-graph' element={<EventGraph />} />
                </Routes>
              </ScrollArea>
              <ScrollArea style={{ width: '50%', height: '100%' }}> {/* Right pane */}
                <RendererPage />
              </ScrollArea>
            </Flex>
          </AppShell.Main>
        </AppShell >
      </MapOMaticContext.Provider >
    </>
  )
}

export default App
