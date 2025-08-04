document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // WAI-ARIA属性を更新して、メニューの状態をスクリーンリーダーに伝える
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                navToggle.setAttribute('aria-label', 'メニューを閉じる');
            } else {
                navToggle.setAttribute('aria-label', 'メニューを開く');
            }
        });
    }
});