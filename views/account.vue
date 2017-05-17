<template>
    <div class="container">
        <myheader :users="users" :islogin="islogin" :searchable="searchable"></myheader>
        <div class="row">
            <leftmenuaccount :pagecurrent="pagecurrent"></leftmenuaccount>
            <div class="col-md-9">
                <div id="profile">
                    My Profile
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
                userfull: '',
				users : {},
				islogin : false,
				searchable : false,
                pagecurrent: ''
            }
        }
    }
</script>