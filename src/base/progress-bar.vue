<template>
    <div class="bar-container" ref="barContainer" @click="progressClick">
        <div class="inner-bar">
            <div class="progress" ref="progress"></div>
            <div class="btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend.prevent="progressTouchEnd">
                <div class="contrl-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
const btnWidth = 16

export default {
    props: {
        percent: {
            type: Number,
            default () {
                return 0
            }
        }
    },
    created () {
        this.touch = {}
    },
    methods: {
        progressTouchStart (e) {
            this.touch.initiated = true
            this.touch.startX = e.touches[0].pageX
            this.touch.elapseWidth = this.$refs.progress.clientWidth
        },
        progressTouchMove (e) {
            if (!this.touch.initiated) {
                return
            }
            const deltaX = e.touches[0].pageX - this.touch.startX
            const barClientWidth = this.$refs.barContainer.clientWidth - btnWidth
            const offsetWidth = Math.min(barClientWidth, Math.max(0, this.touch.elapseWidth + deltaX))
            this._offSet(offsetWidth)
        },
        progressTouchEnd (e) {
            this.touch.initiated = false
            this._triggerPercent()
        },
        _triggerPercent () {
            const barClientWidth = this.$refs.barContainer.clientWidth - btnWidth
            let adjustedPercent = this.$refs.progress.clientWidth / barClientWidth
            this.$emit('adjustPercent', adjustedPercent)
        },
        progressClick (e) {
            this._offSet(e.offsetX)
            this._triggerPercent()
        },
        _offSet (offsetWidth) {
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.progressBtn.style.transform = `translateX(${offsetWidth}px)`
        }
    },
    watch: {
        percent (newPercent) {
            if (newPercent >= 0 && !this.touch.initiated) {
                const barClientWidth = this.$refs.barContainer.clientWidth - btnWidth
                const offsetWidth = newPercent * barClientWidth
                this._offSet(offsetWidth)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
    .bar-container {
        height: 30px;
        .inner-bar {
            position: relative;
            top: 13px;
            height: 4px;
            background: $color-background;
            .progress {
                position: absolute;
                height: 100%;
                background: $color-secondary;
            }
            .btn-wrapper {
                position: absolute;
                left: -8px;
                top: -13px;
                width: 30px;
                height: 30px;
                .contrl-btn {
                    position: relative;
                    top: 7px;
                    left: 7px;
                    box-sizing: border-box;
                    width: 16px;
                    height: 16px;
                    border: 3px solid $color-background;
                    border-radius: 50%;
                    background: $color-secondary;
                }
            }
        }
    }
</style>
