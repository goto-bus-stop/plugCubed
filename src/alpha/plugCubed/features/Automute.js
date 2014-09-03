define(['plugCubed/handlers/TriggerHandler', 'plugCubed/Settings', 'plugCubed/RSS', 'plugCubed/Utils', 'plugCubed/bridges/PlaybackModel'], function(TriggerHandler, Settings, RSS, p3Utils, PlaybackModel) {
    var handler = TriggerHandler.extend({
        trigger: API.ADVANCE,
        handler: function(data) {
            if (Settings.registeredSongs.indexOf(data.media.id) > -1) {
                setTimeout(function() {
                    PlaybackModel.muteOnce();
                }, 800);
                API.chatLog(p3Lang.i18n('automuted', data.media.title));
            }
        }
    });
    return new handler();
});