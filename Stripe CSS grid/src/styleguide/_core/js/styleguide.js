//TODO: integrate in styleguide/_core in a good way

jQuery(document).ready(function () {
    stg.createStgColors();
    stg.createStgNavigation();
    stg.createSectionInfoToggles();
    stg.createStgIcons();
    stg.formatCodeSnippets();
});


var stg = {
        IconClassPrefix : ".icon-",
        ColorClassPrefix : ".u-color-"
};

stg.getStyle = function getStyle(className) {
    var sSheetList = document.styleSheets;
    for (var sSheet = 0; sSheet < sSheetList.length; sSheet++) {

        if (sSheetList[sSheet].rules ) { var classes = sSheetList[sSheet].rules; }
        else {
            try {  if(!sSheetList[sSheet].cssRules) {continue;} }
                //Note that SecurityError exception is specific to Firefox.
            catch(e) { if(e.name == 'SecurityError') { console.log("SecurityError. Cant readd: "+ sSheetList[sSheet].href);  continue; }}
            var classes = sSheetList[sSheet].cssRules ;
        }

        for (var x = 0; x < classes.length; x++) {
            if (classes[x].selectorText == className) {
                return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
            }
        }
    }
};

stg.getListOfClassesMatchingString = function getListOfClassesMatchingString(testString) {
    var allRules = [];
    var sSheetList = document.styleSheets;
    for (var sSheet = 0; sSheet < sSheetList.length; sSheet++) {
        //var classes = document.styleSheets[sSheet].rules || document.styleSheets[sSheet].cssRules;

        if (sSheetList[sSheet].rules ) { var classes = sSheetList[sSheet].rules; }
        else {
            try {  if(!sSheetList[sSheet].cssRules) {continue;} }
                //Note that SecurityError exception is specific to Firefox.
            catch(e) { if(e.name == 'SecurityError') { console.log("SecurityError. Cant readd: "+ sSheetList[sSheet].href);  continue; }}
            var classes = sSheetList[sSheet].cssRules ;
        }

        for (var rule = 0; rule < classes.length; rule++) {
            var selector = classes[rule].selectorText;
            if (testString && selector && selector.indexOf(testString) != -1) {
                allRules.push(classes[rule].selectorText);
            }
        }
    }
    return allRules
};


stg.createStgColors = function createStgColors(){
    var wrap = jQuery(".stg-colorwrap");
    if(wrap.length < 1)return;
    var colors = stg.getListOfClassesMatchingString(stg.ColorClassPrefix);

    colors.forEach(function(color){
        var colorDom = jQuery('<div class="stg-color"></div>');
        var colorDomBlock = jQuery('<div class="stg-color__block '+color.replace('.','') +'"></div>');
        var colorDomTitle = jQuery('<div class="stg-color__title"><span class="stg-color__name">'+color+'</span></div>');

        colorDom.append(colorDomBlock,colorDomTitle);
        wrap.append(colorDom);
        var rgb = colorDomBlock.css('background-color').replace(/ /g,'');

        var rgbArray = rgb.replace('rgb(', '').replace(')','').split(',');
        var hex = stg.rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]));
        colorDomTitle.append(rgb+"<br>"+hex)
    })
};


stg.componentToHex = function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

stg.rgbToHex = function rgbToHex(r, g, b) {
    return "#" + stg.componentToHex(r) + stg.componentToHex(g) + stg.componentToHex(b);
};


stg.createStgIcons = function createStgColors(){
    var wrap = jQuery(".stg-iconwrap");
    if(wrap.length < 1)return;
    var icons = stg.getListOfClassesMatchingString(stg.IconClassPrefix);

    icons.forEach(function(icon){
        var iconName = icon.substr(0, icon.indexOf(':')).replace('.','');
        var iconDom = jQuery('<div class="stg-icon">');
        var iconDomBlock = jQuery('<div class="stg-icon__block"><i class="'+iconName+'"></i>');
        var iconDomTitle = jQuery('<div class="stg-icon__title">.'+iconName+'</div>');

        iconDom.append(iconDomBlock,iconDomTitle);
        wrap.append(iconDom);
    })
};



