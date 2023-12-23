declare namespace CCSR {
  // Contains all information related to a game
  export type Project = {
    maps: File.MapFile[];
    metadata: Metadata;
  };

  // Contains metadata about a project
  export type Metadata = {
    name: string;
    author: string;
  };
}
