import { useEffect, useState } from 'react'
import { getEqualScores, skillsAnalysis, clbEEScore } from './scoreList'
import { PTEDataType } from '../type/PTEDataType'
import ProgressBar from './ProgressBar'
import clsx from 'clsx'
import Draggable from 'react-draggable'

const ContentUI = () => {
  const [scoresComparison, setScoresComparison] = useState<
    {
      testName:
        | 'PTE'
        | 'CLB'
        | 'IELTS(G)'
        | 'Points for EE(Without Spouse)'
        | 'Points for EE(With Spouse)'
        | 'Points for EE(As Spouse)'
      listening?: number
      reading?: number
      speaking?: number
      writing?: number
    }[]
  >([])
  const [skillsProfile, setSkillsProfile] = useState<
    Array<{ key: string; name: string; score: number; skills: string[] }>
  >([])
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
      // console.log('content script received:', e.data.type, e.data.data);
      // console.log(typeof e.data.data);
      try {
        // console.log(JSON.parse(e.data.data));
        const pteData: PTEDataType = JSON.parse(e.data.data)
        setShowContent(true)
        // console.log('JSON', JSON.stringify(pteData));
        processData(pteData)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.log('error', error);
      }
    })
  }, [])

  const processData = (pteData: PTEDataType) => {
    const scoreList: {
      name: 'Listening' | 'Speaking' | 'Reading' | 'Writing'
      score: number
      clb?: number
      ieltsCore?: number
    }[] = [
      { name: 'Listening', score: pteData.communicativeSkills.listening },
      { name: 'Reading', score: pteData.communicativeSkills.reading },
      { name: 'Speaking', score: pteData.communicativeSkills.speaking },
      { name: 'Writing', score: pteData.communicativeSkills.writing },
    ]
    scoreList.forEach((item) => {
      const equivalentScore = getEqualScores(String(item.score), item.name)
      item.clb = equivalentScore?.clb
      item.ieltsCore = equivalentScore?.[`ielts${item.name}`]
    })

    const scoresComparisonList: {
      testName:
        | 'PTE'
        | 'CLB'
        | 'IELTS(G)'
        | 'Points for EE(Without Spouse)'
        | 'Points for EE(With Spouse)'
        | 'Points for EE(As Spouse)'
      listening?: number
      reading?: number
      speaking?: number
      writing?: number
    }[] = [
      {
        testName: 'PTE',
        listening: pteData.communicativeSkills.listening,
        reading: pteData.communicativeSkills.reading,
        speaking: pteData.communicativeSkills.speaking,
        writing: pteData.communicativeSkills.writing,
      },
      {
        testName: 'CLB',
        listening: scoreList[0].clb,
        reading: scoreList[1].clb,
        speaking: scoreList[2].clb,
        writing: scoreList[3].clb,
      },
      {
        testName: 'IELTS(G)',
        listening: scoreList[0].ieltsCore,
        reading: scoreList[1].ieltsCore,
        speaking: scoreList[2].ieltsCore,
        writing: scoreList[3].ieltsCore,
      },
      {
        testName: 'Points for EE(Without Spouse)',
        // @ts-expect-error this is a number
        listening: clbEEScore[`clb${scoreList[0].clb}`].withoutSpouse,
        // @ts-expect-error this is a number
        reading: clbEEScore[`clb${scoreList[1].clb}`].withoutSpouse,
        // @ts-expect-error this is a number
        speaking: clbEEScore[`clb${scoreList[2].clb}`].withoutSpouse,
        // @ts-expect-error this is a number
        writing: clbEEScore[`clb${scoreList[3].clb}`].withoutSpouse,
      },
      {
        testName: 'Points for EE(With Spouse)',
        // @ts-expect-error this is a number
        listening: clbEEScore[`clb${scoreList[0].clb}`].withSpouse,
        // @ts-expect-error this is a number
        reading: clbEEScore[`clb${scoreList[1].clb}`].withSpouse,
        // @ts-expect-error this is a number
        speaking: clbEEScore[`clb${scoreList[2].clb}`].withSpouse,
        // @ts-expect-error this is a number
        writing: clbEEScore[`clb${scoreList[3].clb}`].withSpouse,
      },
      {
        testName: 'Points for EE(As Spouse)',
        // @ts-expect-error this is a number
        listening: clbEEScore[`clb${scoreList[0].clb}`].asSpouse,
        // @ts-expect-error this is a number
        reading: clbEEScore[`clb${scoreList[1].clb}`].asSpouse,
        // @ts-expect-error this is a number
        speaking: clbEEScore[`clb${scoreList[2].clb}`].asSpouse,
        // @ts-expect-error this is a number
        writing: clbEEScore[`clb${scoreList[3].clb}`].asSpouse,
      },
    ]

    // console.log('first', scoresComparisonList);

    // setScores(scoreList);
    setScoresComparison(scoresComparisonList)

    const skillsProfile: Array<{
      key: string
      name: string
      score: number
      skills: string[]
    }> = []
    for (const key in pteData.skillsProfile) {
      if (Object.prototype.hasOwnProperty.call(pteData.skillsProfile, key)) {
        // @ts-expect-error this is a number
        const element: number = pteData.skillsProfile[key]
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
          // @ts-expect-error err
          skills: skillsAnalysis[key],
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
        <div className="fixed left-10 top-40 z-[9999]">
          <div
            className={clsx(
              'relative box-border flex flex-col overflow-auto rounded-xl bg-sky-50 text-sm text-slate-900 shadow-cyan-950/55 transition-all',
              minimize
                ? 'h-6 w-6 overflow-hidden p-0'
                : 'h-[576px] max-h-[71vh] w-[554px] p-4',
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
            <div className="mt-1 text-base font-bold">Score</div>
            <table className="mt-1 w-full border-collapse border-y-2 border-slate-400 text-center">
              <thead className="border-b border-slate-400">
                <tr>
                  <th className="border-r border-slate-400"></th>
                  <th className="px-2">Listening</th>
                  <th className="px-2">Reading</th>
                  <th className="px-2">Speaking</th>
                  <th className="px-2">Writing</th>
                  <th className="border-l border-slate-400 px-2">Total</th>
                </tr>
              </thead>
              <tbody className="">
                {scoresComparison.map((item) => (
                  <tr
                    key={item.testName}
                    className="transition-colors odd:bg-blue-100 even:bg-blue-50 hover:bg-slate-300"
                  >
                    {item.testName === 'PTE' && (
                      <td className="border-r border-slate-400 px-2 text-right">
                        Your PTE score
                      </td>
                    )}

                    {item.testName === 'CLB' && (
                      <td className="border-r border-slate-400 px-2 text-right">
                        CLB
                      </td>
                    )}

                    {item.testName === 'IELTS(G)' && (
                      <td className="border-r border-slate-400 px-2 text-right">
                        Equivalent to IELTS(G) score
                      </td>
                    )}

                    {item.testName === 'Points for EE(Without Spouse)' && (
                      <td className="border-r border-slate-400 px-2 text-right">
                        Pts for EE (Without Spouse)
                      </td>
                    )}

                    {item.testName === 'Points for EE(With Spouse)' && (
                      <td className="border-r border-slate-400 px-2 text-right">
                        Pts for EE (With Spouse)
                      </td>
                    )}
                    {item.testName === 'Points for EE(As Spouse)' && (
                      <td className="border-r border-slate-400 px-2 text-right">
                        Pts for EE (As Spouse)
                      </td>
                    )}

                    <td>{item.listening}</td>
                    <td>{item.reading}</td>
                    <td>{item.speaking}</td>
                    <td>{item.writing}</td>

                    <td className="border-l border-slate-400">
                      {item.testName === 'Points for EE(Without Spouse)' ||
                      item.testName === 'Points for EE(With Spouse)' ||
                      item.testName === 'Points for EE(As Spouse)'
                        ? item.listening! +
                          item.reading! +
                          item.speaking! +
                          item.writing!
                        : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-base font-bold">Sub-Skills Score</div>
            <div className="mt-1">
              {skillsProfile.map((skill) => (
                <div key={skill.key} className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-700">{skill.name}</div>
                    <div className="mb-[1px] ml-4 flex items-center justify-end">
                      <div className="">{skill.skills.join(', ')}</div>
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
                    </div>
                  </div>
                  <ProgressBar progress={skill.score} />
                </div>
              ))}
              <div className="text-right">
                <a
                  className="w-full text-sm font-semibold text-sky-700 !no-underline opacity-10 transition-opacity hover:opacity-100"
                  target="_blank"
                  href="https://gaohaoyang.github.io/pte-crx-page/?scrollTo=donation"
                >
                  Sponsor me for a cup of coffee!
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
