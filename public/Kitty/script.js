(function() {
    var kitties = document.getElementsByClassName("kitty");
    var dots = document.getElementsByClassName("dot");

    var current = 0;
    var next;
    var timer;
    var transitioningRightNow;

    // setTimeout(moveKitties, 2000);
    timer = setTimeout(moveKitties, 1000);

    document.addEventListener("transitionend", function fn(e) {
        if (e.target.classList.contains("exit")) {
            e.target.classList.remove("exit");
            e.target.removeEventListener("transitionend", fn);
            timer = setTimeout(moveKitties, 5000);
            transitioningRightNow = false;
        }
    });

    var i;
    for (i = 0; i < dots.length; i++) {
        dots[i].addEventListener("click", getDotClickHandler(i));
    }

    function getDotClickHandler(n) {
        return function(e) {
            //to detection
            if (e.target.classList.contains("on")) {
                return;
            }
            //second way
            if (transitioningRightNow) {
                return;
            }
            clearTimeout(timer);
            moveKitties(n);
        };
    }

    function moveKitties(next) {

        // console.log("The current kitty is " + current);
        kitties[current].classList.add("exit");
        kitties[current].classList.remove("onscreen");
        transitioningRightNow = true;
        dots[current].classList.remove("on");

        current++;
        if (current >= kitties.length) {
            current = 0;
        }
        if (typeof next !== "undefined"){
            current= next;
        }

        kitties[current].classList.add("onscreen");
        // console.log("The NEW current kitty is " + current);
        dots[current].classList.add("on");
    // setTimeout(moveKitties, 2000); //son modelde hoca bunu kaldirdi.
    }
})();


// var i;
// for (i = 0; i < dots.length; i++) {
//     dots[i].addEventListener("click", function(e) {
//         for (var i = 0; i < dots.length; i++) {
//             if (dots[i] == e.target) {
//                 break;
//             }
//         }
//         clearTimeout(timer);
//         moveKitties(i);
//     });
// }

// for (var i = 0; i < dots.length; i++) {
//     (function(i) {
//         dots[i].addEventListener("click", function(e) {
//             clearTimeout(timer);
//             moveKitties(i);
//         });
//     })(i);
// }

// [].slice.call(dots).forEach(function(dot, i) {
//     dot.addEventListener('click', function() {
//         console.log(i)
//     })
// })

// var afterTransition;

// //
// var k = document.getElementsByClassName("kitty");
// k[0].classList.remove("onscreen");
// k[0].classList.add("exit");
// k[1].classList.add("onscreen");
// k[1].classList.add("exit");
// k[2].classList.add("onscreen");
// k[2].classList.remove("exit");
// k[3].classList.add("onscreen");
// k[3].classList.remove("exit");
// k[4].classList.add("onscreen");
// k[4].classList.remove("exit");
//
// kitties[current].classList.add("onscreen");
// setTimeout(moveKitties, 2000);

//second approach
// document.addEventListener("transitioned", function e() {
//   if (e.target.classList.contains("exit")) e.target.classList.remove("exit");
//   setTimeout(moveKitties, 2000);
// });

// kitties[current].classList.add("onscreen");
// kittiesCurrent;
//remove onscreen and add exit classes to the current kitty
// console.log("The current kitty is " + current);

// kitties[currentx].classList.remove("onscreen");
// kitties[currentx].classList.add("exit");
// kitties[currentx].addEventListener("transitionend", function fn(e) {
//   e.target.classList.remove("exit");
//   e.target.removeEventListener("transitionend", fn);
// });
// if (kitties[current].classList.contains("onscreen")) {
//   kitties[current].classList.remove("onscreen");
//   kitties[current].classList.add("exit");
//   kitties[current].addEventListener("transitionend", function fn(e) {
//     e.target.classList.remove("exit");
//     e.target.removeEventListener("transitionend", fn);
//   });

// kitties[current].classList.remove("exit");
//   current++;
//   if (current >= kitties.length) {
//     current = 0;
//   }
//   console.log("The NEW current kitty is " + current);
//   setTimeout(moveKitties, 2000);
// } else {
//   kitties[current].classList.remove("exit");

// setTimeout(moveKitties, 2000);
// setTimeout(moveKitties, 2000);

// kitties[current].classList.add("onscreen");

//first approach
// kitties[current].addEventListener("transitioned", function fn(e) {
//   e.target.classList.remove("exit");
//   e.target.removeEventListener("transitionend", fn);
// });

// current++;
// if (current >= kitties.length) {
//   current = 0;
// }
// //add onscreen class to the next one
// console.log("The NEW current kitty is " + current);

// setTimeout(moveKitties, 2000);
