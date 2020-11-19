import { mutations, actions } from '~/store/products'

// destructure assign `mutations`
const { setProducts, setCount } = mutations
describe('Store Product mutations', () => {
    // mock state
    const state = {
        all: [],
        count: 0
    };
    test('Setting product', () => {
        // apply mutation
        setCount(state, 10)
        expect(state.count).toBe(10)
    });
    test('Setting count', () => {
        // apply mutation
        setProducts(state, [{ id: 2 }, { id: 1 }])
        // assert result
        expect(state.all.length).toBe(2)
        expect(state.all[0]).toStrictEqual({ id: 2 })
        expect(state.all[1]).toStrictEqual({ id: 1 })

    });
})