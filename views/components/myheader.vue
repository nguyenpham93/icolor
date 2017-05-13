<template>
	<nav class="navbar navbar-default" role="navigation">
		<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">ICOLOR</a>
		</div>
		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<div class="col-sm-6 col-md-6">
                <div v-if="searchable">
                    <form class="navbar-form" role="search" v-on:submit.prevent="search">
                        <div class="input-group" id="search">
                            <input type="text" v-on:keyup="onup()" v-on:keydown="ondown()" class="form-control" id="searchterm" placeholder="Search" name="q">
                            <div class="input-group-btn">
                                <button class="btn btn-default" v-on:click="search()"><i class="glyphicon glyphicon-search"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
                <div v-else></div>
			</div>
            <!-- is user login? -->
            <span v-if="islogin">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#">Welcome {{ user }}</a></li>
                    <li><a id="logout" v-on:click="logout" >Logout</a></li>
                </ul>
            </span>
            <span v-else>
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#" data-toggle="modal" data-target="#login-modal">Login</a></li>
                    <li><a href="#" data-toggle="modal" data-target="#signin-modal">Register</a></li>
                </ul>
            </span>
		</div>
		<!-- /.navbar-collapse -->
		<!-- Login -->
		<div class="modal fade" id="login-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
			<div class="modal-dialog">
				<div class="centered-form">
					<div class="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Login</h3>
							</div>
							<div class="panel-body">
								<form action="/login" v-on:submit.prevent="login" method="post" name="Login_Form" class="form-signin">
									<span id="login_status"></span>
									<div class="form-group">
										<input type="email" class="form-control" id="login_email" name="login_email" placeholder="Email" required="" autofocus="" />
									</div>
									<div class="form-group">
										<input type="password" class="form-control" id="login_password" name="login_password" placeholder="Password" required=""/>     		  
									</div>
									<button class="btn btn-lg btn-primary btn-block" v-on:click="login" name="Submit" value="Login" >Login</button>  			
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Sign in -->
		<div class="modal fade" id="signin-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
		<div class="modal-dialog">
			<div class="row centered-form">
				<div class="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Sign Un</h3>
						</div>
						<div class="panel-body">
							<form role="form" method="post" v-on:submit.prevent="register" action="/register">
							<span id="register_status"></span>
								<div class="form-group">
									<input type="email" name="register_email" id="register_email" required class="form-control" placeholder="Email Address">
								</div>
								<div class="form-group">
									<input type="password" name="register_password" id="register_password" required class="form-control" placeholder="Password">
								</div>
								<div class="form-group">
									<input type="password" name="password_confirmation" required id="password_confirmation" class="form-control" placeholder="Confirm Password">
								</div>
								<button v-on:click="register" class="btn btn-lg btn-primary btn-block">Register</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>
<script>
	// Vue
	export default {
	    props : [ 'islogin', 'user', 'search', 'searchable', 'onup', 'ondown'],
        methods : {
			deleteCookie () {
				document.cookie = 'connect.sid=; Max-Age=0';
			},
			register () {
				axios.post ( '/register' , {
					email: $("#register_email").val(),
	                password: $("#register_password").val(),
				})
				.then ( response => {
					let result = response.data;
					if ( result.status ) {
						$("#register_status").empty ();
                        $("#register_status").text ( "Email is already existed" );
	                    $("#register_status").css ('color','red');
					} else {
						$("#register_status").empty ();
                        $("#register_status").text ( "Register Successfull" );
	                    $("#register_status").css ('color','green');
					}
					this.user = result.user;
					this.islogin = result.islogin;
				});
			},
			logout () {
				axios.get ( '/logout' )
				.then ( response => {
					let result = response.data;
					this.user = result.user;
					this.islogin = result.islogin;
					return false;
				})
				.catch(error => {
                    this.user = {};
					this.islogin = false;
	            });;
			},
            login () {
	            axios.post('/login', {
	                    email: $("#login_email").val(),
	                    password: $("#login_password").val(),
	                })
	                .then(response => {
	                    let result = response.data;
                        if ( result.islogin ) {
							this.user = result.user;
							this.islogin = result.islogin;
                            $("#login_status").empty ();
                            $('#login-modal').modal ('hide');
                        } else {
                            $("#login_status").empty ();
                            $("#login_status").text ( "Email or password not correct" );
	                        $("#login_status").css ('color','red');
                        }
	                })
	                .catch(error => {
                        this.user = {};
						this.islogin = false;
	                });
	        }
        }
	}
</script>