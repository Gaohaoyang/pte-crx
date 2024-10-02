import {
  PiBookOpenUser,
  PiHeadphones,
  PiPenNib,
  PiChatsCircle,
} from 'react-icons/pi'
import { getEqualScoresOfPTEAcademic } from '../scoreList'

interface PTEAcademicTableProps {
  pteScore: {
    listening: number
    reading: number
    speaking: number
    writing: number
  }
}

const PTEAcademicTable = (props: PTEAcademicTableProps) => {
  const { pteScore } = props
  const scoreList: {
    name: 'Listening' | 'Speaking' | 'Reading' | 'Writing'
    score: number
    ieltsCore?: number
  }[] = [
    { name: 'Listening', score: pteScore.listening },
    { name: 'Reading', score: pteScore.reading },
    { name: 'Speaking', score: pteScore.speaking },
    { name: 'Writing', score: pteScore.writing },
  ]

  scoreList.forEach((item) => {
    const equivalentScore = getEqualScoresOfPTEAcademic(String(item.score), item.name)
    item.ieltsCore = equivalentScore?.[`ielts${item.name}`]
  })

  const scoresComparisonList: {
    testName: 'PTE' | 'IELTS'
    listening?: number
    reading?: number
    speaking?: number
    writing?: number
  }[] = [
    {
      testName: 'PTE',
      listening: pteScore.listening,
      reading: pteScore.reading,
      speaking: pteScore.speaking,
      writing: pteScore.writing,
    },
    {
      testName: 'IELTS',
      listening: scoreList[0].ieltsCore,
      reading: scoreList[1].ieltsCore,
      speaking: scoreList[2].ieltsCore,
      writing: scoreList[3].ieltsCore,
    },
  ]

  return (
    <table className="w-full border-collapse border-y-2 border-slate-400 text-center text-sm">
      <thead className="border-b border-slate-400">
        <tr>
          <th className="border-r border-slate-400"></th>
          <th className="px-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs">Listening</div>
              <PiHeadphones className="text-slate-600" />
            </div>
          </th>
          <th className="px-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs">Reading</div>
              <PiBookOpenUser className="text-slate-600" />
            </div>
          </th>
          <th className="px-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs">Speaking</div>
              <PiChatsCircle className="text-slate-600" />
            </div>
          </th>
          <th className="px-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs">Writing</div>
              <PiPenNib className="text-slate-600" />
            </div>
          </th>
          {/* <th className="border-l border-slate-400 px-2">Total</th> */}
        </tr>
      </thead>
      <tbody className="">
        {scoresComparisonList.map((item) => (
          <tr
            key={item.testName}
            className="transition-colors odd:bg-blue-100 even:bg-blue-50 hover:bg-slate-300"
          >
            {item.testName === 'PTE' && (
              <td className="border-r border-slate-400 px-2 text-right">
                Your PTE Academic score
              </td>
            )}

            {item.testName === 'IELTS' && (
              <td className="border-r border-slate-400 px-2 text-right">
                Equivalent to IELTS score
              </td>
            )}

            <td>{item.listening}</td>
            <td>{item.reading}</td>
            <td>{item.speaking}</td>
            <td>{item.writing}</td>

            {/* <td className="border-l border-slate-400">
              {item.testName === 'Points for EE(Without Spouse)' ||
              item.testName === 'Points for EE(With Spouse)' ||
              item.testName === 'Points for EE(As Spouse)'
                ? item.listening! +
                  item.reading! +
                  item.speaking! +
                  item.writing!
                : ''}
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PTEAcademicTable
