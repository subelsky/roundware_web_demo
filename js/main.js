var roundwareServerUrl = "https://roundware.dyndns.org/api/2";
var roundwareProjectId = 10;
var playButton = $("#playbutton");
var pauseButton = $("#pausebutton");
var spinner = $("#spinner");
var tagIds = $("#tag_ids");

var roundware = new Roundware({
  serverUrl: roundwareServerUrl,
  projectId: roundwareProjectId
});

function handleListening(streamURL) {
  console.info("Starting to listen to " + streamURL);

  var sound = new Howl({
    src: [streamURL],
    autoplay: true,
    html5: true
  });

  window.sound = sound;

  sound.on('play',function handlePlayStart() {
    // roundware.play(); TODO not implemented yet
    pauseButton.removeAttr("disabled");
    playButton.attr("disabled","disabled");
  });

  sound.on('pause',function handlePlayPause() {
    // roundware.pause(); TODO not implemented yet
    pauseButton.attr("disabled","disabled");
    playButton.removeAttr("disabled");
  });

  spinner.remove();
  sound.play();

  pauseButton.click(function pauseButtonClicked() { sound.pause(); });
  playButton.click(function playButtonClicked() { sound.play(); });
}

function handleListeningFailure(userErrMsg,techErrMsg) {
  console.error("Roundware Start Error",userErrMsg,techErrMsg);

  // swal == sweetalert convenience function
  swal({
    title: "Unable to start Roundware",
    text: userErrMsg,
    type: "error",
    confirmButtonText: "OK"
  });
}

$(function startApp() {
  roundware.start().
    then(handleListening).
    catch(handleListeningFailure);

  tagIds.change(function(evt) {
    roundware.tags(tagIds.val().join(","));
  });
});
