# vrc-mutual-scan
批量扫描共同好友并导出的油猴脚本
[安装](https://github.com/rnmmr/vrc-mutual-scan/raw/refs/heads/main/vrc-mutual-scan.user.js)

## 如何使用
### 使用VRCX导出或自己制作扫描列表
在[VRCX](https://github.com/vrcx-team/VRCX)用csv格式复制好友列表，在本地新建一个txt或者csv格式的文件把复制的内容粘贴进去(扫描全部好友用)

或者按以下格式制作csv文件(可选择自己想要扫描的对象)

```
UserID,DisplayName
usr_12345678-1234-5678-1234-123456789012,mmr
```

### 使用油猴插件导出共同好友数据

打开[VRC网页主页](https://vrchat.com/home)，左上角即可以看到工具菜单，点击导入将上一步创建的文件导入，等待扫描完成后导出即可，请保持VRC网页在前台运行

### 查看关系网

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

