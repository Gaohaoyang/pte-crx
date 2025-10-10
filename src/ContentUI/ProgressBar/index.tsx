import { useEffect, useState } from 'react'

type Props = {
  progress: number
  total?: number
}
const ProgressBar = (props: Props) => {
  const { progress, total = 90 } = props
  const [progressInner, setProgressInner] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setProgressInner(progress)
    }, 500)
  }, [progress])
  return (
    <div className="h-1 w-full rounded-full bg-slate-300 relative overflow-hidden">
      <div
        className="duration-700 ease-out absolute -left-full top-0 h-1 w-full rounded-full bg-cyan-600 transition-transform"
        style={{ transform: `translateX(${(progressInner / total) * 100}%)` }}
      ></div>
    </div>
  )
}

export default ProgressBar
