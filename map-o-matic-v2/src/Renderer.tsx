import { useEffect, useRef } from "react"
import CCSRRenderer from "./ccsr/renderer"

function RendererPage() {

    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.appendChild(CCSRRenderer.app.view)
        }
    }, [])

    return (
        <div ref={canvasRef}></div>
    )
}


export default RendererPage