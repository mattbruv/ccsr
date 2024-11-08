import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js"
import { MapFile, Project, UUID } from "./types";
import { MapObjectMoveCond, MapObjectType } from "./game/types";

export const MAP_WIDTH = 416;
export const MAP_HEIGHT = 320;

const MISSING_TEXTURE = new PIXI.Graphics()

class CCSRRenderer {
    public app: PIXI.Application<HTMLCanvasElement>;
    public viewport: Viewport
    public textures: PIXI.Texture[] = []
    public mapRenders: MapRender[] = []

    constructor() {
        this.app = new PIXI.Application({
            antialias: false,
            backgroundColor: 0xff00ff
        })

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

        this.viewport = new Viewport({
            events: this.app.renderer.events
        })

        this.viewport.drag().pinch().wheel().decelerate()
        this.app.stage.addChild(this.viewport)

        MISSING_TEXTURE.beginFill(0xff00ff)
        MISSING_TEXTURE.drawRect(0, 0, 32, 32)
        MISSING_TEXTURE.beginFill(0x000000)
        MISSING_TEXTURE.drawRect(0, 0, 16, 16)
        MISSING_TEXTURE.drawRect(16, 16, 16, 16)
        MISSING_TEXTURE.endFill()
    }

    public async renderProject(project: Project, reloadImages: boolean = false) {
        const promise = reloadImages ? this.loadImages(project) : Promise.resolve()
        await promise
        this.renderMaps(project)
    }

    public async loadImages(project: Project) {

        // Remove existing textures from the cache and reset them
        for (const texture of this.textures) {
            PIXI.Texture.removeFromCache(texture)
            texture.destroy(true)
        }

        this.textures = []

        for (const image of project.images) {
            const objectURL = URL.createObjectURL(image.data)
            const texture = await PIXI.Texture.fromURL(objectURL)
            PIXI.Texture.addToCache(texture, image.filename.toLowerCase())
            this.textures.push(texture)
        }
    }

    public renderMap(map: MapFile) {
        let mapRender = this.mapRenders.find(x => x.randomId === map.random_id)

        if (!mapRender) {
            mapRender = new MapRender(map)
            this.mapRenders.push(mapRender)
            this.viewport.addChild(mapRender.container)
        }

        mapRender.renderMap(map, this.app.renderer)
    }

    private renderMaps(project: Project) {
        for (const map of project.maps) {
            this.renderMap(map)
        }
    }

    public centerOnMap(map_id: UUID) {
        const map = this.mapRenders.find(x => x.randomId === map_id)
        if (!map) return;
        const { x, y } = map.container.position
        const HW = MAP_WIDTH / 2
        const HH = MAP_HEIGHT / 2
        this.viewport.moveCenter(x + HW, y + HH)

    }
}


const objCollisionColors: Record<MapObjectType, PIXI.ColorSource> = {
    [MapObjectType.FLOR]: "00FF00",
    [MapObjectType.WALL]: "FF0000",
    [MapObjectType.CHAR]: "FFFF00",
    [MapObjectType.ITEM]: "00FFFF",
    [MapObjectType.WATER]: "0000FF",
    [MapObjectType.DOOR]: "00FF00",
    [MapObjectType.Scooby2_floor]: "00FF00"
}

class MapRender {
    public randomId: UUID
    public container: PIXI.Container;
    public renderTexture: PIXI.RenderTexture;
    public mapSprite: PIXI.Sprite
    public border: PIXI.Graphics
    public grid: PIXI.Graphics

    public collisionRenderTexture: PIXI.RenderTexture;
    public collisionSprite: PIXI.Sprite

    constructor(mapData: MapFile) {
        this.randomId = mapData.random_id;
        this.container = new PIXI.Container();
        this.collisionSprite = new PIXI.Sprite();

        this.renderTexture = PIXI.RenderTexture.create({
            width: MAP_WIDTH,
            height: MAP_HEIGHT
        })

        this.collisionRenderTexture = PIXI.RenderTexture.create({
            width: MAP_WIDTH,
            height: MAP_HEIGHT
        })

        this.mapSprite = new PIXI.Sprite()

        this.border = new PIXI.Graphics();
        this.border.lineStyle({
            width: 2,
            alpha: 1,
            alignment: 0
        })
        this.border.drawRect(0, 0, MAP_WIDTH, MAP_HEIGHT)
        this.border.endFill()

        this.grid = new PIXI.Graphics();
        this.drawGrid()

        this.mapSprite.texture = this.renderTexture
        this.collisionSprite.texture = this.collisionRenderTexture

        this.container.addChild(this.mapSprite)
        this.container.addChild(this.collisionSprite)
        this.container.addChild(this.border)
    }

