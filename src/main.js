
let hashMAp = JSON.parse(localStorage.getItem('siteMap') || '[]');
let $liList = $('.siteList');
let isTouchDevice = 'ontouchstart' in document.documentElement; //true 为移动端

function formatUrl(url) {
    let str = url.replace(/^http:\/\//, '').replace(/^https:\/\//, '').replace(/www\./, '')
        .replace(/\/.*/, '')
    return str
}

let render = () => {
    $liList.find('li:not(.last)').remove();
    hashMAp.forEach((element, i) => {

        if (isTouchDevice) {
            let $li = $(`<li class="site" data-item=${i}>
                <div class="mask hide">
                    <button class="delete">删除</button>
                </div>
                <div class="logo">${element.logo}</div>
                <div class="url">${formatUrl(element.url)}</div></li>`);

            $li.insertBefore($('li.last'));
            //长按可删除
            let timeOutEvent = 0;
            $li.on({
                touchstart: function (e) {
                    timeOutEvent = setTimeout(function () {
                        timeOutEvent = 0;
                        let $currentTarget = $(e.currentTarget)
                        $currentTarget.find('.mask').removeClass('hide')
                    }, 500);
                    e.preventDefault();
                },
                touchmove: function () {
                    clearTimeout(timeOutEvent);
                    timeOutEvent = 0;
                },
                touchend: function (e) {
                    clearTimeout(timeOutEvent);
                    let hideMask = true;
                    //处理删除事件
                    if (e.target.className === 'delete') {
                        hideMask = false;
                        e.stopPropagation();
                        hashMAp.splice(i, 1);
                        localStorage.setItem('siteMap', JSON.stringify(hashMAp))
                        render()
                    } else if (e.target.className === 'mask') {
                        // 取消删除
                        $(e.currentTarget).find('.mask').addClass('hide');
                    } else {
                        // 点击事件 跳转
                        if (timeOutEvent != 0) {
                            window.location.href = element.url
                        }
                        return false;
                    }
                }
            })

        } else {
            //PC端 hover可删除
            let $liPC = $(`<li class="site" data-item=${i}>
                <div class="edit">
                    <div>
                        <svg class="icon">
                            <use xlink:href="#icon-close"></use>
                        </svg>
                    </div>
                </div>
                <div class="logo">${element.logo}</div>
                <div class="url">${formatUrl(element.url)}</div></li>`);

            $liPC.insertBefore($('li.last'));
            $liPC.on('click', () => {
                window.location.href = element.url
            })
            $liPC.on('click', '.edit', (e) => {
                e.stopPropagation();
                hashMAp.splice(i, 1);
                localStorage.setItem('siteMap', JSON.stringify(hashMAp))
                render()
            })
        }
    });

}

if (hashMAp.length !== 0) {
    render()
}

$('.last').on('click', () => {
    let newUrl = window.prompt('请输入添加的网址');
    console.log(newUrl)
    // 如果点取消，返回null；未填写返回空
    if (!newUrl || newUrl.length === 0)
        return;
    let logo = formatUrl(newUrl)[0].toUpperCase();
    if (newUrl.indexOf('http') !== 0) {
        newUrl = 'https://' + newUrl
    }
    hashMAp.push({ logo: logo, url: newUrl })
    localStorage.setItem('siteMap', JSON.stringify(hashMAp))
    render()
})

