<template>
    <div id="container">
        <loader @loaded="loaded" :progress="loadingProgress"></loader>
        <!--img v-for="img in images" :src="img.src" /-->
        <div v-show="hasLoaded">
            <h1>spinner winner</h1>
            <h2>Roll up... guaranteed prizes</h2>
            <div ref="wheel" id="wheel"></div>
            <button  @click="spin">Spin the wheel</button>
        </div>
    </div>
</template>

<script>
import { TweenMax, Circ, TimelineMax } from 'gsap';
import Loader from './loader';
import AudioHandler from '../audioHandler';
import '../../images/wheel.png';
import '../../images/arrow.png';
import '../../fonts/marvin-webfont.woff';
import '../../audio/chime.mp3';
import '../../audio/coins.mp3';
import '../../audio/spinning.mp3';
import '../../audio/theme.mp3';

let audio = new AudioHandler();

export default {
    name: 'Main',
    components: { Loader },
    data() {
        return {
            loadingProgress: 0,
            hasLoaded: false,
            images: {},
            interacted: false,
            prize: 0
        };
    },
    methods: {
        loaded() {
            this.hasLoaded = true;
            this.images.arrow.id = 'arrow';
            this.$refs.wheel.appendChild(this.images.wheel);
            this.$refs.wheel.appendChild(this.images.arrow);
        },
        addImage(img, name, increment) {
            this.images[name] = img;
            this.loadingProgress += increment;
        },
        playMainTheme() {
            if (!this.interacted) {
                window.requestAnimationFrame(this.playMainTheme);
            } else {
                audio.play('theme', 0.3);
            }
        },
        spin() {
            const t = new TimelineMax();

            TweenMax.to(this.images.wheel, 9, {
                rotation: 720 + this.prize,
                ease: Circ.easeOut,
                onStart: () => {
                    audio.repeat('chime', false);
                    audio.repeat('coins', false);
                    audio.repeat('spinning', false);
                    audio.play('spinning');
                },
                onComplete: () => {
                    audio.play('chime');
                    audio.play('coins');
                    let vol = { theme: 0.3 }; // eslint-disable-line
                    TweenMax.to(vol, 2, {
                        theme: '0',
                        delay: 3,
                        onUpdate: () => {
                            audio.volume('theme', vol.theme);
                        }
                    });
                }
            });
        },
        interaction() {
            this.interacted = true;
            document.body.removeEventListener('click', this.interaction);
            document.body.removeEventListener('keypress', this.interaction);
            document.body.removeEventListener('scroll', this.interaction);
            document.body.removeEventListener('touchstart', this.interaction);
        }
    },
    mounted() {
        audio = new AudioHandler();
        // Simulated AJAX call to retrieve prize rotation values
        const prizes = [350, 9, 40, 90, 120];
        this.prize = prizes[Math.floor(Math.random() * 5)];
        // Simulation end
        const assets = [
            { type: 'image', url: '/images/wheel.png', name: 'wheel' },
            { type: 'image', url: '/images/arrow.png', name: 'arrow' },
            { type: 'font', url: '/fonts/marvin-webfont.woff', name: 'marvin' },
            { type: 'audio', url: '/audio/chime.mp3', name: 'chime' },
            { type: 'audio', url: '/audio/coins.mp3', name: 'coins' },
            { type: 'audio', url: '/audio/spinning.mp3', name: 'spinning' },
            { type: 'audio', url: '/audio/theme.mp3', name: 'theme' }
        ];
        const increment = 100 / assets.length;
        document.addEventListener('clip_loaded', () => {
            return (this.loadingProgress += increment);
        });
        const head = document.head || document.getElementsByTagName('head')[0];
        let img, css, style;
        for (const asset of assets) {
            switch (asset.type) {
            case 'font':
                css = `@font-face {
                        font-family: '${asset.name}';
                        src: url('${asset.url}') format('woff');
                        font-weight: normal;
                        font-style: normal;
                    }`;
                style = document.createElement('style');
                style.type = 'text/css';
                style.appendChild(document.createTextNode(css));
                head.appendChild(style);
                this.loadingProgress += increment;
                break;
            case 'image':
                img = new Image();
                img.src = asset.url;
                img.onload = this.addImage(img, asset.name, increment);
                break;
            case 'audio':
                audio.preload(asset.name, asset.url);
                break;
            default:
                break;
            }
        }
        this.playMainTheme();
        document.body.addEventListener('click', this.interaction);
        document.body.addEventListener('keypress', this.interaction);
        document.body.addEventListener('scroll', this.interaction);
        document.body.addEventListener('touchstart', this.interaction);
    }
};
</script>
<style lang="scss">
@import '../../styles/responsive.scss';

#container {
    background: linear-gradient(to bottom, #ff7c00 0%, #ff0053 100%);
    height: 100%;
    width: 100%;
    border-radius: 0;
    text-align: center;
    color: #fff;

    @include desktop {
        width: 550px;
        height: 680px;
    }
}

#wheel {
    height: 300px;
    width: 300px;
    margin-top: 32px;
}

img {
    width: 100%;
    height: 100%;
}

#arrow {
    position: absolute;
    width: 50px;
    height: 50px;
    left: calc(50% - 25px);
    top: -5px;
}

h1 {
    font-family: 'marvin', sans-serif;
    letter-spacing: 2px;
    text-shadow: -2px 2px 0 rgba(0, 0, 0, 0.5);
    transform: rotate(358.5deg);
    margin-top: 32px;
}

h2 {
    font-weight: lighter;
    font-size: 20px;
}

button {
    font-family: 'marvin', sans-serif;
    background: #feda29;
    border: 0;
    border-radius: 30px;
    padding: 12px 32px;
    font-size: 24px;
    margin-top: 32px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.6);

    &:focus {
        outline: 0;
    }
}
</style>