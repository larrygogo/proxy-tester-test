addEventListener('message', (event) => {
  console.log('Worker: ' + JSON.stringify(event));
  postMessage('Hello from worker!');
})