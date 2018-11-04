const express = require('express');

const app = express();

//POST请求的包体解析器
var bodyParser = require('body-parser');
app.use(bodyParser());

//引入腾讯优图的设置文件和API文件
var conf = require('./conf');
var youtu = require('./youtu');

var fs = require('fs');

//引入“表单/文件”上传模块，用于接收微信小程序上传的图片
const formidable = require('formidable');
var form = new formidable.IncomingForm();

//设置上传图片的存放路径，__dirname 是nodejs中的一个全局变量，它的值是当前文件所在的绝对路径，这一句意思是上传的图片放在当前程序文件所在目录下的upload目录。
form.uploadDir = __dirname + "/upload"

// 设置开发者和应用信息, 请填写你在开放平台的相关信息
var appid = 'xxxxxxx';
var secretId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var secretKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var userid = 'xxxxxx'; 

//接受上传请求
app.post("/", (req, res, next) => {
	
	//解析上传过来的表单，上传文件存在回调函数的files参数里

    form.parse(req, function (error, fields, files) {
        
		// 设置设置开发者和应用信息
        conf.setAppInfo(appid, secretId, secretKey, userid, 0)

		//调用腾讯优图的通用OCR识别接口
        youtu.generalocr(files.image.path, (data) => {
            res.end(JSON.stringify(data));  //返回识别结果
            return;
        })
    });

});

//处理所有未匹配的请求
app.use((req, res, next) => {
    res.end("0");
});

//监听8000端口
const port = 8000;
app.listen(port);

console.log(`Server listening at http://127.0.0.1:${port}`);

