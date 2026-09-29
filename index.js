(function () {
    'use strict';

    const ctx = SillyTavern.getContext();
    const { messageFormatter } = ctx;

    const esc = (s) => String(s ?? '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');

    function parse(raw) {
        const m = raw.match(/<twitter>\s*POSTER:\s*([^\r\n]*)\s*HANDLE:\s*([^\r\n]*)\s*TEXT:\s*([\s\S]*?)\s*COMMENT1:\s*([^\r\n]*)\s*HANDLE1:\s*([^\r\n]*)\s*TEXT1:\s*([\s\S]*?)\s*COMMENT2:\s*([^\r\n]*)\s*HANDLE2:\s*([^\r\n]*)\s*TEXT2:\s*([\s\S]*?)\s*COMMENT3:\s*([^\r\n]*)\s*HANDLE3:\s*([^\r\n]*)\s*TEXT3:\s*([\s\S]*?)\s*LIKES:\s*([^\r\n]*)\s*REPLIES:\s*([^\r\n]*)\s*TIME:\s*([^\r\n]*)\s*<\/twitter>/i);
        if (!m) return null;
        return {p:m[1],h:m[2],t:m[3],c1:m[4],h1:m[5],t1:m[6],c2:m[7],h2:m[8],t2:m[9],c3:m[10],h3:m[11],t3:m[12],l:m[13],r:m[14],time:m[15]};
    }

    function comment(n,h,t) {
        return `<div class="tc-comment"><div class="tc-mini">•</div><div><b>${esc(n)}</b> <span>${esc(h)}</span><p>${esc(t).replace(/\n/g,'<br>')}</p></div></div>`;
    }

    function card(d) {
        return `<div class="tc-card">
          <div class="tc-head"><div class="tc-avatar">𝕏</div><div class="tc-user"><b>${esc(d.p)}</b><span>${esc(d.h)}</span></div><div class="tc-more">•••</div></div>
          <div class="tc-text">${esc(d.t).replace(/\n/g,'<br>')}</div>
          <div class="tc-actions"><span>♡</span><span>💬</span><span>🔁</span><span>↗</span></div>
          <div class="tc-stats">${esc(d.l)} Likes · ${esc(d.r)} Replies</div>
          ${comment(d.c1,d.h1,d.t1)}${comment(d.c2,d.h2,d.t2)}${comment(d.c3,d.h3,d.t3)}
          <div class="tc-time">${esc(d.time)}</div>
        </div>`;
    }

    messageFormatter.addHook((mes) => {
        const d = parse(mes);
        if (!d) return mes;
        return mes.replace(/<twitter>[\s\S]*?<\/twitter>/i, card(d));
    }, { stage: messageFormatter.stage.AFTER_MARKDOWN, order: messageFormatter.order.LATE });

    console.log('[Twitter Card Renderer] loaded');
})();