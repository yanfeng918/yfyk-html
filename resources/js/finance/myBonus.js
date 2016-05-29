var oldDate;//前一次查询时间
var currentDate;//此刻时间
var selectDate;//当前查询时间

$(function(){
    //chooseCurrent(1);
    initCurrentDatePicker();
    var yearMonth = {"yearMonth":currentDate};
    getAjax("GET",yearMonth,"extraBonus/auth/getBonusInfo",getBonusInfoCallBack,true);
    var selectYear = document.getElementById("year");
    var selectMonth = document.getElementById("month");
    var select1Day = document.getElementById("daysOfMonth1");
    var select2Day = document.getElementById("daysOfMonth2");
    selectYear.onchange = function(){
        loadData();
    };
    selectMonth.onchange = function(){
        loadData();
    };
    select1Day.onchange = function(){
        var yearMonth;
        if($("#daysOfMonth1").val().indexOf("全部")!=-1){
            yearMonth = {"yearMonth":selectDate};
        }else{
            yearMonth = {"yearMonth":selectDate+$("#daysOfMonth1").val()};
        }
        getAjax("GET",yearMonth,"extraBonus/auth/getLevel1Detail",getLevel1Detail,false);
    };
    select2Day.onchange = function(){
        var yearMonth;
        if($("#daysOfMonth2").val().indexOf("全部")!=-1){
            yearMonth = {"yearMonth":selectDate};
        }else{
            yearMonth = {"yearMonth":selectDate+$("#daysOfMonth2").val()};
        }
        getAjax("GET",yearMonth,"extraBonus/auth/getLevel2Detail",getLevel2Detail,false);
    };
    //showBonusDetail();
});

/**
 * 获取当前时间【年月】
 */
function initCurrentDatePicker(){
    var yearV = new Date().format("yyyy");
    $("#year").val(yearV+"年");
    var monthV = new Date().format("MM");
    $("#month").val(monthV+"月");
    oldDate = yearV+monthV;
    currentDate = oldDate;
    selectDate = currentDate;
    initDatePicker();
}

function loadData(){
    var yearMonth;
    selectDate = $("#year").val().split("年")[0]+$("#month").val().split("月")[0];
    if(selectDate>currentDate){
        initCurrentDatePicker();
        alert("友情警告：我们的系统禁止穿越时间！");
        yearMonth = {"yearMonth":currentDate};
        getAjax("GET",yearMonth,"extraBonus/auth/getBonusInfo",getBonusInfoCallBack,true);
    }else if(selectDate!=oldDate){
        oldDate = selectDate;
        //alert(DayNumOfMonth($("#year").val().split("年")[0],$("#month").val().split("月")[0]));
        initDatePicker();
        //传值的时间格式为：201511
        yearMonth = {"yearMonth":selectDate};
        getAjax("GET",yearMonth,"extraBonus/auth/getBonusInfo",getBonusInfoCallBack,true);
    }
}

function initDatePicker(){
    var num = DayNumOfMonth($("#year").val().split("年")[0],$("#month").val().split("月")[0]);
    for(i=1; i<=num; i++){
        if(i<10){
            $("#daysOfMonth1").append("<option>0"+i+"</option>");
            $("#daysOfMonth2").append("<option>0"+i+"</option>");
        }else{
            $("#daysOfMonth1").append("<option>"+i+"</option>");
            $("#daysOfMonth2").append("<option>"+i+"</option>");
        }

    }
}

function DayNumOfMonth(Year,Month){
    Month--;
    var d = new Date(Year,Month,1);
    d.setDate(d.getDate()+32-d.getDate());
    return (32-d.getDate());
}

