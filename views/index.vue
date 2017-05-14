<template>
	<div class="container">
        <myheader :islogin="islogin" :user="user" :onup="onup" :ondown="ondown" :search="search" :searchable="searchable" ></myheader>
		<div class="row">
			<div id="container-color" v-if="dt">
				<div class="item" v-for="i in dt">
					<div class="item_inner moredetail">
                        <div class="box-info col-sm-4">
                            <div class="row">
                                <div class="box-name">{{ i.name }}</div>
                                <!--<div class="box-date"><i class="fa fa-calendar" aria-hidden="true"></i>{{ i.date }}</div>-->
                                <div class="box-author">
                                    <i class="fa fa-user" aria-hidden="true"></i> {{ i.author }} 
                                    <!--<i class="fa fa-envelope-o" aria-hidden="true"></i> {{ i.author_email }} -->
                                </div>
                                <div class="box-like-dislike-share">
                                    <span class="box-like" v-on:click.stop.prevent="likedislike('like', 'r1QCo_xkb1', i.id)"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> {{ i.like }}</span>
                                    <span class="box-dislike" v-on:click.stop.prevent="likedislike('dislike', 'r1QCo_xkb1', i.id)"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i> {{ i.dislike }}</span>
                                    <span class="share"> <i class="fa fa-share-alt" aria-hidden="true"></i>{{ i.share }}</span>
                                </div>
                                <a class="more_detail" :href="'/detail/' + i.id">More Detail</a>
                                <!--<div class="box-like-dislike-share">
                                    <span class="box-like"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> {{ i.like }}</span>
                                    <span class="box-dislike"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i> {{ i.dislike }}</span>
                                    <span class="share"> <i class="fa fa-share-alt" aria-hidden="true"></i>{{ i.share }}</span>
                                </div>-->
                                <!--<div class="box-des">{{ i.description }}</div>-->
						    </div>
						</div>
							<div class="box-colors col-sm-8">
                                <div class="row">
                                    <span class="colors" :style="{ backgroundColor:  i.color1 }" :data-clipboard-text="i.color1"><i class="myclipboard" aria-hidden="true">{{i.color1}}</i></span>
                                    <span class="colors" :style="{ backgroundColor:  i.color2 }" :data-clipboard-text="i.color2"><i class="myclipboard" aria-hidden="true">{{i.color2}}</i></span>
                                    <span class="colors" :style="{ backgroundColor:  i.color3 }" :data-clipboard-text="i.color3"><i class="myclipboard" aria-hidden="true">{{i.color3}}</i></span>
                                    <span class="colors" :style="{ backgroundColor:  i.color4 }" :data-clipboard-text="i.color4"><i class="myclipboard" aria-hidden="true">{{i.color4}}</i></span>
                                    <span class="colors" :style="{ backgroundColor:  i.color5 }" :data-clipboard-text="i.color5"><i class="myclipboard" aria-hidden="true">{{i.color5}}</i></span>
                                </div>
							</div>
                        <!-- footer -->
                        <!--<footeritem :collection="i"></footeritem>-->
					</div>
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
            },
            likedislike(collection_id, user_id, action ){
                if(action && user_id && collection_id){
                    axios.post('/likedislike', {
                        collection_id: collection_id,
                        user_id: user_id,
                        action: action
                    })
                        .then (response => {
                            //this.dt = response.data;
                        })
                        .catch ( error => {
                            //this.dt = [];
                        });
                }
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