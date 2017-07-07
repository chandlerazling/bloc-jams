var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

  var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return $(template);
 }


 var setCurrentAlbum = function(album) {
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
     }
 };

var findParentByClassName = function(element, className) {
    if (element) {
        var parent = element.parentElement;
        if (parent) { 
            while(parent) {
                if (parent.classList.contains(className)) {
                    return parent;
                }
                parent = parent.parentElement;
            }
            console.log("No parent found with that class name");
        } else {
            console.log("No parent found")
        }
    }
 };

var getSongItem = function(element) {
    if (element.className == "album-view-song-item") {
        return element.querySelector(".song-item-number");
    } else {
        return findParentByClassName(element,'album-view-song-item').querySelector('.song-item-number');
   }
};
 var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);  
    if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }

 };


 var songListContainer = $('album-view-song-list')[0];
 var songRows = $('album-view-song-item');
 // album button template
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var currentlyPlayingSong = null;

 window.onload = function() {
    setCurrentAlbum(albumPicasso);
    songListContainer.addEventListener('mouseover', function(event) {
        if (event.target.parentElement.className === 'album-view-song-item') {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = playButtonTemplate;
            }
        }
     });

    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');
 
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
        });

        songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
         });
    }
 };

