"use strict";
(function() {


   function Post(data) {
     this._data = data;

     Post.prototype.template = document.querySelector('#post-template');


   }

   Post.prototype.render = function() {
     var POST_TIMEOUT = 3000;
     var template = document.querySelector('#post-template');
     this.element = template.children[0].cloneNode(true);

     this.element.querySelector('.post-author').textContent = this._data.author;
     this.element.querySelector('.post-likes').textContent = this._data.likes;
     this.element.querySelector('.post-share').textContent = this._data.reposts;
     this.element.querySelector('.post-date').textContent = this._data.date;

     document.querySelector('.loading').classList.remove('hidden');

     var showLoadingError = function() {
       document.querySelector('.loading').classList.add('hidden');
     }

     var postLoadTimeout = setTimeout(showLoadingError, POST_TIMEOUT);


   }

}());
