import { useEffect, useRef } from "react"
import { useMapOMaticContext } from "./context/MapOMaticContext"

function RendererPage() {

    const { renderer } = useMapOMaticContext()
    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.appendChild(renderer.app.view)
        }
    }, [])

    return (
        <div ref={canvasRef}></div>
    )
}


export default RendererPage