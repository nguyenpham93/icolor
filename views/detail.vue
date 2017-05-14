<template>
	<div class="container">
	<myheader :user="user" :islogin="islogin" :searchable="searchable"></myheader>
		<div id="container-color" v-if="collection" class="container">
			<div class="row">
				<div class="col-sm-2 info">
					<div class="footer"><span><h3>{{collection.name}}</h3></span></div>
					<div class="box-author"><span><i class="fa fa-user" aria-hidden="true"></i>Author : {{collection.author}}</span></div>
					<!--<div class="box-email"><span><i class="fa fa-envelope-o" aria-hidden="true"></i> Email : {{collection.author_email}}</span></div>-->
					<div class="box-like-dislike-share">
						<span class="box-like">
							<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> {{ collection.like }}
						</span>
						<span class="box-dislike">
							<i class="fa fa-thumbs-o-down" aria-hidden="true"></i> {{ collection.dislike }}
						</span>
						<span class="share">
							<i class="fa fa-share-alt" aria-hidden="true"></i>{{ collection.share }}
						</span>
					</div>
					<div class="box-date"><span><i class="fa fa-calendar" aria-hidden="true"></i>Updated {{collection.date}}</span></div>
					<!--</div>-->
				</div>
				<div class="box-colors col-sm-6">
					<!--<h1 class="name">{{collection.name}}</h1>-->
					<span class="colors" :style="{ backgroundColor:  collection.color1 }"  v-on:click="getRelated" :data-clipboard-text="collection.color1"><i :data-clipboard-text="collection.color1" class="myclipboard" aria-hidden="true">{{collection.color1}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color2 }"  v-on:click="getRelated" :data-clipboard-text="collection.color2"><i :data-clipboard-text="collection.color2" class="myclipboard" aria-hidden="true">{{collection.color2}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color3 }"  v-on:click="getRelated" :data-clipboard-text="collection.color3"><i :data-clipboard-text="collection.color3" class="myclipboard" aria-hidden="true">{{collection.color3}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color4 }"  v-on:click="getRelated" :data-clipboard-text="collection.color4"><i :data-clipboard-text="collection.color4" class="myclipboard" aria-hidden="true">{{collection.color4}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color5 }"  v-on:click="getRelated" :data-clipboard-text="collection.color5"><i :data-clipboard-text="collection.color5" class="myclipboard" aria-hidden="true">{{collection.color5}}</i></span>
				</div>
				<!--<footerdetail :collection="collection"></footerdetail>-->
			</div>
            <related :collections="related_collection"></related>
		</div>
		<div v-else id="container-color">No colors.</div>
	</div>
</template>
<script>
    // Vue
    export default {
        data() {
            return {
				collection : {},
                related_collection : [],
				user : {},
				islogin : false,
				searchable : false
            }
        },
        methods : {
            getRelated (event) {
                let tmp = event.target.getAttribute('data-clipboard-text').slice(1);
                axios.get(`/relate?id=${tmp}&idparent=${this.collection.id}`)
                        .then(response => {
							let result = response.data;
                            this.related_collection = result.dt;
							this.user = result.user;
							this.islogin = result.islogin;
                        })
                        .catch(error => {
                            this.related_collection = [];
                        }); 
            }
        },
        ready() {
            new Clipboard('.colors');
			$(".colors").hover ( function () {
				$('.myclipboard', this).toggleClass ('clipboard_show');
			});
        }
    }
</script>