# vrc-mutual-scan
批量扫描共同好友并导出的[油猴](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd)脚本 先[安装油猴](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd)，需要在 [chrome://extensions/](chrome://extensions/) 打开开发者模式


然后再点击这里安装[安装脚本](https://github.com/rnmmr/vrc-mutual-scan/raw/refs/heads/main/vrc-mutual-scan.user.js)

## 如何使用

### 1.打开VRC官网使用油猴插件导出共同好友数据

打开[VRC网页主页](https://vrchat.com/home)，左上角即可以看到工具菜单，点击好友列表导入等待导入完成（如希望自己添加扫描列表可看下面），再点击扫描等待扫描完成后导出即可，请保持VRC网页在前台运行

> #### 如想自己制作扫描列表，可使用VRCX导出或自己制作扫描列表
> 在[VRCX](https://github.com/vrcx-team/VRCX)用csv格式复制好友列表，在本地新建一个txt或者csv格式的文件把复制的内容粘贴进去(扫描全部好友用)
> 
> 或者按以下格式制作csv文件(可选择自己想要扫描的对象)
> 
> ```
> UserID,DisplayName
> usr_12345678-1234-5678-1234-123456789012,mmr
> usr_87654321-8765-4321-8765-098765432109,rmm
> ```

### 3.查看关系网

打开[好友关系网](https://rnmmr.github.io/vrc-mutual-scan/)，在左上角导入上一步导出的数据

[备用链接](vms.ddddp.eu.org) 👀Gtihub Pages不知道为什么部署不了，懒得看了
## 已知问题

与非好友的共同好友的机制还没写

## Todo

- [X] 人物查找
- [X] 断点续扫
- [X] 扒好友列表开始扫描
- [ ] 非好友共同好友
- [ ] 筛选数据

