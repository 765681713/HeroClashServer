$(function () {
    $('#HomePage').show();
    $('#AboutPage').hide();
    var homeLi = $('ul.nav #home');
    homeLi.active = true;
    var aboutLi = $('ul.nav #about');

    homeLi.click(function (e) {
        e.preventDefault();//阻止事件跳转
        $('ul.nav > li').removeClass('active');
        $(this).addClass('active');
        $('#HomePage').show();
        $('#AboutPage').hide();
    });

    aboutLi.click(function (e) {
        e.preventDefault();//阻止事件跳转
        $('ul.nav > li').removeClass('active');
        $(this).addClass('active');
        $('#HomePage').hide();
        $('#AboutPage').show();
    });

    function startTimes() {
        var today = new Date();
        var years = today.getFullYear();
        var months = today.getMonth();
        var d = today.getDate();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        months = months + 1;
        $("#timep").text(" " + years + "年" + months + "月" + d + "日 " + h + ":" + m + ":" + s);
    }

    startTimes();
    setInterval(startTimes,1000);


});