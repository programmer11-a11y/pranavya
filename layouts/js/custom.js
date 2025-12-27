jQuery(document).ready(function () {
  jQuery(function () {
    jQuery(".marquee-track").each(function () {
      var $track = jQuery(this);
      var $item = $track.find(".marquee").first();

      if ($track.children(".marquee").length === 1) {
        $track.append($item.clone());
      }
    });
  });

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

      applyScrolledState(); // Force header state update after mobile menu closes
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
      jQuery(document).off(
        "click.mobileMenu click.mobileBackBtn click.mobilePagesEvents click.mobilePagesEventsBack",
      );

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
            const parentTitle =
              wrap
                .find("> a .menu_link_text, > a p, > a span")
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
          const menuText = jQuery(this).find("p").text().trim();
          const thirdList = menuItem.find("> div ul").first();

          if (!thirdList.length) return;

          // Create dynamic panel ID based on menu text
          const panelId =
            "mobile-nested-panel-" +
            menuText.toLowerCase().replace(/\s+/g, "-");
          let panel = jQuery("#" + panelId);

          // Create third-step panel container for each nested menu
          if (!panel.length) {
            panel = jQuery(
              '<div id="' +
                panelId +
                '" class="lg:hidden fixed inset-0 z-[60] bg-white flex flex-col transform -translate-x-full transition-all ease-in-out sm:top-0 top-[6px]">' +
                '<div class="px-4 border-b border-primary/20">' +
                '<button type="button" class="mobile-nested-back w-full text-left py-3 text-thunder-100 inline-flex items-center gap-2" data-panel="' +
                panelId +
                '">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">' +
                '<path d="M6.56385 12.2344L1.33008 7.0006L6.56385 1.76683M2.05699 7.0006L12.6699 7.0006" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                "</svg>" +
                '<span class="uppercase">' +
                menuText +
                "</span>" +
                "</button>" +
                "</div>" +
                '<ul class="flex-1 overflow-y-auto bg-white"></ul>' +
                "</div>",
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
          const panelId = jQuery(this).data("panel");
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
        jQuery("#mobile-pages-events-panel").addClass("hidden");
        jQuery('[id^="mobile-nested-panel-"]')
          .addClass("-translate-x-full")
          .removeAttr("style");
        hideOverlay();
        body.removeClass("overflow-hidden");
      }

      initDesktopMenu();

      // CLOSE ALL MEGA MENUS + OVERLAY WHEN LEAVING HEADER
      jQuery(".all-header").on("mouseleave", function () {
        jQuery("#mainmenu .has-mega").removeClass("mega-open");
        jQuery("#mainmenu .mega-panel").stop(true, true).fadeOut(150);

        // Only hide overlay if both sidebars are closed
        if (
          jQuery("#wishlistSidebar").hasClass("translate-x-full") &&
          jQuery("#cartSidebar").hasClass("translate-x-full")
        ) {
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

    const header = jQuery(".all-header");
    const siteLogo = header.find(".site-logo img").first();
    const WHITE_LOGO = "./image/main-logo-white.svg";
    const BLACK_LOGO = "./image/main-logo-black.svg";
    const ICON_SELECTORS =
      ".menu_link_text, .site-search__open, button[name='mobile-menu-view'], .all-header svg";

    function applyScrolledState() {
      const scrolled = jQuery(window).scrollTop() > 20;
      const megaOpen = jQuery(".mega-panel:visible").length > 0;
      const sidebarOpen = jQuery("#mainmenu").hasClass("active");
      const searchOpen = jQuery("#nav-site-search").hasClass("open");
      const wishlistOpen =
        !jQuery("#wishlistSidebar").hasClass("translate-x-full");
      const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");
      const mobileLogo = jQuery("#mainmenu > div img").first();

      // 🔥 Condition for black UI
      const useBlack =
        scrolled ||
        megaOpen ||
        sidebarOpen ||
        searchOpen ||
        wishlistOpen ||
        cartOpen;

      if (useBlack) {
        // LOGO
        siteLogo.attr("src", BLACK_LOGO);

        // TEXT + ICONS → BLACK
        jQuery(
          ".all-header > .container .menu_link_text, .all-header > .container .site-search__open, .all-header > .container .nav-icon",
        )
          .removeClass("text-white")
          .addClass("text-black-100");

        // Header BG
        jQuery(".all-header").addClass("bg-white");
      } else {
        // LOGO
        siteLogo.attr("src", WHITE_LOGO);

        // TEXT + ICONS → WHITE
        jQuery(
          ".all-header > .container .menu_link_text, .all-header > .container .site-search__open, .all-header > .container .nav-icon",
        )
          .removeClass("text-black-100")
          .addClass("text-white");

        // Header BG
        jQuery(".all-header").removeClass("bg-white");
      }

      // 🔥 If page is scrolled → also activate scrolled header UI
      if (scrolled) {
        jQuery(".all-header").addClass("header-scrolled");
        jQuery("header").addClass("header-wrapper-scrolled");
        jQuery("header .container").addClass("header-container-scrolled");
      } else {
        jQuery(".all-header").removeClass("header-scrolled");
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
      jQuery(".site-search__suggestions-block .text-white").removeClass(
        "text-white",
      );
    }

    // MENU JS
    jQuery(document).on(
      "click",
      "button[name='mobile-menu-view']",
      function () {
        jQuery("#mainmenu").addClass("active");
        jQuery("html,body").addClass("overflow-hidden");
      },
    );

    jQuery(document).on("click", "button[name='close']", function () {
      jQuery("#mainmenu").removeClass("active");
      jQuery("html,body").removeClass("overflow-hidden");
      applyScrolledState(); // Force header state update after mobile menu closes
    });

    jQuery(document).on("keyup", function (e) {
      if (e.key === "Escape") {
        jQuery("#mainmenu").removeClass("active");
        jQuery("html,body").removeClass("overflow-hidden");
      }
    });

    // ===== CART & WISHLIST SIDEBAR FIX =====

    // OPEN WISHLIST (Desktop)
    jQuery("#openWishlist").on("click", function () {
      jQuery("#wishlistSidebar")
        .removeClass("translate-x-full shadow-none")
        .addClass("shadow-[-20px_0px_14px_0_#00000069]");
      jQuery("body").addClass("overflow-hidden");
    });

    // OPEN WISHLIST (Mobile)
    jQuery("#openWishlistMobile").on("click", function () {
      jQuery("#wishlistSidebar")
        .removeClass("translate-x-full shadow-none")
        .addClass("shadow-[-20px_0px_14px_0_#00000069]");
      jQuery("body").addClass("overflow-hidden");
    });

    // CLOSE WISHLIST
    jQuery("#closeWishlist").on("click", function () {
      jQuery("#wishlistSidebar")
        .addClass("translate-x-full shadow-none")
        .removeClass("shadow-[-20px_0px_14px_0_#00000069]");
      jQuery("body").removeClass("overflow-hidden");
    });

    // OPEN CART
    jQuery("#openCart").on("click", function () {
      jQuery("#cartSidebar")
        .removeClass("translate-x-full shadow-none")
        .addClass("shadow-[-20px_0px_14px_0_#00000069]");
      jQuery("body").addClass("overflow-hidden");
    });

    // CLOSE CART
    jQuery("#closeCart").on("click", function () {
      jQuery("#cartSidebar")
        .addClass("translate-x-full shadow-none")
        .removeClass("shadow-[-20px_0px_14px_0_#00000069]");
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
    jQuery(document).ready(function ($) {
      /* ----------------------------
         TAB CLICK (EXISTING LOGIC)
      -----------------------------*/
      $(document).on("click", ".schedule-tab", function () {
        var $btns = $(".schedule-tab");
        var $panels = $(".schedule-panel");
        var target = $(this).data("target");

        // reset all tabs
        $btns.removeClass("bg-primary text-white").addClass("text-primary");

        // activate clicked tab
        $(this).removeClass("text-black").addClass("bg-primary text-white");

        // panels toggle
        $panels.addClass("hidden");
        $(target).removeClass("hidden");

        // sync SELECT value (desktop → mobile)
        $("#scheduleSelect").val(target);
      });

      /* ----------------------------
         SELECT CHANGE (MOBILE)
      -----------------------------*/
      $("#scheduleSelect").on("change", function () {
        var target = $(this).val();

        // trigger same tab logic
        $('.schedule-tab[data-target="' + target + '"]').trigger("click");
      });
    });

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
      slidesPerView: 2,
      speed: 600,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        500: { slidesPerView: 3 },
        767: { slidesPerView: 4 },
        991: { slidesPerView: 5 },
        1440: { slidesPerView: 6 },
      },
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
    // ===== Header Js ===== //
    jQuery(window).scroll(function () {
      if (jQuery(this).scrollTop() > 0) {
        jQuery(".all-header").addClass("scrolled");
        jQuery(".all-header .site-logo img").attr(
          "src",
          "./image/main-logo-black.svg",
        );
      } else {
        jQuery(".all-header").removeClass("scrolled");
        jQuery(".all-header .site-logo img").attr(
          "src",
          "./image/main-logo-white.svg",
        );
      }
    });

    jQuery(".all-header").hover(
      function () {
        jQuery(".all-header").addClass("not_scrolled_hover");
        jQuery(".all-header:not(.scrolled) .site-logo img").attr(
          "src",
          "./image/main-logo-black.svg",
        );
      },
      function () {
        jQuery(".all-header").removeClass("not_scrolled_hover");
        jQuery(".all-header:not(.scrolled) .site-logo img").attr(
          "src",
          "./image/main-logo-white.svg",
        );
      },
    );
  });

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
        // applyScrolledState(); // Force header state update when searchbar closes by clicking outside
      }, 1000);
    }
  });
});

