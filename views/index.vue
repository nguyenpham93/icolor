<template>
	<div class="container">
        <myheader :islogin="islogin" :user="user" :onup="onup" :ondown="ondown" :search="search" :searchable="searchable" ></myheader>
		<div class="row">
			<div id="container-color" v-if="dt">
				<div class="item" v-for="i in dt">
                    <pallet :i="i"></pallet>
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
                user : {},
                'searchable' : true,
                typingTimer : '',                //timer identifier
                doneTypingInterval : 100,  //time in ms, 5 second for example
                islogin : false
            }
        },
        methods : {
            onup () {
                clearTimeout(this.typingTimer);
                this.typingTimer = setTimeout(this.done, this.doneTypingInterval);
            },
            ondown () {
                clearTimeout(this.typingTimer);
            },
            done () {
                this.search();
            },
            search () {
                let url = '';
                if ( $("#searchterm").val() ) {
                    let temp = $("#searchterm").val();
                    if ( temp.indexOf("#") === 0) {
                        let hex = temp.slice(1);
                        url = `/search/hex/${hex}`;
                    } else {
                        url = `/search/notall/${temp}`;
                    }
                } else {
                    url = `/search/all/searchall`;
                }
                axios.get( url )
                .then (response => {
                    let result = response.data;
                    this.islogin = result.islogin;
                    this.user = result.user;
                    this.dt = result.dt;
                })
                .catch ( error => {
                    this.dt = [];
                });
            }
        },
        ready() {
            new Clipboard('.colors');
            $(".colors").hover ( function () {
                $('.myclipboard', this).toggleClass ('clipboard_show');
            });
        },
    }
</script>