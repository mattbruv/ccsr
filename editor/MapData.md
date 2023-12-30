# Map Data Documentation

## Map Object

```ts
export type MapObject = {
  /** The name of the texture to use for this object */
  member: string;

  /** The type of game object */
  type: string;

  /** X, Y starting offset of this object within the map */
  location: MapObjectLocation;

  /** The width in pixels of this game object */
  width: number;

  /** The X-offset shift amount */
  WSHIFT: number;

  /** The height in piexels of this game object */
  height: number;

  /** The Y-offset shift amount */
  HSHIFT: number;

  /** Data related to this game object */
  data: MapObjectData;
};
```

Note: In some rare instances, the x/y location coordinates of game objects can be negative.
