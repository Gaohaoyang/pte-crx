import './App.css';

function App() {
  return (
    <div className="p-4 bg-slate-50 text-slate-800 text-sm w-96">
      <h1 className="text-lg font-bold text-center">Welcome to use</h1>
      <h1 className="text-2xl font-bold text-center">PTE Core Sub-Skills</h1>
      <h1 className="text-lg font-bold text-center">Chrome Extension!</h1>
      <ul className="mt-2">
        <li>
          1. Visit your{' '}
          <a
            href="https://mypte.pearsonpte.com/my-activity"
            onClick={() => {
              chrome.tabs.create({ url: 'https://mypte.pearsonpte.com/my-activity' });
            }}
          >
            PTE score page
          </a>
        </li>
        <li>2. Then you'll see a panel including your sub-scores, CLB levels, etc.</li>
      </ul>
      <div className="mt-2">
        If you found this helpful, feel free to sponsor me for a cup of coffee! ☕ :)
      </div>
      <div>
        Your name will appear on the{' '}
        <a
          href=""
          onClick={() => {
            chrome.tabs.create({ url: chrome.runtime.getURL('DonationList.html') });
          }}
        >
          donation list.
        </a>{' '}
        ⭐
      </div>
    </div>
  );
}

export default App;
