type Props = {
  progress: number;
  total?: number;
};
const ProgressBar = (props) => {
  const { progress, total = 90 } = props;
  return (
    <div className="w-full h-1 bg-slate-300 rounded-sm">
      <div
        className="bg-cyan-600 h-1 rounded-sm"
        style={{ width: `${(progress / total) * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
