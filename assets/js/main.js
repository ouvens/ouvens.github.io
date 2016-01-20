;
(function() {
    var device = navigator.userAgent.match(/iPhone|iPod|Android|iPad/i) ?
        'ios' : navigator.userAgent.match(/Android/i) ? 'android' : 'pc';

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
    }

    /**
     * 头部banner自适应改变
     */
    var $coverBanner = $('.site-header-container.has-cover');
    if (device === 'pc') {
        $coverBanner.css({
            'background-image': 'url(/assets/header_image.png)'
        })
    } else {
        $coverBanner.css({
            'background-image': 'url(/assets/header_image_m.png)'
        })
    }

    window.hljs && window.hljs.initHighlightingOnLoad();
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
    $('#search-input').on('keypress', '.search-text', function(e) {
        if (e.keyCode === 13 && this.value.length > 0) {
            location.replace("/tags/?tag=" + this.value);
        }
    }).on('click', '.search-btn', function() {
        var value = $('#search-input').find('.search-text').val();
        if (value.length > 0) {
            location.replace("/tags/?tag=" + value);
        }
    })

    /**
     * 添加github信息
     */
    // $('.github-widget-user').github('ouvens');
    /*    $.ajax({
            url: 'https://api.github.com/users/ouvens/',
            cache: false,
            data: {},
            dataType: 'jsonp',
            success: function(data) {
                $('#github-info a').html('<img src="https://avatars.githubusercontent.com/u/922219?v=3">ouvens');
                if (data & data.data && data.data.id) {
                    $('#github-info a').html('<img src="' + data.user_avatar + '" width="20" height="20">' + user.name);
                }
            },
            error: function(msg) {
                console.log(msg);
            }
        });*/
})();
