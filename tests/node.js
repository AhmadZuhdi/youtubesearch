/*
* @Author: AhmadZuhdi
* @Date:   2015-10-12 22:19:26
* @Last Modified by:   AhmadZuhdi
* @Last Modified time: 2015-10-12 23:34:43
*/

'use strict';

var youtubeSearch = require('./../index')
var ys = new youtubeSearch({
  apiKey : 'AIzaSyD5qpDci8g2fFAlDpNbG_6ydQHn-vw4zIo'
})

ys.search('dota 2', {
  part: 'snippet',
  safeSearch: 'strict',
  videoEmbeddable: true,
  maxResults: 10,
  type: 'video',
}).then(function(result){
   console.log(result.getData())
   result.nextPage()
    .then(function(nextRes){
      console.log(nextRes.getData());
      return nextRes.prevPage()
    })
    .then(function(nextRes){
      console.log(nextRes.getData());
    })
})