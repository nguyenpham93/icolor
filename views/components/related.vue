<template>
    <div class="related" v-if="collections.length">
		<h3 class="text-center">Related Parallet</h3>
        <div class="row collection" v-for="collection in collections">
            <div class="col-sm-2 info">
					<div class="footer"><span><h3>{{collection.name}}</h3></span></div>
					<div class="box-author"><span><i class="fa fa-user" aria-hidden="true"></i>Author : {{collection.author}}</span></div>
					<div class="box-email"><span><i class="fa fa-envelope-o" aria-hidden="true"></i> Email : {{collection.author_email}}</span></div>
					<div class="box-date"><span><i class="fa fa-calendar" aria-hidden="true"></i>Updated {{collection.date}}</span></div>
					<!--</div>-->
				</div>
				<div class="box-colors col-sm-6">
					<!--<h1 class="name">{{collection.name}}</h1>-->
					<span class="colors" :style="{ backgroundColor:  collection.color1 }" :data-clipboard-text="collection.color1"><i class="myclipboard" aria-hidden="true">{{collection.color1}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color2 }" :data-clipboard-text="collection.color2"><i class="myclipboard" aria-hidden="true">{{collection.color2}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color3 }" :data-clipboard-text="collection.color3"><i class="myclipboard" aria-hidden="true">{{collection.color3}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color4 }" :data-clipboard-text="collection.color4"><i class="myclipboard" aria-hidden="true">{{collection.color4}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color5 }" :data-clipboard-text="collection.color5"><i class="myclipboard" aria-hidden="true">{{collection.color5}}</i></span>
				</div>
        </div>
    </div>
	<div v-else></div>
</template>
<script>
    // Vue
    export default {
        props : [ "collections" ]
    }
</script>