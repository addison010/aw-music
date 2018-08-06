import * as types from '../mutation-types'
import {playMode} from 'common/js/config'

const state = {
    fullScreen: false,
    playing: false,
    playList: [],
    sequenceList: [],
    currentIndex: -1,
    playMode: playMode.sequence,
    currentMusicUrl: ''
}

const getters = {
    getFullScreen: state => state.fullScreen,
    getPlaying: state => state.playing,
    getPlayList: state => state.playList,
    getSequenceList: state => state.sequenceList,
    getCurrentIndex: state => state.currentIndex,
    getPlayMode: state => state.playMode,
    getCurrentTrack: state => state.playList[state.currentIndex] || {},
    getCurrentMusicUrl: state => state.currentMusicUrl
}

const actions = {
    selectPlay: ({commit, state}, {list, index}) => {
        commit(types.SET_FULLSCREEN, true)
        commit(types.SET_PLAY_LIST, list)
        commit(types.SET_SEQUENCE_LIST, list)
        commit(types.SET_CURRENT_INDEX, index)
    }
}

const mutations = {
    [types.SET_FULLSCREEN] (state, isFullScreen) {
        state.fullScreen = isFullScreen
    },
    [types.SET_PLAYING] (state, isPlaying) {
        state.playing = isPlaying
    },
    [types.SET_PLAY_LIST] (state, playList) {
        state.playList = playList
    },
    [types.SET_SEQUENCE_LIST] (state, sequenceList) {
        state.sequenceList = sequenceList
    },
    [types.SET_CURRENT_INDEX] (state, currentIndex) {
        state.currentIndex = currentIndex
    },
    [types.SET_PLAY_MODE] (state, playMode) {
        state.playMode = playMode
    },
    [types.SET_CURRENT_MUSIC_URL] (state, musicUrl) {
        state.currentMusicUrl = musicUrl
    }
}

export default {
    state, getters, actions, mutations
}
