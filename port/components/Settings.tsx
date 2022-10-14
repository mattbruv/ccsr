import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
  Divider,
  Tooltip,
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                <ListItem disablePadding>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Fit canvas to screen"
                    />
                    <Tooltip
                      arrow
                      title="The original game renders at 12 FPS. Enabling this will interpolate animations at your screen's native refresh rate."
                    >
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Smooth animations"
                      />
                    </Tooltip>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Use original aspect ratio"
                    />
                    <FormControl>
                      <InputLabel id="">Camera Mode</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={10}
                        label="Camera Mode"
                        onChange={undefined}
                      >
                        <MenuItem value={10}>Pan Between Maps</MenuItem>
                        <MenuItem value={20}>Center On Player</MenuItem>
                      </Select>
                    </FormControl>
                  </FormGroup>
                </ListItem>
              </AccordionDetails>
            </Accordion>
          </List>
        </Box>
      </Drawer>
    );
  }
}
