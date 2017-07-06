/**
 * Created by Cassie.Xu on 17/7/6.
 */

const styles = require('../css/timerBar.css');

$(function () {
    var startDate = new Date(),
        oneSec = 1000,
        oneMin = oneSec * 60,
        oneHour = oneMin * 60,
        oneDay = oneHour * 24;
    var tick = function () {

        var now = new Date();
        var elapsed = (now - startDate) % oneDay;
        var parts = [];

        parts[0] = "" + Math.floor(elapsed / oneHour);
        parts[1] = "" + Math.floor(elapsed % oneHour / oneMin);
        parts[2] = "" + Math.floor(elapsed % oneMin / oneSec);

        parts[0] = parts[0].length > 1 ? parts[0] : "0" + parts[0];
        parts[1] = parts[1].length > 1 ? parts[1] : "0" + parts[1];
        parts[2] = parts[2].length > 1 ? parts[2] : "0" + parts[2];
        console.log("elapsed", now - startDate);
        console.log("parts", parts);
        $(".lazy").text(parts.join(":"));
    };
    window.setInterval(tick, 1000);
})