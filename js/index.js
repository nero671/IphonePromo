document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
      if(request.readyState !== 4) {
        return 
      }
      if(request.status === 200) { 
        const response = JSON.parse(request.response);
        callback(response);
      } else {
        console.error(new Error('Ошибка:' + request.status));
      }
    })

    request.send();
  };

  const tabs = () => {
    const cardDetailsTitle = document.querySelector('.card-details__title'),
          cardDetailChange = document.querySelectorAll('.card-detail__change'),
          cardImageItem = document.querySelector('.card__image_item'),
          cardDetailsPrice = document.querySelector('.card-details__price'),
          descriptionMemory = document.querySelector('.description__memory');

    const data = [
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Graphite',
        img: 'img/iPhone-graphite.png',
        price: 95990,
        memory: 128
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 256GB Silver',
        img: 'img/iPhone-silver.png',
        price: 120990,
        memory: 256
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Pacific Blue',
        img: 'img/iPhone-blue.png',
        price: 99990,
        memory: 128
      },
    ];

    const deactive = () => {
      cardDetailChange.forEach(item => {
        item.classList.remove('active');
      })
    }

    cardDetailChange.forEach((item, i) => {
      item.addEventListener('click', () => {
        if(!item.classList.contains('active')) {
          deactive();
          item.classList.add('active');

          cardDetailsTitle.textContent = data[i].name;
          cardImageItem.src = data[i].img;
          cardImageItem.alt = data[i].name;
          cardDetailsPrice.textContent = data[i].price + '₽';
          descriptionMemory.textContent = `Встроенная память (ROM) ${data[i].memory} GB`;
        }
      });
    });
  };

  const accordion = () => {
    const characteristicsList = document.querySelector('.characteristics__list'),
          characteristicsItem = document.querySelectorAll('.characteristics__item');

    characteristicsItem.forEach(item => {
      if(item.children[1].classList.contains('active')) {
        item.children[1].style.height = `${item.children[1].scrollHeight}px`;
      }
    })

    const open = (button, dropDown) => {
      closeAllDrops();
      dropDown.style.height = `${dropDown.scrollHeight}px`;
      button.classList.add('active');
      dropDown.classList.add('active');
    }

    const close = (button, dropDown) => {
      button.classList.remove('active');
      dropDown.classList.remove('active');
      dropDown.style.height = '';
    }

    const closeAllDrops = (button, dropDown) => {
      characteristicsItem.forEach(item => {
        if(item.children[0] !== button && item.children[1] !== dropDown) {
          close(item.children[0], item.children[1]);
        }
      })
    }

    characteristicsList.addEventListener('click', (e) => {
      const target = e.target;

      if(target.classList.contains('characteristics__title')) {
        const parent = target.closest('.characteristics__item');
        const description = parent.querySelector('.characteristics__description');

        description.classList.contains('active') ? close(target, description) : open(target, description);
      }
    });

  };

  const modal = () => {
    const cardDetailsButtonBuy = document.querySelectorAll('.button_buy'),
          modal = document.querySelector('.modal'),
          cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery'),
          cardDetailsTitle = document.querySelector('.card-details__title'),
          modalTitle = document.querySelector('.modal__title'),
          modalSubtitle = modal.querySelector('.modal__subtitle');

    const openModal = e => {
      modal.classList.add('open');
      modalTitle.textContent = cardDetailsTitle.textContent;
      modalSubtitle.textContent = e.target.dataset.buttonBuy;
    }


    cardDetailsButtonBuy.forEach(item => {
      item.addEventListener('click', openModal);
    });

    cardDetailsButtonDelivery.addEventListener('click', openModal)

    modal.addEventListener('click', e => {
      if(e.target.matches('.modal__close') || e.target.matches  ('.modal')) {
        modal.classList.remove('open');
      }
    });

    document.body.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        modal.classList.remove('open');
      }
    });
  }

  const renderCrossSell = () => {
    const crossSellList = document.querySelector('.cross-sell__list');
    const crossSellAdd = document.querySelector('.cross-sell__add');


    const allGoods = [];

    const shuffle = arr => arr.sort(() => Math.random() - 0.5)

    const createCrossSellItem = (item) => {
      const li = document.createElement('li');

      li.innerHTML = `
        <article class="cross-sell__item">
          <img class="cross-sell__image" src="${item.photo}" alt="${item.name}">
          <h3 class="cross-sell__title">${item.name}</h3>
          <p class="cross-sell__price">${item.price}₽</p>
          <button type="button" class="button button_buy cross-sell__button">Купить</button>
				</article>
      `;

      return li;
    }



    const render = arr => {
      arr.forEach(item => {
        crossSellList.append(createCrossSellItem(item));

        crossSellList.addEventListener('click', e => {
          const target = e.target;
          const good = target.closest('.cross-sell__item');
          const modalTitle = document.querySelector('.modal__title');
          if(target.matches('.cross-sell__button')) {
            modal();
            if(good) {
              modalTitle.textContent = good.querySelector('.cross-sell__title').textContent;
            }
          }
        });
      });
    }

    // const wrapper = (fn, count) => {
    //   let counter = 0;
    //   return(...args) => {
    //     if(counter === count) return;
    //     counter++
    //     return fn(...args)
    //   }
    // };

    // const wrapRender = wrapper(render, 2);

    const createCrossSellList = (data) => {
      allGoods.push(...shuffle(data));
      const fourItems = allGoods.splice(0, 4);
      render(fourItems);

    };

    crossSellAdd.addEventListener('click', () => {
      render(allGoods);
      crossSellAdd.remove();
    });


    getData('cross-sell-dbase/dbase.json', createCrossSellList);

  }

  const useMenu = () => {
    document.body.addEventListener('click', e => {
      if (e.target.closest('a[href^="#"]')) {
        e.preventDefault();
        const target = e.target.closest('a[href^="#"]');
        const linkID = target.getAttribute('href');
        document.querySelector(linkID).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    })
  };

  const reviewsSlider = () => {
    const reviewsSliderWrapSlide = document.querySelector('.reviews-slider-wrap__slide'),
          reviewsSliderSlide = document.querySelectorAll('.reviews-slider__slide'),
          reviewsSliderWrap = document.querySelector('.reviews-slider-wrap'),
          arrowLeft = document.getElementById('reviews-arrow_left'),
          arrowRight = document.getElementById('reviews-arrow_right');

    let currentSlide = 0;
    let translate = 0;

    const clientWidth = reviewsSliderWrapSlide.clientWidth;

    reviewsSliderSlide.forEach(item => {
      item.style.minWidth = `${clientWidth}px`;
    });

    arrowLeft.style.display = 'none';

    reviewsSliderWrap.addEventListener('click', e => {
      e.preventDefault();
      const target = e.target;

      if(target.closest('#reviews-arrow_right')) {
        currentSlide++;
        translate -= clientWidth;
        reviewsSliderWrapSlide.style.transform = `translateX(${translate}px)`;
      } else if(target.closest('#reviews-arrow_left')) {
        currentSlide--;
        translate += clientWidth;
        reviewsSliderWrapSlide.style.transform = `translateX(${translate}px)`;
      }

      if (currentSlide === 0) {
        arrowLeft.style.display = 'none';
      } else if (currentSlide === reviewsSliderSlide.length - 1) {
        arrowRight.style.display = 'none';
      } else {
        arrowRight.style.display = '';
        arrowLeft.style.display = '';
      }
    });
  };


  tabs();
  accordion();
  modal();
  renderCrossSell();
  useMenu();
  reviewsSlider();
  amenu('.header__menu', '.header-menu__list', '.header-menu__item', '.header-menu__burger');
});