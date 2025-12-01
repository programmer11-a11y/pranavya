jQuery(document).ready(function () {

  // ===== Marquee (Quotes) Js ===== //
  // Duplicate marquee content for a seamless loop and add hover/touch pause
  jQuery('.marquee').each(function () {
    var $this = jQuery(this);
    var $content = $this.children();
    if (!$this.data('duplicated')) {
      while ($this.width() < jQuery(window).width() * 2) {
        $this.append($content.clone());
      }
      $this.data('duplicated', true);
    }
  });




  // ===== Mega Iitem Js ===== //
  // Full jQuery with FIX-B (Web Animations API + CSS fallback)

  // ===== Mega Iitem Js ===== //
  jQuery(document).ready(function () {

    /* ============================================================
       GLOBAL ELEMENTS
    ============================================================ */
    const body = jQuery("body");
    const sidebar = jQuery("#mainmenu");
    const hamburger = jQuery(".nav-right .hamburger-btn");
    const overlay = jQuery(".bg_body_box");   // FINAL OVERLAY


    /* ============================================================
       OVERLAY FUNCTIONS
    ============================================================ */
    function showOverlay() {
      overlay.removeClass("hidden")
        .css("display", "block")
        .hide()
        .fadeIn(200);
    }

    function hideOverlay() {
      overlay.fadeOut(200, function () {
        overlay.addClass("hidden").css("display", "none");
      });
    }


    /* ============================================================
       MOBILE SIDEBAR OPEN/CLOSE
    ============================================================ */

    // OPEN SIDEBAR
    hamburger.on("click", function () {
      sidebar.addClass("active");
      body.addClass("overflow-hidden");
      showOverlay();
      jQuery("#mainmenu .menu_link_text")
        .addClass("text-thunder-100")
        .removeClass("text-white");
    });

    // CLOSE SIDEBAR BY CLICKING OVERLAY
    overlay.on("click", function () {
      sidebar.removeClass("active in-submenu");
      body.removeClass("overflow-hidden");
      hideOverlay();

      jQuery("#mainmenu .has-mega").removeClass("mobile-open");
      jQuery("#mainmenu .mega-panel").slideUp(0);
    });


    /* ============================================================
       DESKTOP MEGA MENU
    ============================================================ */

    function initDesktopMenu() {
      if (jQuery(window).width() < 1131) return;

      jQuery("#mainmenu .has-mega").each(function () {
        const item = jQuery(this);

        item.off("mouseenter mouseleave");
        item.find(".mega-panel").off("mouseenter mouseleave");

        item.on("mouseenter", function () {
          clearTimeout(item.data('closeTimer')); // clear any pending close
          item.addClass("mega-open");
          item.find(".mega-panel").stop(true, true).fadeIn(160);
          $(".bg_body_box").removeClass("hidden").fadeIn(200);
        });

        item.on("mouseleave", function () {
          item.data('closeTimer', setTimeout(function() {
            item.removeClass("mega-open");
            item.find(".mega-panel").stop(true, true).fadeOut(150);
            $(".bg_body_box").fadeOut(200, function () {
              $(this).addClass("hidden");
            });
          }, 0)); // 0ms delay
        });

        item.find(".mega-panel").on("mouseenter", function() {
          clearTimeout(item.data('closeTimer'));
        });

        item.find(".mega-panel").on("mouseleave", function() {
          item.data('closeTimer', setTimeout(function() {
            item.removeClass("mega-open");
            item.find(".mega-panel").stop(true, true).fadeOut(150);
            $(".bg_body_box").fadeOut(200, function () {
              $(this).addClass("hidden");
            });
          }, 0));
        });
      });
    }

    initDesktopMenu();



    /* ============================================================
       MOBILE STEP SUBMENU (FIX-B)
    ============================================================ */

    function initMobileMenu() {

      jQuery(document).off("click.mobileMenu click.mobileBackBtn");

      if (jQuery(window).width() >= 1131) return;

      // OPEN SUBMENU
      jQuery(document).on("click.mobileMenu", "#mainmenu .has-mega > a", function (e) {
        e.preventDefault();

        const wrap = jQuery(this).closest(".has-mega");
        const panel = wrap.find(".mega-panel").first();

        jQuery("#mainmenu .has-mega").not(wrap)
          .removeClass("mobile-open")
          .find(".mega-panel")
          .removeClass("mobile-step in")
          .hide();

        wrap.addClass("mobile-open");

        panel.show(0).addClass("mobile-step").removeClass("in");

        // Animation: left → right
        if (panel[0] && panel[0].animate) {
          const anim = panel[0].animate(
            [
              { transform: 'translateX(-110%)' },
              { transform: 'translateX(0)' }
            ],
            { duration: 260, easing: 'ease', fill: 'forwards' }
          );
          anim.onfinish = function () {
            panel.addClass('in').css('transform', 'translateX(0)');
          };
        }

        jQuery("#mainmenu").addClass("in-submenu");

        // Add Back Button
        if (!panel.find(".mobile-back-btn").length) {
          panel.prepend(`
            <div class="px-4">
          <button class="mobile-back-btn w-full text-left py-3 border-b text-thunder-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6.56385 12.2344L1.33008 7.0006L6.56385 1.76683M2.05699 7.0006L12.6699 7.0006"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </button>
          </div>
        `);
        }
      });

      // CLOSE SUBMENU
      jQuery(document).on("click.mobileBackBtn", ".mobile-back-btn", function () {
        const panel = jQuery(this).closest(".mega-panel");
        const wrap = panel.closest(".has-mega");

        if (panel[0] && panel[0].animate) {
          const anim = panel[0].animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(-110%)' }
            ],
            { duration: 220, easing: 'ease', fill: 'forwards' }
          );
          anim.onfinish = function () {
            panel.removeClass('mobile-step in').hide().css('transform', '');
          };
        }

        wrap.removeClass("mobile-open");

        if (!jQuery("#mainmenu .has-mega.mobile-open").length) {
          jQuery("#mainmenu").removeClass("in-submenu");
        }
      });
    }

    initMobileMenu();



    /* ============================================================
       WINDOW RESIZE RESET
    ============================================================ */

    jQuery(window).on("resize", function () {

      if (jQuery(window).width() >= 1131) {
        sidebar.removeClass("active in-submenu");
        jQuery("#mainmenu .mega-panel").removeAttr("style");
        jQuery("#mainmenu .has-mega").removeClass("mobile-open");
        hideOverlay();
        body.removeClass("overflow-hidden");
      }

      initDesktopMenu();
      initMobileMenu();
    });



    /* ============================================================
       SEARCH BAR OVERLAY
    ============================================================ */

    jQuery(".site-search__open").click(function () {
      showOverlay();
      jQuery('#nav-site-search').addClass("open");

      setTimeout(() => {
        jQuery('#nav-site-search').addClass("search_bar");
      }, 300);
    });

    jQuery(".site-search__close").click(function () {
      jQuery('#nav-site-search').removeClass("search_bar");
      hideOverlay();

      setTimeout(() => {
        jQuery('#nav-site-search').removeClass("open");
      }, 300);
    });

    jQuery(document).click(function (event) {
      if (!jQuery(event.target).closest('#nav-site-search, .site-search__open').length) {
        jQuery('#nav-site-search').removeClass("search_bar");
        hideOverlay();
        setTimeout(() => {
          jQuery('#nav-site-search').removeClass("open");
        }, 300);
      }
    });
    /* ============================================================
       HEADER SCROLL — FIX LOGO + ICON COLOR TOGGLING
    ============================================================ */

    const header = jQuery(".header_style_1");
    const siteLogo = header.find(".site-logo img").first();
    // const asideLogo = jQuery("#mainmenu").find("img").first();

    const WHITE_LOGO = "./image/main-logo-white.svg";
    const BLACK_LOGO = "./image/main-logo-black.svg";

    const ICON_SELECTORS =
      ".menu_link_text, .site-search__open, button[name='mobile-menu-view'], .header_style_1 svg";

    function applyScrolledState() {

      const scrolled = jQuery(window).scrollTop() > 10;
      const megaOpen = jQuery(".mega-panel:visible").length > 0;
      const sidebarOpen = jQuery("#mainmenu").hasClass("active");

      const siteLogo = jQuery(".site-logo img").first();
      const mobileLogo = jQuery("#mainmenu > div img").first();

      const WHITE_LOGO = "image/main-logo-white.svg";
      const BLACK_LOGO = "image/main-logo-black.svg";

      // 🔥 Condition for black UI
      const useBlack = scrolled || megaOpen || sidebarOpen;

      if (useBlack) {
        // LOGO
        siteLogo.attr("src", BLACK_LOGO);

        // TEXT + ICONS → BLACK
        jQuery(".menu_link_text, .site-search__open, .header_style_1 .nav-icon")
          .removeClass("text-white")
          .addClass("text-black-100");

        // Header BG
        jQuery(".header_style_1").addClass("bg-white");

      } else {
        // LOGO
        siteLogo.attr("src", WHITE_LOGO);

        // TEXT + ICONS → WHITE
        jQuery(".menu_link_text, .site-search__open, .header_style_1 .nav-icon")
          .removeClass("text-black-100")
          .addClass("text-white");

        // Header BG
        jQuery(".header_style_1").removeClass("bg-white");
      }


      // 🔥 If page is scrolled → also activate scrolled header UI
      if (scrolled) {
        jQuery(".header_style_1").addClass("header-scrolled");
        jQuery("header").addClass("header-wrapper-scrolled");
        jQuery("header .container").addClass("header-container-scrolled");
      } else {
        jQuery(".header_style_1").removeClass("header-scrolled");
        jQuery("header").removeClass("header-wrapper-scrolled");
        jQuery("header .container").removeClass("header-container-scrolled");
      }
    }


    // Run once on load
    applyScrolledState(jQuery(window).scrollTop() > 0);

    // Apply on scroll + resize
    jQuery(window).on("scroll.headerToggle resize.headerToggle", function () {
      applyScrolledState(jQuery(window).scrollTop() > 0);
    });

  });


  // MENU JS
  jQuery(document).on("click", "button[name='mobile-menu-view']", function () {
    jQuery("#mainmenu").addClass("active");
    jQuery('html,body').addClass('overflow-hidden');
  });

  jQuery(document).on("click", "button[name='close']", function () {
    jQuery("#mainmenu").removeClass("active");
    jQuery('html,body').removeClass('overflow-hidden');
  });

  jQuery(document).on('keyup', function (e) {
    if (e.key === 'Escape') {
      jQuery('#mainmenu').removeClass('active');
      jQuery('html,body').removeClass('overflow-hidden');
    }
  });




  // ===== Search Js ===== //
  jQuery('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#name',
  });

