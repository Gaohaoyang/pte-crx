import { useEffect, useState } from 'react';
import { getEqualScores } from './scoreList';
import { PTEDataType } from '../type/PTEDataType';

const ContentUI = () => {
  const [scores, setScores] = useState<
    Array<{
      name: 'Listening' | 'Reading' | 'Speaking' | 'Writing';
      score: number;
      clb?: number;
      ieltsCore?: number;
    }>
  >([]);
  const [scoresComparison, setScoresComparison] = useState<
    {
      testName: 'PTE' | 'CLB' | 'IELTS(G)';
      listening?: number;
      reading?: number;
      speaking?: number;
      writing?: number;
    }[]
  >([]);
  const [skillsProfile, setSkillsProfile] = useState<Array<{ name: string; score: number }>>([]);

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

    setScores(scoreList);
    setScoresComparison(scoresComparisonList);

    const skillsProfile: Array<{ name: string; score: number }> = [];
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

        skillsProfile.push({ name: showName, score: element });
      }
    }
    setSkillsProfile(skillsProfile);
  };

  return (
    <div className="fixed top-16 right-10 min-w-10 min-h-10 bg-sky-50 z-[9999] flex flex-col shadow-2xl p-4 rounded-lg">
      <div>
        <table className="text-center text-sm border-collapse w-full border-y-2 border-slate-300">
          <thead className="border-b border-slate-300">
            <tr>
              <th className="border-r border-slate-300"></th>
              <th className="px-2">Listening</th>
              <th className="px-2">Reading</th>
              <th className="px-2">Speaking</th>
              <th className="px-2">Writing</th>
            </tr>
          </thead>
          <tbody className="">
            {scoresComparison.map((item) => (
              <tr>
                {item.testName === 'PTE' && (
                  <td className="border-r border-slate-300 px-2">Your PTE Score</td>
                )}

                {item.testName === 'CLB' && <td className="border-r border-slate-300 px-2">CLB</td>}

                {item.testName === 'IELTS(G)' && (
                  <td className="border-r border-slate-300 px-2"> = IELTS(G)</td>
                )}

                <td>{item.listening}</td>
                <td>{item.reading}</td>
                <td>{item.speaking}</td>
                <td>{item.writing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {skillsProfile.map((skill) => (
          <div>
            {skill.name} {skill.score}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentUI;
