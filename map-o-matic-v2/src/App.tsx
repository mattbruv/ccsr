import { AppShell, Burger, Flex, Group, NavLink, ScrollArea, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconApple, IconImageInPicture, IconMap, IconSettings, IconWorld } from '@tabler/icons-react';
import { Link, Route, Routes } from 'react-router-dom';
import WorldEditor from './WorldEditor';
import MapEditor from './MapEditor';
import ObjectEditor from './ObjectEditor';
import { useState } from 'react';
import { Project } from './ccsr/types';
import ProjectPage from './Project';
import { MapOMatic, MapOMaticContext, newProject } from './context/MapOMaticContext';
import { CCSRRenderer } from './ccsr/renderer';
import RendererPage from './Renderer';
import Images from './Images';

const renderer = new CCSRRenderer();

function App() {

  const [navOpened, { toggle: toggleNav }] = useDisclosure(true);

  const [project, setProject] = useState<Project>(newProject())

  const mapOMatic: MapOMatic = {
    project,
    updateProject: (newProject, reloadImages: boolean | undefined = false) => {
      setProject(newProject)
      renderer.renderProject(newProject, reloadImages)
    },
    updateMap: (newMap) => {
      const newProject: Project = {
        ...project,
        maps: project.maps.map((map) =>
          map.random_id === newMap.random_id ? newMap : map
        ),
      }
      setProject(newProject);
      renderer.renderMap(newMap)
    },
    updateState: (newState) => {
      setProject({
        ...project,
        state: newState
      })
    },
    renderer
  }

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
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <AppShell.Section grow my="md" component={ScrollArea}>
              <NavLink
                label="Project"
                component={Link}
                to={"/project"}
                leftSection={<IconSettings size="1rem" />}
              />
              <NavLink
                label="World Editor"
                component={Link}
                to={"/world"}
                leftSection={<IconWorld size="1rem" />}
              />
              <NavLink
                component={Link}
                to={"/map"}
                label="Map Editor"
                leftSection={<IconMap size="1rem" />}
              />
              <NavLink
                component={Link}
                to={"/object"}
                label="Object Editor"
                leftSection={<IconApple size="1rem" />}
              />
              <NavLink
                component={Link}
                to={"/images"}
                label={"Images (" + project.images.length + ")"}
                leftSection={<IconImageInPicture size="1rem" />}
              />
            </AppShell.Section>
            <AppShell.Section>
              <Text size="xs">
                Map-O-Matic v2
              </Text>
            </AppShell.Section>
          </AppShell.Navbar>
          <AppShell.Main>
            <Flex style={{ height: '100vh' }}> {/* Full height container */}
              <ScrollArea style={{ width: '50%', height: '100%' }}> {/* Left pane */}
                <Routes>
                  <Route path='/' element={<ProjectPage />} />
                  <Route path='/project' element={<ProjectPage />} />
                  <Route path='/world' element={<WorldEditor />} />
                  <Route path='/map' element={<MapEditor />} />
                  <Route path='/object' element={<ObjectEditor />} />
                  <Route path='/event' element={<WorldEditor />} />
                  <Route path='/images' element={<Images />} />
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
