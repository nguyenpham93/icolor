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
			<a class="navbar-brand" href="/">COLORND</a>
		</div>
		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<div class="col-sm-4 col-md-4">
				<div v-if="searchable">
					<form class="navbar-form" role="search" v-on:submit.prevent="search">
						<div class="input-group" id="search">
							<input type="text" v-on:keyup="onup()" v-on:keydown="ondown()" class="form-control" id="searchterm" placeholder="Color hex (#000000), name" name="q">
							<div class="input-group-btn">
								<button class="btn btn-default"><i class="glyphicon glyphicon-search"></i></button>
							</div>
								<span id="previewsearch" style=""></span>
						</div>
					</form>
				</div>
				<div v-else></div>
			</div>
			<!-- is user login? -->
			<span v-if="islogin">
				<ul class="nav navbar-nav navbar-right">
					<li><a href="/addnewpallet">Add new pallet</a></li>
					<li><a href="/myaccount111">Welcome {{ users }}</a></li>
					<li><a id="logout" v-on:click="logout" >Logout</a></li>
				</ul>
			</span>
			<span v-else>
				<ul class="nav navbar-nav navbar-right">
					<li><a href="#" data-toggle="modal" data-target="#login-modal">Add new pallet</a></li>
					<li><a href="#" data-toggle="modal" data-target="#login-modal">Login</a></li>
					<li><a href="#" data-toggle="modal" data-target="#signin-modal">Register</a></li>
				</ul>
			</span>
		</div>
		<!-- /.navbar-collapse -->
		<!-- Login111 -->
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
								<button class="btn btn-lg btn-primary btn-block" name="Submit" value="Login" >Login</button>
							</form>
							<div class="text-center or">OR</div>
							<div class="social text-center">
								<div class="row">
									<div class="col-sm-6">
										<!--<a class="btn btn-block btn-social btn-facebook" v-on:click="loginSocial('facebook')"> -->
										<a class="btn btn-block btn-social btn-facebook" href="/login/facebook">
										<span class="fa fa-facebook"></span> Facebook
										</a>
									</div>
									<div class="col-sm-6">
										<a class="btn btn-block btn-social btn-google" href="/login/google">
										<span class="fa fa-google"></span> Google
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
		<!-- Sign up -->

		<div class="modal fade" id="signin-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
		<div class="modal-dialog">
			<div class="row centered-form">
				<div class="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Sign Up</h3>
						</div>
							<div class="panel-body">
								<form role="form" method="post" v-on:submit.prevent="register">
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
									<button class="btn btn-lg btn-primary btn-block">Register</button>
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
	    props : [ 'islogin', 'users', 'search', 'searchable', 'onup', 'ondown', 'textsearch'],
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
                        $("#register_status").text ( "Register Successfull" );
	                    $("#register_status").css ('color','green');
					} else {
						$("#register_status").empty ();
                        $("#register_status").text ( "Email is already existed" );
	                    $("#register_status").css ('color','red');
					}
					this.users = result.users;
					this.islogin = result.islogin;
				});
			},
			logout () {
				axios.get ( '/logout' )
				.then ( response => {
					let result = response.data;
					this.users = result.users;
					this.islogin = result.islogin;
				})
				.catch(error => {
                    this.users = {};
					this.islogin = false;
	            });
			},
            login () {
	            axios.post('/login', {
	                    email: $("#login_email").val(),
	                    password: $("#login_password").val(),
	                })
	                .then(response => {
	                    let result = response.data;
                        if ( result.islogin ) {
							this.users = result.users;
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
                        this.users = {};
						this.islogin = false;
	                });
	        },
			loginSocial (type) {
				console.log(type);
	            axios.get(`/login/${type}`)
	                .then(response => {
	                    let result = response.data;
							this.users = result.users;
							this.islogin = result.islogin;
                            $("#login_status").empty ();
                            $('#login-modal').modal ('hide');
	                })
	                .catch(error => {
                        this.users = {};
						this.islogin = false;
	                });
	        }
        }
	}
</script>
