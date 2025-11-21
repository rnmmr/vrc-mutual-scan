// ==UserScript==
// @name         vrc-mutuals-scanner
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  扫描共同好友并保存
// @author       mmr
// @match        https://vrchat.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vrchat.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @require      https://code.bdstatic.com/npm/jquery@3.5.1/dist/jquery.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        .dbox {
        flex-direction: column;
        height: auto;background: rgb(7, 36, 43);
        border: 2px solid rgb(5, 60, 72);
        color: rgb(106, 227, 249);
        display: flex;
        place-content: start space-between;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        border-radius: 8px !important;
        box-shadow: none !important;
        padding: 0px 7px !important;
        transition: all 0.2s ease 0s;
        }
        .dhover:hover {
        transition: all 0.2s ease 0s;
        background: rgb(7, 52, 63);
        border-color: rgb(8, 108, 132);
        `);
    const html = `
<div class="dbox" style="margin-top: 10px;padding: 5px !important;align-items: flex-start;">
    <a style="font-weight: bold; font-size: 20px; padding-left: 5px; padding-bottom: 5px;">VRC-Mutual-Scan</a>
    <div style="display: flex;flex-direction: row;">
        <button class="dbox dhover" onclick="dbinit()">重置</button>
        <button class="dbox dhover" onclick="dboutput()" style="margin-left: 5px;">导出</button>
        <a id="resc" style="padding-left: 6px; margin: auto;">已有0条记录</a>
    </div>
    <div style="display: flex;flex-direction: row; margin-top: 5px">
        <button class="dbox dhover" onclick="offlist()">好友列表导入</button>
        <label class="dbox dhover" for="dbtniff" style="margin-left: 5px;">导入扫描列表</label>
        <input type="file" id="dbtniff" accept=".txt,.csv" style="display: none;">
    </div>
    <div style="display: flex;flex-direction: row; margin-top: 5px">
        <input class="dinput" style="width: 110px;" placeholder="从第几个开始">
        <button class="dbox dhover" onclick="scanm(flist)" style="margin-left: 5px;">扫描</button>
    </div>
    <div style="display: flex;flex-direction: row; margin-top: 5px">
        <a id="scani" style="padding-left: 6px; margin: auto;">等待中...</a>
    </div>
</div>
    `;
    const dmenu = document.createElement("div");
    dmenu.innerHTML = html;
    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
            return;
        }
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    waitForElement(".css-1ga2o5r", (el) => {
        el.insertBefore(dmenu, el.firstChild);
        document.getElementById('resc').innerText = "已有" + GM_getValue("count", 0) + "条记录";
        document.getElementById('dbtniff').addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const content = e.target.result;
                    unsafeWindow.flist = xc2flist(content);
//                    console.log(unsafeWindow.flist);
                    const total = unsafeWindow.flist.length;
                    document.getElementById("scani").innerText = `0/${total} 已导入好友列表`;
                };
                reader.readAsText(file);
            }
        });
    });
})();

function dbinit() {
    (async () => {
    const keys = await GM.listValues();
    for (const k of keys) {
        if (k.startsWith("record_")){
            await GM.deleteValue(k);
        }
    }
    GM_setValue("count", 0);
    console.log("已重置");
    document.getElementById("resc").innerText = "已有0条记录";
    })();
}

function dbadd(data) {
    let i = GM_getValue("count", 0);
    GM_setValue("record_" + (i+1) , data);
    GM_setValue("count", i+1);
    document.getElementById("resc").innerText = "已有" + (i+1) + "条记录";
}

function dbshow(i = -1) {
    if (i <= 0) {
        (async () => {
            const keys = await GM.listValues();
            for (const k of keys) {
                var data = GM_getValue(k);
                console.log(k, data);
            }
        })();
    } else {
    var data = GM_getValue("record_" + i);
    console.log("记录", i, data);}
}

function dboutput() {
    let output = [];
    let count = GM_getValue("count", 0);
    for (let j = 1; j <= count; j++) {
        let data = GM_getValue("record_" + j);
        output.push(data);
    }
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vrc_mutuals_scan_output.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function getfl() {
    let fm = [];
    let offset = 0;
    while (offset >= 0) {
        await new Promise(r => setTimeout(r, 2000));
        mpf = false;
        const res = await fetch(`https://vrchat.com/api/1/auth/user/friends?n=100&offline=false&offset=${offset}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            console.warn('连接失败，可能被墙了', res.status);
            throw "连接失败";
        }
        const getfmdata = await res.json();
        if (getfmdata.length == 100) {offset += 100;} else {offset = -1;}
        fm = fm.concat(getfmdata);
    }
    offset = 0;
    while (offset >= 0) {
        await new Promise(r => setTimeout(r, 2000));
        mpf = false;
        const res = await fetch(`https://vrchat.com/api/1/auth/user/friends?n=100&offline=true&offset=${offset}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            console.warn('连接失败，可能被墙了', res.status);
            throw "连接失败";
        }
        const getfmdata = await res.json();
        if (getfmdata.length == 100) {offset += 100;} else {offset = -1;}
        fm = fm.concat(getfmdata);
    }
    return(fm);
}

function of2flist(j) {
    let flist = [];
    for (let i = 0; i < j.length; i++) {
        flist.push([j[i].id, j[i].displayName]);
    }
    return flist;
}

function xj2flist(s) {
    try {
        let res = s.friends
        return res;
    } catch (e) {
        console.log("解析VRCX好友列表失败", e);
        return [];
    }
}

function xc2flist(s) {
    let line = s.split("\n");
    let res = [];
    for (let i = 1; i < line.length; i++) {
        res.push(line[i].split(",").slice(0,2));
    }
    console.log(res);
    return res;
}

async function offlist() {
    document.getElementById("scani").innerText = `正在导入好友列表`;
    try {
        const fldata = await getfl();
        unsafeWindow.flist = of2flist(fldata);
        const total = unsafeWindow.flist.length;
        document.getElementById("scani").innerText = `0/${total} 已导入好友列表`;
    } catch (e) {
        console.log("获取好友列表失败", e);
        document.getElementById("scani").innerText = `获取好友列表失败`;
    }
}

async function getmutuals(u) {
    let fm = [];
    let offset = 0;
    while (offset >= 0) {
        await new Promise(r => setTimeout(r, 2000));
        mpf = false;
        const res = await fetch(`https://vrchat.com/api/1/users/${u}/mutuals/friends?n=100&offset=${offset}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            console.warn('连接失败，可能被墙了', res.status, u);
            throw "连接失败";
        }
        const getfmdata = await res.json();
        if (getfmdata.length == 100) {offset += 100;} else {offset = -1;}
        fm = fm.concat(getfmdata);
    }
    return(fm);
}

