// Langue locale du navigateur
const locale = navigator.language || navigator.userLanguage;

// Lorsque le document est chargé
jQuery(document).ready(function() {
  mobileMenu();
  fullHeightElements();
  smoothScroll();
  sinceDate();
  popup();
  emailObfuscate();
  swipeMenu();
  shuffleProjects();
});

// Lors du redimensionnement de la fenêtre
jQuery(window).resize(function() {
  heightHeader();
});

// Lors du scroll de la fenêtre
jQuery(window).scroll(function() {
  menuButtonColor();
  activeSection();
});

/**
 * Gestion du menu mobile
**/
function mobileMenu() {
  $('button.menu').click(function(e) {
    $('header nav').toggleClass('open');
  });

  $('.overlay').click(function() {
    $('header nav.open').removeClass('open');
  });
}

/**
 * Permet d'ajuster le 100vh CSS qui n'est pas toujours correct
**/
function fullHeightElements() {
  const vh = $(window).height();
  $('header, footer').height(vh);
}

/**
 * Permet de randomiser l'ordre des projets
**/
function shuffleProjects() {
  $('section.projects ul li').shuffle();
}

/**
 * Scroll fluide
**/
function smoothScroll() {
  $('a[data-smooth]').click(function(e) {
    e.preventDefault();

    let target = this.getAttribute('href');
    target = (target == '#') ? 'body' : target;
    target = (target == '#contact') ? 'footer' : target;

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
  presentationOffset.top -= $('nav').innerHeight();

  // Scroll au dessus de la section ?
  const hoverPresentation = (scroll >= presentationOffset.top && scroll <= presentationOffset.bottom)

  // Offset Top / Bottom de la section.projects
  var projectsOffset = $('.projects').offset();
  projectsOffset.bottom = $('.projects').innerHeight() + projectsOffset.top;
  projectsOffset.top -= $('nav').innerHeight();

  // Scroll au dessus de la section ?
  const hoverProjects = (scroll >= projectsOffset.top && scroll <= projectsOffset.bottom)

  if (hoverPresentation || hoverProjects) {
    $('button.menu').addClass('purple');
  } else {
    $('button.menu').removeClass('purple');
  }
}

/**
 * Permet de changer la section active au survol de cette dernière
**/
function activeSection() {
  const scroll = $(window).scrollTop();

  // Récupération des liens internes
  const links = $('nav ul li a[data-smooth]');

  // Pour chaque liens de la navigation interne
  links.each(function(index, link) {
    var target = $(link).attr('href');
    target = (target == '#') ? 'header' : target;
    target = (target == '#contact') ? 'footer' : target;

    // Offset Top / Bottom de la section ciblée par le lien
    var elementOffset = $(target).offset();
    elementOffset.bottom = $(target).innerHeight() + elementOffset.top;
    elementOffset.top -= $('nav').innerHeight();

    // Scroll au dessus de la section ciblée par le lien ?
    if (scroll >= elementOffset.top && scroll <= elementOffset.bottom) {
      $(links).removeClass('active');
      $(link).addClass('active');
    }
  })
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

    // Insertion du data pour charger uniquement si l'on ouvre la popup
    $('object', popup).each(function(index, element) {
      $(this).attr('data', $(this).data('data'));
    });
  });

  $('.popup button.close, .popup').on('click', function(e) {
    let target = $(e.target);
    if (target.hasClass('popup') || target.hasClass('close')) {
      let popup = $(target.closest('.popup'));

      popup.removeClass('active');

      // Suppression du data pour stopper le contenu de l'object
      $('object', popup).each(function(index, element) {
        $(this).removeAttr('data');
        $(this).clone().appendTo($(this).closest('.fluid-container'));
        $(this).remove();
      });
    }
  })
}

/**
 * Permet des des-offusquer l'adresse e-mail et de la rendre lisible
**/
function emailObfuscate() {
  $('a[href^="mailto:"]').each(function() {
    // Transforme les (at) en @ et les (dot) en .
    this.href = this.href.replace('(at)', '@').replace(/\(dot\)/g, '.');
  });
}

/**
 * Permet de fermer le menu en faisant glisser
**/
function swipeMenu() {
  $('header nav').swipe({
    swipeStatus: function(event, phase, direction, distance, duration, fingers) {
      if (phase == 'move' && direction == 'left') {
        $(this).removeClass('open');
        return false;
      }
    }
  });
}