function getBonusInfoCallBack(data){
    var total;//汇总数
    var totalExtraCountInfo;//汇总数据中额外奖励提示
    var totalExtraNextInfo;//汇总数据中额外奖励的更高目标提示
    var currentSelfCount;//查询月自发数
    var lastSelfCount ;//查询月的上月自发数
    var selfExtraCountInfo;//自发数据中额外奖励提示
    var selfExtraNextInfo;//自发数据中额外奖励的更高目标提示
    var level1Count;//查询月的一级发布数
    var level1ExtraCountInfo;//1级数据中提成
    var level1ExtraDetailInfo;//1级数据详细说明
    var level2Count;//查询月的二级发布数
    var level2ExtraCountInfo;//2级数据中提成
    var level2ExtraDetailInfo;//2级数据详细说明
    var bonusGetStatus;//领取情况
    if(parseInt(selectDate)==parseInt(currentDate)){
        //是否是当月数据，直接显示实时数据
        currentSelfCount = data.currentSelfCount;
        lastSelfCount = data.lastSelfCount;
        level1Count = data.level1Count;
        level2Count = data.level2Count;
        total = currentSelfCount+level1Count+level2Count;
        bonusGetStatus = "任务进行中，加油哦！！";
        if(lastSelfCount<100){
            //上月自发量未达到100条
            level2ExtraCountInfo = "未达标哦！";
            level2ExtraDetailInfo = "真可惜，您上个月的自发量才"+lastSelfCount+"，不能享受二级提成哦！";
            totalExtraCountInfo = "未达标哦！";
            totalExtraNextInfo  = "真可惜，您上个月的自发量才"+lastSelfCount+"，没能获取总奖励资格!";
        }else{
            if(currentSelfCount<100){
                //当月自发量未满足100条
                level2ExtraCountInfo = "未达标哦！";
                level2ExtraDetailInfo = "加油呀！当月还差"+(100-currentSelfCount)+"条就能获取二级提成啦！";
                totalExtraCountInfo = "未达标哦！";
                totalExtraNextInfo  = "加油呀！先得满足当月自发量100条哦！"
            }else{
                //满足二级会员提成和总数据奖励的条件
                level2ExtraCountInfo = data.level2Count*2+"盘币分成！";
                level2ExtraDetailInfo = "您的二级会员共发布"+data.level2Count+"条，每条获取分成2盘币！您已获得"+data.level2Count*2+"盘币！";                $("#level2BonusInfo").html("您的二级会员共发布"+data.level2Count+"条，每条获取分成2盘币！您已获得"+data.level2Count*2+"盘币！");
                if(total<1000){
                    totalExtraCountInfo = "到1000条才有奖励哦！！";
                    totalExtraNextInfo  = "加快速度呀，还差"+(1000-total)+"条就可获取1000额外盘币奖励啦!";
                }else if(total<2000){
                    totalExtraCountInfo = "1000盘币奖励！";
                    totalExtraNextInfo  = "当前可获1000盘币奖励，还差"+(2000-total)+"条就可获取2000盘币啦!";
                }else if(total<3000){
                    totalExtraCountInfo = "2000盘币奖励！！";
                    totalExtraNextInfo  = "当前可获2000盘币奖励，还差"+(3000-total)+"条就可获取3000盘币啦!";
                }else if(total<4000){
                    totalExtraCountInfo = "3000盘币奖励！";
                    totalExtraNextInfo  = "当前可获3000盘币奖励，还差"+(4000-total)+"条就可获取4000盘币啦!";
                }else if(total<5000){
                    totalExtraCountInfo = "4000盘币奖励！";
                    totalExtraNextInfo  = "当前可获4000盘币奖励，还差"+(5000-total)+"条就可获取5000盘币啦!";
                }else{
                    totalExtraCountInfo = "5000盘币奖励！";
                    totalExtraNextInfo  = "恭喜您，您可获得5000盘币的最高奖励！";
                }
            }
        }
        if(currentSelfCount<100){
            selfExtraCountInfo = "到100条才有奖励哦！";
            selfExtraNextInfo = "加快速度呀，还差"+(100-currentSelfCount)+"条就可获取200盘币啦!";
        }else if(currentSelfCount<200){
            selfExtraCountInfo = "200盘币奖励！";
            selfExtraNextInfo = "当前可获200盘币奖励，还差"+(200-currentSelfCount)+"条就可获取500盘币啦!";
        }else if(currentSelfCount<500){
            selfExtraCountInfo = "500盘币奖励！";
            selfExtraNextInfo = "当前可获500盘币奖励，还差"+(500-currentSelfCount)+"条就可获取1500盘币啦!";
        }else if(currentSelfCount<1000){
            selfExtraCountInfo = "1500盘币奖励！";
            selfExtraNextInfo = "当前可获1500盘币奖励，还差"+(1000-currentSelfCount)+"条就可获取3500盘币啦!";
        }else if(currentSelfCount>=1000){
            selfExtraCountInfo = "3500盘币奖励！";
            selfExtraNextInfo = "恭喜您，已获得3500盘币的最高奖励!";
        }
        level1ExtraCountInfo = data.level1Count*2+"盘币分成！";
        level1ExtraDetailInfo = "您的一级会员共发布"+data.level1Count+"条，每条获取分成2盘币！您已获得"+data.level1Count*2+"盘币！";
    }else{
        //查询历史数据
        if(data.award.id==null){
            //未领取过奖励的情况下，显示实时数据
            currentSelfCount = data.currentSelfCount;
            lastSelfCount = data.lastSelfCount;
            level1Count = data.level1Count;
            level2Count = data.level2Count;
            total = currentSelfCount+level1Count+level2Count;
            if(selectDate<201511){
                bonusGetStatus = "我们的奖励机制从2015年11月才开始计算哒！";
            }else{
                if(parseInt(total)==0){
                    bonusGetStatus = "当月未发成功房源，无奖励可领取！";
                }else {
                    bonusGetStatus = "请等待我们为您细心地结算哦！";
                }
            }
            if(lastSelfCount<100){
                //上月自发量未达到100条
                level2ExtraCountInfo = "未达标哦！";
                level2ExtraDetailInfo = "真可惜，您上个月的自发量才"+lastSelfCount+"，不能享受二级提成哦！";
                totalExtraCountInfo = "未达标哦！";
                totalExtraNextInfo  = "真可惜，您上个月的自发量才"+lastSelfCount+"，没能获取总奖励资格!";
            }else{
                if(currentSelfCount<100){
                    //当月自发量未满足100条
                    level2ExtraCountInfo = "未达标哦！";
                    level2ExtraDetailInfo = "真可惜，您该月的自发量才"+currentSelfCount+"，不能享受二级提成哦！";
                    totalExtraCountInfo = "未达标哦！";
                    totalExtraNextInfo  = "真可惜，您该月的自发量才"+currentSelfCount+"，不能享受二级提成哦！";
                }else{
                    //满足二级会员提成和总数据奖励的条件
                    level2ExtraCountInfo = data.level2Count*2+"盘币分成！";
                    level2ExtraDetailInfo = "您的二级会员共发布"+data.level2Count+"条，每条获取分成2盘币！您可获得"+data.level2Count*2+"盘币！";                $("#level2BonusInfo").html("您的二级会员共发布"+data.level2Count+"条，每条获取分成2盘币！您已获得"+data.level2Count*2+"盘币！");
                    if(total<1000){
                        totalExtraCountInfo = "未达标哦！";
                        totalExtraNextInfo  = "1000条才能有奖励！！";
                    }else if(total<2000){
                        totalExtraCountInfo = "1000盘币奖励！";
                        totalExtraNextInfo  = "可获1000盘币奖励!";
                    }else if(total<3000){
                        totalExtraCountInfo = "2000盘币奖励！！";
                        totalExtraNextInfo  = "可获2000盘币奖励!";
                    }else if(total<4000){
                        totalExtraCountInfo = "3000盘币奖励！";
                        totalExtraNextInfo  = "可获3000盘币奖励!";
                    }else if(total<5000){
                        totalExtraCountInfo = "4000盘币奖励！";
                        totalExtraNextInfo  = "可获4000盘币奖励!";
                    }else{
                        totalExtraCountInfo = "5000盘币奖励！";
                        totalExtraNextInfo  = "恭喜您，您可获得5000盘币的最高奖励！";
                    }
                }
            }
            if(currentSelfCount<100){
                selfExtraCountInfo = "到100条才有奖励哦！";
                selfExtraNextInfo = "到100条才可获取200盘币!";
            }else if(currentSelfCount<200){
                selfExtraCountInfo = "200盘币奖励！";
                selfExtraNextInfo = "当前可获200盘币奖励!";
            }else if(currentSelfCount<500){
                selfExtraCountInfo = "500盘币奖励！";
                selfExtraNextInfo = "当前可获500盘币奖励!";
            }else if(currentSelfCount<1000){
                selfExtraCountInfo = "1500盘币奖励！";
                selfExtraNextInfo = "当前可获1500盘币奖励!";
            }else if(currentSelfCount>=1000){
                selfExtraCountInfo = "3500盘币奖励！";
                selfExtraNextInfo = "恭喜您，可获得3500盘币的最高奖励!";
            }
            level1ExtraCountInfo = data.level1Count*2+"盘币分成！";
            level1ExtraDetailInfo = "您的一级会员共发布"+data.level1Count+"条，每条获取分成2盘币！您已获得"+data.level1Count*2+"盘币！";
        }else{
            //奖励已发放情况
            currentSelfCount = data.award.thisMonNum;
            lastSelfCount = data.award.lastMonNum;
            level1Count = data.award.firLevelNum;
            level2Count = data.award.secLevelNum;
            total = currentSelfCount+level1Count+level2Count;
            bonusGetStatus = "我们已为您结算奖金"+data.award.extraAward+"盘币！";
            if(lastSelfCount<100){
                //上月自发量未达到100条
                level2ExtraCountInfo = "未达标哦！";
                level2ExtraDetailInfo = "该月的上月自发量需要满足100条才能获取奖励资格！";
                totalExtraCountInfo = "未达标哦！";
                totalExtraNextInfo  = "该月的上月自发量需要满足100条才能获取奖励资格！";
            }else{
                if(currentSelfCount<100){
                    //当月自发量未满足100条
                    level2ExtraCountInfo = "未达标哦！";
                    level2ExtraDetailInfo = "该月的自发量需要满足100条才能获取奖励资格！";
                    totalExtraCountInfo = "未达标哦！";
                    totalExtraNextInfo  = "该月的自发量需要满足100条才能获取奖励资格！";
                }else{
                    //满足二级会员提成和总数据奖励的条件
                    level2ExtraCountInfo = data.level2Count*2+"盘币分成！";
                    level2ExtraDetailInfo = "您的二级会员共发布"+data.level2Count+"条，每条获取分成2盘币！您已获得"+data.level2Count*2+"盘币！";                $("#level2BonusInfo").html("您的二级会员共发布"+data.level2Count+"条，每条获取分成2盘币！您已获得"+data.level2Count*2+"盘币！");
                    if(total<1000){
                        totalExtraCountInfo = "未达标哦！";
                        totalExtraNextInfo  = "共1000条才能有奖励！！";
                    }else if(total<2000){
                        totalExtraCountInfo = "1000盘币奖励！";
                        totalExtraNextInfo  = "已获1000盘币奖励!";
                    }else if(total<3000){
                        totalExtraCountInfo = "2000盘币奖励！！";
                        totalExtraNextInfo  = "已获2000盘币奖励!";
                    }else if(total<4000){
                        totalExtraCountInfo = "3000盘币奖励！";
                        totalExtraNextInfo  = "已获3000盘币奖励!";
                    }else if(total<5000){
                        totalExtraCountInfo = "4000盘币奖励！";
                        totalExtraNextInfo  = "已获4000盘币奖励!";
                    }else{
                        totalExtraCountInfo = "5000盘币奖励！";
                        totalExtraNextInfo  = "恭喜您，您已获得5000盘币的最高奖励！";
                    }
                }
            }
            if(currentSelfCount<100){
                selfExtraCountInfo = "到100条才有奖励哦！";
                selfExtraNextInfo = "到100条才可获取200盘币!";
            }else if(currentSelfCount<200){
                selfExtraCountInfo = "200盘币奖励！";
                selfExtraNextInfo = "当前已获200盘币奖励!";
            }else if(currentSelfCount<500){
                selfExtraCountInfo = "500盘币奖励！";
                selfExtraNextInfo = "当前已获500盘币奖励!";
            }else if(currentSelfCount<1000){
                selfExtraCountInfo = "1500盘币奖励！";
                selfExtraNextInfo = "当前已获1500盘币奖励!";
            }else if(currentSelfCount>=1000){
                selfExtraCountInfo = "3500盘币奖励！";
                selfExtraNextInfo = "恭喜您，已获得3500盘币的自发量最高奖励!";
            }
            level1ExtraCountInfo = data.level1Count*2+"盘币分成！";
            level1ExtraDetailInfo = "您的一级会员共发布"+data.level1Count+"条，每条获取分成2盘币！您已获得"+data.level1Count*2+"盘币！";
        }
    }
    $("#mySelfCount").html(currentSelfCount);
    $("#level1Count").html(level1Count);
    $("#level2Count").html(level2Count);
    $("#totalCount").html(total);
    $("#myBonusInfo").html(selfExtraNextInfo);
    $("#mySelfBonus").html(selfExtraCountInfo);
    $("#level1Bonus").html(level1ExtraCountInfo);
    $("#level1BonusInfo").html(level1ExtraDetailInfo);
    $("#level2Bonus").html(level2ExtraCountInfo);
    $("#level2BonusInfo").html(level2ExtraDetailInfo);
    $("#totalExtraBonusInfo").html(totalExtraNextInfo);
    $("#totalExtraBonus").html(totalExtraCountInfo);
    $("#extraBonusStatus").html(bonusGetStatus);
}

