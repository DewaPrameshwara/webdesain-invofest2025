window.addEventListener('load', () => {
        const loader = document.getElementById('global-loader');
        
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            
            document.body.style.overflow = 'auto';
            
            loader.addEventListener('transitionend', () => {
                if(loader.parentNode) {
                    document.body.removeChild(loader);
                }
            });
        }, 800); 
    });