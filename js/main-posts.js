/* global pictures: true */

'use strict';


(function() {
    var container = document.querySelector('.posts');
    var posts = [];
    var activeFilter = 'filter-all';
    var slider = document.querySelector('.loading');
    var filters = document.querySelectorAll('.filters');
    for (var i = 0; i < filters.length; i++) {
        filters[i].onclick = function (evt) {
            var clickElementID = evt.target.id;
            setActiveFilter(clickElementID);
        }
    }
    slider.classList.remove('hidden');
    setTimeout(getPosts, 2000);

    function renderPosts(posts) {
        container.innerHTML = '';
        posts.forEach(function(post) {
            var fragment = document.createDocumentFragment();
            var element = getElementFromTemplate(post);
            fragment.appendChild(element);
            container.appendChild(fragment);
        });
    }

    function setActiveFilter(id) {
        if (activeFilter === id) {
            return;
        }

        var filteredPosts = posts.slice(0);

        switch (id) {
            case ('filter-my'):
                filteredPosts = filteredPosts.filter(function(name) {
                    return name.author === 'santa';
                });
                break;
        }

        renderPosts(filteredPosts);

    }

    function getPosts() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/post.json');
        xhr.onload = function(evt) {
            var rawData = evt.target.response;
            var loadedPosts = JSON.parse(rawData);
            posts = loadedPosts;

            //отрисовка данных
            renderPosts(loadedPosts);
        };
       xhr.send();
        slider.classList.add('hidden');
    }
    /**
     * @param {Object} data
     * @return {Element}
     */
    function getElementFromTemplate(data) {
        var template = document.querySelector('#post-template');

        //для поддержки IE
        if('content' in template) {
            var element = template.content.children[0].cloneNode(true);
        } else {
            var element = template.children[0].cloneNode(true);
        }

        element.querySelector('.post-author').textContent = data.author;
        element.querySelector('.post-likes').textContent = data.likes;
        element.querySelector('.post-share').textContent = data.reposts;
        element.querySelector('.post-date').textContent = data.date;
        element.querySelector('.post-text').textContent = data.text;



        return element;
    }

})();

  function validate() {
    var text = document.forms['add_post']['text_post'].value;
    if (text.length === 0) {
      document.getElementById("text").innerHTML = "Данное поле обязательно для заполнения";
      return false;
    }
    return true;
  }



