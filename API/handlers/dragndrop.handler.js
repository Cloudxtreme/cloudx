var zindexes = [];

function toTop(element) {
    z = [];
    zindexes.forEach(function (el) {
        if (el !== element) {
            z.push(el);
        };
    });
    z.push(element);
    zindexes = z;
    z.forEach(function (e, index) {
        e.style.zIndex = index * 1 + 5;
    });
}

function rmIndex(element) {
    z = [];
    zindexes.forEach(function (el) {
        if (el !== element) {
            z.push(el);
        };
    });
    zindexes = z;
};

var hiddenLayer = document.createElement ('div');
	hiddenLayer.style.position = 'absolute';
	hiddenLayer.style.width = '100%';
	hiddenLayer.style.height = '100%';
	hiddenLayer.style.top = '0';
	hiddenLayer.style.left = '0';
	hiddenLayer.style.display = 'none';
	hiddenLayer.style.zIndex = '999999999'
document.body.appendChild(hiddenLayer);

var dndwin = (function () {

    var start, dragObject, mouseOffset

        function getMouseOffset(target, e) {
            var docPos = getPosition(target)
            return {
                x: e.pageX - docPos.x,
                y: e.pageY - docPos.y
            };
        };

    function mouseDown(e) {
        dragObject = this.parentNode;
        start = {
            x: e.pageX,
            y: e.pageY
        };
        toTop(dragObject);
        if (e.target.className.indexOf('button') !== -1) {
            return false;
        };
        dragObject.classList.remove('animated');

        pos = getPosition(dragObject);


        mouseMove = function (e) {
            if (start !== false) {
                if (Math.abs(start.y - e.pageY) < 7 && Math.abs(start.x - e.pageX) < 7) {
                    return false;
                } else {
                    start = false;

                    if (!!!localStorage.getItem('conf_ghost')) {
                        dragObject.style.cursor = "move";

                    } else {
                        dragObject.style.visibility = "hidden"
                        ghost.style.display = null;
                        ghost.style.height = dragObject.offsetHeight + 'px';
                        ghost.style.width = dragObject.offsetWidth + 'px';
                        ghost.style.left = pos.x + 'px';
                        ghost.style.top = pos.y + 'px';
                        ghost.style.cursor = "move";
                    }
                }
            }
            if (!!!localStorage.getItem('conf_ghost')) {
                dragObject.style.top = e.pageY - mouseOffset.y + 'px';
                dragObject.style.left = e.pageX - mouseOffset.x + 'px';
            } else {
                ghost.style.top = e.pageY - mouseOffset.y + 'px';
                ghost.style.left = e.pageX - mouseOffset.x + 'px';
            }
        }


        mouseOffset = getMouseOffset(this.parentNode, e)
		
		hiddenLayer.style.display = null;

        document.onmousemove = mouseMove;
        document.onmouseup = mouseUp;
        document.ondragstart = function () {
            return false;
        }
        document.body.onselectstart = function () {
            return false;
        }

        return false;
    };

    function mouseUp() {
    	hiddenLayer.style.display = 'none';
        dragObject.style.visibility = null;

        if (!!localStorage.getItem('conf_ghost')) {
            dragObject.style.top = ghost.style.top;
            dragObject.style.left = ghost.style.left;
            ghost.style.display = "none"
            ghost.style.cursor = null;
        } else {
            dragObject.style.cursor = null
            dragObject.classList.add('animated');
        }

        setTimeout(function () {
            dragObject.classList.add('animated');
            dragObject = null;
        }, 30);

        document.onmousemove = null;
        document.onmouseup = null;
        document.ondragstart = null;
        document.body.onselectstart = null;
    }


    return {
        makeDraggable: function (element) {
            element.onmousedown = mouseDown;
        }
    }

}());

function getPosition(e) {
    var left = 0
    var top = 0

    while (e.offsetParent) {
        left += e.offsetLeft
        top += e.offsetTop
        e = e.offsetParent
    }

    left += e.offsetLeft
    top += e.offsetTop

    return {
        x: left,
        y: top
    }
}
