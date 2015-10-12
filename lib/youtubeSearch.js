/*
* @Author: AhmadZuhdi
* @Date:   2015-10-12 22:02:03
* @Last Modified by:   AhmadZuhdi
* @Last Modified time: 2015-10-12 23:43:39
*/

'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

(function (root, factory) {

  /**
   * common js support
   */
  if (typeof module === 'object' && module.exports) {
    var fetch = require('node-fetch');
    var bluebird = require('bluebird');
    require('es6-shim');
    module.exports = factory(fetch, bluebird);
  } else {

    root.youtubeSearch = factory(window.fetch);
  }
})(this, function (fetch, bluebird) {
  var helper = (function () {
    function helper() {
      _classCallCheck(this, helper);

      this.ytUrl = 'https://www.googleapis.com/youtube/v3/search';
    }

    _createClass(helper, [{
      key: 'queryBuilder',
      value: function queryBuilder(parameters) {

        var newParameters = '';

        for (var parameter in parameters) {
          var value = parameters[parameter];
          newParameters += '' + parameter + '=' + value + '&';
        }

        return '' + this.ytUrl + '?' + newParameters;
      }
    }]);

    return helper;
  })();

  var youtubeRecord = (function () {
    function youtubeRecord(data, options) {
      _classCallCheck(this, youtubeRecord);

      this.helper = new helper();
      this.data = {};
      this.currentPage = 1;
      this.data[this.currentPage] = data;
      this.options = options;
    }

    _createClass(youtubeRecord, [{
      key: 'getData',
      value: function getData() {
        var page = arguments[0] === undefined ? this.currentPage : arguments[0];

        return this.data[page];
      }
    }, {
      key: 'nextPage',
      value: function nextPage() {

        var dataCurrentPage = this.getData();
        var nextPageToken = dataCurrentPage.nextPageToken;

        var newOptions = Object.assign({}, this.options);
        var newUrl = undefined;

        newOptions.pageToken = nextPageToken;

        newUrl = this.helper.queryBuilder(newOptions);

        return new Promise(function (resolve, reject) {
          fetch(newUrl).then(function (res) {
            return res.json();
          }).then(function (res) {
            return resolve(new youtubeRecord(res, newOptions));
          });
        });
      }
    }, {
      key: 'prevPage',
      value: function prevPage() {

        var dataCurrentPage = this.getData();
        var prevPageToken = dataCurrentPage.prevPageToken;

        var newOptions = Object.assign({}, this.options);
        var newUrl = undefined;

        newOptions.pageToken = prevPageToken;

        newUrl = this.helper.queryBuilder(newOptions);

        return new Promise(function (resolve, reject) {
          fetch(newUrl).then(function (res) {
            return res.json();
          }).then(function (res) {
            return resolve(new youtubeRecord(res, newOptions));
          });
        });
      }
    }]);

    return youtubeRecord;
  })();

  var youtubeSearch = (function () {
    function youtubeSearch(_ref) {
      var _ref$apiKey = _ref.apiKey;
      var apiKey = _ref$apiKey === undefined ? '' : _ref$apiKey;

      _classCallCheck(this, youtubeSearch);

      this.apiKey = apiKey;
      this.helper = new helper();
    }

    _createClass(youtubeSearch, [{
      key: 'search',
      value: function search(query) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        options.q = query;
        options.key = this.apiKey;
        var url = this.helper.queryBuilder(options);

        return new Promise(function (resolve, reject) {
          fetch(url).then(function (res) {
            return res.json();
          }).then(function (res) {
            return resolve(new youtubeRecord(res, options));
          });
        });
      }
    }]);

    return youtubeSearch;
  })();

  return youtubeSearch;
});
//# sourceMappingURL=youtubeSearch.js.map