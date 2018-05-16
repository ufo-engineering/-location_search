new SimpleBar(document.getElementById('navigation-wrp'),{
    autoHide: false
})

    $('#place_photos').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
          enabled:true
        }
    });

function createControlItm(arrClasses, buttonText) {
    var cntrlItm = document.createElement('div'),
        addClasses = function(el, i, arr) {
            cntrlItm.classList.add(el)
        };
    arrClasses.forEach(addClasses);
    cntrlItm.style.cursor = 'pointer';


    var textSpan = document.createElement('span');
    textSpan.innerHTML = buttonText;
    cntrlItm.appendChild(textSpan);


    return cntrlItm;
}

function MakeControl(controlDiv, map, trigger) {
    var controlRoad = createControlItm(['custom-map-btn', 'map-screen'], 'Map');
    controlDiv.appendChild(controlRoad);
    var controlNasa = createControlItm(['custom-map-btn', 'nasa-screen'], 'Satellite');
    controlDiv.appendChild(controlNasa);
    var controlFS = createControlItm(['custom-map-btn', 'full-screen'], 'Full Screen');
    controlDiv.appendChild(controlFS);
    controlFS.innerHTML = '<span class="nfs">Full Screen</span><span class="fs">return to Program</span>';
    if (!trigger) {
        controlNasa.classList.add('text-off');
        controlRoad.classList.add('text-off');
        controlFS.classList.add('text-off');
    }

    controlFS.addEventListener('click', function(e) {
        e.target.closest('.maps').classList.toggle('if-fullscreen')
        document.body.classList.toggle('fsmode')
        google.maps.event.trigger(map, "resize");
        var searchForm = document.getElementById('search-form');
        if (document.body.classList.contains('fsmode') && searchForm) {
            document.getElementById('full-screen-wrp').appendChild(searchForm);
        } else if (searchForm) {
            document.getElementById('search-form-wrp').appendChild(searchForm);


        }



    });

    controlRoad.addEventListener('click', function() {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
    });
    controlNasa.addEventListener('click', function() {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID)
    });
}
