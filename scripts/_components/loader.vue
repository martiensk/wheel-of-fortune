<template>
    <section v-if="progress < 100">
        <div>
            <div ref="loader" class="loader"></div>
        </div>
        <span>Loading...</span>
    </section>
</template>

<script>
import { TweenMax } from 'gsap';

export default {
    name: 'Loader',
    props: {
        progress: {
            type: Number,
            default: 0
        }
    },
    watch: {
        progress(val) {
            const progressWidth = this.$refs.loader.parentElement.offsetWidth * (this.progress / 100);
            TweenMax.to(this.$refs.loader, 0.6, { width: progressWidth });
        }
    }
};
</script>
<style lang="scss" scoped>
@import '../../styles/responsive.scss';

section {
    width: 80%;
    text-align: center;
}

span {
    margin-top: 8px;
    display: inline-block;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 1px #000;
}

div {
    width: 100%;
    height: 20px;
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    background: transparent;

    .loader {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #fff;
        width: 0;
        box-shadow: 1px 1px 1px #000;
    }
}
</style>