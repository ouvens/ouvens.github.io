(function ($, window, document, undefined) {
    "use strict";
    // Setup our defaults
    var pluginName = 'github',
        defaults = {
            user: "ouvens",
            show_extended_info: true,
            show_follows: true,
            sorter: null,
            // width: "400px",
            show_repos: 5,
            oldest_first: true
        };

    // The plugin constructor
    function Github(element, options) {
        // Set the element specified by the user
        this.element = element;
        // Combie in the defaults and options into a single options object
        this.options = $.extend({}, defaults, options);
        // Instantiate our init function, it inherits the options object, so we don't need to explicitly pass it
        this.init();

        this.errorType = '';
    }

    // Our Prototype!
    Github.prototype = {
        // Our controller
        init: function () {
            // Explicitly set our options and element so they can be inherited by functions
            // Then init our functions to build the widget
            var el = this.element,
                options = this.options,
                user = this.model("user", options.user, function (data) {
                    // Build layout view with user data and append it to the specified element
                    $(el).append(Github.prototype.view_layout(data.data, options));
                }),
                repos = this.model("repos", options.user, function (data) {
                    // Build our repos partial and append it to the layout, which is already in the DOM
                    $(el).find("#ghw-repos #ghw-github-loader").slideUp(250, function () {
                        $(el).find("#ghw-repos ul").slideDown(250);
                    });
                    // Init our bind function once everything is present within the DOM
                    Github.prototype.bind(options);
                });
        },

        // Our user model, get and set user data
        model: function (type, user, callback) {
            // Construct our endpoint URL depending on what is being requested
            var url = "https://api.github.com/users/" + user.toLowerCase(); if (type === "repos") { url += "/repos"; } url += "?callback=?";
            // Get data from Github user endpoint, JSONP bitches
            $.getJSON(url, function (data) {
                // Make sure our callback is defined and is of the right type, if it is fire it
                if (typeof callback !== "undefined" && typeof callback === "function") {
                    callback(data);
                }
            });
        },

        // The main layout for the widget
        view_layout: function (user, options) {

            var markup = [];
            console.log(user);
            
            if(user.id){
                markup.push('<div class="git-user-info">');
                markup.push('<div class="user-info-avatar">');
                markup.push('<a href="' + user.html_url + '"><img src="' + user.avatar_url + '" width="150" height="150"/></a>');
                markup.push('<span class="info-item">' + user.company + '</span><span class="info-item">' + user.location + '</span>');
                markup.push('<span class="info-item">' + user.email + '</span>');  
                markup.push('</div>');
                markup.push('</div>');
                }

            return markup.join();
        },

        // Our repos partial, which will construct the repo list itself
        view_partial_repos: function (data, options, el) {
            var markup = '';
            // // Are we displaying our repos oldest first?
            // if (options.oldest_first === true) {
            //     // Yes? use the reverse method to reverse the order of the data objects
            //     data = data.data.reverse && data.data.reverse();
            // } else {
            //     data = data.data;
            // }

            // // Custom sorter
            // if (typeof options.sorter === 'function') {
            //     data.sort(options.sorter);
            // }

            // // Iterate through the repos
            // $.each(data, function (i) {
            //     // Github returns pages of 30 repos per request, however we only want to show the number set in the options
            //     if (i <= options.show_repos - 1) {
            //         markup += '<li id="ghw-repo-' + i + '" class="ghw-clear ghw-repo';
            //         // This is a little bit of a hack to make the CSS easier, if the repo has a language attribute, it will mean
            //         // the box carries over two lines, which means the buttons on the right become missaligned. So therefore, if
            //         // there are two lines, add a special class so we can style it more easily.
            //         if (this.language !== null) {
            //             markup += ' double';
            //         }
            //         markup += '">';
            //         markup += '<div class="ghw-left">';
            //         markup += '<p class="ghw-title"><a href="' + this.html_url + '" data-description="<p>' + this.name + '</p>' + this.description + '" class="ghw-github-tooltip">' + this.name + '</a></p>';
            //         markup += '<p class="ghw-meta-data">';
            //         if (this.language !== null) {
            //             markup += '<span class="ghw-language">' + this.language + '</span></p>';
            //         }
            //         markup += '</div>';
            //         markup += '<div class="ghw-right">';
            //         markup += '<span class="ghw-forks ghw-github-tooltip" data-description="This repo has ' + this.forks + ' fork(s)">' + this.forks + '</span>';
            //         markup += '<span class="ghw-watchers ghw-github-tooltip" data-description="This repo has ' + this.watchers + ' watcher(s)">' + this.watchers + '</span>';
            //         markup += '<span class="ghw-issues ghw-github-tooltip" data-description="This project has ' + this.open_issues + ' open issues">' + this.open_issues + '</span>';
            //         markup += '</div>';
            //         markup += '</li>';
            //     }
            // });

            return markup;
        },

        // Our bin utility funciton that will be init'd once we have populated the DOM
        bind: function (options) {

        }
    };

    // Setup our plugin
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Github(this, options));
            }
        });
    };

}(jQuery, window, document));