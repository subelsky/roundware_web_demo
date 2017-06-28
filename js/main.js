var hostname = window.location.hostname;
var roundwareServerUrl;

if (hostname !== "localhost" || window.location.search.match(/live=true/)) {
  roundwareServerUrl = "https://roundware.dyndns.org/api/2";
} else {
  // In development mode, use a locally-running Roundware server, see https://github.com/roundware/roundware-server#vagrant
  roundwareServerUrl = "//" + hostname + ":8888/api/2";
}

var roundwareProjectId = 1;
var playButton, pauseButton, spinner, tagIds, sound;

var roundware = new Roundware(window,{
  serverUrl: roundwareServerUrl,
  projectId: roundwareProjectId
});

  
function firstTimePlaying(streamURL) {
  spinner.show();
  console.info("Loading " + streamURL);

  sound = new Howl({
    src: [streamURL],
    autoplay: true,
    html5: true
  });

  sound.on('play',function handlePlayStart() {
    spinner.remove();
    console.info("Playing");
  });


  sound.on('pause',function handlePlayPause() { 
    console.info("Pausing");
  });

  spinner.remove();

  tagIds.change(function(evt) {
    roundware.tags(tagIds.val().join(","));
  });
}

function play() {
  enablePauseControls();

  roundware.play(firstTimePlaying).
    then(function() { 
      sound.play(); 
    });
}

function pause() {
  enablePlayControls();
  sound.pause();
}

// Uses "swal", the sweetalert convenience function
function handleError(userErrMsg) {
  spinner.hide();

  swal({
    title: "Unable to start Roundware",
    text: userErrMsg,
    type: "error",
    confirmButtonText: "OK"
  });
}

function enablePlayControls() {
  playButton.removeAttr("disabled");
  pauseButton.prop("disabled",true);
}

function enablePauseControls() {
  playButton.attr("disabled",true);
  pauseButton.removeAttr("disabled");
}

function ready() {
  pauseButton.click(pause);
  playButton.click(play);
  enablePlayControls();
}

$(function startApp() {
  playButton = $("#playbutton");
  pauseButton = $("#pausebutton");
  spinner = $("#spinner");
  tagIds = $("#tag_ids");

  roundware.connect().
    then(ready).
    fail(handleError);
});
