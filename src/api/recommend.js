import axios from 'axios'
import {BASE_URL} from './config'

export function getRecommendSlides () {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/banner`)
        .then(res => {
            resolve(res.data)
        })
        .catch(err => reject(err))
    })
}

export function getRecommendSongLists () {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/personalized`)
        .then(res => {
            resolve(res.data)
        })
        .catch(err => reject(err))
    })
}

export function getTrackListById (id) {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/playlist/detail?id=${id}`)
        .then(res => {
            resolve(res.data)
        })
        .catch(err => reject(err))
    })
}

export function getAlbumById (id) {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/album?id=${id}`)
        .then(res => {
            resolve(res.data)
        })
        .catch(err => reject(err))
    })
}
