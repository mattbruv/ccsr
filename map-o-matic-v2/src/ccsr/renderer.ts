import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js"
import { MapFile, Project } from "./types";

export const MAP_WIDTH = 416;
export const MAP_HEIGHT = 320;

export class CCSRRenderer {
    public app: PIXI.Application<HTMLCanvasElement>;
    public viewport: Viewport
    private textures: PIXI.Texture[] = []
    private mapRenders: MapRender[] = []

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
    }

    public renderProject(project: Project, reloadImages: boolean = false) {
        const promise = reloadImages ? this.loadImages(project) : Promise.resolve()

        promise.then(() => {
            this.renderMaps(project)
        })
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
            console.log("existing map not found, adding it")
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
}


class MapRender {
    public randomId: string
    public container: PIXI.Container;
    public name: string;
    public shortName: string;
    public renderTexture: PIXI.RenderTexture;
    public mapSprite: PIXI.Sprite
    public border: PIXI.Graphics
    public grid: PIXI.Graphics

    constructor(mapData: MapFile) {
        this.randomId = mapData.random_id;
        this.container = new PIXI.Container();

        this.renderTexture = PIXI.RenderTexture.create({
            width: MAP_WIDTH,
            height: MAP_HEIGHT
        })

        this.mapSprite = new PIXI.Sprite()
        this.name = mapData.filename

        const name = this.name.split("/").at(-1)?.split(".").at(-2) ?? "0000"
        this.shortName = name;

        const x = parseInt(name.slice(0, 2))
        const y = parseInt(name.slice(2, 4))
        this.container.position.set(x * MAP_WIDTH, y * MAP_HEIGHT)

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
        this.container.addChild(this.mapSprite)
        this.container.addChild(this.grid)
        this.container.addChild(this.border)
    }

    public renderMap(file: MapFile, renderer: PIXI.IRenderer<HTMLCanvasElement>) {
        const objects = file.data?.objects ?? [];

        this.border.visible = file.render.showMapBorder
        this.grid.visible = file.render.showMapGrid

        renderer.render(new PIXI.Sprite(), {
            clear: true,
            renderTexture: this.renderTexture
        })

        for (const object of objects) {

            const member = object.member.replace(".x", "").toLowerCase()
            const tiling = member.includes("tile.")

            const texture = PIXI.utils.TextureCache[member]
            const sprite = !tiling ? new PIXI.Sprite(texture) : new PIXI.TilingSprite(texture)

            const { x, y } = object.location
            const { width, height, WSHIFT, HSHIFT } = object

            sprite.width = width
            sprite.height = height

            sprite.x = x * 16 + WSHIFT
            sprite.y = y * 16 + HSHIFT

            if (!tiling) {
                sprite.x -= Math.round(sprite.width / 2)
                sprite.y -= Math.round(sprite.height / 2)
            }

            renderer.render(sprite, {
                clear: false,
                renderTexture: this.renderTexture
            })
        }
    }

    private drawGrid() {
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

        // Draw lighter gray lines every 8 pixels
        this.grid.lineStyle(1, 0xA9A9A9, 0.5); // 1px thick lighter gray lines
        for (let x = 0; x <= MAP_WIDTH; x += 8) {
            if (x % 32 !== 0) { // Skip every 32-pixel mark (already drawn)
                this.grid.moveTo(x, 0);
                this.grid.lineTo(x, MAP_HEIGHT);
            }
        }
        for (let y = 0; y <= MAP_HEIGHT; y += 8) {
            if (y % 32 !== 0) { // Skip every 32-pixel mark (already drawn)
                this.grid.moveTo(0, y);
                this.grid.lineTo(MAP_WIDTH, y);
            }
        }
    }

}
