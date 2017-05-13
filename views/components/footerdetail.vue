<template>
    <div class="footer col-sm-12">
        <span><i class="fa fa-calendar" aria-hidden="true"></i> Updated {{collection.date}}</span>
        <span><i class="fa fa-user" aria-hidden="true"></i> Author : {{collection.author}}</span>
        <span><i class="fa fa-envelope-o" aria-hidden="true"></i> Email : {{collection.author_email}}</span>
    </div>
</template>
<script>
    // Vue
    export default {
        props : [ "collection" ]
    }
</script>