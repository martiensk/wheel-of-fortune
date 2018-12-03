<template>
    <div id="container">
        <loader @loaded="loaded" :progress="loadingProgress"></loader>
        <!--img v-for="img in images" :src="img.src" /-->
        <div v-show="hasLoaded">
            <h1>spinner winner</h1>
            <h2 class="top-text">Roll up... guaranteed prizes</h2>
            <div ref="wheel" id="wheel"></div>
            <div class="button-container">
                <button  @click="claim">Spin the wheel</button>
                <h2 class="bottom-text">What will you win?</h2>
            </div>
        </div>
    </div>
</template>

<script>
import { TweenMax, Circ, Elastic, TimelineMax } from 'gsap';
import Loader from './loader';
import AudioHandler from '../audioHandler';

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
            prize: 0,
            spun: false
        };
    },
    methods: {
        loaded() {
            this.hasLoaded = true;
            this.images.arrow.id = 'arrow';
            this.$refs.wheel.appendChild(this.images.wheel);
            this.images.prize.classList.add('prize-image');
            TweenMax.set(this.images.prize, { autoAlpha: 0, scale: 0 });
            this.$refs.wheel.appendChild(this.images.prize);
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
        claim() {
            if (!this.spun) {
                this.spin();
                this.spun = true;
                return;
            }
            alert('Offer claimed');
        },
        spin() {
            const vol = { theme: 0.3 };
            const t = new TimelineMax();
            t.set('.bottom-text', { autoAlpha: 0, display: 'block' })
                .to('button', 0.5, {
                    y: 10,
                    boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
                })
                .to('button', 0.5, {
                    y: 0,
                    autoAlpha: 0
                })
                .to('.bottom-text', 0.5, { autoAlpha: 1 })
                .to('#container h1', 0.4, { x: '-150%' }, 1)
                .to('.top-text', 0.4, { autoAlpha: 0 }, 1)
                .set('#container h1', {
                    x: '0%',
                    y: '-100%',
                    innerText: 'Good Luck'
                })
                .to('#container h1', 0.6, { y: '10%', ease: Elastic.easeOut })
                .to(this.images.wheel,
                    9,
                    {
                        rotation: 720 + this.prize.ref,
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
                        }
                    },
                    0)
                .to('#container h1', 0.5, { autoAlpha: 0 }, 7.5)
                .set('#container h1',
                    {
                        scale: 0,
                        rotation: 356.5,
                        innerText: 'congratulations'
                    },
                    7.6)
                .set('button',
                    {
                        y: -50,
                        innerText: 'claim',
                        padding: '8px 44px',
                        fontSize: '30px'
                    },
                    7.6)
                .to('#container h1', 0.5, { autoAlpha: 1, scale: 1 }, 7.7)
                .to('.bottom-text', 0.5, { autoAlpha: 0 }, 7.7)
                .to('button',
                    0.5,
                    {
                        autoAlpha: 1,
                        y: 0,
                        boxShadow: '0 10px 10px rgba(0,0,0,0.6)'
                    },
                    7.7)
                .to(this.images.prize, 0.5, { autoAlpha: 1, scale: 1 })
                .to(vol, 2, {
                    theme: '0',
                    delay: 3,
                    onUpdate: () => {
                        audio.volume('theme', vol.theme);
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

        /*
         * Simulated AJAX call to retrieve prize rotation values
         *const prizes = [350, 9, 40, 90, 120];
         */
        const prizes = [
            {
                prize: 'gbp1000',
                ref: 350
            },
            {
                prize: 'pbbogof',
                ref: 318
            },
            {
                prize: 'mm40',
                ref: 270
            },
            {
                prize: 'pbfree',
                ref: 238.5
            },
            {
                prize: 'pb30',
                ref: 204.5
            },
            {
                prize: 'mm20',
                ref: 153.5
            },
            {
                prize: 'gbp250',
                ref: 121.5
            },
            {
                prize: 'pb20',
                ref: 88.5
            },
            {
                prize: 'mmbogof',
                ref: 39.5
            },
            {
                prize: 'mmfree',
                ref: 8.5
            }
        ];
        this.prize = prizes[Math.floor(Math.random() * prizes.length)];
        const imageUrl = 'https://res.cloudinary.com/dzn0bpi9a/image/upload/v1542973760/Seb%20special%20game/';
        const fontUrl = 'https://res.cloudinary.com/dzn0bpi9a/raw/upload/v1542973760/Seb%20special%20game/';
        const soundUrl = 'https://res.cloudinary.com/dzn0bpi9a/video/upload/v1542973760/Seb%20special%20game/';
        // Simulation end
        const assets = [
            { type: 'image', url: `${imageUrl}wheel.png`, name: 'wheel' },
            { type: 'image', url: `${imageUrl}arrow.png`, name: 'arrow' },
            {
                type: 'image',
                url: `${imageUrl}${this.prize.prize}.png`,
                name: 'prize'
            },
            { type: 'font', url: `${fontUrl}marvin-webfont.woff`, name: 'marvin' },
            { type: 'audio', url: `${soundUrl}chime.mp3`, name: 'chime' },
            { type: 'audio', url: `${soundUrl}coins.mp3`, name: 'coins' },
            { type: 'audio', url: `${soundUrl}spinning.mp3`, name: 'spinning' },
            { type: 'audio', url: `${soundUrl}theme.mp3`, name: 'theme' }
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
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @include tablet {
        width: 475px;
        height: 600px;
    }
}

#wheel {
    height: 300px;
    width: 300px;
    margin-top: 32px;
    position: relative;

    @include mobile {
        height: 340px;
        width: 340px;
        margin-top: 16px;
    }
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
    font-size: 28px;

    @include mobile {
        text-shadow: -3px 3px 0 rgba(0, 0, 0, 0.5);
        font-size: 32px;
    }
}

h2 {
    font-weight: lighter;
    font-size: 20px;

    @include mobile {
        font-size: 22px;
    }
}

button {
    font-family: 'marvin', sans-serif;
    background: #feda29;
    border: 0;
    border-radius: 30px;
    padding: 12px 32px;
    font-size: 24px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.6);
    display: block;
    margin: 0 auto;

    &:focus {
        outline: 0;
    }

    @include mobile {
        font-size: 26px;
    }
}

.button-container {
    position: relative;
    margin-top: 32px;
}

.bottom-text {
    display: none;
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
}

.prize-image {
    position: absolute;
    top: 17px;
    left: 17px;
    height: 266px;
    width: 266px;

    @include mobile {
        top: 20px;
        left: 20px;
        height: 300px;
        width: 300px;
}
}
</style>