// our-classes.js
document.addEventListener("DOMContentLoaded", () => {
  const slideId = document.querySelector(".slide-id");
  const slideTitle = document.querySelector(".slide-title");
  const slideDesc = document.querySelector(".slide-desc");
  const slideImg = document.querySelector(".slide-img");
  const slideIcon = document.querySelector(".slide-icon");
  const viewBtn = document.querySelector(".slide-button");
  const navBtns = document.querySelectorAll(".nav-btn");

  const slides = [
    {
      id: "01",
      title: "HATHA YOGA",
      desc: "Perfect for beginners and anyone looking to build a strong foundation.",
      image: "./image/hatha-yoga.webp",
      icon: "./image/hatha-yoga.svg",
      link: "./class-detail-1.html",
    },
    {
      id: "02",
      title: "VINYASA FLOW YOGA",
      desc: "A dynamic style of yoga that links movement with breath.",
      image: "./image/vinyasa-flow-yoga.webp",
      icon: "./image/vinyasa-flow-yoga.svg",
      link: "./class-detail-2.html",
    },
    {
      id: "03",
      title: "PRANAYAMA YOGA",
      desc: "Focuses on breath control practices that enhance vitality.",
      image: "./image/pranayama-yoga.webp",
      icon: "./image/pranayama-yoga.svg",
      link: "./class-detail-3.html",
    },
    {
      id: "04",
      title: "YIN YOGA",
      desc: "Slow, deep stretches that target connective tissues.",
      image: "./image/yin-yoga.webp",
      icon: "./image/yin-yoga.svg",
      link: "./class-detail-4.html",
    },
  ];

  function updateSlide(index) {
    const s = slides[index];

    slideId.textContent = s.id;
    slideTitle.textContent = s.title;
    slideDesc.textContent = s.desc;
    slideImg.src = s.image;
    slideIcon.src = s.icon;
    viewBtn.href = s.link;

    // Active state
    navBtns.forEach((btn) => btn.classList.remove("active"));
    navBtns[index].classList.add("active");
  }

  // Init first slide
  updateSlide(0);

  // Click handling
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.slide, 10);
      updateSlide(index);
    });
  });
});

