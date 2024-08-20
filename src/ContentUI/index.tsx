import { useEffect, useState } from 'react';
import { getEqualScores } from './scoreList';
import { PTEDataType } from '../type/PTEDataType';

const ContentUI = () => {
  const [scores, setScores] = useState<
    Array<{
      name: 'Listening' | 'Speaking' | 'Reading' | 'Writing';
      score: number;
      clb?: number;
      ieltsCore?: number;
    }>
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
      { name: 'Speaking', score: pteData.communicativeSkills.speaking },
      { name: 'Reading', score: pteData.communicativeSkills.reading },
      { name: 'Writing', score: pteData.communicativeSkills.writing },
    ];

    scoreList.forEach((item) => {
      const equivalentScore = getEqualScores(String(item.score), item.name);
      item.clb = equivalentScore?.clb;
      item.ieltsCore = equivalentScore?.[`ielts${item.name}`];
    });

    setScores(scoreList);

    const skillsProfile: Array<{ name: string; score: number }> = [];
    for (const key in pteData.skillsProfile) {
      if (Object.prototype.hasOwnProperty.call(pteData.skillsProfile, key)) {
        // @ts-expect-error this is a number
        const element: number = pteData.skillsProfile[key];
        skillsProfile.push({ name: key, score: element });
      }
    }
    setSkillsProfile(skillsProfile);
  };

  return (
    <div className="fixed top-20 right-10 min-w-10 min-h-10 bg-slate-400 z-[9999] flex flex-col">
      <div>
        {scores.map((score) => (
          <div>
            {score.name} {score.score} {score.clb} {score.ieltsCore}
          </div>
        ))}
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
