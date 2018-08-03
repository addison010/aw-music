import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Artist from 'components/artist/artist'
import ArtistDetail from 'components/artist-detail/artist-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: './recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/artist',
      name: 'artist',
      component: Artist,
      children: [
        {
          path: ':id',
          component: ArtistDetail
        }
      ]
    }
  ]
})
