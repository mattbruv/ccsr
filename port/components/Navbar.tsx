import React from "react";
import { AppBar, Typography, Toolbar, IconButton } from "@mui/material";
import Settings from "@mui/icons-material/Settings";

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
          <IconButton
            onClick={() => {
              this.props.openSettingsCB();
            }}
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}
