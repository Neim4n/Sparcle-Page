const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1,
    spaceBetween: 100,
});
/*=========Scroll Animation==========*/
const animItems = document.querySelectorAll("._anim-items");
window.addEventListener("scroll", animOnScroll);

function animOnScroll(params) {
    colorHeader();
    for (let index = 0; index < animItems.length; index++) {
        const animItem = animItems[index];
        const animItemHeight = animItem.offsetHeight;
        const animItemOffset = offset(animItem).top;
        const animStart = 4;

        let animItemPoint = window.innerHeight - animItemHeight / animStart;
        if (animItemHeight > window.innerHeight) {
            animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }
        if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
            animItem.classList.add("_active");
        } else {
            if (!animItem.classList.contains('_anim-no-hide')) {
                animItem.classList.remove("_active");
            }
        }
    }
}

let headerContainer = document.querySelector(".header__container")
let headerButton = document.querySelector(".header__button").querySelector("a");
let boxes = document.querySelector(".boxes");

function colorHeader() {
    if (pageYOffset > boxes.offsetTop) {
        headerContainer.classList.add('dark');
        headerButton.classList.remove("white");
        headerButton.classList.add("blue");
    } else {
        headerContainer.classList.remove('dark');
        headerButton.classList.add("white");
        headerButton.classList.remove("blue");
    }
}

function offset(el) {
    const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
        top: rect.top + scrollTop, left: rect.left + scrollLeft
    }
}

animOnScroll();
/*=========Parallax==========*/
let parallaxItems = document.querySelectorAll('.parallax-item');
window.addEventListener('mousemove', function (e) {
    Array.from(parallaxItems).forEach(item => {
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;
        item.style.transform = `translate(-${x * item.dataset.parallaxValueX}px,-${y * item.dataset.parallaxValueY}px)`;
    })
});

/*=========BurgerMenu==========*/
let header = document.querySelector(".header");
let body = document.body
header.addEventListener("click", headerClickHandler)

function headerClickHandler(e) {
    if (e.target.closest(".header__burger-menu")) {
        e.preventDefault()
        header.classList.toggle("active");
        body.classList.toggle("lock")
    } else if (e.target.closest(".header__menu-item")) {
        header.classList.remove("active");
        body.classList.remove("lock")
    } else if (!e.target.closest(".header__menu") && header.classList.contains("active")) {
        header.classList.remove("active");
        body.classList.remove("lock")
    }
}

/*=========Book======================*/
let categoriesOption = {
    residential: {
        name: "Residential",
        max: 10,
        min: 1,
        changedValue: 1,
        getTime: function (values) {
            return Math.round(values[0] + values[1] * 0.5)
        },
        getIncludes: function (values) {
            return (values[0] > 0 ? values[0] + " bedrooms" : "") + (values[0] > 0 && values[1] > 0 ? ", " : "") + (values[1] > 0 ? values[1] + " bathrooms" : "")
        },
        getSubTotal: function (values) {
            return (values[0] * 25 + values[1] * 15);
        }
    },
    commercial: {
        name: "Commercial",
        max: 1000,
        min: 50,
        changedValue: 10,
        getTime: function (values) {
            return Math.round(values[0] * 0.04)
        },
        getIncludes: function (values) {
            return (values[0] > 0 ? values[0] + " square meters" : "");
        },
        getSubTotal: function (values) {
            return Math.round(values[0] * 1.15);
        }
    }
}
let category = categoriesOption.residential;
let book = document.querySelector(".book");
let bookForm = document.forms.book;

/*------Submit event---------*/
bookForm.addEventListener("submit", formSubmitHandler)

function formSubmitHandler(e) {
    e.preventDefault();
    let name = bookForm.elements['name'].value;
    let phone = bookForm.elements['phone'].value;
    let email = bookForm.elements['email'].value;
    if (name !== "" && phone !== "" && validateEmail(email)) {
        bookForm.classList.add("sent");
        setTimeout(() => bookForm.classList.remove("sent"), 2000)
    } else {
        bookForm.classList.add("error");
        setTimeout(() => bookForm.classList.remove("error"), 700)
        bookForm.elements['name'].value = "";
        bookForm.elements['phone'].value = "";
        bookForm.elements['email'].value = "";
    }
}

