import { act, useEffect, useRef } from "react"
import { useMapOMaticContext } from "./context/MapOMaticContext"
import cytoscape, { EdgeDefinition, ElementsDefinition, NodeDefinition } from "cytoscape"
import dagre from "cytoscape-dagre"
import { DagreLayoutOptions } from "cytoscape-dagre"
import { MapObject } from "./ccsr/game/types"

cytoscape.use(dagre)

// Filtering function to lower the objects we need to search through to relevant ones only
function isRelevantMapObject(obj: MapObject): boolean {
    const CONDs = obj.data.item.COND.filter(x => Object.values(x).some(v => v !== ""))
    if (CONDs.length) return true

    // Also show any objects that have their visibilty changed
    const visiChanges = Object.values(obj.data.item.visi).some(x => x !== "")

    return visiChanges
}

export type Node = {
    data: {
        id: string // internal ID used to track nodes in Cytoscape
        name: string // Name shown for this node on the graph
        image?: string // Image source
    }
}

function EventGraph() {
    const cytoscapeRef = useRef<cytoscape.Core | null>(null)
    const containerRef = useRef(null)
    const { project } = useMapOMaticContext()

    type MapObjectData = {
        obj: MapObject,
        mapName: string
    }

    const relevantObjects: MapObjectData[] = project.maps
        .flatMap(map =>
            map.data.objects
                .filter(isRelevantMapObject)
                .map(obj => ({ obj, mapName: map.filename }))
        )

    const conds = relevantObjects
        .flatMap(({ obj }) => obj.data.item.COND)

    // Get a set of object names
    const condObjs = [...new Set(conds.flatMap(x => [x.hasObj, x.giveObj]))]
        .filter(obj => obj !== "")

    // Get a set of act names
    const condActs = [...new Set(conds.flatMap(x => [x.hasAct, x.giveAct]))]
        .filter(act => act !== "")

    // Represents not a game object, but rather a CCSR object
    const objNodes: Node[] = condObjs.map(x => ({
        data: {
            id: x,
            name: x,
            image: GetMemberImage(x)
        }
    }))

    // Represents a CCSR act
    const actNodes: Node[] = condActs.map(x => ({
        data: {
            id: x,
            name: x,
            // image: "none"
        }
    }))

    // Represents an actual game object which is capable of modifying acts/objects
    const gameObjectNodes: Node[] = relevantObjects.map(({ obj, mapName }) => {
        return {
            data: {
                id: obj.random_id,
                name: `${obj.member} (${mapName})`,
                image: GetMemberImage(obj.member)
            }
        }
    })

    const inventoryNodes: Node[] = [...objNodes, ...actNodes]
    const nodes: Node[] = [...inventoryNodes, ...gameObjectNodes]

    const edges: EdgeDefinition[] = inventoryNodes.flatMap(inventoryNode => {
        return relevantObjects.flatMap(({ obj }) => {
            const edges: EdgeDefinition[] = []
            const thingId = inventoryNode.data.id

            const conds = obj.data.item.COND.flatMap(x => x)
            const { visi } = obj.data.item

            // Create mapping from thing to object
            if (
                conds.some(cond => cond.hasAct === thingId || cond.hasObj === thingId) ||
                // if the item unhides this object, show the edge
                Object.values(visi).includes(thingId)
            ) {
                edges.push({
                    data: {
                        id: `${thingId}->${obj.random_id}`,
                        source: thingId,
                        target: obj.random_id
                    }
                })
            }

            // Create mapping from object to thing 
            if (conds.some(cond => cond.giveAct === thingId || cond.giveObj === thingId)) {
                edges.push({
                    data: {
                        id: `${obj.random_id}->${thingId}`,
                        source: obj.random_id,
                        target: thingId,
                    }
                })
            }

            return edges
        })
    })

    const elements: ElementsDefinition = {
        nodes,
        edges
    }

    const layout: DagreLayoutOptions = {
        name: "dagre",
        fit: true,
        nodeDimensionsIncludeLabels: true,
        //@ts-ignore
        align: "UL",
        ranker: "longest-path",
        rankDir: "TB"
    }

    useEffect(() => {
        cytoscapeRef.current = cytoscape({
            container: containerRef.current,
            elements,
            layout,
            style: [
                {
                    selector: "node",
                    style: {
                        "background-color": "#666",
                        "background-clip": "none",
                        "text-wrap": "wrap",
                        label: "data(name)",
                    }
                },
                {
                    selector: "node[image]",
                    style: {
                        "background-color": "#666",
                        "background-image": "data(image)", // specify some image
                        "background-image-smoothing": "no",
                        "background-clip": "none",
                        "background-opacity": 0,
                        "text-wrap": "wrap",
                        label: "data(name)",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 3,
                        "line-color": "#ccc",
                        "curve-style": "bezier",
                        "target-arrow-color": "#ccc",
                        "target-arrow-shape": "triangle",
                    },
                }
            ]
        })

        return () => {
            if (cytoscapeRef.current) {
                cytoscapeRef.current.destroy()
            }
        }
    }, [])

    return (
        <>
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%' }}
            />
        </>
    )

    function GetMemberImage(member: string): string {
        const image = project.images.find(x => x.filename.toLowerCase() === member.toLowerCase() ||
            x.filename.toLowerCase() + ".x" === member.toLowerCase()
        )
        return (image) ? URL.createObjectURL(image.data) : "none"
    }
}

export default EventGraph