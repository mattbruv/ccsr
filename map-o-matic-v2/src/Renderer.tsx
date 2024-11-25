import { useEffect, useRef } from "react"
import CCSRRenderer from "./ccsr/renderer"

function RendererPage() {

    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.appendChild(CCSRRenderer.app.view)
            CCSRRenderer.app.resizeTo = canvasRef.current
        }
    }, [])

    return (
        <div style={{
            // just make it fucking 100% width and height always, fuck CSS
            // does anyone actually understand how CSS works?
            minHeight: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            height: "100%",
            width: "100%",
            // backgroundColor: "yellow"
        }} ref={canvasRef}></div>
    )
}


export default RendererPage