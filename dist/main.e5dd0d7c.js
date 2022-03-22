// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var hashMAp = JSON.parse(localStorage.getItem('siteMap')) || [{
  logo: "G",
  url: "https://google.com"
}, {
  logo: "J",
  url: "https://juejin.cn"
}];
var $liList = $('.siteList');
var isTouchDevice = 'ontouchstart' in document.documentElement; //true 为移动端

function formatUrl(url) {
  var str = url.replace(/^http:\/\//, '').replace(/^https:\/\//, '').replace(/www\./, '').replace(/\/.*/, '');
  return str;
}

var render = function render() {
  $liList.find('li:not(.last)').remove();
  hashMAp.forEach(function (element, i) {
    if (isTouchDevice) {
      var $li = $("<li class=\"site\" data-item=".concat(i, ">\n                <div class=\"mask hide\">\n                    <button class=\"delete\">\u5220\u9664</button>\n                </div>\n                <div class=\"logo\">").concat(element.logo, "</div>\n                <div class=\"url\">").concat(formatUrl(element.url), "</div></li>"));
      $li.insertBefore($('li.last')); //长按可删除

      var timeOutEvent = 0;
      $li.on({
        touchstart: function touchstart(e) {
          timeOutEvent = setTimeout(function () {
            timeOutEvent = 0;
            var $currentTarget = $(e.currentTarget);
            $currentTarget.find('.mask').removeClass('hide');
          }, 500);
          e.preventDefault();
        },
        touchmove: function touchmove() {
          clearTimeout(timeOutEvent);
          timeOutEvent = 0;
        },
        touchend: function touchend(e) {
          clearTimeout(timeOutEvent);
          var hideMask = true; //处理删除事件

          if (e.target.className === 'delete') {
            hideMask = false;
            e.stopPropagation();
            hashMAp.splice(i, 1);
            localStorage.setItem('siteMap', JSON.stringify(hashMAp));
            render();
          } else if (e.target.className === 'mask') {
            // 取消删除
            $(e.currentTarget).find('.mask').addClass('hide');
          } else {
            // 点击事件 跳转
            if (timeOutEvent != 0) {
              window.location.href = element.url;
            }

            return false;
          }
        }
      });
    } else {
      //PC端 hover可删除
      var $liPC = $("<li class=\"site\" data-item=".concat(i, ">\n                <div class=\"edit\">\n                    <div>\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-close\"></use>\n                        </svg>\n                    </div>\n                </div>\n                <div class=\"logo\">").concat(element.logo, "</div>\n                <div class=\"url\">").concat(formatUrl(element.url), "</div></li>"));
      $liPC.insertBefore($('li.last'));
      $liPC.on('click', function () {
        window.location.href = element.url;
      });
      $liPC.on('click', '.edit', function (e) {
        e.stopPropagation();
        hashMAp.splice(i, 1);
        localStorage.setItem('siteMap', JSON.stringify(hashMAp));
        render();
      });
    }
  });
};

if (hashMAp.length !== 0) {
  render();
}

$('.last').on('click', function () {
  var newUrl = window.prompt('请输入添加的网址');
  console.log(newUrl); // 如果点取消，返回null；未填写返回空

  if (!newUrl || newUrl.length === 0) return;
  var logo = formatUrl(newUrl)[0].toUpperCase();

  if (newUrl.indexOf('http') !== 0) {
    newUrl = 'https://' + newUrl;
  }

  hashMAp.push({
    logo: logo,
    url: newUrl
  });
  localStorage.setItem('siteMap', JSON.stringify(hashMAp));
  render();
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.e5dd0d7c.js.map