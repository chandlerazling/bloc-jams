var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
    var $row = $(template);
    var clickHandler = function() {
        var songNumber = parseInt($(this).data('song-number'));
        if (currentlyPlayingSongNumber === null) {
            //no song is playing - set current to playing
            $(this).html(pauseButtonTemplate);
            setCurrentSong(songNumber)
            updatePlayerBarSong();
            currentSoundFile.play();
            updateSeekPercentage($('.volume .seek-bar'), currentVolume/100);
        } else if (currentlyPlayingSongNumber === songNumber) {
            //clicked on currently playing so swtich from pause to play button
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        } else if (currentlyPlayingSongNumber !== songNumber) {
            //clicked on another song while one is playing - so switch pause button
            var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingSongElement.html(currentlyPlayingSongElement.data('song-number'));
            $(this).html(pauseButtonTemplate);
            setCurrentSong(songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        }

    };
    var onHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songItem.data('song-number'));

        if(songNumber != currentlyPlayingSongNumber) {
            songItem.html(playButtonTemplate);
        }
    };
    var offHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songItem.data('song-number'));

        if (songNumber != currentlyPlayingSongNumber) {
            songItem.html(songNumber);
        }
    };
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
 }

/*Given the song number of a song, sets currentSongFromAlbum and currentSongNumber*/
var setCurrentSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    if (songNumber === null) {
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
        currentSoundFile = null;
    } else {
        currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber-1];
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
        formats: [ 'mp3' ],
        preload: true
     });
        setVolume(currentVolume);
    }   
}

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

/** Set Volume **/
var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}

/** Go to next or previous song. i should be -1 or 1 */
var changeCurrentSong = function(i) {
    var newSongNumber = currentlyPlayingSongNumber + i;
    if (newSongNumber <= 0) {
        newSongNumber = currentAlbum.songs.length;
    } else if (newSongNumber > currentAlbum.songs.length) {
        newSongNumber = 1;
    }
    setCurrentSong(newSongNumber);
}

var getSongNumberCell = function(number) {
    return $('[data-song-number="' + number + '"]');
}
var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    
}};


var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}


var nextSong = function() {
    var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingSongElement.html(currentlyPlayingSongElement.data('song-number'));
    changeCurrentSong(1);
    updatePlayerBarSong();
    currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingSongElement.html(pauseButtonTemplate);
    currentSoundFile.play();
}

var previousSong = function() {
    var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingSongElement.html(currentlyPlayingSongElement.data('song-number'));
    changeCurrentSong(-1);
    updatePlayerBarSong();
    currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingSongElement.html(pauseButtonTemplate);
    currentSoundFile.play();
}

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').html(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').html(currentSongFromAlbum.title + " - " + currentSongFromAlbum.artist);
    $('.currently-playing .artist-name').html(currentSongFromAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
}

var togglePlayFromPlayerBar = function () {
    if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        $playPauseButton.html(pauseButtonTemplate);
    } else {
        currentSoundFile.pause();
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
        $playPauseButton.html(playButtonTemplate);

    }

}

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;

    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function(event) {

        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();

        var seekBarFillRatio = offsetX / barWidth;

        updateSeekPercentage($(this), seekBarFillRatio);
        if ($(this).parent().hasClass('volume')) {
            setVolume(seekBarFillRatio * 100);
        } else {
            seek(seekBarFillRatio * currentSongFromAlbum.duration);
        }
    });
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            updateSeekPercentage($seekBar, seekBarFillRatio);
            if ($(this).parent().hasClass('volume')) {
                setVolume(seekBarFillRatio * 100);
            } else {
                seek(seekBarFillRatio * currentSongFromAlbum.duration);
            }
        });

        $(document).bind('mouseup.thumb', function() {
        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');
        });
    });
};

// album button template
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
    setupSeekBars();
});