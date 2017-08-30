/*
global XMLHttpRequest, localStorage, atob
*/

const API_URL = 'https://api.github.com/'
const EXAMPLES_URL = 'repos/renderium/examples/contents/repl'
const STORAGE_KEY = 'renderium-playground'

function fetch (url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onerror = reject
    xhr.onload = () => resolve(xhr.responseText)
    xhr.send()
  })
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
      .then(response => JSON.parse(response))
  }

  getExample (name) {
    return fetch(`${API_URL}${EXAMPLES_URL}/${name}`)
      .then(response => JSON.parse(response))
      .then(result => atob(result.content))
  }
}

export default Api
