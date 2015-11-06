;(function() {
    var device = navigator.userAgent.match(/iPhone|iPod|Android|iPad/i)? 
        'ios' : navigator.userAgent.match(/Android/i)? 'android' : 'pc';

    function getParam(par) {
        var search = document.location.href;
        var get = search.indexOf(par + "=");
        if (get == -1) {
            return false;
        }
        var params = search.slice(par.length + get + 1);
        var nextPar = params.indexOf("&");
        if (nextPar != -1) {
            params = params.slice(0, nextPar);
        }
        return decodeURIComponent(params) || "";
    }

    /**
     * 获取文章分类
     * @type {[type]}
     */
    var keywords = getParam('cate') && getParam('cate').toLowerCase();

    var $category = $('.post-content');
    if (keywords) {
        $category.find('.category').hide();
        $category.find('.category[data-cate=' + keywords + ']').show();
        $('.post-header .post-title').text(keywords);
    } else {
        $category.find('.category').show();
        $('.post-header .post-title').text('所有文章');
    }

    /**
     * 获取标签分类
     * @type {[type]}
     */
    var tagKeywords = getParam('tag') && getParam('tag').toLowerCase();
    var $tag = $('.post-content');
    if (tagKeywords) {
        $tag.find('.tag').hide();
        $tag.find('.tag[data-tag*=' + tagKeywords + ']').show();
        $('.post-header .post-title').text(tagKeywords);
    } else {
        $tag.find('.tag').show();
        $('.post-header .post-title').text('所有标签');
    }

/*    function loadJS(urlMap, fn) {
        setTimeout(function() {
            for (var key in urlMap) {
                var script = document.createElement('script');
                script.src = urlMap[key];
                script.setAttribute('data', key);
                script.onload = function() {
                    fn();
                };
                document.body.appendChild(script);
            }
        }, 0);
    }

    if(/(\d{1,4}\/){3}/.test(location.href)) {
        loadJS({
            'highlight': '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.5/highlight.min.js',
            'lightbox': '//cdnjs.cloudflare.com/ajax/libs/lightbox2/2.7.1/js/lightbox.min.js'
        }, function() {
            if (!window.hljs) {
                return;
            }

        });
    }*/

    var $coverBanner = $('.site-header-container.has-cover');
    if(device === 'pc'){
        $coverBanner.css({
            'background-image': 'url(/assets/header_image.png)'
        })
    }else{
        $coverBanner.css({
            'background-image': 'url(/assets/header_image_m.png)'
        })
    }

    window.hljs && hljs.initHighlightingOnLoad();
    var menuToggle = $('#js-mobile-menu').unbind();
    $('#js-navigation-menu').removeClass("show");
    
    menuToggle.on('click', function(e) {
        e.preventDefault();
        $('#js-navigation-menu').slideToggle(function() {
            if ($('#js-navigation-menu').is(':hidden')) {
                $('#js-navigation-menu').removeAttr('style');
            }
        });
    });

    /**
     * 搜索框输入功能,支持回车和点击搜索
     */
    $('#search-input').on('keypress', '.search-text', function(e){
        if(e.keyCode === 13 && this.value.length > 0){
            location.replace("/tags/?tag=" + this.value);
        }
    }).on('click', '.search-btn', function(){
        var value = $('#search-input').find('.search-text').val();
        if(value.length > 0){
            location.replace("/tags/?tag=" + value);
        }
    })
})();
