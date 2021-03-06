<template>
    <transition name="fade">
        <div class="artist-wrap" ref="artistList">
            <scroll ref="scroll" class="artist-content" :data="artistList" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
                <div>
                    <div v-for="(grouped, index) in artistList" :key="index" ref="groupedList">
                        <div class="grouped-flag">{{ grouped.flag }}</div>
                        <div @click="selectArtist(artist)" v-for="artist in grouped.artists" :key="artist.id" class="artist-row">
                            <img v-lazy="artist.imgUrl" alt="">
                            <span>{{ artist.name }}</span>
                        </div>
                    </div>
                    <loading v-show="!artistList.length > 0"></loading>
                </div>
                <div class="index-list">
                    <ul>
                        <li v-for="(letter, index) in indexList" :key="letter" :data-index="index"
                            @touchstart="onIndexStart" @touchmove.stop.prevent="onIndexMove"
                            :class="{'current': currentIndex === index}">
                            {{ letter }}
                        </li>
                    </ul>
                </div>
            </scroll>
            <router-view></router-view>
        </div>
    </transition>
</template>

<script>
import {getArtistList} from 'api/artist'
import {SUCC_CODE} from 'api/config'
import pinyin from 'tiny-pinyin'
import Scroll from 'base/scroll'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'
import Loading from 'base/loading'

export default {
    mixins: [playListMixin],
    data () {
        return {
            probeType: 3,
            listenScroll: true,
            artistList: [],
            indexList: [],
            touch: {},
            listHeight: [0],
            scrollY: -1,
            currentIndex: 0
        }
    },
    components: {
        Scroll,
        Loading
    },
    created () {
        this._getArtistList()
    },
    methods: {
        handlePlaylist (playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.artistList.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        onIndexStart (e) {
            let touchIndex = e.target.getAttribute('data-index')
            this.$refs.scroll.scrollToElement(this.$refs.groupedList[touchIndex])

            this.touch.y1 = e.touches[0].pageY // mark first touch Y position
            this.touch.touchIndex1 = touchIndex // mark fist touch index
            this.scrollY = -this.listHeight[touchIndex]
        },
        onIndexMove (e) {
            this.touch.y2 = e.touches[0].pageY // mark moving Y position
            let delta = ~~((this.touch.y2 - this.touch.y1) / 20) // 20px is the height of each letter

            let newIndex = this.touch.touchIndex1 * 1 + delta // because touchIndex1 is String, use * 1 convert type to number
            this.$refs.scroll.scrollToElement(this.$refs.groupedList[newIndex])
            this.scrollY = -this.listHeight[newIndex]
        },
        _calculateScrollListHeight () {
            let height = 0
            for (let grouped of this.$refs.groupedList) {
                height += grouped.clientHeight
                this.listHeight.push(height)
            }
        },
        scroll (pos) {
            this.scrollY = pos.y
        },
        selectArtist (artist) {
            this.$router.push({
                path: `/artist/${artist.id}`
            })
            this.SET_ARTIST(artist)
        },
        _getArtistList () {
            getArtistList()
            .then(res => {
                if (res.code === SUCC_CODE) {
                    let fullList = []
                    res.artists.map(artist => {
                        fullList.push({
                            id: artist.id,
                            name: artist.name,
                            imgUrl: artist.img1v1Url,
                            firstLetter: pinyin.convertToPinyin(artist.name).substr(0, 1)
                        })
                    })

                    fullList.map(artist => {
                        let exist = this.artistList.find(a => a.flag === artist.firstLetter)
                        if (exist) {
                            exist.artists.push(artist)
                        } else {
                            this.artistList.push({
                                flag: artist.firstLetter,
                                artists: [artist]
                            })
                        }
                    })
                    this.artistList.sort((a, b) => a.flag.localeCompare(b.flag))

                    this.artistList.unshift({
                        flag: '热',
                        artists: [...fullList.slice(1, 10)]
                    })

                    this.artistList.map(a => this.indexList.push(a.flag))
                }
            })
            .catch(err => console.log(err))
        },
        ...mapMutations(['SET_ARTIST'])
    },
    watch: {
        artistList () {
            setTimeout(() => {
                this._calculateScrollListHeight()
            }, 20)
        },
        scrollY (newY) {
            if (newY > 0) { // if scroll above top, set currentIndex to 0
                this.currentIndex = 0
                return
            }

            this.listHeight.forEach((groupY, index) => {
                if (-newY >= groupY && -newY < this.listHeight[++index]) { // if scrollY between 2 groups
                    this.currentIndex = index - 1
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
    .artist-wrap {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 100px;
        bottom: 0;
        width: 100%;
        .artist-content {
            height: 100%;
            overflow: hidden;
            .grouped-flag {
                background: #F0F0F0;
                padding: 5px 12px;
                font-size: 0.8rem;
            }
            .artist-row {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                padding: 5px 10px;
                border-bottom: 1px solid #F0F0F0;
                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 6px;
                }
                span {
                    margin-left: 20px;
                    font-size: 0.8rem;
                }
            }
            .index-list {
                display: flex;
                flex-flow: column nowrap;
                position: absolute;
                right: 6px;
                top: 50%;
                transform: translateY(-50%);
                line-height: 1.3rem;
                font-size: 12px;
                text-align:center;
                background: #F5F5F5;
                padding: 5px;
                border-radius: 6px;
                .current {
                    color: red;
                }
            }
        }
    }
</style>
