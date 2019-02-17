var Tracker = function (jQueryObject) {
    this.object = jQueryObject;
    this.requestId = null;

    return this;
};

Tracker.prototype.setRequestId = function (requestId) {
    this.requestId = requestId;

    return this;
};

Tracker.prototype.init = function (callback) {
    var $this = this;
    jQuery.post('user-activities/api/user-request-activities/init', {
        request_id: $this.requestId,
        event_log: JSON.stringify([{
            timestamp: new Date().getTime(),
            width: jQuery(window).width(),
            height: jQuery(window).height()
        }])
    }, function () {
        callback();
    });
};

Tracker.prototype.saveError = function (selector) {
    var $this = this;
    jQuery.post('user-activities/api/user-request-activities/error', {
        request_id: $this.requestId,
        error_log: selector + ' is not present on the page',
        body_html: jQuery('body').html()
    }, function (response) {
        console.log(response);
    });
};

Tracker.prototype.isOnScreen = function (once, options) {


    if (this.object.length === 0) {

        console.warn(this.object.selector + ' is not present on the page');

        this.saveError(this.object.selector);

        return this;
    }

    var object = this.object;

    this.isOnScreen = [];

    var $this = this;

    function registerEvent(Tracker, init) {

        function sendToApi(Tracker, init) {

            eventData = {
                id: object.attr('id'),
                event: 'isOnScreen'
            };

            if (init === undefined) {
                eventData.timestamp = new Date().getTime();
            }

            jQuery.post('user-activities/api/user-request-activities/update', {
                request_id: $this.requestId,
                event_log: JSON.stringify(eventData)
            }, function () {
                Tracker.isOnScreen.push(true);
            });
        }

        if (once) {
            if (Tracker.isOnScreen.length === 0 && object.isOnScreen(options)) {
                sendToApi(Tracker, init);
            }
        } else {
            if (object.isOnScreen(options)) {
                sendToApi(Tracker, init);
            }
        }
    }

    registerEvent(this, true);

    jQuery(document).scrollEnd(function () {
        registerEvent($this);
    }, 500);

    jQuery(window).resizeEnd(function () {
        registerEvent($this);
    }, 500);

    return this;
};


Tracker.prototype.isClicked = function (once) {


    if (this.object.length === 0) {

        console.warn(this.object.selector + ' is not present on the page');

        this.saveError(this.object.selector);

        return this;
    }

    var object = this.object;

    this.isClicked = [];

    var $this = this;

    function registerEvent(Tracker) {

        function sendToApi(Tracker) {

            eventData = {
                id: object.attr('id'),
                event: 'isClicked',
                timestamp: new Date().getTime()
            };

            jQuery.post('user-activities/api/user-request-activities/update', {
                request_id: $this.requestId,
                event_log: JSON.stringify(eventData)
            }, function () {
                Tracker.isClicked.push(true);
            });
        }

        if (once) {
            if (Tracker.isClicked.length === 0) {
                sendToApi(Tracker);
            }
        } else {
            sendToApi(Tracker);
        }
    }

    object.click(function () {
        registerEvent($this);
    });

    return this;
};

Tracker.prototype.isHovered = function (once) {


    if (this.object.length === 0) {

        console.warn(this.object.selector + ' is not present on the page');

        this.saveError(this.object.selector);

        return this;
    }

    var object = this.object;

    this.isHovered = [];

    var $this = this;

    function registerEvent(Tracker) {

        function sendToApi(Tracker) {

            Tracker.isHovered.push(true);

            eventData = {
                id: object.attr('id'),
                event: 'isHovered',
                timestamp: new Date().getTime()
            };

            jQuery.post('user-activities/api/user-request-activities/update', {
                request_id: $this.requestId,
                event_log: JSON.stringify(eventData)
            }, function () {
                Tracker.isHovered.push(true);
            });
        }

        if (once) {
            if (Tracker.isHovered.length === 0) {
                sendToApi(Tracker);
            }
        } else {
            sendToApi(Tracker);
        }
    }

    object.mouseenter(function () {
        registerEvent($this);
    });

    return this;
};


Tracker.prototype.registerLatestEvent = function (timeout) {
    var $this = this;

    function registerEvent(){
        setTimeout(function () {
            jQuery.post('user-activities/api/user-request-activities/latest-event', {
                request_id: $this.requestId,
                timestamp: new Date().getTime()
            });
        }, 500);
    }

    jQuery(document).scrollEnd(function () {
        registerEvent();
    }, timeout);

    jQuery(window).resizeEnd(function () {
        registerEvent();
    }, timeout);

    jQuery(document).click(function () {
        registerEvent();
    });

    jQuery(document).mousemoveEnd(function () {
        registerEvent();
    }, timeout);

};

Tracker.prototype.registerResizeEvent = function (timeout) {
    var $this = this;

    jQuery(window).resizeEnd(function () {
        jQuery.post('user-activities/api/user-request-activities/update', {
            request_id: $this.requestId,
            event_log: JSON.stringify({
                event: 'window resized',
                width: jQuery(window).width(),
                height: jQuery(window).height(),
                timestamp: new Date().getTime()
            })
        });
    }, timeout);
};