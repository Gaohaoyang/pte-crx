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
    console.log('PTE core Sub-Scores Chrome Extension is working.')
    // console.log('content script start');
    // inject injected script
    const s = document.createElement('script')
    s.src = chrome.runtime.getURL('injected.js')
    s.onload = function () {
      // @ts-expect-error this is injected script
      this.remove()
    }
    ;(document.head || document.documentElement).appendChild(s)

    // receive message from injected script
    window.addEventListener('message', function (e) {
      if (!e.data.type.startsWith('xhr')) {
        return
      }
      // console.log('content script received:', e.data.type, e.data.data)
      try {
        if (e.data.type === 'xhr-scorereport') {
          const pteData: PTEDataType = JSON.parse(e.data.data)
          setShowContent(true)
          // console.log('JSON', JSON.stringify(pteData));
          setPteData(pteData)
        }
        if (e.data.type === 'xhr-appointments') {
          const appointments: AppointmentsType = JSON.parse(e.data.data)
          console.log('appointments', appointments)
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              <a href="https://github.com/Gaohaoyang/pte-crx" target="_blank">
                <VscGithubInverted className="text-slate-300 transition-all duration-300 hover:scale-110 hover:cursor-pointer hover:text-slate-900" />
              </a>
            </div>
            {pteScore && examName?.name === 'PTECore' ? (
              <PTECoreTable pteScore={pteScore} />
            ) : null}
            {pteScore && examName?.name === 'PTEAcademic' ? (
              <PTEAcademicTable pteScore={pteScore} />
            ) : null}

            <div className="mt-2 text-base font-bold">Sub-Skills Score</div>
            <div className="">
              {skillsProfile.map((skill) => (
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
                          'ml-2 font-bold',
                          skill.score < 80
                            ? skill.score < 60
                              ? 'text-red-700'
                              : 'text-yellow-600'
                            : 'text-green-700',
                        )}
                      >
                        {skill.score}
                      </div>
                      <div className="flex w-8 items-center justify-end">
                        {skill.support.map((support) => {
                          switch (support) {
                            case 'Listening':
                              return <PiHeadphones className="text-slate-600" />
                            case 'Reading':
                              return (
                                <PiBookOpenUser className="text-slate-600" />
                              )
                            case 'Speaking':
                              return (
                                <PiChatsCircle className="text-slate-600" />
                              )
                            case 'Writing':
                              return <PiPenNib className="text-slate-600" />
                          }
                        })}
                      </div>
                    </div>
                  </div>
                  <ProgressBar progress={skill.score} />
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
        </div>
      </Draggable>
    </>
  )
}

export default ContentUI