// validation form logic
(function ($) {
  $(document).on(
    "submit.newsletterValidation",
    "#newsletter-form",
    function (e) {
      e.preventDefault();
      e.stopImmediatePropagation(); // 🔥 prevents other submit handlers

      var $form = $(this);
      var valid = true;

      $form.find("input[required]").each(function () {
        var $input = $(this);
        removeError($input);

        if (!$input.val().trim()) {
          showError($input, $input.attr("placeholder") + " is required.");
          valid = false;
        } else if ($input.attr("type") === "email" && !this.validity.valid) {
          showError($input, "Please enter a valid email address.");
          valid = false;
        }
      });

      if (!valid) return;

      // ✅ SUCCESS (AJAX / message / reset)
      $form[0].reset();
      alert("Subscribed successfully!");
    },
  );

  // Live remove error
  $(document).on("input", "#newsletter-form input", function () {
    removeError($(this));
  });

  function showError($input, message) {
    $input.addClass("input-error");

    if ($input.next(".error-msg").length) return;

    $input.after(`
      <div class="error-msg">
        <span class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
<path d="M9.35 9.35H7.65V4.25H9.35M9.35 12.75H7.65V11.05H9.35M8.5 0C7.38376 0 6.27846 0.219859 5.24719 0.647024C4.21592 1.07419 3.27889 1.70029 2.48959 2.48959C0.895533 4.08365 0 6.24566 0 8.5C0 10.7543 0.895533 12.9163 2.48959 14.5104C3.27889 15.2997 4.21592 15.9258 5.24719 16.353C6.27846 16.7801 7.38376 17 8.5 17C10.7543 17 12.9163 16.1045 14.5104 14.5104C16.1045 12.9163 17 10.7543 17 8.5C17 7.38376 16.7801 6.27846 16.353 5.24719C15.9258 4.21592 15.2997 3.27889 14.5104 2.48959C13.7211 1.70029 12.7841 1.07419 11.7528 0.647024C10.7215 0.219859 9.61624 0 8.5 0Z" fill="#D21C1C"/>
</svg>
        </span>
        <span>${message}</span>
      </div>
    `);
  }

  function removeError($input) {
    $input.removeClass("input-error");
    $input.next(".error-msg").remove();
  }
})(jQuery);

