/*
global fetch, atob
*/

const API_URL = 'https://api.github.com/'
const EXAMPLES_URL = 'repos/renderium/examples/contents/'

function isExample (example) {
  return example.type === 'dir' && example.name !== 'boilerplate'
}

class Api {
  getExamples () {
    return fetch(`${API_URL}${EXAMPLES_URL}`)
      .then(response => response.json())
      .then(result => result.filter(isExample))
  }

  getExample (name) {
    return fetch(`${API_URL}${EXAMPLES_URL}${name}/index.js`)
      .then(response => response.json())
      .then(result => atob(result.content))
  }
}

export default Api
