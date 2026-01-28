import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  PiBookOpenUser,
  PiHeadphones,
  PiPenNib,
  PiChatsCircle,
} from 'react-icons/pi'
import {
  pteAcademicWeighting,
  calculateQuestionTypeScore,
  QuestionWeighting,
} from '../scoreList'
import ProgressBar from '../ProgressBar'
import { SkillsProfile } from '../../type/PTEDataType'

interface PTEAcademicQuestionScoresProps {
  pteScore: {
    listening: number
    reading: number
    speaking: number
    writing: number
    overall: number
  }
  skillsProfile?: SkillsProfile
}

const useCountAnimation = (targetValue: number, duration = 1000, delay = 0) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const startTime = Date.now() + delay
    const endValue = targetValue

    const animate = () => {
      const now = Date.now()
      if (now < startTime) {
        requestAnimationFrame(animate)
        return
      }

      const progress = Math.min((now - startTime) / duration, 1)
      const currentCount = Math.round(progress * endValue * 10) / 10

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [targetValue, duration, delay])

  return count
}

const AnimatedScore = ({ score, delay }: { score: number; delay: number }) => {
  const animatedScore = useCountAnimation(score, 1000, delay)
  return <>{animatedScore.toFixed(1)}</>
}

const formatPercent = (value?: number) => {
  if (value === undefined) return '-'
  if (value < 1) return '<1%'
  return `${value}%`
}

const QuestionRow = ({
  item,
  score,
  index,
}: {
  item: QuestionWeighting
  score: number
  index: number
}) => {
  return (
    <tr className="transition-colors odd:bg-blue-100 even:bg-blue-50 hover:bg-slate-300">
      <td className="whitespace-nowrap px-1 py-0.5 text-left font-medium text-slate-700">
        {item.abbr}
      </td>
      <td className="min-w-[200px] px-1 py-0.5">
        <div className="flex flex-col">
          <span className="whitespace-nowrap text-[10px] text-slate-500">{item.name}</span>
          <ProgressBar progress={score} delay={index * 50} />
        </div>
      </td>
      <td
        className={clsx(
          'w-6 px-1 py-0.5 text-right font-bold',
          score < 60
            ? 'text-red-600'
            : score < 80
              ? 'text-yellow-600'
              : 'text-green-600',
        )}
      >
        <AnimatedScore score={score} delay={index * 50} />
      </td>
      <td className="px-1 py-0.5 text-center text-slate-500">
        {formatPercent(item.overall)}
      </td>
      <td className="px-1 py-0.5 text-center text-slate-500">
        {formatPercent(item.listening)}
      </td>
      <td className="px-1 py-0.5 text-center text-slate-500">
        {formatPercent(item.reading)}
      </td>
      <td className="px-1 py-0.5 text-center text-slate-500">
        {formatPercent(item.speaking)}
      </td>
      <td className="px-1 py-0.5 text-center text-slate-500">
        {formatPercent(item.writing)}
      </td>
    </tr>
  )
}

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <tr className="bg-slate-200">
      <td
        colSpan={8}
        className="px-1 py-0.5 text-left text-xs font-semibold text-slate-600"
      >
        {title}
      </td>
    </tr>
  )
}

const PTEAcademicQuestionScores = (props: PTEAcademicQuestionScoresProps) => {
  const { pteScore, skillsProfile } = props

  // Calculate scores for all question types
  const speakingWritingScores = pteAcademicWeighting.speakingWriting.map(
    (item) => ({
      item,
      score: calculateQuestionTypeScore(item, pteScore, skillsProfile),
    }),
  )

  const readingScores = pteAcademicWeighting.reading.map((item) => ({
    item,
    score: calculateQuestionTypeScore(item, pteScore, skillsProfile),
  }))

  const listeningScores = pteAcademicWeighting.listening.map((item) => ({
    item,
    score: calculateQuestionTypeScore(item, pteScore, skillsProfile),
  }))

  let globalIndex = 0

  return (
    <div className="text-xs">
      <div className="mb-2 text-sm font-bold">
        Question Type Scores & Weighting
      </div>
      <table className="w-full border-collapse border-y-2 border-slate-400 text-xs">
        <thead className="border-b border-slate-400 bg-slate-100">
          <tr>
            <th className="px-1 py-1 text-left">Type</th>
            <th className="px-1 py-1 text-left">Your Sub-score</th>
            <th className="px-1 py-1 text-center"></th>
            <th className="px-1 py-1 text-center text-[10px]">Overall</th>
            <th className="px-1 py-1">
              <PiHeadphones
                className="mx-auto text-slate-600"
                title="Listening"
              />
            </th>
            <th className="px-1 py-1">
              <PiBookOpenUser
                className="mx-auto text-slate-600"
                title="Reading"
              />
            </th>
            <th className="px-1 py-1">
              <PiChatsCircle
                className="mx-auto text-slate-600"
                title="Speaking"
              />
            </th>
            <th className="px-1 py-1">
              <PiPenNib className="mx-auto text-slate-600" title="Writing" />
            </th>
          </tr>
        </thead>
        <tbody>
          <SectionHeader title="Speaking & Writing" />
          {speakingWritingScores.map(({ item, score }) => (
            <QuestionRow
              key={item.abbr}
              item={item}
              score={score}
              index={globalIndex++}
            />
          ))}
          <SectionHeader title="Reading" />
          {readingScores.map(({ item, score }) => (
            <QuestionRow
              key={item.abbr}
              item={item}
              score={score}
              index={globalIndex++}
            />
          ))}
          <SectionHeader title="Listening" />
          {listeningScores.map(({ item, score }) => (
            <QuestionRow
              key={item.abbr}
              item={item}
              score={score}
              index={globalIndex++}
            />
          ))}
        </tbody>
        <tfoot className="border-t border-slate-400 bg-slate-100">
          <tr>
            <td colSpan={3} className="px-1 py-0.5 text-left font-semibold">
              TOTAL
            </td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
            <td className="px-1 py-0.5 text-center font-semibold">100%</td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-1 text-[10px] text-slate-400">
        * Estimated sub-scores based on skill weighting. Source:{' '}
        <a
          href="https://www.pearsonpte.com/ctf-assets/yqwtwibiobs4/UK8K7chHjNJhW9paYHxBd/8e89376c8a2a1d2efee4e3c0ec8200ee/pte-scoring-info-for-partners-report.pdf"
          target="_blank"
        >
          PTE Academic Question Weighting
        </a>
      </div>
    </div>
  )
}

export default PTEAcademicQuestionScores
