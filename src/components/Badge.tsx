import { cn } from "@/utils/cn"
export default function Badge({children,className}:{children:React.ReactNode,className?:string}){
  return <span className={cn("px-2 py-0.5 rounded-full text-xs bg-white/10 border border-white/10",className)}>{children}</span>
}