async function scanm(input) {
    var l = input
    var starti = parseInt(document.querySelectorAll('.dinput')[0].value) || 1;
    if (!Array.isArray(l)) return;
    if (GM_getValue("count", 0) > 0) {
        var r = confirm("检测到已有记录，继续可能会导致数据混乱，如果你不清楚你在做什么，请点击确认重置数据库并开始扫描，点击取消不会重置数据库");
        if (r == true) {
            dbinit();
        }};
    let total = l.length;
    document.getElementById("scani").innerText = `${starti}/${total} 扫描中...`;
    let errmsg = "";
    for (let i = starti-1; i < l.length; i++) {
        const u = l[i][0];
        try {
            document.getElementById("scani").innerText = `${i+1}/${total} 扫描中...`;
            const fmdata = await getmutuals(u);
//            console.log(i+1, l[i][1], fmdata);
            dbadd({ user: u, displayname: l[i][1] ,mutuals: fmdata });
        } catch (e) {
            if (e == "连接失败") {
                document.getElementById("scani").innerText = `${i+1}/${total} 扫描中断，可能被ban了`;
                break;
            }
            console.log("这里爆了", i, u, e);
            errmsg = `${i+1}/${total} 扫描中断，发生错误`;
            break;
        }
    }
    if (errmsg == "") {
        errmsg = `${total}/${total} 扫描完成`;
    }
    document.getElementById("scani").innerText = errmsg;
    errmsg = "";
}


unsafeWindow.scanm = scanm;
unsafeWindow.xflist = xj2flist;
unsafeWindow.dbinit = dbinit;
unsafeWindow.dbadd = dbadd;
unsafeWindow.dbshow = dbshow;
unsafeWindow.dboutput = dboutput;
unsafeWindow.offlist = offlist;
unsafeWindow.xcflist = xc2flist;
unsafeWindow.getmutuals = getmutuals;
unsafeWindow.getfl = getfl;
