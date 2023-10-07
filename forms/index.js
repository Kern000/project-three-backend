const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createRegisterForm = () => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.required(),
                validators.regexp(/^[a-zA-Z0-9._%+ -!@*()^#]+$/)
            ]
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.email()]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.required(),
                validators.regexp(/^[a-zA-Z0-9._%+ -!@*()^#]+$/)
            ]
        }),
        'passwordConfirmation': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
};


const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.maxlength(320),
                validators.email(),
                validators.required()
            ]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.required(),
                validators.regexp(/^[a-zA-Z0-9._%+ -!@*()^#]+$/)
            ]
        }),
    })
};

const createProductForm = (post_category=[], genres=[]) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.minlength(0),
                validators.required(),
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'price': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.regexp(/^[a-zA-Z0-9._%+ -()!'"?@]+$/)]
        }),
        'stock': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.integer()]
        }),
        'post_category_id': fields.string({
            label:'Post Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: post_category,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'genres': fields.string({
            label:'Genres',
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: genres,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'chapter_content': fields.string({
            required: false,
            widget: widgets.textarea({
                rows:20,
                cols:40
            }),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -()!'"?@\s]+$/),
                validators.maxlength(100000)
            ]
        }),
        'image_url': fields.string({
            widget: widgets.hidden()
        }),
        'thumbnail_url': fields.string({
            widget: widgets.hidden()
        })
    })
};


const createSearchForm = (post_category=[], genres=[]) => {
    return forms.create({
        'name': fields.string({
            label: "Name of work",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'user': fields.string({
            label: "Creator name",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@]+$/)
            ]
        }),
        'min_price': fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()]
        }),
        'max_price': fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()] 
        }),
        'post_category_id': fields.string({
            label:'Post Category',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: post_category,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'genres': fields.string({
            label: 'Genres',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: genres,
            cssClasses: {
                label: ['form-label']
            }
        })
    })
};


const createUserSearchForm = () => {
    return forms.create({
        'id': fields.number({
            label: "User Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'name': fields.string({
            label: "Username",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'email': fields.string({
            label: "Email address",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@]+$/)
            ]
        })
    })
};

const createUserProductsSearchForm = (post_category=[], genres=[]) => {
    return forms.create({
        'name': fields.string({
            label: "Name of work",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'min_price': fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()]
        }),
        'max_price': fields.number({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[validators.min(0), validators.integer()] 
        }),
        'post_category_id': fields.string({
            label:'Post Category',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: post_category,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'genres': fields.string({
            label: 'Genres',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: genres,
            cssClasses: {
                label: ['form-label']
            }
        })
    })
};


const createCartSearchForm = () => {
    return forms.create({
        'cart_id': fields.number({
            label: "Cart Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'user_id': fields.string({
            label: "User Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        })
    })
};

const createOrderSearchForm = () => {
    return forms.create({
        'order_id': fields.number({
            label: "Order Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'user_id': fields.string({
            label: "User Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'product_id': fields.string({
            label: "Product Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'seller_id': fields.string({
            label: "Seller Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        }),
        'fulfilment': fields.string({
            label: "Fulfilmment",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators:[
                validators.regexp(/^[a-zA-Z0-9._%+ -!'"?@()]+$/)
            ]
        })
    })
};

module.exports = { bootstrapField, createProductForm, createLoginForm, createRegisterForm, createSearchForm, createUserSearchForm, createUserProductsSearchForm, createCartSearchForm, createOrderSearchForm };

