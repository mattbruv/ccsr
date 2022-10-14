import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

import IconVolume from "@mui/icons-material/VolumeUp";
import IconVideo from "@mui/icons-material/PersonalVideo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export class Settings extends React.Component {
  render(): React.ReactNode {
    return (
      <Drawer anchor="right" open={true}>
        <Box>
          <List>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <ListItem key="volume" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <IconVolume />
                    </ListItemIcon>
                    <ListItemText primary="Volume" />
                  </ListItemButton>
                </ListItem>
              </AccordionSummary>
              <AccordionDetails>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ mb: 1 }}
                  alignItems="center"
                >
                  <IconVolume />
                  <Slider aria-label="Volume" value={50} onChange={undefined} />
                  <IconVolume />
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <ListItem key="video" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <IconVideo />
                    </ListItemIcon>
                    <ListItemText primary="Video" />
                  </ListItemButton>
                </ListItem>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </List>
        </Box>
      </Drawer>
    );
  }
}
