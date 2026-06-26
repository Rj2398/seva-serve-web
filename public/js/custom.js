// =======================================================
// 1. COST DROPDOWNS (Rewritten with safe delegation)
// =======================================================
document.addEventListener("click", function (e) {
    // Booking Tracking Additional Services Cost dropdown
    const toggleBtn = e.target.closest(".dropdown-toggle-cost");
    if (toggleBtn) {
        const dropdown = document.getElementById("costDropdown");
        if (dropdown) {
            const icon = toggleBtn.querySelector("img");
            if (dropdown.style.display === "block") {
                dropdown.style.display = "none";
                if (icon) icon.classList.remove("rotate");
            } else {
                dropdown.style.display = "block";
                if (icon) icon.classList.add("rotate");
            }
        }
    }
});

// Inner Nested Materials Dropdown
function toggleMaterialDropdown(element) {
    const menu = element.parentElement.querySelector(".nested-dropdown-menu");
    const icon = element.querySelector("img");

    if (menu.style.display === "block") {
        menu.style.display = "none";
        if (icon) icon.classList.remove("rotate");
    } else {
        menu.style.display = "block";
        if (icon) icon.classList.add("rotate");
    }
}

// =======================================================
// 2. JQUERY DOCUMENT HANDLERS (Delegated for SPA)
// =======================================================
$(document).ready(function () {
    
    // Service Issues Tab / Checkbox Slide Effect
    $(document).on('change', '.tab-check', function () {
        let parent = $(this).closest('.service-issues-in');
        let content = parent.find('.service-issues-content');

        if ($(this).is(':checked')) {
            parent.addClass('active');
            content.stop(true, true).slideDown('fast');
        } else {
            parent.removeClass('active');
            content.stop(true, true).slideUp('fast');
        }
    });

    // Home My Quotes: More / Less Service Toggles
    $(document).on('click', '.service-list-type .more-service', function () {
        let parent = $(this).closest('.service-list-type');
        parent.find('.service-data').show();
        parent.find('.more-service').hide();
        parent.find('.less-service').css('display', 'list-item');
    });

    $(document).on('click', '.service-list-type .less-service', function () {
        let parent = $(this).closest('.service-list-type');
        parent.find('.service-data').hide();
        parent.find('.more-service').css('display', 'list-item');
        parent.find('.less-service').hide();
    });

    // Home Page: Additional Services Dropdown Slide Effect
    // $(document).on('click', '.additional-text', function () {
    //     $(this).next(".service-list").slideToggle(300);
    //     $(this).find("img").toggleClass("rotate");
    // });

    // ==========================================
// Home Additional Services List Toggle (FIXED)
// ==========================================
$(document).ready(function() {
    
    // The '.off('click')' clears out duplicate memory listeners before binding a new one!
    $(document).off('click', '.additional-text').on('click', '.additional-text', function () {
        
        // UL toggle with slide effect
        $(this).next(".service-list").stop(true, true).slideToggle(300);

        // Icon rotate
        $(this).find("img").toggleClass("rotate");
    });

});

    // Verification Code / OTP Inputs Focus management
    $(document).on('keyup.verify', '.inputs', function () {
        if (this.value.length === this.maxLength) {
            $(this).next('.inputs').focus();
        } else if (this.value.length === 0) {
            $(this).prev('.inputs').focus();
        }
    });
});

// NOTE: The sliders (.hero-slider, .upcoming-slider, etc.) and the 
// responsive hamburger click tracking have been completely moved 
// to your React files to handle Next.js client transitions natively!