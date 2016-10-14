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

        this.element.querySelector('.post-author').textContent = this._data.getAuthorName();
        this.element.querySelector('.post-likes').textContent = this._data.getLikes();
        this.element.querySelector('.post-share').textContent = this._data.getReposts();
        this.element.querySelector('.post-date').textContent = this._data.getPostDate();
        this.element.querySelector('.post-text').textContent = this._data.getText();

    };

    window.Post = Post;
    
})();