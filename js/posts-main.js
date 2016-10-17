
'use strict';


(function() {
    var container = document.querySelector('.posts');
    var posts = [];
    var filteredPosts = [];
    var renderedElements = [];
    var activeFilter = localStorage.getItem('activeFilter') || 'filter-all';
    var slider = document.querySelector('.loading');
    var filters = document.querySelector('.filters');
    var currentPage = 0;
    var PAGE_SIZE = 4;
    var SCROLL_TIMEOUT = 400;
    var divText = document.getElementById('divText');
    var newPost;
    var newAddPost;
    var allPost = document.querySelector('.all');
    var flag = false;
    var updownElem = document.getElementById('updown');

    function Wall() {

    }

    Wall.prototype.renderPosts = function(posts, pageNumber, replace) {
        if (replace) {
            container.innerHTML = '';

        }

        var fragment = document.createDocumentFragment();

        var from = pageNumber * PAGE_SIZE;
        var to = from + PAGE_SIZE;

        if (from == 4) {
            flag = true;
        }

        while (flag) {
            slider.classList.add('hidden');
            allPost.classList.remove('hidden');
            return;

        }

        allPost.addEventListener('click' , function (evt) {
            allPost.classList.add('hidden');
            flag = false;
            addPageOnScroll();
        });



        if (posts.length === 1) {
            slider.classList.remove( 'hidden' );
            var pagePost = posts.slice( 0 );
            renderedElements = renderedElements.concat(pagePost.map(function (post) {
                var postElement = new Post( new PostData(post) );
                postElement.render();
                newPost = postElement.element;
            }));
            container.insertBefore( newPost, container.firstChild );

        } else {
            slider.classList.remove( 'hidden' );
            var pagePost = posts.slice( from, to );
            renderedElements = renderedElements.concat(pagePost.map(function (post) {
                var postElement = new Post( post );
                postElement.render();
                fragment.appendChild( postElement.element );
            }));
            container.appendChild( fragment );

        }
        if (posts.length < from) {
            slider.classList.add( 'hidden' );
        }
        //addPageOnScroll();

    };

    /**
     * Получение данных из JSON при помощи AJAX
     */
    Wall.prototype.getPosts = function() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/post.json');
        xhr.onload = function(evt) {
            if (evt.target.status <= 300) {
                var rawData = evt.target.response;
                var loadedPosts = JSON.parse(rawData);
                loadedPosts = loadedPosts.map(function (post) {
                    return new PostData(post);
                });
            }
            updateLoadedPosts(loadedPosts);
        };
        xhr.send();

    };

    window.Wall = Wall;

    var wall = new Wall();

    var pageYLabel = 0;

    // updownElem.onclick = function() {
    //     var pageY = window.pageYOffset || document.documentElement.scrollTop;
    //
    //     switch (this.className) {
    //         case 'up':
    //             pageYLabel = pageY;
    //             window.scrollTo(0, 0);
    //             this.className = 'down';
    //             break;
    //
    //         case 'down':
    //             window.scrollTo(0, pageYLabel);
    //             this.className = 'up';
    //     }
    //
    // };

    var scrollUp = document.getElementById('scrollup'); // найти элемент

    scrollUp.onmouseover = function() { // добавить прозрачность
        scrollUp.style.opacity=0.3;
        scrollUp.style.filter  = 'alpha(opacity=30)';
    };

    scrollUp.onmouseout = function() { //убрать прозрачность
        scrollUp.style.opacity = 0.5;
        scrollUp.style.filter  = 'alpha(opacity=50)';
    };

    scrollUp.onclick = function() { //обработка клика
        window.scrollTo(0,0);
    };

// show button

    window.onscroll = function () { // при скролле показывать и прятать блок
        if ( window.pageYOffset > 0 ) {
            scrollUp.style.display = 'block';
        } else {
            scrollUp.style.display = 'none';
        }
    };

    filters.addEventListener('click', function (evt) {
        var clickedElement = evt.target;
        if (clickedElement.classList.contains('filters-radio')) {
            setActiveFilter(clickedElement.id, true);
            addPageOnScroll();
        }
    });

    var scrollTimeout;

    /**
     * обработчик события scroll
     */
    window.addEventListener('scroll', function() {

        var pageY = window.pageYOffset || document.documentElement.scrollTop;
        var innerHeight = document.documentElement.clientHeight;

        switch (updownElem.className) {
            case '':
                if (pageY > innerHeight) {
                    updownElem.className = 'up';
                }
                break;

            case 'up':
                if (pageY < innerHeight) {
                    updownElem.className = '';
                }
                break;

            case 'down':
                if (pageY > innerHeight) {
                    updownElem.className = 'up';
                }
                break;

        }

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

                wall.renderPosts(filteredPosts, ++currentPage, false);
            }
        }

    }

    wall.getPosts();

    var btnSubmit = document.querySelector('.addpost-button');

    /**
     *
     * @param text
     * @returns {Array}
     */
    function getAddPost(text) {
        var sendPost = new NewPost(text);
        var addPost = [];
        addPost.push(sendPost.getData());

        return addPost;
    }

    /**
     * Обработчик клика по кнопке "Отправить"
     */
    btnSubmit.addEventListener('click', function(evt) {
        evt.preventDefault();
        var text = document.forms['add_post']['text_post'].value;
        if (text == 0) {
            alert("Данное поле обязательно для заполнения");
        } else {

            var addPost = getAddPost(text);
            newAddPost = wall.renderPosts(addPost, currentPage);
            $('textarea').val('');
        }

    });


    /**
     * Переключение между фильтрами
     * @param id
     * @param force
     */
    function setActiveFilter(id, force) {
        if (activeFilter === id && !force) {
            return;
        }
        slider.classList.remove('hidden');
        filteredPosts = posts.slice(0);


        switch (id) {
            case ('filter-my'):
                filteredPosts = filteredPosts.filter(function(name) {
                    return name.getAuthorName() === 'santa';
                });
                break;
        }

        currentPage = 0;
        wall.renderPosts(filteredPosts, currentPage, true);
        activeFilter = id;

        //запись фильтра в localStorage
        localStorage.setItem('activeFilter', id);
        filters[activeFilter].checked = true;

    }



    /**
     * Полученные данные устанавливаем для фильтра по умолчанию
     * @param loadedPosts
     */
    function updateLoadedPosts(loadedPosts) {
        posts = loadedPosts;

        //отрисовка данных
        setActiveFilter(activeFilter, true);
    }


})();

  // function validate() {
  //   var text = document.forms['add_post']['text_post'].value;
  //   if (text.length === 0) {
  //     document.getElementById("text").innerHTML = "Данное поле обязательно для заполнения";
  //     return false;
  //   }
  //   return true;
  // }



