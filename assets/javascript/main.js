// Langue locale du navigateur
const locale = navigator.language || navigator.userLanguage;

// Lorsque le document est chargé
jQuery(document).ready(function() {
  mobileMenu();
  heightHeader();
  smoothScroll();
  sinceDate();
  popup();
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

/**
 * Permet de transformer une date en "ago" (ex: 03/04/2017 > 2 ans)
**/
function sinceDate() {
  // Changement de la locale pour correspondre à la langue du navigateur
  moment.locale(locale);

  $('[data-since]').each(function(index, element) {
    const since = $(element).data('since');
    const date = moment(since, 'DD-MM-YYYY');
    const agoDate = date.fromNow(true);
    $(element).text(agoDate);
  });
}

/**
 * Permet d'afficher des popups
**/
function popup() {
  $('[data-popup]').on('click', function() {
    // Popup cible
    let popup = $(this).next('.popup');

    // Ouvre la popup
    popup.toggleClass('active');

    // Insertion du src pour charger uniquement si l'on ouvre la popup
    $('iframe', popup).each(function(index, element) {
      $(this).attr('src', $(this).data('src'));
    });
  });

  $('.popup button.close, .popup').on('click', function(e) {
    let target = $(e.target);
    if (target.hasClass('popup') || target.hasClass('close')) {
      let popup = $(target.closest('.popup'));

      popup.removeClass('active');

      // Suppression du src pour stopper le contenu de l'iframe
      $('iframe', popup).each(function(index, element) {
        $(this).removeAttr('src');
        $(this).clone().appendTo($(this).closest('.fluid-container'));
        $(this).remove();
      });
    }
  })
}