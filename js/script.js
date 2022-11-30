$(document).ready(function() {
  //Складывем меню в бургер и обратно 
  function menuCrop(menu) {
    const items = $(menu).children('li');
    const menuWidth = $(menu).outerWidth(true);
    const parentWidth = $(menu).parent().width();
    const siblings = $(menu).siblings();
    const burger = $(menu).find('.burger'); 
    const burgerMenu = $(menu).find('.burger_menu');
    let siblingsWidth = 0;
    for(let sibling of siblings) {
      siblingsWidth += $(sibling).outerWidth(true);     
    }
    const maxMenuWidth = parentWidth - siblingsWidth;
    if(menuWidth > maxMenuWidth) {
      $(items).last().attr('data-width', $(items).last().outerWidth(true));
      $(items).last().prependTo(burgerMenu);
      $(burger).addClass('active');
      if(items.length) {
        menuCrop(menu);
      }      
    } else if((maxMenuWidth - menuWidth >= $(burgerMenu).children().first().data('width') - 10)) {      
      $(burgerMenu).children().first().appendTo(menu);
      $(burger).appendTo(menu);
      if($(burgerMenu).children().length === 0) {
        $(burger).removeClass('active');
      }
    }
    return;
  }

  menuCrop($('.header_top-menu'));
  menuCrop($('.header_bottom-menu'));

  
  $(window).resize(function() {
    menuCrop($('.header_top-menu'));
    menuCrop($('.header_bottom-menu'));
  });

  $('.burger_icon').click(function() {
    $(this).parent('.burger').toggleClass('burger__open');
    $('body').toggleClass('nooverflow');
  });

  //открытие выпадающего меню внутри popup  
  $('.header_top-submenu').click(function() {
    $(this).toggleClass('active');
  });

  $('.header_top-menu .header_top-submenu').mouseenter(function() {
    $(this).addClass('active');
  });

  $('.header_top-menu .header_top-submenu').mouseleave(function() {
    $(this).removeClass('active');
  });

  //Открытие/закрытие мобильного меню
  $('.burger_mobile-menu').click(function() {
    $('.header_mobile-menu').toggleClass('active');
    if($('.header_mobile-menu').hasClass('active')) {
      $('.burger_mobile-menu').addClass('burger__open');
    } else {
      $('.burger_mobile-menu').removeClass('burger__open');
      $('.mobile-menu_bottom_submenu').removeClass('active');
    }
  });
  //Открытие мобильного подменю
  $('.mobile-menu_bottom_submenu').click(function(e) {
    if(e.target === e.currentTarget) {
      $(this).addClass('active');
    }    
  });
  //Закрытие мобильного подменю
  $('.mobile-menu_title').click(function() {
    $('.mobile-menu_bottom_submenu').removeClass('active');
  });

  //Инициализация слайдера на главном экране
  if($('.main-screen_slider-container').length) {
    const mainSlider = tns({
      container: '.main-screen_slider-container',
      items: 3,
      controls: false,
      nav: false,
      mouseDrag: true,
      autoWidth: true,
      swipeAngle: 100,
      // autoplay: true,
      autoplayButtonOutput: false,
      autoplayHoverPause: false,
      autoplayTimeout: 2500,
      animateDelay: 300,
    });

    const changeCounterSlider = function (info) {
      let numberItem = $(info.container).find('.tns-slide-active').first().data('item');
      const currentItem = $(info.container).closest('.main-screen_slider').find('.main-screen_slider-counter .current-slide');
      const progress = $(info.container).closest('.main-screen_slider').find('.main-screen_slider-counter .progress-bar_progress');
      const widthProgress = (100 / info.slideCount) * numberItem;
      $(progress).css('width', widthProgress + '%');
      if(numberItem < 10) {
        numberItem = "0" + numberItem;
      }
      $(currentItem).text(numberItem);
    }
  
    mainSlider.events.on('transitionEnd', changeCounterSlider);
  }  

  //Инициализация слайдера в блоке Для вас
  if($('.foryou_slider').length) {
    let foryouSlider = tns({
      container: '.foryou_slider',
      items: 1,
      controls: true,
      nav: false,
      controlsContainer: '.foryou_slider-nav'
    });
  }
  
  //Переключение состояния checkbox
  $('.form_checkbox input[type="checkbox"]').click(function() {
    if($(this).is(':checked')) {
      $(this).closest('.form_checkbox').addClass('checked');
    } else {
      $(this).closest('.form_checkbox').removeClass('checked');
    }
  });

  //Подключение масок
  $('.phone_mask').masked();

  //range for number
  $('input[type="range"]').on('input', function() {
    const max = $(this).attr("max");
    const min = $(this).attr("min");
    const value = $(this).val();
    const procent = (max - min) / 100;
    const procents = (value - min) / procent;
    $(this).parent().find('.track').width(`${procents}%`);
    $(this).parent().find('input[type="number"]').val(value);
    const formatValue = formatNumber(value);
    $('.loanAmount').text(formatValue);
    changeMonthlyPayment();
  });

  //Переключение срока погашения
  $('.term_buttons label').click(function() {    
    $('.term_buttons label').removeClass('active');
    $(this).addClass('active');
    $('.loanTerm').text($(this).find('.term').text());
    changeMonthlyPayment();
  });

  //Включение выключение скидок
  $('.discounts input').change(function() {
    changeMonthlyPayment();
  })

  changeMonthlyPayment();
  function changeMonthlyPayment() {
    const loanTerm = $('.term_buttons').find('input:checked').val();
    const loanAmount = $('.input-range input[type="number"]').val();
    const annualRate = $('.annualRate').val();
    let discount = 0;
    $('.discounts input').each(function() {
      if($(this).is(':checked')) {
        discount += Number($(this).val());
      }
    });
    const monthlyPayment = Math.trunc((loanAmount * ((annualRate - discount)) / 100) / loanTerm);
    const formatMonthlyPayment = formatNumber(monthlyPayment);
    const start = Number($('.monthlyPayment:first').text().replaceAll(' ', ''));
    const end = Number(monthlyPayment);
    outNum(start, end, $('.monthlyPayment'));
  }

  function outNum(numStart, numEnd, elem) {
    let time = 30;
    let step = 1000000;
    ns = Number(numStart) || 0;
    ne = Number(numEnd)
    let t = time;
    let interval = setInterval(() => {

      if((Math.abs(ne - ns) < 10)) {
        step = 1;
      } else if((Math.abs(ne - ns) < 100)) {
        step = 10;
      } else if(Math.abs(ne - ns) < 1000) {
        step = 100;
      } else if(Math.abs(ne - ns) < 10000) {
        step = 1000;
      } else if(Math.abs(ne - ns) < 100000) {
        step = 10000;
      } else if(Math.abs(ne - ns) < 1000000) {
        step = 100000;
      } else if(Math.abs(ne - ns) < 10000000) {
        step = 1000000;
      }

      if(Number(ne) > Number(ns)) {
        ns = ns + step;
      } else {
        ns = ns - step;
      }      
      
      if (ns == ne) {
        clearInterval(interval);
      }
      $(elem).text(formatNumber(ns));
    }, t);
  }

  function formatNumber(number) {
    return String(number).split('').reverse().map((item, index) => ((index + 1) % 3) ? item : ' ' + item).reverse().join('');
  }

  //Переключение табов
  $('.tab').click(function() {
    const tab = $(this).data('tab');
    const tabs = $(this).parent();
    const contents = $(this).parent().siblings('.content_tabs');
    $(tabs).find('.tab button').removeClass('button__fill-green').addClass('button__green');
    $(this).find('button').removeClass('button__green').addClass('button__fill-green');
    $(contents).find('.content_tab').removeClass('active');
    $(contents).find(`[data-id="${tab}"]`).addClass('active')
  });

  //открытие ответов в вопросах
  $('.faq-question').click(function() {
    $(this).closest('.faq-item').toggleClass('active');
  });

   //Инициализация слайдера Специалисты ГИК Финанс
   if($('.specialists_slider').length) {
    let specialistsSlider = tns({
      container: '.specialists_slider',
      items: 1,
      controls: true,
      nav: false,
      controlsContainer: '.specialists_slider-nav',
      gutter: 32,
      mouseDrag: true,
      responsive: {
        480: {
          edgePadding: 20,
          gutter: 20,
          items: 2
        },
        860: {
          items: 3
        },
        1024: {
          edgePadding: 20,
          items: 4
        },
        1640: {
          edgePadding: 0,
          items: 4
        }
      }
    });
  }

  //Инициализация слайдера Наши клиенты
  if($('.clients_slider').length) {
    let clientsSlider = tns({
      container: '.clients_slider',
      items: 1,
      controls: true,
      nav: false,
      controlsContainer: '.clients_slider-nav',
      gutter: 0,
      mouseDrag: true,
      responsive: {
        480: {
          edgePadding: 8,
          gutter: 20,
          items: 2
        },
        860: {
          items: 3
        },
        1024: {
          edgePadding: 8,
          gutter: 32,
          items: 4
        }
      }
    });
  }

  //прилипание формы
  let stickyForm;
  if($('.connection_form').length) {
    stickyForm = new Sticksy('.connection_form', {
      topSpacing: 10,
      listen: true,
    });
  }
  
  //открытие описание вакансии в вакансиях
  $('.vacancies_short').click(function() {
    $(this).closest('.vacancies_item').toggleClass('active');
    if(stickyForm) {
      stickyForm.hardRefresh();
    }    
  });

  //Переключение табов на странице Вопрос-ответ
  if($('.faq-tabs').length) {
    $('.faq-tabs').find('button').click(function() {
      $('.faq-list__page').removeClass('active');
      $(`.faq-list__page[data-id="${$(this).data('tab')}"]`).addClass('active');
      $('.faq-tabs').find('button').removeClass('button__fill-green').addClass('button__green');
      $(this).removeClass('button__green').addClass('button__fill-green');
    });
  }

  //Инициализация слайдеров на странице отзывов
  const reviewSliders = $('[id^="review_slider_"]');
  if($(reviewSliders).length) {
    $(reviewSliders).each(function() {
      tns({
        container: `#${$(this).attr('id')}`,
        items: 1,
        controls: false,
        nav: true,
        navContainer: `#${$(this).attr('id')} + .review_slider-nav`,
        loop: false,
        mouseDrag: true,
      });
    });
  }

  //Скрытие лишних пунктов пагинации
  if($('.pagination_items').length) {
    $('.pagination_items').each(function() {
      const activeIndex = $(this).find('.pagination_item').index($('.pagination_item.active'));
      const paginationLength = $(this).find('.pagination_item').length;      
      $(this).find('.pagination_item').each(function(index, element) {    
        if(activeIndex === 0 && index > 2) {          
          $(element).hide();
        } else if(activeIndex === paginationLength-1 && index < paginationLength - 3) {
          $(element).hide();
        } else if((activeIndex !== 0 && activeIndex < paginationLength-1) && (index < activeIndex - 1 || index > activeIndex + 1)) {
          $(element).hide();
        }
      });
    });
  }

  //Инициализация слайдера Фотогалерея
  if($('.gallery_slider').length) {
    tns({
      container: '.gallery_slider',
      items: 1,
      controls: true,
      nav: false,
      controlsContainer: '.gallery_slider-nav',
      gutter: 0,
      mouseDrag: true,
      loop: false,
      rewind: true,
      responsive: {
        480: {          
          items: 1
        },
        860: {
          items: 2,
          gutter: 32,
        },
        1380: {
          gutter: 80,
          items: 3
        }
      }
    });
  }

  //Инициализация слайдера Наша история
  if($('.slider_history').length) {
    let historySlider = tns({
      container: '.slider_history',
      items: 1,
      controls: true,
      nav: false,
      controlsContainer: '.slider_history-nav',
      gutter: 32,
      edgePadding: 0,
      responsive: {
        980: {
          items: 2,
          gutter: 32,
          edgePadding: 8,
        }
      }
    });
  }

  //Инициализация слайдера сертификаты внутри попапа
  if($('.specialist_certificates-slider').length) {
    let historySlider = tns({
      container: '.specialist_certificates-slider',
      items: 1,
      controls: true,
      nav: false,
      controlsContainer: '.specialist_certificates-nav',
      gutter: 32,
      mouseDrag: true,
      responsive: {
        480: {
          items: 2,
          gutter: 8
        },
        980: {
          items: 3,
          gutter: 16
        }
      }
    });
  }

  //Открытие попапов
  $('[data-modal]').click(function() {
    $('.overlay').addClass('active');
    const modal = $(this).data('modal');
    $(`.modal[data-name="${modal}"]`).addClass('active');
  });

  //Закрытие попапов
  $('.close').click(function() {
    $('.overlay').removeClass('active');
    $('.modal').removeClass('active');
  });

  $('.overlay').click(function() {
    $('.overlay').removeClass('active');
    $('.modal').removeClass('active');
  });
  
  //Переключение табов Медиа на странице О компании
  $('.media_links button').click(function() {    
    const tab = $(this).data('tab');
    $(this).closest('.media').find('.media_tab').removeClass('active');
    $(this).closest('.media').find(`.media_tab[data-id="${tab}"]`).addClass('active');
    $('.media_links button').removeClass('button__fill-green').addClass('button__green');
    $(this).removeClass('button__green').addClass('button__fill-green');
  });

  $('input[type="file"]').change(function() {    
    const labelText = 'Прикрепить файл';
    $(this).parent().find('.remove').remove();
    if($(this)[0].files[0]) {
      const name = $(this)[0].files[0].name;
      $(this).parent().find('label').text(name)
      $(this).parent().find('label').parent().append('<div class="remove"></div>')
    } else {
      $(this).parent().find('label').text(labelText);      
    }    
  });

  $(document).on('click', '.form_file .remove', function() {
    $(this).siblings('input[type="file"]').val('');
    $(this).siblings('input[type="file"]').change();
  });
});