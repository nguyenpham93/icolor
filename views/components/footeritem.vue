<template>
    <div class="footer col-sm-12">
        <span> Updated {{collection.date}}</span>
        <span>
            <a :href="'/detail/' + collection.id">More detail</a>
        </span>
    </div>
</template>
<script>
    // Vue
    export default {
        props : [ "collection" ]
    }
</script>