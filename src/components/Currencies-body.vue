<template>
    <div class="currencies-body">
        <div class="inp">
            <label for="count">
                <input v-model="count" type="number" id="count">
                {{currencies.base}}
            </label>
        </div>
        <div class="scrolling" ref="scroll"
            @mousedown="mouseDownHandler"
            @mouseup="mouseUpHandler"
            @mousemove="mouseScroll"
        >
            <div class="cards-top">
                <div class="currency-card"
                     v-for="([title, value], index) of Object.entries(currencies.rates)"
                     v-show="index % 2 === 0"
                     :key="index">
                    <p class="from"><span class="count">{{count.toString().replace('.', ',')}}</span> {{currencies.base}} = </p>
                    <p class="to"><span class="big">{{(value*count).toFixed(2).toString().replace('.', ',')}}</span> {{title}}</p>
                </div>
            </div>
            <div class="cards-bottom">
                <div class="currency-card"
                     v-show="index % 2 === 1"
                     v-for="([title, value], index) of Object.entries(currencies.rates)"
                     :key="index">
                    <p class="from"><span class="count">{{count.toString().replace('.', ',')}}</span> {{currencies.base}} = </p>
                    <p class="to"><span class="big">{{(value*count).toFixed(2).toString().replace('.', ',')}}</span> {{title}}</p>
                </div>
            </div>
        </div>

        <div class="btns">
            <button @click="prev" :class="{disabled: scrollLeft === 0}" class="prev"><i class="material-icons">chevron_left</i>НАЗАД</button>
            <button @click="next" :class="{disabled: (scrollLeft === 5040 || scrollLeft === 4724) && showLength === 320 || (scrollLeft === 5204 || scrollLeft === 4856) && showLength === 700}" class="next">ДАЛЕЕ<i class="material-icons">chevron_right</i></button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Currencies-body",
        props: ['activeItem', 'titles', 'currencies'],
        data() {
            return {
                count: 0,
                scrollLeft: null,
                scrollWidth: null,
                showLength: null,
                isDown: false,
                posX: null
            }
        },
        methods: {
            setup() {
                let scroll = this.$refs.scroll

                this.scrollLeft = scroll.scrollLeft
                this.scrollWidth = scroll.scrollWidth
                this.showLength = scroll.clientWidth

                document.onmouseup = this.mouseUpHandler
            },
            animateScroll(el, width, time) {
                let period = width/time*10
                let interval = setInterval(() => {
                    el.scrollLeft += period
                }, 10)
                setTimeout(() => {
                    this.scrollLeft = el.scrollLeft
                    clearInterval(interval)
                }, time)
            },
            prev() {
                let scroll = this.$refs.scroll
                let card = scroll.firstChild.firstElementChild

                if (scroll.clientWidth === 700) this.animateScroll(scroll, -card.clientWidth * 2 + 20, 500)
                else this.animateScroll(scroll, -scroll.clientWidth - 29, 500)
            },
            next() {
                let scroll = this.$refs.scroll
                let card = scroll.firstChild.firstElementChild

                console.log(card.clientWidth * 2)
                if (scroll.clientWidth === 700) this.animateScroll(scroll, card.clientWidth * 2 + 20, 500)
                else this.animateScroll(scroll, scroll.clientWidth + 29, 500)

            },

            mouseScroll(e) {
                if (this.isDown) {
                    let scroll = this.$refs.scroll
                    if (this.posX !== e.screenX && this.posX) {
                        scroll.scrollLeft += (this.posX - e.screenX)
                    }

                    this.posX = e.screenX
                }
            },
            mouseDownHandler() {
                this.isDown = true
            },
            mouseUpHandler() {
                if (this.isDown) {
                    let scroll = this.$refs.scroll

                    this.isDown = false
                    this.posX = null
                    this.scrollLeft = scroll.scrollLeft
                }

            }
        },
        watch: {
            scrollLeft() {
                let scroll = this.$refs.scroll
                this.showLength = scroll.clientWidth
            }
        },
        mounted() {
            this.setup()
        }
    }
</script>

<style lang="scss" scoped>

    .currencies-body {
        width: 100%;
        margin: 1rem auto;
        font-family: 'Roboto', sans-serif;

        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;

        .inp {
            display: flex;
            margin: 1rem 2rem;
            font-size: 18px;
            justify-content: flex-end;

            label {
                color: #b9b9b9;

                input {
                    border: none;
                    border-bottom: 1px solid #d9d9d9;
                    text-align: right;
                    font-size: 18px;
                    width: 121px;
                    outline: none;
                }
            }


        }

        .scrolling {
            max-width: 700px;
            display: block;
            overflow: hidden;

            .cards-top {
                display: flex;

            }
            .cards-bottom {
                display: flex;

            }

            .cards-top, .cards-bottom {
                .currency-card {
                    display: block;
                    height: 138px;
                    margin: .3rem;
                    line-height: 40px;
                    font-weight: 300;

                    .from {
                        font-size: 24px;
                        color: #b9b9b9;

                        .count {
                            color: #2b2d33;
                        }
                    }

                    .to {
                        font-size: 24px;
                        color: #2b2d33;

                        .big {
                            font-size: 48px;
                        }
                    }
                }
            }
        }

        .btns {
            display: flex;
            justify-content: center;
            margin-top: 3rem;
            font-family: "Roboto", sans-serif;
            font-weight: 300;
            font-size: 14px;

            button {
                margin: 0 1rem;
                border: none;
                outline: none;
                color: #2b2d33;
                height: 34px;
                line-height: 34px;
                cursor: pointer;

                i {
                    color: #2b2b2b;
                    position: relative;
                    top: .4rem;
                }

                &.disabled {
                    color: #787878;
                    cursor: default;

                    i {
                        color: #787878;
                    }
                }
            }
        }
    }


    @media (min-width: 320px) {
        .currency-card {
            min-width: 274px;
            max-width: 274px;
            padding: 0 1rem;

            .from {
                font-size: 18px;
            }

            .to {
                font-size: 18px;
                .big {
                    font-size: 36px;
                }
            }
        }
    }

    @media (min-width: 720px) {
        .currency-card {
            max-width: 327px;
            padding: 0 2rem;

            .from {
                font-size: 24px;
            }

            .to {
                font-size: 24px;
                .big {
                    font-size: 48px;
                }
            }
        }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
