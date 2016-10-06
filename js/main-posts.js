/* global pictures: true */

"use strict";

var container = document.querySelector('.posts');

posts.forEach(function(post) {
  var fragment = document.createDocumentFragment();
  var element = getTlementFromTemplate(post);
  fragment.appendChild(element);
  container.appendChild(fragment);
});

/**
* @param {Object} data
* @return {Element}
*/
function getTlementFromTemplate(data) {
  var template = document.querySelector('#post-template');

  //для поддержки IE
  if('content' in template) {
    var element = template.content.children[0].cloneNode(true);
  } else {
    var element = template.children[0].cloneNode(true);
  }

  element.querySelector('.post-author').textContent = data.author
  element.querySelector('.post-likes').textContent = data.likes;
  element.querySelector('.post-share').textContent = data.reposts;
  element.querySelector('.post-date').textContent = data.date;
  element.querySelector('.post-text').textContent = data.text;



  return element;
}
