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
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";

import IconVolumeOff from "@mui/icons-material/VolumeOff";
import IconVolume from "@mui/icons-material/VolumeUp";
import IconVideo from "@mui/icons-material/PersonalVideo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GameSettings } from "./App";
import { Game } from "../src/game";

export interface SettingsCallbacks {
  setSmooth: (value: boolean) => void;
  setVolumeTheme: (value: number) => void;
  setVolumeMaster: (value: number) => void;
  setLanguage: (value: string) => void;
}

type SettingsProps = {
  game: Game;
  settings: GameSettings;
  open: boolean;
  cbs: SettingsCallbacks;
  closeCB: () => void;
};

export class Settings extends React.Component<SettingsProps, GameSettings> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = props.settings;
  }

  render(): React.ReactNode {
    return (
      <Drawer
        onClose={this.props.closeCB}
        anchor="right"
        open={this.props.open}
      >
        <Stack sx={{ minWidth: 350 }} spacing={0}>
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
              <Typography id="input-slider" gutterBottom>
                Music
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
              >
                {this.state.volumeTheme == 0 ? (
                  <IconVolumeOff />
                ) : (
                  <IconVolume />
                )}
                <Slider
                  value={this.state.volumeTheme}
                  onChange={(event, val) => {
                    this.setState({ volumeTheme: val as number }, () => {
                      this.props.cbs.setVolumeTheme(val as number);
                    });
                  }}
                />
                <IconVolume />
              </Stack>

              <Typography id="" gutterBottom>
                Sound Effects
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
              >
                {this.state.volumeMaster == 0 ? (
                  <IconVolumeOff />
                ) : (
                  <IconVolume />
                )}
                <Slider
                  value={this.state.volumeMaster}
                  onChange={(event, val) => {
                    this.setState({ volumeMaster: val as number }, () => {
                      this.props.cbs.setVolumeMaster(val as number);
                    });
                  }}
                />
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
                  <Tooltip
                    arrow
                    title="The original game runs at 12 FPS. Enabling this will interpolate animations at your screen's native refresh rate."
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(event) => {
                            const val = event.target.checked;
                            this.setState({ smoothAnimations: val }, () => {
                              this.props.cbs.setSmooth(event.target.checked);
                            });
                          }}
                          checked={this.state.smoothAnimations}
                        />
                      }
                      label="Smooth animations"
                    />
                  </Tooltip>
                  <FormControlLabel
                    control={
                      <Checkbox disabled checked={this.state.fullScreen} />
                    }
                    label="Fit canvas to screen"
                  />
                  <FormControlLabel
                    control={<Checkbox disabled />}
                    label="Use original aspect ratio"
                  />
                  <FormControl fullWidth>
                    <InputLabel disabled id="">
                      Camera Mode
                    </InputLabel>
                    <Select
                      disabled
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              IconComponent={() => {
                return <b>hi</b>;
              }}
              value={this.state.language}
              label="Language"
              onChange={(event) => {
                this.setState({ language: event.target.value }, () => {
                  this.props.cbs.setLanguage(event.target.value);
                });
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Drawer>
    );
  }
}
