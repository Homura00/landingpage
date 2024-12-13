document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-toggle-icon');

    // Theme Toggle with animation
    function setTheme(isDark) {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = isDark ? 'dark' : 'light';
        
        if (currentTheme !== newTheme) {
            // Add transition class
            root.classList.add('theme-transition');
            
            // Update theme
            root.setAttribute('data-theme', newTheme);
            themeIcon.style.transform = 'rotate(180deg)';
            
            // Update icon with transition
            setTimeout(() => {
                themeIcon.textContent = isDark ? '🌙' : '☀️';
                themeIcon.style.transform = 'rotate(0)';
            }, 150);
            
            // Store preference
            localStorage.setItem('theme', newTheme);
            
            // Remove transition class
            setTimeout(() => {
                root.classList.remove('theme-transition');
            }, 300);
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }

    // Theme toggle click handler with debounce
    let themeToggleTimeout;
    themeToggle.addEventListener('click', () => {
        if (!themeToggleTimeout) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setTheme(!isDark);
            
            // Prevent rapid toggling
            themeToggleTimeout = setTimeout(() => {
                themeToggleTimeout = null;
            }, 300);
        }
    });

    // Formatação do telefone
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Sempre mantém o +55
        if (!value.startsWith('55')) {
            value = '55' + value;
        }
        
        // Formata o número
        if (value.length <= 12) { // Número fixo
            value = value.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4');
        } else { // Celular
            value = value.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
        }
        e.target.value = value;
    });

    // Validação de email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    emailInput.addEventListener('blur', function(e) {
        if (!isValidEmail(e.target.value)) {
            emailInput.style.borderColor = '#ef4444';
            if (!document.querySelector('.email-error')) {
                const errorMsg = document.createElement('span');
                errorMsg.className = 'email-error';
                errorMsg.style.color = '#ef4444';
                errorMsg.style.fontSize = '0.8rem';
                errorMsg.textContent = 'Por favor, insira um email válido';
                emailInput.parentNode.appendChild(errorMsg);
            }
        } else {
            emailInput.style.borderColor = '#10b981';
            const errorMsg = document.querySelector('.email-error');
            if (errorMsg) errorMsg.remove();
        }
    });

    // Form submission animation
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.button-text');
        
        // Disable button and show loading state
        submitButton.disabled = true;
        buttonText.textContent = 'Enviando...';
        submitButton.classList.add('loading');
        
        try {
            const name = document.getElementById('name').value;
            const email = emailInput.value;
            const phone = phoneInput.value;

            if (!isValidEmail(email)) {
                alert('Por favor, insira um email válido');
                return;
            }

            if (phone.length < 19) { // +55 (XX) XXXXX-XXXX
                alert('Por favor, insira um número de telefone válido');
                return;
            }

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success state
            buttonText.textContent = 'Enviado com Sucesso!';
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                submitButton.disabled = false;
                buttonText.textContent = 'Receber Contato';
                submitButton.classList.remove('success');
            }, 2000);
            
        } catch (error) {
            // Show error state
            buttonText.textContent = 'Erro ao enviar. Tente novamente.';
            submitButton.classList.remove('loading');
            submitButton.classList.add('error');
            
            // Reset button after delay
            setTimeout(() => {
                submitButton.disabled = false;
                buttonText.textContent = 'Receber Contato';
                submitButton.classList.remove('error');
            }, 3000);
        }
    });

    // Inicializa o campo de telefone com +55
    if (!phoneInput.value) {
        phoneInput.value = '+55 ';
    }
});
