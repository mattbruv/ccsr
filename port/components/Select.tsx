import * as React from "react";
import { Box, Container } from "@mui/system";
import { Alert, Card, CardMedia, Grid } from "@mui/material";

interface EpisodeCardProps {
  t: any;
  img: string;
  language: string;
  episode: string;
  playEpisodeCB: (episode: string) => void;
}

function needsTranslation(lang: string, episode: string): boolean {
  const key = `${lang}-${episode}`;
  const help: string[] = ["pt-scooby-1", "pt-scooby-2"];
  return help.includes(key);
}

function EpisodeCard(props: EpisodeCardProps) {
  return (
    <div>
      <Card sx={{ maxWidth: 345, backgroundColor: "transparent" }}>
        <CardMedia
          onClick={() => props.playEpisodeCB(props.episode)}
          component="img"
          className="episode"
          image={props.img}
          alt=""
        />
      </Card>
      {needsTranslation(props.language, props.episode) && (
        <Alert severity="error">{props.t.needsTranslation}</Alert>
      )}
    </div>
  );
}

interface SelectProps {
  t: any;
  playCB: (episode: string) => void;
  languageString: string;
}

export function SelectEpisode(props: SelectProps) {
  const img = (episode: string, lang?: string) => {
    const language = lang ? lang : "en";
    const str = `assets/${episode}/${language}/title.png`;
    return str;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid container justifyContent="center" item xs={12} md={12} lg={3}>
            <EpisodeCard
              t={props.t}
              playEpisodeCB={props.playCB}
              episode={"1"}
              language={props.languageString}
              img={img("1", props.languageString)}
            />
          </Grid>
          <Grid container justifyContent="center" item xs={12} md={12} lg={3}>
            <EpisodeCard
              t={props.t}
              playEpisodeCB={props.playCB}
              episode={"2"}
              language={props.languageString}
              img={img("2", props.languageString)}
            />
          </Grid>
          <Grid container justifyContent="center" item xs={12} md={12} lg={3}>
            <EpisodeCard
              t={props.t}
              playEpisodeCB={props.playCB}
              episode={"3"}
              language={props.languageString}
              img={img("3", props.languageString)}
            />
          </Grid>
          <Grid container justifyContent="center" item xs={12} md={12} lg={3}>
            <EpisodeCard
              t={props.t}
              playEpisodeCB={props.playCB}
              episode={"4"}
              language={props.languageString}
              img={img("4", props.languageString)}
            />
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "3rem" }}>
          <Grid container justifyContent="center" item xs={12} md={12} lg={12}>
            <EpisodeCard
              t={props.t}
              playEpisodeCB={props.playCB}
              episode={"scooby-1"}
              language={props.languageString}
              img={img("scooby-1", props.languageString)}
            />
            <EpisodeCard
              t={props.t}
              playEpisodeCB={props.playCB}
              episode={"scooby-2"}
              language={props.languageString}
              img={img("scooby-2", props.languageString)}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
