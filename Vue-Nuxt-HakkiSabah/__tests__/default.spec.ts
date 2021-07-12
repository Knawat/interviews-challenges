import Vuetify from 'vuetify'

import defaultLayout from '@/layouts/default.vue'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { describe, it, expect } from '@jest/globals'
import Navigation from '~/components/Navigation.vue'

describe('default.vue', () => {
  const localVue = createLocalVue()
  const vuetify = new Vuetify()

  const wrapper = shallowMount(defaultLayout, {
    localVue,
    vuetify,
    stubs: {
      nuxt: true
      // Any other component that you want stubbed
    }
  })
  it('should have Navigation component', () => {
    const NavigationComp = wrapper.findComponent(Navigation)
    expect(NavigationComp.exists()).toBe(true)
  })
})
