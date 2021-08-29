function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector("body").classList.add("webp");
  } else {
    document.querySelector("body").classList.add("no-webp");
  }
});

function _removeClass(array, removedClass) {
  for (let el of array) el.classList.remove(removedClass);
}

function _addClass(array, addedClass) {
  for (let el of array) el.classList.add(addedClass);
}

function ymap() {
  let sectionMap = document.querySelector(".map");

  function ymapInit() {
    if(typeof(ymaps) === 'undefined') return;
    let ymap = document.getElementById('ymap');

    ymaps.ready(function () {
      
      let map = new ymaps.Map("ymap", {
        center: [55.965080685980936,37.82625693904612],
        zoom: 14,
        controls: ["zoomControl"],
        behaviors: ["drag"],
      });

      // Placemark
      let placemark = new ymaps.Placemark(
        [55.9653695290496,37.80119437801096],
        {
          // Hint
          hintContent: "DLT",
        },
        {
          iconLayout: "default#image",
          iconImageHref: "../img/mark.png",
          iconImageSize: [48, 57],
          iconImageOffset: [-25, -61.5],
        }
      );

      function onResizeMap() {
        if (window.innerWidth < '576') { 
          //Set New center
          map.setCenter([55.96366845829584,37.79828198840124]);
          } else if(window.innerWidth < '942') {
            map.setCenter([55.96366845829584,37.81817409752407]);
          } else {
            map.setCenter([55.965080685980936,37.82625693904612]);
        }
      } onResizeMap();

      map.geoObjects.add(placemark);

      window.onresize = function() {
        onResizeMap();
      };
    });
  }

  window.addEventListener("scroll", checkYmapInit);
  checkYmapInit();

  function checkYmapInit() {
    let sectionMapTop = sectionMap.getBoundingClientRect().top;
    let scrollTop = window.pageYOffset;
    let sectionMapOffsetTop = sectionMapTop + scrollTop;

    if (scrollTop + window.innerHeight > sectionMapOffsetTop) {
      ymapLoad();
      window.removeEventListener("scroll", checkYmapInit);
    }
  }

  function ymapLoad() {
    let script = document.createElement('script');
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    document.body.appendChild(script);
    script.onload = ymapInit;
  }
}

function offset(el) {
  const 
    rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function getScrollPercent(el) {
  return (el.scrollLeft/(el.scrollWidth-el.offsetWidth))*100;
}

var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    );
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

function formAddError(el) {
  el.classList.add('_error');
  el.parentElement.classList.add('_error');
}

function formRemoveError(el) {
  el.classList.remove('_error');
  el.parentElement.classList.remove('_error');
}

function emailTest(input) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(input.value);
}
window.onload = function(e) {
	ymap();

	// Form send
	const forms = document.querySelectorAll('form');
	for (var i = 0; i < forms.length; i++) {
		form = forms[i];

		form.addEventListener('submit', formSend);
	}

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);
		let formData = new FormData(form);

		if(error === 0) {
			// !ДОДЕЛАТЬ ОТПРАВКУ ФОРМЫ!
		}
	}

	function formValidate(form) {
	  let error = 0;
	  let formReq = form.querySelectorAll('._req');

	  for (var i = 0; i < formReq.length; i++) {
	    const input = formReq[i];
	    formRemoveError(input);

	    if(input.classList.contains('_email')) {
	    	if(!emailTest(input)) {
	    		formAddError(input);
	    		error++;
	    	}
	    } else if(input.value == '') {
	    	formAddError(input);
	    	error++;
	    }
	  }
	}


	// Anim Items
	const animItems = document.querySelectorAll('._anim-item');
	if(animItems) {
		window.addEventListener('scroll', animOnScroll);
		function animOnScroll() {
			for (var i = 0; i < animItems.length; i++) {
				const animItem = animItems[i];
				const animItemHeight = animItem.offsetHeight;
				const animItemOffset = offset(animItem).top;
				const animStart = 4;

				let animItemPoint = window.innerHeight - animItemHeight / animStart;

				if(animItemHeight > window.innerHeight) {
					animItemPoint = window.innerHeight - window.innerHeight / animStart;
				}

				if((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
					if(animItem.getAttribute('data-delay') && window.innerWidth > 576) {
						animItem.style.transitionDelay = animItem.getAttribute('data-delay') + 's';
					}
					animItem.classList.add('_shown');
				}
			}
		}
		setTimeout(() => {
			animOnScroll();
		}, 300);
	}

	// Burger  && mobile menu
	const burger = document.querySelector('.header__burger');
	const menu = document.querySelector('.header__wrapper');
	burger.addEventListener('click', function(e){
		burger.classList.toggle('_active');
		menu.classList.toggle('_active');
		document.body.classList.toggle('_lock');
	});

	// Header scroll
	const header = document.querySelector(".header");
	if(window.pageYOffset >= header.clientHeight * 0.6) header.classList.add('_on-scroll');
	window.addEventListener('scroll', function(e){
		if(window.pageYOffset >= header.clientHeight * 0.6){
			header.classList.add('_on-scroll');
		} else {
			header.classList.remove('_on-scroll');
		}
	});

	// Table fill
	const tableComparison = document.querySelector('.comparison__table');
	const fillComparison = document.querySelector('.comparison__fill');
	tableComparison.addEventListener('scroll', (e) => {
	  fillComparison.style.width = getScrollPercent(tableComparison) + '%';
	});

	// Field's content appearing
	const fieldItems = document.querySelectorAll('.slider-field__slide');
	if(isMobile.any()) {
		for (let i = 0; i < fieldItems.length; i++) {
			const fieldItem = fieldItems[i];
			fieldItem.addEventListener('click', function(e) {
				fieldItem.querySelector('.slider-field__content').classList.toggle('_active');
			});
		}
	}
  

	// Sliders
	let introSlider = new Swiper('.slider-intro', {
		slidesPerView: 1.7,
		speed: 800, 
		autoHeight: true,
		spaceBetween: 38,
		loop: true,

		// Navigation 
		navigation : {
			nextEl: '.intro__next',
    		prevEl: '.intro__prev',
		},

		pagination: {
			type: 'progressbar',
			el: '.intro__progress',
		},


		breakpoints: {
		   // when window width is >= 640px
		   320: {
		   	slidesPerView: 1.1,
		   	spaceBetween: 20,
		   },
		   767: {
		   	slidesPerView: 1.3,
		   	spaceBetween: 20,
		   },
		   1300: {
		   	slidesPerView: 1.7,
		   	spaceBetween: 38,
		   }
 	 	},

		// Events
		on: {
			init: function(slider) {
				let totalSlide = document.querySelector('.intro__total'); 
				let totalCount = slider.slides.length - slider.loopedSlides*2;
				totalSlide.innerHTML = totalCount < 10 ? ('0' + totalCount) : totalCount;
			},
		}
	});
	if(window.innerWidth < 942) {
		// Field slider 
		let fieldSlider = new Swiper('.slider-field', {
			slidesPerView: 2.5,
			autoHeight: true,
			speed: 800, 
			freeMode: true,

			pagination: {
				type: 'progressbar',
				el: '.field__progress',
			},

			// Events
			on: {
				init: function(slider) {
					let totalSlide = document.querySelector('.field__total'); 
					let totalCount = slider.slides.length;
					totalSlide.innerHTML = totalCount < 10 ? ('0' + totalCount) : totalCount;
				},
			},
			breakpoints: {
			   320: {
			   	slidesPerView: 1.27,
			   },
			   568: {
			   	slidesPerView: 2.5,
			   },
	 	 	},
		});
	}

};

