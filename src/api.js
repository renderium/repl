/*
global localStorage, fetch, atob
*/

const API_URL = 'https://api.github.com/'
const EXAMPLES_URL = 'repos/renderium/examples/contents/'
const STORAGE_KEY = 'renderium-playground'

function isExample (example) {
  return example.type === 'dir' && example.name !== 'boilerplate'
}

class Api {
  saveCode (code) {
    return new Promise((resolve, reject) => {
      resolve(localStorage.setItem(`${STORAGE_KEY}-code`, code))
    })
  }

  getCode () {
    return new Promise((resolve, reject) => {
      resolve(localStorage.getItem(`${STORAGE_KEY}-code`) || '')
    })
  }

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
