<?= shared_fragment('footer') ?>
<!-- Start of LiveChat (www.livechat.com) code -->
<script>
    window.__lc = window.__lc || {};
    window.__lc.license = 19516780;
    window.__lc.integration_name = "manual_channels";
    window.__lc.product_name = "livechat";
    ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
</script>
<noscript><a href="https://www.livechat.com/chat-with/19516780/" rel="nofollow">Chat with us</a>, powered by <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a></noscript>
<script>
    (function waitForLC() {
        if (window.LiveChatWidget && window.LiveChatWidget.on) {
            window.LiveChatWidget.on('ready', function () {
                window.LiveChatWidget.call('set_session_variables', {
                    current_page: window.location.pathname
                });
            });
            window.LiveChatWidget.on('new_event', function (event) {
                if (["message", "rich_message", "file"].indexOf(event.type) !== -1) {
                    window.LiveChatWidget.call("maximize");
                }
            });
        } else {
            setTimeout(waitForLC, 200);
        }
    })();
</script>
<!-- End of LiveChat code -->
<script src="<?= e(asset('js/jquery.min.js')) ?>" defer></script>
<script src="<?= e(asset('js/bootstrap.bundle.min.js')) ?>" defer></script>
<script src="<?= e(asset('js/slick.min.js')) ?>" defer></script>
<script src="<?= e(asset('js/app.js')) ?>" defer></script>
<script src="<?= e(asset('js/main.js?v=20260903')) ?>" defer></script>
</body>
</html>