// =================== INDEX-2.HTML ========================
// ==== HERO SLIDER ====
// =================== HERO SLIDER (FINAL) ===================
$(function () {
  const slides = $(".hero-slide");
  const thumbs = $(".thumb");
  const viewport = document.getElementById("thumbViewport");
  const total = slides.length;

  let current = 0;
  let isDragging = false;

  // ===================== THUMB AUTO ALIGN =====================
  function updateThumbPosition(index) {
    if (isDragging) return; // ⛔ don't fight with drag

    if (!viewport) return;
    const thumb = thumbs.get(index);
    if (!thumb) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;

    let target = thumb.offsetLeft;

    // prevent over-scroll
    if (target > maxScroll) target = maxScroll;
    if (target < 0) target = 0;

    viewport.scrollTo({
      left: target,
      behavior: "smooth",
    });
  }

  // ===================== SHOW SLIDE =====================
  function showSlide(index) {
    slides.removeClass("active").eq(index).addClass("active");
    thumbs.removeClass("active").eq(index).addClass("active");

    $("#slideTitle").text(slides.eq(index).data("title"));
    $("#slideDesc").text(slides.eq(index).data("desc"));
    $("#currentIndex").text(String(index + 1).padStart(2, "0"));
    $("#totalIndex").text(String(total).padStart(2, "0"));

    $("#progressFill").css("width", ((index + 1) / total) * 100 + "%");

    updateThumbPosition(index);
    current = index;
  }

  // ===================== CONTROLS =====================
  $("#nextSlide").on("click", function () {
    showSlide((current + 1) % total);
  });

  $("#prevSlide").on("click", function () {
    showSlide((current - 1 + total) % total);
  });

  thumbs.on("click", function () {
    if (isDragging) return;
    showSlide($(this).index());
  });

  // ===================== INIT (WAIT FOR LAYOUT) =====================
  requestAnimationFrame(() => {
    if (viewport) viewport.scrollLeft = 0;
    showSlide(0);
  });

  // ===================== STABLE DRAG / SWIPE =====================
  (function () {
    const viewport = document.getElementById("thumbViewport");
    if (!viewport) return;

    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let moved = false;
    const THRESHOLD = 8;

    viewport.addEventListener("mousedown", (e) => {
      dragging = true;
      moved = false;
      isDragging = true;

      startX = e.clientX;
      startScroll = viewport.scrollLeft;

      viewport.classList.add("dragging");
      e.preventDefault(); // 🔒 stop browser drag
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;

      const dx = e.clientX - startX;
      if (Math.abs(dx) < THRESHOLD) return;

      moved = true;
      viewport.scrollLeft = startScroll - dx;
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      isDragging = false;
      viewport.classList.remove("dragging");
    });

    // prevent click after drag
    viewport.addEventListener("click", (e) => {
      if (moved) {
        e.preventDefault();
        e.stopImmediatePropagation();
        moved = false;
      }
    });

    // -------- TOUCH --------
    viewport.addEventListener("touchstart", (e) => {
      dragging = true;
      moved = false;
      isDragging = true;

      startX = e.touches[0].clientX;
      startScroll = viewport.scrollLeft;
    });

    viewport.addEventListener("touchmove", (e) => {
      if (!dragging) return;

      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) < THRESHOLD) return;

      moved = true;
      viewport.scrollLeft = startScroll - dx;
    });

    viewport.addEventListener("touchend", () => {
      dragging = false;
      isDragging = false;
    });
  })();

  new Swiper(".testimonial-slider", {
    slidesPerView: "1",
    centeredSlides: true,
    loop: true,
    spaceBetween: 20,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: { slidesPerView: 1, spaceBetween: 30 },
      767: { slidesPerView: 1.2, spaceBetween: 40 },
      992: { slidesPerView: 1.3, spaceBetween: 40 },
      1131: { slidesPerView: 1.5, spaceBetween: 55 },
      1281: { slidesPerView: 1.5, spaceBetween: 70 },
      1500: { slidesPerView: 1.5, spaceBetween: 90 },
      1782: { slidesPerView: 1.6, spaceBetween: 110 },
    },
  });
});
// =================== END INDEX-2.HTML ========================
