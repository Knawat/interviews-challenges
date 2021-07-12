import Vuetify from 'vuetify'

import { createLocalVue, shallowMount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from '@jest/globals'
import Home from '~/components/Home.vue'
import { state, getters, mutations, actions, accessorType } from '~/store'
import Modal from '~/components/Modal.vue'
import { getcategories } from '~/store/__mocks__/category/categories'
import { getproducts } from '~/store/__mocks__/products/products'
import { getCartItems } from '~/store/__mocks__/cart/api'
import { $cookies } from '~/utils/api'

describe('Home.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const wrapper = shallowMount(Home, {
    localVue,
    vuetify,
    computed: {
      isCatFilled () {
        return getcategories
      }
    },
    mocks: {
      $accessor: {
        ...state,
        ...getters,
        ...mutations,
        ...actions,
        $cookies
      } as unknown as typeof accessorType
    },
    stubs: {
      NuxtLink: true,
      RouterLink: RouterLinkStub
      // Any other component that you want stubbed
    }
  })

  it('should have a Modal component', () => {
    const ModalComp = wrapper.findComponent(Modal)
    // component have a v-if condition and expect false
    expect(ModalComp.exists()).toBe(false)
  })

  it('should have data properties', () => {
    expect(wrapper.vm.$data.dialog).toEqual(false)
    expect(wrapper.vm.$data.modalProduct).toEqual({})
  })

  it('should have computed', () => {
    expect((wrapper.vm as any).$options.computed.isCatFilled.call()).toEqual(getcategories)
  })

  it('should have methods', () => {
    expect((wrapper.vm as any).showProduct).toBeInstanceOf(Function)
    expect((wrapper.vm as any).addCart).toBeInstanceOf(Function)
  })

  it('should showProduct method callable and check data properties', () => {
    (wrapper.vm as any).showProduct(getproducts[0])
    expect(typeof wrapper.vm.$data.modalProduct.categoryId).toBe('number')
    expect(typeof wrapper.vm.$data.modalProduct.description).toBe('string')
    expect(typeof wrapper.vm.$data.modalProduct.id).toBe('number')
    expect(typeof wrapper.vm.$data.modalProduct.imageURL).toBe('string')
    expect(typeof wrapper.vm.$data.modalProduct.name).toBe('string')
    expect(typeof wrapper.vm.$data.modalProduct.price).toBe('number')
  })
})
