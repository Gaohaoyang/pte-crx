import { useEffect, useState } from 'react';
import { getEqualScores, skillsAnalysis, clbEEScore } from './scoreList';
import { PTEDataType } from '../type/PTEDataType';
import ProgressBar from './ProgressBar';
import clsx from 'clsx';
import Draggable from 'react-draggable';

const ContentUI = () => {
  const [scoresComparison, setScoresComparison] = useState<
    {
      testName:
        | 'PTE'
        | 'CLB'
        | 'IELTS(G)'
        | 'Points for EE(Without Spouse)'
        | 'Points for EE(With Spouse)'
        | 'Points for EE(As Spouse)';
      listening?: number;
      reading?: number;
      speaking?: number;
      writing?: number;
    }[]
  >([]);
  const [skillsProfile, setSkillsProfile] = useState<
    Array<{ key: string; name: string; score: number; skills: string[] }>
  >([]);
  const [minimize, setMinimize] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    console.log('PTE core Sub-Scores Chrome Extension is working.');
    // console.log('content script start');
    // inject injected script
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('injected.js');
    s.onload = function () {
      // @ts-expect-error this is injected script
      this.remove();
    };
    (document.head || document.documentElement).appendChild(s);

    // receive message from injected script
    window.addEventListener('message', function (e) {
      // console.log('content script received:', e.data.type, e.data.data);
      // console.log(typeof e.data.data);
      try {
        // console.log(JSON.parse(e.data.data));
        const pteData: PTEDataType = JSON.parse(e.data.data);
        setShowContent(true);
        // console.log('JSON', JSON.stringify(pteData));
        processData(pteData);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.log('error', error);
      }
    });
  }, []);

  const processData = (pteData: PTEDataType) => {
    const scoreList: {
      name: 'Listening' | 'Speaking' | 'Reading' | 'Writing';
      score: number;
      clb?: number;
      ieltsCore?: number;
    }[] = [
      { name: 'Listening', score: pteData.communicativeSkills.listening },
      { name: 'Reading', score: pteData.communicativeSkills.reading },
      { name: 'Speaking', score: pteData.communicativeSkills.speaking },
      { name: 'Writing', score: pteData.communicativeSkills.writing },
    ];
    scoreList.forEach((item) => {
      const equivalentScore = getEqualScores(String(item.score), item.name);
      item.clb = equivalentScore?.clb;
      item.ieltsCore = equivalentScore?.[`ielts${item.name}`];
    });

    const scoresComparisonList: {
      testName:
        | 'PTE'
        | 'CLB'
        | 'IELTS(G)'
        | 'Points for EE(Without Spouse)'
        | 'Points for EE(With Spouse)'
        | 'Points for EE(As Spouse)';
      listening?: number;
      reading?: number;
      speaking?: number;
      writing?: number;
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
    ];

    // console.log('first', scoresComparisonList);

    // setScores(scoreList);
    setScoresComparison(scoresComparisonList);

    const skillsProfile: Array<{ key: string; name: string; score: number; skills: string[] }> = [];
    for (const key in pteData.skillsProfile) {
      if (Object.prototype.hasOwnProperty.call(pteData.skillsProfile, key)) {
        // @ts-expect-error this is a number
        const element: number = pteData.skillsProfile[key];
        let showName = key;
        if (key === 'openResponseSpeakingWriting') {
          showName = 'Open Response Speaking and Writing';
        } else if (key === 'reproducingSpokenWrittenLanguage') {
          showName = 'Reproducing Spoken and Written Language';
        } else if (key === 'writingExtended') {
          showName = 'Extended Writing';
        } else if (key === 'writingShort') {
          showName = 'Short Writing';
        } else if (key === 'speakingExtended') {
          showName = 'Extended Speaking';
        } else if (key === 'speakingShort') {
          showName = 'Short Speaking';
        } else if (key === 'multipleSkillsComprehension') {
          showName = 'Multiple-skills Comprehension';
        } else if (key === 'singleSkillComprehension') {
          showName = 'Single-skill Comprehension';
        }

        // @ts-expect-error err
        skillsProfile.push({ key, name: showName, score: element, skills: skillsAnalysis[key] });
      }
    }
    setSkillsProfile(skillsProfile);
    setTimeout(() => {
      setMinimize(false);
    }, 80);
  };

  const [dragging, setDragging] = useState(false);

  if (!showContent) {
    return null;
  }

  return (
    <>
      <Draggable
        handle="strong"
        onStart={() => {
          setDragging(true);
        }}
        onStop={() => {
          setDragging(false);
        }}
      >
        <div className="fixed top-40 left-10 z-[9999]">
          <div
            className={clsx(
              'bg-sky-50 rounded-xl text-sm overflow-auto text-slate-900 flex flex-col box-border shadow-cyan-950/55 transition-all',
              minimize ? 'w-6 h-6 p-0 overflow-hidden' : 'w-[554px] h-[557px] max-h-[70vh] p-4',
              dragging ? 'scale-105 shadow-2xl' : 'scale-100 shadow-md',
            )}
          >
            <strong
              className={clsx(
                'w-full h-6 hover:bg-slate-200/75 absolute top-0 left-0 cursor-move rounded-t-full rounded-bl-full transition-colors duration-300',
                dragging && 'bg-slate-200/75',
              )}
            >
              <div
                className="w-6 h-6 absolute top-0 left-0 cursor-pointer z-50 bg-sky-50 rounded-full shadow-sm"
                onClick={() => {
                  setMinimize(() => !minimize);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {minimize ? (
                  <img
                    src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/add-line.svg"
                    className="w-5 h-5 absolute top-[0.125rem] left-[0.125rem]"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/subtract-fill.svg"
                    className="w-5 h-5 absolute top-[0.125rem] left-[0.125rem]"
                    alt=""
                  />
                )}
              </div>
            </strong>
            <div className="text-base font-bold mt-1">Score</div>
            <table className="mt-1 text-center border-collapse w-full border-y-2 border-slate-400">
              <thead className="border-b border-slate-400">
                <tr>
                  <th className="border-r border-slate-400"></th>
                  <th className="px-2">Listening</th>
                  <th className="px-2">Reading</th>
                  <th className="px-2">Speaking</th>
                  <th className="px-2">Writing</th>
                  <th className="px-2 border-l border-slate-400">Total</th>
                </tr>
              </thead>
              <tbody className="">
                {scoresComparison.map((item) => (
                  <tr
                    key={item.testName}
                    className="even:bg-blue-50 odd:bg-blue-100 hover:bg-slate-300 transition-colors"
                  >
                    {item.testName === 'PTE' && (
                      <td className="border-r border-slate-400 px-2 text-right">Your PTE score</td>
                    )}

                    {item.testName === 'CLB' && (
                      <td className="border-r border-slate-400 px-2 text-right">CLB</td>
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
                        ? item.listening! + item.reading! + item.speaking! + item.writing!
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
                  <div className="flex justify-between items-center">
                    <div className="text-slate-700">{skill.name}</div>
                    <div className="flex justify-end items-center ml-4 mb-[1px]">
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
            </div>
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default ContentUI;
