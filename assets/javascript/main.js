// Lorsque le document est chargé
jQuery(document).ready(function() {
  mobileMenu();
  heightHeader();
  smoothScroll();
});

// Lors du redimensionnement de la fenêtre
jQuery(window).resize(function() {
  heightHeader();
});

// Lors du scroll de la fenêtre
jQuery(window).scroll(function() {
  menuButtonColor();
});

/**
 * Gestion du menu mobile
**/
function mobileMenu() {
  $('button.menu').click(function(e) {
    $('header nav').toggleClass('open');
  });

  $('.overlay').click(function() {
    $('header nav.open').removeClass('open')
  });
}

/**
 * Permet d'ajuster le 100vh CSS qui n'est pas toujours correct
**/
function heightHeader() {
  const vh = $(window).height();
  $('header').height(vh)
}

/**
 * Scroll fluide
**/
function smoothScroll() {
  $('a[data-smooth]').click(function(e) {
    e.preventDefault();

    let target = $(this).attr('href');
    target = (target == '#') ? 'body' : target;
    const offset = $(target).offset().top;

    // Scroll fluide
    $('html, body').animate({
      scrollTop: offset
    }, 'slow');

    // Fermeture du menu de navigation
    $('header nav.open').removeClass('open');

    return false;
  })
}

/**
 * Bouton changeant de mode en fonction de la section survolée
**/
function menuButtonColor() {
  const scroll = $(window).scrollTop();

  // Offset Top / Bottom de la section.presentation
  var presentationOffset = $('.presentation').offset();
  presentationOffset.bottom = $('.presentation').innerHeight() + presentationOffset.top;

  // Scroll au dessus de la section ?
  const hoverPresentation = (scroll >= presentationOffset.top - 60 && scroll <= presentationOffset.bottom)

  if (hoverPresentation) {
    $('button.menu').addClass('purple');
  } else {
    $('button.menu').removeClass('purple');
  }

}