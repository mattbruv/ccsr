import React from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  IconButton,
  Link,
  SvgIcon,
  Tooltip,
  Button,
  Stack,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Github from "@mui/icons-material/GitHub";
import Discord from "@mui/icons-material/Forum";

type NavbarProps = {
  openPageCB: (page: string) => void;
  openSettingsCB: () => void;
  page: string;
};

type NavbarState = {};

export class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
  }
  render(): React.ReactNode {
    return (
      <AppBar position="static">
        <Toolbar>
          <Stack sx={{ flexGrow: 1 }} direction="row">
            <Button
              disabled={this.props.page == "home"}
              onClick={() => this.props.openPageCB("home")}
              key="home"
              sx={{ mx: 1, my: 2, color: "inherit", display: "block" }}
            >
              Home
            </Button>
            <Button
              disabled={this.props.page == "about"}
              key="about"
              onClick={() => this.props.openPageCB("about")}
              sx={{ mx: 1, my: 2, color: "inherit", display: "block" }}
            >
              About
            </Button>
          </Stack>
          <Tooltip arrow title="Join us on Discord!">
            <Link
              color="inherit"
              href="https://discord.gg/ecnGChM6M4"
              target="_blank"
            >
              <IconButton size="large" color="inherit">
                <Discord />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip arrow title="View the source code">
            <Link
              color="inherit"
              href="https://github.com/mattbruv/ccsr-port"
              target="_blank"
            >
              <IconButton size="large" color="inherit">
                <Github />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip arrow title="Settings">
            <IconButton
              onClick={() => {
                this.props.openSettingsCB();
              }}
              size="large"
              color="inherit"
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}
