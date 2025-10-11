import { useEffect, useState } from 'react'
import { skillsAnalysis, skillsAnalysisAcademic } from './scoreList'
import { PTEDataType } from '../type/PTEDataType'
import ProgressBar from './ProgressBar'
import clsx from 'clsx'
import Draggable from 'react-draggable'
import {
  PiBookOpenUser,
  PiHeadphones,
  PiPenNib,
  PiChatsCircle,
} from 'react-icons/pi'
import { VscGithubInverted } from 'react-icons/vsc'
import PTECoreTable from './PTECoreTable'
import { AppointmentsType } from '../type/AppointmentsType'
import PTEAcademicTable from './PTEAcademicTable'

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
      const currentCount = Math.floor(progress * endValue)

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
  return <>{animatedScore}</>
}

const ContentUI = () => {
  const [pteScore, setPteScore] = useState<{
    listening: number
    reading: number
    speaking: number
    writing: number
  }>()

  const [skillsProfile, setSkillsProfile] = useState<
    Array<{
      key: string
      name: string
      score: number
      skills: string[][]
      support: Array<'Listening' | 'Reading' | 'Speaking' | 'Writing'>
    }>
  >([])

  const [examName, setExamName] = useState<{
    originName: string
    name: 'PTECore' | 'PTEAcademic'
  }>()
  const [pteData, setPteData] = useState<PTEDataType>()

  const [minimize, setMinimize] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('PTESubScore_examName')
      localStorage.removeItem('PTESubScore_pteData')
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  useEffect(() => {
    // listen url
    const onPopState = () => {
      console.log('URL changed to:', window.location.href)
    }

    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    // console.log('content script start');
    // inject injected script
    // console.log('PTE Sub-Scores Breakdown, start to inject script.')
    // const s = document.createElement('script')
    // s.src = chrome.runtime.getURL('injected.js')
    // s.onload = function () {
    //   // @ts-expect-error this is injected script
    //   this.remove()
    // }
    // ;(document.head || document.documentElement).appendChild(s)

    if (localStorage.getItem('PTESubScore_pteData')) {
      setPteData(
        JSON.parse(localStorage.getItem('PTESubScore_pteData') || '{}'),
      )
    }
    if (localStorage.getItem('PTESubScore_examName')) {
      setExamName(
        JSON.parse(localStorage.getItem('PTESubScore_examName') || '{}'),
      )
    }

    // receive message from injected script
    window.addEventListener('message', function (e) {
      if (!e.data?.type?.startsWith('xhr')) {
        return
      }
      // console.log('PTE Sub-Scores Breakdown, start to receive message.')
      // console.log(
      //   'PTE Sub-Scores Breakdown, start to receive message2',
      //   e.data.data,
      // )
      try {
        if (e.data.type === 'xhr-scorereport') {
          console.log(
            'PTE Sub-Scores Breakdown, receive scorereport.',
            e.data.data,
          )

          const pteData: PTEDataType = e.data.data
          setShowContent(true)
          // console.log('JSON', JSON.stringify(pteData));
          setPteData(pteData)
          // console.log('pteData', pteData)
        }
        if (e.data.type === 'xhr-appointments') {
          const appointments: AppointmentsType = e.data.data
          // console.log('appointments', appointments)
          if (appointments[0].examName === 'PTE Core') {
            setExamName({
              originName: appointments[0].examName,
              name: 'PTECore',
            })
          } else {
            setExamName({
              originName: appointments[0].examName,
              name: 'PTEAcademic',
            })
          }
        }
      } catch (error) {
        console.log('error--->', error)
      }
    })
  }, [])

  useEffect(() => {
    if (pteData && examName) {
      processData(pteData, examName)
    }
  }, [pteData, examName])

  const processData = (
    pteData: PTEDataType,
    examName: {
      originName: string
      name: 'PTECore' | 'PTEAcademic'
    },
  ) => {
    setPteScore({
      listening: pteData.communicativeSkills.listening,
      reading: pteData.communicativeSkills.reading,
      speaking: pteData.communicativeSkills.speaking,
      writing: pteData.communicativeSkills.writing,
    })

    // setScoresComparison(scoresComparisonList)

    const skillsProfile: Array<{
      key: string
      name: string
      score: number
      skills: string[][]
      support: Array<'Listening' | 'Reading' | 'Speaking' | 'Writing'>
    }> = []
    for (const key in pteData.skillsProfile) {
      if (Object.prototype.hasOwnProperty.call(pteData.skillsProfile, key)) {
        const element: number =
          pteData.skillsProfile[key as keyof typeof pteData.skillsProfile]
        let showName = key
        if (key === 'openResponseSpeakingWriting') {
          showName = 'Open Response Speaking and Writing'
        } else if (key === 'reproducingSpokenWrittenLanguage') {
          showName = 'Reproducing Spoken and Written Language'
        } else if (key === 'writingExtended') {
          showName = 'Extended Writing'
        } else if (key === 'writingShort') {
          showName = 'Short Writing'
        } else if (key === 'speakingExtended') {
          showName = 'Extended Speaking'
        } else if (key === 'speakingShort') {
          showName = 'Short Speaking'
        } else if (key === 'multipleSkillsComprehension') {
          showName = 'Multiple-skills Comprehension'
        } else if (key === 'singleSkillComprehension') {
          showName = 'Single-skill Comprehension'
        }

        skillsProfile.push({
          key,
          name: showName,
          score: element,
          skills:
            examName.name === 'PTECore'
              ? skillsAnalysis[key as keyof typeof skillsAnalysis].component
              : skillsAnalysisAcademic[
                  key as keyof typeof skillsAnalysisAcademic
                ].component,
          support:
            examName.name === 'PTECore'
              ? (skillsAnalysis[key as keyof typeof skillsAnalysis]
                  .support as Array<
                  'Listening' | 'Reading' | 'Speaking' | 'Writing'
                >)
              : (skillsAnalysisAcademic[
                  key as keyof typeof skillsAnalysisAcademic
                ].support as Array<
                  'Listening' | 'Reading' | 'Speaking' | 'Writing'
                >),
        })
      }
    }
    setSkillsProfile(skillsProfile)
    setShowContent(true)
    setTimeout(() => {
      setMinimize(false)
    }, 80)
  }

  const [dragging, setDragging] = useState(false)

  if (!showContent) {
    return null
  }

  return (
    <>
      <Draggable
        handle="strong"
        onStart={() => {
          setDragging(true)
        }}
        onStop={() => {
          setDragging(false)
        }}
      >
        <div className="fixed left-10 top-28 z-[9999]">
          <div
            className={clsx(
              'relative box-border flex flex-col overflow-auto rounded-xl bg-sky-50 text-sm text-slate-900 shadow-cyan-950/55 transition-all',
              minimize
                ? 'h-6 w-6 overflow-hidden p-0'
                : 'h-auto max-h-[81vh] w-auto p-4',
              dragging ? 'scale-[1.02] shadow-2xl' : 'scale-100 shadow-md',
            )}
          >
            <strong
              className={clsx(
                'absolute left-0 top-0 h-6 w-full cursor-move rounded-t-full rounded-bl-full transition-colors duration-300 hover:bg-slate-200/75',
                dragging && 'bg-slate-200/75',
              )}
            >
              <div
                className="absolute left-0 top-0 z-50 h-6 w-6 cursor-pointer rounded-full bg-sky-50 shadow-sm"
                onClick={() => {
                  setMinimize(() => !minimize)
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {minimize ? (
                  <img
                    src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/add-line.svg"
                    className="absolute left-[0.125rem] top-[0.125rem] h-5 w-5"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/subtract-fill.svg"
                    className="absolute left-[0.125rem] top-[0.125rem] h-5 w-5"
                    alt=""
                  />
                )}
              </div>
            </strong>
            <div className="mt-1 flex items-center justify-between text-base font-bold">
              {examName?.originName} Score
              <div className="flex items-center">
                <div className="mr-2 text-xs">
                  Test Date:{' '}
                  {pteData?.testDate.substring(0, 10).replace(/-/g, '/')}
                </div>
                <a href="https://github.com/Gaohaoyang/pte-crx" target="_blank">
                  <VscGithubInverted className="text-slate-300 transition-all duration-300 hover:scale-110 hover:cursor-pointer hover:text-slate-900" />
                </a>
              </div>
            </div>
            {pteScore && examName?.name === 'PTECore' ? (
              <PTECoreTable pteScore={pteScore} />
            ) : null}
            {pteScore && examName?.name === 'PTEAcademic' ? (
              <PTEAcademicTable pteScore={pteScore} />
            ) : null}

            <div className="mt-2 text-base font-bold">Sub-Skills Score</div>
            <div className="">
              {skillsProfile.map((skill, index) => (
                <div key={skill.key} className="mb-3">
                  <div className="flex items-end justify-between">
                    <div className="text-slate-700">{skill.name}</div>
                    <div className="ml-1 flex items-center justify-end">
                      <div className="flex flex-col items-end">
                        {skill.skills.map((skillGroup, index) => (
                          <div key={index} className="text-xs">
                            {skillGroup.join(', ')}
                          </div>
                        ))}
                      </div>
                      <div
                        className={clsx(
                          'ml-2 w-5 font-bold',
                          skill.score < 80
                            ? skill.score < 60
                              ? 'text-red-700'
                              : 'text-yellow-600'
                            : 'text-green-700',
                        )}
                      >
                        <AnimatedScore
                          score={skill.score}
                          delay={index * 100}
                        />
                      </div>
                      <div className="flex w-8 items-center justify-end">
                        {skill.support.map((support, index) => {
                          switch (support) {
                            case 'Listening':
                              return (
                                <PiHeadphones
                                  key={`${skill.key}-${index}`}
                                  className="text-slate-600"
                                />
                              )
                            case 'Reading':
                              return (
                                <PiBookOpenUser
                                  key={`${skill.key}-${index}`}
                                  className="text-slate-600"
                                />
                              )
                            case 'Speaking':
                              return (
                                <PiChatsCircle
                                  key={`${skill.key}-${index}`}
                                  className="text-slate-600"
                                />
                              )
                            case 'Writing':
                              return (
                                <PiPenNib
                                  key={`${skill.key}-${index}`}
                                  className="text-slate-600"
                                />
                              )
                          }
                        })}
                      </div>
                    </div>
                  </div>
                  <ProgressBar progress={skill.score} delay={index * 100} />
                </div>
              ))}
              <div className="text-right text-xs">
                <a
                  className="w-full font-semibold italic text-sky-700 !no-underline opacity-10 transition-opacity hover:opacity-100"
                  target="_blank"
                  href="https://gaohaoyang.github.io/pte-crx-page/?scrollTo=donation"
                >
                  Developed by HyG. Buy me a coffee!
                </a>{' '}
                ☕
              </div>
            </div>
          </div>
          {examName?.name === 'PTECore' && (
            <div
              className={clsx(
                'absolute left-full top-0 ml-6 box-border flex flex-col overflow-auto rounded-xl bg-sky-50 text-sm text-slate-900 shadow-cyan-950/55 transition-all',
                minimize
                  ? 'h-0 w-0 overflow-hidden p-0 opacity-0'
                  : 'h-auto max-h-[81vh] w-auto p-2 opacity-100',
                dragging ? 'scale-[1.02] shadow-xl' : 'scale-100 shadow-md',
              )}
            >
              <a
                className="relative block w-[220px] rounded-xl border p-2 transition-all hover:border-cyan-500 hover:no-underline"
                href="https://ynwac.com/register?code=HYG"
                target="_blank"
              >
                <div className="absolute right-2 top-2 rounded-lg border bg-white/80 px-2 py-0.5 text-xs">
                  Ad
                </div>
                <span className="relative text-xl tracking-wide text-gray-900">
                  <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text font-sans font-black text-transparent">
                    YNWAC
                  </span>
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-blue-500 to-green-400 font-black"></span>
                </span>
                <div className="mt-2">PTE-Core 一站式练习网站</div>
                <div className="">All-in-one practice website</div>
                <div className="">只要开始，就有收获！Just start!</div>
                <div className="mt-2 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 py-1 text-white transition-all hover:from-blue-600 hover:to-cyan-600">
                  开始练习 Start practicing
                </div>
                {/* <div className="mt-2 flex items-center justify-center rounded-lg bg-cyan-500 py-1 text-white" onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  console.log('复制成绩')
                  console.log(pteData)
                  const clipboardData = {
                    gseScore: pteData?.gseScore,
                    communicativeSkills: pteData?.communicativeSkills,
                    skillsProfile: pteData?.skillsProfile,
                    testDate: pteData?.testDate,
                    testCenter: pteData?.testCenter,
                    testCenterId: pteData?.testCenterId,
                    testCenterCountry: pteData?.testCenterCountry,
                    // firstName: pteData?.firstName,
                    // lastName: pteData?.lastName,
                  }
                  console.log(clipboardData)
                  navigator.clipboard.writeText(JSON.stringify(clipboardData))
                }}>
                  复制成绩
                </div> */}
              </a>
            </div>
          )}
        </div>
      </Draggable>
    </>
  )
}

export default ContentUI
