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
  // Mobile submenu accordion (used in offcanvas menu)
  jQuery(document).ready(function () {

    //----------------------------------------------------------------------
    // 1) MOBILE SIDEBAR OPEN/CLOSE
    //----------------------------------------------------------------------

    const body = jQuery("body");
    const sidebar = jQuery("#mainmenu");
    const hamburger = jQuery(".nav-right .hamburger-btn");
    const overlay = jQuery(".mobile-overlay");

    // open sidebar
    hamburger.on("click", function () {
        sidebar.addClass("active");
        overlay.addClass("active");
        body.addClass("overflow-hidden");

        // make all menu text black
        jQuery("#mainmenu .menu_link_text").addClass("text-thunder-100").removeClass("text-white");
    });

    // close sidebar (overlay click)
    overlay.on("click", function () {
        sidebar.removeClass("active in-submenu");
        overlay.removeClass("active");
        body.removeClass("overflow-hidden");

        // reset submenu
        jQuery("#mainmenu .has-mega").removeClass("mobile-open");
        jQuery("#mainmenu .mega-panel").slideUp(0);
    });


    //----------------------------------------------------------------------
    // 2) DESKTOP DROPDOWN (>= 1131px)
    //----------------------------------------------------------------------

    function initDesktopMenu() {
        if (jQuery(window).width() < 1131) return;

        jQuery("#mainmenu .has-mega").each(function () {
            const item = jQuery(this);

            item.off("mouseenter mouseleave");

            item.on("mouseenter", function () {
                item.addClass("mega-open");
                item.find(".mega-panel").stop(true, true).fadeIn(160);
            });

            item.on("mouseleave", function () {
                item.removeClass("mega-open");
                item.find(".mega-panel").stop(true, true).fadeOut(150);
            });
        });
    }

    initDesktopMenu();



    //----------------------------------------------------------------------
    // 3) MOBILE SUBMENU STEP WISE (< 1131px)
    //----------------------------------------------------------------------

    function initMobileMenu() {

        jQuery(document).off("click.mobileMenu");
        jQuery(document).off("click.mobileBackBtn");

        if (jQuery(window).width() >= 1131) return;

        // open submenu
        jQuery(document).on("click.mobileMenu", "#mainmenu .has-mega > a", function (e) {
            e.preventDefault();

            const wrap = jQuery(this).closest(".has-mega");
            const panel = wrap.find(".mega-panel").first();

            if (!panel.length) return;

            // close others
            jQuery("#mainmenu .has-mega").not(wrap).removeClass("mobile-open")
                .find(".mega-panel").slideUp(200);

            // show this submenu
            wrap.addClass("mobile-open");
            panel.slideDown(220);

            // activate submenu mode
            jQuery("#mainmenu").addClass("in-submenu");

            // insert back button if not exists
            if (panel.find(".mobile-back-btn").length === 0) {
                panel.prepend(`
                    <button class="mobile-back-btn w-full text-left px-4 py-3 border-b text-thunder-100">
                      ‹ Back
                    </button>
                `);
            }
        });

        // back button action
        jQuery(document).on("click.mobileBackBtn", ".mobile-back-btn", function () {
            const panel = jQuery(this).closest(".mega-panel");
            const wrap = panel.closest(".has-mega");

            panel.slideUp(180);
            wrap.removeClass("mobile-open");

            // exit submenu mode if no submenu open
            if (!jQuery("#mainmenu .has-mega.mobile-open").length) {
                jQuery("#mainmenu").removeClass("in-submenu");
            }
        });
    }

    initMobileMenu();



    //----------------------------------------------------------------------
    // 4) ON RESIZE → REINIT CORRECT MODE
    //----------------------------------------------------------------------

    jQuery(window).on("resize", function () {
        if (jQuery(window).width() >= 1131) {
            // reset mobile behaviour fully
            jQuery("#mainmenu").removeClass("active in-submenu");
            jQuery("#mainmenu .mega-panel").removeAttr("style");
            jQuery("#mainmenu .has-mega").removeClass("mobile-open");
            jQuery(".mobile-overlay").removeClass("active");
            body.removeClass("overflow-hidden");
        }

        initDesktopMenu();
        initMobileMenu();
    });
});





  // ===== Menu Js ===== //
  jQuery(document).on("click", "button[name=\"mobile-menu-view\"]", function (e) {
    jQuery("#mainmenu").addClass("active");
    jQuery('html,body').addClass('overflow-hidden');
  });
  jQuery(document).on("click", "button[name=\"close\"]", function (e) {
    jQuery("#mainmenu").removeClass("active");
    jQuery('html,body').removeClass('overflow-hidden');
  });
  // close on Esc
  jQuery(document).on('keyup', function (e) { if (e.key === 'Escape') { jQuery('#mainmenu').removeClass('active'); jQuery('html,body').removeClass('overflow-hidden'); } });




  // ===== Search Js ===== //
  jQuery('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#name',
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
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 2.9,
        spaceBetween: 15,
      },
    },
  });
  // var swiper = new Swiper(".SHOP", {
  //   slidesPerView: 1,
  //   spaceBetween: 10,
  //   pagination: {
  //     el: ".swiper-pagination",
  //     clickable: true,
  //   },
  //   breakpoints: {
  //     640: {
  //       slidesPerView: 2,
  //       spaceBetween: 20,
  //     },
  //     768: {
  //       slidesPerView: 4,
  //       spaceBetween: 40,
  //     },
  //     1024: {
  //       slidesPerView: 5,
  //       spaceBetween: 50,
  //     },
  //   },
  // });












});


