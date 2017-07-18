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
        } else if (currentlyPlayingSongNumber === songNumber) {
            //clicked on currently playing so swtich from pause to play button
            $(this).html(playButtonTemplate);
            setCurrentSong(null);
            $('.main-controls .play-pause').html(playerBarPlayButton);
        } else if (currentlyPlayingSongNumber !== songNumber) {
            //clicked on another song while one is playing - so switch pause button
            var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingSongElement.html(currentlyPlayingSongElement.data('song-number'));
            $(this).html(pauseButtonTemplate);
            setCurrentSong(songNumber);
            updatePlayerBarSong();
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
    if (songNumber === null) {
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
    } else {
        currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber-1];
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


var nextPreviousSong = function() {
    var change = 1;
    if ($(this).hasClass('previous')) {
        change = -1;
    }
    var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingSongElement.html(currentlyPlayingSongElement.data('song-number'));
    changeCurrentSong(change);
    updatePlayerBarSong();
    currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingSongElement.html(pauseButtonTemplate);
}


var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').html(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').html(currentSongFromAlbum.title + " - " + currentSongFromAlbum.artist);
    $('.currently-playing .artist-name').html(currentSongFromAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
}

// album button template
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(nextPreviousSong);
    $nextButton.click(nextPreviousSong);
});