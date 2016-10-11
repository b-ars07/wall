'use strict';

(function() {
    /**
     *
     * @param data
     * @constructor
     */
    function Post(data) {
        this._data = data;
    }

    /**
     * Создание поста из шаблона
     */
    Post.prototype.render = function () {
        var template = document.querySelector('#post-template');

        //для поддержки IE
        if('content' in template) {
            this.element = template.content.children[0].cloneNode(true);
        } else {
            this.element = template.children[0].cloneNode(true);
        }

        this.element.querySelector('.post-author').textContent = this._data.author;
        this.element.querySelector('.post-likes').textContent = this._data.likes;
        this.element.querySelector('.post-share').textContent = this._data.reposts;
        this.element.querySelector('.post-date').textContent = this._data.date;
        this.element.querySelector('.post-text').textContent = this._data.text;

    };

    window.Post = Post;
    
})();