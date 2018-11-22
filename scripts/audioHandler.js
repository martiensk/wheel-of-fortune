export default class AudioHandler {
    /**
     * This class is responsible for preloading sound clips, and playing them as requested.
     * @class AudioHandler
     * @author Martiens Kropff
     * @returns {void}
     */
    constructor() {
        /**
         * A list of audio files.
         * @author Martiens Kropff
         * @memberOf AudioHandler
         * @type {object}
         */
        this.audioFiles = {};

        /**
         * This object will keep track of what volume sounds should be played at if sound is muted, in case it gets unmuted again.
         * @author Martiens Kropff
         * @memberOf AudioHandler
         * @type {object}
         */
        this.muteVolumes = {};

        /**
         * Determines if audio should be muted or not.
         * @author Martiens Kropff
         * @memberOf AudioHandler
         * @type {object}
         */
        this.muted = false;

        /**
         * True if all audio clips have been preloaded.
         * @author Martiens Kropff
         * @memberOf AudioHandler
         * @type {boolean}
         */
        this.ready = false;

        /**
         * Keeps track of how many audio clips have been loaded.
         * @author Martiens Kropff
         * @memberOf AudioHandler
         * @type {number}
         */
        this.fileCounter = 0;

        /*
         *for (const i in this.audioFiles) {
         * this.preload(i, this.audioFiles[i]);
         *}
         */
        this.loadedEvent = new Event('clip_loaded');
    }

    /**
     * This function preloads an audio clip. Is called from the constructor.
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @param {string} clip The clip that should be loaded.
     * @param {string} url The clip's URL.
     * @returns {void}
     */
    preload(clip, url) {
        this.audioFiles[clip] = url;
        const audio = new Audio();
        audio.addEventListener('canplaythrough', this.loaded(clip, url));
        audio.src = url;
    }

    /**
     * Once an audio clip has been loaded this function will create an HTML5 audio element that can be used to play or pause the specific clip.
     * Once all the clips have been loaded this element sets the 'ready' class member to true.
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @param {string} clip The clip that has been loaded.
     * @param {string} url The clip's URL.
     * @returns {void}
     */
    loaded(clip, url) {
        this.fileCounter += 1;
        const audio = new Audio();
        audio.loop = true;
        const source = document.createElement('source');
        source.type = 'audio/mpeg';
        source.src = url;
        audio.appendChild(source);
        audio.volume = 0;
        this.audioFiles[clip] = audio;
        if (this.fileCounter === Object.keys(this.audioFiles).length) {
            this.ready = true;
            document.dispatchEvent(this.loadedEvent);
        }
    }

    /**
     * Plays and audio clip.
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @param {string} clip The clip that should be played.
     * @param {decimal} volume The volume that the clip should be played at.
     * @returns {void}
     */
    play(clip, volume = 1) {
        if (typeof this.audioFiles[clip] !== 'undefined') {
            if (!this.muted) {
                this.audioFiles[clip].volume = volume;
            } else {
                this.muteVolumes[clip] = volume;
                this.audioFiles[clip].volume = 0;
            }
            this.audioFiles[clip].play();
            this.audioFiles[clip].currentTime = 0;
        }
    }

    /**
     * Sets the volume of an audio clip.
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @param {string} clip The clip with the offensive volume.
     * @param {decimal} volume The volume that the clip should be played at.
     * @returns {void}
     */
    volume(clip, volume) {
        if (typeof this.audioFiles[clip] !== 'undefined') {
            if (!this.muted) {
                this.audioFiles[clip].volume = volume;
            } else {
                this.muteVolumes[clip] = volume;
                this.audioFiles[clip].volume = 0;
            }
        }
    }

    /**
     * Pauses and audio clip.
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @param {string} clip The clip that should be paused.
     * @returns {void}
     */
    pause(clip) {
        typeof this.audioFiles[clip] !== 'undefined' && this.audioFiles[clip].pause();
    }

    /**
     * Sets the repeat property of a sound clip.
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @param {string} clip The sound clip to be modified.
     * @param {boolean} repeat Set to true if the sound should be repeated, false if not.
     * @returns {void}
     */
    repeat(clip, repeat) {
        if (typeof this.audioFiles[clip] !== 'undefined') {
            this.audioFiles[clip].loop = repeat;
        }
    }

    /**
     * Mutes all audio
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @returns {void}
     */
    mute() {
        for (const i in this.audioFiles) {
            this.muteVolumes[i] = this.audioFiles[i].volume;
            this.audioFiles[i].volume = 0;
        }
        this.muted = true;
    }

    /**
     * Unmutes audio.
     * @author Martiens Kropff
     * @memberOf AudioHandler
     * @returns {void}
     */
    unmute() {
        for (const i in this.audioFiles) {
            this.audioFiles[i].volume = this.muteVolumes[i];
        }
        this.muted = false;
    }
}
