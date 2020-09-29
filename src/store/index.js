import { createStore } from 'vuex'

async function request(url, method = "GET", data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.warn('Error: ', e.message)
    }
}

export default createStore({
    state: {
        currencies: null
    },
    mutations: {
        updateCurrencies(state, data) {
            state.currencies = data
        }
    },
    actions: {
        async getCurrencies(ctx, base = 'EUR') {
            let res = await request(`https://api.openrates.io/latest?base=${base}`)
            console.log(res)
            ctx.commit('updateCurrencies', res)
        }
    },
    getters: {
        currencies(state) {
            return state.currencies
        },
        titles(state) {
            let names = Object.entries(state.currencies.rates)
                .map(el => el[0])
            names.push(state.currencies.base)
            names = Array.from(new Set(names))
            return names.sort()
        }
    },
    modules: {
    }
})