// ===== CART & WISHLIST SIDEBAR FIX =====

// GLOBAL OVERLAY
const overlay = jQuery(".bg_body_box");

// OPEN WISHLIST
jQuery("#openWishlist").on("click", function () {
    jQuery("#wishlistSidebar").removeClass("translate-x-full");

    overlay.removeClass("hidden").fadeIn(200);
    jQuery("body").addClass("overflow-hidden");
});

// CLOSE WISHLIST
jQuery("#closeWishlist, .bg_body_box").on("click", function () {
    jQuery("#wishlistSidebar").addClass("translate-x-full");

    overlay.fadeOut(200, function () {
        overlay.addClass("hidden");
    });
    jQuery("body").removeClass("overflow-hidden");
});

// OPEN CART
jQuery("#openCart").on("click", function () {
    jQuery("#cartSidebar").removeClass("translate-x-full");

    overlay.removeClass("hidden").fadeIn(200);
    jQuery("body").addClass("overflow-hidden");
});

// CLOSE CART
jQuery("#closeCart, .bg_body_box").on("click", function () {
    jQuery("#cartSidebar").addClass("translate-x-full");

    overlay.fadeOut(200, function () {
        overlay.addClass("hidden");
    });
    jQuery("body").removeClass("overflow-hidden");
});






  // ===== Video Popup (YouTube/Vimeo/HTML5) ===== //
  jQuery('.video-popup').magnificPopup({
    type: 'iframe',
    iframe: {
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: function (url) {
            var m = url.match(/[\?&]v=([^&]+)/);
            return m && m[1] ? m[1] : null;
          },
          src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0'
        }
      }
    },
    preloader: false,
    fixedContentPos: false
  });

  // ===== Weekly Schedule Tabs ===== //
  jQuery(document).on('click', '.schedule-tab', function () {
    var $btns = jQuery('.schedule-tab');
    var $panels = jQuery('.schedule-panel');
    var target = jQuery(this).data('target');

    $btns.removeClass('bg-bronco-100/30');
    jQuery(this).addClass('bg-bronco-100/30');
    $panels.addClass('hidden');
    jQuery(target).removeClass('hidden');
  });

  // ===== Testimonials Swiper ===== //
  // new Swiper( '.testimonials-swiper', {
  //   slidesPerView: 1,
  //   spaceBetween: 24,
  //   speed: 700,
  //   navigation: {
  //     nextEl: '.testimonials-next',
  //     prevEl: '.testimonials-prev',
  //   },
  //   breakpoints: {
  //     1024: { spaceBetween: 32 }
  //   }
  // } );

  // Content slider (fade in/out)
  const contentSwiper = new Swiper(".testimonials-content-swiper", {
    effect: "fade",
    fadeEffect: { crossFade: true },
    slidesPerView: 1,
    speed: 800,
    autoHeight: true,
    navigation: {
      nextEl: ".testimonials-next",
      prevEl: ".testimonials-prev",
    },
  });

  // Image/Thumb slider
  const imageSwiper = new Swiper(".testimonials-image-swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 800,
    effect: "fade",
    fadeEffect: { crossFade: true },
    allowTouchMove: false, // prevents manual drag if you only want sync
  });

  // Sync both sliders
  contentSwiper.controller.control = imageSwiper;
  imageSwiper.controller.control = contentSwiper;

  // ===== Instagram Swiper Style 1 ===== //
  new Swiper('.instagram_swiper_style_1', {
    slidesPerView: 3,
    speed: 600,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      767: { slidesPerView: 4 },
      991: { slidesPerView: 5 },
      1440: { slidesPerView: 6 }
    }
  });

  // ===== Newsletter: validate + AJAX submit ===== //
  jQuery(document).on('submit', '#newsletter-form', async function (e) {
    e.preventDefault();
    var $form = jQuery(this);
    var $msg = jQuery('#newsletter-msg');
    var endpoint = $form.data('endpoint'); // e.g., https://formspree.io/f/xxxxxxx
    var name = jQuery.trim($form.find('input[name="name"]').val());
    var email = jQuery.trim($form.find('input[name="email"]').val());

    // Basic validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $msg.text('Please enter a valid email address.').css('color', '#8B4513');
      return;
    }

    // If no endpoint provided, just simulate success
    if (!endpoint) {
      $msg.text('Thanks for subscribing! (Demo mode)').css('color', '#2e7d32');
      $form.get(0).reset();
      return;
    }

    try {
      $msg.text('Submitting...').css('color', '#8B4513');
      var response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email })
      });
      if (response.ok) {
        $msg.text('Thanks for subscribing! Please check your email.').css('color', '#2e7d32');
        $form.get(0).reset();
      } else {
        $msg.text('Sorry, something went wrong. Please try again later.').css('color', '#c62828');
      }
    } catch (err) {
      $msg.text('Network error. Please try again.').css('color', '#c62828');
    }
  });














  // ===== Header Js ===== //
  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() > 0) {
      jQuery('.header_style_1').addClass('scrolled');
      jQuery('.header_style_1 .site-logo img').attr('src', './image/main-logo-black.svg');
    } else {
      jQuery('.header_style_1').removeClass('scrolled');
      jQuery('.header_style_1 .site-logo img').attr('src', './image/main-logo-white.svg');
    }
  });
  jQuery('.header_style_1').hover(
    function () {
      jQuery('.header_style_1').addClass('not_scrolled_hover');
      jQuery('.header_style_1:not(.scrolled) .site-logo img').attr('src', './image/main-logo-black.svg');
    },
    function () {
      jQuery('.header_style_1').removeClass('not_scrolled_hover');
      jQuery('.header_style_1:not(.scrolled) .site-logo img').attr('src', './image/main-logo-white.svg');
    }
  );



  // ===== Search Js ===== //

  jQuery(".site-search__open").click(function () {
    jQuery('#nav-site-search').addClass("open");
    jQuery('.bg_body_box').fadeIn(1000);
    jQuery('html').addClass('hide-scrollbar');
    setTimeout(function () {
      jQuery('#nav-site-search').addClass('search_bar');
    }, 1000);
  });
  jQuery(".site-search__close").click(function () {
    jQuery('html').removeClass('hide-scrollbar');
    jQuery('#nav-site-search').removeClass('search_bar');
    jQuery('.bg_body_box').fadeOut(1000);
    setTimeout(function () {
      jQuery('#nav-site-search').removeClass("open");
    }, 1000);
  });
  jQuery(document).click(function (event) {
    if (!jQuery(event.target).closest('#nav-site-search, .site-search__open').length) {
      jQuery('#nav-site-search').removeClass('search_bar');
      jQuery('html').removeClass('hide-scrollbar');
      jQuery('.bg_body_box').fadeOut(1000);
      setTimeout(function () {
        jQuery('#nav-site-search').removeClass("open");
      }, 1000);
    }
  });









  // ===== scroll-to-top ===== //
  jQuery(window).on('load', function () {
    function totop_button(state) {
      var b = jQuery("#scroll-to-top");
      if (state === "on") {
        b.addClass("on fadeInRight").removeClass("off fadeOutRight");
      } else {
        b.addClass("off fadeOutRight animated").removeClass("on fadeInRight");
      }
    }
    jQuery(window).scroll(function () {
      var b = jQuery(this).scrollTop(),
        c = jQuery(this).height(),
        d = b > 0 ? b + c / 2 : 1;
      if (d < 1300 && d < c) {
        totop_button("off");
      } else {
        totop_button("on");
      }
    });
    jQuery("#scroll-to-top").click(function (e) {
      e.preventDefault();
      jQuery("body,html").animate({
        scrollTop: 0
      }, 1000, "swing");
    });
  });



  // =========== NAVBAR =======================

  // NAVBAR SHOP
  var swiper = new Swiper(".shop", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.9,
        spaceBetween: 10,
      },
      769: {
        slidesPerView: 2.9,
        spaceBetween: 15,
      },
    },
  });




});