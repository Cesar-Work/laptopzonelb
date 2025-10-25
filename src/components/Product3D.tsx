import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html, useGLTF } from "@react-three/drei"
import { Suspense } from "react"
function Model({url}:{url:string}){ const {scene}=useGLTF(url); return <primitive object={scene}/> }
function Placeholder(){ return (<mesh rotation={[0.3,0.6,0]}><boxGeometry args={[2.2,0.2,1.5]}/><meshStandardMaterial metalness={0.7} roughness={0.2}/></mesh>) }
export default function Product3D({url}:{url?:string}){
  return (
  <div className="h-72 w-full rounded-xl overflow-hidden bg-[#0b0f14] ring-1 ring-white/10">
    <Canvas camera={{position:[3,2,3]}}>
      <Suspense fallback={<Html center>Loading 3Dâ€¦</Html>}>
        {url ? <Model url={url}/> : <Placeholder/>}
        <ambientLight intensity={0.5}/><directionalLight position={[5,5,5]} intensity={1}/>
        <Environment preset="city"/><OrbitControls enablePan={false}/>
      </Suspense>
    </Canvas>
  </div>)
}