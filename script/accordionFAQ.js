document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('[data-accordion-header]');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const contentId = header.getAttribute('aria-controls');
            const content = document.getElementById(contentId);
            const icon = header.querySelector('[data-accordion-icon]');
            const parent = header.closest('div'); 

            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.classList.remove('max-h-[1000px]');
                content.classList.add('max-h-0');
                icon.classList.remove('rotate-180');
            } else {
                closeAllAccordions(headers);
                header.setAttribute('aria-expanded', 'true');
                content.classList.remove('max-h-0');
                content.classList.add('max-h-[1000px]');
                icon.classList.add('rotate-180');
            }
        });
    });

    function closeAllAccordions(allHeaders) {
        allHeaders.forEach(h => {
            h.setAttribute('aria-expanded', 'false');
            
            const contentId = h.getAttribute('aria-controls');
            const content = document.getElementById(contentId);
            const icon = h.querySelector('[data-accordion-icon]');

            content.classList.remove('grid-rows-[1fr]');
            content.classList.add('grid-rows-[0fr]');
            
            icon.classList.remove('rotate-180');
        });
    }
});