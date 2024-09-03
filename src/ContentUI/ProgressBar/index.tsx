type Props = {
  progress: number
  total?: number
}
const ProgressBar = (props: Props) => {
  const { progress, total = 90 } = props
  return (
    <div className="h-1 w-full rounded-sm bg-slate-300">
      <div
        className="h-1 rounded-sm bg-cyan-600"
        style={{ width: `${(progress / total) * 100}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar
