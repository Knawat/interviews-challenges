import { mutations, actions } from '~/store/cart'

// destructure assign `mutations`
const { pushProductToCart, filterProductFromCart } = mutations
// const { addProductToCart, removeProductFromCart } = actions

describe('Store Cart Actions/mutations', () => {
    // mock state
    const state = { items: [] };
    test('Adding product', () => {
        // apply mutation
        pushProductToCart(state, { id: 10 })
        pushProductToCart(state, { id: 12 })
        pushProductToCart(state, { id: 13 })
        expect(state.items.length).toBe(3)
    });
    test('Remove product', () => {
        // apply mutation
        filterProductFromCart(state, 10)
        // assert result
        expect(state.items.length).toBe(2)
    });
    // test("Adding product - action ", () => {
    //     addProductToCart({ state, commit }, 10)
    //     expect(state.items.length).toBe(2)
    // });
    // test("Remove product - action ", () => {
    //     removeProductFromCart(state, { id: 12 })
    //     expect(state.items.length).toBe(2)
    // });
})