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
            var currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
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

function mod(x,y) {
    if (x < 0) {
        return x % y + y;
    }
    else {
        return x % y;
    }
}
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}


var nextSong = function() {
    var currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
    currentlyPlayingSongElement.html(currentlyPlayingSongElement.data('song-number'));
    currentSongFromAlbum = currentAlbum.songs[mod((trackIndex(currentAlbum, currentSongFromAlbum) + 1), currentAlbum.songs.length)];
    updatePlayerBarSong();
    currentlyPlayingSongNumber = mod((currentlyPlayingSongNumber + 1), currentAlbum.songs.length);
    if (currentlyPlayingSongNumber == 0) {
        currentlyPlayingSongNumber = currentAlbum.songs.length;
    }
    currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
    currentlyPlayingSongElement.html(pauseButtonTemplate);

}

var previousSong = function() {
    var currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
    currentlyPlayingSongElement.html(currentlyPlayingSongElement.data('song-number'));
    currentSongFromAlbum = currentAlbum.songs[mod((trackIndex(currentAlbum, currentSongFromAlbum) - 1), currentAlbum.songs.length)];
    updatePlayerBarSong();
    currentlyPlayingSongNumber = mod((currentlyPlayingSongNumber - 1), currentAlbum.songs.length);
    if (currentlyPlayingSongNumber == 0) {
        currentlyPlayingSongNumber = currentAlbum.songs.length;
    }
    currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
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
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});