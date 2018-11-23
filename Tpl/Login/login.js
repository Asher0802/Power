/**
 * Created by Administrator on 16-2-25.
 */

$(function(){
    var logo=window.document.getElementById("logoo");
    var logo_=$('#logoo');
    var width=document.body.offsetWidth;

    //var height=document.body.offsetHeight ;
    var logo_width=logo.offsetWidth;
    var logo_top=width*0.05;
    var logo_left=(width/2-logo_width/2);
    logo_.css("margin-top",logo_top);
    logo_.css("margin-left",logo_left);
    var co_box=window.document.getElementById("co-box");
    var co_box_=$('#co-box');
    var co_box_width=co_box.offsetWidth;
    var co_box_left=(width/2-co_box_width/2);
    co_box_.css("margin-left",co_box_left);
    co_box_.css("margin-top",logo_top);

    $(window).resize(function() {
        var logo=window.document.getElementById("logoo");
        var logo_=$('#logoo');
        var width=document.body.offsetWidth;
        //var height=document.body.offsetHeight ;
        var logo_width=logo.offsetWidth;
        var logo_top=width*0.05;
        var logo_left=(width/2-logo_width/2);
        logo_.css("margin-top",logo_top);
        logo_.css("margin-left",logo_left);
        var co_box=window.document.getElementById("co-box");
        var co_box_=$('#co-box');
        var co_box_width=co_box.offsetWidth;
        var co_box_left=(width/2-co_box_width/2);
        co_box_.css("margin-left",co_box_left);
        co_box_.css("margin-top",logo_top);

    });

	
	/*
    time_i=0;
    setInterval(function(){
        time_i++;
        if(time_i>=600){
            $('#capt').focus(function(){
                $('#code').attr('src',$__app__+'/Login/getVerify/'+Math.random());
                return false;
            })
        }
    },1000);

    $('#capt').focus(function(){
        $('#kanbudao').hide();
        return false;
    })
    $('#kanbudao').click(function(){
        $('#capt')[0].focus();
        $(this).hide();
    })
    var LoginSubmit=$("button[name=login_submit]");
    var login_click=$('#login_click');
    var UserName=$("input[name=uname]");
    var UserPass=$("input[name=upass]");
    var UserCapt=$("input[name=capt]");
    var LoginSubmitDiv=$(".input_button_div");
    var LoginMsg=$(".login-msg");
    LoginSubmit.hide();
    var click_num=1;
    login_click.click(function(){

        if(!UserName.val()){
            LoginMsg.show();
            UserName.addClass("login_error");
            LoginMsg.html("请输入用户名！");
            return false;
        }else{
            UserName.removeClass("login_error");
        };
        if(!UserPass.val()){
            LoginMsg.show();
            UserPass.addClass("login_error");
            LoginMsg.html("请输入密码！");
            return false;
        }else{
            UserPass.removeClass("login_error");
        };
        if(click_num!=1){
            if(!UserCapt.val()){
                LoginMsg.show();
                UserCapt.addClass("login_error");
                LoginMsg.html("请输入验证码！");
                return false;
            }else{
                UserCapt.removeClass("login_error");
            };
        }

        LoginMsg.hide();
        login_ajax({uname:UserName.val(),upass:UserPass.val(),capt:UserCapt.val(),num:click_num});
        click_num++
        return false;
    });
    var code = $('#code');
    code.on('click',function(){
        $('#capt').val(' ');
        $(this).attr('src',$__app__+'/Index/getVerify/'+Math.random());
        return false;
    })
    function login_ajax(f){
        var d={uname:f.uname,upass:f.upass,return_mode:"current",capt: f.capt,num: f.num}
        $.ajax({
            type:'POST',
            url:$__app__+"/Login/home_login",
            data:d,
            success:function(msg){
                if(typeof msg != 'object') msg = eval('('+msg+')');
                if (msg.info.success) {
                    window.location = $__app__+'/Index';
                }else{
                    if(msg.info.info){
                        code.attr('src',$__app__+'/Index/getVerify/'+Math.random());
                        LoginMsg.html(msg.info.info);
                    }else{
                        code.attr('src',$__app__+'/Index/getVerify/'+Math.random());
                        LoginMsg.html(msg.info);
                    }
                    $('#yzm-img_id').show();
                    $('#capt').show();
                    $('#kanbudao').show();
                    $('#fa-qrcode').show();
                    LoginMsg.show();
                }
            }
        })
    }

	*/
	
	$('#yzm-img_id').hide();
    $('#capt').hide();
    $('#kanbudao').hide();
    $('#fa-qrcode').hide();
})