'use strict';

(function () {
    /**
     *
     * @param data
     * @constructor
     */
    var PostData = function(data) {
        this.params = data;
    };

    PostData.prototype.getAuthorName = function () {
        return this.params.author;
    };

    PostData.prototype.getPostDate = function () {
        return this.params.date;
    };

    PostData.prototype.getLikes = function () {
        return this.params.likes;
    };

    PostData.prototype.getReposts = function () {
        return this.params.reposts;
    };

    PostData.prototype.getText = function () {
        return this.params.text;
    };

    window.PostData = PostData;
    
})();