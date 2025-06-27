import ReactDOM from 'react-dom/client'
import './content.css'
import ContentUI from './ContentUI'
// import { PTEDataType } from './type/PTEDataType'
// import { AppointmentsType } from './type/AppointmentsType'

console.log('PTE Sub-Scores Breakdown Chrome Extension is working.')
// localStorage.setItem('text chuanshi', 'chuanshi')

// inject injected script
console.log('PTE Sub-Scores Breakdown, start to inject script.')
const s = document.createElement('script')
s.src = chrome.runtime.getURL('injected.js')
s.onload = function () {
  // @ts-expect-error this is injected script
  this.remove()
}
;(document.head || document.documentElement).appendChild(s)

window.addEventListener('load', () => {
  const root = document.createElement('div')
  root.id = 'crx-root'

  // console.log('PTE Sub-Scores Breakdown document.body', document.body)
  document.body.appendChild(root)

  // const ContentUI = () => {
  //   return <div className="absolute top-1 right-0 w-96 h-96 bg-red-500 z-50">hi</div>;
  // };

  ReactDOM.createRoot(root).render(<ContentUI />)
})
