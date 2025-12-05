jQuery(document).ready(function () {
  // ===== Marquee (Quotes) Js ===== //
  // Duplicate marquee content for a seamless loop and add hover/touch pause
  jQuery(".marquee").each(function () {
    var $this = jQuery(this);
    var $content = $this.children();
    if (!$this.data("duplicated")) {
      while ($this.width() < jQuery(window).width() * 2) {
        $this.append($content.clone());
      }
      $this.data("duplicated", true);
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
    const overlay = jQuery(".bg_body_box"); // FINAL OVERLAY

    /* ============================================================
       OVERLAY FUNCTIONS
    ============================================================ */
    function showOverlay() {
      overlay.removeClass("hidden").css("display", "block");
    }

    function hideOverlay() {
      overlay.addClass("hidden").css("display", "none");
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
      if (jQuery(window).width() < 1220) return;

      jQuery("#mainmenu .has-mega").each(function () {
        const item = jQuery(this);

        item.off("mouseenter mouseleave");
        item.find(".mega-panel").off("mouseenter mouseleave");

        item.on("mouseenter", function () {
          clearTimeout(item.data("closeTimer"));
          item.addClass("mega-open");
          item.find(".mega-panel").stop(true, true).fadeIn(160);
          fixInnerTextWhite();
          $(".bg_body_box").removeClass("hidden").css("display", "block");
        });

        item.find(".mega-panel").on("mouseenter", function () {
          clearTimeout(item.data("closeTimer"));
        });

        item.on("mouseleave", function () {
          item.removeClass("mega-open");
          item.find(".mega-panel").stop(true, true).fadeOut(150);
          jQuery(".bg_body_box").addClass("hidden").css("display", "none");
        });
      });


      // HIDE OVERLAY when cursor goes to NON-DROPDOWN menu items
      jQuery("#mainmenu > ul > li").on("mouseenter", function () {
        const item = jQuery(this);

        if (!item.hasClass("has-mega")) {
          jQuery("#mainmenu .has-mega").removeClass("mega-open");
          jQuery("#mainmenu .mega-panel").stop(true, true).fadeOut(150);

          jQuery(".bg_body_box").addClass("hidden").css("display", "none");
        }
      });
    }


    initDesktopMenu();

    /* ============================================================
       MOBILE STEP SUBMENU (FIX-B)
    ============================================================ */

    function initMobileMenu() {
      jQuery(document).off("click.mobileMenu click.mobileBackBtn click.mobilePagesEvents click.mobilePagesEventsBack");

      if (jQuery(window).width() >= 1220) return;

      // OPEN SUBMENU
      jQuery(document).on(
        "click.mobileMenu",
        "#mainmenu .has-mega > a",
        function (e) {
          e.preventDefault();

          const wrap = jQuery(this).closest(".has-mega");
          const panel = wrap.find(".mega-panel").first();

          jQuery("#mainmenu .has-mega")
            .not(wrap)
            .removeClass("mobile-open")
            .find(".mega-panel")
            .removeClass("mobile-step in")
            .hide();

          wrap.addClass("mobile-open");

          panel.show(0).addClass("mobile-step").removeClass("in");
          fixInnerTextWhite();

          // Animation: left → right
          if (panel[0] && panel[0].animate) {
            const anim = panel[0].animate(
              [
                { transform: "translateX(-110%)" },
                { transform: "translateX(0)" },
              ],
              { duration: 260, easing: "ease", fill: "forwards" },
            );
            anim.onfinish = function () {
              panel.addClass("in").css("transform", "translateX(0)");
            };
          }

          jQuery("#mainmenu").addClass("in-submenu");

          // Add Back Button
          if (!panel.find(".mobile-back-btn").length) {

            const parentTitle = wrap.find("> a .menu_link_text, > a p, > a span")
              .first()
              .text()
              .trim() || "Back";

            panel.prepend(`
            <div class="px-4">
          <button class="mobile-back-btn w-full text-left py-3 border-b text-thunder-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
              <path d="M5.98377 11.2168L0.75 5.98302L5.98377 0.74925M1.47691 5.98302L12.0898 5.98302" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
              <span class="uppercase">${parentTitle}</span>
          </button>
          </div>
        `);
          }
        },
      );

      // CLOSE SUBMENU
      jQuery(document).on(
        "click.mobileBackBtn",
        ".mobile-back-btn",
        function () {
          const panel = jQuery(this).closest(".mega-panel");
          const wrap = panel.closest(".has-mega");

          if (panel[0] && panel[0].animate) {
            const anim = panel[0].animate(
              [
                { transform: "translateX(0)" },
                { transform: "translateX(-110%)" },
              ],
              { duration: 220, easing: "ease", fill: "forwards" },
            );
            anim.onfinish = function () {
              panel.removeClass("mobile-step in").hide().css("transform", "");
            };
          }

          wrap.removeClass("mobile-open");

          if (!jQuery("#mainmenu .has-mega.mobile-open").length) {
            jQuery("#mainmenu").removeClass("in-submenu");
          }

          // Always hide Pages > Events third-step panel when going back to root
          jQuery("#mobile-pages-events-panel").addClass("hidden");
        },
      );

      // THIRD-LEVEL: Nested menu items (mobile only, step 3)
      jQuery(document).on(
        "click.mobileNestedMenus",
        "#mainmenu .mega-panel li.group > a",
        function (e) {
          if (jQuery(window).width() >= 1220) return; // keep desktop hover behaviour
          e.preventDefault();

          const menuItem = jQuery(this).closest("li.group");
          const menuText = jQuery(this).find('p').text().trim();
          const thirdList = menuItem.find("> div ul").first();

          if (!thirdList.length) return;

          // Create dynamic panel ID based on menu text
          const panelId = "mobile-nested-panel-" + menuText.toLowerCase().replace(/\s+/g, '-');
          let panel = jQuery("#" + panelId);

          // Create third-step panel container for each nested menu
          if (!panel.length) {
            panel = jQuery(
              '<div id="' + panelId + '" class="lg:hidden fixed inset-0 z-[60] bg-white flex flex-col transform -translate-x-full transition-all ease-in-out sm:top-0 top-[6px]">' +
              '<div class="px-4 border-b border-primary/20">' +
              '<button type="button" class="mobile-nested-back w-full text-left py-3 text-thunder-100 inline-flex items-center gap-2" data-panel="' + panelId + '">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">' +
              '<path d="M6.56385 12.2344L1.33008 7.0006L6.56385 1.76683M2.05699 7.0006L12.6699 7.0006" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
              '<span class="uppercase">' + menuText + '</span>' +
              "</button>" +
              "</div>" +
              '<ul class="flex-1 overflow-y-auto bg-white"></ul>' +
              "</div>"
            );
            jQuery("#mainmenu").append(panel);
          }


          const list = panel.find("ul").first();
          list.empty();

          // Clone existing menu items into mobile panel
          thirdList.children("li").each(function () {
            const clone = jQuery(this).clone(true, true);
            list.append(clone);
          });

          // Add opening animation (left → right)
          if (panel[0] && panel[0].animate) {
            const anim = panel[0].animate(
              [
                { transform: "translateX(-110%)" },
                { transform: "translateX(0)" },
              ],
              { duration: 260, easing: "ease", fill: "forwards" },
            );
            anim.onfinish = function () {
              panel.removeClass("-translate-x-full");
            };
          } else {
            panel.removeClass("-translate-x-full");
          }
        },
      );

      // BACK from any nested menu (step 3) to parent menu (step 2)
      jQuery(document).on(
        "click.mobileNestedBack",
        ".mobile-nested-back",
        function (e) {
          e.preventDefault();
          const panelId = jQuery(this).data('panel');
          const panel = jQuery("#" + panelId);

          // Add closing animation (right → left)
          if (panel[0] && panel[0].animate) {
            const anim = panel[0].animate(
              [
                { transform: "translateX(0)" },
                { transform: "translateX(-110%)" },
              ],
              { duration: 220, easing: "ease", fill: "forwards" },
            );
            anim.onfinish = function () {
              panel.addClass("-translate-x-full").removeAttr("style");
            };
          } else {
            panel.addClass("-translate-x-full");
          }
        },
      );
    }

    initMobileMenu();

    /* ============================================================
       WINDOW RESIZE RESET
    ============================================================ */

    jQuery(window).on("resize", function () {
      if (jQuery(window).width() >= 1220) {
        sidebar.removeClass("active in-submenu");
        jQuery("#mainmenu .mega-panel").removeAttr("style");
        jQuery("#mainmenu .has-mega").removeClass("mobile-open");
        // Also ensure all nested panels are hidden on desktop
        jQuery("#mobile-pages-events-panel").addClass("hidden");
        jQuery('[id^="mobile-nested-panel-"]').addClass("-translate-x-full").removeAttr("style");
        hideOverlay();
        body.removeClass("overflow-hidden");
      }

      initDesktopMenu();

      // CLOSE ALL MEGA MENUS + OVERLAY WHEN LEAVING HEADER
      jQuery(".header_style_1").on("mouseleave", function () {
        jQuery("#mainmenu .has-mega").removeClass("mega-open");
        jQuery("#mainmenu .mega-panel").stop(true, true).fadeOut(150);

        // Only hide overlay if both sidebars are closed
        if (jQuery("#wishlistSidebar").hasClass("translate-x-full") && jQuery("#cartSidebar").hasClass("translate-x-full")) {
          jQuery(".bg_body_box").addClass("hidden").css("display", "none");
        }
      });

      initMobileMenu();

    });

    /* ============================================================
       SEARCH BAR OVERLAY
    ============================================================ */

    jQuery(".site-search__open").click(function () {
      showOverlay();
      jQuery("#nav-site-search").addClass("open");

      setTimeout(() => {
        jQuery("#nav-site-search").addClass("search_bar");
        fixInnerTextWhite();

      }, 300);
    });

    jQuery(".site-search__close").click(function () {
      jQuery("#nav-site-search").removeClass("search_bar");
      hideOverlay();

      setTimeout(() => {
        jQuery("#nav-site-search").removeClass("open");
      }, 300);
    });

    jQuery(document).click(function (event) {
      if (
        !jQuery(event.target).closest("#nav-site-search, .site-search__open")
          .length
      ) {
        jQuery("#nav-site-search").removeClass("search_bar");
        hideOverlay();
        setTimeout(() => {
          jQuery("#nav-site-search").removeClass("open");
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
        jQuery(".header_style_1 > .container .menu_link_text, .header_style_1 > .container .site-search__open, .header_style_1 > .container .nav-icon")
          .removeClass("text-white")
          .addClass("text-black-100");

        // Header BG
        jQuery(".header_style_1").addClass("bg-white");
      } else {
        // LOGO
        siteLogo.attr("src", WHITE_LOGO);

        // TEXT + ICONS → WHITE
        jQuery(".header_style_1 > .container .menu_link_text, .header_style_1 > .container .site-search__open, .header_style_1 > .container .nav-icon")
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
    /* ============================================================
   FIX: Remove text-white only inside mega menu + search
============================================================ */
    function fixInnerTextWhite() {
      // Mega menu text
      jQuery("#mainmenu .mega-panel .text-white").removeClass("text-white");

      // Search suggestion text (REAL container)
      jQuery(".site-search__suggestions-block .text-white").removeClass("text-white");
    }


  });

  // MENU JS
  jQuery(document).on("click", "button[name='mobile-menu-view']", function () {
    jQuery("#mainmenu").addClass("active");
    jQuery("html,body").addClass("overflow-hidden");
  });

  jQuery(document).on("click", "button[name='close']", function () {
    jQuery("#mainmenu").removeClass("active");
    jQuery("html,body").removeClass("overflow-hidden");
  });

  jQuery(document).on("keyup", function (e) {
    if (e.key === "Escape") {
      jQuery("#mainmenu").removeClass("active");
      jQuery("html,body").removeClass("overflow-hidden");
    }
  });

  // ===== Search Js ===== //
  jQuery(".popup-with-form").magnificPopup({
    type: "inline",
    preloader: false,
    focus: "#name",
  });

  // ===== CART & WISHLIST SIDEBAR FIX =====

  // OPEN WISHLIST (Desktop)
  jQuery("#openWishlist").on("click", function () {
    jQuery("#wishlistSidebar").removeClass("translate-x-full shadow-none").addClass("shadow-[-20px_0px_14px_0_#00000069]");
    jQuery("body").addClass("overflow-hidden");
  });

  // OPEN WISHLIST (Mobile)
  jQuery("#openWishlistMobile").on("click", function () {
    jQuery("#wishlistSidebar").removeClass("translate-x-full shadow-none").addClass("shadow-[-20px_0px_14px_0_#00000069]");
    jQuery("body").addClass("overflow-hidden");
  });

  // CLOSE WISHLIST
  jQuery("#closeWishlist").on("click", function () {
    jQuery("#wishlistSidebar").addClass("translate-x-full shadow-none").removeClass("shadow-[-20px_0px_14px_0_#00000069]");
    jQuery("body").removeClass("overflow-hidden");
  });

  // OPEN CART
  jQuery("#openCart").on("click", function () {
    jQuery("#cartSidebar").removeClass("translate-x-full shadow-none").addClass("shadow-[-20px_0px_14px_0_#00000069]");
    jQuery("body").addClass("overflow-hidden");
  });

  // CLOSE CART
  jQuery("#closeCart").on("click", function () {
    jQuery("#cartSidebar").addClass("translate-x-full shadow-none").removeClass("shadow-[-20px_0px_14px_0_#00000069]");
    jQuery("body").removeClass("overflow-hidden");
  });


  // ===== Video Popup (YouTube/Vimeo/HTML5) ===== //
  jQuery(".video-popup").magnificPopup({
    type: "iframe",
    iframe: {
      patterns: {
        youtube: {
          index: "youtube.com/",
          id: function (url) {
            var m = url.match(/[\?&]v=([^&]+)/);
            return m && m[1] ? m[1] : null;
          },
          src: "https://www.youtube.com/embed/%id%?autoplay=1&rel=0",
        },
      },
    },
    preloader: false,
    fixedContentPos: false,
  });

  // ===== Weekly Schedule Tabs ===== //
  jQuery(document).on("click", ".schedule-tab", function () {
    var $btns = jQuery(".schedule-tab");
    var $panels = jQuery(".schedule-panel");
    var target = jQuery(this).data("target");

    $btns.removeClass("bg-bronco-100/30");
    jQuery(this).addClass("bg-bronco-100/30");
    $panels.addClass("hidden");
    jQuery(target).removeClass("hidden");
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
  new Swiper(".instagram_swiper_style_1", {
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
      1440: { slidesPerView: 6 },
    },
  });

  // ===== Newsletter: validate + AJAX submit ===== //
  jQuery(document).on("submit", "#newsletter-form", async function (e) {
    e.preventDefault();
    var $form = jQuery(this);
    var $msg = jQuery("#newsletter-msg");
    var endpoint = $form.data("endpoint"); // e.g., https://formspree.io/f/xxxxxxx
    var name = jQuery.trim($form.find('input[name="name"]').val());
    var email = jQuery.trim($form.find('input[name="email"]').val());

    // Basic validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $msg.text("Please enter a valid email address.").css("color", "#8B4513");
      return;
    }

    // If no endpoint provided, just simulate success
    if (!endpoint) {
      $msg.text("Thanks for subscribing! (Demo mode)").css("color", "#2e7d32");
      $form.get(0).reset();
      return;
    }

    try {
      $msg.text("Submitting...").css("color", "#8B4513");
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email }),
      });
      if (response.ok) {
        $msg
          .text("Thanks for subscribing! Please check your email.")
          .css("color", "#2e7d32");
        $form.get(0).reset();
      } else {
        $msg
          .text("Sorry, something went wrong. Please try again later.")
          .css("color", "#c62828");
      }
    } catch (err) {
      $msg.text("Network error. Please try again.").css("color", "#c62828");
    }
  });

  // ===== Header Js ===== //
  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() > 0) {
      jQuery(".header_style_1").addClass("scrolled");
      jQuery(".header_style_1 .site-logo img").attr(
        "src",
        "./image/main-logo-black.svg",
      );
    } else {
      jQuery(".header_style_1").removeClass("scrolled");
      jQuery(".header_style_1 .site-logo img").attr(
        "src",
        "./image/main-logo-white.svg",
      );
    }
  });
  jQuery(".header_style_1").hover(
    function () {
      jQuery(".header_style_1").addClass("not_scrolled_hover");
      jQuery(".header_style_1:not(.scrolled) .site-logo img").attr(
        "src",
        "./image/main-logo-black.svg",
      );
    },
    function () {
      jQuery(".header_style_1").removeClass("not_scrolled_hover");
      jQuery(".header_style_1:not(.scrolled) .site-logo img").attr(
        "src",
        "./image/main-logo-white.svg",
      );
    },
  );

  // ===== Search Js ===== //

  jQuery(".site-search__open").click(function () {
    jQuery("#nav-site-search").addClass("open");
    jQuery(".bg_body_box").removeClass("hidden").css("display", "block");
    jQuery("html").addClass("hide-scrollbar");
    setTimeout(function () {
      jQuery("#nav-site-search").addClass("search_bar");
    }, 1000);
  });
  jQuery(".site-search__close").click(function () {
    jQuery("html").removeClass("hide-scrollbar");
    jQuery("#nav-site-search").removeClass("search_bar");
    jQuery(".bg_body_box").addClass("hidden").css("display", "none");
    setTimeout(function () {
      jQuery("#nav-site-search").removeClass("open");
    }, 1000);
  });
  jQuery(document).click(function (event) {
    if (
      !jQuery(event.target).closest("#nav-site-search, .site-search__open")
        .length
    ) {
      jQuery("#nav-site-search").removeClass("search_bar");
      jQuery("html").removeClass("hide-scrollbar");
      jQuery(".bg_body_box").addClass("hidden").css("display", "none");
      setTimeout(function () {
        jQuery("#nav-site-search").removeClass("open");
      }, 1000);
    }
  });

  // ===== scroll-to-top ===== //
  jQuery(window).on("load", function () {
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
      jQuery("body,html").animate(
        {
          scrollTop: 0,
        },
        1000,
        "swing",
      );
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

// our-classes.js
document.addEventListener("DOMContentLoaded", () => {

  const slides = [
      {
          id: "01",
          title: "HATHA YOGA",
          desc: "Perfect for beginners and anyone looking to build a strong foundation. Hatha classes help improve posture, flexibility, and overall well-being.",
          image: "./image/hatha-yoga.jpg",
          icon: "./image/hatha-yoga.svg",
      },
      {
          id: "02",
          title: "VINYASA FLOW YOGA",
          desc: "A dynamic style of yoga that links movement with breath for a flowing sequence.",
          image: "./image/vinyasa-flow-yoga.jpg",
          icon: "./image/vinyasa-flow-yoga.svg",
      },
      {
          id: "03",
          title: "PRANAYAMA YOGA",
          desc: "Focuses on breath control practices that enhance vitality and mental clarity.",
          image: "./image/pranayama-yoga.jpg",
          icon: "./image/pranayama-yoga.svg",
      },
      {
          id: "04",
          title: "YIN YOGA",
          desc: "Slow, deep stretches that target connective tissues and help relax the entire body.",
          image: "./image/yin-yoga.jpg",
          icon: "./image/yin-yoga.svg",
      }
  ];

  function updateSlide(i) {
      const s = slides[i];

      document.querySelector(".slide-id").textContent = s.id;
      document.querySelector(".slide-title").textContent = s.title;
      document.querySelector(".slide-desc").textContent = s.desc;
      document.querySelector(".slide-img").src = s.image;
      document.querySelector(".slide-icon").src = s.icon;
  }

  updateSlide(0);

  document.querySelectorAll(".nav-btn").forEach(tab => {
      tab.addEventListener("click", function () {
          updateSlide(this.dataset.slide);
      });
  });
  setActive("01");

});


