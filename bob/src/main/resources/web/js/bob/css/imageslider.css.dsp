<%--
	Here you could do any styling job you want , all CSS stuff.
--%>
<%@ taglib uri="http://www.zkoss.org/dsp/web/core" prefix="c" %>

.z-imageslider{
     color:black;
     text-align: center;
}

.z-imageslider-section {
	display: inline-block;
	vertical-align: middle;
}

.z-imageslider-prevBtn{
    background: url(${c:encodeURL('~./img/40_40_left_wb.PNG')});
    width: 40px;
    height: 40px;
}
.z-imageslider-nextBtn{
    background: url(${c:encodeURL('~./img/40_40_right_wb.PNG')});
    width: 40px;
    height: 40px;
}
.z-imageslider-hidden{
	display: none;
}

.z-imageslider-imgListWrapper{
    overflow: hidden;
}

.z-imageslider-imgList{
            width: 1000px;
            position: relative;
            left: 0;
            top: 0;
}

.z-imageslider-img{
	float: left;
}

.z-imageslider-img img{
	width: 100%;
    height: 100%;
}

.z-imageslider-selectImg{
    border: red 5px solid;
    width: 200px;
}