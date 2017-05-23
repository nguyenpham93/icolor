<template>
    <div>
        <div class="col-sm-3 info">
            <div class="footer"><span><h3>{{collection.name}}</h3></span></div>
            <div class="box-author">
                <span><i class="fa fa-user" aria-hidden="true"></i>Author : {{collection.author}}</span>
            </div>
            <div class="box-like-dislike-share">
                <span class="box-like" v-on:click.stop.prevent="likedislike(collection.id, 1)">
                    <i class="fa fa-thumbs-up" aria-hidden="true" v-if="collection.currentAction === 1"></i>
                    <i class="fa fa-thumbs-o-up" aria-hidden="true" v-else></i>
                    {{ collection.like }}
                </span>
                <span class="box-dislike" v-on:click.stop.prevent="likedislike(collection.id, 0)">
                    <i class="fa fa-thumbs-down" aria-hidden="true" v-if="collection.currentAction === 0"></i>
                    <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
                    {{ collection.dislike }}
                </span>
                <!--<span class="share">-->
                    <!--<i class="fa fa-share-alt" aria-hidden="true"></i>{{ collection.share }}-->
                <!--</span>-->
            </div>
            <div class="box-date">
                <span><i class="fa fa-calendar" aria-hidden="true"></i>Updated {{collection.date}}</span>
            </div>
        </div>
        <div class="box-colors-detail col-sm-9">
            <span class="colors" :style="{ backgroundColor:  collection.color1 }" :data-clipboard-text="collection.color1" v-on:click.stop.prevent="copy(collection.color1)"><i class="myclipboard" aria-hidden="true">{{collection.color1}}</i></span>
            <span class="colors" :style="{ backgroundColor:  collection.color2 }" :data-clipboard-text="collection.color2" v-on:click.stop.prevent="copy(collection.color2)"><i class="myclipboard" aria-hidden="true">{{collection.color2}}</i></span>
            <span class="colors" :style="{ backgroundColor:  collection.color3 }" :data-clipboard-text="collection.color3" v-on:click.stop.prevent="copy(collection.color3)"><i class="myclipboard" aria-hidden="true">{{collection.color3}}</i></span>
            <span class="colors" :style="{ backgroundColor:  collection.color4 }" :data-clipboard-text="collection.color4" v-on:click.stop.prevent="copy(collection.color4)"><i class="myclipboard" aria-hidden="true">{{collection.color4}}</i></span>
            <span class="colors" :style="{ backgroundColor:  collection.color5 }" :data-clipboard-text="collection.color5" v-on:click.stop.prevent="copy(collection.color5)"><i class="myclipboard" aria-hidden="true">{{collection.color5}}</i></span>
        </div>
    </div>
</template>
<script>
    // Vue
    export default {
        props : [ "collection"],
        methods: {
            likedislike(collection_id, action ){

                $('.box-like-dislike-share > span').addClass('disabled');

                axios.post('/likedislike', {
                    collection_id: collection_id,
                    action: action
                })
                    .then (response => {
                        if(response.data.error) {
                            console.log('Error');
                        }else{
                            this.collection = response.data;
                        }
                		$('.box-like-dislike-share > span').removeClass('disabled');
                    })
                    .catch ( error => {
                        //this.dt = [];
                		$('.box-like-dislike-share > span').removeClass('disabled');
                    });
            },
            copy(text){
                copyTextToClipboard(text);
            }
        }
    }
</script>