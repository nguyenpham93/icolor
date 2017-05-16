<template>
    <div class="container">
        <myheader :islogin="islogin" :user="user" :onup="onup" :ondown="ondown" :search="search"
                  :searchable="searchable"></myheader>
        <div class="row">
            <select name="sort" v-model="selected" v-on:change="search1()">
                <option value="all">All</option>
                <option value="like">Like</option>
                <option value="share">Share</option>
                <option value="latest">Latest</option>
            </select>
            <div id="container-color" v-if="dt">
                <div class="item" v-for="i in dt">
                    <pallet :i="i"></pallet>
                </div>
                <div id="pagination" v-if="allpage > 1">
                    <nav aria-label="...">
                        <ul class="pagination">
                            <template v-for="i in allpage">
                                <li v-if="page === i + 1" class="active">
                                    <a :href="i + 1" v-on:click.stop.prevent=""
                                       v-model="page">{{i + 1}}</a>
                                </li>
                                <li v-else>
                                    <a :href="i + 1" v-on:click.stop.prevent="search2(i + 1)" v-model="page">{{i +
                                        1}}</a>
                                </li>
                            </template>
                        </ul>
                    </nav>
                </div>
            </div>
            <div v-else id="container-color">No colors.</div>
        </div>
    </div>
</template>
<script>
    // Vue
    export default {
        data() {
            return {
                dt: [],
                user: {},
                'searchable': true,
                typingTimer: '',                //timer identifier
                doneTypingInterval: 100,  //time in ms, 5 second for example
                islogin: false,
                selected: 'all',
                page: 1,
                allpage: '',
                searchText: ''
            }
        },
        methods: {
            onup () {
                clearTimeout(this.typingTimer);
                this.typingTimer = setTimeout(this.done, this.doneTypingInterval);
            },
            ondown () {
                clearTimeout(this.typingTimer);
            },
            done () {
                this.search1();
            },
            search1(){
                this.page = 1;
                this.search();
            },
            search () {
                let url = '';
                let temp = $("#searchterm").val().trim();
                if (temp.length > 0) {
                    if (temp.indexOf("#") === 0) {
                        let hex = temp.slice(1);
                        url = `/search/hex/${hex}`;
                    } else {
                        url = `/search/notall/${temp}`;
                    }
                } else {
                    url = `/search/all/searchall`;
                }
                axios.post(url, {
                    selected: this.selected,
                    page: this.page
                })
                    .then(response => {
                        let result = response.data;
                        this.islogin = result.islogin;
                        this.user = result.user;
                        this.dt = result.dt;
                        this.allpage = response.data.allpage;
                        this.page = response.data.page;
                    })
                    .catch(error => {
                        this.dt = [];
                    });
            },
            search2(page) {
                this.page = page;
                this.search();
            }
        },
        ready() {
            new Clipboard('.colors');
            $(".colors").hover(function () {
                $('.myclipboard', this).toggleClass('clipboard_show');
            });
        },
    }
</script>