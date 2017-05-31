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
                    <div class="alert alert-danger err" role="alert" v-if="errMsg" v-html="errMsg">
                        {{ errMsg }}
                    </div>
                    <div class="addnewpallet-conatiner">
                        <form action="" method="post" v-on:submit.prevent="addnew">
                            <div class="form-group box-color">
                                <label>Option 1: Enter hex colors</label>
                                <div class="row">
                                    <div class="col-md-2">
                                        <span for="">Color #1</span>
                                        <input type="text" class="jscolor form-control" name="color1" v-on:click.prevent="saveInput('color1')"
                                               required>
                                    </div>
                                    <div class="col-md-2">
                                        <span for="">Color #2</span>
                                        <input type="text" class="jscolor form-control" name="color2" v-on:click.prevent="saveInput('color2')"
                                               required>
                                    </div>
                                    <div class="col-md-2">
                                        <span for="">Color #3</span>
                                        <input type="text" class="jscolor form-control" name="color3" v-on:click.prevent="saveInput('color3')"
                                               required>
                                    </div>
                                    <div class="col-md-2">
                                        <span for="">Color #4</span>
                                        <input type="text" class="jscolor form-control" name="color4" v-on:click.prevent="saveInput('color4')"
                                               required>
                                    </div>
                                    <div class="col-md-2">
                                        <span for="">Color #5</span>
                                        <input type="text" class="jscolor form-control" name="color5" v-on:click.prevent="saveInput('color5')"
                                               required>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Option 2: Clone pallet</label> <br>
                                <select id="clonepallet">
                                    <option value=""> --- </option>
                                    <option v-for="i in dt" :value="i.id" :color1="i.color1" :color2="i.color2" :color3="i.color3" :color4="i.color4" :color5="i.color5">{{ i.name }}</option>
                                </select>
                                <input class="btn btn-default" type="button" value="Clone Pallet"  v-on:click="getList">
                                <div class="alert alert-success msgClone" role="alert" v-if="msgClone">{{ msgClone }}</div>
                            </div>

                            <div class="form-group">
                                <label for="">Option 3: Get color from image
                                    <i class="fa fa-question-circle-o" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-html="true" title="<div style='text-align:left'>1) Upload your image <br>2) Select color boxes (#1 -> #5)<br>3) Choose colors from image</div>"></i>
                                </label>
                                <input type="file" accept="image/*"
                                       @change="onFileChange">
                                <div class="previewimg">
                                    <span>
                                        <img :src="image" id="scream"/>
                                        <canvas id="cs"></canvas>
                                        <abbr class="scolor1 scolor"></abbr>
                                        <abbr class="scolor2 scolor"></abbr>
                                        <abbr class="scolor3 scolor"></abbr>
                                        <abbr class="scolor4 scolor"></abbr>
                                        <abbr class="scolor5 scolor"></abbr>
                                    </span>
                                    <p>
                                        <input v-if="image" class="btn btn-default" type="button" value="Remove image"  v-on:click="removeimage">
                                    </p>
                                </div>
                            </div>

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
                dt: '',
                users: {},
                islogin: false,
                errMsg: '',
                image: '',
                inputActive: '',
                uploadimage: 0,
                msgClone: ''
            }
        },
        methods: {
            addnew(){
                this.errMsg = '';
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
                        if (res.data.errMsg) {
                            this.errMsg = res.data.errMsg
                        } else {
                            this.errMsg = ''
                        }

                    })
                    .catch(error => {
                        $('#waiting').removeClass('wait');
                        //this.related_collection = [];
                    });
            },
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;

                this.createImage(files[0]);
            },
            createImage(file) {
                let image = new Image();
                let reader = new FileReader();
                let vm = this;
                if (this.uploadimage < 1) {
                    this.uploadimage = 1;
                    this.pickColor();
                }

                $('.scolor').removeAttr('style');

                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            saveInput(color){
                this.inputActive = color;
                $('.scolor').removeClass('active');
                $('.s' + color).addClass('active');
            },
            pickColor() {
                let that = this;
                let img = _('.previewimg img'),
                    canvas = _('#cs'),
                    result = _('.result'),
                    preview = _('.preview'), x = '', y = '';


// click function
                img.addEventListener('click', function (e) {
                    // chrome
                    if (e.offsetX) {
                        x = e.offsetX;
                        y = e.offsetY;
                    }
                    // firefox
                    else if (e.layerX) {
                        x = e.layerX;
                        y = e.layerY;
                    }
                    useCanvas(canvas, img, function () {
                        // get image data
                        let p = canvas.getContext('2d')
                            .getImageData(x, y, 1, 1).data;
                        // show info
                        // result.innerHTML = '<span>HEX: ' + rgbToHex(p[0], p[1], p[2]) + '</span>' +
                        //     '<span>RGB:  rgb(' +
                        //     p[0] + ',' +
                        //     p[1] + ',' +
                        //     p[2] + ')</span>';
                        let hexColor = rgbToHex(p[0], p[1], p[2]);
                        let colorCurrent = that.inputActive;
//                        console.log('x = ' + x)
//                        console.log('y = ' + y)
//                        console.log(hexColor);
//                        console.log(colorCurrent);

                        $('.s' + colorCurrent).attr('style', 'opacity: 1; left: ' + (x-2) + 'px; top: ' + (y-2) + 'px;');
                        $('input[name="' + colorCurrent + '"]').val(hexColor);
                        $('input[name="' + colorCurrent + '"]').attr('style', 'background:#' + hexColor);
                        //that['p' + colorCurrent] = hexColor;
                        // add background in body
                        //document.body.style.background = rgbToHex(p[0], p[1], p[2]);
                    });
                }, false);

// preview function mousemove
                img.addEventListener('mousemove', function (e) {
                    // chrome
                    if (e.offsetX) {
                        x = e.offsetX;
                        y = e.offsetY;
                    }
                    // firefox
                    else if (e.layerX) {
                        x = e.layerX;
                        y = e.layerY;
                    }

                    useCanvas(canvas, img, function () {

                        // get image data
                        let p = canvas.getContext('2d')
                            .getImageData(x, y, 1, 1).data;
                        // show preview color
                        //preview.style.background = rgbToHex(p[0], p[1], p[2]);
                    });
                }, false);


// canvas function
                function useCanvas(el, image, callback) {
                    el.width = image.width; // img width
                    el.height = image.height; // img height
                    // draw image in canvas tag
                    el.getContext('2d')
                        .drawImage(image, 0, 0, image.width, image.height);
                    return callback();
                }

// short querySelector
                function _(el) {
                    return document.querySelector(el);
                };

// convert rgba to hex
// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
                function componentToHex(c) {
                    let hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }

                function rgbToHex(r, g, b) {
                    return componentToHex(r) + componentToHex(g) + componentToHex(b);
                }

                function findPos(obj) {
                    let curleft = 0, curtop = 0;
                    if (obj.offsetParent) {
                        do {
                            curleft += obj.offsetLeft;
                            curtop += obj.offsetTop;
                        } while (obj = obj.offsetParent);
                        return {x: curleft, y: curtop};
                    }
                    return undefined;
                }
            },
            formatState(color){
                if (!color.id) {
                    return color.text;
                }
                let color1 = color.element.attributes.color1.nodeValue;
                let color2 = color.element.attributes.color2.nodeValue;
                let color3 = color.element.attributes.color3.nodeValue;
                let color4 = color.element.attributes.color4.nodeValue;
                let color5 = color.element.attributes.color5.nodeValue;

                let $color = $('<span>' + color.text + '</span><abbr style="background: ' + color1 +'"></abbr><abbr style="background: ' + color2 +'"></abbr><abbr style="background: ' + color3 +'"></abbr><abbr style="background: ' + color4 +'"></abbr><abbr style="background: ' + color5 +'"></abbr>');
                return $color;
            },
            selectSearch(){
                $("#clonepallet").select2({
                    templateResult: this.formatState
                });
            },
            getList() {
                let selectCurrent = $('#clonepallet option:selected').val();
                if(selectCurrent.trim().length > 0){
                    axios.post('/clonepallet', {
                        idPallet: selectCurrent,
                    })
                        .then(res => {

                            this.users = res.data.users;
                            this.islogin = res.data.islogin;
                            this.msgClone = res.data.msgClone;

                            $('.msgClone').slideDown('fast');

                            if(res.data.pallet[0].color1) {

                                let pcolor1 = res.data.pallet[0].color1.replace('#', '');
                                let pcolor2 = res.data.pallet[0].color2.replace('#', '');
                                let pcolor3 = res.data.pallet[0].color3.replace('#', '');
                                let pcolor4 = res.data.pallet[0].color4.replace('#', '');
                                let pcolor5 = res.data.pallet[0].color5.replace('#', '');

                                $('input[name="color1"]').val(pcolor1);
                                $('input[name="color2"]').val(pcolor2);
                                $('input[name="color3"]').val(pcolor3);
                                $('input[name="color4"]').val(pcolor4);
                                $('input[name="color5"]').val(pcolor5);

                                $('input[name="color1"]').attr('style', 'background:#' + pcolor1);
                                $('input[name="color2"]').attr('style', 'background:#' + pcolor2);
                                $('input[name="color3"]').attr('style', 'background:#' + pcolor3);
                                $('input[name="color4"]').attr('style', 'background:#' + pcolor4);
                                $('input[name="color5"]').attr('style', 'background:#' + pcolor5);
                            }

                            $('.scolor').removeAttr('style');

                            setTimeout(function(){
                                $('.msgClone').slideUp('fast');
                            }, 1000)

                        })
                        .catch(error => {
                            //this.related_collection = [];
                        });
                }else{
                    alert('Please select pallet')
                }
            },
            removeimage(){
                this.image = '';
                $('input[type="file"]').val('');
            }
        },
        mounted(){
            this.selectSearch();
            $('[data-toggle="tooltip"]').tooltip()
//            let $eventSelect = $("#clonepallet");
//            let that = this;
//            $eventSelect.on("select2:select", function (e) {
//                that.getList();
//            });
        }
    }
</script>