import { OptionButton } from "@/types"
import { cn } from "@/utils/cn"
const styles:Record<NonNullable<OptionButton["kind"]>,string>={
  primary:"bg-white text-black hover:opacity-90",
  secondary:"bg-white/10 text-white hover:bg-white/15",
  whatsapp:"bg-[#25D366] text-black hover:opacity-90",
  call:"bg-blue-400 text-black hover:opacity-90"
}
export default function ActionButtons({buttons}:{buttons?:OptionButton[]}){
  if(!buttons?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((b,i)=>(
        <a key={i} href={b.href||"#"} className={cn("px-3 py-2 rounded-xl text-sm transition",styles[b.kind||"secondary"])} target={b.href?.startsWith("http")?"_blank":undefined}>{b.label}</a>
      ))}
    </div>
  )
}