<template>
    <div class="item_inner moredetail">
        <div class="box-info col-sm-4">
            <div class="row">
                <div class="box-name">{{ i.name }}</div>
                <div class="box-date"><i class="fa fa-calendar" aria-hidden="true"></i>{{ i.date }}</div>
                <div class="box-author">
                    <i class="fa fa-user" aria-hidden="true"></i> {{ i.author }}
                    <!--<i class="fa fa-envelope-o" aria-hidden="true"></i> {{ i.author_email }} -->
                </div>
                <div class="box-like-dislike-share">
                    <span class="box-like" v-on:click.stop.prevent="likedislike(i.id, 1)">
                        <i class="fa fa-thumbs-up" aria-hidden="true" v-if="i.currentAction === 1"></i>
                        <i class="fa fa-thumbs-o-up" aria-hidden="true" v-else></i>
                        {{ i.like }}
                    </span>
                    <span class="box-dislike" v-on:click.stop.prevent="likedislike(i.id, 0)">
                        <i class="fa fa-thumbs-down" aria-hidden="true" v-if="i.currentAction === 0"></i>
                        <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
                        {{ i.dislike }}
                    </span>
                    <span class="share"> <i class="fa fa-share-alt" aria-hidden="true"></i>{{ i.share }}</span>
                </div>
                <a class="more_detail" :href="'/detail/' + i.id">More Detail</a>
                <a class="more_detail deletepallet" href="#" v-on:click.stop.prevent="deletepallet(confirm('You want delete this Pallet!'), i.id, i.id_user)">Delete</a>
                <!--<div class="box-des">{{ i.description }}</div>-->
            </div>
        </div>
            <div class="box-colors col-sm-8">
                <div class="row">
                    <span class="colors" :style="{ backgroundColor:  i.color1 }" :data-clipboard-text="i.color1" v-on:click.stop.prevent="copy(i.color1)"><i class="myclipboard" aria-hidden="true">{{i.color1}}</i></span>
                    <span class="colors" :style="{ backgroundColor:  i.color2 }" :data-clipboard-text="i.color2" v-on:click.stop.prevent="copy(i.color2)"><i class="myclipboard" aria-hidden="true">{{i.color2}}</i></span>
                    <span class="colors" :style="{ backgroundColor:  i.color3 }" :data-clipboard-text="i.color3" v-on:click.stop.prevent="copy(i.color3)"><i class="myclipboard" aria-hidden="true">{{i.color3}}</i></span>
                    <span class="colors" :style="{ backgroundColor:  i.color4 }" :data-clipboard-text="i.color4" v-on:click.stop.prevent="copy(i.color4)"><i class="myclipboard" aria-hidden="true">{{i.color4}}</i></span>
                    <span class="colors" :style="{ backgroundColor:  i.color5 }" :data-clipboard-text="i.color5" v-on:click.stop.prevent="copy(i.color5)"><i class="myclipboard" aria-hidden="true">{{i.color5}}</i></span>
                </div>
            </div>
    </div>
</template>
<script>
    // Vue
    export default {
        props : [ "i" ],
        methods: {
            likedislike(collection_id, action ){
                axios.post('/likedislike', {
                    collection_id: collection_id,
                    action: action
                })
                    .then (response => {
                        if(response.data.error) {
                            console.log('Error');
                        }else{
                            this.i = response.data;
                        }
                    })
                    .catch ( error => {
                        //this.dt = [];
                    });
            },
            deletepallet(action, pallet_id, user_id){
                if(action) {
                    axios.post('/delete-pallet', {
                        pallet_id: pallet_id,
                        user_id: user_id
                    })
                        .then(response => {
                            window.location.reload()
                        })
                        .catch(error => {
                            //this.dt = [];
                        });
                }
            },
            copy(text){
                copyTextToClipboard(text);
            }
        }
    }
</script>