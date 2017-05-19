<template>
    <div class="container">
        <myheader :users="users" :islogin="islogin"></myheader>
        <div class="row">
            <div class="col-md-12">
                <div id="addnewpallet">
                    <div id="waiting">
                        <img src="/public/img/spinner.gif">
                    </div>
                    <h2>Add New Pallet</h2>
                    <div class="alert alert-danger err" role="alert" v-if="errMsg">
                        {{ errMsg }}
                    </div>
                    <div class="addnewpallet-conatiner">
                        <form action="" method="post" v-on:submit.prevent="addnew">
                            <div class="form-group">
                                <label for="">Pallet name</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="">Description</label>
                                <textarea name="description" class="form-control" rows="3">

                                </textarea>
                            </div>
                            <div class="form-group">
                                <label for="">Get colors from image</label>
                                <input type="file" name="image" accept="image/*">
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-2">
                                        <label for="">Color #1</label>
                                        <input type="text" class="form-control" name="color1" required>
                                    </div>
                                    <div class="col-md-2">
                                        <label for="">Color #2</label>
                                        <input type="text" class="form-control" name="color2" required>
                                    </div>
                                    <div class="col-md-2">
                                        <label for="">Color #3</label>
                                        <input type="text" class="form-control" name="color3" required>
                                    </div>
                                    <div class="col-md-2">
                                        <label for="">Color #4</label>
                                        <input type="text" class="form-control" name="color4" required>
                                    </div>
                                    <div class="col-md-2">
                                        <label for="">Color #5</label>
                                        <input type="text" class="form-control" name="color5" required>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Add New Pallet</button>
                            </div>
                        </form>
                    </div>
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
				users : {},
				islogin : false,
                errMsg: ''
            }
        },
        methods: {
            addnew(){
                this.errMsg = '',
                $('#waiting').addClass('wait');

                let name = $('input[name="name"]').val();
                let description = $('textarea[name="description"]').val();
                let color1 = $('input[name="color1"]').val();
                let color2 = $('input[name="color2"]').val();
                let color3 = $('input[name="color3"]').val();
                let color4 = $('input[name="color4"]').val();
                let color5 = $('input[name="color5"]').val();

                axios.post('/addnewpallet', {
                    name: name,
                    description: description,
                    color1: color1,
                    color2: color2,
                    color3: color3,
                    color4: color4,
                    color5: color5,
                })
                        .then(res => {
                            $('#waiting').removeClass('wait');

                            this.users = res.data.users;
                            this.islogin = res.data.islogin;
							if(res.data.errMsg){
							    this.errMsg = res.data.errMsg
                            }else{
							    this.errMsg = ''
                            }

//                            if(res.data.sucMsg){
//							    this.sucMsg = res.data.sucMsg
//                            }else{
//							    this.sucMsg = ''
//                            }

                        })
                        .catch(error => {
                            $('#waiting').removeClass('wait');
                            //this.related_collection = [];
                        });
            }
        }
    }
</script>