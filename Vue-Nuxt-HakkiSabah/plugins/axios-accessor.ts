import { Plugin } from '@nuxt/types'
import { initializeAxios, initializeCookie } from '~/utils/api'

const accessor: Plugin = ({ $axios, $cookies }) => {
  initializeAxios($axios)
  initializeCookie($cookies)
}

export default accessor
