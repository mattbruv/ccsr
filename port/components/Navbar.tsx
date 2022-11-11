import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Link,
  Tooltip,
  Button,
  Stack,
  Box,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Github from "@mui/icons-material/GitHub";
import Discord from "@mui/icons-material/Forum";

type NavbarProps = {
  openPageCB: (page: string) => void;
  openSettingsCB: () => void;
  playing: boolean;
  t: any;
  page: string;
  position: "fixed" | "absolute" | "sticky" | "static" | "relative" | undefined;
};

type NavbarState = {
  isHovering: boolean;
};

const tranny = { background: "transparent", boxShadow: "none" };

export class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
    this.state = {
      isHovering: false,
    };
  }

  private getStyle() {
    let style: React.CSSProperties = {};
    if (this.props.playing) {
      style.background = "transparent";
      style.boxShadow = "none";
    }
    return style;
  }

  private toolbarDisplay() {
    let style: React.CSSProperties = {};
    style.display = "block";
    if (this.props.playing) {
      if (this.state.isHovering) {
        style.display = "block";
      } else style.display = "none";
    }
    return style;
  }

  render(): React.ReactNode {
    const t = this.props.t;
    return (
      <AppBar
        style={this.getStyle()}
        position={this.props.position}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
      >
        <Toolbar>
          <Stack sx={{ flexGrow: 1 }} direction="row"></Stack>
          <Box style={this.toolbarDisplay()}>
            <Tooltip arrow title={t.discord}>
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
            <Tooltip arrow title={t.source}>
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
            <Tooltip arrow title={t.settings}>
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
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
}
