import { useEffect, useState } from 'react';
import { getEqualScores } from './scoreList';

let timer: NodeJS.Timeout;

const ContentUI = () => {
  const [scores, setScores] = useState<
    Array<{ name: string; score: number; clb?: string; ieltsCore?: string }>
  >([]);
  const [skillsProfile, setSkillsProfile] = useState<Array<{ name: string; score: number }>>([]);

  useEffect(() => {
    const handleUrlChange = () => {
      console.log('URL changed to: ' + window.location.href);
      // reset
      setScores([]);
      setSkillsProfile([]);
      // pollingToGetScore();
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const pollingToGetScore = () => {
    console.log('pollingToGetScore');
    const skillsProfileContainer = document.querySelector<HTMLDivElement>(
      '#skills-profile-container',
    );
    if (skillsProfileContainer) {
      const overallScoreWrapper = document.querySelector<HTMLDivElement>('.overall-score-wrapper');
      const scoreBySkill = overallScoreWrapper?.querySelectorAll<HTMLDivElement>('.skill');
      if (scoreBySkill) {
        // scores
        const scores = [];
        for (const skill of scoreBySkill) {
          // get first child of skill
          const skillScore = (skill.children[0] as HTMLDivElement).innerText;
          const skillName = (skill.children[1] as HTMLDivElement).innerText;

          const equivalentScore = getEqualScores(
            skillScore,
            skillName as 'Listening' | 'Speaking' | 'Reading' | 'Writing',
          );
          console.log('equivalentScore', equivalentScore);

          scores.push({
            name: skillName,
            score: Number(skillScore),
            clb: equivalentScore?.clb,
            // @ts-expect-error equivalentScore is not defined
            ieltsCore: equivalentScore[`ielts${skillName}`],
          });
        }
        // @ts-expect-error equivalentScore is not defined
        setScores(scores);

        // skills profile
        const list = skillsProfileContainer.querySelectorAll<HTMLDivElement>('.grid-panel-row');
        const skillsProfile = [];
        for (const item of list) {
          const matProgressBar = item.querySelector('mat-progress-bar');
          const subskillName = item.querySelector<HTMLDivElement>('.subskill-name');
          let score = Number(matProgressBar?.getAttribute('aria-valuenow') || '0');
          if (score === 100) {
            score = 90;
          }

          skillsProfile.push({
            name: subskillName?.innerText || '',
            score,
          });
        }
        setSkillsProfile(skillsProfile);
      }
    } else {
      timer = setTimeout(() => {
        pollingToGetScore();
      }, 1000);
    }
  };

  useEffect(() => {
    pollingToGetScore();
    return () => {
      clearInterval(timer);
    };
  }, []);

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
