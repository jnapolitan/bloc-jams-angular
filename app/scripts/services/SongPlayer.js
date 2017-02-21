 (function () {
     function SongPlayer(Fixtures) {
         var SongPlayer = {};

         /**
          * @desc Get album data from Fixtures
          * @type {Object}
          */

         var currentAlbum = Fixtures.getAlbum();

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
          * @function getSongIndex
          * @desc Returns index of song
          * @param {Object} song
          */

         var getSongIndex = function (song) {
             return currentAlbum.songs.indexOf(song);
         };

         /**
          * @desc Active song object from list of songs
          * @type {Object}
          */

         SongPlayer.currentSong = null;

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
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
             } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };

         return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['Fixtures', SongPlayer]);
 })();