/**
 *  隐藏提交数据的对话框
 */
$(function () {
    $(".close").click(function (event) {
        $(".hide").hide();
    });

    $("#level1Detail").click(function (event) {
        $("#daysOfMonth1").val("全部");
        if(parseInt($("#level1Count").html())>0) {
            $(".hide").show();
            $("#headTitle").html(selectDate + "一级会员明细");
            $("#level2DetailTable").hide();
            $("#daysOfMonth2").hide();
            $("#daysOfMonth1").show();
            $("#level1DetailTable").show();
            var yearMonth = {"yearMonth":selectDate};
            //alert(yearMonth)
            getAjax("GET", yearMonth, "extraBonus/auth/getLevel1Detail", getLevel1Detail, false);
        }else{
            alert("您的一级会员未发布任何数据！");
        }
    });

    $("#level2Detail").click(function (event) {
        $("#daysOfMonth2").val("全部");
        if(parseInt($("#level2Count").html())>0){
            $(".hide").show();
            $("#headTitle").html(selectDate+"二级会员明细");
            $("#level2DetailTable").show();
            $("#level1DetailTable").hide();
            $("#daysOfMonth1").hide();
            $("#daysOfMonth2").show();
            var yearMonth = {"yearMonth":selectDate};
            //alert(yearMonth)
            getAjax("GET",yearMonth,"extraBonus/auth/getLevel2Detail",getLevel2Detail,false);
        }else{
            alert("您的二级会员未发布任何数据！");
        }
    });
});

function getLevel1Detail(data){
    if ($("#level1Table tr").length>1){
        $("#level1Table tr:gt(0)").remove();
    }
    $.each(data, function (i, item) {
        var content = "";
        var bgColor="white";
        if(i%2!=0){
            bgColor="#dedede";
        }
        content += "<tr style='background-color:"+bgColor+"'><td>"+(i+1)+"</td><td style='border-left: 1px solid white'>"+item.username+
            "</td><td style='border-left: 1px solid white; color: red'>"+item.count+"</td></tr>";
        $("#level1Table").append(content);
    });
}

function getLevel2Detail(data){
    if ($("#level2Table tr").length>1){
        $("#level2Table tr:gt(0)").remove();
    }
    $.each(data, function (i, item) {
        var content = "";
        var bgColor="white";
        if(i%2!=0){
            bgColor="#dedede";
        }
        content += "<tr style='background-color:"+bgColor+"'><td>"+(i+1)+"</td><td style='border-left: 1px solid white'>"+item.username+
            "</td><td style='border-left: 1px solid white; color: red'>"+item.count+"</td></tr>";
        $("#level2Table").append(content);
    });
}