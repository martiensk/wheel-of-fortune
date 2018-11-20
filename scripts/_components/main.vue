<template>
    <div>
        <loader :progress="loadingProgress"></loader>
        <!--img v-for="img in images" :src="img.src" /-->
    </div>
</template>

<script>
import Loader from './loader';
import '../../images/inner.png';
import '../../images/rim.png';
import '../../images/arrow.png';
import '../../fonts/Marvin.otf';
import '../../audio/chime.mp3';
import '../../audio/coins.mp3';
import '../../audio/spinning.mp3';

export default {
    name: 'Main',
    components: { Loader },
    data() {
        return {
            loadingProgress: 0,
            images: {}
        };
    },
    methods: {
        addImage(img, name, increment) {
            this.images[name] = img;
            this.loadingProgress += increment;
        }
    },
    mounted() {
        const assets = [
            { type: 'image', url: '/images/inner.png', name: 'inner' },
            { type: 'image', url: '/images/rim.png', name: 'rim' },
            { type: 'image', url: '/images/arrow.png', name: 'arrow' },
            { type: 'font', url: '/fonts/Marvin.otf' },
            { type: 'audio', url: '/audio/chime.mp3', name: 'chime' },
            { type: 'audio', url: '/audio/coins.mp3', name: 'coins' },
            { type: 'audio', url: '/audio/spinning.mp3', name: 'spinning' }
        ];
        const increment = 100 / assets.length;
        let link = null;
        let img = null;
        for (const asset of assets) {
            switch (asset.type) {
            case 'font':
                link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                link.setAttribute('href', asset.url);
                document.head.appendChild(link);
                this.loadingProgress += increment;
                break;
            case 'image':
                img = new Image();
                img.src = asset.url;
                img.onload = this.addImage(img, asset.name, increment);
                break;
            case '':
            default:
                break;
            }
        }
    }
};
</script>
<style lang="scss">
@import '../../styles/responsive.scss';

div {
    background: linear-gradient(to bottom, #ff7c00 0%, #ff0053 100%);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @include desktop {
        width: 550px;
        height: 680px;
    }
}

img {
    width: 50px;
}
</style>