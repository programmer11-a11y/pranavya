jQuery(document).ready(function () {
  // Marquee track duplication
  jQuery(".marquee-track").each(function () {
    var $track = jQuery(this);
    var $item = $track.find(".marquee").first();

    if ($track.children(".marquee").length === 1) {
      $track.append($item.clone());
    }
  });

  // ===== Mega Iitem Js ===== //
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
        item
          .find(".mega-panel")
          .stop(true, true)
          .fadeOut(150, function () {
            // Call after fadeOut animation completes
            const isScrolled = jQuery(window).scrollTop() === 0;
            const megaOpen = jQuery(".mega-panel:visible").length > 0;
            const sidebarOpen = jQuery("#mainmenu").hasClass("active");
            const searchOpen = jQuery("#nav-site-search").hasClass("open");

            // Check if mouse moved to another menu item or overlay before removing hover
            // Use a small delay to allow other menu item's mouseenter to fire first
            setTimeout(function () {
              const stillOnMenu =
                jQuery("#mainmenu > ul > li:hover").length > 0;
              const stillOnHeader = jQuery(".all-header:hover").length > 0;
              const overlayVisible =
                !jQuery(".bg_body_box").hasClass("hidden") &&
                jQuery(".bg_body_box").css("display") !== "none";

              // Only remove hover if mouse is not on any menu item AND not on header
              // If mouse moved to overlay (overlay is visible but mouse not on header), remove hover
              if (
                isScrolled === false &&
                !megaOpen &&
                !sidebarOpen &&
                !searchOpen &&
                !stillOnMenu &&
                !stillOnHeader
              ) {
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
        jQuery("#mainmenu .mega-panel")
          .stop(true, true)
          .fadeOut(150, function () {
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
          top: "4px",
          left: "0",
          width: "100%",
          height: "100vh",
          backgroundColor: "#fff",
          zIndex: "9999",
          transform: "translateX(100%)", // Off-screen to the right
          opacity: "0",
          visibility: "hidden",
          display: "block",
        });

        fixInnerTextWhite();

        // Use requestAnimationFrame to ensure styles are applied
        requestAnimationFrame(function () {
          // Make panel visible but still off-screen
          panel.css({
            visibility: "visible",
            opacity: "1",
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
                    { transform: "translateX(0)" }, // End at center (on-screen)
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
            <button class="mobile-back-btn w-full text-left py-3 border-b border-[#673E2C33] text-thunder-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                <path d="M5.98377 11.2168L0.75 5.98302L5.98377 0.74925M1.47691 5.98302L12.0898 5.98302" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
                <span class="uppercase sm:text-lg text-base">${parentTitle}</span>
            </button>
            </div>
          `);
        }
      },
    );

    // CLOSE SUBMENU
    jQuery(document).on("click.mobileBackBtn", ".mobile-back-btn", function () {
      const panel = jQuery(this).closest(".mega-panel");
      const wrap = panel.closest(".has-mega");

      if (panel[0] && panel[0].animate) {
        const anim = panel[0].animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(110%)" }],
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
    });

    // THIRD-LEVEL: Nested menu items (mobile only, step 3)
    // STEP 3 OPEN
    $(document).on("click", "#mainmenu .mega-panel li.group > a", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const $li = $(this).closest("li.group");
      const submenu = $li.find("> div ul").first();

      if (!submenu.length) return;

      const title = $(this).text().trim();
      const panelId = "mobile-step3";

      let $panel = $("#" + panelId);

      if (!$panel.length) {
        $panel = $(`
      <div id="${panelId}" class="mobile-drawer">
        <div class="px-4 py-3 border-b border-[#673E2C33] flex items-center gap-3 sticky top-0 z-9999 bg-white">
          <button class="step3-back w-full flex items-center text-left gap-3 text-thunder-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
            <path d="M5.98377 11.2168L0.75 5.98302L5.98377 0.74925M1.47691 5.98302L12.0898 5.98302" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="uppercase sm:text-lg text-base">${title}</span>
          </button>
        </div>
        <div ><ul class="p-4 step3-content"></ul></div>
      </div>

    `);

        $("body").append($panel);
      }

      const content = $panel.find(".step3-content");
      content.empty();
      submenu.children("li").each(function () {
        content.append($(this).clone(true));
      });

      // Force reflow then animate
      requestAnimationFrame(() => {
        $panel.addClass("active");
      });
    });

    $(document).on("click", ".step3-back", function () {
      const panel = $(this).closest(".mobile-drawer");

      panel.removeClass("active");

      setTimeout(() => {
        panel.remove();
      }, 350);
    });
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
        if (
          !isScrolled &&
          !megaOpen &&
          !searchOpen &&
          !sidebarOpen &&
          !stillOnHeader &&
          !stillOnMenu
        ) {
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
      if (
        !isScrolled &&
        !megaOpen &&
        !searchOpen &&
        !sidebarOpen &&
        !stillOnHeader &&
        !stillOnMenu
      ) {
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

    // Only hide overlay if nothing else (mega, sidebar, wishlist, cart) is open
    const megaOpen = jQuery(".mega-panel:visible").length > 0;
    const sidebarOpen = jQuery("#mainmenu").hasClass("active");
    const wishlistOpen =
      !jQuery("#wishlistSidebar").hasClass("translate-x-full");
    const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");

    if (!megaOpen && !sidebarOpen && !wishlistOpen && !cartOpen) {
      hideOverlay();
    }

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
    // If search is not open, don't touch the overlay here
    const searchIsOpen = jQuery("#nav-site-search").hasClass("open");
    if (!searchIsOpen) return;

    if (
      !jQuery(event.target).closest("#nav-site-search, .site-search__open")
        .length
    ) {
      jQuery("#nav-site-search").removeClass("search_bar");

      // Only hide overlay if nothing else (mega, sidebar, wishlist, cart) is open
      const megaOpen = jQuery(".mega-panel:visible").length > 0;
      const sidebarOpen = jQuery("#mainmenu").hasClass("active");
      const wishlistOpen =
        !jQuery("#wishlistSidebar").hasClass("translate-x-full");
      const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");

      if (!megaOpen && !sidebarOpen && !wishlistOpen && !cartOpen) {
        hideOverlay();
      }
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
  const WHITE_LOGO = "../image/main-logo-white.svg";
  const BLACK_LOGO = "../image/main-logo-black.svg";
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

    // Check if header has no-toggle-color class
    // When no-toggle-color is present, logo and icon colors should not toggle (stay dark/black)
    const header = jQuery(".all-header").closest("header");
    const hasNoToggleColor =
      header.length > 0 && header.hasClass("no-toggle-color");

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
      // LOGO - Always black when useBlack is true, regardless of no-toggle-color
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
      // LOGO - Toggle based on no-toggle-color
      if (hasNoToggleColor) {
        // If no-toggle-color, keep logo as dark (black) - don't toggle to white
        siteLogo.attr("src", BLACK_LOGO);
      } else {
        // Normal behavior: show white logo when not scrolled/hovered
        siteLogo.attr("src", WHITE_LOGO);
      }

      // TEXT + ICONS - Toggle based on no-toggle-color
      if (hasNoToggleColor) {
        // If no-toggle-color, keep icons/text as black (don't toggle to white) - ensure black everywhere
        jQuery(
          ".all-header > .container .menu_link_text, .all-header > .container .site-search__open, .all-header > .container .nav-icon",
        )
          .removeClass("text-white")
          .addClass("text-black-100");
      } else {
        // Normal behavior: show white icons/text when not scrolled/hovered
        jQuery(
          ".all-header > .container .menu_link_text, .all-header > .container .site-search__open, .all-header > .container .nav-icon",
        )
          .removeClass("text-black-100")
          .addClass("text-white");
      }

      // Header BG - Remove bg-white to make it transparent (unless bg-color class is present)
      if (!header.hasClass("bg-color")) {
        jQuery(".all-header").removeClass("bg-white");
      }
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

    // 🔥 Handle header positioning when no-toggle-color is present
    // When no-toggle-color is present: relative when not scrolled, fixed when scrolled
    if (hasNoToggleColor) {
      if (scrolled) {
        // Page scrolled: make header fixed
        header.removeClass("fixed").addClass("fixed");
      } else {
        // Page not scrolled: make header relative
        header.removeClass("fixed").addClass("fixed");
      }
    }
  }

  // Run once on load - ensure initial state is correct
  // Remove hover state if nothing is open and page is not scrolled
  if (jQuery(window).scrollTop() === 0) {
    const megaOpen = jQuery(".mega-panel:visible").length > 0;
    const sidebarOpen = jQuery("#mainmenu").hasClass("active");
    const searchOpen = jQuery("#nav-site-search").hasClass("open");
    const wishlistOpen =
      !jQuery("#wishlistSidebar").hasClass("translate-x-full");
    const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");

    if (
      !megaOpen &&
      !sidebarOpen &&
      !searchOpen &&
      !wishlistOpen &&
      !cartOpen
    ) {
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
    const wishlistOpen =
      !jQuery("#wishlistSidebar").hasClass("translate-x-full");
    const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");
    const hasHover = jQuery(".all-header").hasClass("not_scrolled_hover");
    const stillOnHeader = jQuery(".all-header:hover").length > 0;
    const stillOnMenu = jQuery("#mainmenu > ul > li:hover").length > 0;
    const stillOnMegaPanel = jQuery(".mega-panel:hover").length > 0;

    // If hover class is active but mouse is not on header/menu/mega panel and nothing else is open, remove it
    if (
      hasHover &&
      !isScrolled &&
      !megaOpen &&
      !sidebarOpen &&
      !searchOpen &&
      !wishlistOpen &&
      !cartOpen &&
      !stillOnHeader &&
      !stillOnMenu &&
      !stillOnMegaPanel
    ) {
      jQuery(".all-header").removeClass("not_scrolled_hover");
      applyScrolledState();
    }
  }, 200);

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
  jQuery(document).on("click", "button[name='mobile-menu-view']", function () {
    jQuery("#mainmenu").addClass("active");
    jQuery("html,body").addClass("overflow-hidden");
  });

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
  jQuery(document).ready(function ($) {
    $(".video-popup").magnificPopup({
      type: "iframe",
      preloader: false,
      fixedContentPos: false,
      closeBtnInside: true,

      iframe: {
        patterns: {
          youtube: {
            index: "youtube.com/",
            id: function (url) {
              const match = url.match(/[?&]v=([^&]+)/);
              return match ? match[1] : null;
            },
          },
        },
      },
    });
  });

  // ===== Weekly Schedule Tabs ===== //
  /* ----------------------------
     TAB CLICK (EXISTING LOGIC)
  -----------------------------*/
  jQuery(document).ready(function () {
    const $schedule = $("#schedule");

    if (!$schedule.length) return;

    const $tabs = $schedule.find(".schedule-tab");
    const $panels = $schedule.find(".schedule-panel");
    const $select = $schedule.find("select");

    // ===============================
    // INITIAL STATE
    // ===============================
    $tabs.removeClass("is-active");
    $panels.addClass("hidden");

    const $firstTab = $tabs.first();
    const firstTarget = $firstTab.data("target");

    $firstTab.addClass("is-active");
    $schedule.find(firstTarget).removeClass("hidden");

    // ===============================
    // TAB CLICK
    // ===============================
    $tabs.on("click", function () {
      const target = $(this).data("target");

      $tabs.removeClass("is-active");
      $panels.addClass("hidden");

      $(this).addClass("is-active");
      $schedule.find(target).removeClass("hidden");
    });

    // ===============================
    // MOBILE SELECT
    // ===============================
    $select.on("change", function () {
      const target = $(this).val();

      $tabs.removeClass("is-active");
      $schedule
        .find(`.schedule-tab[data-target="${target}"]`)
        .addClass("is-active");

      $panels.addClass("hidden");
      $schedule.find(target).removeClass("hidden");
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
      640: { slidesPerView: 2, spaceBetween: 10 },
      768: { slidesPerView: 2.9, spaceBetween: 10 },
      769: { slidesPerView: 2.9, spaceBetween: 17 },
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

      // Check if header has no-toggle-color class
      const header = jQuery(".all-header").closest("header");
      const hasNoToggleColor =
        header.length > 0 && header.hasClass("no-toggle-color");

      if (!isScrolled && !megaOpen && !searchOpen) {
        jQuery(".all-header").addClass("not_scrolled_hover");
        // Only toggle logo if no-toggle-color is not present
        if (!hasNoToggleColor) {
          jQuery(".all-header:not(.scrolled) .site-logo img").attr(
            "src",
            "../image/main-logo-black.svg",
          );
        }
        applyScrolledState(); // Update header state when hover is added
      }
    },
    function () {
      // Only remove hover class if page is not scrolled and mega menu/search is not open
      const isScrolled = jQuery(window).scrollTop() > 0;
      const megaOpen = jQuery(".mega-panel:visible").length > 0;
      const searchOpen = jQuery("#nav-site-search").hasClass("open");
      const sidebarOpen = jQuery("#mainmenu").hasClass("active");
      const wishlistOpen =
        !jQuery("#wishlistSidebar").hasClass("translate-x-full");
      const cartOpen = !jQuery("#cartSidebar").hasClass("translate-x-full");

      // Check if header has no-toggle-color class
      const header = jQuery(".all-header").closest("header");
      const hasNoToggleColor =
        header.length > 0 && header.hasClass("no-toggle-color");

      // Check if mouse is still over any menu item or header before removing hover
      // This prevents removing hover when moving between menu items
      // Use a longer delay to allow menu item mouseenter to fire first
      setTimeout(function () {
        const stillOnMenu = jQuery("#mainmenu > ul > li:hover").length > 0;
        const stillOnHeader = jQuery(".all-header:hover").length > 0;
        const stillOnMegaPanel = jQuery(".mega-panel:hover").length > 0;

        // Don't remove hover if mega menu is open, mouse is still on menu, header, or mega panel
        // Also check if any sidebar is open
        if (
          !isScrolled &&
          !megaOpen &&
          !searchOpen &&
          !sidebarOpen &&
          !wishlistOpen &&
          !cartOpen &&
          !stillOnMenu &&
          !stillOnHeader &&
          !stillOnMegaPanel
        ) {
          jQuery(".all-header").removeClass("not_scrolled_hover");
          // Only toggle logo if no-toggle-color is not present
          if (!hasNoToggleColor) {
            jQuery(".all-header:not(.scrolled) .site-logo img").attr(
              "src",
              "../image/main-logo-white.svg",
            );
          }
        }
        // Always call applyScrolledState to ensure correct state
        applyScrolledState();
      }, 150);
    },
  );
});

// our-classes.js
document.addEventListener("DOMContentLoaded", () => {
  const slideId = document.querySelector(".slide-id");
  const slideTitle = document.querySelector(".slide-title");
  const slideDesc = document.querySelector(".slide-desc");
  const slideImg = document.querySelector(".slide-img");
  const slideIcon = document.querySelector(".slide-icon");
  const viewBtn = document.querySelector(".slide-button");
  const classTab = document.querySelectorAll(".class-tab");

  // ✅ STOP if slider markup does not exist
  if (
    !slideId ||
    !slideTitle ||
    !slideDesc ||
    !slideImg ||
    !slideIcon ||
    !viewBtn ||
    !classTab.length
  ) {
    return;
  }

  const slides = [
    {
      id: "01",
      title: "HATHA YOGA",
      desc: "Perfect for beginners and anyone looking to build a strong foundation.",
      image: "../image/hatha-yoga.webp",
      icon: "../image/hatha-yoga.svg",
      link: "./class-detail-1.html",
    },
    {
      id: "02",
      title: "VINYASA FLOW YOGA",
      desc: "A dynamic style of yoga that links movement with breath.",
      image: "../image/vinyasa-flow-yoga.webp",
      icon: "../image/vinyasa-flow-yoga.svg",
      link: "./class-detail-2.html",
    },
    {
      id: "03",
      title: "PRANAYAMA YOGA",
      desc: "Focuses on breath control practices that enhance vitality.",
      image: "../image/pranayama-yoga.webp",
      icon: "../image/pranayama-yoga.svg",
      link: "./class-detail-3.html",
    },
    {
      id: "04",
      title: "YIN YOGA",
      desc: "Slow, deep stretches that target connective tissues.",
      image: "../image/yin-yoga.webp",
      icon: "../image/yin-yoga.svg",
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
    classTab.forEach((btn) => btn.classList.remove("active"));
    classTab[index].classList.add("active");
  }

  // Init first slide
  updateSlide(0);

  // Click handling
  classTab.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.slide, 10);
      updateSlide(index);
    });
  });
});

// ========validation form logic===============
(function ($) {
  // Phone input - only allow digits and max 10 characters
  $(document).on("input", ".phone-input", function (e) {
    var value = $(this).val();
    // Remove any non-digit characters
    value = value.replace(/\D/g, "");
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    $(this).val(value);
  });

  // Prevent paste of non-numeric characters in phone input
  $(document).on("paste", ".phone-input", function (e) {
    e.preventDefault();
    var pastedText = (e.originalEvent.clipboardData || window.clipboardData).getData("text");
    // Remove any non-digit characters from pasted text
    var cleanText = pastedText.replace(/\D/g, "").substring(0, 10);
    $(this).val(cleanText);
  });

  // Prevent non-numeric keypress in phone input
  $(document).on("keypress", ".phone-input", function (e) {
    // Allow only digits (0-9)
    if (e.which < 48 || e.which > 57) {
      e.preventDefault();
    }
    // Prevent if already 10 digits
    if ($(this).val().length >= 10) {
      e.preventDefault();
    }
  });

  $(document).on("submit", ".validate-form", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var $form = $(this);
    var valid = true;

    var $successMsg = $form.find(".form-success-msg");
    $successMsg.addClass("hidden").text("");

    $form
      .find("input[required], textarea[required], select[required]")
      .each(function () {
        var $input = $(this);
        removeError($input);

        if ($input.attr("type") === "checkbox" && !$input.is(":checked")) {
          showError($input, "This field is required.");
          valid = false;
        } else if (!$input.val() || !$input.val().trim()) {
          var fieldName = $input.attr("name") || "This field";
          // Format field name for display
          fieldName = fieldName.replace(/_/g, " ").replace(/\b\w/g, function (l) {
            return l.toUpperCase();
          });
          showError($input, fieldName + " is required.");
          valid = false;
        } else if (
          $input.attr("type") === "email" &&
          !this.validity.valid
        ) {
          showError($input, "Please enter a valid email address.");
          valid = false;
        } else if (
          $input.hasClass("phone-input") &&
          $input.val().length !== 10
        ) {
          showError($input, "Please enter a valid 10-digit phone number.");
          valid = false;
        }
      });

    if (!valid) return;

    var successText =
      $form.data("success") || "Form submitted successfully!";

    $successMsg.removeClass("hidden").html(successText);

    // 🔔 POPUP AFTER 5 SECONDS (ONLY IF DATA-POPUP EXISTS)
    var popupId = $form.data("popup");
    if (popupId) {
      setTimeout(function () {
        $("#" + popupId)
          .removeClass("hidden")
          .addClass("flex");
      }, 1000);
    }

    $form[0].reset();

    // Reset dropdown texts back to placeholder
    $form.find(".dropdown").each(function () {
      var $dropdown = $(this);
      var $dropdownText = $dropdown.find(".dropdown-text");
      var placeholderText = $dropdownText.data("placeholder") || $dropdownText.text();
      $dropdownText.addClass("text-thunder-100/50");
    });
  });

  $(document).on("click", ".popup-close", function () {
    $(this).closest(".fixed").addClass("hidden").removeClass("flex");
  });

  $(document).on(
    "input change",
    ".validate-form input, .validate-form textarea, .validate-form select",
    function () {
      removeError($(this));
      $(this)
        .closest("form")
        .find(".form-success-msg")
        .addClass("hidden")
        .text("");
    }
  );

  // Show error on blur for inputs and dropdowns
  $(document).on(
    "blur",
    ".validate-form input[required]:not([type='hidden']), .validate-form textarea[required], .validate-form select[required]",
    function () {
      var $input = $(this);
      if (!$input.val() || !$input.val().trim()) {
        var fieldName = $input.attr("name") || "This field";
        fieldName = fieldName.replace(/_/g, " ").replace(/\b\w/g, function (l) {
          return l.toUpperCase();
        });
        showError($input, fieldName + " is required.");
      } else if ($input.hasClass("phone-input") && $input.val().length !== 10) {
        showError($input, "Please enter a valid 10-digit phone number.");
      } else if ($input.attr("type") === "email" && !$input[0].validity.valid) {
        showError($input, "Please enter a valid email address.");
      }
    }
  );

  function showError($input, message) {
    var $target;

    // 🔥 If hidden input (dropdown)
    if ($input.attr("type") === "hidden") {
      $target = $input.closest(".dropdown").find(".dropdown-btn");
    } else {
      $target = $input;
    }

    $target.addClass("input-error");

    if ($target.next(".error-msg").length) return;

    $target.after(`
      <div class="error-msg text-red-600 text-sm mt-1">
        ${message}
      </div>
    `);
  }


  function removeError($input) {
    var $target =
      $input.attr("type") === "hidden"
        ? $input.closest(".dropdown").find(".dropdown-btn")
        : $input;

    $target.removeClass("input-error");
    $target.next(".error-msg").remove();
  }

  $(document).on("click", ".dropdown-item", function () {
    var value = $(this).text().trim();
    var $dropdown = $(this).closest(".dropdown");

    $dropdown.find("input[type='hidden']").val(value).trigger("change");
    $dropdown.find(".dropdown-text").text(value).removeClass("text-thunder-100/50");
  });


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

  // =================== END INDEX-2.HTML ========================

  // =================== START INDEX-3.HTML ========================

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

var swiper = new Swiper(".home-3-hero", {
  direction: "horizontal",
  slidesPerView: 1.3,
  spaceBetween: 0,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  centeredSlides: true,
  loop: true,
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 2, direction: "horizontal" },
    769: { slidesPerView: 2.5, spaceBetween: 6, direction: "horizontal" },
    992: { slidesPerView: 3, spaceBetween: 6, direction: "vertical" },
    1131: { slidesPerView: 3, spaceBetween: 6, direction: "vertical" },
    1281: { slidesPerView: 3, spaceBetween: 6, direction: "vertical" },
    1500: { slidesPerView: 3, spaceBetween: 9, direction: "vertical" },
  },
});

var swiper = new Swiper(".home-3_classes", {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    500: { slidesPerView: 1.4, spaceBetween: 25 },
    769: { slidesPerView: 1.5, spaceBetween: 30 },
    992: { slidesPerView: 2.05, spaceBetween: 30 },
    1131: { slidesPerView: 2.1, spaceBetween: 40 },
    1281: { slidesPerView: 2.15, spaceBetween: 40 },
    1500: { slidesPerView: 2.23, spaceBetween: 50 },
  },
});

// NAVBAR SHOP
var swiper = new Swiper(".home-3_instagram", {
  slidesPerView: 1.7,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  autoplay: true,
  breakpoints: {
    376: { slidesPerView: 2.2, spaceBetween: 12 },
    426: { slidesPerView: 2.7, spaceBetween: 12 },
    500: { slidesPerView: 3.3, spaceBetween: 12 },
    992: { slidesPerView: 4, spaceBetween: 12 },
    1131: { slidesPerView: 5, spaceBetween: 12 },
  },
});

// =================== END INDEX-3.HTML ========================

// =================== START INDEX-4.HTML ========================
var swiper = new Swiper(".why-choose", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: ".why-choose-home-4 .swiper-button-next",
    prevEl: ".why-choose-home-4 .swiper-button-prev",
  },
  breakpoints: {
    456: { slidesPerView: 2, spaceBetween: 20 },
    769: { slidesPerView: 2, spaceBetween: 30 },
    992: { slidesPerView: 1, spaceBetween: 30 },
    1131: { slidesPerView: 2, spaceBetween: 20 },
    1281: { slidesPerView: 2, spaceBetween: 25 },
    1500: { slidesPerView: 2, spaceBetween: 30 },
    1768: { slidesPerView: 2, spaceBetween: 40 },
  },
});

var swiper = new Swiper(".home-4_reviews .home-4_testimonial", {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: ".home-4_reviews .swiper-button-next",
    prevEl: ".home-4_reviews .swiper-button-prev",
  },
  breakpoints: {
    577: { slidesPerView: 2, spaceBetween: 16 },
    769: { slidesPerView: 2, spaceBetween: 20 },
    992: { slidesPerView: 2, spaceBetween: 20 },
    1131: { slidesPerView: 3, spaceBetween: 20 },
    1281: { slidesPerView: 3, spaceBetween: 24 },
  },
});

$(document).ready(function () {
  $("[data-marquee]").each(function () {
    const $track = $(this);
    const $items = $track.children().clone();

    // Append cloned items once (now total = 2x)
    $track.append($items);
  });
});
// =================== END INDEX-4.HTML ========================

// =============== START MEMBERSHIP =================================
$(document).ready(function () {
  // Initial state
  $(".yearly-plans").hide();
  $(".monthly-plans").show();

  function setActive(btn) {
    $(".toggle-btn")
      .removeClass("bg-white text-primary")
      .addClass("bg-primary text-white");

    btn.removeClass("bg-primary text-white").addClass("bg-white text-primary");
  }

  $("#monthlyBtn").on("click", function () {
    setActive($(this));

    $(".yearly-plans").hide();
    $(".monthly-plans").fadeIn(200);
  });

  $("#yearlyBtn").on("click", function () {
    setActive($(this));

    $(".monthly-plans").hide();
    $(".yearly-plans").fadeIn(200);
  });
});

var swiper = new Swiper(".membership-step", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: ".join-membership .swiper-button-next",
    prevEl: ".join-membership .swiper-button-prev",
  },
  breakpoints: {
    456: { slidesPerView: 2, spaceBetween: 20 },
    769: { slidesPerView: 2, spaceBetween: 20 },
    992: { slidesPerView: 3, spaceBetween: 20 },
    1131: { slidesPerView: 3, spaceBetween: 20 },
    1281: { slidesPerView: 4, spaceBetween: 25 },
    1500: { slidesPerView: 4, spaceBetween: 30 },
    1768: { slidesPerView: 4, spaceBetween: 40 },
  },
});

$(document).ready(function () {
  // Ensure headings start with default color & transition
  $(".faq-item h5")
    .removeClass("text-primary")
    .addClass("text-thuder-100 transition-colors duration-300");

  // Open first FAQ by default and set its title color
  const $first = $(".faq-item:first");
  $first.addClass("active");
  $first.find(".faq-answer").slideDown(400);
  $first.find(".faq-icon").text("−");
  $first.find("h5").removeClass("text-thuder-100").addClass("text-primary");
  $first.find(".faq-question").attr("aria-expanded", "true");

  $(".faq-question").on("click", function () {
    const parent = $(this).closest(".faq-item");
    const answer = parent.find(".faq-answer");
    const icon = parent.find(".faq-icon");
    const btn = $(this);

    // Close others: hide answers, reset icons & title color & aria
    $(".faq-item")
      .not(parent)
      .removeClass("active")
      .find(".faq-answer")
      .stop(true, true)
      .slideUp(400);
    $(".faq-item").not(parent).find(".faq-icon").text("+");
    $(".faq-item")
      .not(parent)
      .find("h5")
      .removeClass("text-primary")
      .addClass("text-thuder-100");
    $(".faq-item")
      .not(parent)
      .find(".faq-question")
      .attr("aria-expanded", "false");

    // Toggle current
    const isOpen = parent.hasClass("active");
    if (isOpen) {
      parent.removeClass("active");
      answer.stop(true, true).slideUp(400);
      icon.text("+");
      parent.find("h5").removeClass("text-primary").addClass("text-thuder-100");
      btn.attr("aria-expanded", "false");
    } else {
      parent.addClass("active");
      answer.stop(true, true).slideDown(400);
      icon.text("−");
      parent.find("h5").removeClass("text-thuder-100").addClass("text-primary");
      btn.attr("aria-expanded", "true");
    }
  });
});

// =============== END MEMBERSHIP =================================

// =============== START CLASSES =================================
$(document).ready(function () {
  $(".dropdown-btn").on("click", function (e) {
    e.stopPropagation();

    const dropdown = $(this).closest(".dropdown");
    const menu = dropdown.find(".dropdown-menu");
    const arrow = dropdown.find(".dropdown-arrow");

    $(".dropdown-menu").not(menu).removeClass("open");
    $(".dropdown-arrow").not(arrow).removeClass("rotate-180");

    menu.toggleClass("open");
    arrow.toggleClass("rotate-180");
  });

  // ✅ THIS LINE FIXES CHECKBOX ISSUE
  $(".dropdown-menu").on("click", function (e) {
    e.stopPropagation();
  });

  $(".dropdown-item").on("click", function () {
    const dropdown = $(this).closest(".dropdown");
    const textEl = dropdown.find(".dropdown-text");
    const hiddenInput = dropdown.find("input[type='hidden']");
    const selectedText = $(this).text().trim();

    textEl.text(selectedText)
      .removeClass("text-thunder-100/50")
      .addClass("text-thunder-100");

    hiddenInput.val(selectedText).trigger("change");

    if (selectedText === "All Category") {
      textEl
        .removeClass("text-thunder-100")
        .addClass("text-thunder-100/50");
    } else {
      textEl
        .removeClass("text-thunder-100/50")
        .addClass("text-thunder-100");
    }

    dropdown.find(".dropdown-menu").removeClass("open");
    dropdown.find(".dropdown-arrow").removeClass("rotate-180");
  });

  $(document).on("click", function () {
    $(".dropdown-menu").removeClass("open");
    $(".dropdown-arrow").removeClass("rotate-180");
  });
});


// =============== END CLASSES =================================

// ============== PODCAST MUSIC PLAYER =================
$(document).ready(function () {
  $(".podcast-player").each(function () {
    const player = $(this);
    const audio = player.find("audio")[0];
    audio.src = player.data("audio");
    const playBtn = player.find(".play-btn");
    const muteBtn = player.find(".mute-btn");
    const speedBtn = player.find(".speed-btn");
    const progressBar = player.find(".progress-bar");
    const progressFill = player.find(".progress-fill");
    /* PLAY / PAUSE */
    playBtn.on("click", function () {
      const isPaused = audio.paused;
      $("audio").each(function () {
        this.pause();
        $(this)
          .closest(".podcast-player")
          .find(".icon-play")
          .removeClass("hidden")
          .end()
          .find(".icon-pause")
          .addClass("hidden");
      });
      if (isPaused) {
        audio.play();
        playBtn.find(".icon-play").addClass("hidden");
        playBtn.find(".icon-pause").removeClass("hidden");
      }
    });

    /* REWIND / FORWARD */
    player
      .find(".rewind-btn")
      .on("click", () => (audio.currentTime -= 10));
    player.find(".forward-btn").on("click", () => (audio.currentTime += 10));
    /* MUTE */ muteBtn.on("click", function () {
      audio.muted = !audio.muted;
      muteBtn.find(".icon-volume").toggleClass("hidden");
      muteBtn.find(".icon-muted").toggleClass("hidden");
    });


    /* SPEED */
    speedBtn.on("click", function () {
      let speed = audio.playbackRate;

      if (speed === 1) {
        audio.playbackRate = 1.5;
      } else if (speed === 1.5) {
        audio.playbackRate = 2;
      } else {
        audio.playbackRate = 1;
      }

      // optional: console check
      console.log("Playback speed:", audio.playbackRate);
    });


    /* PROGRESS */
    audio.addEventListener("timeupdate", function () {
      progressFill.css(
        "width",
        (audio.currentTime / audio.duration) * 100 + "%",
      );
      player.find(".current-time").text(format(audio.currentTime));
    });
    progressBar.on("click", function (e) {
      audio.currentTime = (e.offsetX / $(this).width()) * audio.duration;
      audio.play();
      playBtn.find(".icon-play").addClass("hidden");
      playBtn.find(".icon-pause").removeClass("hidden");
    });
    audio.addEventListener("loadedmetadata", () =>
      player.find(".duration").text(format(audio.duration)),
    );
    audio.addEventListener("ended", function () {
      playBtn.find(".icon-play").removeClass("hidden");
      playBtn.find(".icon-pause").addClass("hidden");
      progressFill.css("width", "0%");
    });
  });
  function format(t) {
    return (
      Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0")
    );
  }
});

// ============== PODCAST VIDEO PLAYER =================
$(document).ready(function () {

  const headerHeight = $("header").outerHeight();
  const $featuredSection = $("#featuredEpisode");
  const videoEl = $("#featuredVideo")[0];

  function loadEpisode($card, autoplay = false) {

    const episode = $card.find(".episode-no").text().trim();
    const title = $card.find(".episode-title").text().trim();
    const desc = $card.find(".episode-desc").text().trim();
    const time = $card.find(".episode-time").text().trim();
    const name = $card.find(".episode-name").text().trim();
    const video = $card.find(".episode-video-src source").attr("src");

    $("#featuredEpisodeNo").text(episode);
    $("#featuredTitle").text(title);
    $("#featuredDesc").text(desc);
    $("#featuredTime").text(time);
    $("#featuredName").text(name);

    videoEl.pause();
    videoEl.src = video;
    videoEl.load();


    if (autoplay) {
      videoEl.play().catch(() => { });
    }
  }

  /* 🔹 LOAD FIRST EPISODE FROM LIST (NO AUTOPLAY) */
  const $firstEpisode = $(".episode-card").first();
  if ($firstEpisode.length) {
    loadEpisode($firstEpisode, false);
  }
  /* 🔹 CLICK HANDLER */
  $(".episode-card").on("click", function () {
    loadEpisode($(this), true);

    const scrollTop =
      $featuredSection.offset().top - headerHeight - 10;

    $("html, body").animate({ scrollTop }, 700);
  });

});

// ============== EVENTS DETAIL VIDEO BUTTON =================
jQuery(document).ready(function ($) {

  const $video = $("#eventVideo");
  const $playBtn = $(".video-play");

  // Play video on center button click
  $playBtn.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    $video.get(0).play();
    $video.attr("controls", true);
    $playBtn.fadeOut(200);
  });

  // Show button again on pause
  $video.on("pause ended", function () {
    $playBtn.fadeIn(200);
  });

});

// ============== SHOP GRID-LIST VIEW CHANGE BUTTON =================
$(document).ready(function () {
  // ✅ Grid/List Toggle Function (Your Existing)
  window.toggleView = function (viewType) {
    const $gridView = $('#grid-view');
    const $listView = $('#list-view');
    const $gridBtn = $('#grid-btn');
    const $listBtn = $('#list-btn');

    if (viewType === 'grid') {
      $gridView.removeClass('hidden');
      $listView.addClass('hidden');
      $gridBtn.addClass('active');
      $listBtn.removeClass('active');
    } else {
      $gridView.addClass('hidden');
      $listView.removeClass('hidden');
      $gridBtn.removeClass('active');
      $listBtn.addClass('active');
    }
  };

  // ✅ Shop sidebar filters
  // Mobile (<lg): whole FILTER is one dropdown (full section)
  // Desktop (>=lg): keep sidebar open as-is
  $(document).ready(function () {
    const LG_BREAKPOINT = 1024; // Tailwind 'lg' default

    function isMobileFilterMode() {
      return window.innerWidth < LG_BREAKPOINT;
    }

    function syncShopFilterUI() {
      const mobileMode = isMobileFilterMode();

      const $panel = $(".shop-filter-panel");
      const $panelIcon = $(".shop-filter-mobile-icon");

      if (mobileMode) {
        // Closed by default on mobile
        $panel.hide();
        $panelIcon.text("+");
      } else {
        // Always open on desktop
        $panel.show();
        $panelIcon.text("−");
      }
    }

    // Initial sync + on resize
    syncShopFilterUI();
    $(window).on("resize", function () {
      syncShopFilterUI();
    });

    // Mobile: toggle whole filter panel
    $(".shop-filter-mobile-toggle").on("click", function () {
      if (!isMobileFilterMode()) return;

      const $panel = $(".shop-filter-panel");
      const $icon = $(".shop-filter-mobile-icon");

      $panel.stop(true, true).slideToggle(200, function () {
        $icon.text($panel.is(":visible") ? "−" : "+");
      });
    });

    // Per-section toggles: collapse/expand each filter group
    $(document).on("click", ".filter-toggle", function (e) {
      e.preventDefault();

      const $toggle = $(this);
      const $box = $toggle.closest(".filter-box");
      const $content = $box.find(".filter-content").first();
      const $icon = $toggle.find(".toggle-icon").first();

      if ($content.length === 0) return;

      $content.stop(true, true).slideToggle(200, function () {
        const isOpen = $content.is(":visible");
        if ($icon.length) $icon.text(isOpen ? "−" : "+");
      });
    });
  });
});

// SHOP.HTML for toggle cart and wishlist icon toggle
$('.cart-btn').on('click', function () {
  $(this).toggleClass('active');
});

// SHOP-DETAIL
var swiper = new Swiper(".product-thumb", {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});
var swiper2 = new Swiper(".product", {
  spaceBetween: 10,
  thumbs: {
    swiper: swiper,
  },
});

// quantity counter
$(document).ready(function () {

  // PLUS
  $(document).on("click", "#increase", function () {
    const counter = $(this).closest("div").find("#quantity");

    let qty = parseInt(counter.text()) || 1;
    qty++;

    counter.text(qty);
  });

  // MINUS
  $(document).on("click", "#decrease", function () {
    const counter = $(this).closest("div").find("#quantity");

    let qty = parseInt(counter.text()) || 1;

    if (qty > 1) {
      qty--;
      counter.text(qty);
    }
  });
});



/* TOGGLE SHIPPING DETAI ON CHECKMARK */
$(document).ready(function () {
  // remove required initially
  $('.shipping-detail :input').prop('required', false);
  $('#different-address').on('change', function () {
    if (this.checked) {
      $('.shipping-detail')
        .removeClass('hidden')
        .hide()
        .stop(true, true)
        .slideDown(150);
      $('.shipping-detail :input').prop('required', true);
    } else {
      $('.shipping-detail')
        .stop(true, true)
        .slideUp(150, function () {
          $(this).addClass('hidden');
        });
      $('.shipping-detail :input').prop('required', false);
    }
  });
});



// SHOP PAGE PAGINATION
$(document).ready(function () {
  let currentPage = 1;
  let totalPages = 5;
  const visibleTabs = 4;

  function renderPagination() {
    const $pagination = $('#pagination');
    $pagination.empty();

    /* ===== PREVIOUS BUTTON ===== */
    if (currentPage > 1) {
      $pagination.append(`
        <li>
          <a href="#" id="prevBtn" class="nav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <g clip-path="url(#clip0_184_131)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.97462 6.77552C4.86214 6.88803 4.79895 7.04062 4.79895 7.19972C4.79895 7.35882 4.86214 7.5114 4.97462 7.62392L8.36882 11.0181C8.42417 11.0754 8.49037 11.1211 8.56357 11.1526C8.63678 11.184 8.71551 11.2006 8.79518 11.2013C8.87484 11.202 8.95385 11.1868 9.02759 11.1566C9.10133 11.1264 9.16832 11.0819 9.22465 11.0256C9.28099 10.9692 9.32554 10.9022 9.35571 10.8285C9.38588 10.7548 9.40106 10.6757 9.40037 10.5961C9.39968 10.5164 9.38312 10.4377 9.35168 10.3645C9.32023 10.2913 9.27452 10.2251 9.21722 10.1697L6.24722 7.19972L9.21722 4.22972C9.32651 4.11656 9.38699 3.96499 9.38562 3.80768C9.38426 3.65036 9.32115 3.49987 9.20991 3.38863C9.09866 3.27738 8.94818 3.21428 8.79086 3.21291C8.63354 3.21155 8.48198 3.27202 8.36882 3.38132L4.97462 6.77552Z" fill="#2D2D2D"/>
              </g>
            </svg>     
         </a>
        </li>
      `);
    }

    /* ===== CALCULATE PAGE WINDOW ===== */
    let startPage, endPage;

    if (currentPage <= 2) {
      startPage = 1;
      endPage = visibleTabs;
    } else if (currentPage >= totalPages - 1) {
      endPage = totalPages;
      startPage = totalPages - visibleTabs + 1;
    } else {
      startPage = currentPage - 1;
      endPage = startPage + visibleTabs - 1;
    }

    startPage = Math.max(1, startPage);
    endPage = Math.min(totalPages, endPage);

    /* ===== LEFT ELLIPSIS ===== */
    if (startPage > 1) {
      $pagination.append(`<li><span class="ellipsis">...</span></li>`);
    }

    /* ===== PAGE NUMBERS ===== */
    for (let i = startPage; i <= endPage; i++) {
      $pagination.append(`
        <li>
          <a href="#"
            class="page-link ${currentPage === i ? 'active' : ''}"
            data-page="${i}">
            ${i}
          </a>
        </li>
      `);
    }

    /* ===== RIGHT ELLIPSIS ===== */
    if (endPage < totalPages) {
      $pagination.append(`<li><span class="ellipsis">...</span></li>`);
    }

    /* ===== NEXT BUTTON ===== */
    if (currentPage < totalPages) {
      $pagination.append(`
        <li>
          <a href="#" id="nextBtn" class="nav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <g clip-path="url(#clip0_3549_60696)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.42577 6.77747C9.53826 6.88999 9.60144 7.04257 9.60144 7.20167C9.60144 7.36077 9.53826 7.51335 9.42577 7.62587L6.03157 11.0201C5.97623 11.0774 5.91002 11.1231 5.83682 11.1545C5.76361 11.186 5.68488 11.2025 5.60521 11.2032C5.52555 11.2039 5.44654 11.1887 5.3728 11.1586C5.29906 11.1284 5.23207 11.0838 5.17574 11.0275C5.1194 10.9712 5.07485 10.9042 5.04468 10.8304C5.01451 10.7567 4.99933 10.6777 5.00002 10.598C5.00071 10.5184 5.01727 10.4396 5.04871 10.3664C5.08016 10.2932 5.12587 10.227 5.18317 10.1717L8.15317 7.20167L5.18317 4.23167C5.07388 4.11851 5.0134 3.96695 5.01477 3.80963C5.01614 3.65231 5.07924 3.50182 5.19048 3.39058C5.30173 3.27933 5.45221 3.21623 5.60953 3.21487C5.76685 3.2135 5.91841 3.27398 6.03157 3.38327L9.42577 6.77747Z" fill="#2D2D2D"/>
              </g>
            </svg>
          </a>
        </li>
      `);
    }

    attachEvents();
  }

  function attachEvents() {
    $('.page-link').off().on('click', function (e) {
      e.preventDefault();
      currentPage = parseInt($(this).data('page'));
      renderPagination();
    });

    $('#prevBtn').off().on('click', function (e) {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderPagination();
      }
    });

    $('#nextBtn').off().on('click', function (e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderPagination();
      }
    });
  }

  /* ===== INITIAL RENDER ===== */
  renderPagination();
});



// DASHBOARD PAGE TURN 
$(document).ready(function () {
  $('.view-order').on('click', function () {
    $('#ordersList').hide();
    $('#orderDetails').fadeIn(300); // smooth show
    $('html, body').animate({ scrollTop: 0 }, 300);
  });

  // optional back button
  $('.back-to-orders').on('click', function () {
    $('#orderDetails').hide();
    $('#ordersList').fadeIn(300);
  });
});

// cancel order
$(document).ready(function () {
  function disableScroll() {
    $('html, body').addClass('lock-scroll');
  }
  function enableScroll() {
    $('html, body').removeClass('lock-scroll');
  }

  $('#cancelOrderBtn').on('click', function () {
    $('#cancelPopup').removeClass('hidden').addClass('flex');
    disableScroll();
  });

  // ❌ close button
  $('#closePopup, #keepOrder').on('click', function () {
    $('#cancelPopup').removeClass('flex').addClass('hidden');
    enableScroll();
  });

  $('#confirmCancel').on('click', function () {
    $('#cancelPopup').removeClass('flex').addClass('hidden');

    $('#successPopup').removeClass('hidden').addClass('flex');

    setTimeout(function () {
      $('#successPopup').removeClass('flex').addClass('hidden');
      enableScroll();
    }, 3000);
  });

});

// DASHBOARD CLASS
$(document).ready(function () {

  /* ===============================
     CACHE POPUPS
  =============================== */
  const $orderPopup = $('#orderPopup');
  const $cancelPopup = $('#cancelClassPopup');   // dashboard classes cancel
  const $successPopup = $('#successClassPopup'); // dashboard classes success
  const $membershipPopup = $('#membershipPopup');
  const $billingPopup = $('#billingHistoryPopup');
  const $autoPaymentPopup = $('#autoPaymentPopup');
  const $cancelAutoPopup = $('#cancelConfirmPopup');
  const $successAutoPopup = $('#successAutoPopup');

  const $allPopups = $('.popup'); // All popups must have class="popup"

  function disableScroll() {
    $('html, body').addClass('lock-scroll');
  }
  function enableScroll() {
    $('html, body').removeClass('lock-scroll');
  }

  /* ===============================
     OPEN POPUP FUNCTION
  =============================== */
  function openPopup($popup) {
    $allPopups.addClass('hidden').removeClass('flex'); // close all first
    $popup.removeClass('hidden').addClass('flex');
    $('body').addClass('overflow-hidden');
    disableScroll();
  }
  /* ===================================
     MEMBERSHIP FLOW
  =================================== */

  // View Details → Membership
  $(document).on('click', '.plan-detail', function (e) {
    e.preventDefault();
    openPopup($membershipPopup);
  });

  // Membership → Billing History
  $(document).on('click', '.open-billing-history', function () {
    openPopup($billingPopup);
  });

  // Billing → Auto Payment
  $(document).on('click', '.open-auto-payment', function () {
    openPopup($autoPaymentPopup);
  });

  // Auto Payment → Cancel Confirm
  $(document).on('click', '.confirm-cancel', function () {
    openPopup($cancelAutoPopup);
  });

  // Confirm Cancel → Success (show immediately, auto-hide after 3s)
  $(document).on('click', '.confirm-final-cancel', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Make 100% sure cancel confirm popup closes first
    $cancelAutoPopup.addClass('hidden').removeClass('flex');

    // Open success popup immediately
    openPopup($successAutoPopup);

    // Auto-close after 3 seconds
    setTimeout(function () {
      closeAllPopups();
    }, 3000);

    return false;
  });

  /* ===============================
     ACCOUNT HEADER DROPDOWN (ACCOUNT PAGE ONLY)
  =============================== */
  (function () {
    const $dropdown = $('#accountMenuDropdown');
    const $toggle = $('#accountMenuToggle');

    if (!$dropdown.length || !$toggle.length) return;

    // Toggle dropdown
    $toggle.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropdown.toggleClass('hidden');
    });

    // Keep clicks inside dropdown from bubbling
    $dropdown.on('click', function (e) {
      e.stopPropagation();
    });

    // Close on outside click
    $(document).on('click', function () {
      $dropdown.addClass('hidden');
    });

    // Menu item → switch account tab
    $(document).on('click', '.account-menu-item', function (e) {
      e.preventDefault();

      const target = $(this).data('target');
      if (target && $('#schedule').length) {
        const $tab = $('.schedule-tab[data-target="' + target + '"]');
        if ($tab.length) {
          $tab.trigger('click');
          // Smooth scroll to dashboard section
          const $section = $('#schedule');
          if ($section.length) {
            $('html, body').animate(
              { scrollTop: $section.offset().top - 120 },
              350,
            );
          }
        }
      }

      $dropdown.addClass('hidden');
    });
  })();

  /* ===============================
     CLOSE ALL POPUPS
  =============================== */
  function closeAllPopups() {
    $allPopups.addClass('hidden').removeClass('flex');
    $('body').removeClass('overflow-hidden');
    enableScroll();
  }

  /* ===============================
     VIEW DETAILS CLICK
  =============================== */
  $(document).on('click', '.view-details', function (e) {
    e.preventDefault();

    const status = $(this).data('status');
    const className = $(this).data('classname');
    const date = $(this).data('date');
    const image = $(this).data('image');
    const instructor = $(this).data('instructor');
    const programDuration = $(this).data('programduration');
    const sessionDuration = $(this).data('sessionduration');
    const format = $(this).data('format');
    const detail = $(this).data('detail');

    $('#pStatus').text(status);
    $('#pMainTitle').text(className);
    $('#pClassName').text(className);
    $('#pDate').text(date);
    $('#pImage').attr('src', image);
    $('#pInstructor').text(instructor);
    $('#pProgramDuration').text(programDuration);
    $('#pSessionDuration').text(sessionDuration);
    $('#pFormat').text(format);
    $('#pDetail').text(detail);

    openPopup($orderPopup);
  });

  /* ===============================
     OPEN CANCEL POPUP
  =============================== */
  $(document).on('click', '#openCancelPopup', function (e) {
    e.preventDefault();
    openPopup($cancelPopup);
  });

  /* ===============================
     CLOSE BUTTON (USE CLASS)
  =============================== */
  $(document).on('click', '.popup-close', function (e) {
    e.preventDefault();
    closeAllPopups();
  });

  /* ===============================
     CLICK OUTSIDE TO CLOSE
  =============================== */
  $(document).on('click', '.popup', function (e) {
    if ($(e.target).hasClass('popup')) {
      closeAllPopups();
    }
  });

  /* ===============================
     SUBMIT CANCEL → SUCCESS POPUP
  =============================== */
  $(document).on('click', '#submitCancel', function (e) {
    e.preventDefault();

    openPopup($successPopup);

    setTimeout(function () {
      closeAllPopups();
    }, 3000);
  });
});

// ADD ADDRESS DETAIL
$(document).ready(function () {

  $('#addAddress').on('click', function () {

    let count = $('.address-block').length + 1;

    // clone first address block
    let $clone = $('.address-block').first().clone();

    // clear inputs
    $clone.find('input').val('');

    // update title text
    $clone.find('.address-title')
      .text(`Address Details (Address ${count})`);

    // remove "+" button from cloned block
    $clone.find('#addAddress').remove();

    // add remove button on RIGHT
    if ($clone.find('.removeAddress').length === 0) {
      $clone.find('.address-header').append(`
        <button type="button"
          class="removeAddress 1xl:text-34 md:text-32 text-30 leading-none font-light text-primary">
          −
        </button>
      `);
    }

    $('#addressWrapper').append($clone);
  });

  // remove address
  $(document).on('click', '.removeAddress', function () {
    $(this).closest('.address-block').remove();
  });

});


$(document).ready(function () {

  /* ================================
     PROFILE IMAGE CHANGE (PENCIL / IMAGE CLICK)
     ================================ */

  // Open file chooser on image OR pencil click
  $('#editProfileImg, #profilePreview').on('click', function () {
    $('#profileImageInput').trigger('click');
  });

  // Preview selected image
  $('#profileImageInput').on('change', function () {
    const file = this.files[0];

    if (!file) return;

    // Allow only image files
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      $(this).val('');
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function (e) {
      $('#profilePreview').attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
  });

});



// PASSWORD SHOW/HIDE
$(document).on('click', '.password-toggle', function () {
  const $wrapper = $(this);
  const $input = $wrapper.siblings('.password-input');

  if ($input.attr('type') === 'password') {
      $input.attr('type', 'text');
      $wrapper.find('.eye-open').addClass('hidden');
      $wrapper.find('.eye-closed').removeClass('hidden');
  } else {
      $input.attr('type', 'password');
      $wrapper.find('.eye-closed').addClass('hidden');
      $wrapper.find('.eye-open').removeClass('hidden');
  }
});