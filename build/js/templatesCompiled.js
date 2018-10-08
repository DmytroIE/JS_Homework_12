"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  var template = Handlebars.template,
      templates = Handlebars.templates = Handlebars.templates || {};
  templates['ListItem'] = template({
    "compiler": [7, ">= 4.0.0"],
    "main": function main(container, depth0, helpers, partials, data) {
      var helper,
          alias1 = depth0 != null ? depth0 : container.nullContext || {},
          alias2 = helpers.helperMissing,
          alias3 = "function",
          alias4 = container.escapeExpression;
      return "<li class=\"record urlinfo__item\" data-uuid=" + alias4((helper = (helper = helpers.uuid || (depth0 != null ? depth0.uuid : depth0)) != null ? helper : alias2, _typeof(helper) === alias3 ? helper.call(alias1, {
        "name": "uuid",
        "hash": {},
        "data": data
      }) : helper)) + ">\r\n<p class = \"record__title\">" + alias4((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2, _typeof(helper) === alias3 ? helper.call(alias1, {
        "name": "title",
        "hash": {},
        "data": data
      }) : helper)) + "</p>\r\n<a class = \"record__url\" href = \"" + alias4((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2, _typeof(helper) === alias3 ? helper.call(alias1, {
        "name": "url",
        "hash": {},
        "data": data
      }) : helper)) + "\">" + alias4((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2, _typeof(helper) === alias3 ? helper.call(alias1, {
        "name": "url",
        "hash": {},
        "data": data
      }) : helper)) + "</a>\r\n<p class = \"record__descr\">" + alias4((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2, _typeof(helper) === alias3 ? helper.call(alias1, {
        "name": "description",
        "hash": {},
        "data": data
      }) : helper)) + "</p>\r\n<div class = \"record__img-cont\"><img src = \"" + alias4((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2, _typeof(helper) === alias3 ? helper.call(alias1, {
        "name": "image",
        "hash": {},
        "data": data
      }) : helper)) + "\"></div>\r\n<button class = \"record__del-button\" onclick=\"handleDelete(this)\">Удалить</button>\r\n</li>";
    },
    "useData": true
  });
})();