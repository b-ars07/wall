/* global pictures: true */

'use strict';


(function() {
    var container = document.querySelector('.posts');
    var posts = [];
    var filteredPosts = [];
    var activeFilter = 'filter-all';
    var slider = document.querySelector('.loading');
    var filters = document.querySelector('.filters');
    var currentPage = 0;
    var PAGE_SIZE = 2;
    var SCROLL_TIMEOUT = 400;

    filters.addEventListener('click', function (evt) {
        var clickedElement = evt.target;
        if (clickedElement.classList.contains('filters-radio')) {
            setActiveFilter(clickedElement.id);
            addPageOnScroll();
        }
    });

    var scrollTimeout;

    /**
     * обработчик события scroll
     */
    window.addEventListener('scroll', function() {
        slider.classList.remove('hidden');
        clearTimeout (scrollTimeout);
        scrollTimeout = setTimeout(addPageOnScroll, SCROLL_TIMEOUT);

    });

    /**
     * (адаптация для больших разрешений). */
    window.addEventListener('load', addPageOnScroll);

    function addPageOnScroll() {


        //определяем положение футера относительно экрана
        var footerCoordinates = document.querySelector('footer').getBoundingClientRect();

        //определяем высоту экрана
        var viewportSize = document.documentElement.offsetHeight;

        //если смещение футера минус высота экрана меньше высоты футера,
        //футер виден хотя бы частично
        if (footerCoordinates.bottom <= viewportSize) {
            slider.classList.add('hidden');
            if (currentPage < Math.ceil(filteredPosts.length / PAGE_SIZE)) {
                renderPosts( filteredPosts, ++currentPage);
                slider.classList.add('hidden');
            }
        } else {
            slider.classList.add('hidden');
        }

    }

    slider.classList.remove('hidden');
    getPosts();

    function renderPosts(posts, pageNumber, replace) {
        if (replace) {
            container.innerHTML = '';
        }

        var fragment = document.createDocumentFragment();

        var from = pageNumber * PAGE_SIZE;
        var to = from + PAGE_SIZE;
        var pagePost = posts.slice(from, to);

        pagePost.forEach(function(post) {
            var element = getElementFromTemplate(post);
            fragment.appendChild(element);
        });
        container.appendChild(fragment);

    }

    function setActiveFilter(id, force) {
        if (activeFilter === id && !force) {
            return;
        }

        filteredPosts = posts.slice(0);

        switch (id) {
            case ('filter-my'):
                filteredPosts = filteredPosts.filter(function(name) {
                    return name.author === 'santa';
                });
                break;
        }

        currentPage = 0;
        renderPosts(filteredPosts, currentPage, true);
        activeFilter = id;

    }

    function getPosts() {
        slider.classList.remove('hidden');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/post.json');
        xhr.onload = function(evt) {
            if (evt.target.status <= 300) {
                var rawData = evt.target.response;
                var loadedPosts = JSON.parse(rawData);
            }
            updateLoadedPosts(loadedPosts);
        };
       xhr.send();
    }

    function updateLoadedPosts(loadedPosts) {
        posts = loadedPosts;

        //отрисовка данных
        setActiveFilter(activeFilter, true);
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



