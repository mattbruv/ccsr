import React from "react";
import { AppBar, Typography, Toolbar, IconButton, Link } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Github from "@mui/icons-material/GitHub";

type NavbarProps = {
  openSettingsCB: () => void;
};

type NavbarState = {};

export class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
  }
  render(): React.ReactNode {
    return (
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cartoon Cartoon Summer Resort
          </Typography>
          <Link
            color="inherit"
            href="https://github.com/mattbruv/ccsr-port"
            target="_blank"
          >
            <IconButton size="large" color="inherit">
              <Github />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => {
              this.props.openSettingsCB();
            }}
            size="large"
            color="inherit"
          >
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}
