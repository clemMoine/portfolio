// Variables globales
const defaultNavHeight = 50; // Taille de la barre de navigation lorsque l'on ne la calcule pas
const locale = navigator.language || navigator.userLanguage; // Langue locale du navigateur
let mobileDisplay, scrollOffset; // Initialisation de variables

// Lorsque le document est chargé
jQuery(document).ready(function() {
  updateVar();
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
  updateVar();
  fullHeightElements();
});

// Lors du scroll de la fenêtre
jQuery(window).scroll(function() {
  updateVar();
  menuButtonColor();
  activeSection();
});

/**
 * Permet de mettre à jour les variables globales
**/
function updateVar() {
  scrollOffset = {
    top: $(window).scrollTop(),
    bottom: $(window).scrollTop() + $(window).height()
  };
  mobileDisplay = ($(window).width() <= 700);
}

/**
 * Gestion du menu mobile
**/
function mobileMenu() {
  $('button.menu').click(() => {
    // Ajout de la classe open et animating qui sert pour la durée de la transition
    $('header nav').toggleClass('open animating');

    // Blocage de la fermeture le temps de la transition
    $('header nav').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
      $('header nav').removeClass('animating');
    });
  });

  $('.overlay').click(() => {
    $('header nav.open:not(.animating)').removeClass('open');
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
  $('a[data-smooth]').click(function(event) {
    event.preventDefault();

    const { currentTarget } = event;

    let target = currentTarget.getAttribute('href');
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
  // Offset Top / Bottom de la section.presentation
  let presentationOffset = $('.presentation').offset();
  presentationOffset.bottom = $('.presentation').innerHeight() + presentationOffset.top;
  presentationOffset.top -= mobileDisplay ? defaultNavHeight : $('nav').innerHeight();

  // Scroll au dessus de la section ?
  const hoverPresentation = (scrollOffset.top >= presentationOffset.top && scrollOffset.top <= presentationOffset.bottom);

  // Offset Top / Bottom de la section.projects
  let projectsOffset = $('.projects').offset();
  projectsOffset.bottom = $('.projects').innerHeight() + projectsOffset.top;
  projectsOffset.top -= mobileDisplay ? defaultNavHeight : $('nav').innerHeight();

  // Scroll au dessus de la section ?
  const hoverProjects = (scrollOffset.top >= projectsOffset.top && scrollOffset.top <= projectsOffset.bottom);

  // Debug
  // console.clear();
  // console.log(
  //   'scroll offset: ', scrollOffset.top ,':', scrollOffset.bottom ,' | ',
  //   'projets offset: ', projectsOffset.top ,':', projectsOffset.bottom ,' | ',
  //   'presentation offset: ', presentationOffset.top ,':', presentationOffset.bottom
  // );

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
  // Récupération des liens internes
  const links = $('nav ul li a[data-smooth]');

  // Pour chaque liens de la navigation interne
  links.each((index, link) => {
    let target = $(link).attr('href');
    target = (target == '#') ? 'header' : target;
    target = (target == '#contact') ? 'footer' : target;

    // Offset Top / Bottom de la section ciblée par le lien
    let elementOffset = $(target).offset();
    elementOffset.bottom = $(target).innerHeight() + elementOffset.top;
    elementOffset.top -= mobileDisplay ? defaultNavHeight : $('nav').innerHeight();

    // Scroll au dessus de la section ciblée par le lien ?
    if (scrollOffset.top >= elementOffset.top && scrollOffset.top <= elementOffset.bottom) {
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

  $('[data-since]').each((index, element) => {
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
  $('[data-popup]').on('click', (event) => {
    // Popup cible
    const { currentTarget: target } = event;
    const popup = $(target).next('.popup');

    // Ouvre la popup
    popup.toggleClass('active');

    // Insertion du data pour charger le contenu uniquement si l'on ouvre la popup
    $('object', popup).each((index, object) => {
      $(object).attr('data', $(object).data('data'));
    });
  });

  $('.popup button.close, .popup').on('click', (event) => {
    const { currentTarget: target } = event;

    if ($(target).hasClass('popup') || $(target).hasClass('close')) {
      const popup = $(target).closest('.popup');

      $(popup).removeClass('active');

      // Suppression du data pour stopper le contenu de l'object (vidéo en lecture par exemple)
      $('object', popup).each((index, object) => {
        $(object).removeAttr('data');
        $(object).clone().appendTo($(object).closest('.fluid-container'));
        $(object).remove();
      });
    }
  })
}

/**
 * Permet des des-offusquer l'adresse e-mail et de la rendre lisible
**/
function emailObfuscate() {
  $('a[href^="mailto:"]').each((index, anchor) => {
    // Transforme les (at) en @ et les (dot) en .
    anchor.href = anchor.href.replace('(at)', '@').replace(/\(dot\)/g, '.');
  });
}

/**
 * Permet de fermer le menu en faisant glisser
**/
function swipeMenu() {
  $('.overlay, header nav').swipe({
    swipeStatus: (event, phase, direction, distance, duration, fingers) => {
      // Déplacement
      if (phase == 'move') {
        // Déplacement vers la gauche
        if (direction == 'right') {
          // Ouverture du drawer
          $('header nav:not(.open)').addClass('open animating');

          // Blocage de la fermeture le temps de la transition
          $('header nav').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
            $('header nav').removeClass('animating');
          })
          return false;
        // Déplacement vers la droite
        } else if (direction == 'left') {
          // Fermeture du drawer
          $('header nav.open:not(.animating)').removeClass('open');
          return false;
        }
      }
    }
  });
}