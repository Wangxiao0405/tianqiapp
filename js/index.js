$(function () {

    $.ajax({
        url:"https://www.toutiao.com/stream/widget/local_weather/data/?city=",
        data:{'city':"太原"},
        type:"get",
        dataType:"jsonp",
        success:function (e) {
            updata(e.data)
        }
    });
    $(".audioBtn").click(function (event) {
        event.stopPropagation();
        let speech=window.speechSynthesis;
        let speechset=new SpeechSynthesisUtterance();
        let text=$(".header span").text()+"当前温度"+$(".screen h3 span").text()+"摄氏度";
        console.log(text);
        speechset.text=text;
        speech.speak(speechset);
    })


    $(".header").click(function () {
        $(".cityBox").slideDown()
    })
    $(".cityBox button").click(function () {
        $(".cityBox").slideUp()
    })
    let citys;
    $.ajax({
        url:"https://www.toutiao.com/stream/widget/local_weather/city/",
        type:"get",
        dataType:"jsonp",
        success:function (e) {
            citys=e.data
            let str="";
            for (key in citys) {
                str+=`<h3>${key}</h3>`
                str+=`<div class='con'>`;
                for (key2 in citys[key]) {
                    str+=`<div class="btn">${key2}</div>`
                }
                str+=`</div>`
            }
            $(str).appendTo($(".message"));
        }
    })
    let city;
    $(".cityBox").on("touchstart",function (event) {
        if (event.target.className=="btn"){
            city=event.target.innerText;
            $(".cityBox").slideUp();
        }
        $.ajax({
            url:"https://www.toutiao.com/stream/widget/local_weather/data/?city="+city,
            data:{'city':city},
            type:"get",
            dataType:"jsonp",
            success:function (e) {
                updata(e.data)
            }
        })

    })
    function updata(data) {
        console.log(data);
        $(".header span").text(data.city);
        $(".screen .aqi span:first-child").text(data.weather.aqi);
        $(".screen .aqi span:last-child").text(data.weather.quality_level);
        $(".screen h3 span").text(data.weather.current_temperature);
        $(".screen h4 span").text(data.weather.dat_condition);
        $(".screen h5 span").text(data.weather.wind_direction+" "+data.weather.wind_level+"级");
        $(".day .today span:nth-child(2)").text(data.weather.dat_high_temperature+"/"+data.weather.dat_low_temperature);
        $(".day .today span:nth-child(3)").text(data.weather.day_condition);
        $(".day .tomorrow span:nth-child(2)").text(data.weather.tomorrow_high_temperature +"/"+data.weather.tomorrow_low_temperature);
        $(".day .tomorrow span:nth-child(3)").text(data.weather.tomorrow_condition);
        $(".day .today span:last-child img").attr("src",`img/${data.weather.dat_weather_icon_id}.png`)
        $(".day .tomorrow span:last-child img").attr("src",`img/${data.weather.tomorrow_weather_icon_id}.png`)
        let str="";
        for (obj of data.weather.hourly_forecast) {
            str+=`
              <div class="box">
                <div><span>${obj.hour}</span>:00</div>
                <img src="img/${obj.weather_icon_id}.png" alt="">
                <div><span>${obj.temperature}</span>°</div>
            </div>
            `
        }
        $(".hours .con").html(str);
        let str1="";
        let x=[];
        let high=[];
        let low=[];
        let weekday=["日","一","二","三","四","五","六"];

        for (obj of data.weather.forecast_list) {
            let date=new Date(obj.date);
            let day=date.getDay();
            x.push(obj.date);
            high.push(obj.high_temperature);
            low.push(obj.low_temperature);
            str1+=`
                <div class="box">
                    <div>周${weekday[day]}</div>
                    <div>${obj.date}</div>
                    <div>${obj.condition}</div>
                    <img src="img/${obj.weather_icon_id}.png" alt="">
                    <div><span>${obj.high_temperature}</span>°</div>
                    <div class="low"><span>${obj.low_temperature}</span>°</div>
                    <img src="img/${obj.weather_icon_id}.png" alt="">
                    <div>${obj.condition}</div>
                    <div>${obj.wind_direction}<br>${obj.wind_level}</div>
                </div>
            `
        }
        $(".week .con").html(str1);
        var myChart = echarts.init($(".week .con1")[0]);
        var option = {
            xAxis: {
                data: x,
                show:false
            },
            yAxis: {
                show:false
            },
            grid:{
                top:40,
                left:0,
                width:"1450px"
            },
            series: [{
                type: 'line',
                data: high,
                color:"#ffb74d",
                symbol:'circle',
                symbolSize:8,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color:'#333',
                    }
                },
            },{
                type: 'line',
                data: low,
                color:"#4fc3f7",
                symbol:'circle',
                symbolSize:8,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        color:'#333',
                    }
                },
            }]
        };
        myChart.setOption(option);

    }

})


