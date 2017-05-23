<template>
    <div class="container mypallet">
        <myheader :users="users" :islogin="islogin" :searchable="searchable"></myheader>
        <div class="row">
            <leftmenuaccount :pagecurrent="pagecurrent"></leftmenuaccount>
            <div class="col-md-9">
                <div id="mypallet">
                    <h2>My Pallet</h2>
                    <div id="container-color" class="1" v-if="dt.length > 0">
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
                    <div id="container-color1" class="3" v-else>No colors.</div>
                </div>
            </div>
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
                islogin: false,
				searchable : false,
                pagecurrent: '',
                errMsg: '',
                page: 1,
                allpage: '',
            }
        },
        methods: {
            search2 (page) {
                this.page = page;

                axios.post('/myaccount111/my-pallet', {
                    selected: '',
                    page: this.page
                })
                    .then(response => {
                        let result = response.data;
                        this.islogin = result.islogin;
                        this.users = result.users;
                        this.dt = result.dt;
                        this.page = response.data.page;
                    })
                    .catch(error => {
                        this.dt = [];
                    });
            }
        }
    }
</script>