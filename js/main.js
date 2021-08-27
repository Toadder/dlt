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

window.onload = function(e) {
	ymap();

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

	// Intro slider
	let introSlider = new Swiper('.slider-intro', {
		slidesPerView: 1.7,
		speed: 800, 
		loop: true,
		autoHeight: true,
		spaceBetween: 38,

		// Navigation 
		navigation : {
			nextEl: '.intro__next',
    		prevEl: '.intro__prev',
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
			slideChange: function(slider) {
				let progressLine = document.querySelector('.intro__fill');
				let totalCount = slider.slides.length - slider.loopedSlides*2;
				progressLine.style.width = `${(slider.realIndex + 1) / totalCount * 100}%`;
			},
		}
	});

};

