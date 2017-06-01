var hostname = window.location.hostname;
var roundwareServerUrl;

if (hostname !== "localhost" || window.location.search.match(/live=true/)) {
  roundwareServerUrl = "https://roundware.dyndns.org/api/2";
} else {
  // In development mode, use a locally-running Roundware server, see https://github.com/roundware/roundware-server#vagrant
  roundwareServerUrl = "//" + hostname + ":8888/api/2";
}

var roundwareProjectId = 1;
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

// Uses "swal", the sweetalert convenience function
function handleListeningFailure(userErrMsg) {
  spinner.hide();

  swal({
    title: "Unable to start Roundware",
    text: userErrMsg,
    type: "error",
    confirmButtonText: "OK"
  });
}

$(function startApp() {
  spinner.show();

  roundware.start().
    then(handleListening).
    catch(handleListeningFailure);

  tagIds.change(function(evt) {
    roundware.tags(tagIds.val().join(","));
  });
});
