import './App.css'

function App() {
  return (
    <div className="w-96 bg-slate-50 p-3 text-sm text-slate-800">
      <h1 className="text-center text-lg font-bold">Welcome to use</h1>
      <h1 className="text-center text-2xl font-bold">PTE Sub-Scores</h1>
      <h1 className="text-center text-lg font-bold">Chrome Extension!</h1>
      <ul className="mt-1">
        <li>
          1. Visit your{' '}
          <a
            className="text-blue-600"
            href="https://mypte.pearsonpte.com/my-activity"
            onClick={() => {
              chrome.tabs.create({
                url: 'https://mypte.pearsonpte.com/my-activity',
              })
            }}
          >
            PTE score page
          </a>
        </li>
        <li>
          2. Then you'll see a panel including your sub-scores.
        </li>
      </ul>
      <div className="mt-2">
        If you found this helpful, feel free to sponsor me for a cup of coffee!
        ☕ :)
      </div>
      <div>
        Your name will appear on the{' '}
        <a
          className="text-blue-500"
          href=""
          onClick={() => {
            chrome.tabs.create({
              url: 'https://gaohaoyang.github.io/pte-crx-page/?scrollTo=donation',
            })
          }}
        >
          donation list.
        </a>
      </div>
      <div className="mt-2">
        You can support me through the following methods.
      </div>
      <table className="mt-1 w-full border border-slate-400 text-center">
        <tbody>
          <tr className="border-b border-slate-400">
            <td className="border-r border-slate-400 py-4">
              <i>Interac</i> e-Transfer <br/>
              (Canada)
            </td>
            <td>gaohaoyang126@outlook.com</td>
          </tr>
          <tr className="border-b border-slate-400">
            <td className="border-r border-slate-400">PayPal</td>
            <td className="flex flex-col items-center">
              <img
                className="h-20 w-20"
                src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/QR%20Code.png"
                alt=""
              />
              <a
                className="text-blue-500"
                href="https://www.paypal.com/donate/?business=NB2D3UXSQKDKU&no_recurring=0&item_name=Thanks+for+your+support%21+I+really+appreciate+it.+Have+a+great+day%21&currency_code=CAD"
                onClick={() => {
                  chrome.tabs.create({
                    url: 'https://www.paypal.com/donate/?business=NB2D3UXSQKDKU&no_recurring=0&item_name=Thanks+for+your+support%21+I+really+appreciate+it.+Have+a+great+day%21&currency_code=CAD',
                  })
                }}
              >
                PayPal Donation Link
              </a>
            </td>
          </tr>
          <tr className="border-b border-slate-400">
            <td className="border-r border-slate-400">Wechat Pay</td>
            <td className="flex flex-col items-center">
              <img
                className="h-20 w-20"
                src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/wechatPay.png"
                alt=""
              />
            </td>
          </tr>
          <tr className="border-b border-slate-400">
            <td className="border-r border-slate-400">AliPay</td>
            <td className="flex flex-col items-center">
              <img
                className="h-20 w-20"
                src="https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/pte/Alipay.png"
                alt=""
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default App
