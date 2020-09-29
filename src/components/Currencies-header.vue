<template>
    <div class="currencies-header">
        <div class="title">Курс {{activeItem.value}} сегодня</div>
        <div class="currencies">
            <i
                    v-if="options.scrollLeft !== 0"
                    class="material-icons" style="right: 5px"
                    @click="prev">
                chevron_left
            </i>
            <div style="right: 5px;" v-else class="invisible"></div>
            <div class="scrolling"
                 @mousedown="mouseDownHandler"
                 @mousemove="mouseScroll"
                 @mouseup="mouseUpHandler"
            >
                <div class="items" ref="items">
                        <span
                                v-for="(title, index) of titles"
                                :class="{
                                active: title === activeItem.value
                            }"
                                :key="index"
                                @click="changeCurrency"
                        >
                            {{title}}
                        </span>
                </div>

            </div>
            <i
                    v-if="options.scrollLeft !== options.scrollWidth - options.showLength"
                    class="material-icons"
                    style="left: 5px;"
                    @click="next">
                chevron_right
            </i>
            <div style="left: 5px;" v-else class="invisible"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Currencies-header",
        props: ['activeItem', 'titles', 'currencies'],
        data() {
            return {
                options: {
                    showLength: null,
                    scrollLeft: null,
                    scrollWidth: null,
                    isDown: false,
                    moving: false,
                    posX:  {
                        prev: null,
                        cur: null,
                        start: null
                    }
                }
            }
        },
        methods: {
            animateScroll(el, width, time) {
                let period = width/time*10
                let interval = setInterval(() => {
                    el.scrollLeft += period
                }, 10)
                setTimeout(() => {
                    this.scrollOptions(el)
                    clearInterval(interval)
                }, time)
            },
            prev(e) {
                let scroll = e.target.parentNode.children[1]
                this.animateScroll(scroll, -scroll.clientWidth, 500)
            },
            next(e) {
                let scroll = e.target.parentNode.children[1]
                this.animateScroll(scroll, scroll.clientWidth, 500)
            },
            mouseScroll(e) {
                if (this.options.isDown) {
                    this.options.moving = true

                    if (this.options.posX.start !== e.screenX && this.options.posX.start) {
                        let scroll = e.target.parentNode.parentNode
                        scroll.scrollLeft += (this.options.posX.start - e.screenX)
                        this.options.posX.cur = scroll.scrollLeft
                    }

                    this.options.posX.start = e.screenX
                }

            },
            mouseDownHandler() {
                this.options.isDown = true
            },
            mouseUpHandler() {
                if (this.options.isDown) {
                    let scroll = this.$refs.items.parentNode

                    this.options.isDown = false
                    if (Math.abs(this.options.posX.prev - this.options.posX.cur) < 10) this.options.moving = false
                    this.options.posX.prev = this.options.posX.cur || this.options.posX.prev
                    this.options.posX.start = null
                    this.scrollOptions(scroll)
                }

            },

            changeCurrency(e) {
                if (!this.options.moving) {
                    // this.activeItem.value = e.target.innerText
                    // this.activeItem.index = this.titles.indexOf(e.target.innerText)
                    this.$emit('update', this.titles.indexOf(e.target.innerText), e.target.innerText)
                    localStorage.setItem('lastCurrency', e.target.innerText)
                }
                this.options.moving = false

            },
            showOptions() {
                let scroll = this.$refs.items.parentNode
                this.options.showLength = Math.floor(scroll.clientWidth)
            },
            scrollOptions(scroll) {
                this.options.scrollLeft = scroll.scrollLeft
                this.options.scrollWidth = scroll.scrollWidth
            },
            setup() {
                let scroll = this.$refs.items.parentNode
                let item = scroll.firstChild.firstChild

                this.showOptions()
                this.scrollOptions(scroll)

                document.body.onresize = this.showOptions
                window.onmouseup = this.mouseUpHandler

            }
        },
        computed: {

        },
        mounted() {
            this.setup()
        }
    }
</script>

<style lang="scss" scoped>

    .currencies-header {
        background-color: #ffe782;
        height: 111px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        font-family: 'Roboto', sans-serif;
        font-size: 21px;
        margin: 0;

        .title {
            color: #2b2d33;
            padding: 0 20px;
        }

        .currencies {
            height: 48px;
            line-height: 48px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;

            -ms-user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;

            .invisible {
                position: relative;
                top: .8rem;
                min-width: 20px;
                height: 20px;
            }

            i {
                position: relative;
                display: inline;
                top: .8rem;
                color: #ccae68;
                cursor: pointer;
                font-size: 20px;
            }

            .scrolling {
                max-width: 620px;
                display: block;
                overflow: hidden;

                .items {
                    display: flex;

                    span {
                        display: inline;
                        text-align: center;
                        color: #ccae68;
                        font-size: 14px;
                        cursor: pointer;
                        max-width: 90px;
                        min-width: 90px;

                        &.active {
                            background-color: white;
                            color: #2b2d33;
                            font-weight: bold;
                            border-radius: 10px 10px 0 0;
                            cursor: default;
                        }

                        &.show {
                            display: inline;
                            animation: swipe 1s
                        }
                    }
                }
            }
        }
    }
</style>
