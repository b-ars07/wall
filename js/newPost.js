'use strict';

(function () {

    var btnSubmit = document.querySelector('.addpost-button');
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    var name = "santa";
    var likes = 0;
    var reposts = 0;
    var date = year + '-' + month + '-' + day;

    function NewPost(text) {
        this._data = {
            "author": name,
            "likes": likes,
            "reposts": reposts,
            "date": date,
            "text": text
        };

    }

    NewPost.prototype.submit = function() {

    };

    window.NewPost = NewPost;
})();