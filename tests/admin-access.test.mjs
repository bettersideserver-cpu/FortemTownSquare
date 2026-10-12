import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html = readFileSync(new URL('../map/IPX/admin/login.html', import.meta.url), 'utf8');
const source = readFileSync(new URL('../map/IPX/admin/js/auth.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/, '').replaceAll('location.href', 'window.redirectTo');

async function page(t, getSession) {
    const dom = new JSDOM(html, { url: 'https://example.test/admin/login.html', runScripts: 'outside-only' });
    t.after(() => dom.window.close());
    dom.window.supabase = { auth: { getSession } };
    dom.window.eval(source);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(dom.window.document.querySelector('form, input, textarea'), null);
    return dom.window;
}

test('Removing login forms does not grant anonymous access to the dashboard', async t => {
    const window = await page(t, async () => ({ data: { session: null } }));
    assert.equal(window.redirectTo, undefined);
    assert.match(window.document.getElementById('msg').textContent, /session is required/);
});
test('An existing administrator session still opens the dashboard', async t => {
    const window = await page(t, async () => ({ data: { session: { user: { id: 'admin' } } } }));
    assert.equal(window.redirectTo, 'index.html');
});
test('An authentication service failure never opens the dashboard', async t => {
    const window = await page(t, async () => { throw new Error('offline'); });
    assert.equal(window.redirectTo, undefined);
    assert.match(window.document.getElementById('msg').textContent, /Unable to verify/);
});
