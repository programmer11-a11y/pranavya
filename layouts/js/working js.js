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
          // Add hover state immediately to maintain bg-white when hovering dropdown items
          const isScrolled = jQuery(window).scrollTop() > 0;
          const searchOpen = jQuery("#nav-site-search").hasClass("open");
          if (!isScrolled && !searchOpen) {
            jQuery(".all-header").addClass("not_scrolled_hover");
          }
          applyScrolledState(); // Update header state when mega menu opens
        });

        item.find(".mega-panel").on("mouseenter", function () {
          clearTimeout(item.data("closeTimer"));
          // Ensure header maintains bg-white when mouse enters mega panel
          applyScrolledState();
        });

        item.find(".mega-panel").on("mouseleave", function () {
          // When leaving mega panel, check if we should maintain bg-white
          // This handles the case when moving from menu item to mega panel
          applyScrolledState();
        });

        item.on("mouseleave", function () {
          item.removeClass("mega-open");
          item.find(".mega-panel").stop(true, true).fadeOut(150, function () {
            // Call after fadeOut animation completes
            const isScrolled = jQuery(window).scrollTop() === 0;
            const megaOpen = jQuery(".mega-panel:visible").length > 0;
            const sidebarOpen = jQuery("#mainmenu").hasClass("active");
            const searchOpen = jQuery("#nav-site-search").hasClass("open");

            // Check if mouse moved to another menu item or overlay before removing hover
            // Use a small delay to allow other menu item's mouseenter to fire first
            setTimeout(function () {
              const stillOnMenu = jQuery("#mainmenu > ul > li:hover").length > 0;
              const stillOnHeader = jQuery(".all-header:hover").length > 0;
              const overlayVisible = !jQuery(".bg_body_box").hasClass("hidden") && jQuery(".bg_body_box").css("display") !== "none";

              // Only remove hover if mouse is not on any menu item AND not on header
              // If mouse moved to overlay (overlay is visible but mouse not on header), remove hover
              if (isScrolled === false && !megaOpen && !sidebarOpen && !searchOpen && !stillOnMenu && !stillOnHeader) {
                // If overlay is visible but mouse is not on header, it means mouse moved to overlay - remove hover
                jQuery(".all-header").removeClass("not_scrolled_hover");
              }
              applyScrolledState();
            }, 100);
          });
          jQuery(".bg_body_box").addClass("hidden").css("display", "none");
        });
      });

      // HIDE OVERLAY when cursor goes to NON-DROPDOWN menu items
      jQuery("#mainmenu > ul > li").on("mouseenter", function () {
        const item = jQuery(this);

        if (!item.hasClass("has-mega")) {
          // Add hover state immediately to maintain bg-white when hovering non-dropdown items
          const isScrolled = jQuery(window).scrollTop() > 0;
          const searchOpen = jQuery("#nav-site-search").hasClass("open");
          if (!isScrolled && !searchOpen) {
            jQuery(".all-header").addClass("not_scrolled_hover");
          }

          jQuery("#mainmenu .has-mega").removeClass("mega-open");
          jQuery("#mainmenu .mega-panel").stop(true, true).fadeOut(150, function () {
            // After mega menu closes, update header state
            applyScrolledState();
          });

          jQuery(".bg_body_box").addClass("hidden").css("display", "none");
        } else {
          // Also ensure hover state is maintained when entering dropdown items
          // This handles the case when moving from non-dropdown to dropdown
          const isScrolled = jQuery(window).scrollTop() > 0;
          const searchOpen = jQuery("#nav-site-search").hasClass("open");
          if (!isScrolled && !searchOpen) {
            jQuery(".all-header").addClass("not_scrolled_hover");
          }
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

          // Remove any existing classes and hide panel first
          panel.removeClass("mobile-step in").hide();

          // Set initial state: positioned off-screen and invisible
          // Use inline styles with high specificity
          panel.css({
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: "9999",
            transform: "translateX(100%)", // Off-screen to the right
            opacity: "0",
            visibility: "hidden",
            display: "block"
          });

          fixInnerTextWhite();

          // Use requestAnimationFrame to ensure styles are applied
          requestAnimationFrame(function () {
            // Make panel visible but still off-screen
            panel.css({
              visibility: "visible",
              opacity: "1"
            });

            // Use another frame to ensure visibility change is rendered

            requestAnimationFrame(function () {
              // Now add the mobile-step class (for CSS transitions if needed)
              panel.addClass("mobile-step");

              // Use another frame before starting animation
              requestAnimationFrame(function () {
                // Animation: slide from right (100%) to center (0%)
                if (panel[0] && panel[0].animate) {
                  const anim = panel[0].animate(
                    [
                      { transform: "translateX(100%)" }, // Start from right (off-screen)
                      { transform: "translateX(0)" },     // End at center (on-screen)
                    ],
                    { duration: 260, easing: "ease", fill: "forwards" },
                  );
                  anim.onfinish = function () {
                    panel.addClass("in").css("transform", "translateX(0)");
                  };
                } else {
                  // Fallback: use CSS transition by adding .in class
                  setTimeout(function () {
                    panel.addClass("in");
                  }, 10);
                }
              });
            });
          });

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
      // STEP 3 – OPEN THIRD LEVEL MENU (FIXED)
      jQuery(document).on(
        "click",
        "#mainmenu .mega-panel li.group > a",
        function (e) {
          e.preventDefault();
          e.stopPropagation(); // 🔥 THIS FIXES YOUR ISSUE

          const $trigger = jQuery(this);
          const $li = $trigger.closest("li.group");
          const $submenu = $li.find("> div ul").first();

          if (!$submenu.length) return;

          const menuTitle = $trigger.text().trim();
          const panelId = "mobile-step3-" + menuTitle.replace(/\s+/g, "-").toLowerCase();

          let $panel = jQuery("#" + panelId);

          // Create panel only once
          if (!$panel.length) {
            $panel = jQuery(`
        <div id="${panelId}" class="mobile-step-3 fixed inset-0 bg-white z-[70] flex flex-col">
          <div class="px-4 py-3 border-b flex items-center gap-3">
            <button class="step3-back-btn">
              ←
            </button>
            <span class="font-medium uppercase">${menuTitle}</span>
          </div>
          <div class="flex-1 overflow-y-auto p-4 step3-content"></div>
        </div>
      `);

            jQuery("body").append($panel);
          }

          // Inject submenu items
          const $content = $panel.find(".step3-content");
          $content.empty();
          $submenu.children("li").each(function () {
            $content.append(jQuery(this).clone(true));
          });

          // Show panel
          $panel.css({
            transform: "translateX(100%)",
            display: "block"
          });

          requestAnimationFrame(() => {
            $panel.css("transform", "translateX(0)");
          });
        }
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

        // Check if mouse moved away from header - if so, remove hover state
        setTimeout(function () {
          const stillOnHeader = jQuery(".all-header:hover").length > 0;
          const stillOnMenu = jQuery("#mainmenu > ul > li:hover").length > 0;
          const isScrolled = jQuery(window).scrollTop() > 0;
          const megaOpen = jQuery(".mega-panel:visible").length > 0;
          const searchOpen = jQuery("#nav-site-search").hasClass("open");
          const sidebarOpen = jQuery("#mainmenu").hasClass("active");

          // If mouse is not on header or menu, and page is not scrolled, and nothing else is open, remove hover
          if (!isScrolled && !megaOpen && !searchOpen && !sidebarOpen && !stillOnHeader && !stillOnMenu) {
            jQuery(".all-header").removeClass("not_scrolled_hover");
            applyScrolledState();
          }
        }, 100);

        // Only hide overlay if both sidebars are closed
        if (
          jQuery("#wishlistSidebar").hasClass("translate-x-full") &&
          jQuery("#cartSidebar").hasClass("translate-x-full")
        ) {
          jQuery(".bg_body_box").addClass("hidden").css("display", "none");
        }
      });

      // Handle mouse entering overlay - remove hover if not on header
      overlay.on("mouseenter", function () {
        const isScrolled = jQuery(window).scrollTop() > 0;
        const megaOpen = jQuery(".mega-panel:visible").length > 0;
        const searchOpen = jQuery("#nav-site-search").hasClass("open");
        const sidebarOpen = jQuery("#mainmenu").hasClass("active");
        const stillOnHeader = jQuery(".all-header:hover").length > 0;
        const stillOnMenu = jQuery("#mainmenu > ul > li:hover").length > 0;

        // If mouse is on overlay (not on header or menu) and page is not scrolled, remove hover
        if (!isScrolled && !megaOpen && !searchOpen && !sidebarOpen && !stillOnHeader && !stillOnMenu) {
          jQuery(".all-header").removeClass("not_scrolled_hover");
          applyScrolledState();
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
        // On mobile, if page is not scrolled, remove bg-white when search closes
        const isScrolled = jQuery(window).scrollTop() > 0;
        const isMobile = jQuery(window).width() < 1220;
        if (isMobile && !isScrolled) {
          const megaOpen = jQuery(".mega-panel:visible").length > 0;
          const sidebarOpen = jQuery("#mainmenu").hasClass("active");
          if (!megaOpen && !sidebarOpen) {
            jQuery(".all-header").removeClass("not_scrolled_hover");
          }
        }
        applyScrolledState(); // Update header state when search closes
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
          // On mobile, if page is not scrolled, remove bg-white when search closes
          const isScrolled = jQuery(window).scrollTop() > 0;
          const isMobile = jQuery(window).width() < 1220;
          if (isMobile && !isScrolled) {
            const megaOpen = jQuery(".mega-panel:visible").length > 0;
            const sidebarOpen = jQuery("#mainmenu").hasClass("active");
            if (!megaOpen && !sidebarOpen) {
              jQuery(".all-header").removeClass("not_scrolled_hover");
            }
          }
          applyScrolledState(); // Update header state when search closes by clicking outside
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
      const hasHover = jQuery(".all-header").hasClass("not_scrolled_hover");
      const mobileLogo = jQuery("#mainmenu > div img").first();

      // 🔥 Condition for black UI (bg-white)
      // Show bg-white when: scrolled, mega menu open, search open, sidebar open, wishlist open, cart open, OR hover on header
      const useBlack =
        scrolled ||
        megaOpen ||
        sidebarOpen ||
        searchOpen ||
        wishlistOpen ||
        cartOpen ||
        hasHover;

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

        // Header BG - Remove bg-white to make it transparent
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

    // Run once on load - ensure initial state is correct
    // Remove hover state if nothing is open and page is not scrolled
    if (jQuery(window).scrollTop() === 0) {
      const megaOpen = jQuery(".mega-panel:visible").length > 0;
      const sidebarOpen = jQuery("#mainmenu").hasClass("active");
      const searchOpen = jQuery("#nav-site-search").hasClass("open");
      const wishlistOpen = !jQuery("#wishlistSidebar").hasClass("translate-x-full");
      const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");

      if (!megaOpen && !sidebarOpen && !searchOpen && !wishlistOpen && !cartOpen) {
        jQuery(".all-header").removeClass("not_scrolled_hover");
      }
    }
    applyScrolledState();

    // Apply on scroll + resize
    jQuery(window).on("scroll.headerToggle resize.headerToggle", function () {
      applyScrolledState(jQuery(window).scrollTop() > 0);
    });

    // Periodic check to ensure hover state is correct when mouse is not on header
    // This prevents hover state from persisting incorrectly
    setInterval(function () {
      const isScrolled = jQuery(window).scrollTop() > 0;
      const megaOpen = jQuery(".mega-panel:visible").length > 0;
      const sidebarOpen = jQuery("#mainmenu").hasClass("active");
      const searchOpen = jQuery("#nav-site-search").hasClass("open");
      const wishlistOpen = !jQuery("#wishlistSidebar").hasClass("translate-x-full");
      const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");
      const hasHover = jQuery(".all-header").hasClass("not_scrolled_hover");
      const stillOnHeader = jQuery(".all-header:hover").length > 0;
      const stillOnMenu = jQuery("#mainmenu > ul > li:hover").length > 0;
      const stillOnMegaPanel = jQuery(".mega-panel:hover").length > 0;

      // If hover class is active but mouse is not on header/menu/mega panel and nothing else is open, remove it
      if (hasHover && !isScrolled && !megaOpen && !sidebarOpen && !searchOpen && !wishlistOpen && !cartOpen && !stillOnHeader && !stillOnMenu && !stillOnMegaPanel) {
        jQuery(".all-header").removeClass("not_scrolled_hover");
        applyScrolledState();
      }
    }, 200);

    jQuery(document).on("click", ".step3-back-btn", function () {
      const panel = jQuery(this).closest(".mobile-step-3");
      panel.css("transform", "translateX(100%)");

      setTimeout(() => {
        panel.remove();
      }, 250);
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
      // If at top and nothing is open, remove not_scrolled_hover
      if (jQuery(window).scrollTop() === 0) {
        const megaOpen = jQuery(".mega-panel:visible").length > 0;
        const searchOpen = jQuery("#nav-site-search").hasClass("open");
        if (!megaOpen && !searchOpen) {
          jQuery(".all-header").removeClass("not_scrolled_hover");
        }
      }
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
      // Always call applyScrolledState to handle all conditions (mega menu, scroll, etc.)
      applyScrolledState();

      if (jQuery(this).scrollTop() > 0) {
        jQuery(".all-header").addClass("scrolled");
        // Only remove hover if mega menu is not open
        const megaOpen = jQuery(".mega-panel:visible").length > 0;
        if (!megaOpen) {
          jQuery(".all-header").removeClass("not_scrolled_hover");
        }
      } else {
        jQuery(".all-header").removeClass("scrolled");
        // When at top, if mega menu is open, maintain hover state
        const megaOpen = jQuery(".mega-panel:visible").length > 0;
        if (megaOpen) {
          jQuery(".all-header").addClass("not_scrolled_hover");
        }
      }
    });

    jQuery(".all-header").hover(
      function () {
        // Only add hover class if:
        // 1. Page is not scrolled
        // 2. Mega menu is not open
        // 3. Search is not open
        const isScrolled = jQuery(window).scrollTop() > 0;
        const megaOpen = jQuery(".mega-panel:visible").length > 0;
        const searchOpen = jQuery("#nav-site-search").hasClass("open");

        if (!isScrolled && !megaOpen && !searchOpen) {
          jQuery(".all-header").addClass("not_scrolled_hover");
          jQuery(".all-header:not(.scrolled) .site-logo img").attr(
            "src",
            "./image/main-logo-black.svg",
          );
          applyScrolledState(); // Update header state when hover is added
        }
      },
      function () {
        // Only remove hover class if page is not scrolled and mega menu/search is not open
        const isScrolled = jQuery(window).scrollTop() > 0;
        const megaOpen = jQuery(".mega-panel:visible").length > 0;
        const searchOpen = jQuery("#nav-site-search").hasClass("open");
        const sidebarOpen = jQuery("#mainmenu").hasClass("active");
        const wishlistOpen = !jQuery("#wishlistSidebar").hasClass("translate-x-full");
        const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");

        // Check if mouse is still over any menu item or header before removing hover
        // This prevents removing hover when moving between menu items
        // Use a longer delay to allow menu item mouseenter to fire first
        setTimeout(function () {
          const stillOnMenu = jQuery("#mainmenu > ul > li:hover").length > 0;
          const stillOnHeader = jQuery(".all-header:hover").length > 0;
          const stillOnMegaPanel = jQuery(".mega-panel:hover").length > 0;

          // Don't remove hover if mega menu is open, mouse is still on menu, header, or mega panel
          // Also check if any sidebar is open
          if (!isScrolled && !megaOpen && !searchOpen && !sidebarOpen && !wishlistOpen && !cartOpen && !stillOnMenu && !stillOnHeader && !stillOnMegaPanel) {
            jQuery(".all-header").removeClass("not_scrolled_hover");
            jQuery(".all-header:not(.scrolled) .site-logo img").attr(
              "src",
              "./image/main-logo-white.svg",
            );
          }
          // Always call applyScrolledState to ensure correct state
          applyScrolledState();
        }, 150);
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
