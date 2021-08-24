# uniCloud图床 搭建教程

## 准备工作

### 注册 DCloud 账号并实名认证
注册地址：<https://unicloud.dcloud.net.cn/home>

实名认证前需要绑定国内（+86）手机号码

### 下载安装 Hbuilder X 
下载地址：<https://www.dcloud.io/hbuilderx.html>

### 下载项目源码到本地
下面两种方法任选

1. git clone
```
git clone https://github.com/sunete/unicloud-image.git
```
2. 直接下载
<https://github.com/sunete/unicloud-image/archive/main.zip>

## 搭建教程

### 从微信获取内容安全服务的配置信息

1. 注册微信公众平台：<https://mp.weixin.qq.com/>
2. 进入微信公众平台，登录微信小程序账号（如果没有小程序账号，可以直接使用邮箱注册，流程很简单）
3. 进入以下路径 **开发->开发管理->开发设置->开发者ID**
4. 获取 **AppID(小程序ID)** 和 **AppSecret(小程序密钥)**

### 打开项目目录
打开 [Hbuilder X](https://www.dcloud.io/hbuilderx.html) ，点击软件左下角，登录 DCloud 账号，打开下载的项目源码目录。

![image](https://user-images.githubusercontent.com/45954867/130559558-e114764b-da6a-4f82-8aef-93c9414996a3.png)

### 添加内容安全服务配置

把前面获取到的微信小程序 **AppID(小程序ID)** 和 **AppSecret(小程序密钥)** 分别填写在 `appid` 和 `appsecret` 后的引号中。

配置文件路径为 `unicloud-image/uniCloud-aliyun/cloudfunctions/common/uni-config-center/uni-sec-check/config.json` 

```
{
  "provider": {
    "mp-weixin": {
      "appid": "小程序ID",
      "appsecret": "小程序密钥"
    }
  }
}
```

### 初始化云服务空间

右键 uniCloud 文件夹，运行云服务空间初始化向导。

![1](https://user-images.githubusercontent.com/45954867/130560377-8bc9f2f8-c02d-47be-bb19-d518c638ff84.png)

点击新建，跳转到浏览器，创建服务器空间，服务商选择阿里云。

![2](https://user-images.githubusercontent.com/45954867/130561076-c4b4d27a-f3c6-4517-9b97-2a68fde404e4.png)

回到 Hbuilder X ，选择绑定刚创建的服务器空间。点击下一步，全部勾选，开始部署。

![3](https://user-images.githubusercontent.com/45954867/130561632-9d8bbcba-ed77-4d85-8502-4de8040f79c9.png)

### 开通前端网页托管
浏览器进入刚才创建的空间，点击 `前端网页托管` ,点击开通。在 `参数配置` 中复制默认域名。

![4](https://user-images.githubusercontent.com/45954867/130562383-368a3ff6-d137-4d23-a48b-23ca2546dda8.png)

选择左侧 `跨域配置` ,点击新增域名，把上面复制的默认域名添加进去。

![5](https://user-images.githubusercontent.com/45954867/130565990-6d3d9c7c-2e20-4161-9119-06f30cfffe73.png)

### 部署到 uniCloud 云服务空间
选中项目文件夹，点击发行，选择 `网站-PC Web或手机H5(适用于nui-app)` ,等待完成即可。

![6](https://user-images.githubusercontent.com/45954867/130566481-1206bc67-ae47-40dc-af45-e7c767abe1bb.png)

## 关于本项目
- 本项目教程参考 [《从零部署一个unicloud程序-以文件上传为例》](https://www.jingtaiboke.com/unicloud-upload-demo.html)
- fork 自 [lscho/uniCloud-image](https://github.com/lscho/uniCloud-image) 并添加鉴黄功能
- 请勿滥用 DCloud 服务上传违法违规内容！

## 特别鸣谢
感谢 [DCloud](https://dcloud.io/) 为开发者提供免费的托管服务。
