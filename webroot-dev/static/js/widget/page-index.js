/*!
 * index页面
 */


define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Temp = {
        /* 初始化 */
        init: function (params) {
            var _self = this;
            // 1、定义默认值
            var defaults = {
                content_node: $('.index-content'),
                pic_weixin: $('#picWeixin'),
                pic_qrcode: $('#qrCode'),
                show_check: $('.select'),
                check: $('.check_position li')
            };
            // 2、用入参扩展defaults
            var _params = $.extend(defaults, params);

            // _self.setContentHeight(_params);
            _self.showQrCode(_params);
            _self.showCheck(_params);
            _self.check(_params);
            _self.showHeaderLine(_params);
            _self.registerSearchEvent(_params);
            _self.showHeaderLine(_params);
        },

        //注册搜索事件
        registerSearchEvent:function(){
            var _self = this;

            $('#indexSearch').click(function(){
                var txtType = $('#btnSelect p').text();
                var serchworld = escape($('#serchworld').val());
                var hrType= '';
                if(txtType =='社会招聘'){
                    hrType = 4;
                    window.location.href = '/socialRecruit/?serchworld='+serchworld+'&hrType='+hrType;
                }else if(txtType =='内部推荐'){
                    hrType = 16;
                    window.location.href = '/internalReferral/?serchworld='+serchworld+'&hrType='+hrType;
                }
            });
            //注册回车事件
            $(document).keydown(function(event){
                if(event.keyCode==13){
                $('#indexSearch').click();
                }
            });
        },

        setContentHeight:function(params){
            // $('body').height($(window).height());
           // params.content_node.height($(window).height() - 185);

        },
        // 显示二维码
        showQrCode:function(params){
            params.pic_weixin.hover(function(){
                params.pic_qrcode.animate({
                    opacity:1
                },500);
            },function(){
                params.pic_qrcode.animate({
                    opacity:0
                },500);
            });
        },
        //校园招聘和社会招聘的打开
        showCheck:function(params){

            params.show_check.click(function (e) {
                var $this = $(this);
                if($this.is('.open')){
                    $this.removeClass('open');
                }else {
                    $this.addClass('open');
                }
            });
        },
        //校园招聘和社会招聘的切换
        check:function(params){
            params.check.click(function (e) {
                var $this = $(this);
                $this.parent().prev()[0].innerHTML = $(this).text();
            });
        },
        //导航切换底部横线显示隐藏;
        showHeaderLine:function (params) {
          var $sidedline = $(".public-header-content-nav li");
          if(location.pathname === '/socialRecruit/'){
            $sidedline.siblings().removeClass('current');
            $sidedline.eq(1).addClass('current');
          }else if(location.pathname === '/internalReferral/'){
            $sidedline.siblings().removeClass('current');
            $sidedline.eq(2).addClass('current');
          }else if(location.pathname === '/xinWorld/'){
            $sidedline.siblings().removeClass('current');
            $sidedline.eq(3).addClass('current');
          }else if(location.pathname === '/'){
            $sidedline.siblings().removeClass('current');
            $sidedline.eq(0).addClass('current');
          }
        }
    };

    module.exports = Temp;

});
