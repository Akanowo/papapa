/*global jQuery:false */
jQuery(document).ready(function ($) {
	"use strict";
	const device = new MobileDetect(window.navigator.userAgent);
	let jobLinkIsOpen = false;
	// function openImgModal() {
	// 	if(device.os() === 'iOS' || device.os('AndroidOS')) {
	// 		const hireImg = document.getElementById('hire_img');
	// 		hireImg.onclick = (e) => {
	// 			console.log('hello');
	// 			$('#hireImgModal').modal('show');
	// 		};
	// 	}
	// }

	// const handleJobLinkClick = () => {
	// 	jobLinkIsOpen = !jobLinkIsOpen;
	// 	const fullJobDetails = $('#fullJobDetails');
	// 	const btn = $('#jobLinkBtn');
	// 	fullJobDetails.toggleClass('hidden');
	// 	jobLinkIsOpen ? btn.text('Hide Details') : btn.text('Click to view full details');
	// };

	const handleRedirect = (e) => {
		e.preventDefault();
		window.location.href = '/contact';
	};

	// if (window.location.pathname === '/career' || window.location.pathname === '/career/') {
	// 	openImgModal();
	// 	const btn = $('#jobLinkBtn');
	// 	btn.on('click', handleJobLinkClick);
	// }


	// jquery magnific popup
	if (window.location.pathname === '/home' || window.location.pathname === '/home/') {
		try {
			$('.image-popup-vertical-fit').magnificPopup({
				type: 'image',
				delegate: 'a',
				closeOnContentClick: true,
				mainClass: 'mfp-img-mobile',
				image: {
					verticalFit: true
				}

			});

			$('.image-popup-fit-width').magnificPopup({
				type: 'image',
				delegate: 'a',
				closeOnContentClick: true,
				image: {
					verticalFit: false
				}
			});

			$('.image-popup-no-margins').magnificPopup({
				type: 'image',
				delegate: 'a',
				closeOnContentClick: true,
				closeBtnInside: false,
				fixedContentPos: true,
				mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
				image: {
					verticalFit: true
				},
				zoom: {
					enabled: true,
					duration: 300 // don't foget to change the duration also in CSS
				}
			});
			
			$('#contactUsBtn').on('click', handleRedirect);
		} catch (error) {
			console.log(error);
		}
	}


	// add active class to nav links

	const links = document.getElementsByClassName('nav-item');

	for (let link of links) {
		if (window.location.href.includes(link.textContent.toLowerCase())) {
			link.classList.add('active');
		}
	}

	// Validate contact form

	if (location.pathname === '/contact' || location.pathname === '/contact/') {
		$('#contactForm').parsley();

		// Validate name input
		$('#name').parsley({
			pattern: /^[a-zA-Z ]+$/,
			minlength: 5
		});

		// Validate email input
		$('#email').parsley({
			pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		});

		// Validate message input
		// $('#message').parsley({
		// 	pattern: /^[a-zA-Z ]+$/
		// });

		// Submit form
		$('#contactForm').on('submit', async (e) => {
			e.preventDefault();
			$('#submitBtn').attr('disabled', true);
			$('#submitBtn').text('Sending...');
			grecaptcha.ready(function () {
				grecaptcha.execute('6Le2XH8aAAAAADPsjQLrGDK-ELL80aZpJ-NybgrS', { action: 'submit' }).then(async function (token) {
					// Post data to backend
					let result;
					try {
						result = await axios.post('/contact', {
							name: $('#name').val().trim(),
							email: $('#email').val().trim(),
							message: $('#message').val().trim(),
							token
						});
					} catch (error) {
						console.log(error.message);
						result = error;
					}

					if (result.data && !result.data.status) {
						$('#submitBtn').attr('disabled', false);
						$('#submitBtn').text('Send');
						alert(result.data.error);
					} else {
						$('#submitBtn').attr('disabled', false);
						$('#submitBtn').text('Send');
						$('#message').val(null);
						$('#name').val(null);
						$('#email').val(null);
						if(result.response) {
							alert(result.response.data.error);
							return;
						}
						alert(result.data && result.data.message ? result.data.message : 'An error occured');
					}
				});
			});
		});
	}

	//add some elements with animate effect

	$(".big-cta").hover(
		function () {
			$('.cta a').addClass("animated shake");
		},
		function () {
			$('.cta a').removeClass("animated shake");
		}
	);
	$(".box").hover(
		function () {
			$(this).find('.icon').addClass("animated fadeInDown");
			//$(this).find('p').addClass("animated fadeInUp");
		},
		function () {
			$(this).find('.icon').removeClass("animated fadeInDown");
			//$(this).find('p').removeClass("animated fadeInUp");
		}
	);

	// Slick slider
	if (window.location.pathname === '/home' || window.location.pathname === '/home/') {
		$('.center').slick({
			centerMode: true,
			centerPadding: '60px',
			slidesToShow: 3,
			prevArrow: $('.prev'),
			nextArrow: $('.next'),
			responsive: [
				{
					breakpoint: 768,
					settings: {
						arrows: true,
						centerMode: true,
						centerPadding: '40px',
						slidesToShow: 3
					}
				},
				{
					breakpoint: 480,
					settings: {
						arrows: true,
						centerMode: true,
						centerPadding: '40px',
						slidesToShow: 1
					}
				}
			]
		});
	}

	/*Clients Slider*/
	if ($('#clients-slider').length) {
		var owlClient = $("#clients-slider");
		owlClient.owlCarousel({
			autoPlay: 5000,
			items: 9, //10 items above 1000px browser width
			itemsDesktop: [1000, 6], //5 items between 1000px and 901px
			itemsDesktopSmall: [900, 5], // betweem 900px and 601px
			itemsTablet: [600, 4], //2 items between 600 and 0
			itemsMobile: [400, 3], // itemsMobile disabled - inherit from itemsTablet option
			lazyLoad: true
		});
	}

	// Custom Navigation Events
	$(".clients-slider .next").click(function () {
		owlClient.trigger('owl.next');
	})
	$(".clients-slider .prev").click(function () {
		owlClient.trigger('owl.prev');
	})

	$('.accordion').on('show', function (e) {

		$(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('active');
		$(e.target).prev('.accordion-heading').find('.accordion-toggle i').removeClass('icon-plus');
		$(e.target).prev('.accordion-heading').find('.accordion-toggle i').addClass('icon-minus');
	});

	$('.accordion').on('hide', function (e) {
		$(this).find('.accordion-toggle').not($(e.target)).removeClass('active');
		$(this).find('.accordion-toggle i').not($(e.target)).removeClass('icon-minus');
		$(this).find('.accordion-toggle i').not($(e.target)).addClass('icon-plus');
	});


	// tooltip
	$('.social-network li a, .options_box .color a').tooltip();

	// fancybox
	$(".fancybox").fancybox({
		padding: 0,
		autoResize: true,
		beforeShow: function () {
			this.title = $(this.element).attr('title');
			this.title = '<h4>' + this.title + '</h4>' + '<p>' + $(this.element).parent().find('img').attr('alt') + '</p>';
		},
		helpers: {
			title: { type: 'inside' },
		}
	});


	//scroll to top
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});
	$('.scrollup').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 1000);
		return false;
	});
	$('#post-slider').flexslider({
		// Primary Controls
		controlNav: false,              //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
		directionNav: true,              //Boolean: Create navigation for previous/next navigation? (true/false)
		prevText: "Previous",        //String: Set the text for the "previous" directionNav item
		nextText: "Next",            //String: Set the text for the "next" directionNav item

		// Secondary Navigation
		keyboard: true,              //Boolean: Allow slider navigating via keyboard left/right keys
		multipleKeyboard: false,             //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
		mousewheel: false,             //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
		pausePlay: false,             //Boolean: Create pause/play dynamic element
		pauseText: 'Pause',           //String: Set the text for the "pause" pausePlay item
		playText: 'Play',            //String: Set the text for the "play" pausePlay item

		// Special properties
		controlsContainer: "",                //{UPDATED} Selector: USE CLASS SELECTOR. Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be ".flexslider-container". Property is ignored if given element is not found.
		manualControls: "",                //Selector: Declare custom control navigation. Examples would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
		sync: "",                //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
		asNavFor: "",                //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider
	});

	$('#main-slider').flexslider({
		namespace: "flex-",           //{NEW} String: Prefix string attached to the class of every element generated by the plugin
		selector: ".slides > li",    //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
		animation: "fade",            //String: Select your animation type, "fade" or "slide"
		easing: "swing",           //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
		direction: "horizontal",      //String: Select the sliding direction, "horizontal" or "vertical"
		reverse: false,             //{NEW} Boolean: Reverse the animation direction
		animationLoop: true,              //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
		smoothHeight: false,             //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
		startAt: 0,                 //Integer: The slide that the slider should start on. Array notation (0 = first slide)
		slideshow: true,              //Boolean: Animate slider automatically
		slideshowSpeed: 7000,              //Integer: Set the speed of the slideshow cycling, in milliseconds
		animationSpeed: 600,               //Integer: Set the speed of animations, in milliseconds
		initDelay: 0,                 //{NEW} Integer: Set an initialization delay, in milliseconds
		randomize: false,             //Boolean: Randomize slide order

		// Usability features
		pauseOnAction: true,              //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
		pauseOnHover: false,             //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
		useCSS: true,              //{NEW} Boolean: Slider will use CSS3 transitions if available
		touch: true,              //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
		video: false,             //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

		// Primary Controls
		controlNav: true,              //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
		directionNav: true,              //Boolean: Create navigation for previous/next navigation? (true/false)
		prevText: "Previous",        //String: Set the text for the "previous" directionNav item
		nextText: "Next",            //String: Set the text for the "next" directionNav item

		// Secondary Navigation
		keyboard: true,              //Boolean: Allow slider navigating via keyboard left/right keys
		multipleKeyboard: false,             //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
		mousewheel: false,             //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
		pausePlay: false,             //Boolean: Create pause/play dynamic element
		pauseText: 'Pause',           //String: Set the text for the "pause" pausePlay item
		playText: 'Play',            //String: Set the text for the "play" pausePlay item

		// Special properties
		controlsContainer: "",                //{UPDATED} Selector: USE CLASS SELECTOR. Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be ".flexslider-container". Property is ignored if given element is not found.
		manualControls: "",                //Selector: Declare custom control navigation. Examples would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
		sync: "",                //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
		asNavFor: "",                //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider
	});
	/* -------- Isotope Filtering -------- */
	if (document.getElementById("gallery-1")) {

		var $container = $('#isotope-gallery-container');
		var $filter = $('.filter');
		$(window).load(function () {
			// Initialize Isotope
			$container.isotope({
				itemSelector: '.gallery-item-wrapper'
			});
			$('.filter a').click(function () {
				var selector = $(this).attr('data-filter');
				$container.isotope({ filter: selector });
				return false;
			});
			$filter.find('a').click(function () {
				var selector = $(this).attr('data-filter');
				$filter.find('a').parent().removeClass('active');
				$(this).parent().addClass('active');
			});
		});
		$(window).smartresize(function () {
			$container.isotope('reLayout');
		});
		// End Isotope Filtering
		$('.gallery-zoom').magnificPopup({
			type: 'image'
			// other options
		});
	}
});