<template>
    <div class="col-md-3">
        <ul class="nav nav-pills nav-stacked">
            <li role="presentation" v-if="pagecurrent === 'account'" class="active"><a href="/myaccount111">Profile</a></li>
            <li role="presentation" v-else><a href="/myaccount111">Profile</a></li>

            <li role="presentation" v-if="pagecurrent === 'changepassword'" class="active"><a href="/myaccount111/changepassword">Change Password</a></li>
            <li role="presentation" v-else=""><a href="/myaccount111/changepassword">Change Password</a></li>

            <li role="presentation" v-if="pagecurrent === 'mypallet'" class="active"><a href="/myaccount111/my-pallet">My Pallet</a></li>
            <li role="presentation" v-else=""><a href="/myaccount111/my-pallet">My Pallet</a></li>
        </ul>
    </div>
</template>
<script>
    // Vue
    export default {
        props: ["pagecurrent"]
    }
</script>