stg.createStgNavigation = function createStgNavigation(){

    $('[data-stg-anchor-list]').each(function(i, el){
        var $navContainer = $(el);

        var navPageName = $navContainer.data('pagename');
        var currentPageName = $('[data-stgtitle]').data('stgtitle');
        
        if(navPageName == currentPageName){
            console.log("match");
        }

        if(navPageName != currentPageName){
            return;
        }
console.log(navPageName);
        console.log(currentPageName);

        var anchors = $('[data-stg-anchor]');
        var sectionIdPrefix = 'stg-';
        var list = $('<ul>');
        var isScrolling = false;
        var cachedClosest;

        anchors.each(function(i,el){
            var $el = $(el);
            var title = $el.attr('data-stg-anchor');
            var hash = title.replace(/ /g, "");
            var id = sectionIdPrefix + hash;
            $el.attr('id', id);
            var link = $('<a href="#'+id+'" title="'+title+'">'+title+'</a>');
            link.on('click', function(e) {
                e.preventDefault();
                scrollToSection(id);
            })
            var listItem = $('<li>').append(link)
            list.append(listItem)
        });
        $navContainer.html(list);


        window.addEventListener('scroll', checkClosestSection, false);


        function scrollToSection(id) {
            if (!isScrolling) {
                isScrolling = true;
                var sectionOffset = $(window).height() * .3;
                var sectionEl = $('#' + id);
                $("html, body").animate({ scrollTop: sectionEl.offset().top - sectionOffset }, 1000, function() {
                    isScrolling = false;
                });
            }
        }

        function checkClosestSection() {
            var wScroll = $(window).scrollTop() + ($(window).height() * .3);
            var closestVal = 10000000;
            var closestSection = "";
            var thetarget;

            anchors.each(function(i, el) {
                var el = $(el)
                var elTop = Math.round(el.offset().top);
                var target = wScroll - elTop;
                if (target < 0) {
                    target = target * -1;
                }

                if (closestVal > target) {
                    closestVal = target;
                    closestSection = el.attr('id');
                    thetarget = target;
                }
            });
            if (cachedClosest != closestSection) {
                setActiveNavLink(closestSection)
                cachedClosest = closestSection;
            }
        }

        function setActiveNavLink(anchor) {
            list.find('.is-selected').removeClass('is-selected');
            var selector = '[href="#' + anchor + '"]';
            list.find(selector).parent('li').addClass('is-selected');
        }
    });
};


stg.formatCodeSnippets = function formatCodeSnippets(){
    var $preElements = $('.stg-pre');
    $preElements.each(function(i, el){
        var $el = $(el);
        var formattedHTML = $el.html().replace(/&/g, '&amp;').replace(/</g, '&lt;');
        $el.html(formattedHTML);
    });
    //HTML.replace(/&/g, '&amp;').replace(/</g, '&lt;')

};


stg.createSectionInfoToggles = function createSectionInfoToggles(){
    var $sectionsInfos = $('.stg-section-info');
    if($sectionsInfos.length < 1) return;

    $sectionsInfos.each(function(i,e){
        var $sectionInfoBlock = $(e);
        $sectionInfoBlock.hide()
        var $toggleLink = $('<a href="#" class="stg-section-info-toggle">toggle info</a>');
        $sectionInfoBlock.before($toggleLink);
        $toggleLink.on("click", function(e){
            e.preventDefault();
            $sectionInfoBlock.slideToggle('fast')
            /*if( $sectionInfoBlock.is(':visible') ){
                $("html, body").delay(500).animate({ scrollTop: $sectionInfoBlock.offset().top - 100});
            }*/
        })
    })
};