// Validate email
function validateEmail(email) {
    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(String(email).toLowerCase());
}


/*------Click event---------*/
book.addEventListener("click", bookClickHandler)

function bookClickHandler(e) {
    if (e.target.closest(".decrease") || e.target.closest(".increase")) {
        e.preventDefault()
        let counter = e.target.parentElement;
        let type = e.target.classList[0];
        changeCounterValue(counter, type)
        updateBookForm();
    }
    if (e.target.closest(".button")) {
        e.preventDefault();
        groupButtonHandler(e.target);
        updateCounters();
        updateBookForm();
    }
}

/*------Input event---------*/
book.addEventListener("input", bookChangeHandler)

function bookChangeHandler(e) {
    if (e.target.closest(".counter")) {
        isRightNumberInput(e.target);
        updateBookForm();
    }
    if (e.target.closest(".form__input")) {
        inputsHandler(e);
    }
}

/*------Counters---------*/
function changeCounterValue(counter, type) {
    let value = +counter.querySelector(".counter").value;
    if (type === "increase") {
        counter.querySelector(".counter").value = value + category.changedValue <= category.max ? value + category.changedValue : value;
    } else if (type === "decrease") {
        counter.querySelector(".counter").value = value - category.changedValue >= category.min ? value - category.changedValue : value;
    }
}

function updateCounters() {
    Array.from(book.querySelectorAll(".counter")).forEach(e => {
        e.closest(".form-item").remove();
    });
    book.querySelector(".form-item").insertAdjacentHTML("afterend", countersTemplate());
}

function countersTemplate() {
    let category = book.querySelector(".button.orange").textContent;
    if (category === "Residential") {
        return `<div class="form-item form__number-bedrooms">
                            <span class="item-title">Number of bedrooms</span>
                            <div class="form-counter">
                                <a href="#" class="decrease"></a>
                                <input type="number" class="counter" value="4" min="0" max="10"/>
                                <a href="#" class="increase"></a>
                            </div>
                 </div>
                 <div class=" form-item form__number-bathrooms">
                            <span class="item-title">Number of bathrooms</span>
                            <div class="form-counter">
                                <a href="#" class="decrease"></a>
                                <input type="number" class="counter" value="2" min="0" max="10"/>
                                <a href="#" class="increase"></a>
                            </div>
                 </div>`
    } else if (category === "Commercial") {
        return `    <div class="form-item form__number-square-meters">
                            <span class="item-title">Number of square meters</span>
                            <div class="form-counter">
                                <a href="#" class="decrease"></a>
                                <input type="number" class="counter" value="100" min="100" max="1000"/>
                                <a href="#" class="increase"></a>
                            </div>
                        </div>`
    }
}

function isRightNumberInput(e) {
    if (e.value > category.max) e.value = category.max;
    if (e.value < category.min) e.value = category.min;
}

/*------BookForm---------*/
function inputsHandler(e) {
    let inputItem = e.target.closest(".inputs-item");
    if (e.target.value.length !== 0) {
        inputItem.classList.add("focused")
    } else {
        inputItem.classList.remove("focused")
    }
}

function updateBookForm() {
    let values = Array.from(document.querySelectorAll(".counter")).map(e => +e.value);
    document.querySelector(".form-includes").innerHTML = `${category.name} Cleaning - <span class="includes">${category.getIncludes(values)}</span>`;
    document.querySelector(".form-title").innerHTML = `Subtotal <span class="cost">${category.getSubTotal(values).toFixed(2).replace(".", ",")}$</span>`;
    document.querySelector(".form-time").innerHTML = `${category.name} Cleaning - <span class="time">${category.getTime(values)} hours</span>`;
}

/*------Button Group---------*/
function groupButtonHandler(e) {
    let groupButton = Array.from(e.closest(".group__button").querySelectorAll(".button"));
    let clickedButton = e.closest(".button");
    category = categoriesOption[clickedButton.textContent.toLowerCase()];
    groupButton.forEach((button) => {
        button === clickedButton ? (button.classList.add("orange"), button.classList.remove("blue")) : (button.classList.remove("orange"), button.classList.add("blue"))
    })
}