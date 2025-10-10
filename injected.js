;(function (xhr) {
  var XHR = XMLHttpRequest.prototype

  var open = XHR.open
  var send = XHR.send

  XHR.open = function (method, url) {
    this._method = method
    this._url = url
    return open.apply(this, arguments)
  }

  XHR.send = function (postData) {
    // console.log(
    //   'injected script xhr request:',
    //   this._method,
    //   this._url,
    //   this.getAllResponseHeaders(),
    //   postData,
    // );
    this.addEventListener('load', function () {
      if (
        this._url.indexOf(
          'https://api.mypte.pearsonpte.com/appointments/api/scorereport/',
        ) !== -1 &&
        this._url.indexOf('/skills') === -1
      ) {
        // console.log('PTESubScore_pteData', this.response)
        var tempPTEDataStr = JSON.stringify(JSON.parse(this.response))
        var tempPTEData = JSON.parse(tempPTEDataStr)
        delete tempPTEData.photoInfo
        localStorage.setItem(
          'PTESubScore_pteData',
          JSON.stringify(tempPTEData),
        )
        window.postMessage({ type: 'xhr-scorereport', data: tempPTEData }, '*') // send to content script
      }
      if (
        this._url.indexOf(
          'https://api.mypte.pearsonpte.com/appointments/api/appointments',
        ) !== -1
      ) {
        // console.log('pteName', this.response)
        const response = JSON.parse(this.response)
        // response[0].examName = 'PTEAcademic' // test
        var pteName =
          response[0].examName === 'PTE Core' ? 'PTECore' : 'PTEAcademic'
        // console.log('pteName', pteName)
        // console.log('pteName', response[0].examName)

        localStorage.setItem(
          'PTESubScore_examName',
          JSON.stringify({
            name: pteName,
            originName: response[0].examName,
          }),
        )
        window.postMessage({ type: 'xhr-appointments', data: response }, '*') // send to content script
      }
    })
    return send.apply(this, arguments)
  }
})(XMLHttpRequest)

// const { fetch: origFetch } = window;
// window.fetch = async (...args) => {
//   const response = await origFetch(...args);
//   console.log('injected script fetch request:', args);
//   response
//     .clone()
//     .blob() // maybe json(), text(), blob()
//     .then((data) => {
//       window.postMessage({ type: 'fetch', data: data }, '*'); // send to content script
//       //window.postMessage({ type: 'fetch', data: URL.createObjectURL(data) }, '*'); // if a big media file, can createObjectURL before send to content script
//     })
//     .catch((err) => console.error(err));
//   return response;
// };
