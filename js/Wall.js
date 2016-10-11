/* global Post: true */

'use strict';


(function() {
    var container = document.querySelector('.posts');
    var posts = [];
    var filteredPosts = [];
    var activeFilter = 'filter-all';
    var slider = document.querySelector('.loading');
    var filters = document.querySelector('.filters');
    var currentPage = 0;
    var PAGE_SIZE = 4;
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

        //футер виден хотя бы частично
        if (footerCoordinates.bottom <= viewportSize) {
            if (currentPage < Math.ceil(filteredPosts.length / PAGE_SIZE)) {
                renderPosts( filteredPosts, ++currentPage);
            }
        }

    }


    getPosts();

    function renderPosts(posts, pageNumber, replace) {
        if (replace) {
            container.innerHTML = '';
        }

        var fragment = document.createDocumentFragment();

        var from = pageNumber * PAGE_SIZE;
        var to = from + PAGE_SIZE;
        var pagePost = posts.slice(from, to);
        if (from > posts.length) {
            slider.classList.add('hidden');
        }

        pagePost.forEach(function(post) {
            var postElement = new Post(post);
            postElement.render();
            fragment.appendChild(postElement.element);
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


})();

  function validate() {
    var text = document.forms['add_post']['text_post'].value;
    if (text.length === 0) {
      document.getElementById("text").innerHTML = "Данное поле обязательно для заполнения";
      return false;
    }
    return true;
  }