    public renderMap(file: MapFile, renderer: PIXI.IRenderer<HTMLCanvasElement>) {

        try {
            const x = parseInt(file.filename.slice(0, 2))
            let y = parseInt(file.filename.slice(2, 4))
            if (file.filename.length !== 4) {
                y += 1.25
            }
            this.container.position.set(x * MAP_WIDTH, y * MAP_HEIGHT)
        }
        catch (e) {
            this.container.position.set(0, 0)
        }

        const objects = file.data?.objects ?? [];

        this.border.visible = file.render.showMapBorder
        this.grid.visible = file.render.showMapGrid
        this.collisionSprite.visible = file.render.showCollision
        this.collisionSprite.alpha = 1.0

        // Clear render textures
        renderer.render(new PIXI.Sprite(), {
            clear: true,
            renderTexture: this.renderTexture
        })

        renderer.render(new PIXI.Sprite(), {
            clear: true,
            renderTexture: this.collisionRenderTexture
        })

        const collision = new PIXI.Graphics()

        for (const object of objects) {

            const member = object.member.replace(".x", "").toLowerCase()
            const tiling = member.includes("tile.")

            const texture = (PIXI.utils.TextureCache[member] !== undefined) ?
                PIXI.utils.TextureCache[member] :
                renderer.generateTexture(MISSING_TEXTURE)

            const spriteContainer = new PIXI.Container();
            const sprite = !tiling ? new PIXI.Sprite(texture) : new PIXI.TilingSprite(texture)

            const { x, y } = object.location
            const { width, height, WSHIFT, HSHIFT } = object
            const objectType = object.data.item.type;

            sprite.width = width
            sprite.height = height

            sprite.x = x * 16 + WSHIFT
            sprite.y = y * 16 + HSHIFT

            if (!tiling) {
                sprite.x -= Math.round(sprite.width / 2)
                sprite.y -= Math.round(sprite.height / 2)
            }

            // Object render settings
            sprite.alpha = object.render.alpha
            spriteContainer.addChild(sprite)

            if (object.render.outline) {
                const square = new PIXI.Graphics();
                square.lineStyle({
                    color: 0x00ffff,
                    width: 3
                })
                square.drawRect(0, 0, sprite.width, sprite.height)
                square.position.set(sprite.x, sprite.y)
                spriteContainer.addChild(square)
            }

            renderer.render(spriteContainer, {
                clear: false,
                renderTexture: this.renderTexture
            })

            // Draw this object's collision if we're showing collision
            if (file.render.showCollision) {
                let fillColor = objCollisionColors[objectType]
                // If the object is push-able, color it differently
                if (object.data.move.COND === MapObjectMoveCond.Push) {
                    fillColor = "333333"
                }
                collision.beginFill(fillColor, 1)

                // If the object is a floor, show the additional overlap bounds
                if (objectType === MapObjectType.FLOR) {
                    collision.beginFill(fillColor, 0.5)
                    // The padding used is basically 75% of a tile, or 24 pixels.
                    // A tile is 8 * 4 wide, and the player can never fully be a WALL tile,
                    // But they can walk over a WALL tile if a FLOOR is next to it, but they
                    // can never fully leave the FLOOR onto the WALL. Since the player moves
                    // In 8 pixel steps, this means we can only take (8 * 3) steps onto the wall tile
                    // instead of (8 * 4) steps.
                    const pad = 8 * 3
                    collision.drawRect(sprite.x - pad, sprite.y - pad, sprite.width + pad * 2, sprite.height + pad * 2)
                }

                collision.drawRect(sprite.x, sprite.y, sprite.width, sprite.height)
                collision.endFill()
            }
        }

        renderer.render(collision, {
            clear: false,
            renderTexture: this.collisionRenderTexture
        })

        if (file.render.showMapGrid) {
            renderer.render(this.grid, {
                clear: false,
                renderTexture: this.renderTexture
            })
        }

        this.collisionSprite.alpha = file.render.collisionAlpha
    }

    private drawGrid() {
        // Draw lighter gray lines every 16 pixels
        this.grid.lineStyle(1, 0xA9A9A9, 0.5); // 1px thick lighter gray lines
        for (let x = 0; x <= MAP_WIDTH; x += 16) {
            if (x % 32 !== 0) { // Skip every 32-pixel mark (already drawn)
                this.grid.moveTo(x, 0);
                this.grid.lineTo(x, MAP_HEIGHT);
            }
        }
        for (let y = 0; y <= MAP_HEIGHT; y += 16) {
            if (y % 32 !== 0) { // Skip every 32-pixel mark (already drawn)
                this.grid.moveTo(0, y);
                this.grid.lineTo(MAP_WIDTH, y);
            }
        }

        // Draw black lines every 32 pixels
        this.grid.lineStyle(1, 0x000000, 0.5); // 2px thick black lines
        for (let x = 0; x <= MAP_WIDTH; x += 32) {
            this.grid.moveTo(x, 0);
            this.grid.lineTo(x, MAP_HEIGHT);
        }
        for (let y = 0; y <= MAP_HEIGHT; y += 32) {
            this.grid.moveTo(0, y);
            this.grid.lineTo(MAP_WIDTH, y);
        }

    }

}

const MapOMaticRenderer = new CCSRRenderer()
export default MapOMaticRenderer