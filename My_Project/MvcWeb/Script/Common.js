Window.Common = function () {
    var me = this;
    me.AjaxGetData = {
        getData: function getData(baseURL, params, config, noCache) {
            var cacheKey;
            param = params || {};
            if (!baseURL) return;
            cacheKey = baseURL + JSON.stringify(params).hashCode();
            if (!noCache && (cache[cacheKey] !== undefined)) {
                return this.returnPromise("resolve", cache[cacheKey]);
            }
            return jQuery.when()
                         .then(function () {
                             config = config || {};
                             var url = baseURL, defaultConfig;
                             defaultConfig = {
                                 type: "post",
                                 url: url,
                                 data: params,
                                 traditional: true, //traditional parameters
                             }
                             jQuery.extend(defaultConfig, config);
                             return $.ajax(defaultConfig)
                                     .then(function (resolve) {
                                         if (!noCache) {
                                             cache[cacheKey] = resolve;
                                         }
                                         return AjaxGetData.returnPromise("resolve", resolve);
                                     })
                         })
        },
        returnPromise: function returnPromise(resolveReject, value) {
            var d = jQuery.Deferred();
            setTimeout(function () {
                d[resolveReject](value)
            }, 1);
            return d.promise();
        }
    },
    cache = {},
    Common = {
        createEle: function (eleName, classlist, text, id, attr, data, style, events) {
            if (!eleName) return null;
            var ele, d = data;
            typeof eleName.nodeType == "undefined" ? ele = document.createElement(eleName) : ele = eleName;
            classlist && (!Array.isArray(classlist) ? (classlist.indexOf(' ') > 0 ? addClass(ele, classlist.split(' ')) : ele.classList.add(classlist)) : addClass(ele, classlist)),
            typeof id !== "undefined" && id !== null && ele.setAttribute("id", id),
            //typeof width !== "undefinde" && ele.setAttribute("style", "width:" + width + "px"),
            typeof text !== "undefined" && text != null && (ele.textContent = text);
            attr && typeof attr == "object" && (function () {
                var c;
                for (var c in attr) ele.setAttribute(c, attr[c])
            })(),
            data && jQuery(ele).data("d", d),
            style && typeof style == "object" && addStyle(ele, style);
            events && typeof events == "object" && bindEvents(ele, events);
            return ele;
            function addClass(ele, classArray) {
                for (var i = 0; i < classArray.length; i++) {
                    ele.classList.add(classArray[i]);
                }
            };
            function addStyle(ele, styleObj) {
                for (var s in styleObj) ele.style[s] = styleObj[s];
            }
            function bindEvents(ele, events) {
                for (var e in events) ele.addEventListener ? ele.addEventListener(e, events[e], false) : null;
            }
        },
        cEle: function (obj) {
            var ele = obj.ele || null,
                clist = obj.classlist || null,
                text = obj.text || null,
                id = obj.id || null,
                attr = obj.attr || null,
                data = obj.data || null,
                style = obj.style || null,
                events = obj.events || null;
            return common.createEle(ele, clist, text, id, attr, data, style, events);
        },
        cache: {
            id: 0,
            data: {},
            setCache: function (ele, key, value) {
                var d = value, thisCache;
                if (ele.nodeType) {
                    thisCache = ele["cacheId"] ? common.cache.data[ele["cacheId"]] || {} : (function () { ++common.cache.id, ele["cacheId"] = common.cache.id, common.cache.data[common.cache.id] = {}; return common.cache.data[common.cache.id]; })();

                    typeof common.cache.data[common.cache.id] === "undefined" && (common.cache.data[common.cache.id] = thisCache = {});
                    common.cache.data[common.cache.id][key] = d;
                    return common.cache.id;
                }
                else {
                    return null;
                }
            },
            getCache: function (ele, key) {
                id = ele["cacheId"];
                var o = common.cache.data[id][key];
                return o;
            },
            cache: function (ele, key, value) {
                if (arguments.length > 2)
                    return common.cache.setCache(ele, key, value);
                else if (arguments.length > 1)
                    return common.cache.getCache(ele, key);
                else
                    return;
            },
        }
    }
}