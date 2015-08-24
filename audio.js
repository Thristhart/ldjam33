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
                if (Audio.isReady(audioElement)) {
                    audioElement.play();
                }
            },
            stop: function() {
                if (Audio.isReady(audioElement)) {
                    audioElement.currentTime = 0;
                    audioElement.pause();
                }
            }
        }
	});
};

Audio.isReady = function(audioElement) {
  if (audioElement.readyState === 0) {
    console.log("audio element " + audioElement.id + " is not ready");
    return false;
  } else {
    return true;
  }
}