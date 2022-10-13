import ImgEp1 from "./images/title1.png";
import ImgEp2 from "./images/title2.png";
import ImgEp3 from "./images/title3.png";
import ImgEp4 from "./images/title4.png";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box, Container } from "@mui/system";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

interface EpisodeCardProps {
  img: string;
  episode: number;
}

function EpisodeCard(props: EpisodeCardProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" image={props.img} alt="" />
      {/*
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Episode {props.episode}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.desc}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="large">
          Play
        </Button>
      </CardActions>
  */}
    </Card>
  );
}

export function SelectEpisode() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid container justifyContent="center" item xs={12} md={6} lg={3}>
            <EpisodeCard episode={1} img={ImgEp1} />
          </Grid>
          <Grid container justifyContent="center" item xs={12} md={6} lg={3}>
            <EpisodeCard episode={2} img={ImgEp2} />
          </Grid>
          <Grid container justifyContent="center" item xs={12} md={6} lg={3}>
            <EpisodeCard episode={3} img={ImgEp3} />
          </Grid>
          <Grid container justifyContent="center" item xs={12} md={6} lg={3}>
            <EpisodeCard episode={4} img={ImgEp4} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
