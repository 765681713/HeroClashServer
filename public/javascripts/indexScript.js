$(function () {
    //alert("start");
    function startTimes() {
        var today = new Date();
        var years = today.getFullYear();
        var months = today.getMonth();
        var d = today.getDate();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        months = months + 1;
        $("#timep").append(" " + years + "年" + months + "月" + d + "日 " + h + ":" + m + ":" + s);
        setTimeout('startTimes()', 1000);
    }
    startTimes();
});