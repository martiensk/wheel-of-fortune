<template>
    <div id="container">
        <loader @loaded="loaded" :progress="loadingProgress"></loader>
        <!--img v-for="img in images" :src="img.src" /-->
        <div v-show="hasLoaded">
            <h1>spinner winner</h1>
            <h2>Roll up... guaranteed prizes</h2>
            <div ref="wheel" id="wheel" @click="spin"></div>
        </div>
    </div>
</template>

<script>
import { TweenMax, Circ, Elastic } from 'gsap';
import Loader from './loader';
import AudioHandler from '../audioHandler';
import '../../images/wheel.png';
import '../../images/arrow.png';
import '../../fonts/marvin-webfont.woff';
import '../../audio/chime.mp3';
import '../../audio/coins.mp3';
import '../../audio/spinning.mp3';
import '../../audio/theme.mp3';

const audio = new AudioHandler();

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
                audio.play('theme');
            }
        },
        spin() {
            TweenMax.to(this.images.wheel, 5, {
                rotation: 720 + this.prize,
                ease: Circ.easeOut,
                onComplete: () => {
                    TweenMax.to(this.images.wheel, 1, {
                        rotation: 0,
                        ease: Elastic.easeOut,
                        delay: 1
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

    @include desktop {
        width: 550px;
        height: 680px;
    }
}

#wheel {
    height: 300px;
    width: 300px;
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
</style>