<template>
    <div class="template" v-if="currencies">
        <CurrenciesHeader
            :activeItem="activeItem"
            :titles="titles"
            :currencies="currencies"
            @update="updateCurrencyInfo"
        />
        <CurrenciesBody
            :activeItem="activeItem"
            :titles="titles"
            :currencies="currencies"
        />
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import CurrenciesHeader from "./Currencies-header";
    import CurrenciesBody from "./Currencies-body";

    export default {
        name: "Currencies",
        components: {CurrenciesBody, CurrenciesHeader},
        data() {
            return {
                activeItem: {
                    index: null,
                    value: null
                },
            }
        },
        methods: {
            updateCurrencyInfo(index, value) {
                this.activeItem.index = index
                this.activeItem.value = value
                this.$store.dispatch('getCurrencies', value)
            }
        },
        computed: {
            ...mapGetters(['currencies', 'titles'])
        },
        async mounted() {
            await this.$store.dispatch('getCurrencies')
            this.updateCurrencyInfo(this.titles.indexOf(this.activeItem.value), localStorage.getItem('lastCurrency') || this.currencies.base)
        }
    }

</script>

<style lang="scss" scoped>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

    .template {
        display: flex;
        flex-direction: column;
        align-items: center;
    }


    .currencies-header, .currencies-body, .currencies-footer {
        width: 100%;
        max-width: 700px;
    }


    @media (min-width: 320px) {
        .currencies-header, .currencies-body, .currencies-footer {
            width: 320px;
        }
    }

    @media (min-width: 720px) {
        .currencies-header, .currencies-body, .currencies-footer {
            width: 720px
        }
    }


</style>






