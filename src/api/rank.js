import axios from 'axios'
import {BASE_URL} from './config'

const Ids = [0, 1, 2, 3, 4, 5, 10, 11]

function _getRankList (listId) {
    return axios.get(`${BASE_URL}/top/list?idx=${listId}`)
}

export function getAllRankList () {
    return new Promise((resolve, reject) => {
        let results = []

        axios.all(Ids.map(id => _getRankList(id)))
        .then(axios.spread((...res) => {
            res.map(r => {
                results.push(r.data)
            })
            resolve(results)
        }))
        .catch(err => reject(err))
    })
}