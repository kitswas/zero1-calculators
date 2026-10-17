/*
 * Shared site chrome + calculator registry.
 * To add a calculator: add one entry to CALCULATORS and create calculators/<id>.html.
 * Pages include: <script src="../assets/site.js"></script> in <head>, plus
 * <div id="site-header"></div> and <div id="site-footer"></div> placeholders
 * (the landing page sets <body data-no-header>).
 */
(function () {
    const root = new URL('../', document.currentScript.src).href;

    const CALCULATORS = [
        {
            id: 'inflation', icon: '📊', title: 'Inflation', file: 'Zero1 Inflation',
            desc: 'Measure your personal inflation, project expenses year by year, and see what a goal really costs.',
            sheets: ['My Inflation', 'Year by Year', 'Goal'],
            keywords: 'personal inflation basket cpi prices projection goal cost future expenses'
        },
        {
            id: 'child', icon: '👶', title: 'Can You Afford a Child?', file: 'Zero1 Can You Afford a Child _',
            desc: 'Estimate birth, early years, education, coaching and healthcare costs up to age 18.',
            sheets: ['How To Use', 'Your Profile', 'Birth Cost', 'First 3 Years', 'Education 3-18', 'Coaching & Tuition', 'Healthcare 0-18', 'Total Summary'],
            keywords: 'child baby kid parenting birth education school tuition coaching healthcare'
        },
        {
            id: 'flat-vs-plot', icon: '🏠', title: 'Flat vs Plot', file: 'Zero1 Flat vs Plot',
            desc: 'Compare buying a flat to live in against buying a plot and building on it.',
            sheets: ['Flat for Consumption', 'Plot + Construction'],
            keywords: 'flat apartment plot land construction build house home loan emi buy property real estate mortgage appreciation maintenance stamp duty registration architect'
        }
    ].map(c => Object.assign(c, {
        href: root + 'calculators/' + c.id + '.html',
        download: root + 'templates/' + encodeURIComponent(c.file) + '.ods'
    }));

    window.ZERO1 = { root, calculators: CALCULATORS };

    const isCurrent = c => new URL(c.href).pathname === location.pathname;

    function headerHTML() {
        const items = CALCULATORS.map(c => `
            <a href="${c.href}" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zero1-50 ${isCurrent(c) ? 'font-bold text-zero1-600' : 'text-slate-700'}">
                <span>${c.icon}</span><span>${c.title}</span>
            </a>`).join('');
        return `
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div class="flex items-center space-x-3">
                <a href="${root}" title="All calculators"><img src="${root}assets/zero1-logo.jpg" alt="Zero1" class="h-12 w-auto"></a>
                <div class="flex flex-col border-l border-slate-200 pl-3">
                    <span class="text-xs uppercase tracking-wider text-slate-900 font-bold">Zero1 Calculators</span>
                    <span class="text-[10px] text-slate-400 font-medium">by Zerodha</span>
                </div>
            </div>
            <nav class="flex items-center gap-2 text-sm font-semibold">
                <a href="${root}" class="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900">All calculators</a>
                <details class="relative">
                    <summary class="list-none cursor-pointer px-4 py-2 rounded-xl bg-zero1-50 text-zero1-600 select-none">Jump to ▾</summary>
                    <div class="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-lg py-2 z-50">${items}</div>
                </details>
            </nav>
        </div>`;
    }

    function footerHTML() {
        const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener" class="text-zero1-600 hover:underline font-semibold">${text}</a>`;
        return `
        <div class="max-w-3xl mx-auto space-y-3 px-4">
            <p class="font-bold text-slate-700">Zero1 by Zerodha</p>
            <p>Making money &amp; wealth part of pop culture. A LearnApp × Zerodha joint venture, building a financial media network to help India's zero-to-one money journey.</p>
            <p class="space-x-3">
                ${link('https://www.youtube.com/@Zero1byZerodha', 'YouTube')}
                ${link('https://www.youtube.com/@Zero1hustle', 'Zero1 Hustle')}
                ${link('https://www.youtube.com/@Zero1Hindi', 'Zero1 Hindi')}
                ${link('https://www.instagram.com/zero1byzerodha/', 'Instagram')}
            </p>
            <p>Demo project. Illustrative only, not financial advice — consult a registered financial advisor for your long-term planning.</p>
        </div>`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.body.hasAttribute('data-no-header')) {
            const ph = document.getElementById('site-header');
            if (ph) {
                const h = document.createElement('header');
                h.id = 'site-header';
                // fixed 73px so page sub-navbars can stick at top-[73px]
                h.className = 'bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-3 shadow-sm';
                h.innerHTML = headerHTML();
                ph.replaceWith(h);
            }
        }
        const fph = document.getElementById('site-footer');
        if (fph) {
            const f = document.createElement('footer');
            f.id = 'site-footer';
            f.className = 'bg-white border-t border-slate-200 text-slate-500 py-8 text-center text-xs mt-16 space-y-2';
            f.innerHTML = footerHTML();
            fph.replaceWith(f);
        }
    });
})();
