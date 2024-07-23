//Tue Jul 23 2024 10:19:46 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const $ = new Env("7.23-7.30 盛夏热浪 尽享特惠");
const notify = require("./utils/Rebels_sendJDNotify"),
  jdCookie = require("./jdCookie"),
  getToken = require("./utils/Rebels_Token"),
  common = require("./utils/Rebels_jdCommon"),
  isNotify = process.env.JD_SZXYUN_NOTIFY === "true",
  opencard_draw = process.env.jd_opencard_draw || 3;
let domains = "https://szxyun-rc.isvjcloud.com",
  cookie = "";
const cookiesArr = Object.keys(jdCookie).map(_0x2c65eb => jdCookie[_0x2c65eb]).filter(_0x30b831 => _0x30b831);
!cookiesArr[0] && ($.msg($.name, "【提示】请先获取Cookie"), process.exit(1));
!(async () => {
  console.log("=====" + $.name + "变量开启状态=====");
  console.log("代理开关: [" + common.getProxyStatus() + "]");
  console.log("抽奖次数: [" + opencard_draw + "次]");
  console.log("通知推送: [" + (isNotify ? "开启" : "关闭") + "]");
  console.log("=====" + $.name + "变量状态结束=====");
  authorCodeList = await getAuthorCodeList("http://code.257999.xyz/szxyun1.json");
  $.myCodeRun = false;
  if (authorCodeList) {
    $.myCodeRun = true;
    $.authorCode = authorCodeList[random(0, authorCodeList.length)];
  }
  $.shopId = "1000100710";
  $.activeId = "unionOpenSXRL240723dDry3JVj";
  $.activityUrl = "https://szxyun-rc.isvjcloud.com/pagec/unionOpenKGJ240228/index.html";
  $.shareUuid = $.authorCode;
  notify.config({
    title: $.name
  });
  for (let _0x129b1d = 0; _0x129b1d < cookiesArr.length; _0x129b1d++) {
    $.index = _0x129b1d + 1;
    cookie = cookiesArr[_0x129b1d];
    common.setCookie(cookie);
    $.UserName = decodeURIComponent(common.getCookieValue(cookie, "pt_pin"));
    $.UA = common.genUA($.UserName);
    $.message = notify.create($.index, $.UserName);
    $.nickName = "";
    console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
    await Main();
    common.unsetCookie();
    if ($.runEnd) {
      break;
    }
    await $.wait(parseInt(Math.random() * 1500 + 2000, 10));
  }
  isNotify && notify.getMessage() && (notify.appendContent("\n"), await notify.push());
})().catch(_0x16ee2a => $.logErr(_0x16ee2a)).finally(() => $.done());
async function Main() {
  try {
    $.endTime = 0;
    $.is_break = false;
    $.Token = "";
    $.Tokens = "";
    $.Token = await getToken(cookie, domains);
    if ($.Token == "") {
      console.log("缺少必要参数，请重新运行");
      $.message.fix("TOKEN获取失败~");
      return;
    }
    await $.wait(parseInt(Math.random() * 500 + 500, 10));
    await sendRequest("userLogin");
    if ($.Tokens) {
      $.active = "";
      await sendRequest("active");
      if ($.runEnd) {
        return;
      }
      if ($.active) {
        $.index === 1 && (console.log("" + ($.activeTitle && "活动名称：#" + $.activeTitle)), console.log("开始时间：" + $.startTime + "\n结束时间：" + $.endTime + "\n排行开奖时间：" + $.overTime + "\n"));
        console.log("当前已邀请:" + $.points + "人,积分可抽奖:" + $.points2 + "次\n助力码： " + $.joinId);
        for (let _0x227f8f in $.active.jobMap) {
          let _0x18e073 = $.active.jobMap[_0x227f8f];
          _0x18e073.details = _0x18e073.details.filter(_0x1f8e50 => _0x1f8e50.done === null);
          let _0x5ed317 = _0x18e073.dayMax || 1,
            _0x1bfe51 = _0x18e073.finishNum || 0;
          for (let _0x467ea8 = _0x1bfe51; _0x467ea8 < _0x5ed317; _0x467ea8++) {
            $.key = _0x227f8f;
            $.task = _0x18e073;
            await sendRequest("job");
          }
        }
        $.opencard_list = $.active.bindCardInfo || [];
        let _0x12d3e8 = $.opencard_list.filter(_0x4ca218 => !_0x4ca218.isBindCard) || [];
        console.log("共有" + $.opencard_list.length + "张卡,还需开" + _0x12d3e8.length + "张卡");
        for (let _0x125cc0 of _0x12d3e8) {
          $.openUrl = _0x125cc0.openUrl;
          $.venderId = common.getUrlParameter($.openUrl, "venderId");
          (!$.openUrl || !/^\d+$/.test($.venderId)) && ($.venderId = _0x125cc0.val2);
          const _0x6a454 = await common.joinShopMember($.venderId);
          if (_0x6a454) {
            console.log("加入店铺会员成功");
            await $.wait(parseInt(Math.random() * 1000 + 1000, 10));
          } else {
            console.log("有店铺开卡失败,跳过执行~");
            break;
          }
        }
        if (opencard_draw) {
          await sendRequest("active");
          await $.wait(parseInt(Math.random() * 500 + 500, 10));
          let _0x8b80c2 = parseInt($.points2 / 1),
            _0x2a9545 = Math.min(opencard_draw, _0x8b80c2);
          $.prize = [];
          console.log("已设置抽奖" + opencard_draw + "次,共有" + _0x8b80c2 + "次抽奖,可抽奖" + _0x2a9545 + "次");
          for (m = 1; _0x2a9545--; m++) {
            await sendRequest("lottery");
            if (Number(_0x2a9545) <= 0) {
              break;
            }
            if ($.is_break) {
              break;
            }
            await $.wait(parseInt(Math.random() * 1000 + 1000, 10));
          }
          $.prize.length && console.log("抽奖获得: " + $.prize.join(", ") + "\n");
        }
        if ($.is_break || $.runEnd) {
          return;
        }
        await sendRequest("share");
        if ($.myCodeRun) {
          for (let _0x96a14e = 0; _0x96a14e < authorCodeList.length; _0x96a14e++) {
            $.myCode = authorCodeList[_0x96a14e];
            await sendRequest("myshare");
            await $.wait(parseInt(Math.random() * 400 + 400, 10));
          }
        }
        $.index == 1 && ($.shareUuid = $.joinId, console.log("后面的号都会助力 -> " + $.shareUuid));
        await $.wait(parseInt(Math.random() * 1000 + 1000, 10));
      } else {
        console.log("主页参数获取失败，请重新运行");
      }
    }
  } catch (_0x1a5d67) {
    console.log(_0x1a5d67.message);
  }
}
async function handleResponse(_0x48eeb9, _0x193cc8) {
  try {
    switch (_0x48eeb9) {
      case "userLogin":
        if (_0x193cc8.code === "200" && _0x193cc8.success === true) {
          $.Tokens = _0x193cc8.data;
        } else {
          _0x193cc8.message ? console.log("" + (_0x193cc8.message || "")) : console.log("" + _0x193cc8);
        }
        break;
      case "active":
        if (_0x193cc8.code === "200" && _0x193cc8.success === true) {
          $.active = _0x193cc8.data;
          $.activeTitle = $.active.activeVO.activeTitle;
          $.startTime = $.active.activeVO.startTime;
          $.endTime = $.active.activeVO.endTime;
          $.overTime = $.active.activeVO.overTime;
          $.joinId = $.active.userVO.joinId || "";
          $.points2 = $.active.userVO.points2 || 0;
          $.points = $.active.userVO.points || 0;
          $.points3 = $.active.userVO.points3 || 0;
          $.active.showBeanList.length > 0 && console.log("领取开卡或助力奖励: " + $.active.showBeanList.map(_0x32ef13 => (_0x32ef13.sendNum || 0) + "京豆").join(", "));
        } else {
          _0x193cc8.message ? ($.drawError = _0x193cc8.message, console.log("" + ($.drawError || "")), ["未开始", "结束", "不存在", "不在"].some(_0x412eed => $.drawError.includes(_0x412eed)) && ($.runEnd = true, $.message.fix("活动已结束~"))) : console.log("❓" + _0x48eeb9 + " " + JSON.stringify(_0x193cc8));
        }
        break;
      case "job":
        if (_0x193cc8.code === "200" && _0x193cc8.success === true) {
          let {
              val = "",
              awardName = ""
            } = _0x193cc8.data,
            _0x5e2a93 = [];
          if (awardName) {
            _0x5e2a93.push(awardName);
          }
          if (val) {
            _0x5e2a93.push(val + "次抽奖");
          }
          console.log("完成任务[" + $.key + "]: " + _0x5e2a93.join(","));
        } else {
          _0x193cc8.message ? console.log("" + (_0x193cc8.message || "")) : console.log("❓" + _0x48eeb9 + " " + JSON.stringify(_0x193cc8));
        }
        break;
      case "lottery":
        if (_0x193cc8.code === "200" && _0x193cc8.success === true) {
          if (_0x193cc8.data != null) {
            switch (_0x193cc8.data.awardType) {
              case 0:
                $.prize.push("未知奖品：" + _0x193cc8.data.awardName);
                break;
              case 1:
                $.prize.push("🎉 " + _0x193cc8.data.awardName + " 🐶");
                $.message.insert(_0x193cc8.data.awardName + "🐶");
                break;
              case 2:
                $.prize.push("🗑️ 优惠券");
                break;
              case 3:
                $.prize.push("🎉 恭喜获得实物,奖品名称：" + _0x193cc8.data.awardName);
                $.message.insert("🎉 恭喜获得实物~,奖品名称：" + _0x193cc8.data.awardName);
                break;
              default:
                $.prize.push("未知奖品：" + _0x193cc8.data.awardName + "-" + _0x193cc8.data.awardType);
                break;
            }
          } else {
            $.prize.push("💨 空气");
          }
        } else {
          _0x193cc8.message ? ($.prize.push("" + (_0x193cc8.message || "")), ["开卡"].some(_0x2e3c22 => _0x193cc8.message.includes(_0x2e3c22)) && ($.is_break = true), ["结束"].some(_0x5316fe => _0x193cc8.message.includes(_0x5316fe)) && ($.runEnd = true)) : console.log("❓" + _0x48eeb9 + " " + JSON.stringify(_0x193cc8));
        }
        break;
      case "share":
        if (_0x193cc8.code === "200" && _0x193cc8.success === true) {
          let _0x3fce81 = _0x193cc8.data.helpStatus || 0;
          switch (_0x3fce81) {
            case "":
            case undefined:
            case 0:
              break;
            case 1:
              console.log("✅ 助力成功");
              break;
            case 2:
              console.log("已经助力过了哟~");
              break;
            case 3:
            case 12:
              console.log("没有助力次数了~");
              break;
            case 4:
              console.log("对方助力已达到限制");
              break;
            case 5:
              console.log("对方助力已满");
              break;
            case 7:
              console.log("未全部开卡");
              break;
            case 36:
              console.log("未浏览商品");
              break;
            case 37:
              console.log("对方未浏览商品");
              break;
            default:
              console.log("未知助力返回码");
              break;
          }
        } else {
          _0x193cc8.message ? console.log("" + (_0x193cc8.message || "")) : console.log("❓" + _0x48eeb9 + " " + JSON.stringify(_0x193cc8));
        }
        break;
      case "myshare":
        if (!(_0x193cc8.code === "200" && _0x193cc8.success === true)) {
          !_0x193cc8.message;
        }
        break;
    }
  } catch (_0x56caef) {
    console.log("❌ 未能正确处理 " + _0x48eeb9 + " 请求响应 " + (_0x56caef.message || _0x56caef));
  }
}
async function sendRequest(_0x31ccc3) {
  if ($.runEnd) {
    return;
  }
  let _0x2c9550 = "",
    _0x72aab2 = null,
    _0x5ba128 = "POST",
    _0x5b5205 = {};
  switch (_0x31ccc3) {
    case "userLogin":
      _0x5b5205 = {
        shopId: $.shopId,
        token: $.Token,
        source: "01"
      };
      _0x2c9550 = domains + "/webc/login/userLogin";
      _0x72aab2 = JSON.stringify(_0x5b5205);
      break;
    case "active":
      _0x5b5205 = {
        activeId: $.activeId,
        shareId: $.shareUuid || null
      };
      _0x2c9550 = domains + "/webc/unionOpen/active";
      _0x72aab2 = JSON.stringify(_0x5b5205);
      break;
    case "job":
      _0x5b5205 = {
        activeId: $.activeId,
        jobForm: $.task.jobForm,
        jobDetail: $.task.details.pop().config || 1,
        joinId: $.joinId
      };
      _0x2c9550 = domains + "/webc/unionOpen/job";
      _0x72aab2 = JSON.stringify(_0x5b5205);
      break;
    case "lottery":
      _0x5b5205 = {
        activeId: $.activeId,
        joinId: $.joinId,
        lotteryForm: 0
      };
      _0x2c9550 = domains + "/webc/unionOpen/lottery";
      _0x72aab2 = JSON.stringify(_0x5b5205);
      break;
    case "share":
      _0x5b5205 = {
        activeId: $.activeId,
        joinId: $.joinId,
        shareId: $.shareUuid
      };
      _0x2c9550 = domains + "/webc/unionOpen/share";
      _0x72aab2 = JSON.stringify(_0x5b5205);
      break;
    case "myshare":
      _0x5b5205 = {
        activeId: $.activeId,
        joinId: $.joinId,
        shareId: $.myCode
      };
      _0x2c9550 = domains + "/webc/unionOpen/share";
      _0x72aab2 = JSON.stringify(_0x5b5205);
      break;
    default:
      console.log("❌ 未知请求 " + _0x31ccc3);
      return;
  }
  const _0x211154 = {
    url: _0x2c9550,
    method: _0x5ba128,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      Connection: "keep-alive",
      "Content-Type": "application/json;charset=UTF-8",
      "jd-fast-token": $.Tokens || null,
      Host: "szxyun-rc.isvjcloud.com",
      Cookie: cookie,
      Referer: domains,
      Origin: domains,
      "User-Agent": $.UA
    },
    data: _0x72aab2,
    timeout: 20000
  };
  _0x5ba128 === "GET" && (delete _0x211154.data, delete _0x211154.headers["Content-Type"]);
  const _0x5f56fa = 1;
  let _0xaa9244 = 0,
    _0xaba0cb = null,
    _0x16eb1d = false;
  while (_0xaa9244 < _0x5f56fa) {
    _0xaa9244 > 0 && (await $.wait(1000));
    const _0x27a76b = await common.request(_0x211154);
    if (!_0x27a76b.success) {
      _0xaba0cb = "🚫 " + _0x31ccc3 + " 请求失败 ➜ " + _0x27a76b.error;
      _0xaa9244++;
      continue;
    }
    if (!_0x27a76b.data) {
      _0xaba0cb = "🚫 " + _0x31ccc3 + " 请求失败 ➜ 无响应数据";
      _0xaa9244++;
      continue;
    }
    handleResponse(_0x31ccc3, _0x27a76b.data);
    _0x16eb1d = false;
    break;
  }
  _0xaa9244 >= _0x5f56fa && (console.log(_0xaba0cb), _0x16eb1d && ($.outFlag = true, $.message && $.message.fix(_0xaba0cb)));
}
async function getAuthorCodeList(_0x1b6e40) {
  const _0x62558c = await common.request({
      url: _0x1b6e40,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      },
      proxy: null,
      debug: false,
      timeout: 30000
    }),
    _0x15cb45 = _0x62558c.data;
  return _0x15cb45;
}
function random(_0x40ca18, _0x140da6) {
  return Math.floor(Math.random() * (_0x140da6 - _0x40ca18)) + _0x40ca18;
}
function Env(t, e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      "POST" === e && (s = this.post);
      return new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s);
        });
      });
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t;
      this.http = new s(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, e);
      this.log("", `🔔${this.name}, 开始!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) {
        try {
          s = JSON.parse(this.getdata(t));
        } catch {}
      }
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i));
      });
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20;
        r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"),
          n = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: {
              script_text: t,
              mock_type: "cron",
              timeout: r
            },
            headers: {
              "X-Key": o,
              Accept: "*/*"
            }
          };
        this.post(n, (t, e, i) => s(i));
      }).catch(t => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) {
          return {};
        }
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (r = Object(r)[t], void 0 === r) {
        return s;
      }
      return r;
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t);
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = s ? this.getval(s) : "";
        if (r) {
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e;
          } catch (t) {
            e = "";
          }
        }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
          o = this.getval(i),
          h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t);
          s = this.setval(JSON.stringify(e), i);
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t);
          s = this.setval(JSON.stringify(o), i);
        }
      } else {
        s = this.setval(t, e);
      }
      return s;
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null;
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null;
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
    }
    get(t, e = () => {}) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status);
        e(t, s, i);
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null);
            e.cookieJar = this.ckjar;
          }
        } catch (t) {
          this.logErr(t);
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body);
      }));
    }
    post(t, e = () => {}) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(t, (t, s, i) => {
          !t && s && (s.body = i, s.statusCode = s.status);
          e(t, s, i);
        });
      } else {
        if (this.isQuanX()) {
          t.method = "POST";
          this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
            hints: !1
          }));
          $task.fetch(t).then(t => {
            const {
              statusCode: s,
              statusCode: i,
              headers: r,
              body: o
            } = t;
            e(null, {
              status: s,
              statusCode: i,
              headers: r,
              body: o
            }, o);
          }, t => e(t));
        } else {
          if (this.isNode()) {
            this.initGotEnv(t);
            const {
              url: s,
              ...i
            } = t;
            this.got.post(s, i).then(t => {
              const {
                statusCode: s,
                statusCode: i,
                headers: r,
                body: o
              } = t;
              e(null, {
                status: s,
                statusCode: i,
                headers: r,
                body: o
              }, o);
            }, t => {
              const {
                message: s,
                response: i
              } = t;
              e(s, i, i && i.body);
            });
          }
        }
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t;
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) {
          return t;
        }
        if ("string" == typeof t) {
          return this.isLoon() ? t : this.isQuanX() ? {
            "open-url": t
          } : this.isSurge() ? {
            url: t
          } : void 0;
        }
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e);
        s && t.push(s);
        i && t.push(i);
        console.log(t.join("\n"));
        this.logs = this.logs.concat(t);
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]);
      console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t);
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`);
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  }(t, e);
}