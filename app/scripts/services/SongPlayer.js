 (function () {
     function SongPlayer($rootScope, Fixtures) {
         var SongPlayer = {};

         /**
          * @desc Buzz object audio file
          * @type {Object}
          */

         var currentBuzzObject = null;

         /**
          * @function setSong
          * @desc Stops currently playing song and loads new audio file as currentBuzzObject
          * @param {Object} song
          */

         var setSong = function (song) {
             if (currentBuzzObject) {
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
             }

             currentBuzzObject = new buzz.sound(song.audioUrl, {
                 formats: ['mp3'],
                 preload: true
             });

             currentBuzzObject.bind('timeupdate', function () {
                 $rootScope.$apply(function () {
                     SongPlayer.currentTime = currentBuzzObject.getTime();
                 });
             });

             SongPlayer.currentSong = song;
         };

         /**
          * @function playSong
          * @desc Begins play function for currentBuzzObject and sets song.playing to true
          * @param {Object} song
          */

         var playSong = function (song) {
             currentBuzzObject.play();
             song.playing = true;
         };

         /**
          * @function stopSong
          * @desc Stops play function for currentBuzzObject and sets song.playing to null
          * @param {Object} song
          */

         var stopSong = function (song) {
             currentBuzzObject.stop();
             SongPlayer.currentSong.playing = null;
         };

         /**
          * @function getSongIndex
          * @desc Returns index of song
          * @param {Object} song
          */

         var getSongIndex = function (song) {
             return currentAlbum.songs.indexOf(song);
         };

         /**
          * @desc Get album data from Fixtures
          * @type {Object}
          */

         SongPlayer.currentAlbum = Fixtures.getAlbum();


         /**
          * @desc Active song object from list of songs
          * @type {Object}
          */

         SongPlayer.currentSong = null;

         /**
          * @desc Current playback time (in seconds) of currently playing song
          * @type {Number}
          */
         SongPlayer.currentTime = null;

         /**
          * @desc Current playback volume (from 0-100) of currently playing song
          * @type {Number}
          */
         SongPlayer.volume = 50;

         /**
          * @function SongPlayer.play
          * @desc Plays a newly selected song or plays currentSong if it is paused
          * @param {Object} song
          */

         SongPlayer.play = function (song) {
             song = song || SongPlayer.currentSong;
             if (SongPlayer.currentSong !== song) {
                 setSong(song);
                 playSong(song);
             } else if (SongPlayer.currentSong === song) {
                 if (currentBuzzObject.isPaused()) {
                     playSong(song);
                 }
             }
         };

         /**
          * @function SongPlayer.pause
          * @desc Pauses currentBuzzObject and sets song.playing to false
          * @param {Object} song
          */

         SongPlayer.pause = function (song) {
             song = song || SongPlayer.currentSong;
             currentBuzzObject.pause();
             song.playing = false;
         };

         /**
          * @function SongPlayer.previous
          * @desc Plays previous song if index is greater than zero or stops playback if there are no previous songs 
          * @param {Object} song
          */

         SongPlayer.previous = function () {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex--;

             if (currentSongIndex < 0) {
                 stopSong(song);
             } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };

         /**
          * @function SongPlayer.next
          * @desc Plays next song if index is less than number of songs or stops playback if there are no more songs 
          * @param {Object} song
          */

         SongPlayer.next = function () {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex++;

             if (currentSongIndex < currentAlbum.songs.length) {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             } else {
                 stopSong(song);
             }
         };

         /**
          * @function setCurrentTime
          * @desc Set current time (in seconds) of currently playing song
          * @param {Number} time
          */
         SongPlayer.setCurrentTime = function (time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
         };

         /**
          * @function setVolume
          * @desc Set current volume (from 0-100) of currently playing song
          * @param {Number} volume
          */
         SongPlayer.setVolume = function (volume) {
             if (currentBuzzObject) {
                 currentBuzzObject.setVolume(volume);
             }
         };


         return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
