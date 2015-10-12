/*
* @Author: AhmadZuhdi
* @Date:   2015-10-12 22:02:03
* @Last Modified by:   AhmadZuhdi
* @Last Modified time: 2015-10-12 23:43:33
*/

'use strict';

(function (root, factory){

  /**
   * common js support
   */
  if(typeof module === "object" && module.exports){
    var fetch = require('node-fetch')
    var bluebird = require('bluebird')
    require('es6-shim')
    module.exports = factory(fetch, bluebird)
  } else {

    root.youtubeSearch = factory(window.fetch)
  }

})(this, function (fetch, bluebird){

  class helper {

    constructor(){
     this.ytUrl = 'https://www.googleapis.com/youtube/v3/search'
    }

    queryBuilder(parameters){

      let newParameters = ''

      for(let parameter in parameters) {
        let value = parameters[parameter]
        newParameters += `${parameter}=${value}&`
      }

      return `${this.ytUrl}?${newParameters}`
    }
  }

  class youtubeRecord {

    constructor(data, options) {
      this.helper = new helper()
      this.data = {}
      this.currentPage = 1
      this.data[this.currentPage] = data
      this.options = options
    }

    getData(page = this.currentPage){
      return this.data[page]
    }

    nextPage(){

      const dataCurrentPage = this.getData()
      const nextPageToken = dataCurrentPage.nextPageToken

      let newOptions = Object.assign({}, this.options)
      let newUrl;

      newOptions.pageToken = nextPageToken

      newUrl = this.helper.queryBuilder(newOptions)

      return new Promise((resolve, reject) => {
        fetch(newUrl)
        .then(res => res.json())
        .then(res => resolve(new youtubeRecord(res, newOptions)))
      })
    }

    prevPage(){

      const dataCurrentPage = this.getData()
      const prevPageToken = dataCurrentPage.prevPageToken

      let newOptions = Object.assign({}, this.options)
      let newUrl;

      newOptions.pageToken = prevPageToken

      newUrl = this.helper.queryBuilder(newOptions)

      return new Promise((resolve, reject) => {
        fetch(newUrl)
        .then(res => res.json())
        .then(res => resolve(new youtubeRecord(res, newOptions)))
      })
    }
  }

  class youtubeSearch {

    constructor({ apiKey = '' }){
      this.apiKey = apiKey
      this.helper = new helper()
    }

    search(query, options = {}){
      options.q = query
      options.key = this.apiKey
      let url = this.helper.queryBuilder(options)

      return new Promise((resolve, reject) => {
        fetch(url)
        .then(res => res.json())
        .then(res => resolve(new youtubeRecord(res, options)))
      })
    }
  }

  return youtubeSearch
})