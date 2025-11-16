   const STORAGE_KEY = 'heyhealth_users_secure';
    
    function safeSaveUsers(users) {
        const stringData = JSON.stringify(users);
        localStorage.setItem(STORAGE_KEY, btoa(stringData)); 
    }

    function safeGetUsers() {
        const encoded = localStorage.getItem(STORAGE_KEY);
        if (!encoded) return [];
        try { return JSON.parse(atob(encoded)); } 
        catch (e) { return []; }
    }

    let lockTimerInterval;

    function getSecurityState() {
        const state = localStorage.getItem('heyhealth_security');
        return state ? JSON.parse(state) : { failedAttempts: 0, lockUntil: null };
    }

    function recordFailedLogin() {
        let state = getSecurityState();
        state.failedAttempts += 1;
        
        if (state.failedAttempts >= 3) {
            state.lockUntil = Date.now() + (30 * 1000); 
        }
        localStorage.setItem('heyhealth_security', JSON.stringify(state));
        checkLockoutStatus();
    }

    function resetSecurityState() {
        localStorage.setItem('heyhealth_security', JSON.stringify({ failedAttempts: 0, lockUntil: null }));
    }

    function checkLockoutStatus() {
        const state = getSecurityState();
        const btn = document.getElementById('login-btn');
        
        if (state.lockUntil && Date.now() < state.lockUntil) {
            const secondsLeft = Math.ceil((state.lockUntil - Date.now()) / 1000);
            btn.disabled = true;
            btn.innerText = `Locked! Wait ${secondsLeft}s`;
            btn.style.background = "#ef4444";
            
            if (!lockTimerInterval) lockTimerInterval = setInterval(checkLockoutStatus, 1000);
        } else {
            btn.disabled = false;
            btn.innerText = "Login";
            btn.style.background = "";
            
            if (lockTimerInterval) { clearInterval(lockTimerInterval); lockTimerInterval = null; }
            if (state.lockUntil && Date.now() > state.lockUntil) resetSecurityState();
        }
    }

// main logic
    window.onload = function() {
        checkSession();
        checkLockoutStatus();
    };

    function handleLogin() {

        const state = getSecurityState();
        if (state.lockUntil && Date.now() < state.lockUntil) return;

        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const pass = document.getElementById('login-pass').value;
        
        showError('login-email-error', false);
        showError('login-pass-error', false);

        const users = safeGetUsers();
        const user = users.find(u => u.email === email);

        if (!user || user.password !== pass) {
            if(!user) showError('login-email-error', true);
            else showError('login-pass-error', true);
            recordFailedLogin();
            return;
        }

        resetSecurityState();
        
        const sessionData = { name: user.name, email: user.email };
        const rememberMe = document.getElementById('remember-me').checked;
        const encodedSession = btoa(JSON.stringify(sessionData));

        if (rememberMe) localStorage.setItem('heyhealth_session', encodedSession);
        else sessionStorage.setItem('heyhealth_session', encodedSession);
        
        showDashboard(sessionData);
    }

    function handleRegister() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const pass = document.getElementById('reg-pass').value;

        if(!name || !email || !pass) { alert("Mohon lengkapi data"); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Format email salah"); return; }

        const users = safeGetUsers();
        if (users.find(u => u.email === email)) { alert("Email sudah terdaftar!"); return; }

        users.push({ name: name, email: email, password: pass });
        safeSaveUsers(users);
        
        alert("Registrasi Berhasil! Silakan Login.");
        switchScreen('login-screen');
    }

    function checkSession() {

// session temp/permanent
        let encodedSession = localStorage.getItem('heyhealth_session') || sessionStorage.getItem('heyhealth_session');
        if (encodedSession) {
            try {
                const session = JSON.parse(atob(encodedSession));
                showDashboard(session);
            } catch(e) { handleLogout(); }
        }
    }

    function showDashboard(userSession) {
        document.getElementById('dash-name').innerText = userSession.name;
        document.getElementById('dash-email').innerText = userSession.email;
        document.getElementById('dash-avatar').innerText = userSession.name.charAt(0).toUpperCase();
        switchScreen('dashboard-screen');
    }

    function handleLogout() {
        localStorage.removeItem('heyhealth_session');
        sessionStorage.removeItem('heyhealth_session');
        switchScreen('login-screen');
    }

//ui utils
    function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        setTimeout(() => document.getElementById(screenId).classList.add('active'), 10);
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        
        if(screenId.includes('login') || screenId.includes('register')) {
            document.querySelectorAll('input').forEach(i => { if(i.type !== 'checkbox') i.value = '' });
            document.getElementById('strength-meter').style.display = 'none';
        }
    }

    function togglePass(id, icon) {
        const inp = document.getElementById(id);
        if(inp.type==='password'){ inp.type='text'; icon.innerText='🚫'; } 
        else { inp.type='password'; icon.innerText='👁️'; }
    }
    
    function showError(id, show) { document.getElementById(id).style.display = show ? 'block' : 'none'; }
    function moveToNext(curr, next) { if(curr.value.length >= 1 && next !== 'final') document.getElementById(next).focus(); }
    
    function checkStrength(p) {
        const meter = document.getElementById('strength-meter');
        const bar = document.getElementById('strength-bar');
        const text = document.getElementById('strength-text');
        meter.style.display = p.length ? 'block' : 'none';
        
        let s = 0;
        if (p.length >= 6) s++;
        if (p.match(/[0-9]+/)) s++;
        if (p.match(/[!@#$%^&*]+/)) s++;
        if (p.length > 10) s++;
        
        const colors = ['var(--danger)', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
        bar.style.width = (s === 0 ? 10 : s * 25) + '%';
        bar.style.backgroundColor = colors[s];
    }

// forgot pw
    let tempEmailForReset = "";
    function handleForgotPassword() {
        const email = document.getElementById('forgot-email').value.trim().toLowerCase();
        const users = safeGetUsers();
        if (!users.find(u => u.email === email)) { showError('forgot-error', true); return; }
        
        tempEmailForReset = email;
        document.getElementById('otp-email-display').innerText = email;
        switchScreen('otp-screen');
    }

    function handleVerifyOTP() {
        const inputs = document.querySelectorAll('.otp-input');
        let otp = ""; inputs.forEach(i => otp += i.value);
        
        if (otp === "12345") {
            switchScreen('reset-screen');
        } else { 
            showError('otp-error', true); 
            inputs.forEach(i => i.value = ''); 
            inputs[0].focus(); 
        }
    }

    function handleNewPassword() {
        const p1 = document.getElementById('new-pass').value;
        const p2 = document.getElementById('confirm-pass').value;
        
        if (p1.length < 6) { alert("Password terlalu lemah"); return; }
        if (p1 !== p2) { showError('reset-error', true); return; }
        
        const users = safeGetUsers();
        const idx = users.findIndex(u => u.email === tempEmailForReset);
        if(idx !== -1) {
            users[idx].password = p1;
            safeSaveUsers(users);
        }
        switchScreen('success-screen');
    }