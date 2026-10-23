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
    dom.window.supabase = getSession ? { auth: { getSession } } : null;
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

test('A disconnected admin shows configuration instructions without opening the dashboard', async t => {
    const window = await page(t, null);
    assert.equal(window.redirectTo, undefined);
    assert.match(window.document.getElementById('msg').textContent, /Supabase is disconnected/);
    assert.match(window.document.getElementById('msg').textContent, /admin\/js\/config.js/);
});

test('Empty connection settings do not load the SDK or create a client', async () => {
    const config = readFileSync(new URL('../map/IPX/admin/js/config.js', import.meta.url), 'utf8');
    const configUrl = 'data:text/javascript;base64,' + Buffer.from(config).toString('base64');
    const client = readFileSync(new URL('../map/IPX/admin/js/supabase.js', import.meta.url), 'utf8')
        .replace("'./config.js'", JSON.stringify(configUrl));
    const module = await import('data:text/javascript;base64,' + Buffer.from(client).toString('base64'));
    assert.equal(module.supabase, null);
});

test('A disconnected dashboard redirects without querying data or starting refresh timers', async t => {
    const dashboardHtml = readFileSync(new URL('../map/IPX/admin/index.html', import.meta.url), 'utf8');
    const dom = new JSDOM(dashboardHtml, { url: 'https://example.test/admin/index.html', runScripts: 'outside-only' });
    t.after(() => dom.window.close());
    dom.window.supabase = null;
    dom.window.initVisitorDetails = () => assert.fail('Disconnected visitor details must not initialize');
    dom.window.setInterval = () => assert.fail('Disconnected dashboard must not poll');
    const dashboard = readFileSync(new URL('../map/IPX/admin/js/dashboard.js', import.meta.url), 'utf8')
        .replace(/^import .*;\r?\n/gm, '').replaceAll('location.href', 'window.redirectTo');
    dom.window.eval(dashboard);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(dom.window.redirectTo, 'login.html');
});
