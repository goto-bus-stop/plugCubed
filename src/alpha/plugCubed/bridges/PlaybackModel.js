define(['plugCubed/Class', 'plugCubed/Utils', 'plugCubed/Lang', 'plugCubed/bridges/VolumeView'], function(Class, p3Utils, p3Lang, VolumeView) {
    var Handler, volume, PlaybackModel;

    PlaybackModel = window.plugCubedModules.currentMedia;

    function onMediaChange() {
        if (PlaybackModel.get('mutedOnce') === true) {
            PlaybackModel.set('volume', PlaybackModel.get('lastVolume'));
        }
    }

    Handler = Class.extend({
        init: function() {
            var that = this;

            PlaybackModel.off('change:volume', PlaybackModel.onVolumeChange);
            PlaybackModel.onVolumeChange = function() {
                if (typeof window.plugCubed === 'undefined') {
                    this.set('muted', this.get('volume') === 0);
                } else {
                    if (!_.isBoolean(this.get('mutedOnce'))) {
                        this.set('mutedOnce', false);
                    }

                    if (this.get('volume') === 0) {
                        if (!this.get('muted')) {
                            this.set('muted', true);
                        } else if (!this.get('mutedOnce')) {
                            this.set('mutedOnce', true);
                        } else {
                            this.set('mutedOnce', false);
                            this.set('muted', false);
                        }
                    } else {
                        this.set('mutedOnce', false);
                        this.set('muted', false);
                    }
                }
            };
            PlaybackModel.on('change:volume', PlaybackModel.onVolumeChange);

            PlaybackModel.on('change:media', onMediaChange);
            PlaybackModel._events['change:media'].unshift(PlaybackModel._events['change:media'].pop());

            setTimeout(function() {
                $('#volume').remove();
                volume = new VolumeView(that);
                $('#now-playing-bar').append(volume.$el);
                volume.render();
            }, 1);
        },
        onVolumeChange: function() {
            PlaybackModel.onVolumeChange();
        },
        get: function(key) {
            return PlaybackModel.get(key);
        },
        set: function(key, value) {
            PlaybackModel.set(key, value);
        },
        mute: function() {
            while (!PlaybackModel.get('muted') || PlaybackModel.get('mutedOnce')) {
                volume.onClick();
            }
        },
        muteOnce: function() {
            while (!PlaybackModel.get('mutedOnce')) {
                volume.onClick();
            }
        },
        unmute: function() {
            while (PlaybackModel.get('muted')) {
                volume.onClick();
            }
        },
        close: function() {}
    });

    return new Handler();
});
