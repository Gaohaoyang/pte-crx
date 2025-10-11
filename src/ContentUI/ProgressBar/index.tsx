import { useEffect, useState } from 'react'

type Props = {
  progress: number
  total?: number
  delay?: number
}
const ProgressBar = (props: Props) => {
  const { progress, total = 90, delay = 0 } = props
  const [progressInner, setProgressInner] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setProgressInner(progress)
    }, 500 + delay)
  }, [progress, delay])
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-slate-300">
      <div
        className="absolute -left-full top-0 h-1 w-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.5)] transition-transform duration-700 ease-out"
        style={{ transform: `translateX(${(progressInner / total) * 100}%)` }}
      ></div>
    </div>
  )
}

export default ProgressBar
