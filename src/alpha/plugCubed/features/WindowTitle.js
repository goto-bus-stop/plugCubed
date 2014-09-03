define(['plugCubed/handlers/TriggerHandler', 'plugCubed/Settings', 'plugCubed/Utils'], function(TriggerHandler, Settings, p3Utils) {
    var Database, PlaybackModel, handler;

    if (!p3Utils.runLite) {
        Database = require('app/store/Database');
        PlaybackModel = require('app/models/PlaybackModel');
    }

    handler = TriggerHandler.extend({
        trigger: API.ADVANCE,
        register: function() {
            this._super();
            this.title = '';
            this.titleClean = '';
            this.titlePrefix = '';
            if (!p3Utils.runLite)
                PlaybackModel.on('change:streamDisabled change:volume change:muted', this.onStreamChange, this);
            this.onStreamChange();
        },
        close: function() {
            this._super();
            if (this.intervalID)
                clearInterval(this.intervalID);
            if (!p3Utils.runLite)
                PlaybackModel.off('change:streamDisabled change:volume change:muted', this.onStreamChange, this);
        },
        handler: function(data) {
            if (/* Settings.songTitle && */data.media && data.media.title) {
                this.titlePrefix = (API.getVolume() > 0 && (p3Utils.runLite || (!p3Utils.runLite && !Database.settings.streamDisabled)) ? '▶' : '❚❚') + ' ';

                if (this.titleClean === data.media.author + ' - ' + data.media.title + ' :: ' + p3Utils.getRoomname() + ' :: ') return;

                if (this.intervalID)
                    clearInterval(this.intervalID);
                this.titleClean = data.media.author + ' - ' + data.media.title + ' :: ' + p3Utils.getRoomname() + ' :: ';
                this.title = (this.titlePrefix + this.titleClean).split(' ').join(' ');
                document.title = this.title;
                var _this = this;
                this.intervalID = setInterval(function() {
                    _this.onIntervalTick();
                }, 300);
                return;
            }
            if (this.intervalID)
                clearInterval(this.intervalID);
            document.title = p3Utils.getRoomname();
        },
        onIntervalTick: function() {
            var title = this.title.substr(this.titlePrefix.length);
            title = title.substr(1) + title.substr(0, 1);
            this.title = this.titlePrefix + title;
            document.title = this.title;
        },
        onStreamChange: function() {
            this.handler({media: API.getMedia()});
        }
    });

    return new handler();
});