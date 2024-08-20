import { useEffect, useState } from 'react';
import { getEqualScores, skillsAnalysis } from './scoreList';
import { PTEDataType } from '../type/PTEDataType';
import ProgressBar from './ProgressBar';
import clsx from 'clsx';

const ContentUI = () => {
  const [scoresComparison, setScoresComparison] = useState<
    {
      testName: 'PTE' | 'CLB' | 'IELTS(G)';
      listening?: number;
      reading?: number;
      speaking?: number;
      writing?: number;
    }[]
  >([]);
  const [skillsProfile, setSkillsProfile] = useState<
    Array<{ key: string; name: string; score: number; skills: string[] }>
  >([]);
  const [minimize, setMinimize] = useState(false);

  useEffect(() => {
    console.log('content script start');
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
        console.log(JSON.parse(e.data.data));
        const pteData: PTEDataType = JSON.parse(e.data.data);
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
      testName: 'PTE' | 'CLB' | 'IELTS(G)';
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
    ];

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
    console.log(skillsProfile);
    setSkillsProfile(skillsProfile);
  };

  return (
    <div
      className={clsx(
        'fixed top-16 right-10 bg-sky-50 z-[9999] rounded-xl text-xs overflow-auto text-slate-900 flex flex-col box-border shadow-xl shadow-cyan-950/55 transition-all',
        minimize ? 'w-5 h-5 p-0 overflow-hidden' : 'w-[480px] h-[429px] p-4 ',
      )}
    >
      <div
        className="w-5 h-5 absolute top-0 right-0 cursor-pointer z-50 bg-sky-50"
        onClick={() => setMinimize(() => !minimize)}
      >
        {minimize ? (
          <img
            src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/add-line.svg"
            className="w-4 h-4 absolute top-[0.125rem] right-[0.125rem]"
            alt=""
          />
        ) : (
          <img
            src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/subtract-fill.svg"
            className="w-4 h-4 absolute top-[0.125rem] right-[0.125rem]"
            alt=""
          />
        )}
      </div>
      <div className="text-base font-bold">Score</div>
      <table className="mt-1 text-center border-collapse w-full border-y-2 border-slate-400">
        <thead className="border-b border-slate-400">
          <tr>
            <th className="border-r border-slate-400"></th>
            <th className="px-2">Listening</th>
            <th className="px-2">Reading</th>
            <th className="px-2">Speaking</th>
            <th className="px-2">Writing</th>
          </tr>
        </thead>
        <tbody className="">
          {scoresComparison.map((item) => (
            <tr key={item.testName}>
              {item.testName === 'PTE' && (
                <td className="border-r border-slate-400 px-2">Your PTE Score</td>
              )}

              {item.testName === 'CLB' && <td className="border-r border-slate-400 px-2">CLB</td>}

              {item.testName === 'IELTS(G)' && (
                <td className="border-r border-slate-400 px-2"> = IELTS(G)</td>
              )}

              <td>{item.listening}</td>
              <td>{item.reading}</td>
              <td>{item.speaking}</td>
              <td>{item.writing}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-base font-bold">Sub Skills Score</div>
      <div className="mt-1">
        {skillsProfile.map((skill) => (
          <div key={skill.key} className="mb-3 text-xs">
            {/* {skill.score} {skill.skills.join(', ')} */}
            <div className="flex justify-between items-center">
              <div className="text-slate-500">{skill.name}</div>
              <div className="flex justify-end items-center ml-4">
                <div className="">{skill.skills.join(', ')}</div>
                <div className="ml-2">{skill.score}</div>
              </div>
            </div>
            <ProgressBar progress={skill.score} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentUI;
