document.addEventListener('DOMContentLoaded', function() {
    const scroll_x = document.querySelector('.scroll-x');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    let isScrolling = false;
    
    // Function to update navigation
    function updateNav(index) {
        // Update header links
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[index].classList.add('active');
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
    }
    
    // Detect which section is currently viewed
    function getCurrentSection() {
        const containerScroll = scroll_x.scrollLeft;
        const windowWidth = window.innerWidth;
        
        return Math.round(containerScroll / windowWidth);
    }
    
    // Scroll to specific section
    function scrollToSection(index) {
        isScrolling = true;
        
        scroll_x.scrollTo({
            left: index * window.innerWidth,
            behavior: 'smooth'
        });
        
        updateNav(index);
        
        // Reset isScrolling after animation completes
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
    
    // Handle wheel event (convert vertical scroll to horizontal)
    document.addEventListener('wheel', function(e) {
        if (window.innerWidth <= 768) return;

        e.preventDefault();
        
        if (isScrolling) return;
        
        // Determine direction
        if (e.deltaY > 0 && currentIndex < sections.length - 1) {
            // Scroll right (next section)
            scrollToSection(currentIndex + 1);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            // Scroll left (previous section)
            scrollToSection(currentIndex - 1);
        }
    }, { passive: false });
    
    // Handle click on navigation links
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(index);
        });
    });
    
    // Handle click on dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            scrollToSection(index);
        });
    });
    
    // Handle scroll event to update navigation
    scroll_x.addEventListener('scroll', function() {
        if (!isScrolling) {
            const index = getCurrentSection();
            if (index !== currentIndex) {
                updateNav(index);
            }
        }
    });

    const languageButtons = document.querySelectorAll(".language-btn");
    const projectsContainer = document.querySelector(".projects-container");
    const projectCards = document.querySelectorAll(".project-card");

    // Function to duplicate project cards for seamless scrolling
    function duplicateProjects() {
        projectsContainer.innerHTML = ""; // Clear container

        // Append original set of project cards twice to create looping effect
        const allCards = [...projectCards, ...projectCards];
        allCards.forEach((card) => {
            const clone = card.cloneNode(true);
            projectsContainer.appendChild(clone);
        });

        updateScrolling();
    }

    // Function to filter and display projects
    function updateProjectsContainer(language) {
        projectsContainer.innerHTML = ""; // Clear existing projects

        // Filter projects based on selected language
        let filteredCards = [];
        projectCards.forEach((card) => {
            if (language === "all" || card.getAttribute("data-category") === language) {
                filteredCards.push(card.cloneNode(true));
            }
        });

        // Ensure continuous scrolling effect
        if (filteredCards.length > 0) {
            filteredCards = [...filteredCards, ...filteredCards]; // Duplicate for seamless looping
        }

        // Append filtered cards
        filteredCards.forEach((card) => projectsContainer.appendChild(card));

        updateScrolling();
    }

    // Function to adjust scrolling animation based on content width
    function updateScrolling() {
        let totalWidth = 0;
        projectsContainer.querySelectorAll(".project-card").forEach((card) => {
            totalWidth += card.offsetWidth + 32; // Account for gap (2rem)
        });

        if (totalWidth > projectsContainer.parentElement.offsetWidth) {
            projectsContainer.style.animation = "scrollProjects 10s linear infinite";
        } else {
            projectsContainer.style.animation = "none";
            projectsContainer.style.transform = "translateX(0)";
        }
    }

    // Event Listeners for Language Buttons
    languageButtons.forEach((button) => {
        button.addEventListener("click", function () {
            languageButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");

            const language = this.getAttribute("data-language");
            updateProjectsContainer(language);
        });
    });

    // Initial setup to show all projects and enable scrolling
    duplicateProjects();

    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCategories = document.querySelectorAll('.skills-category');
    
    skillTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            skillTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all skill categories
            skillCategories.forEach(category => {
                category.classList.remove('active');
            });
            
            // Show the selected category
            const categoryToShow = this.getAttribute('data-category');
            document.getElementById(`${categoryToShow}-skills`).classList.add('active');
        });
    });
    
    // Update on window resize
    window.addEventListener('resize', function() {
        scrollToSection(currentIndex);
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;
        
        if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            scrollToSection(currentIndex - 1);
        }
    });

    // To pause the animation while hovering the projects-outer-container
    document.querySelector(".projects-outer-container").addEventListener("mouseenter", function () {
        projectsContainer.style.animationPlayState = "paused";
    });

    document.querySelector(".projects-outer-container").addEventListener("mouseleave", function () {
        projectsContainer.style.animationPlayState = "running";
    });
});