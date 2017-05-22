<template>
    <div class="container">
        <myheader :users="users" :islogin="islogin" :searchable="searchable"></myheader>
        <div class="row">
            <leftmenuaccount :pagecurrent="pagecurrent"></leftmenuaccount>
            <div class="col-md-9">
                <div class="alert alert-danger" role="alert" v-if="errMsg">
                    {{ errMsg }}
                </div>
                <div id="changepassword">
                    <h2>Change Password</h2>
                    <form action="" method="post" v-on:submit.prevent="change">
                        <div class="form-group">
                            <label for="">Old password</label>
                            <input type="password" class="form-control" name="oldpass" required>
                        </div>
                        <div class="form-group">
                            <label for="">New password</label>
                            <input type="password" class="form-control" name="newpass" required>
                        </div>
                        <div class="form-group">
                            <label for="">Confirm new password</label>
                            <input type="password" class="form-control" name="confirmnewpass" required>
                        </div>

                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Change password</button>
                        </div>
                    </form>
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
                users: {},
                islogin: false,
				searchable : false,
                pagecurrent: '',
                errMsg: ''
            }
        },
        methods: {
            change(){
                let oldpass = $('input[name="oldpass"]').val();
                let newpass = $('input[name="newpass"]').val();
                let confirmnewpass = $('input[name="confirmnewpass"]').val();
                axios.post(`/myaccount111/changepassword`, {
                    oldpass: oldpass,
                    newpass: newpass,
                    confirmnewpass: confirmnewpass,
                })
                        .then(res => {
                            this.users = res.data.users;
                            this.islogin = res.data.islogin;
							if(res.data.errMsg){
							    this.errMsg = res.data.errMsg
                            }else{
							    this.errMsg = ''
                            }
                            $('input').val('');
                        })
                        .catch(error => {
                            //this.related_collection = [];
                        });
            }
        }
    }
</script>