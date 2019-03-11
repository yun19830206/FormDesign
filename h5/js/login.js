(function(){
    var subBtn = document.getElementById('sub-btn') //提交按钮 
    var accountInput = document.getElementById('txtAccount') //账号input
    var pwdInput = document.getElementById('txtPassword') //密码input
    var dialog = document.getElementById('van-dialog') //对话框
    var errText = document.getElementById('err-text') //错误提示
    var modal = document.getElementById('van-modal')// 蒙层
    var certainBtn
    var certainBtnClick = false //确定按钮是否已经绑定事件
    var code = getQueryString('code') //获取url code
    var host = '' //ajax请求域

    if(!code){
        //解析code出错
        showModal('解析code出错，请重试')
    }

    /**
     * 解析url参数
     * @param {String} name 
     */
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    /**
     * ajax
     * @param {Obect} options 
     */
    function ajax(options){
        var xhr = null;
        var params = formsParams(options.data);
        //创建对象
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest()
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        // 连接
        if(options.type == "GET"){
            xhr.open(options.type,options.url + "?"+ params,options.async);
            xhr.send(null)
        } else if(options.type == "POST"){
            xhr.open(options.type,options.url,options.async);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(params);
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                options.success(xhr.responseText);
            }else{
                options.fail(xhr.responseText)
            }
        }
        function formsParams(data){
            var arr = [];
            for(var prop in data){
                arr.push(prop + "=" + data[prop]);
            }
            return arr.join("&");
        }
     
    }

    // 确定按钮点击事件
    subBtn.addEventListener('click',function () {
        if(accountInput.value === '' || pwdInput.value === ''){
            showModal('账号密码不能为空')
            dialog.style.display = 'block'
            modal.style.display = 'block'
        }else{
            ajax({
                url : "http://" + host +"/aiassistant/user/wx/binding",
                type : "POST",
                async : true,
                data : {
                    userName:accountInput.value,    //[必填]身份认证页面用户名输入框
                    password:pwdInput.value,    //[必填]身份认证页面密码输入框
                    wxCode:code 
                },
                success : function(data){
                    showModal('绑定成功')
                },
                fail : function () {
                    showModal('请求出错')
                }

            })
        }
    })

    
    // 弹出提示框
    function showModal(text){
        errText.innerHTML = text
        dialog.style.display = 'block'
        modal.style.display = 'block'
        if(!certainBtnClick){
            certainBtnClick = true
            certainBtn = document.getElementById('certain-btn')
            certainBtn.addEventListener('click',function () {
                dialog.style.display = 'none'
                modal.style.display = 'none'
            })
        }
        
    }


})()