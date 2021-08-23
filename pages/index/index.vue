<template>
  <view class="content">
    <!--    <u-navbar title="免费图床" title-color="#eeeeee" title-size="38" :is-back="false" :background="{'background':'#303133'}">
    </u-navbar> -->

    <uni-nav-bar class="navbar" backgroundColor="#303133" color="#eeeeee" title="免费图床"></uni-nav-bar>


    <view class="upload" @tap="chooseImage">
      <view class="row">
        <uni-icons type="cloud-upload" size="42" color="#8f8f94"></uni-icons>
      </view>
      <view class="row">
        点击选择图片或直接粘贴文件
      </view>
    </view>

    <view class="result">
      <input type="text" :value="url" />
    </view>
    <view class="button-group">
      <button size="mini" type="primary" class="slot-btn" @tap="copy('url')">复制url</button>
      <button size="mini" type="primary" class="slot-btn" @tap="copy('md')">复制markdown</button>
      <button size="mini" type="primary" class="slot-btn" @tap="copy('html')">复制html</button>
    </view>

    <view class="result">
      <uni-collapse>
        <uni-collapse-item class="uni-collapse-item" :title="item.title" v-for="(item, index) in itemList" :key="index"
          :open="item.open" :showAnimation="true">
          <view class="uni-collapse-item-body">
            {{item.body}}
          </view>
        </uni-collapse-item>
      </uni-collapse>

    </view>

    <view class="footer">
      <text>Copyright</text>
      <text class="copyright">&copy;</text>
      <text class="url" @tap="onTapCopyright">lscho</text>
    </view>

  </view>
</template>

<script>
  const db = uniCloud.database();
  export default {
    data() {
      return {
        mask: true,
        left: 'left',
        drawWid: 600, //最好把uni-drawer组件里的参数width的type改为String，不然想用百分比报错烦
        maskClick: true,
        mode: 'right',
        url: "",
        itemList: [{
          title: "上传限制",
          body: "单文件最大100M",
          open: true,
          disabled: true
        }, {
          title: "使用说明",
          body: "请勿上传违法违规图片，检测到会被删除，且上传记录均已记录IP地址。",
          open: true,
        }],
        guid: "",
        fileName: ""
      }
    },
    filters: {
      markdown(value) {
        return value;
      }
    },
    async onLoad() {
      // 初始化
      this.init();
      // 监听复制事件
      this.onPaste();
    },
    methods: {
      onTapCopyright(){
        const url='https://lscho.com/';
        window.open(url);
      },
      init() {
        let guid = uni.getStorageSync('guid');
        if (!guid) {
          guid = this.buildGuid();
          uni.setStorageSync('guid', guid);
        }
        this.guid = guid;
        // 同步用户信息
        const users = db.collection('users');
        users.where({
          token: guid
        }).get({
          getOne: true
        }).then(res => {
          if (res.result.affectedDocs == 0) {
            users.add({
              token: guid
            })
          }
        })
      },
      onPaste() {
        // demo 程序将粘贴事件绑定到 document 上
        document.addEventListener("paste", async (e) => {
          const cbd = e.clipboardData;
          const ua = window.navigator.userAgent;

          // 如果是 Safari 直接 return
          if (!(e.clipboardData && e.clipboardData.items)) {
            return;
          }

          // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
          if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind ===
            "file" &&
            cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
            ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
            return;
          }

          let blob;
          for (let i = 0; i < cbd.items.length; i++) {
            const item = cbd.items[i];
            if (item.kind == "file") {
              blob = item.getAsFile();
              if (!blob || blob.size === 0) {
                return;
              }
              // blob 就是从剪切板获得的文件 可以进行上传或其他操作
            }
          }
          let blobURL = URL.createObjectURL(blob)
          this.upload(blobURL, blob.name);
        }, false);
      },
      buildGuid() {
        let guid = "";
        for (let i = 1; i <= 32; i++) {
          let n = Math.floor(Math.random() * 16.0).toString(16);
          guid += n;
          if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
        }
        return guid;
      },
      //显示抽屉
      showHistory() {
        this.$refs.draw.open();
      },
      onUploadSuccess() {
        const files = db.collection('files');
        files.add({
          token: this.guid,
          url: this.url
        })
      },
      async upload(filePath, name) {
        uni.showLoading({
          title: '上传中'
        })
        this.fileName = name;
        // 上传文件
        const result = await uniCloud.uploadFile({
          filePath: filePath,
          cloudPath: name,
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // 进度条
          }
        });
        uni.hideLoading();
        if (result.success) {
          this.url = result.fileID;
          this.onUploadSuccess();
        }
      },
      chooseImage() {
        uni.chooseImage({
          count: 1,
          success: async (res) => {
            if (res.tempFilePaths.length > 0) {
              const filePath = res.tempFilePaths[0]
              const name = res.tempFiles[0].name;
              this.upload(filePath, name);
            }
          }
        });
      },
      copy(type) {
        if (!this.url) {
          return false;
        }
        let str;
        if (type == 'url') {
          str = this.url;
        }
        if (type == 'html') {
          str = `<img src="${this.url}"  alt="${this.fileName}" />`;
        }
        if (type == 'md') {
          str = `![${this.fileName}](${this.url})`;
        }
        uni.setClipboardData({
          data: str,
          success: () => {
            uni.showToast({
              title: '复制成功'
            })
          },
          fail: (err) => {
            uni.showToast({
              title: '复制失败'
            })
          },
        })
      }
    }
  }
</script>

<style lang="less">
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .navbar {
    width: 100%;
  }

  .upload {
    display: flex;
    margin-top: 200rpx;
    border: 1rpx #8f8f94 dashed;
    width: 80%;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 100rpx 0;

    .row {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      color: #8f8f94;
    }
  }

  .result {
    width: 80%;
    margin-top: 100rpx;

    input {
      border-bottom: 1px solid #EEEEEE;
      padding: 10rpx 20rpx;
      font-size: 26rpx;
    }
  }

  .uni-collapse-item {
    background-color: #FFFFFF;
    border: none;

    .uni-collapse-item-body {
      padding: 30rpx;
      font-size: 24rpx;
      color: #8f8f94;
    }
  }

  .button-group {
    margin-top: 20rpx;

    .slot-btn {
      margin: 0 10rpx;
      border-color: #19be6b;
      background-color: #19be6b;
    }
  }

  .footer {
    width: 100%;
    background-color: #f5f5f5;
    padding: 15px 0px;
    position: fixed;
    bottom: 0;
    font-size: 26rpx;
    text-align: center;
    color: #8f8f94;
    .copyright{
      padding: 0 15rpx;
    }
    .url {
      color: #007bff;
    }
  }
</style>
