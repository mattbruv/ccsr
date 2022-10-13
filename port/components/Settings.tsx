import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";

import IconVolume from "@mui/icons-material/VolumeUp";
import IconVideo from "@mui/icons-material/PersonalVideo";

export class Settings extends React.Component {
  render(): React.ReactNode {
    return (
      <Drawer anchor="right" open={true}>
        <Box>
          <List>
            <ListItem key="volume" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <IconVolume />
                </ListItemIcon>
                <ListItemText primary="Volume" />
              </ListItemButton>
            </ListItem>

            <Divider />

            <ListItem key="video" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <IconVideo />
                </ListItemIcon>
                <ListItemText primary="Video" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    );
  }
}
