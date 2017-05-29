<template>
    <div class="container">
        <myheader :islogin="islogin" :users="users" :onup="onup" :ondown="ondown" :search="search"
                  :searchable="searchable"></myheader>
        <div class="row">
            <div class="col-md-12">
                <span>Sort</span> &nbsp; &nbsp;
                <!--<select name="sort" v-model="selected" v-on:change="search1()">-->
                    <!--<option value="latest" selected="selected">Latest</option>-->
                    <!--<option value="like">Like</option>-->
                <!--</select>-->
                <input type="radio" name="sort" v-model="selected" value="latest" :checked="selected === 'latest'" v-on:click.prevent="search1()">&nbsp;Latest
                &nbsp; &nbsp;
                <input type="radio" name="sort" v-model="selected" value="like" v-on:click.prevent="search1()">&nbsp; Like
            </div>
            <div id="container-color" v-if="dt">
                <div class="item" v-for="i in dt">
                    <pallet :i="i"></pallet>
                </div>
                <div id="pagination" v-if="allpage > 1">
                    <nav aria-label="...">
                        <ul class="pagination">
                            <template v-for="i in allpage">
                                <li v-if="i === page" class="active">
                                    <a :href="i" v-on:click.stop.prevent="" v-model="page">{{i}}</a>
                                </li>
                                <li v-else-if="i === 1 || i === 2 || i === 3 || page === i - 2 || page === i - 1 || page === i + 1 || page === i + 2 || i === allpage - 2 ||  i === allpage - 1 || i === allpage">
                                    <a :href="i" v-on:click.stop.prevent="search2(i)" v-model="page">{{i}}</a>
                                </li>
                                <li v-else-if="i === page - 3 || i === page + 3">
                                    <a href="#" v-on:click.stop.prevent="" v-model="page">..</a>
                                </li>
                                <li v-else></li>
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
                users: {},
                'searchable': true,
                typingTimer: '',                //timer identifier
                doneTypingInterval: 300,  //time in ms, 5 second for example
                islogin: false,
                selected: 'latest',
                page: 1,
                allpage: ''
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
                        if ( hex.length <= 6 ) {
                            hex = hex + '0'.repeat( 6 - hex.length);
                        }
                        url = `/search/hex/${hex}`;
                        $('#previewsearch').attr('style', 'background: #' + hex)
                    } else {
                        url = `/search/notall/${temp}`;
                        $('#previewsearch').removeAttr('style')
                    }
                } else {
                    url = `/search/all/searchall`;
                    $('#previewsearch').removeAttr('style')
                }
                axios.post(url, {
                    selected: this.selected,
                    page: this.page
                })
                    .then(response => {
                        let result = response.data;
                        this.islogin = result.islogin;
                        this.users = result.users;
                        this.dt = result.dt;
                        this.allpage = response.data.allpage;
                        this.page = response.data.page;
//                        if (temp.indexOf("#") === 0) {
//                            let hex = temp.slice(1);
//                            if ( hex.length <= 6 ) {
//                                hex = hex + '0'.repeat( 6 - hex.length);
//                            }
//                            $('#previewsearch').attr('style', 'background: #' + hex)
//                        }else{
//                            $('#previewsearch').removeAttr('style')
//                        }
                    })
                    .catch(error => {
                        this.dt = [];
                    });
            },
            search2(page) {
                this.page = page;
                this.search();
                $("html, body").animate({ scrollTop: 0 }, "fast");
            }
        },
        ready() {
            new Clipboard('.colors');
        },
    }
</script>