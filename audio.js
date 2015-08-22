var Audio = {};
Audio.loadAudio = function() {
    var audioElements = [].slice.apply(document.querySelectorAll("#audio audio"));
    audioElements.forEach(function(audioElement) {
        Audio[audioElement.id] = {
            play: function() {
                var newElement = document.createElement("audio");
                newElement.src = audioElement.src;
                newElement.play();
            },
            playOnce: function() {
                audioElement.play();
            },
            stop: function() {
                audioElement.currentTime = 0;
                audioElement.pause();
            }
        }
	});
};