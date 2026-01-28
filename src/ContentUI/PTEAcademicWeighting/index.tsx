import {
  PiBookOpenUser,
  PiHeadphones,
  PiPenNib,
  PiChatsCircle,
} from 'react-icons/pi'
import { pteAcademicWeighting, QuestionWeighting } from '../scoreList'

const formatPercent = (value?: number) => {
  if (value === undefined) return '-'
  if (value < 1) return '<1%'
  return `${value}%`
}

const WeightingRow = ({ item }: { item: QuestionWeighting }) => {
  return (
    <tr className="transition-colors odd:bg-blue-100 even:bg-blue-50 hover:bg-slate-300">
      <td className="whitespace-nowrap px-1 py-0.5 text-left font-medium">
        {item.abbr}
      </td>
      <td className="px-1 py-0.5 text-center">{formatPercent(item.overall)}</td>
      <td className="px-1 py-0.5 text-center">
        {formatPercent(item.listening)}
      </td>
      <td className="px-1 py-0.5 text-center">{formatPercent(item.reading)}</td>
      <td className="px-1 py-0.5 text-center">
        {formatPercent(item.speaking)}
      </td>
      <td className="px-1 py-0.5 text-center">{formatPercent(item.writing)}</td>
    </tr>
  )
}

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <tr className="bg-slate-200">
      <td
        colSpan={6}
        className="px-1 py-0.5 text-left text-xs font-semibold text-slate-600"
      >
        {title}
      </td>
    </tr>
  )
}

const PTEAcademicWeighting = () => {
  return (
    <div className="text-xs">
      <div className="mb-1 text-sm font-bold">Question Weighting</div>
      <table className="w-full border-collapse border-y-2 border-slate-400 text-center text-xs">
        <thead className="border-b border-slate-400 bg-slate-100">
          <tr>
            <th className="px-1 py-1 text-left">Type</th>
            <th className="px-1 py-1">
              <div className="flex flex-col items-center justify-center">
                <div className="text-[10px]">Overall</div>
              </div>
            </th>
            <th className="px-1 py-1">
              <div className="flex flex-col items-center justify-center">
                <PiHeadphones className="text-slate-600" title="Listening" />
              </div>
            </th>
            <th className="px-1 py-1">
              <div className="flex flex-col items-center justify-center">
                <PiBookOpenUser className="text-slate-600" title="Reading" />
              </div>
            </th>
            <th className="px-1 py-1">
              <div className="flex flex-col items-center justify-center">
                <PiChatsCircle className="text-slate-600" title="Speaking" />
              </div>
            </th>
            <th className="px-1 py-1">
              <div className="flex flex-col items-center justify-center">
                <PiPenNib className="text-slate-600" title="Writing" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <SectionHeader title="Speaking & Writing" />
          {pteAcademicWeighting.speakingWriting.map((item) => (
            <WeightingRow key={item.abbr} item={item} />
          ))}
          <SectionHeader title="Reading" />
          {pteAcademicWeighting.reading.map((item) => (
            <WeightingRow key={item.abbr} item={item} />
          ))}
          <SectionHeader title="Listening" />
          {pteAcademicWeighting.listening.map((item) => (
            <WeightingRow key={item.abbr} item={item} />
          ))}
        </tbody>
        <tfoot className="border-t border-slate-400 bg-slate-100">
          <tr>
            <td className="px-1 py-0.5 text-left font-semibold">TOTAL</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-1 text-[10px] text-slate-500">
        * Source: PTE Academic Scoring Guide
      </div>
    </div>
  )
}

export default PTEAcademicWeighting
