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

    //toast
    let toastTimer;
    const toastIcons = {
        success: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>`,
        error: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/></svg>`,
        info: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16.5A7 7 0 1 1 17 10a7.008 7.008 0 0 1-7 7Zm-1-4h2v-2H9v2Zm0-4h2V6H9v4Z"/></svg>`
    };

    const toastColors = {
        success: 'bg-green-100 text-green-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700'
    };

    /**
     * @param {string} message
     * @param {('success'|'error'|'info')} type
     */
    function showToast(message, type = 'info') {
        const toast = document.getElementById('global-toast');
        const iconContainer = document.getElementById('toast-icon');
        const messageEl = document.getElementById('toast-message');

        if (!toast || !iconContainer || !messageEl) return;

        if (toastTimer) {
            clearTimeout(toastTimer); 
        }

        messageEl.textContent = message;

        iconContainer.innerHTML = toastIcons[type] || toastIcons['info'];
        iconContainer.className = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg';
        iconContainer.classList.add(...(toastColors[type] || toastColors['info']).split(' '));

        toast.classList.remove('opacity-0', 'translate-x-full');
        toast.classList.add('opacity-100', 'translate-x-0');
        toastTimer = setTimeout(() => {
            hideToast();
        }, 3000);
    }


    function hideToast() {
        const toast = document.getElementById('global-toast');
        if (!toast) return;

        toast.classList.remove('opacity-100', 'translate-x-0');
        toast.classList.add('opacity-0', 'translate-x-full');

        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
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
        
        window.location.href = './index.html';
    }

    function handleRegister() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const pass = document.getElementById('reg-pass').value;

        if(!name || !email || !pass) { showToast("Mohon lengkapi data", "error"); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast("Format email salah", "error"); return; }

        const users = safeGetUsers();
        if (users.find(u => u.email === email)) { showToast("Email sudah terdaftar!", "error"); return; }

        users.push({ name: name, email: email, password: pass });
        safeSaveUsers(users);
        
        showToast("Registrasi Berhasil! Silakan Login.", "success");
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
        document.querySelectorAll(".screen").forEach((el) => el.classList.add("hidden"));
        setTimeout(() => document.getElementById(screenId).classList.remove("hidden"), 10);
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        
        if(screenId.includes('login') || screenId.includes('register')) {
            document.querySelectorAll('input').forEach(i => { if(i.type !== 'checkbox') i.value = '' });
            document.getElementById('strength-meter').style.display = 'none';
            const regText = document.getElementById('strength-text');
            if (regText) {
                regText.textContent = 'Min 6 chars, number & symbol';
                regText.style.color = '';
            }
            document.getElementById('reset-strength-meter').style.display = 'none'; 
            const resetText = document.getElementById('reset-strength-text');
            if (resetText) {
                resetText.textContent = 'Min 6 chars, number & symbol';
                resetText.style.color = '';
            }
        }
    }

    function togglePass(id, el) {
        const input = document.getElementById(id);
        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";

        el.innerHTML = isPassword 
            ? `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.7 21.7 0 015.05-6.92"/>
                <path d="M1 1l22 22"/>
                <path d="M9.53 9.53A3 3 0 0114.47 14.47"/>
            </svg>`
            : `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`;
    }

    function showError(id, show) { document.getElementById(id).style.display = show ? 'block' : 'none'; }
    function moveToNext(curr, next) { if(curr.value.length >= 1 && next !== 'final') document.getElementById(next).focus(); }
    
function checkStrength(p) {
        const meter = document.getElementById('strength-meter');
        const bar = document.getElementById('strength-bar');
        const text = document.getElementById('strength-text');
        const colors = ['var(--danger)', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
        const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        if (p.length === 0) {
            meter.style.display = 'none';
            text.textContent = 'Min 6 chars, number & symbol';
            text.style.color = '';
            return;
        }

        meter.style.display = 'block';
        
        let s = 0;
        if (p.length >= 6) s++;
        if (p.match(/[0-9]+/)) s++;
        if (p.match(/[!@#$%^&*]+/)) s++;
        if (p.length > 10) s++;
        
        bar.style.width = (s === 0 ? 10 : s * 25) + '%';
        bar.style.backgroundColor = colors[s];
        
        text.textContent = strengthText[s];
        text.style.color = colors[s];
    }
function checkResetStrength(p) {
        const meter = document.getElementById('reset-strength-meter');
        const bar = document.getElementById('reset-strength-bar');
        const text = document.getElementById('reset-strength-text');
        const colors = ['var(--danger)', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
        const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        if (p.length === 0) {
            meter.style.display = 'none';
            text.textContent = 'Min 6 chars, number & symbol';
            text.style.color = '';
            return;
        }

        meter.style.display = 'block';
        
        let s = 0;
        if (p.length >= 6) s++;
        if (p.match(/[0-9]+/)) s++;
        if (p.match(/[!@#$%^&*]+/)) s++;
        if (p.length > 10) s++;
        
        bar.style.width = (s === 0 ? 10 : s * 25) + '%';
        bar.style.backgroundColor = colors[s];
        
        text.textContent = strengthText[s];
        text.style.color = colors[s];
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
        const verifyBtn = document.getElementById("verifyBtn");
        let otp = "";
        inputs.forEach((i) => (otp += i.value));

        if (otp === "12345") {
          verifyBtn.classList.remove("bg-blue-600");
          verifyBtn.classList.add("bg-[#E8F0FE]");
          verifyBtn.classList.remove("text-white");
          verifyBtn.classList.add("text-blue-600");
          setTimeout(() => {
            switchScreen("reset-screen");
          }, 1000);
        } else {
          showError("otp-error", true);
          inputs.forEach((i) => (i.value = ""));
          inputs[0].focus();
        }
    }

    function handleNewPassword() {
        const p1 = document.getElementById('new-pass').value;
        const p2 = document.getElementById('confirm-pass').value;
        
        if (p1.length < 6) { showToast("Password terlalu lemah", "error"); return; }
        if (p1 !== p2) { showError('reset-error', true); return; }
        
        const users = safeGetUsers();
        const idx = users.findIndex(u => u.email === tempEmailForReset);
        if(idx !== -1) {
            users[idx].password = p1;
            safeSaveUsers(users);
        }
        switchScreen('success-screen');
    }